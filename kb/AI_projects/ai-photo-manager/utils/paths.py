import os

def safe_exists(path: str) -> bool:
    try:
        return os.path.exists(path)
    except Exception:
        return False
