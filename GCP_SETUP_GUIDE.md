# Google Cloud Platform Setup Guide - Step by Step

## 🎯 Current Status
You're at the **Credentials** page for your project **"VirtualPersonaCV"**. 

**Good news:** For Cloud Run deployment, you don't need to create API keys or OAuth clients from this page. We'll use the Google Cloud CLI instead.

---

## 📋 Step-by-Step Setup

### Step 1: Enable Required APIs

1. **From the left sidebar**, click on **"Library"** (under "APIs & Services")
   - This will take you to the API Library page

2. **Search for and enable these APIs** (one by one):
   
   **a) Cloud Run API:**
   - Search for: `Cloud Run API`
   - Click on it
   - Click the **"Enable"** button
   - Wait for it to enable (may take 10-30 seconds)

   **b) Cloud Build API:**
   - Go back to Library (or search again)
   - Search for: `Cloud Build API`
   - Click on it
   - Click the **"Enable"** button

   **c) Artifact Registry API:**
   - Go back to Library
   - Search for: `Artifact Registry API`
   - Click on it
   - Click the **"Enable"** button

3. **Verify APIs are enabled:**
   - Go back to **"Enabled APIs & services"** (left sidebar)
   - You should see all three APIs listed there

---

### Step 2: Verify Billing is Enabled

1. **Click the hamburger menu** (☰) in the top-left corner
2. Go to **"Billing"**
3. **Make sure billing is linked** to your project
   - If not, click **"Link a billing account"** and follow the prompts
   - ⚠️ **Note:** Cloud Run has a free tier (2 million requests/month), but billing must be enabled

---

### Step 3: Get Your Project ID

You'll need your Project ID for the deployment commands. You can find it:

1. **From the top bar** - Look at the project dropdown (currently shows "VirtualPersonaCV")
2. **Click on it** - It will show your Project ID (usually looks like: `virtual-persona-cv-123456` or similar)
3. **Copy the Project ID** - You'll need this for the commands below

**OR** you can find it in:
- Go to **"IAM & Admin"** → **"Settings"** in the left sidebar
- The Project ID is displayed there

---

### Step 4: Install Google Cloud SDK (if not already installed)

**Check if you have it:**
```powershell
gcloud --version
```

**If not installed, install it:**

**Option A: Using winget (Windows):**
```powershell
winget install Google.CloudSDK
```

**Option B: Download installer:**
1. Go to: https://cloud.google.com/sdk/docs/install
2. Download the Windows installer
3. Run the installer and follow the prompts

**After installation, restart your terminal/PowerShell**

---

### Step 5: Authenticate and Configure gcloud CLI

Open **PowerShell** (as Administrator if possible) and run:

```powershell
# 1. Login to Google Cloud
gcloud auth login

# This will open a browser window - sign in with your Google account
# Grant permissions when prompted
```

**After login, configure your project:**

```powershell
# 2. Set your project (replace <PROJECT_ID> with your actual Project ID from Step 3)
gcloud config set project <PROJECT_ID>

# Example:
# gcloud config set project virtual-persona-cv-123456

# 3. Set default region (europe-west8 as in your example, or choose another)
gcloud config set run/region europe-west8

# 4. Verify your configuration
gcloud config list
```

**You should see:**
- `project = <your-project-id>`
- `region = europe-west8`

---

### Step 6: Enable APIs via CLI (Alternative/Verification)

Even though you enabled them in the console, you can also enable them via CLI:

```powershell
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
```

This will confirm they're enabled and show any errors if something went wrong.

---

### Step 7: Create Artifact Registry Repository

This is where your Docker images will be stored:

```powershell
gcloud artifacts repositories create virtual-persona-repo `
  --repository-format=docker `
  --location=europe-west8 `
  --description="Virtual Persona CV Docker images"
```

**Note:** If you get an error saying it already exists, that's fine - you can skip this step.

---

### Step 8: Prepare Your Gemini API Key

You'll need your Gemini API Key for deployment. Make sure you have it ready:

1. If you don't have one, get it from: https://makersuite.google.com/app/apikey
2. **Copy the API key** - you'll use it in the deployment command

---

### Step 9: Deploy Your Application

**Navigate to your project directory:**
```powershell
cd "F:\Virtual Persona CV"
```

**Build and deploy:**

```powershell
# 1. Get your commit hash (for tagging the image)
$commit = (git rev-parse --short HEAD)

# 2. Build the Docker image and push to Artifact Registry
# Replace <PROJECT_ID> with your actual Project ID
gcloud builds submit --tag europe-west8-docker.pkg.dev/<PROJECT_ID>/virtual-persona-repo/virtual-persona-backend:$commit

# Example:
# gcloud builds submit --tag europe-west8-docker.pkg.dev/virtual-persona-cv-123456/virtual-persona-repo/virtual-persona-backend:$commit

# 3. Deploy to Cloud Run
# Replace <PROJECT_ID> with your actual Project ID
# Replace <YOUR_GEMINI_API_KEY> with your actual Gemini API key
gcloud run deploy virtual-persona-backend `
  --image europe-west8-docker.pkg.dev/<PROJECT_ID>/virtual-persona-repo/virtual-persona-backend:$commit `
  --region europe-west8 `
  --platform managed `
  --allow-unauthenticated `
  --port 8000 `
  --set-env-vars GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>,APP_ENV=prod

# Example:
# gcloud run deploy virtual-persona-backend `
#   --image europe-west8-docker.pkg.dev/virtual-persona-cv-123456/virtual-persona-repo/virtual-persona-backend:$commit `
#   --region europe-west8 `
#   --platform managed `
#   --allow-unauthenticated `
#   --port 8000 `
#   --set-env-vars GEMINI_API_KEY=AIzaSy...,APP_ENV=prod
```

**This will take a few minutes:**
- Building the Docker image (~2-5 minutes)
- Pushing to Artifact Registry (~1-2 minutes)
- Deploying to Cloud Run (~1-2 minutes)

---

### Step 10: Get Your Deployment URL

After deployment completes, get your service URL:

```powershell
gcloud run services describe virtual-persona-backend --region europe-west8 --format="value(status.url)"
```

**This will output something like:**
```
https://virtual-persona-backend-xxxxx-ew.a.run.app
```

**🎉 Your backend is now live!**

---

### Step 11: Test Your Deployment

1. **Test the health endpoint:**
   ```powershell
   # Replace <YOUR_URL> with the URL from Step 10
   curl https://<YOUR_URL>/health
   ```

   Or open it in your browser - you should see a JSON response.

2. **View logs:**
   ```powershell
   gcloud run services logs read virtual-persona-backend --region europe-west8 --limit 50
   ```

---

### Step 12: (Optional) Set Resource Limits

To optimize costs, you can limit resources:

```powershell
# Limit max instances
gcloud run services update virtual-persona-backend --region europe-west8 --max-instances 3

# Set CPU, memory, and timeout
gcloud run services update virtual-persona-backend --region europe-west8 --cpu 1 --memory 512Mi --concurrency 80 --timeout 60
```

---

## 🔄 For Future Deployments

When you make changes and want to redeploy:

```powershell
# Navigate to project
cd "F:\Virtual Persona CV"

# Get new commit hash
$commit = (git rev-parse --short HEAD)

# Build and deploy (replace <PROJECT_ID> with your Project ID)
gcloud builds submit --tag europe-west8-docker.pkg.dev/<PROJECT_ID>/virtual-persona-repo/virtual-persona-backend:$commit
gcloud run deploy virtual-persona-backend `
  --image europe-west8-docker.pkg.dev/<PROJECT_ID>/virtual-persona-repo/virtual-persona-backend:$commit `
  --region europe-west8 `
  --platform managed `
  --allow-unauthenticated `
  --port 8000 `
  --set-env-vars GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>,APP_ENV=prod
```

---

## 🆘 Troubleshooting

### "API not enabled" error
- Go back to Step 1 and make sure all APIs are enabled
- Or run: `gcloud services enable <api-name>`

### "Permission denied" error
- Make sure you're logged in: `gcloud auth login`
- Verify project: `gcloud config get-value project`

### "Billing not enabled" error
- Go to Step 2 and link a billing account

### Build fails
- Check that your Dockerfile exists and is correct
- Verify you're in the project root directory
- Check logs: `gcloud builds list --limit=1`

### Service won't start
- Check logs: `gcloud run services logs read virtual-persona-backend --region europe-west8 --limit 50`
- Verify GEMINI_API_KEY is set correctly
- Check that port 8000 matches your application

---

## 📝 Quick Reference

**Your Project ID:** `<PROJECT_ID>` (from Step 3)

**Your Region:** `europe-west8`

**Your Service Name:** `virtual-persona-backend`

**Your Repository:** `virtual-persona-repo`

---

## ✅ Checklist

- [ ] Step 1: APIs enabled (Cloud Run, Cloud Build, Artifact Registry)
- [ ] Step 2: Billing enabled
- [ ] Step 3: Project ID noted
- [ ] Step 4: Google Cloud SDK installed
- [ ] Step 5: Authenticated with `gcloud auth login`
- [ ] Step 6: Project configured
- [ ] Step 7: Artifact Registry repository created
- [ ] Step 8: Gemini API key ready
- [ ] Step 9: Application deployed
- [ ] Step 10: URL obtained
- [ ] Step 11: Health endpoint tested

---

**Ready to start? Begin with Step 1!** 🚀

