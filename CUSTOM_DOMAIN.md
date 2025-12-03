# Setting Up Custom Domain: www.ppaltsokas.com

## 🎯 Step 1: Find Your Deployment URLs

Your app is deployed! You should see URLs in your Railway dashboard (or whatever platform you used).

**Look for:**
- **Frontend URL**: Something like `https://virtual-me-chatbot-v2-production.up.railway.app`
- **Backend URL**: Something like `https://virtual-me-chatbot-v2-backend.up.railway.app`

---

## 🌐 Step 2: Set Up Custom Domain

### Option A: Railway (If you used Railway)

1. **Go to your Railway project dashboard**
2. **Click on your service** (frontend or backend)
3. **Go to "Settings" tab**
4. **Find "Domains" section**
5. **Click "Add Domain"**
6. **Enter:** `www.ppaltsokas.com`
7. **Railway will give you DNS records to add**

### Option B: Google Cloud Run (If you used GCP)

1. **Go to Cloud Run console**
2. **Select your service**
3. **Go to "Manage Custom Domains"**
4. **Add domain:** `www.ppaltsokas.com`
5. **Follow the DNS setup instructions**

---

## 📝 Step 3: Configure DNS Records

You need to add DNS records at your domain registrar (where you bought `ppaltsokas.com`).

### For Railway:

**Add a CNAME record:**
- **Type:** CNAME
- **Name:** www
- **Value:** (Railway will provide this, usually something like `cname.railway.app`)
- **TTL:** 3600 (or default)

**Optional - Root domain (ppaltsokas.com):**
- **Type:** A
- **Name:** @
- **Value:** (Railway will provide IP address)
- **TTL:** 3600

### For Google Cloud Run:

**Add a CNAME record:**
- **Type:** CNAME
- **Name:** www
- **Value:** (Cloud Run will provide this)
- **TTL:** 3600

---

## 🔧 Step 4: Update Frontend Environment Variable

Once your domain is set up, update your frontend to use the custom domain for the backend:

1. **In Railway/Vercel dashboard:**
   - Go to your frontend service
   - Environment Variables
   - Update `VITE_API_URL` to: `https://api.ppaltsokas.com` (or your backend custom domain)

2. **Or if using subdomain:**
   - `VITE_API_URL` = `https://backend.ppaltsokas.com`

---

## ⚙️ Step 5: Update Backend CORS

Update your backend to allow your custom domain:

1. **In Railway/Cloud Run dashboard:**
   - Go to your backend service
   - Environment Variables
   - Update `ALLOWED_ORIGINS` to:
     ```
     https://www.ppaltsokas.com,https://ppaltsokas.com
     ```

2. **Or update in code** (if needed):
   - The code already reads from `ALLOWED_ORIGINS` environment variable
   - Just set it in your hosting platform

---

## ✅ Step 6: Wait for DNS Propagation

- DNS changes can take **5 minutes to 48 hours** to propagate
- Usually takes **15-30 minutes**
- Check propagation: https://www.whatsmydns.net

---

## 🧪 Step 7: Test Your Domain

Once DNS propagates:

1. **Visit:** `https://www.ppaltsokas.com`
2. **Test the chatbot** - it should connect to your backend
3. **Check browser console** for any errors

---

## 🔒 Step 8: SSL Certificate

Most platforms (Railway, Cloud Run, Vercel) automatically provide SSL certificates for custom domains. Just wait a few minutes after adding the domain.

---

## 📋 Quick Checklist

- [ ] Found deployment URLs
- [ ] Added custom domain in hosting platform
- [ ] Added DNS records at domain registrar
- [ ] Updated `VITE_API_URL` environment variable
- [ ] Updated `ALLOWED_ORIGINS` environment variable
- [ ] Waited for DNS propagation
- [ ] Tested the domain
- [ ] Updated README with live URL

---

## 🆘 Troubleshooting

### Domain not working?
- Check DNS records are correct
- Wait longer for propagation
- Check SSL certificate is issued (may take 5-10 minutes)

### Backend not connecting?
- Verify `VITE_API_URL` is set correctly
- Check CORS settings include your domain
- Check browser console for errors

### SSL certificate issues?
- Wait 5-10 minutes after adding domain
- Some platforms need you to verify domain ownership first

---

## 💡 Pro Tips

1. **Use subdomain for backend**: `api.ppaltsokas.com` (cleaner)
2. **Set up redirect**: `ppaltsokas.com` → `www.ppaltsokas.com`
3. **Update README** with your live URL once it's working
4. **Test on mobile** to ensure responsive design works

---

## 📞 Need Help?

- **Railway Support**: https://railway.app/docs
- **Google Cloud Support**: https://cloud.google.com/support
- **DNS Help**: Check your domain registrar's documentation

