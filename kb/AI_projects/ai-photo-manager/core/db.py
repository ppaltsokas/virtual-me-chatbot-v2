import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "gallery.db"

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA journal_mode=WAL;")
    return conn

def init_db():
    conn = get_conn()
    conn.execute("""
    CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT UNIQUE NOT NULL,
        mtime REAL NOT NULL,
        caption TEXT,
        embedding BLOB,
        deleted INTEGER NOT NULL DEFAULT 0
    );
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_images_deleted ON images(deleted);")
    cols = {row[1] for row in conn.execute("PRAGMA table_info(images);").fetchall()}
    new_cols = [
        "has_people",
        "has_faces",
        "has_text",
        "is_indoor",
        "is_outdoor",
        "is_document",
        "is_screenshot",
    ]
    for col in new_cols:
        if col not in cols:
            conn.execute(f"ALTER TABLE images ADD COLUMN {col} INTEGER;")
    conn.commit()
    conn.close()
