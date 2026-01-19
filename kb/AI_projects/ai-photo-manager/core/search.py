import numpy as np
from typing import List, Dict, Optional

from core.db import get_conn
from providers import get_provider

def _bytes_to_floats(blob: bytes) -> np.ndarray:
    return np.frombuffer(blob, dtype=np.float32)

def _cosine(a: np.ndarray, b: np.ndarray) -> float:
    denom = (np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)

def search(query: str, limit: int = 50, filters: Optional[Dict] = None) -> List[Dict]:
    filters = filters or {}
    provider = get_provider()
    q_emb = np.array(provider.embed_text(query), dtype=np.float32)

    conn = get_conn()
    conditions = ["deleted=0", "embedding IS NOT NULL"]
    if filters.get("exclude_people"):
        conditions.append("(has_people IS NULL OR has_people=0)")
    if filters.get("exclude_faces"):
        conditions.append("(has_faces IS NULL OR has_faces=0)")
    if filters.get("exclude_text"):
        conditions.append("(has_text IS NULL OR has_text=0)")
    if filters.get("only_documents"):
        conditions.append("is_document=1")
    if filters.get("only_screenshots"):
        conditions.append("is_screenshot=1")
    env = filters.get("environment")
    if env == "Indoor":
        conditions.append("is_indoor=1")
    if env == "Outdoor":
        conditions.append("is_outdoor=1")

    where_clause = " AND ".join(conditions)
    rows = conn.execute(
        f"SELECT id, path, caption, embedding FROM images WHERE {where_clause}"
    ).fetchall()
    conn.close()

    scored = []
    for (img_id, path, caption, emb_blob) in rows:
        emb = _bytes_to_floats(emb_blob)
        score = _cosine(q_emb, emb)
        scored.append((score, img_id, path, caption))

    scored.sort(reverse=True, key=lambda x: x[0])
    return [
        {"score": s, "id": img_id, "path": path, "caption": caption}
        for (s, img_id, path, caption) in scored[:limit]
    ]
