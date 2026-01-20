# Namecheap + Railway Setup Guide for ppaltsokas.com

## ✅ Prerequisites (You have these!)
- ✅ ppaltsokas.com purchased on Namecheap
- ✅ Railway Hobby plan subscribed
- ✅ Frontend service deployed on Railway

## Step 1: Add Custom Domain in Railway

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Select your project (the one with your frontend service)

2. **Open Your Service**
   - Click on your frontend service
   - Go to **Settings** tab (gear icon)
   - Scroll down to **Networking** section

3. **Add Custom Domain**
   - Click **"Generate Domain"** or **"Add Domain"** button
   - In the domain input field, enter: `www.ppaltsokas.com`
   - Railway will automatically generate an SSL certificate
   - **Important**: Railway will show you DNS records - write these down!

4. **What Railway Will Show You**
   - Railway typically provides one of these:
     - **CNAME record**: `www` → `something.up.railway.app`
     - **A record**: IP address for root domain
   - **Copy the target/URL** that Railway provides

**⚠️ STOP HERE** - Don't proceed to Step 2 until Railway shows you the DNS records and you've copied them down!

---

## Step 2: Configure DNS in Namecheap

### A. Login to Namecheap

1. Go to https://www.namecheap.com
2. Login to your account
3. Go to **Domain List** (or **Account** → **Domain List**)

### B. Access DNS Settings

1. Find **ppaltsokas.com** in your domain list
2. Click **"Manage"** button next to it
3. Go to **"Advanced DNS"** tab

### C. Add CNAME Record for www

1. In the **"Host Records"** section, click **"Add New Record"**
2. Select **CNAME Record**
3. Fill in:
   - **Host**: `www`
   - **Value**: `your-app.up.railway.app` (the URL Railway gave you - copy it exactly!)
   - **TTL**: `Automatic` (or `3600` seconds)
4. Click the **green checkmark** to save

### D. Add A Record for Root Domain (ppaltsokas.com)

**Option 1: Redirect to www (Recommended)**

Namecheap supports URL redirects:
1. Go to **"Redirect Domain"** tab in Namecheap
2. Enable **"301 Redirect"**
3. Redirect **ppaltsokas.com** → **www.ppaltsokas.com**
4. Save

**Option 2: Use Railway's IP (if provided)**

If Railway gave you an IP address for root domain:
1. In **"Advanced DNS"** tab, add new record
2. Select **A Record**
3. Fill in:
   - **Host**: `@`
   - **Value**: `<IP address Railway provided>`
   - **TTL**: `Automatic`
4. Save

**✅ After this step**: DNS changes can take 5-30 minutes to propagate

---

## Step 3: Update Backend CORS Settings

The backend code is already updated, but we need to deploy it or update Cloud Run environment variables.

### Option A: Update Cloud Run Environment Variable (Quickest)

**Via Google Cloud Console:**
1. Go to https://console.cloud.google.com
2. Navigate to **Cloud Run**
3. Select service: `virtual-persona-backend`
4. Click **"EDIT & DEPLOY NEW REVISION"**
5. Go to **"Variables & Secrets"** tab
6. Find `ALLOWED_ORIGINS` or add it:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `https://www.ppaltsokas.com,https://ppaltsokas.com,https://virtual-me-chatbot-v2-production.up.railway.app,http://localhost:5173`
7. Click **"DEPLOY"**

**Via Command Line (if you have gcloud CLI):**
```powershell
gcloud run services update virtual-persona-backend `
    --region europe-west8 `
    --update-env-vars "ALLOWED_ORIGINS=https://www.ppaltsokas.com,https://ppaltsokas.com,https://virtual-me-chatbot-v2-production.up.railway.app,http://localhost:5173"
```

---

## Step 4: Update Frontend Environment Variable in Railway

1. In **Railway Dashboard**, select your frontend service
2. Go to **Variables** tab
3. Find or add `VITE_API_URL`
4. Set value to your Cloud Run backend URL:
   ```
   https://virtual-persona-backend-831351726786.europe-west8.run.app
   ```
   (Check your actual Cloud Run URL if different)
5. **Save** - Railway will automatically redeploy

---

## Step 5: Verify Everything Works

### Wait for DNS Propagation (5-30 minutes)

**Check DNS propagation:**
- Visit: https://www.whatsmydns.net/#CNAME/www.ppaltsokas.com
- Or use command line:
  ```powershell
  nslookup www.ppaltsokas.com
  ```

### Test Your Domain

1. **Visit your domain**: `https://www.ppaltsokas.com`
2. **Check SSL**: Should see padlock icon (HTTPS working)
3. **Test page load**: Frontend should load correctly
4. **Test chatbot**: Open chat and send a test message
5. **Check browser console** (F12): Should see no CORS errors

### Troubleshooting

**Domain not loading?**
- Wait longer (DNS can take up to 48 hours, usually 5-30 minutes)
- Verify DNS records in Namecheap are correct
- Check Railway dashboard shows domain as "Active"

**SSL Certificate not working?**
- Railway generates SSL automatically (takes ~1-2 minutes)
- Check Railway dashboard for SSL status
- Make sure DNS is fully propagated first

**CORS Errors?**
- Verify `ALLOWED_ORIGINS` in Cloud Run includes your domain
- Check browser console for exact error
- Verify backend is running and accessible

**Chatbot not connecting?**
- Check `VITE_API_URL` in Railway variables
- Verify backend health: `https://your-backend.run.app/health`
- Check browser network tab for request errors

---

## Step 6: Deploy Updated Backend Code (Optional)

If you want to deploy the new security features:

1. **Push code to GitHub** (if not already done)
   ```powershell
   git push origin main
   ```

2. **Deploy to Cloud Run**
   - Use your deployment script: `.\deploy-backend.ps1`
   - Or use Google Cloud Console

3. **Verify security measures are active**
   - Test rate limiting (make 21 requests quickly)
   - Check backend logs for security features

---

## Success Checklist

- [ ] Domain added in Railway
- [ ] CNAME record added in Namecheap for www
- [ ] Root domain redirect configured in Namecheap
- [ ] DNS propagated (verified with nslookup or online tool)
- [ ] SSL certificate active on Railway
- [ ] Frontend loads at https://www.ppaltsokas.com
- [ ] Backend CORS updated in Cloud Run
- [ ] Frontend VITE_API_URL updated in Railway
- [ ] Chatbot connects successfully
- [ ] No CORS errors in browser console

---

## Next Steps After Setup

1. **Update README.md** with your live domain
2. **Test all features** thoroughly
3. **Monitor logs** for first few days
4. **Set up monitoring** (Railway provides basic metrics)

---

**Need Help?**
- Railway Support: Available in Railway dashboard
- Namecheap Support: https://www.namecheap.com/support/
- Check Railway docs: https://docs.railway.app/deploy/custom-domains
