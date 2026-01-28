#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to build the FAISS index on the deployed backend.
Usage: python build_faiss_deployed.py [BACKEND_URL]

If BACKEND_URL is not provided, it will try common URLs:
- https://ppaltsokas.com
- https://www.ppaltsokas.com
"""

import requests
import json
import sys
import io
from pathlib import Path

# Fix Windows console encoding for emoji characters
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def build_faiss_index_deployed(backend_url: str):
    """Build the FAISS index via the API endpoint on deployed backend."""
    print(f"Building FAISS index on deployed backend...")
    print(f"Backend URL: {backend_url}")
    
    # Try health check first
    try:
        print(f"\nChecking backend health at {backend_url}/health...")
        health_response = requests.get(f"{backend_url}/health", timeout=10)
        if health_response.status_code == 200:
            health = health_response.json()
            print(f"✅ Backend is healthy")
            print(f"   - OpenAI Available: {health.get('openai_available', False)}")
            print(f"   - FAISS Available: {health.get('faiss_available', False)}")
            print(f"   - FAISS Status: {health.get('faiss_status', 'unknown')}")
        else:
            print(f"⚠️  Health check returned status {health_response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️  Could not check health: {e}")
        print("   Continuing anyway...")
    
    # Build the index
    try:
        print(f"\n🚀 Starting FAISS index build at {backend_url}/kb/build-faiss...")
        print("   This may take a few minutes depending on your knowledge base size...")
        
        response = requests.post(f"{backend_url}/kb/build-faiss", timeout=600)  # 10 minute timeout
        
        if response.status_code == 200:
            result = response.json()
            print(f"\n✅ SUCCESS!")
            print(f"   Indexed {result.get('chunks_indexed', 0)} chunks")
            print(f"   Status: {result.get('status', 'unknown')}")
            print(f"   Timestamp: {result.get('timestamp', 'unknown')}")
            return True
        else:
            print(f"\n❌ ERROR: {response.status_code}")
            print(f"   {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print(f"\n❌ ERROR: Request timed out after 10 minutes")
        print("   The build might still be running. Check the backend logs.")
        return False
    except requests.exceptions.ConnectionError:
        print(f"\n❌ ERROR: Cannot connect to backend at {backend_url}")
        print("   Check that:")
        print("   1. The backend URL is correct")
        print("   2. The backend is running and accessible")
        print("   3. There are no firewall/network issues")
        return False
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        return False

if __name__ == "__main__":
    # Get backend URL from command line or try defaults
    if len(sys.argv) > 1:
        backend_url = sys.argv[1].rstrip('/')
    else:
        # Try common URLs
        possible_urls = [
            "https://ppaltsokas.com",
            "https://www.ppaltsokas.com",
        ]
        
        print("No backend URL provided. Trying common URLs...")
        success = False
        for url in possible_urls:
            print(f"\n{'='*60}")
            print(f"Trying: {url}")
            print(f"{'='*60}")
            if build_faiss_index_deployed(url):
                success = True
                break
        
        if not success:
            print(f"\n❌ Could not build index on any of the tried URLs.")
            print(f"\nUsage: python build_faiss_deployed.py <BACKEND_URL>")
            print(f"Example: python build_faiss_deployed.py https://your-backend-url.run.app")
            sys.exit(1)
    else:
        if not build_faiss_index_deployed(backend_url):
            sys.exit(1)
