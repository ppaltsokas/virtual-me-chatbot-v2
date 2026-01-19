import os
import sqlite3
from pathlib import Path
from tqdm import tqdm

from core.db import get_conn
from providers import get_provider
from utils.images import load_image_bytes

SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}

def iter_images(root: str):
    root_path = Path(root)
    for p in root_path.rglob("*"):
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTS:
            yield str(p)

def upsert_image(conn: sqlite3.Connection, path: str, mtime: float, caption: str, embedding_blob: bytes, tags):
    conn.execute(
        """
        INSERT INTO images(
            path, mtime, caption, embedding, deleted,
            has_people, has_faces, has_text, is_indoor, is_outdoor, is_document, is_screenshot
        )
        VALUES(?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(path) DO UPDATE SET
            mtime=excluded.mtime,
            caption=excluded.caption,
            embedding=excluded.embedding,
            deleted=0,
            has_people=excluded.has_people,
            has_faces=excluded.has_faces,
            has_text=excluded.has_text,
            is_indoor=excluded.is_indoor,
            is_outdoor=excluded.is_outdoor,
            is_document=excluded.is_document,
            is_screenshot=excluded.is_screenshot
        """,
        (
            path,
            mtime,
            caption,
            embedding_blob,
            tags.get("has_people"),
            tags.get("has_faces"),
            tags.get("has_text"),
            tags.get("is_indoor"),
            tags.get("is_outdoor"),
            tags.get("is_document"),
            tags.get("is_screenshot"),
        ),
    )

def update_tags(conn: sqlite3.Connection, path: str, mtime: float, tags):
    conn.execute(
        """
        UPDATE images SET
            mtime=?,
            has_people=?,
            has_faces=?,
            has_text=?,
            is_indoor=?,
            is_outdoor=?,
            is_document=?,
            is_screenshot=?
        WHERE path=?
        """,
        (
            mtime,
            tags.get("has_people"),
            tags.get("has_faces"),
            tags.get("has_text"),
            tags.get("is_indoor"),
            tags.get("is_outdoor"),
            tags.get("is_document"),
            tags.get("is_screenshot"),
            path,
        ),
    )

def index_folder(folder: str, rescan_deleted_only: bool = False, rescan_tags_only: bool = False):
    provider = get_provider()
    conn = get_conn()

    files = list(iter_images(folder))
    for path in tqdm(files, desc="Indexing images"):
        try:
            mtime = os.path.getmtime(path)

            row = conn.execute("SELECT mtime, deleted FROM images WHERE path=?", (path,)).fetchone()
            if row:
                prev_mtime, deleted = row
                if rescan_tags_only and deleted == 0:
                    img_bytes = load_image_bytes(path)
                    _caption, tags = provider.caption_and_tags(img_bytes)
                    update_tags(conn, path, mtime, tags)
                    conn.commit()
                    continue
                if rescan_deleted_only and deleted == 0:
                    continue
                if not rescan_deleted_only and deleted == 0 and float(prev_mtime) == float(mtime):
                    continue
            elif rescan_deleted_only or rescan_tags_only:
                continue

            img_bytes = load_image_bytes(path)
            caption, tags = provider.caption_and_tags(img_bytes)

            emb = provider.embed_caption(caption)
            emb_blob = sqlite3.Binary(_floats_to_bytes(emb))

            upsert_image(conn, path, mtime, caption, emb_blob, tags)
            conn.commit()

        except Exception as e:
            print(f"[WARN] Failed indexing {path}: {e}")

    conn.close()

def _floats_to_bytes(vec):
    import numpy as np
    arr = np.array(vec, dtype=np.float32)
    return arr.tobytes()
