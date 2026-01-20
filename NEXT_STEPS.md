# Next Steps for ppaltsokas.com Setup

Your domain is working! Now we need to complete the backend integration.

## ✅ What I've Done

1. ✅ Updated README.md with your live domain (www.ppaltsokas.com)
2. ✅ Pushed code to GitHub
3. ✅ Backend code already includes your domain in CORS defaults

## 🔧 What You Need to Do

### Step 1: Update Backend CORS in Cloud Run

**Action Required:** Update the `ALLOWED_ORIGINS` environment variable in Cloud Run.

**Option A: Via Google Cloud Console (Easiest)**

1. Go to https://console.cloud.google.com
2. Navigate to **Cloud Run** → Select `virtual-persona-backend` service
3. Click **"EDIT & DEPLOY NEW REVISION"** (top right)
4. Go to **"Variables & Secrets"** tab
5. Find `ALLOWED_ORIGINS` environment variable OR add it:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `https://www.ppaltsokas.com,https://ppaltsokas.com,https://virtual-me-chatbot-v2-production.up.railway.app,http://localhost:5173`
6. Click **"DEPLOY"** (bottom of page)
7. Wait for deployment to complete (~1-2 minutes)

**Option B: Via Command Line** (if you have gcloud CLI installed)

```powershell
gcloud run services update virtual-persona-backend `
    --region europe-west8 `
    --update-env-vars "ALLOWED_ORIGINS=https://www.ppaltsokas.com,https://ppaltsokas.com,https://virtual-me-chatbot-v2-production.up.railway.app,http://localhost:5173"
```

---

### Step 2: Verify Frontend Environment Variable in Railway

**Action Required:** Check that `VITE_API_URL` is set correctly in Railway.

1. Go to **Railway Dashboard**: https://railway.app
2. Select your **frontend service** (virtual-me-chatbot-v2-production)
3. Go to **Variables** tab
4. Check if `VITE_API_URL` exists:
   - **If it exists**: Verify it points to your Cloud Run backend:
     ```
     https://virtual-persona-backend-831351726786.europe-west8.run.app
     ```
     (Replace with your actual Cloud Run URL if different)
   - **If it doesn't exist**: Add it:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://virtual-persona-backend-831351726786.europe-west8.run.app`
5. Save changes (Railway will automatically redeploy)

---

### Step 3: Test Everything

After completing Steps 1 and 2:

1. **Visit your site**: https://www.ppaltsokas.com
2. **Open browser console** (F12) → Console tab
3. **Open the chat interface**
4. **Send a test message**: "Hello"
5. **Check for errors**:
   - ✅ No CORS errors in console
   - ✅ Chatbot responds correctly
   - ✅ Network tab shows successful requests to backend

**If you see CORS errors:**
- Verify Step 1 was completed correctly
- Check backend logs in Cloud Run
- Make sure the domain in `ALLOWED_ORIGINS` matches exactly (including https://)

---

### Step 4: Deploy Updated Backend Code (Optional - Recommended)

The backend code has new security features (rate limiting, IP blocking, etc.).

**Action Required:** Deploy the updated backend code to Cloud Run.

**If you have a deployment script:**
```powershell
.\deploy-backend.ps1
```

**Or manually:**
1. Push code to GitHub (already done ✅)
2. Use Google Cloud Console to deploy from source
3. Or use gcloud CLI to deploy

---

## 🎯 Priority Order

1. **CRITICAL**: Step 1 - Update Cloud Run CORS (otherwise chatbot won't work)
2. **IMPORTANT**: Step 2 - Verify Railway environment variable
3. **VERIFY**: Step 3 - Test everything works
4. **OPTIONAL**: Step 4 - Deploy security features

---

## 📋 Checklist

- [ ] Updated `ALLOWED_ORIGINS` in Cloud Run
- [ ] Verified `VITE_API_URL` in Railway
- [ ] Tested chatbot on www.ppaltsokas.com
- [ ] No CORS errors in browser console
- [ ] Chatbot connects and responds correctly
- [ ] (Optional) Deployed updated backend code with security features

---

**Need Help?**

If you run into any issues:
- Check backend logs in Cloud Run
- Check browser console for errors
- Verify environment variables are set correctly
- Make sure DNS has fully propagated

---

**Once you complete Steps 1 and 2, let me know and I can help verify everything is working!**
