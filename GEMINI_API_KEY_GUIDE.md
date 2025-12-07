# Getting a Gemini API Key - No Billing Required!

## Important Clarification

**You DON'T need Google Cloud billing to get a Gemini API key!**

There are two separate services:
1. **Gemini API Key** (from Google AI Studio) - **FREE**, no billing needed
2. **Google Cloud Billing** - Only needed for Cloud Run deployment, NOT for the API key

---

## Get Your Gemini API Key (Free, No Billing)

### Step 1: Go to Google AI Studio
**URL:** https://makersuite.google.com/app/apikey

**OR** https://aistudio.google.com/app/apikey

### Step 2: Sign In
- Sign in with your Google account
- You don't need a Google Cloud project for this

### Step 3: Create API Key
1. Click **"Create API Key"** or **"Get API Key"**
2. If prompted to select a project, you can:
   - Create a new project (free)
   - Or use an existing one
3. **Copy the API key** (starts with `AIzaSy...`)

### Step 4: That's It!
- The API key is **free to use**
- You get **15 requests per minute** on the free tier
- **No billing account needed** for the API key itself

---

## Update Your .env.local

Once you have the new API key:

1. Open `.env.local` in your project root
2. Update the `GEMINI_API_KEY` line:

```env
GEMINI_API_KEY=YOUR_NEW_KEY_FROM_AI_STUDIO
VITE_API_URL=https://virtual-persona-backend-831351726786.europe-west8.run.app
```

3. Save the file
4. Restart your backend

---

## About the Billing Error

The billing error you're seeing is likely because:
- You're trying to access Google Cloud billing (for Cloud Run deployment)
- This is a **separate service** from the Gemini API key
- The billing page might be having issues, but **you don't need it for the API key**

### When Do You Need Billing?
- **For Cloud Run deployment** (hosting your backend) - YES, billing needed
- **For Gemini API key** (chat functionality) - NO, billing NOT needed

---

## Troubleshooting

### If Google AI Studio doesn't work:
1. Try a different browser
2. Clear browser cache
3. Try incognito/private mode
4. Make sure you're signed in with the correct Google account

### If you still can't get an API key:
1. Check if you have any Google account restrictions
2. Try creating a new Google account
3. Contact Google AI Studio support

### Alternative: Use a Different API Key Service
If Google AI Studio continues to have issues, you could temporarily use:
- OpenAI API (requires paid account)
- Anthropic Claude API (requires paid account)

But Gemini API is free and should work without billing!

---

## Quick Checklist

- [ ] Go to https://makersuite.google.com/app/apikey
- [ ] Sign in with Google account
- [ ] Click "Create API Key"
- [ ] Copy the key (starts with `AIzaSy...`)
- [ ] Update `.env.local` with the new key
- [ ] Restart backend
- [ ] Test the chat!

---

## Free Tier Limits

The free Gemini API tier includes:
- **15 requests per minute**
- **1,500 requests per day**
- **No credit card required**
- **No billing account needed**

This should be plenty for development and testing!

