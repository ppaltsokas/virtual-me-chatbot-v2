#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simple script to build the FAISS index for the knowledge base.
Run this after setting OPENAI_API_KEY in .env.local
"""

import requests
import json
import sys
import io
from pathlib import Path
from dotenv import load_dotenv

# Fix Windows console encoding for emoji characters
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Load environment variables
env_path = Path('.env.local')
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

API_URL = "http://localhost:8000"

def build_faiss_index():
    """Build the FAISS index via the API endpoint."""
    print("Building FAISS index...")
    print(f"Connecting to {API_URL}")
    
    try:
        # First check health
        health_response = requests.get(f"{API_URL}/health")
        health = health_response.json()
        
        print(f"\nBackend Status:")
        print(f"  - OpenAI Available: {health.get('openai_available', False)}")
        print(f"  - FAISS Available: {health.get('faiss_available', False)}")
        print(f"  - FAISS Status: {health.get('faiss_status', 'unknown')}")
        
        if not health.get('openai_available'):
            print("\n❌ ERROR: OpenAI is not available. Make sure OPENAI_API_KEY is set in .env.local")
            return
        
        if not health.get('faiss_available'):
            print("\n❌ ERROR: FAISS is not available. Install it with: pip install faiss-cpu")
            return
        
        # Build the index
        print("\n🚀 Starting FAISS index build...")
        print("   This may take a few minutes depending on your knowledge base size...")
        
        response = requests.post(f"{API_URL}/kb/build-faiss", timeout=600)  # 10 minute timeout
        
        if response.status_code == 200:
            result = response.json()
            print(f"\n✅ SUCCESS!")
            print(f"   Indexed {result.get('chunks_indexed', 0)} chunks")
            print(f"   Status: {result.get('status', 'unknown')}")
            print(f"   Timestamp: {result.get('timestamp', 'unknown')}")
        else:
            print(f"\n❌ ERROR: {response.status_code}")
            print(f"   {response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"\n❌ ERROR: Cannot connect to backend at {API_URL}")
        print("   Make sure the backend is running: python main.py.backend")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    build_faiss_index()
