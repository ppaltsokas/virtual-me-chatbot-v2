import os
import google.genai as genai

# Get API key from environment variable (secure)
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY environment variable is not set!")
    print("Please set it before running this script:")
    print("  Windows PowerShell: $env:GEMINI_API_KEY = 'your-api-key-here'")
    print("  Linux/Mac: export GEMINI_API_KEY='your-api-key-here'")
    exit(1)

client = genai.Client(api_key=API_KEY)

resp = client.models.generate_content(
    model="gemini-1.5-flash",
    contents="Say 'ok' if this works."
)

print(resp.text)