import google.genai as genai

API_KEY="AIzaSyDvUCFIWhYSMVZWgjubzLBqXmz4gKPTRZA"
client = genai.Client(api_key=API_KEY)

resp = client.models.generate_content(
    model="gemini-1.5-flash",
    contents="Say 'ok' if this works."
)

print(resp.text)