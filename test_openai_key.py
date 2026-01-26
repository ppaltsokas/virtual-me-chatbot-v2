#!/usr/bin/env python3
"""Test if OpenAI API key is valid"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
env_path = Path('.env.local')
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

key = os.getenv('OPENAI_API_KEY')

if not key:
    print("[ERROR] OPENAI_API_KEY not found in .env.local")
    exit(1)

print(f"[OK] Key loaded: {key[:15]}...{key[-10:]} (length: {len(key)})")

try:
    from openai import OpenAI
    client = OpenAI(api_key=key)
    print("Testing API call with embeddings...")
    response = client.embeddings.create(
        model='text-embedding-3-small',
        input=['test']
    )
    print("[SUCCESS] API key is VALID and working!")
    print(f"   Embedding dimensions: {len(response.data[0].embedding)}")
except Exception as e:
    print(f"[ERROR] API key error: {e}")
    if "401" in str(e) or "invalid" in str(e).lower():
        print("\n[WARNING] The API key is being rejected by OpenAI.")
        print("   Possible reasons:")
        print("   1. The key is for a different OpenAI account")
        print("   2. The key has been revoked or expired")
        print("   3. The key needs billing/credits set up")
        print("   4. Copy/paste error - verify the key matches exactly")
        print("\n   Get a new key from: https://platform.openai.com/api-keys")
