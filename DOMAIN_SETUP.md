# Domain Setup Guide: ppaltsokas.com

This guide walks you through setting up your custom domain `ppaltsokas.com` on Railway and configuring it properly.

## Prerequisites

- ✅ Railway account (frontend is already deployed)
- ✅ Domain `ppaltsokas.com` registered with a domain registrar
- ✅ Access to domain DNS settings
- ✅ Cloud Run backend deployed (already done)

## Step 1: Configure Custom Domain in Railway

1. **Go to Railway Dashboard**
   - Navigate to https://railway.app
   - Select your project: `virtual-me-chatbot-v2-production`

2. **Open Service Settings**
   - Click on your frontend service
   - Go to **Settings** tab
   - Scroll to **Networking** section

3. **Add Custom Domain**
   - Click **Add Domain** or **Generate Domain**
   - Enter your domain: `www.ppaltsokas.com`
   - Railway will generate SSL certificate automatically (takes ~1 minute)

4. **Railway will show you DNS records**
   - Railway will display something like:
     - **CNAME**: `www` → `your-app.up.railway.app`
     - **Or A record** with IP address

## Step 2: Configure DNS at Your Domain Registrar

You need to add DNS records at your domain registrar (where you bought ppaltsokas.com).

### Option A: Using CNAME (Recommended)

1. **Login to your domain registrar** (Namecheap, GoDaddy, Google Domains, etc.)

2. **Go to DNS Management**
   - Find DNS settings or DNS management section
   - Look for "DNS Records" or "Advanced DNS"

3. **Add CNAME Record**
   - **Type**: CNAME
   - **Host/Name**: `www`
   - **Value/Target**: `your-app.up.railway.app` (the Railway-provided URL)
   - **TTL**: 3600 (or default)

4. **Add A Record for root domain** (optional but recommended)
   - **Type**: A
   - **Host/Name**: `@` or leave blank
   - **Value/Target**: Railway will provide an IP address (if they support A records)
   - **Or**: Use Railway's root domain redirect

### Option B: Railway's Root Domain Redirect

If Railway supports root domain redirect:
- Add A record pointing `@` to Railway's IP
- Or use Railway's DNS service (if available)

**Note**: Some registrars have different UIs, but the concept is the same:
- CNAME record: `www` → Railway URL
- A record: `@` → Railway IP (if needed)

## Step 3: Update Backend CORS Settings

The backend is already configured to accept `https://www.ppaltsokas.com` and `https://ppaltsokas.com`.

To verify/update Cloud Run environment variables:

1. **Go to Google Cloud Console**
   - Navigate to Cloud Run
   - Select service: `virtual-persona-backend`
   - Click **Edit & Deploy New Revision**

2. **Update Environment Variables**
   - Find `ALLOWED_ORIGINS` environment variable
   - Make sure it includes:
     ```
     https://www.ppaltsokas.com,https://ppaltsokas.com,https://virtual-me-chatbot-v2-production.up.railway.app,http://localhost:5173
     ```
   - Click **Deploy**

Or update via command line:
```bash
gcloud run services update virtual-persona-backend \
    --region europe-west8 \
    --update-env-vars "ALLOWED_ORIGINS=https://www.ppaltsokas.com,https://ppaltsokas.com,https://virtual-me-chatbot-v2-production.up.railway.app,http://localhost:5173"
```

## Step 4: Update Frontend Environment Variable (Railway)

Update the frontend `VITE_API_URL` to point to your backend:

1. **In Railway Dashboard**
   - Select your frontend service
   - Go to **Variables** tab
   - Find `VITE_API_URL`
   - Update to your Cloud Run backend URL:
     ```
     https://virtual-persona-backend-831351726786.europe-west8.run.app
     ```
   - Save and redeploy

## Step 5: Verify DNS Propagation

DNS changes can take 5 minutes to 48 hours to propagate, but usually takes 5-15 minutes.

**Check DNS propagation:**
```bash
# Check CNAME record
dig www.ppaltsokas.com CNAME

# Or use online tools:
# https://www.whatsmydns.net/#CNAME/www.ppaltsokas.com
```

**Test your domain:**
1. Wait 5-15 minutes after DNS changes
2. Visit `https://www.ppaltsokas.com`
3. Check if SSL certificate is active (padlock icon in browser)
4. Test the chatbot functionality

## Step 6: Test Everything

After DNS propagates:

1. **Test HTTPS**
   - Visit `https://www.ppaltsokas.com`
   - Verify SSL certificate (should show Railway or Let's Encrypt)

2. **Test Frontend**
   - Page should load correctly
   - Check browser console for errors

3. **Test Backend Connection**
   - Open chat interface
   - Send a test message
   - Verify it connects to backend successfully

4. **Test CORS**
   - If you see CORS errors in console, check backend CORS settings
   - Backend logs will show allowed origins

## Troubleshooting

### Domain not resolving
- **Wait longer**: DNS can take up to 48 hours (usually 5-15 minutes)
- **Check DNS records**: Verify CNAME/A records are correct
- **Check TTL**: Lower TTL for faster updates (300-600 seconds)

### SSL Certificate Issues
- Railway automatically generates SSL certificates
- May take 1-2 minutes after domain is configured
- If issues persist, check Railway dashboard for SSL status

### CORS Errors
- Verify `ALLOWED_ORIGINS` in Cloud Run includes your domain
- Check browser console for exact CORS error
- Backend logs will show which origin was rejected

### Backend Not Connecting
- Verify `VITE_API_URL` in Railway is correct
- Check backend health endpoint: `https://your-backend.run.app/health`
- Check browser network tab for request errors

### Rate Limiting Issues
- Current limit: 20 requests/minute per IP
- If you hit the limit, wait 1 minute
- Check backend logs for rate limit violations

## Security Measures Implemented

✅ **Rate Limiting**: 20 requests/minute per IP
✅ **Message Length Validation**: Max 2000 characters
✅ **IP Blocking**: Automatic blocking after 10 failed requests (1 hour)
✅ **CORS Protection**: Only allowed origins can access API
✅ **Jailbreak Detection**: Monitors for prompt injection attempts
✅ **Spam Prevention**: Tracks failed requests and blocks abusive IPs

## After Setup

Once everything is working:

1. **Update README.md** with your live domain
2. **Test all features** thoroughly
3. **Monitor logs** for first few days
4. **Set up monitoring** (Railway provides basic metrics)

## Next Steps

Consider adding:
- **Cloudflare** (optional): Free DDOS protection and faster DNS
- **Monitoring**: Set up alerts for errors/rate limits
- **Analytics**: Track usage (optional, privacy-conscious)

---

**Need Help?**
- Railway Docs: https://docs.railway.app/deploy/custom-domains
- DNS Propagation Check: https://www.whatsmydns.net
- Railway Support: Available in dashboard
