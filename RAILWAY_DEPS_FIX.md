# Railway Dependencies Fix

## 🐛 The Problem

Railway was showing:
```
ModuleNotFoundError: No module named 'google.generativeai'
```

**Root Cause**: Railway wasn't installing Python dependencies from `requirements.txt` during the build process.

## ✅ The Solution

Added explicit build command to `railway.json` to ensure dependencies are installed.

### What Changed:

1. **Updated `railway.json`**: Added `buildCommand` to install dependencies
2. **Created `Procfile`**: Alternative way for Railway to detect the start command

### The Fix:

**railway.json:**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "sh start.sh"
  }
}
```

## 🔄 Next Steps

1. **The fix is pushed to GitHub** - Railway should auto-redeploy
2. **Wait 2-3 minutes** for the build to complete (installing dependencies takes time)
3. **Check the build logs** - Should see:
   - ✅ "Installing dependencies from requirements.txt"
   - ✅ "Successfully installed google-genai ..."
   - ✅ "Starting Container"
   - ✅ "Application startup complete"

## 📋 What Railway Should Do Now

1. **Build Phase**:
   - Detect Python project
   - Run: `pip install -r requirements.txt`
   - Install all dependencies

2. **Deploy Phase**:
   - Run: `sh start.sh`
   - Start uvicorn server
   - Application should start successfully

## ✅ Verification

After redeploy, check logs for:
- ✅ No "ModuleNotFoundError"
- ✅ "Application startup complete"
- ✅ "Uvicorn running on http://0.0.0.0:XXXX"

Then test:
- `https://drk1vcuq.up.railway.app/health` should return JSON
- `https://drk1vcuq.up.railway.app/` should show your app

## 🆘 If Still Not Working

If Railway still doesn't install dependencies:

1. **Check Railway Settings**:
   - Go to Settings → Build
   - Make sure "Build Command" is set or Railway auto-detects

2. **Manual Build Command**:
   - In Railway UI, go to Deploy tab
   - Add "Build Command": `pip install -r requirements.txt`
   - Redeploy

3. **Check requirements.txt**:
   - Make sure it's in the root directory
   - Make sure it has all dependencies listed



