from __future__ import annotations

import copy
import json
import os
import re
import time
from typing import Any

import google.generativeai as genai
import gradio as gr
import pandas as pd
import requests
from dotenv import load_dotenv
from google.generativeai import types as genai_types
from google.generativeai.types import HarmBlockThreshold, HarmCategory

# --- Small helper to build a Gemini safety setting dict. --- 
def _make_safety_setting(
    category: HarmCategory, threshold: HarmBlockThreshold
) -> genai_types.SafetySettingDict:
    return genai_types.SafetySettingDict(
        category=category,
        threshold=threshold,
    )

# --- Logging that is robust to weird Unicode / encoding, so the logs don’t crash the app.
def _safe_log(*parts: Any) -> None:
    try:
        message = " ".join(str(p) for p in parts)
        print(message.encode("utf-8", errors="ignore").decode("utf-8"))
    except Exception:
        pass

# --- builds a list of safety settings which disable blocking (BLOCK_NONE) for hate, harassment, sexual, dangerous content, because GAIA questions can be weird.
def _build_safety_settings() -> list[genai_types.SafetySettingDict]:
    desired = [
        "HARM_CATEGORY_HATE_SPEECH",
        "HARM_CATEGORY_HARASSMENT",
        "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "HARM_CATEGORY_DANGEROUS_CONTENT",
    ]
    settings: list[genai_types.SafetySettingDict] = []
    for name in desired:
        category = getattr(HarmCategory, name, None)
        if category is None:
            continue
        settings.append(_make_safety_setting(category, HarmBlockThreshold.BLOCK_NONE))
    return settings

from tools import (
    AudioTranscriptionTool,
    CodeExecutionTool,
    FileTool,
    ImageTool,
    MathTool,
    TableTool,
    TextReversalTool,
    VideoTool,
    WebSearchTool,
    WikipediaTool,
    WebpageTool,
    PythonInterpreterTool,
)

load_dotenv()

def extract_youtube_url(text):
    match = re.search(r'(https?://www\.youtube\.com/watch\?v=[\w-]+)', text)
    return match.group(1) if match else None

# --- Constants ---
DEFAULT_API_URL = "https://agents-course-unit4-scoring.hf.space"

# --- Basic Agent Definition ---


class GeminiLLM:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise EnvironmentError("GOOGLE_API_KEY or GEMINI_API_KEY must be configured.")
        genai.configure(api_key=api_key)

        supported_models = self._list_supported_models()
        if not supported_models:
            raise RuntimeError("Unable to retrieve Gemini model list. Check API key permissions.")

        self.model_name = self._pick_model_name(
            preferred=[
                os.getenv("GEMINI_MODEL"),
                "models/gemini-2.5-flash",
                "models/gemini-2.5-flash-preview-05-20",
                "models/gemini-flash-latest",
                "models/gemini-2.5-pro",
                "models/gemini-2.5-pro-preview-05-06",
                "models/gemini-pro-latest",
                "models/gemini-2.0-flash",
            ],
            available=supported_models,
        )
        self.model = genai.GenerativeModel(self.model_name)

        self.vision_model_name = self._pick_model_name(
            preferred=[
                os.getenv("GEMINI_IMAGE_MODEL"),
                self.model_name,
                "models/gemini-2.5-flash-image",
                "models/gemini-2.5-flash-image-preview",
                "models/gemini-2.5-flash-lite",
                "models/gemini-2.5-flash",
            ],
            available=supported_models,
            allow_fallback_to_text=True,
        )
        self.vision_model = (
            self.model if self.vision_model_name == self.model_name else genai.GenerativeModel(self.vision_model_name)
        )
        self.safety_settings = _build_safety_settings()

    def _list_supported_models(self) -> list[str]:
        try:
            models = genai.list_models()
        except Exception as exc:
            raise RuntimeError(f"Failed to list Gemini models: {exc}") from exc

        names: list[str] = []
        for model in models:
            if "generateContent" in getattr(model, "supported_generation_methods", []):
                names.append(model.name)
        return names

    def _pick_model_name(
        self,
        *,
        preferred: list[str | None],
        available: list[str],
        allow_fallback_to_text: bool = False,
    ) -> str:
        normalized_available = {name: name for name in available}
        # Some APIs return names without the `models/` prefix. Capture variants.
        for name in available:
            if name.startswith("models/"):
                normalized_available[name.split("models/")[-1]] = name
            else:
                normalized_available[f"models/{name}"] = name

        for candidate in preferred:
            if not candidate:
                continue
            if candidate in normalized_available:
                return normalized_available[candidate]

        if allow_fallback_to_text and self.model_name:
            return self.model_name

        # fallback to first available model
        if available:
            return available[0]
        raise RuntimeError("No suitable Gemini models available.")

    def generate(
        self,
        prompt: str,
        *,
        system_instruction: str | None = None,
        temperature: float = 0.0,
        max_tokens: int = 2048,
        retries: int = 2,
    ) -> str:
        full_prompt = prompt if not system_instruction else f"{system_instruction.strip()}\n\n{prompt.strip()}"
        last_error: Exception | None = None

        safety_settings = copy.deepcopy(self.safety_settings)

        for attempt in range(retries + 1):
            try:
                # Increase max_tokens on retry if we hit MAX_TOKENS
                current_max_tokens = max_tokens * (2 ** attempt) if attempt > 0 and "MAX_TOKENS" in str(last_error) else max_tokens
                current_max_tokens = min(current_max_tokens, 8192)  # Cap at 8k
                
                response = self.model.generate_content(
                    contents=full_prompt,
                    generation_config=genai_types.GenerationConfig(
                        temperature=temperature,
                        max_output_tokens=current_max_tokens,
                    ),
                    safety_settings=safety_settings,
                )

                text = self._extract_text(response)
                if text:
                    return text
                finish_reasons = [
                    getattr(candidate, "finish_reason", None)
                    for candidate in getattr(response, "candidates", [])
                ]
                # If MAX_TOKENS, try with higher limit
                if any("MAX_TOKENS" in str(r) or r == 2 for r in finish_reasons if r):
                    if attempt < retries:
                        last_error = ValueError(f"MAX_TOKENS hit, retrying with higher limit")
                        continue
                raise ValueError(f"Gemini returned no text. Finish reasons: {finish_reasons}")
            except Exception as exc:
                # Some models reject certain safety settings; retry once without them.
                if safety_settings and "HARM_CATEGORY" in str(exc):
                    safety_settings = None
                    last_error = exc
                    continue
                # Handle MAX_TOKENS by retrying with higher limit
                if "MAX_TOKENS" in str(exc) or "FinishReason.MAX_TOKENS" in str(exc):
                    if attempt < retries:
                        last_error = exc
                        time.sleep(1)
                        continue
                last_error = exc
                if attempt == retries:
                    raise
                time.sleep(2 ** attempt)

        raise last_error or RuntimeError("Gemini generation failed.")

    @staticmethod
    def _extract_text(response: Any) -> str:
        parts: list[str] = []
        text = ""
        try:
            text = response.text  # type: ignore[attr-defined]
        except Exception:
            text = ""
        if text:
            parts.append(text)
        for candidate in getattr(response, "candidates", []):
            candidate_text = ""
            if hasattr(candidate, "content") and getattr(candidate.content, "parts", None):
                for part in candidate.content.parts:
                    try:
                        value = part.text  # type: ignore[attr-defined]
                    except Exception:
                        value = ""
                    if value:
                        candidate_text += value
            if candidate_text:
                stripped = candidate_text.strip()
                if stripped and stripped not in parts:
                    parts.append(stripped)
        return "\n".join(p.strip() for p in parts if p.strip()).strip()


class GeminiAgent:
    def __init__(self):
        self.llm = GeminiLLM()

        # tools
        self.search_tool = WebSearchTool()
        self.file_tool = FileTool()
        self.image_tool = ImageTool(gemini_model=self.llm.vision_model)
        self.audio_tool = AudioTranscriptionTool()
        self.code_tool = CodeExecutionTool()
        self.reverse_tool = TextReversalTool()
        self.math_tool = MathTool()
        self.table_tool = TableTool()
        self.video_tool = VideoTool()
        try:
            self.wikipedia_tool = WikipediaTool()
        except Exception:
            self.wikipedia_tool = None
        try:
            self.webpage_tool = WebpageTool()
        except Exception:
            self.webpage_tool = None
        self.python_interpreter = PythonInterpreterTool()
        self.tool_meta = {
            "math_tool": "Evaluate or solve math expressions/equations. Example: '2+2' or 'x^2 + 5*x + 6 = 0'",
            "web_search_tool": "Search the web using Brave Search API. Returns top ranked snippets. Use for: current events, specific facts, names, dates, recent information. Example: 'Nobel Prize winners 2023'",
            "wikipedia_tool": "Search Wikipedia articles and retrieve page content. Use for: factual information, biographies, historical events, scientific concepts. Example: 'Albert Einstein' or 'World War 2'",
            "webpage_tool": "Visit and extract text content from a specific webpage URL. Use when you have a URL from search results. Example: 'https://example.com/article'",
            "text_reversal_tool": "Reverse a string that is intentionally backwards. Use when question starts with '.' or looks reversed.",
            "image_tool": "Describe an attached image file using Gemini vision. Use when an image file is provided and contains visual information needed to answer.",
            "audio_tool": "Transcribe an attached audio file using Whisper. Use when an audio file is provided and contains spoken information.",
            "code_tool": "Execute an attached Python file and return stdout/stderr. Use only when a Python file is attached.",
            "python_interpreter": """Write and execute Python code dynamically. Use for:
- Complex calculations: 'result = sum(range(1, 101))'
- Data processing: Parse text, filter lists, extract information
- String manipulation: Split, join, regex operations
- List operations: Filter, map, sort, count
- Table/data analysis: Process CSV data, calculate statistics
Code state persists between calls (variables remain available).
Example: 'items = ["apple", "banana", "cherry"]; filtered = [x for x in items if "a" in x]; print(", ".join(filtered))'""",
            "table_tool": "Inspect an attached CSV/XLS/XLSX table and surface relevant rows/aggregations. Use for spreadsheet analysis, filtering rows, calculating totals.",
            "file_tool": "Preview an attached CSV/XLS/XLSX file (first rows). Use for quick file inspection.",
            "video_tool": "Download a YouTube video audio track and transcribe it. Use when question mentions a YouTube URL or video.",
            "none": "Do not call a tool; reason directly toward the final answer using your knowledge.",
        }
        # Filter out tools that failed to initialize
        available_tools = {k: v for k, v in self.tool_meta.items() if k != "none"}
        if self.wikipedia_tool is None:
            available_tools.pop("wikipedia_tool", None)
        if self.webpage_tool is None:
            available_tools.pop("webpage_tool", None)
        self.tool_meta = {**available_tools, "none": "Do not call a tool; reason directly toward the final answer."}
        self.valid_actions = sorted(set(self.tool_meta.keys()) | {"final"})
        self.max_reasoning_steps = int(os.getenv("AGENT_MAX_REASONING_STEPS", "10"))  # Increased from 8 to 10

    # ---------- robust Gemini helper ----------
    def ask_model(self, question: str, context: str = "", *, retries: int = 2) -> str:
        prompt = f"""You are answering a GAIA benchmark question. Provide ONLY the direct answer - no explanations, no sentences, just the answer itself.

Rules:
- Number → ONLY the number (e.g., "42")
- Name → ONLY the name (e.g., "Einstein")
- List → ONLY comma-separated (e.g., "apple, banana, cherry")
- Location → ONLY the location (e.g., "Paris")
- Date → ONLY the date (e.g., "2023")
- NO "The answer is", NO explanations, NO sentences

Context:
{context}

Question:
{question}

Answer (ONLY the answer, nothing else):"""
        # Truncate context if too long to avoid MAX_TOKENS
        max_context_length = 4000
        if len(context) > max_context_length:
            context = context[-max_context_length:] + "\n[Earlier context truncated...]"
        answer = self.llm.generate(prompt, temperature=0.0, max_tokens=256, retries=retries)
        # Extract simple answer from verbose response
        return self._extract_simple_answer(answer)
    
    @staticmethod
    def _extract_simple_answer(text: str) -> str:
        """Extract the simple answer from a potentially verbose response."""
        import re
        text = text.strip()
        if not text:
            return text
        
        # Remove common error/explanation prefixes
        error_prefixes = [
            "I am unable to",
            "I cannot",
            "I apologize",
            "ERROR:",
            "Unable to",
            "Cannot",
        ]
        for prefix in error_prefixes:
            if text.lower().startswith(prefix.lower()):
                # This is an error message, return as is but simplified
                return text.split('.')[0].strip()
        
        # If it's a simple list (comma-separated), return as is
        if ',' in text and len(text) < 200:
            # Check if it looks like a list
            parts = [p.strip() for p in text.split(',')]
            if len(parts) > 1 and all(len(p) < 30 for p in parts):
                return text
        
        # If it's already short and simple (no sentence endings), return as is
        if len(text) < 50 and not any(punct in text for punct in ['.', '!', '?']):
            return text
        
        # Try to extract numbers (for numeric answers)
        numbers = re.findall(r'\b\d+(?:\.\d+)?\b', text)  # Also match decimals
        if numbers:
            # If text is short and contains numbers, likely the answer
            if len(text) < 150:
                # Take the first number found (or last if it's clearly the result)
                # If text ends with a number, prefer that
                last_number = numbers[-1]
                if text.strip().endswith(last_number) or text.strip().endswith(last_number + '.'):
                    return last_number
                return numbers[0]
        
        # Extract first sentence or first line
        lines = text.split('\n')
        first_line = lines[0].strip()
        
        # Remove common prefixes
        prefixes = [
            "The answer is",
            "Answer:",
            "The result is",
            "Result:",
            "It is",
            "It's",
            "I believe",
            "Based on",
            "The highest number",
            "The answer",
        ]
        for prefix in prefixes:
            if first_line.lower().startswith(prefix.lower()):
                first_line = first_line[len(prefix):].strip()
                # Remove colon, comma, or period if present
                first_line = first_line.lstrip(':.,').strip()
                break
        
        # Take first sentence only (up to first period/exclamation/question mark)
        sentences = re.split(r'[.!?]', first_line)
        answer = sentences[0].strip()
        
        # If answer contains "is" or "are", try to extract what comes after
        if ' is ' in answer.lower() or ' are ' in answer.lower():
            match = re.search(r'(?:is|are)\s+([^.,!?]+)', answer, re.IGNORECASE)
            if match:
                answer = match.group(1).strip()
        
        # If answer is still too long, try to extract key info
        if len(answer) > 100:
            # Look for patterns in parentheses
            paren_match = re.search(r'\(([^)]+)\)', answer)
            if paren_match:
                answer = paren_match.group(1).strip()
            else:
                # Just take first 50 chars
                answer = answer[:50].strip()
        
        return answer

    def _build_reasoning_prompt(self, question: str, history: list[dict[str, str]], env: dict[str, Any]) -> str:
        tool_lines = "\n".join(
            f"- {name}: {desc}"
            for name, desc in self.tool_meta.items()
            if name != "none"
        )
        history_lines: list[str] = []
        for idx, entry in enumerate(history, start=1):
            thought = entry.get("thought", "").strip()
            action = entry.get("action", "").strip()
            tool_input = entry.get("input", "").strip()
            observation = entry.get("observation", "").strip()
            if thought:
                history_lines.append(f"Step {idx} Thought: {thought}")
            if action:
                if tool_input:
                    history_lines.append(f"Step {idx} Action: {action} (input: {tool_input})")
                else:
                    history_lines.append(f"Step {idx} Action: {action}")
            if observation:
                history_lines.append(f"Step {idx} Observation: {observation}")
        history_text = "\n".join(history_lines) if history_lines else "No actions taken yet."
        attachment_text = (
            f"Yes (path: {env.get('file_path')}, extension: {env.get('file_ext') or 'unknown'})"
            if env.get("file_path")
            else "No"
        )
        valid_actions = ", ".join(self.valid_actions)
        
        # Determine if this is the first step (planning phase)
        is_first_step = len(history) == 0 or (len(history) == 1 and history[0].get("action") == "context")
        
        planning_section = ""
        if is_first_step:
            planning_section = """
PLANNING PHASE (First Step):
1. Analyze the question: What information do I need?
2. Identify what tools might help
3. Plan your approach step-by-step
4. Start gathering facts

Example planning:
- Question asks for a number → I'll need to search or calculate
- Question mentions a file → I'll need to analyze the attachment
- Question asks for a list → I'll need to search and possibly filter/process results
"""
        
        examples_section = """
EXAMPLES OF GOOD REASONING:

Example 1 - Simple search:
{
  "thought": "I need to find information about X. Let me search the web.",
  "action": "web_search_tool",
  "input": "X information"
}

Example 2 - Using Python for calculations:
{
  "thought": "I need to calculate the sum of numbers 1 to 100. I'll use python_interpreter.",
  "action": "python_interpreter",
  "input": "result = sum(range(1, 101)); print(result)"
}

Example 3 - Processing a list:
{
  "thought": "I need to filter vegetables from a list. I'll use python_interpreter to process the list.",
  "action": "python_interpreter",
  "input": "items = ['milk', 'eggs', 'broccoli', 'carrots']; vegetables = [x for x in items if x in ['broccoli', 'carrots', 'lettuce']]; print(', '.join(sorted(vegetables)))"
}

Example 4 - Final answer:
{
  "thought": "I have gathered enough information. The answer is 42.",
  "action": "final",
  "answer": "42"
}
"""
        
        prompt = f"""You are GAIA Agent, an expert assistant that solves tasks systematically using available tools.

Your approach:
1. PLAN: Think step-by-step about what information you need
2. GATHER: Use tools to collect evidence (search, Wikipedia, visit webpages, analyze files, execute code)
3. REASON: Synthesize findings and determine if you need more information
4. ANSWER: Provide the final answer when you have enough information
5. NEVER GIVE UP: Always provide a final answer, even if uncertain

{planning_section}
Available tools:
{tool_lines}

Workflow Guidelines:
- Factual questions → web_search_tool or wikipedia_tool first
- Search results with URLs → webpage_tool to visit for detailed content
- Math expressions → math_tool (simple) or python_interpreter (complex)
- Data processing/filtering/lists → python_interpreter (write Python code)
- Files attached → Use appropriate tool: table_tool (spreadsheets), file_tool (preview), image_tool (images), audio_tool (audio), code_tool (Python files), video_tool (YouTube)
- Reversed text → text_reversal_tool
- When ready → action "final" with your answer

{examples_section}

CRITICAL ANSWER FORMAT:
- Number → ONLY the number: "42" not "The answer is 42"
- Name → ONLY the name: "Einstein" not "The answer is Einstein"
- List → ONLY comma-separated: "apple, banana, cherry" not "The list is: apple, banana, cherry"
- NO explanations, NO sentences, NO "The answer is..." - just the answer itself

Question: {question}
Attachment available: {attachment_text}
Task ID: {env.get('task_id') or 'None'}

Previous steps:
{history_text}

Respond with ONLY a JSON object (no other text):
{{
  "thought": "Your reasoning for this step",
  "action": "{valid_actions[0] if valid_actions else 'final'}",
  "input": "tool argument or empty string",
  "answer": "only include if action is 'final'"
}}"""
        return prompt

    def _parse_agent_action(self, text: str) -> dict[str, Any] | None:
        try:
            start = text.index("{")
            end = text.rindex("}") + 1
            snippet = text[start:end]
            data = json.loads(snippet)
            if isinstance(data, dict):
                return data
            return None
        except Exception:
            return None

    def _execute_tool(self, action: str, tool_input: str, env: dict[str, Any]) -> str:
        question = env.get("question", "")
        default_input = tool_input.strip() or question
        observations: list[str] = env.get("observations", [])

        try:
            if action == "math_tool":
                expr = default_input
                return (
                    self.math_tool.solve_equation(expr)
                    if "=" in expr
                    else self.math_tool.evaluate_expression(expr)
                )

            if action == "web_search_tool":
                try:
                    return self._search_and_summarize(default_input, question, observations)
                except Exception as search_error:
                    message = str(search_error).lower()
                    if any(keyword in message for keyword in ("202", "ratelimit", "rate limit", "too many requests", "429", "quota")):
                        # Return a message that won't be filtered out, but indicates we need to use knowledge
                        if observations:
                            context = "\n".join(obs for obs in observations if obs and "search" not in obs.lower()[:50])
                            if context:
                                fallback_answer = self.ask_model(question, context=context)
                                return f"Search unavailable. Based on available information: {fallback_answer}"
                        return "Search unavailable due to rate limits. Unable to find answer."
                    raise

            if action == "wikipedia_tool":
                if self.wikipedia_tool is None:
                    return "Wikipedia tool not available."
                # Input can be a query or a page title
                query = default_input
                # Try to get page directly first, then search if needed
                result = self.wikipedia_tool.search_and_get(query, max_results=1, sentences=15)
                return result

            if action == "webpage_tool":
                if self.webpage_tool is None:
                    return "Webpage tool not available."
                # Extract URL from input
                url = default_input.strip()
                if not url.startswith(("http://", "https://")):
                    # Try to extract URL from text
                    url_match = re.search(r"https?://[^\s]+", default_input)
                    if url_match:
                        url = url_match.group(0)
                    else:
                        return f"Invalid URL format: {default_input}"
                return self.webpage_tool.visit(url, max_length=8000)

            if action == "text_reversal_tool":
                return self.reverse_tool.reverse_text(default_input)

            if action == "image_tool":
                file_path = env.get("file_path")
                if not file_path:
                    return "Image tool requested but no attachment available."
                return self.image_tool.describe_image(file_path)

            if action == "audio_tool":
                file_path = env.get("file_path")
                if not file_path:
                    return "Audio tool requested but no attachment available."
                return self.audio_tool.transcribe_audio(file_path)

            if action == "code_tool":
                file_path = env.get("file_path")
                if not file_path:
                    return "Code tool requested but no attachment available."
                return self.code_tool.execute_python_file(file_path)

            if action == "python_interpreter":
                # Execute Python code dynamically - code is in tool_input
                code = default_input
                if not code or len(code.strip()) < 3:
                    return "No code provided to python_interpreter. Provide valid Python code."
                try:
                    result = self.python_interpreter.execute_code(code)
                    # If result is empty but no error, code might have set variables
                    if not result or result.strip() == "Code executed successfully (no output).":
                        # Try to extract any printed values or return the last expression
                        return "Code executed. Check if variables were set. Use print() to see results."
                    return result
                except Exception as e:
                    return f"Python execution error: {e}"

            if action == "table_tool":
                file_path = env.get("file_path")
                if not file_path:
                    return "Table tool requested but no attachment available."
                return self.table_tool.extract_insights(file_path, question)

            if action == "file_tool":
                file_path = env.get("file_path")
                if not file_path:
                    return "File tool requested but no attachment available."
                return self.file_tool.read_csv_or_excel(file_path)

            if action == "video_tool":
                url = self.video_tool.extract_youtube_url(default_input)
                if not url:
                    return "No valid YouTube URL found to transcribe."
                return self.video_tool.extract_transcript(url)

            if action == "none":
                return "No tool executed."

            return f"Unknown tool '{action}'."
        except Exception as exc:
            return f"Tool '{action}' failed: {exc}"

    def _search_and_summarize(self, query_hint: str, question: str, observations: list[str]) -> str:
        try:
            q_prompt = f"You need to search the web for:\n{query_hint}\nReturn a concise search query."
            search_query = self.llm.generate(q_prompt, temperature=0.0, max_tokens=40, retries=1)
        except Exception:
            search_query = query_hint

        results = self.search_tool.search(search_query, max_results=5)
        if not results:
            return f"No search results found for '{search_query}'. Try a different query or use wikipedia_tool."

        # Extract URLs from results for potential webpage visits
        urls = []
        for result in results[:3]:
            url_match = re.search(r"https?://[^\s\n]+", result)
            if url_match:
                urls.append(url_match.group(0))

        ranked = "\n-----\n".join(results[:3])
        url_hint = ""
        if urls:
            url_hint = f"\n\nNote: Found URLs in results. Consider using webpage_tool to visit: {', '.join(urls[:2])}"

        context = "\n".join(filter(None, observations + [f"Search results for '{search_query}':\n{ranked}"]))
        summary = self.ask_model(question, context=context)
        combined = f"Search query: {search_query}\nResults:\n{ranked}{url_hint}\n\nSummary:\n{summary}"
        return self._truncate(combined, limit=3000)

    @staticmethod
    def _truncate(text: str, limit: int = 3000) -> str:
        if len(text) <= limit:
            return text
        return text[:limit] + "... [truncated]"

    def _reason(self, question: str, env: dict[str, Any]) -> str:
        history: list[dict[str, str]] = []
        observations: list[str] = env.setdefault("observations", [])
        for note in env.get("initial_notes", []):
            history.append({"thought": "Initial context", "action": "context", "observation": note})
            observations.append(note)

        max_searches = int(os.getenv("AGENT_MAX_SEARCHES", "5"))  # Increased from 3 to 5
        search_count = 0
        
        # Initial planning: gather initial facts
        if not observations or len(observations) == 0:
            try:
                planning_prompt = f"""Analyze this question and plan your approach:

Question: {question}
Attachment: {env.get('file_path', 'None')}

What information do you need? What tools should you use? What's your step-by-step plan?

Respond with a brief planning thought (1-2 sentences):"""
                plan_thought = self.llm.generate(planning_prompt, temperature=0.1, max_tokens=150, retries=1)
                if plan_thought:
                    observations.append(f"Initial plan: {plan_thought.strip()}")
                    history.append({
                        "thought": plan_thought.strip(),
                        "action": "plan",
                        "observation": "Planning complete"
                    })
            except Exception:
                pass  # Continue even if planning fails

        for step in range(self.max_reasoning_steps):
            prompt = self._build_reasoning_prompt(question, history, env)
            try:
                # Truncate prompt if too long
                max_prompt_length = 8000
                if len(prompt) > max_prompt_length:
                    # Keep the question and recent history, truncate older observations
                    prompt_parts = prompt.split("Previous steps:")
                    if len(prompt_parts) > 1:
                        base = prompt_parts[0]
                        history_part = prompt_parts[1]
                        # Keep last 3000 chars of history
                        if len(history_part) > 3000:
                            history_part = "... [earlier steps truncated] ...\n" + history_part[-3000:]
                        prompt = base + "Previous steps:" + history_part
                
                decision_text = self.llm.generate(prompt, temperature=0.2, max_tokens=1024, retries=2)
            except Exception as exc:
                error_msg = str(exc)
                if "MAX_TOKENS" in error_msg or "FinishReason.MAX_TOKENS" in error_msg:
                    # Try with simplified prompt
                    simplified_prompt = f"""You are solving: {question}

Recent observations:
{chr(10).join(observations[-3:])}

Choose next action (JSON only):
{{"thought": "...", "action": "...", "input": "..."}}"""
                    try:
                        decision_text = self.llm.generate(simplified_prompt, temperature=0.2, max_tokens=2048, retries=1)
                    except Exception:
                        observations.append(f"LLM error after retry: {exc}")
                        break
                else:
                    observations.append(f"LLM error: {exc}")
                    break

            plan = self._parse_agent_action(decision_text)
            if not plan:
                observations.append(f"Unparsed LLM action: {decision_text}")
                history.append(
                    {
                        "thought": "Could not parse model response.",
                        "action": "none",
                        "observation": decision_text,
                    }
                )
                continue

            _safe_log(f"Reasoning step {step + 1}: {plan}")

            thought = plan.get("thought", "")
            action = (plan.get("action") or "").strip().lower()
            tool_input = plan.get("input", "")

            if action in {"final", "finish", "answer"}:
                answer = plan.get("answer") or tool_input or plan.get("final")
                if answer:
                    # Extract simple answer from potentially verbose response
                    simple_answer = self._extract_simple_answer(answer.strip())
                    return simple_answer
                observations.append("Final action received without answer.")
                continue

            if action in {"", "none"}:
                context = "\n".join(observations)
                return self.ask_model(question, context=context)

            if action == "web_search_tool":
                if search_count >= max_searches:
                    observation = "Search quota exceeded. Using existing knowledge to answer."
                    # Try to answer with what we have
                    if observations:
                        context = "\n".join(obs for obs in observations if obs and "quota" not in obs.lower())
                        fallback = self.ask_model(question, context=context)
                        return fallback.strip()
                else:
                    search_count += 1
                    observation = self._execute_tool(action, tool_input, env)
            else:
                observation = self._execute_tool(action, tool_input, env)
            if observation:
                _safe_log(f"Observation: {observation[:200]}")
            else:
                _safe_log("Observation: (empty)")
            history.append(
                {
                    "thought": thought,
                    "action": action,
                    "input": tool_input,
                    "observation": observation,
                }
            )
            if observation:
                observations.append(observation)

        # Fallback: synthesize answer from accumulated observations
        meaningless_phrases = (
            "No results",
            "unavailable",
            "not provided",
            "cannot",
            "quota exceeded",
            "error",
        )
        meaningful = [
            obs
            for obs in observations
            if obs and not any(phrase.lower() in obs.lower() for phrase in meaningless_phrases)
        ]
        if meaningful:
            fallback_context = "\n".join(meaningful[-5:])  # Use last 5 meaningful observations
            answer = self.ask_model(question, context=fallback_context)
            # Extract simple answer
            simple_answer = self._extract_simple_answer(answer.strip() if answer else "")
            return simple_answer if simple_answer else "Unable to determine answer from available information."
        return "Unable to determine answer from available information."

    def __call__(self, question: str, task_id: str | None = None) -> str:
        _safe_log(f"Question: {question[:60]}…")
        file_path, file_ext = self._download_attachment(task_id)

        env: dict[str, Any] = {
            "question": question,
            "task_id": task_id,
            "file_path": file_path,
            "file_ext": file_ext,
            "initial_notes": [],
            "observations": [],
        }
        if file_path:
            env["initial_notes"].append(
                f"Attachment saved to {file_path} (extension {file_ext or 'unknown'}). "
                "Use table_tool or file_tool for spreadsheets; audio_tool for sound; image_tool for pictures."
            )

        try:
            answer = self._reason(question, env)
            # Ensure we return a clean answer
            if answer and answer.strip():
                return answer.strip()
            # If empty, try one more time with a simple prompt
            _safe_log("Empty answer, retrying with simple prompt")
            simple_answer = self.ask_model(question)
            return simple_answer.strip() if simple_answer else "Unable to determine answer."
        except Exception as exc:
            _safe_log("Answering failed:", exc)
            error_str = str(exc)
            # If MAX_TOKENS, try with simplified prompt
            if "MAX_TOKENS" in error_str or "FinishReason" in error_str:
                try:
                    _safe_log("Retrying with simplified prompt due to token limit")
                    simple_answer = self.ask_model(question)
                    return simple_answer.strip() if simple_answer else f"ERROR: {exc}"
                except Exception:
                    return f"ERROR: {exc}"
            return f"ERROR: {exc}"

    def _download_attachment(self, task_id: str | None) -> tuple[str, str]:
        if not task_id:
            return "", ""

        url = f"https://agents-course-unit4-scoring.hf.space/files/{task_id}"
        os.makedirs("downloads", exist_ok=True)
        file_path = f"downloads/{task_id}"
        file_ext = ""

        try:
            response = requests.get(url, timeout=15)
            response.raise_for_status()

            content_type = response.headers.get("Content-Type", "")
            if "application/json" in content_type:
                try:
                    payload = response.json()
                    if isinstance(payload, dict) and payload.get("detail"):
                        _safe_log(f"Attachment unavailable for task {task_id}: {payload['detail']}")
                        return "", ""
                except Exception:
                    pass

            cd = response.headers.get("Content-Disposition", "")
            if "filename=" in cd:
                filename = cd.split("filename=")[-1].strip().strip('"')
                file_ext = os.path.splitext(filename)[-1].lower()
                file_path = f"{file_path}-{filename}"

            with open(file_path, "wb") as downloaded:
                downloaded.write(response.content)

            _safe_log(f"Downloaded file: {file_path}")
            return file_path, file_ext

        except Exception as exc:
            _safe_log("File download failed:", exc)
            return "", ""

    # ---------- web search helper ----------


def run_and_submit_all( profile: gr.OAuthProfile | None):
    """
    Fetches all questions, runs the GeminiAgent on them, submits all answers,
    and displays the results.
    """
    # --- Determine HF Space Runtime URL and Repo URL ---
    space_id = os.getenv("SPACE_ID") # Get the SPACE_ID for sending link to the code

    if profile:
        username= f"{profile.username}"
        _safe_log(f"User logged in: {username}")
    else:
        _safe_log("User not logged in.")
        return "Please Login to Hugging Face with the button.", None

    api_url = DEFAULT_API_URL
    questions_url = f"{api_url}/questions"
    submit_url = f"{api_url}/submit"

    # 1. Instantiate Agent ( modify this part to create your agent)
    # Note: We'll create agent once and reuse it, but each question gets fresh state
    try:
        agent = GeminiAgent()
    except Exception as e:
        _safe_log(f"Error instantiating agent: {e}")
        return f"Error initializing agent: {e}", None
    # In the case of an app running as a hugging Face space, this link points toward your codebase ( usefull for others so please keep it public)
    agent_code = f"https://huggingface.co/spaces/{space_id}/tree/main"
    _safe_log(agent_code)

    # 2. Fetch Questions
    _safe_log(f"Fetching questions from: {questions_url}")
    try:
        response = requests.get(questions_url, timeout=15)
        response.raise_for_status()
        questions_data = response.json()
        if not questions_data:
             _safe_log("Fetched questions list is empty.")
             return "Fetched questions list is empty or invalid format.", None
        _safe_log(f"Fetched {len(questions_data)} questions.")
    except requests.exceptions.RequestException as e:
        _safe_log(f"Error fetching questions: {e}")
        return f"Error fetching questions: {e}", None
    except requests.exceptions.JSONDecodeError as e:
         _safe_log(f"Error decoding JSON response from questions endpoint: {e}")
         _safe_log(f"Response text: {response.text[:500]}")
         return f"Error decoding server response for questions: {e}", None
    except Exception as e:
        _safe_log(f"An unexpected error occurred fetching questions: {e}")
        return f"An unexpected error occurred fetching questions: {e}", None

    # 3. Run your Agent
    results_log = []
    answers_payload = []
    _safe_log(f"Running agent on {len(questions_data)} questions...")
    for item in questions_data:
        task_id = item.get("task_id")
        question_text = item.get("question")
        if not task_id or question_text is None:
            _safe_log(f"Skipping item with missing task_id or question: {item}")
            continue
        try:
            _safe_log(f"Processing question {len(answers_payload) + 1}/{len(questions_data)}: {question_text[:80]}...")
            submitted_answer = agent(question_text, task_id=task_id)
            # Ensure answer is clean and simple
            if submitted_answer:
                submitted_answer = submitted_answer.strip()
                # Final cleanup - extract simple answer one more time
                submitted_answer = GeminiAgent._extract_simple_answer(submitted_answer)
            else:
                submitted_answer = "Unable to determine answer."
            answers_payload.append({"task_id": task_id, "submitted_answer": submitted_answer})
            results_log.append({"Task ID": task_id, "Question": question_text, "Submitted Answer": submitted_answer})
            _safe_log(f"Answer for task {task_id}: {submitted_answer[:100]}")
        except Exception as e:
             _safe_log(f"Error running agent on task {task_id}: {e}")
             error_answer = f"AGENT ERROR: {e}"
             answers_payload.append({"task_id": task_id, "submitted_answer": error_answer})
             results_log.append({"Task ID": task_id, "Question": question_text, "Submitted Answer": error_answer})

    if not answers_payload:
        _safe_log("Agent did not produce any answers to submit.")
        return "Agent did not produce any answers to submit.", pd.DataFrame(results_log)

    # 4. Prepare Submission
    submission_data = {"username": username.strip(), "agent_code": agent_code, "answers": answers_payload}
    status_update = f"Agent finished. Submitting {len(answers_payload)} answers for user '{username}'..."
    _safe_log(status_update)

    # 5. Submit
    _safe_log(f"Submitting {len(answers_payload)} answers to: {submit_url}")
    try:
        response = requests.post(submit_url, json=submission_data, timeout=60)
        response.raise_for_status()
        result_data = response.json()
        final_status = (
            f"Submission Successful!\n"
            f"User: {result_data.get('username')}\n"
            f"Overall Score: {result_data.get('score', 'N/A')}% "
            f"({result_data.get('correct_count', '?')}/{result_data.get('total_attempted', '?')} correct)\n"
            f"Message: {result_data.get('message', 'No message received.')}"
        )
        _safe_log("Submission successful.")
        results_df = pd.DataFrame(results_log)
        return final_status, results_df
    except requests.exceptions.HTTPError as e:
        error_detail = f"Server responded with status {e.response.status_code}."
        try:
            error_json = e.response.json()
            error_detail += f" Detail: {error_json.get('detail', e.response.text)}"
        except requests.exceptions.JSONDecodeError:
            error_detail += f" Response: {e.response.text[:500]}"
        status_message = f"Submission Failed: {error_detail}"
        _safe_log(status_message)
        results_df = pd.DataFrame(results_log)
        return status_message, results_df
    except requests.exceptions.Timeout:
        status_message = "Submission Failed: The request timed out."
        _safe_log(status_message)
        results_df = pd.DataFrame(results_log)
        return status_message, results_df
    except requests.exceptions.RequestException as e:
        status_message = f"Submission Failed: Network error - {e}"
        _safe_log(status_message)
        results_df = pd.DataFrame(results_log)
        return status_message, results_df
    except Exception as e:
        status_message = f"An unexpected error occurred during submission: {e}"
        _safe_log(status_message)
        results_df = pd.DataFrame(results_log)
        return status_message, results_df


# --- Build Gradio Interface using Blocks ---
with gr.Blocks() as demo:
    gr.Markdown("# Basic Agent Evaluation Runner")
    gr.Markdown(
        """
        **Instructions:**

        1.  Please clone this space, then modify the code to define your agent's logic, the tools, the necessary packages, etc ...
        2.  Log in to your Hugging Face account using the button below. This uses your HF username for submission.
        3.  Click 'Run Evaluation & Submit All Answers' to fetch questions, run your agent, submit answers, and see the score.

        ---
        **Disclaimers:**
        Once clicking on the "submit button, it can take quite some time ( this is the time for the agent to go through all the questions).
        This space provides a basic setup and is intentionally sub-optimal to encourage you to develop your own, more robust solution. For instance for the delay process of the submit button, a solution could be to cache the answers and submit in a seperate action or even to answer the questions in async.
        """
    )

    gr.LoginButton()

    run_button = gr.Button("Run Evaluation & Submit All Answers")

    status_output = gr.Textbox(label="Run Status / Submission Result", lines=5, interactive=False)
    # Removed max_rows=10 from DataFrame constructor
    results_table = gr.DataFrame(label="Questions and Agent Answers", wrap=True)

    run_button.click(
        fn=run_and_submit_all,
        outputs=[status_output, results_table]
    )

if __name__ == "__main__":
    _safe_log("\n" + "-"*30 + " App Starting " + "-"*30)
    # Check for SPACE_HOST and SPACE_ID at startup for information
    space_host_startup = os.getenv("SPACE_HOST")
    space_id_startup = os.getenv("SPACE_ID") # Get SPACE_ID at startup

    if space_host_startup:
        _safe_log(f"✅ SPACE_HOST found: {space_host_startup}")
        _safe_log(f"   Runtime URL should be: https://{space_host_startup}.hf.space")
    else:
        _safe_log("ℹ️  SPACE_HOST environment variable not found (running locally?).")

    if space_id_startup: # Print repo URLs if SPACE_ID is found
        _safe_log(f"✅ SPACE_ID found: {space_id_startup}")
        _safe_log(f"   Repo URL: https://huggingface.co/spaces/{space_id_startup}")
        _safe_log(f"   Repo Tree URL: https://huggingface.co/spaces/{space_id_startup}/tree/main")
    else:
        _safe_log("ℹ️  SPACE_ID environment variable not found (running locally?). Repo URL cannot be determined.")

    _safe_log("-"*(60 + len(" App Starting ")) + "\n")

    _safe_log("Launching Gradio Interface for Basic Agent Evaluation...")
    # demo.launch(debug=True, share=False)
    demo.launch(debug=True, share=True)  # share=True lets others test via a link
