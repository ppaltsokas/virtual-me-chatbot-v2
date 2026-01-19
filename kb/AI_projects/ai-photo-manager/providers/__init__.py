import os
from .openai_provider import OpenAIProvider
from .gemini_provider import GeminiProvider

def get_provider():
    name = (os.getenv("AI_PROVIDER") or "openai").lower()

    if name == "openai":
        return OpenAIProvider()
    if name == "gemini":
        return GeminiProvider()

    raise ValueError(f"Unknown AI_PROVIDER: {name}")
