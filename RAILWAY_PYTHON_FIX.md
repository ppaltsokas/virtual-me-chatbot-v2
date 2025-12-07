# Railway Python Detection Fix

## Problem
Railpack detected Python (from `requirements.txt` and `runtime.txt`) instead of Node.js, so it:
- Built a Python environment
- Tried to run `npx vite preview` (which doesn't exist in Python)
- Failed with "npx: command not found"

## Solution Applied

1. ✅ Renamed `requirements.txt` → `requirements.txt.backend`
2. ✅ Renamed `runtime.txt` → `runtime.txt.backend`
3. ✅ Updated `.railwayignore` to exclude Python files

Now Railpack will:
- See `package.json` (Node.js)
- NOT see `requirements.txt` or `runtime.txt` (Python)
- Detect Node.js correctly
- Build with `npm install` and `npm run build`
- Run `npx vite preview` successfully

## Why This Works

Railpack's detection priority:
1. If it sees `requirements.txt` → Detects Python
2. If it sees `package.json` → Detects Node.js

By renaming the Python files, Railpack will only see `package.json` and detect Node.js.

## Files Status

**Railway will see (Node.js):**
- ✅ `package.json`
- ✅ `vite.config.ts`
- ✅ `tsconfig.json`
- ✅ `railway.json`
- ✅ Frontend source files

**Railway will ignore (Python/Backend):**
- ❌ `requirements.txt.backend` (renamed)
- ❌ `runtime.txt.backend` (renamed)
- ❌ `main.py` (in .railwayignore)
- ❌ `Dockerfile.backend` (in .railwayignore)
- ❌ `venv/` (in .railwayignore)

## Next Steps

1. **Commit and push:**
   ```powershell
   git add .
   git commit -m "Hide Python files from Railway, force Node.js detection"
   git push
   ```

2. **Railway will:**
   - Detect Node.js (not Python)
   - Run `npm install`
   - Run `npm run build`
   - Start with `npx vite preview`

## Backend Files

The Python backend files are still in the repo (just renamed), so:
- ✅ Cloud Run can still use them (we deploy separately)
- ✅ Local development still works
- ✅ Railway won't detect them

