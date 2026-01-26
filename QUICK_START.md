# Quick Start Guide - Virtual Persona CV Backend

## 🚀 Starting the Backend (Each Time You Open Cursor)

### Option 1: Using the PowerShell Script (Easiest)
```powershell
.\start-backend.ps1
```

This script will:
- ✅ Activate the virtual environment
- ✅ Check if backend is already running
- ✅ Start the backend server
- ✅ Show you the status

### Option 2: Manual Start
```powershell
# 1. Navigate to project directory
cd "F:\Virtual Persona CV"

# 2. Activate virtual environment
.\venv\Scripts\Activate.ps1

# 3. Start backend
python main.py.backend
```

## 📋 Prerequisites

Make sure you have a `.env.local` file with:
```
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
```

## 🔍 Verify Backend is Running

Open a new PowerShell window and run:
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/health" | ConvertTo-Json
```

You should see:
- `"status": "healthy"`
- `"gemini_configured": true`
- `"openai_available": true` (if OPENAI_API_KEY is set)
- `"faiss_status": "loaded"` (after building the index)

## 🏗️ Building FAISS Index (First Time Only)

After starting the backend, build the FAISS index for semantic search:

```powershell
# Option 1: Using the script
python build_faiss_index.py

# Option 2: Using PowerShell
Invoke-RestMethod -Uri "http://localhost:8000/kb/build-faiss" -Method POST
```

**Note:** This only needs to be done once, or when you add new files to the `kb/` folder.

## 🛑 Stopping the Backend

Press `Ctrl+C` in the terminal where the backend is running.

## 📝 Common Commands

### Check Backend Health
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/health"
```

### Check Q&A Database Status
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/qadb/status"
```

### Rebuild FAISS Index
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/kb/build-faiss" -Method POST
```

### Reload Knowledge Base
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/kb/reload" -Method POST
```

## 🐛 Troubleshooting

### Backend won't start
- Check if port 8000 is already in use: `netstat -ano | findstr :8000`
- Kill existing processes: `Get-Process python | Stop-Process -Force`

### "Module not found" errors
- Reinstall dependencies: `pip install -r requirements.txt.backend`

### FAISS not working
- Make sure `OPENAI_API_KEY` is set in `.env.local`
- Install FAISS: `pip install faiss-cpu numpy`

### Endpoints return "Not Found"
- Restart the backend to load new code changes
