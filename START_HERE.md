# 🚀 Quick Start Guide - Run Your App

Follow these steps **every time you open Cursor** to run your Virtual Persona CV app:

## Option 1: One-Click Start (Easiest) ⭐

1. **Open PowerShell in Cursor** (Terminal → New Terminal, or press `` Ctrl+` ``)
2. **Run this command:**
   ```powershell
   .\start-all.ps1
   ```
3. **Wait for both servers to start** (you'll see two new terminal windows)
4. **Open your browser** to `http://localhost:3000`
5. **Done!** 🎉

---

## Option 2: Manual Start (Step-by-Step)

### Step 1: Start the Backend
1. Open a **new terminal** in Cursor (Terminal → New Terminal)
2. Run:
   ```powershell
   .\start-backend.ps1
   ```
3. **Wait** until you see: `Uvicorn running on http://0.0.0.0:8000`

### Step 2: Start the Frontend
1. Open **another new terminal** (Terminal → New Terminal again)
2. Run:
   ```powershell
   .\start-frontend.ps1
   ```
3. **Wait** until you see: `Local: http://localhost:3000`

### Step 3: Open Your Browser
- Go to: **http://localhost:3000**
- If you see an old chatbot, press **Ctrl+Shift+R** (hard refresh)

---

## Troubleshooting

### ❌ "Port 8000 is already in use"
**Solution:** The startup scripts automatically kill old processes, but if it still happens:
```powershell
# Kill all Python processes
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force
```

### ❌ "Backend Error: The Python backend server is not responding"
**Solution:** 
1. Make sure the backend terminal shows `Uvicorn running on http://0.0.0.0:8000`
2. Check that port 8000 is free: `netstat -ano | findstr :8000`
3. Restart the backend: `.\start-backend.ps1`

### ❌ "I see an old chatbot"
**Solution:** 
- Press **Ctrl+Shift+R** (hard refresh)
- Or clear browser cache: Settings → Privacy → Clear browsing data

### ❌ "Module not found" or Python errors
**Solution:**
```powershell
# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Reinstall dependencies if needed
pip install -r requirements.txt
```

---

## What Each Script Does

- **`start-all.ps1`** - Starts both backend and frontend in separate windows
- **`start-backend.ps1`** - Kills old processes, starts Python backend on port 8000
- **`start-frontend.ps1`** - Starts React frontend on port 3000

---

## Quick Reference

| What | URL | Port |
|------|-----|------|
| Frontend (Your App) | http://localhost:3000 | 3000 |
| Backend API | http://localhost:8000 | 8000 |
| Backend Health Check | http://localhost:8000/health | 8000 |

---

## Need Help?

If something doesn't work:
1. Check both terminal windows for error messages
2. Make sure `.env.local` has your `GEMINI_API_KEY`
3. Verify Python and Node.js are installed
4. Try the troubleshooting steps above

