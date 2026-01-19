import struct
import sys
from typing import Iterable

def cut_files_to_clipboard(paths: Iterable[str]) -> None:
    if not sys.platform.startswith("win"):
        raise RuntimeError("Cut to clipboard is only supported on Windows.")

    files = list(paths)
    if not files:
        return

    try:
        import win32clipboard
        import win32con
    except Exception as e:
        raise RuntimeError("pywin32 is required for clipboard cut support.") from e

    dropfiles = struct.pack("IiiII", 20, 0, 0, 0, 1)
    file_list = "\0".join(files) + "\0\0"
    payload = dropfiles + file_list.encode("utf-16le")

    win32clipboard.OpenClipboard()
    try:
        win32clipboard.EmptyClipboard()
        win32clipboard.SetClipboardData(win32con.CF_HDROP, payload)
        fmt = win32clipboard.RegisterClipboardFormat("Preferred DropEffect")
        win32clipboard.SetClipboardData(fmt, struct.pack("I", 2))
    finally:
        win32clipboard.CloseClipboard()
