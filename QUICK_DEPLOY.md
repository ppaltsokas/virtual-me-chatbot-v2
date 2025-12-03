# 🚀 Quick Deploy Guide - Choose Your Platform

## ⚡ Fastest Option: Railway (Recommended)

**Time:** ~10 minutes | **Cost:** Free tier available

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `virtual-me-chatbot-v2`
5. Add environment variable: `GEMINI_API_KEY` = your key
6. Railway auto-detects and deploys both frontend & backend!
7. Done! 🎉

Railway gives you URLs for both services automatically.

---

## ☁️ Google Cloud Run (Use Your GCP Credits)

**Time:** ~15 minutes | **Cost:** Free tier (2M requests/month)

### Deploy Backend to Cloud Run:

```powershell
# 1. Install Google Cloud CLI (if needed)
# Download: https://cloud.google.com/sdk/docs/install

# 2. Login
gcloud auth login

# 3. Set your project
gcloud config set project YOUR_PROJECT_ID

# 4. Deploy (this builds and deploys automatically)
gcloud run deploy virtual-persona-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here \
  --port 8080

# 5. Get your backend URL (shown after deployment)
# Example: https://virtual-persona-backend-xxx.run.app
```

### Deploy Frontend to Vercel (Free):

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import `virtual-me-chatbot-v2` repository
4. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output: `dist`
5. Add environment variable:
   - `VITE_API_URL` = your Cloud Run URL (from step 5 above)
6. Deploy!

---

## 📝 Environment Variables Needed

### Backend (Railway/Cloud Run):
- `GEMINI_API_KEY` - Your Google Gemini API key
- `PORT` - Usually auto-set (8080 for Cloud Run)
- `ALLOWED_ORIGINS` - Comma-separated frontend URLs (optional)

### Frontend (Vercel):
- `VITE_API_URL` - Your backend URL (e.g., `https://your-backend.run.app`)

---

## ✅ After Deployment

1. **Test your backend**: Visit `https://your-backend-url/health`
2. **Test your frontend**: Visit your frontend URL
3. **Try the chatbot** - it should connect to your backend!

---

## 🎯 My Recommendation

**Start with Railway** - it's the absolute easiest:
- One platform for everything
- Auto-detects your stack
- Free tier
- Automatic deployments from GitHub

Then if you want to use Google Cloud credits later, you can migrate to Cloud Run.

---

## 🆘 Need Help?

Check `DEPLOYMENT.md` for detailed instructions and troubleshooting.

