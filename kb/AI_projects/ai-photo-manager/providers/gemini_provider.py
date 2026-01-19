#Gemini Provider Skeleton (for later swap)
import os
from typing import List
from .base import AIProvider

class GeminiProvider(AIProvider):
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY is missing")
        try:
            from google import genai
            from google.genai import types
        except Exception as e:
            raise RuntimeError("google-genai is required for Gemini support.") from e

        self._types = types
        self.client = genai.Client(api_key=api_key)

    def caption_image(self, image_bytes: bytes) -> str:
        resp = self.client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[
                "Describe this image for photo search. Be concise but specific.",
                self._types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
            ],
        )
        return (resp.text or "").strip()

    def embed_text(self, text: str) -> List[float]:
        raise NotImplementedError("Implement Gemini text embeddings when you decide the embedding endpoint/model.")
