import mimetypes
import os
from typing import Optional

import google.generativeai as genai
from google.generativeai import types as genai_types


class ImageTool:
    """
    Generates concise natural-language descriptions for images using Gemini.
    """

    def __init__(self, gemini_model: Optional[genai.GenerativeModel] = None):
        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        if gemini_model is None:
            if not api_key:
                raise EnvironmentError("GOOGLE_API_KEY or GEMINI_API_KEY must be set for ImageTool.")
            genai.configure(api_key=api_key)
            model_name = os.getenv("GEMINI_IMAGE_MODEL", "gemini-1.5-flash")
            gemini_model = genai.GenerativeModel(model_name)
        self.model = gemini_model

    def describe_image(self, image_path: str) -> str:
        try:
            mime_type = mimetypes.guess_type(image_path)[0] or "image/png"
            with open(image_path, "rb") as f:
                image_bytes = f.read()

            prompt = (
                "Describe the image succinctly, capturing key visual details that could help answer questions."
            )

            response = self.model.generate_content(
                [
                    genai_types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    prompt,
                ],
                generation_config=genai_types.GenerationConfig(
                    temperature=0.2,
                    max_output_tokens=256,
                ),
            )

            text = getattr(response, "text", "") or ""
            if not text and response.candidates:
                text = "".join(
                    getattr(part, "text", "")
                    for part in response.candidates[0].content.parts
                )
            return text.strip() if text else "No description generated."
        except Exception as e:
            return f"Image processing failed: {e}"