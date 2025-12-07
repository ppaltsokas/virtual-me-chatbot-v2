# Railway Frontend Deployment - Complete Guide

## ✅ Configuration Files Updated

I've updated the following files for frontend deployment on Railway:

1. **`nixpacks.toml`** - Changed from Python to Node.js, builds React app
2. **`railway.json`** - Updated for frontend deployment
3. **`Procfile`** - Updated for frontend serving

## 📋 What You Need to Do in Railway Dashboard

### Step 1: Verify Environment Variables

Go to Railway Dashboard → Your Service → **Variables** tab:

Make sure these are set:
- ✅ `VITE_API_URL` = `https://virtual-persona-backend-831351726786.europe-west8.run.app`
- ✅ `GEMINI_API_KEY` = (your key - should already be set)
- Optional: `NODE_ENV` = `production`

### Step 2: Verify Build Settings

Go to Railway Dashboard → Your Service → **Settings** → **Build**:

- **Builder**: Should be "Nixpacks" (auto-detected)
- **Build Command**: Leave empty (uses nixpacks.toml)
- **Start Command**: Leave empty (uses nixpacks.toml)

### Step 3: Commit and Push to GitHub

Railway auto-deploys from GitHub. After you commit these changes:

```powershell
git add nixpacks.toml railway.json Procfile
git commit -m "Configure Railway for frontend deployment"
git push
```

Railway will automatically:
1. Detect the changes
2. Build the React app (`npm run build`)
3. Serve it with Vite preview
4. Deploy to your domain

### Step 4: Update Cloud Run CORS (Manual)

The CORS update needs to be done manually due to PowerShell escaping issues. Run this in your terminal:

```powershell
gcloud run services update virtual-persona-backend `
  --region europe-west8 `
  --update-env-vars ALLOWED_ORIGINS="http://localhost:3000,https://www.ppaltsokas.com,https://virtual-me-chatbot-v2-production.up.railway.app"
```

**OR** if that doesn't work, use the Cloud Console:
1. Go to: https://console.cloud.google.com/run
2. Click on `virtual-persona-backend`
3. Click "Edit & Deploy New Revision"
4. Go to "Variables & Secrets"
5. Add/Update `ALLOWED_ORIGINS` with:
   ```
   http://localhost:3000,https://www.ppaltsokas.com,https://virtual-me-chatbot-v2-production.up.railway.app
   ```
6. Click "Deploy"

## 🚀 Deployment Process

1. **Railway detects changes** from GitHub
2. **Builds the React app** using `npm run build`
3. **Serves static files** using `vite preview`
4. **Deploys to your domain**: `www.ppaltsokas.com` or Railway URL

## ✅ Testing Checklist

After deployment:

- [ ] Visit Railway URL: `https://virtual-me-chatbot-v2-production.up.railway.app`
- [ ] Check if frontend loads
- [ ] Open browser console (F12) - check for errors
- [ ] Test chat interface - should connect to Cloud Run backend
- [ ] Test CV download
- [ ] Test project PDF links
- [ ] Verify no CORS errors in console

## 🔧 Troubleshooting

### Build Fails
- Check Railway logs
- Verify `package.json` has all dependencies
- Make sure Node.js version is compatible

### Frontend Can't Connect to Backend
- Check `VITE_API_URL` is set correctly in Railway
- Verify Cloud Run CORS includes Railway domain
- Check browser console for CORS errors

### 404 Errors
- Make sure `vite preview` is serving from `dist` folder
- Check that build completed successfully

## 📝 Summary

**Backend**: Google Cloud Run ✅
- URL: `https://virtual-persona-backend-831351726786.europe-west8.run.app`
- API Key: Configured ✅

**Frontend**: Railway ✅
- Configuration: Updated ✅
- Environment Variables: Need to verify in dashboard
- CORS: Need to update in Cloud Run

**Next Steps**:
1. Verify Railway environment variables
2. Commit and push changes to GitHub
3. Update Cloud Run CORS (manually)
4. Wait for Railway to deploy
5. Test your site!

