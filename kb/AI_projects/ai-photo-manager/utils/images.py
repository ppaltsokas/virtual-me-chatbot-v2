from PIL import Image
from io import BytesIO

def load_image_bytes(path: str, max_side: int = 1024) -> bytes:
    img = Image.open(path).convert("RGB")
    w, h = img.size

    scale = max(w, h) / max_side
    if scale > 1:
        img = img.resize((int(w / scale), int(h / scale)))

    buf = BytesIO()
    img.save(buf, format="JPEG", quality=85)
    return buf.getvalue()
