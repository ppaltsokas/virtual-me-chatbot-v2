# Cloud Run Fixes - Implementation Summary

## ✅ Fixes Applied

### 1. Fixed Paths to Use Absolute Paths (main.py.backend lines 265-270)
**Problem:** Relative paths can break in Cloud Run due to working directory differences.

**Solution:**
```python
# Use absolute paths relative to this Python file to avoid path drift in Cloud Run
BASE_DIR = Path(__file__).resolve().parent
KB_FOLDER = BASE_DIR / "kb"
ME_FOLDER = BASE_DIR / "me"
```

**Impact:** Paths are now resolved relative to the Python file location, eliminating path drift issues.

---

### 2. Enhanced /health Endpoint (main.py.backend lines 2259-2310)
**Problem:** Health endpoint didn't show enough diagnostic information.

**Solution:** Added comprehensive diagnostics:
- `service_version`: Git commit hash or build timestamp
- `model_name`: "gemini-2.5-flash"
- `persona_files_exist`: Whether persona files exist on filesystem
- `persona_length`: Total character count of loaded persona data
- `kb_files_exist`: Whether KB files exist on filesystem
- `cwd`: Current working directory
- `app_dir`: Application directory (BASE_DIR)
- `kb_folder_path`: Absolute path to KB folder
- `me_folder_path`: Absolute path to ME folder

**Usage:**
```bash
# Check local
curl http://localhost:8000/health | jq

# Check Cloud Run
curl https://your-cloud-run-url.run.app/health | jq
```

**What to Look For:**
- `persona_loaded: false` → Persona not loading
- `persona_files_exist: false` → Files not in container
- `persona_length: 0` → Files empty or not read
- `app_dir` vs `cwd` mismatch → Path issues

---

### 3. Fail-Fast Persona Loading in Production (main.py.backend lines 1001-1031, 1915-1923)
**Problem:** App could silently run without persona files, causing refusal behavior.

**Solution:**
- In production (detected by `PORT` env var or `ENVIRONMENT=production`):
  - If `ME_FOLDER` doesn't exist → **CRASH** with FileNotFoundError
  - If `summary.txt` is missing → **CRASH** with FileNotFoundError
  - If no persona documents loaded → **CRASH** with RuntimeError

**Impact:** Production deployments will fail fast if persona files are missing, preventing silent failures.

---

### 4. Frontend Environment Files
**Problem:** Frontend might be using wrong API URL.

**Solution:** Create these files (they're gitignored, so create manually):

**`.env.local`** (for local development):
```
VITE_API_URL=http://localhost:8000
```

**`.env.production`** (for production builds):
```
VITE_API_URL=https://your-cloud-run-service-url.run.app
```

**Note:** These files are gitignored. You need to:
1. Create them manually in your project root
2. Set `VITE_API_URL` in your build/deployment pipeline environment variables

---

### 5. Frontend API_URL Logging (services/geminiService.ts line 13-15)
**Problem:** Hard to debug which API URL frontend is using.

**Solution:**
```typescript
// Log API URL at startup for debugging (only in development)
if (import.meta.env.DEV) {
  console.log(`[ChatService] API_URL: ${API_URL}`);
}
```

**Impact:** Browser console will show which API URL is being used during development.

---

## Next Steps for Cloud Run Deployment

### Step 1: Verify Local Health Endpoint
```bash
# Start backend locally
python main.py.backend

# In another terminal
curl http://localhost:8000/health | jq
```

**Expected output:**
```json
{
  "status": "healthy",
  "service_version": "...",
  "persona_loaded": true,
  "persona_documents": 3,
  "persona_files_exist": true,
  "persona_length": 5000,
  "kb_loaded": true,
  "kb_documents": 24,
  ...
}
```

### Step 2: Create Frontend Environment Files
```bash
# Create .env.local for local dev
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Create .env.production.example (already created)
# Copy and edit for production
cp .env.production.example .env.production
# Edit .env.production with your Cloud Run URL
```

### Step 3: Rebuild and Deploy to Cloud Run
1. **Build Docker image:**
   ```bash
   docker build -f Dockerfile.backend -t virtual-persona-backend .
   ```

2. **Verify files are in image:**
   ```bash
   docker run --rm virtual-persona-backend ls -la /app/me/
   docker run --rm virtual-persona-backend ls -la /app/kb/ | head -20
   ```

3. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy virtual-persona-backend \
     --image gcr.io/YOUR_PROJECT/virtual-persona-backend \
     --platform managed \
     --region us-central1
   ```

### Step 4: Check Cloud Run Health Endpoint
```bash
# Get your Cloud Run URL
CLOUD_RUN_URL=$(gcloud run services describe virtual-persona-backend --format="value(status.url)")

# Check health
curl $CLOUD_RUN_URL/health | jq
```

**Critical Checks:**
- ✅ `persona_loaded: true`
- ✅ `persona_files_exist: true`
- ✅ `persona_length > 0`
- ✅ `kb_loaded: true`
- ✅ `service_version` matches your latest commit

### Step 5: Update Frontend Production Build
1. Set `VITE_API_URL` in your build environment:
   ```bash
   export VITE_API_URL=https://your-cloud-run-url.run.app
   npm run build
   ```

2. Or set in your hosting platform (Vercel, Netlify, etc.) environment variables.

3. Check browser console for `[ChatService] API_URL: ...` (in dev mode).

---

## Troubleshooting

### If Cloud Run Health Shows `persona_loaded: false`:

1. **Check files are in Docker image:**
   ```bash
   docker run --rm virtual-persona-backend find /app -name "summary.txt"
   ```

2. **Check paths in health response:**
   - `app_dir` should be `/app`
   - `me_folder_path` should be `/app/me`
   - `kb_folder_path` should be `/app/kb`

3. **Check Cloud Run logs:**
   ```bash
   gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=virtual-persona-backend" --limit 50
   ```

4. **Look for:**
   - "CRITICAL: Persona folder missing"
   - "PRODUCTION ERROR: No persona documents loaded"
   - File path errors

### If Frontend Calls Wrong URL:

1. **Check browser console** for `[ChatService] API_URL: ...`
2. **Check Network tab** in DevTools - what URL is being called?
3. **Verify environment variable:**
   ```bash
   # In build environment
   echo $VITE_API_URL
   ```

---

## Summary

All fixes are implemented. The key changes:
1. ✅ Absolute paths prevent path drift
2. ✅ Comprehensive health endpoint for diagnostics
3. ✅ Fail-fast in production prevents silent failures
4. ✅ Frontend env files structure (create manually)
5. ✅ API_URL logging for debugging

**Next:** Deploy to Cloud Run and check the `/health` endpoint to verify persona files are loading correctly.
