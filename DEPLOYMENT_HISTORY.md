# Deployment & Development History

This document compiles all deployment guides, fixes, and troubleshooting steps in chronological order.

---

## 1. Google Cloud Platform Setup Guide

**Date:** Initial deployment setup  
**File:** `GCP_SETUP_GUIDE.md`

### Overview
Step-by-step guide for setting up Google Cloud Platform for Cloud Run deployment, starting from the Credentials page.

### Key Steps
1. Enable required APIs (Cloud Run, Cloud Build, Artifact Registry)
2. Verify billing is enabled
3. Get Project ID
4. Install Google Cloud SDK
5. Authenticate and configure gcloud CLI
6. Create Artifact Registry repository
7. Prepare Gemini API key
8. Deploy application
9. Get deployment URL
10. Test deployment
11. Set resource limits (optional)

### Important Commands
```powershell
gcloud auth login
gcloud config set project <PROJECT_ID>
gcloud config set run/region europe-west8
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
gcloud artifacts repositories create virtual-persona-repo --repository-format=docker --location=europe-west8
```

---

## 2. Backend URL Configuration

**Date:** After initial Cloud Run deployment  
**File:** `BACKEND_URL_SETUP.md`

### Overview
Configuration guide for connecting the frontend to the production backend URL.

### Production Backend URL
`https://virtual-persona-backend-831351726786.europe-west8.run.app`

### Setup Steps
1. Create `.env.local` file with `VITE_API_URL`
2. Update CORS in backend if deploying frontend to different domain
3. Rebuild frontend

### Files Using Backend URL
- `services/geminiService.ts` - API calls for chat
- `App.tsx` - CV download and PDF links
- `components/ChatInterface.tsx` - Image loading from knowledge base

---

## 3. API Key Issues & Fixes

### 3.1 Initial API Key Error
**File:** `FIX_API_KEY.md`

**Problem:** "API key not valid" error

**Solution:**
1. Get new Gemini API key from https://makersuite.google.com/app/apikey
2. Update `.env.local` with new key
3. Restart backend

### 3.2 Cloud Run API Key Malformed
**File:** `CLOUD_RUN_FIXED.md`

**Problem:** Cloud Run environment variables were malformed - `GEMINI_API_KEY` and `APP_ENV` were concatenated together.

**Solution:**
- Cleared malformed environment variables
- Set `GEMINI_API_KEY` and `APP_ENV` as separate variables
- Cloud Run service redeployed

### 3.3 API Key Leaked & Security Fix
**Files:** `API_KEY_FIX_INSTRUCTIONS.md`, `FIX_CLOUD_RUN_KEY.md`, `UPDATE_API_KEY.md`

**Problem:** 
1. API key was flagged as leaked (ending in `PTRZA`)
2. Cloud Run environment variable was malformed again

**Solution:**
1. Get NEW API key from Google AI Studio
2. Update `.env.local` with new key
3. Fix Cloud Run environment variable using `fix-cloud-run-key.ps1`
4. Removed all hardcoded API keys from documentation files
5. Updated all scripts to use environment variables

**Security Improvements:**
- Removed API key definitions from `vite.config.ts`
- Updated deployment scripts to read from environment variables
- Created `.env.example` template
- Enhanced `.gitignore` to exclude sensitive files

---

## 4. Railway Frontend Deployment

**File:** `RAILWAY_DEPLOYMENT_GUIDE.md`

### Overview
Complete guide for deploying the frontend to Railway while using Cloud Run for the backend.

### Configuration Files Updated
1. `nixpacks.toml` - Changed from Python to Node.js
2. `railway.json` - Updated for frontend deployment
3. `Procfile` - Updated for frontend serving

### Environment Variables Needed
- `VITE_API_URL` = `https://virtual-persona-backend-831351726786.europe-west8.run.app`
- `GEMINI_API_KEY` = (for backend, not needed in Railway)

### CORS Update Required
Update Cloud Run to allow Railway domain:
```powershell
gcloud run services update virtual-persona-backend `
  --region europe-west8 `
  --update-env-vars ALLOWED_ORIGINS="http://localhost:3000,https://www.ppaltsokas.com,https://virtual-me-chatbot-v2-production.up.railway.app"
```

---

## 5. Artifact Registry Permissions Fix

**File:** `FIX_PERMISSIONS.md`

### Problem
Deployment failing with:
```
denied: Permission "artifactregistry.repositories.uploadArtifacts" denied
```

### Solution
Granted Cloud Build service account necessary permissions:
```powershell
gcloud projects add-iam-policy-binding virtualpersonacv `
    --member="serviceAccount:831351726786@cloudbuild.gserviceaccount.com" `
    --role="roles/artifactregistry.writer"
```

Also added repository-level permissions:
```powershell
gcloud artifacts repositories add-iam-policy-binding virtual-persona-repo `
    --location=europe-west8 `
    --member="serviceAccount:831351726786@cloudbuild.gserviceaccount.com" `
    --role="roles/artifactregistry.writer"
```

---

## 6. Random Project Selection Fix

**File:** `RANDOM_SELECTION_FIX.md`

### Problem
When clicking the "ML Project" button, it always selected the same project (Red Wine Quality - WA1) instead of randomly selecting from all ML projects.

### Root Cause
The `get_random_project()` function was doing keyword matching even when the user requested random selection. The query contained words that matched better with WA1.

### Solution
Modified `get_random_project()` in `main.py.backend` to:
1. Detect random selection requests using `detect_random_selection_request()`
2. Skip keyword matching when random selection is requested
3. Truly randomize from all files in the filtered folder (ML_projects)

### Result
Now randomly selects from all 6 ML projects:
- WA1 (Red Wine Quality)
- WA2
- WA3
- WA4
- HW5
- HW6

---

## 7. "Hello there" Greeting Fix

**File:** `QUICK_DEPLOY.md` (mentioned)

### Problem
The "Hello there" greeting with General Kenobi response wasn't working.

### Solution
Added explicit greeting rule to the system prompt in `main.py.backend`:
- When user says "Hello there", the model responds with: "General Kenoooobiiii... I mean... Hi! How are you?"
- Made the greeting rule prominent in the system prompt

---

## 8. Quick Deployment Guide

**File:** `QUICK_DEPLOY.md`

### Overview
Simplified deployment guide with two options:
1. Use PowerShell script (`deploy-backend.ps1`)
2. Manual commands

### What Changed in Deployment
1. Fixed Random Project Selection
2. Fixed "Hello there" Greeting

### Verification Steps
1. Health check endpoint
2. View logs
3. Test chat functionality

---

## 9. Security Hardening

**File:** `SECURITY.md` (maintained separately)

### Changes Made
1. Removed unused API key definitions from `vite.config.ts`
2. Updated all deployment scripts to use environment variables
3. Created `.env.example` template
4. Enhanced `.gitignore` to exclude sensitive files
5. Removed all hardcoded API keys from documentation

### Best Practices
- Never commit API keys to Git
- Use environment variables
- Rotate keys if exposed
- Use different keys for different environments

---

## Current Deployment Status

### Backend
- **Platform:** Google Cloud Run
- **URL:** `https://virtual-persona-backend-831351726786.europe-west8.run.app`
- **Region:** `europe-west8`
- **Project ID:** `831351726786`
- **Repository:** `virtual-persona-repo`

### Frontend
- **Platform:** Railway
- **URL:** `https://virtual-me-chatbot-v2-production.up.railway.app`
- **Custom Domain:** `https://www.ppaltsokas.com` (if configured)

### Key Files
- `deploy-backend.ps1` - Backend deployment script
- `fix-cloud-run-key.ps1` - Fix Cloud Run API key script
- `update-cloud-run-key.ps1` - Update Cloud Run API key script
- `.env.local` - Local environment variables (not in git)

---

## Important Notes

1. **API Keys:** Always use environment variables, never hardcode
2. **CORS:** Must be updated in Cloud Run when frontend domain changes
3. **Deployment:** Use `deploy-backend.ps1` for easy backend deployments
4. **Security:** All API keys are stored server-side, never exposed to frontend
5. **Random Selection:** ML/Data Science project buttons now truly randomize

---

## Troubleshooting Quick Reference

### Backend not responding
- Check Cloud Run logs: `gcloud run services logs read virtual-persona-backend --region europe-west8 --limit 50`
- Verify environment variables are set correctly
- Check health endpoint: `curl https://virtual-persona-backend-831351726786.europe-west8.run.app/health`

### API key errors
- Verify key is set in `.env.local` (local) or Cloud Run (production)
- Check key is not malformed (no extra text appended)
- Get new key if old one was leaked

### CORS errors
- Update `ALLOWED_ORIGINS` in Cloud Run
- Include both localhost and production frontend URLs

### Deployment fails
- Check Artifact Registry permissions
- Verify billing is enabled
- Check Cloud Build service account has necessary roles

---

*This document was compiled from individual tracking files created during development and deployment.*

