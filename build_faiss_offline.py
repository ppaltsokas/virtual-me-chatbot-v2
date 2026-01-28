#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Offline FAISS index builder for Docker image builds.

Usage (inside container or locally):
    OPENAI_API_KEY=... python build_faiss_offline.py

This script:
- Imports the FastAPI app module (`main`) so that all globals (FAISS, OpenAI client,
  KB paths, etc.) are initialized exactly as in production.
- Calls `build_faiss_index()` directly to build the FAISS index into `models/faiss/`.

Intended use:
- Run during `docker build` so that the final image already contains a fresh FAISS index.
"""

import sys
import io

# Fix Windows console encoding if run locally
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

from datetime import datetime

try:
    from main import build_faiss_index, FAISS_AVAILABLE, openai_client  # type: ignore
except Exception as e:  # pragma: no cover - only used in build context
    print(f"❌ ERROR: Could not import main module or build_faiss_index: {e}")
    sys.exit(1)


def main() -> None:
    """Build FAISS index using the same code paths as the running backend."""
    if not FAISS_AVAILABLE:
        print("❌ FAISS is not available. Install faiss-cpu in requirements.")
        sys.exit(1)

    if not openai_client:
        print("❌ OpenAI client not initialized. Set OPENAI_API_KEY before running.")
        sys.exit(1)

    print("🚀 Starting offline FAISS index build...")
    print(f"   Timestamp: {datetime.now().isoformat()}")

    try:
        count = build_faiss_index()
    except Exception as e:  # pragma: no cover
        print(f"❌ ERROR: Exception while building FAISS index: {e}")
        sys.exit(1)

    print("✅ FAISS index build completed successfully.")
    print(f"   Chunks indexed: {count}")
    print(f"   Finished at: {datetime.now().isoformat()}")


if __name__ == "__main__":
    main()

