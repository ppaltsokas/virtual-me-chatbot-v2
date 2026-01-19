# GAIA Agent Project

**Project:** GAIA Agent - Multi-Tool AI Agent for Complex Question Answering  
**Platform:** Hugging Face Spaces  
**Repository:** https://huggingface.co/spaces/ppaltsokas/ppaltsokas_GAIA_agent  
**Date:** 2024  
**Technologies:** Python, LangGraph, LangChain, OpenAI GPT-4o, Google Gemini, Gradio, FAISS, Whisper, yt-dlp

## Project Description

This project implements a sophisticated AI agent designed to answer complex questions from the GAIA (General AI Assistant) benchmark. The agent uses a multi-tool approach with LangGraph for orchestration, enabling it to handle diverse question types including mathematical problems, web searches, video transcriptions, code execution, and data analysis.

## Key Features

### Architecture
- **Framework:** LangGraph with StateGraph for agent orchestration
- **LLM:** OpenAI GPT-4o as the primary reasoning engine
- **Embeddings:** OpenAI text-embedding-3-small for vector search
- **Vector Store:** FAISS for efficient similarity search
- **UI:** Gradio with Hugging Face OAuth integration

### Tools & Capabilities

The agent includes a comprehensive set of tools organized in the `tools/` directory:

1. **Web Search Tool** (`web_search_tool.py`)
   - DuckDuckGo search integration
   - Web snippet extraction and summarization

2. **Wikipedia Tool** (`wikipedia_tool.py`)
   - Wikipedia article retrieval and summarization

3. **Video Tool** (`video_tool.py`)
   - YouTube video transcription using YouTube Transcript API
   - Fallback to Whisper for audio transcription when transcripts unavailable

4. **Audio Tool** (`audio_tool.py`)
   - Local audio file transcription using OpenAI Whisper

5. **Python Interpreter Tool** (`python_interpreter_tool.py`)
   - Safe Python code execution
   - Mathematical computation support

6. **Math Tool** (`math_tool.py`)
   - Symbolic mathematics using SymPy
   - Complex mathematical problem solving

7. **Image Tool** (`image_tool.py`)
   - Image analysis and processing
   - OCR and visual question answering

8. **File Tool** (`file_tool.py`)
   - File reading and processing
   - Excel/CSV data extraction

9. **Table Tool** (`table_tool.py`)
   - Table data analysis
   - Commutativity checking and data manipulation

10. **Code Execution Tool** (`code_execution_tool.py`)
    - Safe code execution with output capture

11. **Text Reversal Tool** (`text_reversal_tool.py`)
    - Text manipulation utilities

12. **QA Retriever** (`qa_retriever.py`)
    - Vector-based question answering
    - Semantic search over knowledge base

### Agent Workflow

1. **Question Classification:** Automatically classifies questions into categories (python, youtube, table, web)
2. **Tool Selection:** Dynamically selects appropriate tools based on question type
3. **Multi-Step Reasoning:** Uses LangGraph to orchestrate complex multi-step problem solving
4. **Answer Extraction:** Robustly extracts final answers from model responses
5. **Submission:** Integrates with GAIA API for automated answer submission

### Key Technical Details

- **Safety Settings:** Custom Gemini safety settings (BLOCK_NONE) to handle diverse GAIA questions
- **Error Handling:** Robust error handling for tool failures and edge cases
- **Logging:** Safe logging that handles Unicode and encoding issues
- **API Integration:** Full integration with GAIA evaluation API
- **Gradio Interface:** User-friendly web interface with OAuth authentication

## Project Structure

```
ppaltsokas_GAIA_agent/
├── app.py                 # Main Gradio application
├── gaia_agent.py          # Core agent implementation with LangGraph
├── api_integration.py     # GAIA API integration
├── run_single.py          # Single question testing script
├── requirements.txt       # Python dependencies
├── README.md             # Setup and usage instructions
├── tools/                # Tool implementations
│   ├── web_search_tool.py
│   ├── wikipedia_tool.py
│   ├── video_tool.py
│   ├── audio_tool.py
│   ├── python_interpreter_tool.py
│   ├── math_tool.py
│   ├── image_tool.py
│   ├── file_tool.py
│   ├── table_tool.py
│   ├── code_execution_tool.py
│   ├── text_reversal_tool.py
│   └── qa_retriever.py
└── PROJECT_SUMMARY.md    # This file
```

## Technologies Used

- **LangGraph:** Agent orchestration and state management
- **LangChain:** LLM integration and tool framework
- **OpenAI GPT-4o:** Primary reasoning model
- **Google Gemini:** Alternative model with custom safety settings
- **FAISS:** Vector similarity search
- **Gradio:** Web interface framework
- **Whisper:** Audio transcription
- **yt-dlp:** YouTube video downloading
- **SymPy:** Symbolic mathematics
- **Pandas:** Data manipulation
- **DuckDuckGo Search:** Web search capabilities

## Key Achievements

- Built a multi-tool AI agent capable of handling diverse question types
- Implemented robust tool orchestration using LangGraph
- Created comprehensive error handling and logging
- Integrated with GAIA benchmark evaluation system
- Developed user-friendly Gradio interface with authentication
- Optimized for both single-question testing and full evaluation runs

## Use Cases

- Answering complex questions from the GAIA benchmark
- Multi-step problem solving requiring multiple tools
- Mathematical computation and symbolic math
- Web research and information retrieval
- Video and audio transcription
- Code execution and data analysis
- Table manipulation and data extraction

## Setup Requirements

- Python virtual environment
- API keys: Google API Key, OpenAI API Key, Hugging Face Token, Brave API Key
- FFmpeg for audio/video processing
- All dependencies from requirements.txt

## Running the Project

- **Full Evaluation:** `python app.py` - Launches Gradio app for full 30-question run
- **Single Question Test:** `python run_single.py --question "..." --task-id 12345`
- **Local Development:** Requires all API keys configured in `.env` file

