# Security Guide - Virtual Persona CV

## 🔒 API Key Security

### ✅ Current Security Status

**API keys are secure.** Current implementation:

1. **Frontend**: No API keys are exposed
   - Frontend only uses `VITE_API_URL` to connect to backend
   - All Gemini API calls go through the backend server
   - Removed unused API key definitions from `vite.config.ts`

2. **Backend**: API keys are stored server-side only
   - Keys are read from environment variables
   - Never hardcoded in source files
   - Stored securely in Cloud Run environment variables

3. **Deployment Scripts**: Use environment variables
   - `deploy-backend.ps1` reads from `$env:GEMINI_API_KEY`
   - `update-cloud-run-key.ps1` reads from `$env:GEMINI_API_KEY`
   - No hardcoded keys in scripts

### 📋 How to Set Up Environment Variables

#### Windows PowerShell:
```powershell
# Set for current session
$env:GEMINI_API_KEY = "your-api-key-here"

# Or create .env.local file (recommended)
# Copy .env.example to .env.local and add actual values
```

#### Linux/Mac:
```bash
# Set for current session
export GEMINI_API_KEY="your-api-key-here"

# Or add to ~/.bashrc or ~/.zshrc for persistence
echo 'export GEMINI_API_KEY="your-api-key-here"' >> ~/.bashrc
```

### 🚨 Important Security Rules

1. **NEVER commit API keys to Git**
   - `.env.local` is in `.gitignore`
   - Never add keys to source code files
   - Never commit deployment scripts with hardcoded keys

2. **Use environment variables**
   - Always use `$env:GEMINI_API_KEY` (PowerShell) or `$GEMINI_API_KEY` (bash)
   - Never hardcode keys in scripts or code

3. **Rotate keys if exposed**
   - If a key is accidentally committed, rotate it immediately
   - Get a new key from: https://aistudio.google.com/app/apikey
   - Update all environments (local, Cloud Run, Railway, etc.)

4. **Use different keys for different environments**
   - Development key for local testing
   - Production key for deployed services
   - This limits damage if one key is compromised

### 🔍 Checking for Exposed Keys

To check for exposed keys:

```powershell
# Search for hardcoded API keys
git grep "AIzaSy" --exclude-dir=venv --exclude-dir=node_modules

# Check if .env.local is tracked by git
git ls-files | Select-String "\.env"
```

### 📝 Files That Should NOT Contain Keys

These files should never have real API keys:
- ✅ `vite.config.ts` - Removed API key definitions
- ✅ `deploy-backend.ps1` - Uses environment variables
- ✅ `test_gemini_key.py` - Uses environment variables
- ✅ `update-cloud-run-key.ps1` - Uses environment variables
- ✅ `.env.example` - Template only (no real keys)
- ✅ All `.md` documentation files - Should use placeholders

### 🛡️ Cloud Run Security

Backend on Cloud Run security:
- API key is stored as an environment variable in Cloud Run
- Not exposed in logs or responses
- Only accessible server-side
- Can be updated via Cloud Console or gcloud CLI

### 🔄 Updating Keys

To update API key in Cloud Run:

```powershell
# Set the new key in environment
$env:GEMINI_API_KEY = "your-new-key-here"

# Update Cloud Run
.\update-cloud-run-key.ps1
```

Or manually:
```powershell
gcloud run services update virtual-persona-backend `
    --region europe-west8 `
    --update-env-vars "GEMINI_API_KEY=your-new-key-here,APP_ENV=prod"
```

### ✅ Security Checklist

- [x] Removed API key definitions from `vite.config.ts`
- [x] Updated deployment scripts to use environment variables
- [x] Created `.env.example` template
- [x] Updated `.gitignore` to exclude sensitive files
- [x] Frontend doesn't expose API keys
- [x] Backend uses environment variables
- [ ] Rotate API key if it was ever committed to a public repo
- [ ] Review all documentation files for exposed keys

### 🆘 If Your Key is Exposed

1. **Immediately rotate the key**:
   - Go to https://aistudio.google.com/app/apikey
   - Delete the old key
   - Create a new key

2. **Update all environments**:
   - Local: Update `.env.local`
   - Cloud Run: Run `update-cloud-run-key.ps1` with new key
   - Railway: Update environment variables in dashboard

3. **Check for unauthorized usage**:
   - Monitor Google Cloud billing
   - Check API usage in Google AI Studio

4. **Review Git history**:
   - If key was committed, consider rewriting history (advanced)
   - Or remove it from current files

---

Security is an ongoing process. Keep sensitive information in environment variables only.

