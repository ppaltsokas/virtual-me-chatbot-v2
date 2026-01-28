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
import json
from pathlib import Path

# Fix Windows console encoding if run locally
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

from datetime import datetime

try:
    from main import build_faiss_index, FAISS_AVAILABLE, openai_client, FAISS_DIR  # type: ignore
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
    build_start_time = datetime.now()
    print(f"   Timestamp: {build_start_time.isoformat()}")

    try:
        count = build_faiss_index()
    except Exception as e:  # pragma: no cover
        print(f"❌ ERROR: Exception while building FAISS index: {e}")
        sys.exit(1)

    build_end_time = datetime.now()
    build_duration = (build_end_time - build_start_time).total_seconds()
    
    # Write build info to a JSON file for version tracking
    build_info = {
        "build_timestamp": build_end_time.isoformat(),
        "build_duration_seconds": build_duration,
        "chunks_indexed": count,
        "build_type": "docker_image_build"
    }
    
    # Try to get git commit hash if available
    try:
        import subprocess
        result = subprocess.run(
            ['git', 'rev-parse', '--short', 'HEAD'],
            capture_output=True,
            text=True,
            timeout=2,
            cwd=Path(__file__).parent
        )
        if result.returncode == 0:
            build_info["git_commit"] = result.stdout.strip()
    except Exception:
        pass  # Git not available, skip
    
    build_info_path = FAISS_DIR / "build_info.json"
    try:
        with open(build_info_path, "w", encoding="utf-8") as f:
            json.dump(build_info, f, indent=2)
        print(f"   Build info written to: {build_info_path}")
    except Exception as e:
        print(f"   ⚠️  Warning: Could not write build info: {e}")

    print("✅ FAISS index build completed successfully.")
    print(f"   Chunks indexed: {count}")
    print(f"   Build duration: {build_duration:.2f} seconds")
    print(f"   Finished at: {build_end_time.isoformat()}")


if __name__ == "__main__":
    main()

