#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Offline FAISS index builder for Docker image builds.

Usage (inside container or locally):
    OPENAI_API_KEY=... python services/indexer/build_faiss_offline.py

This script:
- Loads the API module from services/api/main.py so all globals (FAISS, OpenAI
  client, KB paths, etc.) are initialized exactly as in production.
- Calls build_faiss_index() directly to build the FAISS index into models/faiss/.
"""

import importlib.util
import io
import json
import sys
from datetime import datetime
from pathlib import Path

# Fix Windows console encoding if run locally
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

REPO_ROOT = Path(__file__).resolve().parents[2]
API_MAIN = REPO_ROOT / "services" / "api" / "main.py"

try:
    spec = importlib.util.spec_from_file_location("virtual_persona_api_main", API_MAIN)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Could not load API module from {API_MAIN}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    build_faiss_index = module.build_faiss_index
    FAISS_AVAILABLE = module.FAISS_AVAILABLE
    openai_client = module.openai_client
    FAISS_DIR = module.FAISS_DIR
except Exception as e:  # pragma: no cover - only used in build context
    print(f"ERROR: Could not import API module or build_faiss_index: {e}")
    sys.exit(1)


def main() -> None:
    """Build FAISS index using the same code paths as the running backend."""
    if not FAISS_AVAILABLE:
        print("ERROR: FAISS is not available. Install faiss-cpu in requirements.")
        sys.exit(1)

    if not openai_client:
        print("ERROR: OpenAI client not initialized. Set OPENAI_API_KEY before running.")
        sys.exit(1)

    print("Starting offline FAISS index build...")
    build_start_time = datetime.now()
    print(f"  Timestamp: {build_start_time.isoformat()}")

    try:
        count = build_faiss_index()
    except Exception as e:  # pragma: no cover
        print(f"ERROR: Exception while building FAISS index: {e}")
        sys.exit(1)

    build_end_time = datetime.now()
    build_duration = (build_end_time - build_start_time).total_seconds()

    build_info = {
        "build_timestamp": build_end_time.isoformat(),
        "build_duration_seconds": build_duration,
        "chunks_indexed": count,
        "build_type": "docker_image_build",
    }

    try:
        import subprocess

        result = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            capture_output=True,
            text=True,
            timeout=2,
            cwd=REPO_ROOT,
        )
        if result.returncode == 0:
            build_info["git_commit"] = result.stdout.strip()
    except Exception:
        pass

    build_info_path = FAISS_DIR / "build_info.json"
    try:
        with open(build_info_path, "w", encoding="utf-8") as f:
            json.dump(build_info, f, indent=2)
        print(f"  Build info written to: {build_info_path}")
    except Exception as e:
        print(f"  Warning: Could not write build info: {e}")

    print("FAISS index build completed successfully.")
    print(f"  Chunks indexed: {count}")
    print(f"  Build duration: {build_duration:.2f} seconds")
    print(f"  Finished at: {build_end_time.isoformat()}")


if __name__ == "__main__":
    main()
