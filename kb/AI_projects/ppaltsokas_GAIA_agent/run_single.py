from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

from dotenv import load_dotenv

from app import GeminiAgent


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run GeminiAgent on a single GAIA task without submitting."
    )
    parser.add_argument(
        "--question",
        "-q",
        required=True,
        help="Question text to pass to the agent.",
    )
    parser.add_argument(
        "--task-id",
        "-t",
        help="Optional GAIA task_id (used to download the associated attachment).",
    )
    parser.add_argument(
        "--save-log",
        "-o",
        type=Path,
        help="Optional path to store a JSON log with details of the run.",
    )
    return parser.parse_args()


def main() -> None:
    load_dotenv()
    agent = GeminiAgent()

    args = parse_args()
    answer = agent(args.question, task_id=args.task_id)

    print("\n--- Agent Answer ---")
    print(answer)
    print("--------------------\n")

    if args.save_log:
        args.save_log.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "question": args.question,
            "task_id": args.task_id,
            "answer": answer,
        }
        with args.save_log.open("w", encoding="utf-8") as fp:
            json.dump(payload, fp, indent=2, ensure_ascii=False)
        print(f"Saved log to {args.save_log}")


if __name__ == "__main__":
    main()

