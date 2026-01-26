#!/usr/bin/env python3
"""
Test script to query the chat endpoint and show what chunks were retrieved.
This will help us see what context is being sent to Gemini.
"""

import requests
import json
import sys

def test_chat_query():
    """Test the chat endpoint with a personal question."""
    url = "http://localhost:8000/chat"
    
    # Test query
    query = "What is Panos' birthday?"
    session_id = "test-birthday-debug"
    
    payload = {
        "message": query,
        "session_id": session_id
    }
    
    print("=" * 80)
    print("TESTING CHAT ENDPOINT")
    print("=" * 80)
    print(f"\nUser Question: {query}")
    print(f"Session ID: {session_id}")
    print("\nSending request to backend...")
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        
        if response.status_code == 200:
            # For streaming responses, we get the full text
            response_text = response.text.strip()
            
            print("\n" + "=" * 80)
            print("MODEL RESPONSE:")
            print("=" * 80)
            print(response_text)
            print("\n" + "=" * 80)
            print("\nNOTE: Check the backend console/logs for detailed logging of:")
            print("  - Retrieved chunks (persona_context)")
            print("  - Full message sent to Gemini")
            print("  - Model's complete response")
            print("\nThe backend should show logs like:")
            print("  === FULL MESSAGE TO GEMINI ===")
            print("  === MODEL RESPONSE ===")
            print("=" * 80)
            
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"\n❌ Error connecting to backend: {e}")
        print("Make sure the backend is running on http://localhost:8000")

if __name__ == "__main__":
    test_chat_query()
