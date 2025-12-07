# Deployment Guide - Virtual Persona CV

## 🚀 Quick Deployment Options

### Option 1: Railway (Easiest - Recommended) ⭐
**Best for:** Full-stack deployment in one place
- **Free tier:** Yes (with limits)
- **Setup time:** ~10 minutes
- **Deploys:** Both frontend and backend automatically

### Option 2: Google Cloud Run + Vercel (Best for GCP users)
**Best for:** Using your Google Cloud credits
- **Backend:** Google Cloud Run (FastAPI)
- **Frontend:** Vercel (free, automatic)
- **Setup time:** ~15 minutes

### Option 3: Render (Alternative)
**Best for:** Simple full-stack hosting
- **Free tier:** Yes
- **Setup time:** ~10 minutes

---

## 🎯 Recommended: Railway (Easiest)

### Why Railway?
- ✅ Deploys both frontend and backend
- ✅ Automatic deployments from GitHub
- ✅ Free tier available
- ✅ Environment variables management
- ✅ Simple setup

### Steps:

1. **Go to Railway**: https://railway.app
2. **Sign up with GitHub**
3. **New Project** → **Deploy from GitHub repo**
4. **Select your repository**: `virtual-me-chatbot-v2`
5. **Add Environment Variables:**
   - `GEMINI_API_KEY` = your API key
   - `PORT` = 8000 (for backend)
6. **Railway will auto-detect:**
   - Backend: Python/FastAPI
   - Frontend: Node.js/React
7. **Deploy!**

Railway will give you URLs for both services automatically.

---

## ☁️ Option 2: Google Cloud Run (Backend) + Vercel (Frontend)

> 📘 **New to Google Cloud?** See **[GCP_SETUP_GUIDE.md](./GCP_SETUP_GUIDE.md)** for detailed step-by-step instructions starting from the Google Cloud Console.

### Part A: Deploy Backend to Google Cloud Run

#### Prerequisites:
- Google Cloud account with Billing enabled
- Google Cloud SDK installed
- A Google Cloud project created

#### Initial Setup (One-time):

1. **Install Google Cloud SDK** (if not installed):
   ```powershell
   # Download from: https://cloud.google.com/sdk/docs/install
   # Or use winget:
   winget install Google.CloudSDK
   ```

2. **Authenticate and configure:**
   ```powershell
   # Login to GCP
   gcloud auth login
   
   # Set your project
   gcloud config set project <PROJECT_ID>
   
   # Set default region (example: europe-west8)
   gcloud config set run/region europe-west8
   
   # Enable required APIs
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
   ```

3. **Create Artifact Registry repository** (one-time setup):
   ```powershell
   gcloud artifacts repositories create virtual-persona-repo `
     --repository-format=docker `
     --location=europe-west8 `
     --description="Virtual Persona CV Docker images" || echo "Repository may already exist"
   ```

#### Build & Deploy:

**Note:** The `Dockerfile` is already included in this project and configured for Cloud Run.

1. **Build and tag by commit:**
   ```powershell
   # Windows PowerShell
   $commit = (git rev-parse --short HEAD)
   gcloud builds submit --tag europe-west8-docker.pkg.dev/<PROJECT_ID>/virtual-persona-repo/virtual-persona-backend:$commit
   ```

2. **Deploy to Cloud Run:**
   ```powershell
   gcloud run deploy virtual-persona-backend `
     --image europe-west8-docker.pkg.dev/<PROJECT_ID>/virtual-persona-repo/virtual-persona-backend:$commit `
     --region europe-west8 `
     --platform managed `
     --allow-unauthenticated `
     --port 8000 `
     --set-env-vars GEMINI_API_KEY=your_gemini_api_key_here,APP_ENV=prod
   ```

3. **Get your backend URL:**
   ```powershell
   gcloud run services describe virtual-persona-backend --region europe-west8 --format="value(status.url)"
   ```

4. **View logs:**
   ```powershell
   # Recent logs
   gcloud run services logs read virtual-persona-backend --region europe-west8 --limit 50
   
   # Live tail (real-time)
   gcloud beta run services logs tail virtual-persona-backend --region europe-west8
   ```

5. **Set reasonable resource limits** (optional, for cost optimization):
   ```powershell
   # Limit instances and resources
   gcloud run services update virtual-persona-backend --region europe-west8 --max-instances 3
   gcloud run services update virtual-persona-backend --region europe-west8 --cpu 1 --memory 512Mi --concurrency 80 --timeout 60
   ```

#### Important Notes:

- **Port Configuration**: Cloud Run automatically sets the `PORT` environment variable. The Dockerfile is configured to use `${PORT:-8080}`, but you can override with `--port 8000` in the deploy command (as shown above).
- **Ephemeral Storage**: Local data/persistence is ephemeral in Cloud Run. If you need persistent storage for knowledge base indexes, consider:
  - Using Google Cloud Storage for `rag.save_index()` / `rag.load_index()`
  - Using a database (Firestore, Cloud SQL) for persistent data
- **Environment Variables**: Set sensitive values like `GEMINI_API_KEY` using `--set-env-vars` or via the Cloud Console for better security.
- **Auto-deploy on commit**: You can set up Cloud Build triggers to automatically build and deploy on git push (see Cloud Build documentation).

#### Quick Reference - Complete Deployment Commands:

```powershell
# 1. Initial setup (one-time)
gcloud auth login
gcloud config set project <PROJECT_ID>
gcloud config set run/region europe-west8
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
gcloud artifacts repositories create virtual-persona-repo --repository-format=docker --location=europe-west8 --description="Virtual Persona CV Docker images" || echo "Repository exists"

# 2. Build & Deploy (run for each deployment)
$commit = (git rev-parse --short HEAD)
gcloud builds submit --tag europe-west8-docker.pkg.dev/<PROJECT_ID>/virtual-persona-repo/virtual-persona-backend:$commit
gcloud run deploy virtual-persona-backend --image europe-west8-docker.pkg.dev/<PROJECT_ID>/virtual-persona-repo/virtual-persona-backend:$commit --region europe-west8 --platform managed --allow-unauthenticated --port 8000 --set-env-vars GEMINI_API_KEY=your_key_here,APP_ENV=prod

# 3. Get URL
gcloud run services describe virtual-persona-backend --region europe-west8 --format="value(status.url)"

# 4. View logs
gcloud run services logs read virtual-persona-backend --region europe-west8 --limit 50
```

### Part B: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up with GitHub**
3. **Import your repository**
4. **Configure:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Add Environment Variable:**
   - Update `services/geminiService.ts` to use your Cloud Run URL
6. **Deploy!**

---

## 📝 Required Changes for Deployment

### 1. Update Frontend to Use Production Backend URL

Update `services/geminiService.ts`:

```typescript
// Add at the top
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Update fetch calls
const response = await fetch(`${API_URL}/health`);
const response = await fetch(`${API_URL}/chat`, { ... });
```

### 2. Update CORS in Backend

Update `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "https://your-vercel-app.vercel.app",  # Add your frontend URL
        "https://*.vercel.app",  # Or allow all Vercel subdomains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Create Production Environment File

For Railway/Render, add environment variables in their dashboard:
- `GEMINI_API_KEY`
- `PORT` (usually auto-set)
- `PUSHOVER_TOKEN` (optional)
- `PUSHOVER_USER` (optional)

---

## 🐳 Dockerfile for Backend (Cloud Run)

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

Create `.dockerignore`:

```
__pycache__
*.pyc
venv/
.env
.env.local
node_modules/
.git/
```

---

## 🚀 Quick Deploy Script (Railway)

Railway can auto-detect and deploy, but you can also create `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 📋 Deployment Checklist

- [ ] Update CORS settings in `main.py`
- [ ] Update API URL in frontend (use environment variable)
- [ ] Set environment variables in hosting platform
- [ ] Test backend health endpoint
- [ ] Test frontend connection to backend
- [ ] Verify knowledge base files are included
- [ ] Test chatbot functionality

---

## 🔗 After Deployment

1. **Backend URL**: `https://your-backend-url.com`
2. **Frontend URL**: `https://your-frontend-url.com`
3. **Update README** with live demo link
4. **Share your portfolio!** 🎉

---

## 💡 Pro Tips

1. **Use environment variables** for all URLs and keys
2. **Enable auto-deploy** from GitHub (push = deploy)
3. **Monitor logs** in your hosting platform
4. **Set up custom domain** (optional, for professional look)
5. **Use Cloud Run's free tier** - 2 million requests/month free!

---

## 🆘 Troubleshooting

### Backend not responding
- Check environment variables are set
- Verify CORS settings include frontend URL
- Check logs in hosting platform

### Frontend can't connect
- Verify backend URL is correct
- Check CORS settings
- Ensure backend is deployed and running

### Knowledge base not loading
- Verify all files are in repository
- Check file paths are correct
- Ensure PDF/image files are committed

---

## 🎯 My Recommendation

**Start with Railway** - it's the fastest and easiest:
1. Sign up with GitHub
2. Connect your repo
3. Add `GEMINI_API_KEY`
4. Deploy!

Takes ~10 minutes and you're live! 🚀

