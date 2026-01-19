from abc import ABC, abstractmethod
from typing import Dict, List, Tuple

class AIProvider(ABC):
    @abstractmethod
    def caption_image(self, image_bytes: bytes) -> str:
        ...

    @abstractmethod
    def embed_text(self, text: str) -> List[float]:
        ...

    def embed_caption(self, caption: str) -> List[float]:
        return self.embed_text(caption)

    def caption_and_tags(self, image_bytes: bytes) -> Tuple[str, Dict[str, int]]:
        caption = self.caption_image(image_bytes)
        return caption, self._tags_from_caption(caption)

    def _tags_from_caption(self, caption: str) -> Dict[str, int]:
        text = (caption or "").lower()

        def has_any(words):
            return any(w in text for w in words)

        has_people = has_any([
            "person", "people", "man", "woman", "child", "boy", "girl", "baby",
            "face", "selfie", "portrait", "crowd", "group",
        ])
        has_faces = has_any(["face", "selfie", "portrait"])
        has_text = has_any([
            "text", "writing", "handwritten", "notes", "note", "document",
            "paper", "book", "page", "sign", "letter", "form", "invoice",
            "receipt", "worksheet", "whiteboard",
        ])
        is_document = has_any([
            "document", "paper", "letter", "form", "invoice", "receipt",
            "notes", "notebook", "worksheet", "whiteboard",
        ])
        is_screenshot = has_any([
            "screenshot", "screen", "ui", "app", "phone screen", "computer screen",
        ])
        is_indoor = has_any([
            "indoor", "indoors", "room", "kitchen", "bedroom", "office",
            "hall", "classroom", "living room",
        ])
        is_outdoor = has_any([
            "outdoor", "outdoors", "outside", "street", "beach", "park",
            "sky", "forest", "mountain",
        ])

        return {
            "has_people": int(has_people),
            "has_faces": int(has_faces),
            "has_text": int(has_text),
            "is_indoor": int(is_indoor),
            "is_outdoor": int(is_outdoor),
            "is_document": int(is_document),
            "is_screenshot": int(is_screenshot),
        }
