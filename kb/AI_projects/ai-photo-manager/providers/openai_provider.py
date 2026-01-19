import base64
import json
import os
from typing import Dict, List, Tuple
from openai import OpenAI
from .base import AIProvider

class OpenAIProvider(AIProvider):
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is missing")
        self.client = OpenAI(api_key=api_key)

    def caption_image(self, image_bytes: bytes) -> str:
        return self._caption_only(image_bytes)

    def caption_and_tags(self, image_bytes: bytes) -> Tuple[str, Dict[str, int]]:
        b64 = base64.b64encode(image_bytes).decode("utf-8")
        prompt = (
            "Return JSON with keys: caption (string), has_people, has_faces, "
            "has_text, is_indoor, is_outdoor, is_document, is_screenshot. "
            "Use true/false for flags. Keep caption concise but specific."
        )
        try:
            resp = self.client.responses.create(
                model="gpt-4.1-mini",
                response_format={"type": "json_object"},
                input=[{
                    "role": "user",
                    "content": [
                        {"type": "input_text", "text": prompt},
                        {"type": "input_image", "image_url": f"data:image/jpeg;base64,{b64}"},
                    ],
                }],
            )
            data = json.loads(resp.output_text or "{}")
            caption = (data.get("caption") or "").strip()
            tags = {
                "has_people": int(bool(data.get("has_people"))),
                "has_faces": int(bool(data.get("has_faces"))),
                "has_text": int(bool(data.get("has_text"))),
                "is_indoor": int(bool(data.get("is_indoor"))),
                "is_outdoor": int(bool(data.get("is_outdoor"))),
                "is_document": int(bool(data.get("is_document"))),
                "is_screenshot": int(bool(data.get("is_screenshot"))),
            }
            if not caption:
                caption = self._caption_only(image_bytes)
            return caption, tags
        except Exception:
            caption = self._caption_only(image_bytes)
            return caption, self._tags_from_caption(caption)

    def _caption_only(self, image_bytes: bytes) -> str:
        b64 = base64.b64encode(image_bytes).decode("utf-8")

        resp = self.client.responses.create(
            model="gpt-4.1-mini",
            input=[{
                "role": "user",
                "content": [
                    {"type": "input_text", "text": "Describe this image for photo search. Be concise but specific."},
                    {"type": "input_image", "image_url": f"data:image/jpeg;base64,{b64}"},
                ],
            }],
        )

        return resp.output_text.strip()

    def embed_text(self, text: str) -> List[float]:
        emb = self.client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return emb.data[0].embedding
