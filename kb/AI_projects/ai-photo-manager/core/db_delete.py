from core.db import get_conn

def mark_deleted(paths):
    conn = get_conn()
    for p in paths:
        conn.execute("UPDATE images SET deleted=1 WHERE path=?", (p,))
    conn.commit()
    conn.close()
