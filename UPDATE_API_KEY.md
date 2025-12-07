# Update Your Gemini API Key - Quick Guide

## Current Issue
Your API key `AIzaSyDvUCFIWhYSMVZWgjubzLBqXmz4gKPTRZA` is **invalid or expired**.

## Quick Fix (3 Steps)

### Step 1: Get a New API Key
1. **Open**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"** or **"Get API Key"**
4. **Copy the new key** (it will start with `AIzaSy...`)

### Step 2: Update .env.local
Open `.env.local` and replace the `GEMINI_API_KEY` line:

**Current (INVALID):**
```env
GEMINI_API_KEY=AIzaSyDvUCFIWhYSMVZWgjubzLBqXmz4gKPTRZA
```

**Replace with:**
```env
GEMINI_API_KEY=YOUR_NEW_KEY_HERE
```

**Full .env.local should look like:**
```env
GEMINI_API_KEY=AIzaSyYourNewKeyHere
VITE_API_URL=https://virtual-persona-backend-831351726786.europe-west8.run.app
```

### Step 3: Restart Backend
After saving `.env.local`, restart the backend:
- Close the backend terminal window
- Run: `.\start-backend.ps1`
- Or restart everything: `.\start-all.ps1`

## Verify It Works
1. Check the backend terminal - you should see:
   ```
   Gemini API configured successfully
   ```
2. Try the chat again - it should work!

## Why This Happened
- API keys can expire
- API keys can be revoked
- API keys might have usage limits reached
- The key might have been copied incorrectly

## Need Help?
If you still get errors after updating:
1. Make sure there are **no spaces** around the `=` sign
2. Make sure there are **no quotes** around the key
3. Make sure the key is **complete** (usually 39 characters)
4. Verify the key is **active** in Google AI Studio

