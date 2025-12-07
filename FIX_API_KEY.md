# Fix Gemini API Key Error

## Error Message
```
API key not valid. Please pass a valid API key.
```

## Solution

Your Gemini API key is either invalid, expired, or has restrictions. Here's how to fix it:

### Step 1: Get a New Gemini API Key

1. **Go to Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Create API Key** or **Get API Key** (if you already have one, you can regenerate it)
4. **Copy the new API key** (starts with `AIzaSy...`)

### Step 2: Update Your .env.local File

Open `.env.local` in your project root and update the `GEMINI_API_KEY`:

```env
GEMINI_API_KEY=your_new_api_key_here
VITE_API_URL=https://virtual-persona-backend-831351726786.europe-west8.run.app
```

**Important:** 
- Replace `your_new_api_key_here` with your actual API key
- Make sure there are no spaces around the `=` sign
- Make sure there are no quotes around the key value

### Step 3: Restart the Backend

After updating the API key, you need to restart the backend:

1. **Stop the backend** (close the terminal window running Python, or press Ctrl+C)
2. **Restart it** by running:
   ```powershell
   .\start-backend.ps1
   ```
   
   Or restart everything:
   ```powershell
   .\start-all.ps1
   ```

### Step 4: Verify It's Working

1. Check the backend terminal - you should see:
   ```
   Gemini API configured successfully
   ```

2. Try sending a message in the chat interface

3. If you still get errors, check:
   - The API key is correct (no typos)
   - The API key has no restrictions in Google AI Studio
   - The backend was restarted after updating `.env.local`

## Common Issues

### API Key Restrictions
If your API key has restrictions (IP, referrer, etc.), make sure:
- Your local IP is allowed (if IP restrictions are set)
- Or remove restrictions for testing

### API Key Not Loading
If the backend doesn't pick up the new key:
1. Make sure `.env.local` is in the project root (same folder as `main.py`)
2. Restart the backend completely
3. Check the backend logs for: `"Loaded environment variables from .env.local"`

### Still Not Working?
1. **Verify the API key works** by testing it directly:
   ```powershell
   python -c "import google.generativeai as genai; genai.configure(api_key='YOUR_KEY'); model = genai.GenerativeModel('gemini-pro'); print(model.generate_content('Hello').text)"
   ```

2. **Check Google AI Studio** to see if:
   - The API key is active
   - There are any usage limits
   - The API is enabled for your project

## Quick Fix Command

If you want to quickly update the API key:

```powershell
# Edit .env.local (replace YOUR_NEW_KEY with actual key)
(Get-Content .env.local) -replace 'GEMINI_API_KEY=.*', 'GEMINI_API_KEY=YOUR_NEW_KEY' | Set-Content .env.local
```

Then restart the backend!

