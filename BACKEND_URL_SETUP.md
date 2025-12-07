# Backend URL Configuration

## ✅ Your Production Backend URL

**Backend URL:** `https://virtual-persona-backend-831351726786.europe-west8.run.app`

---

## 📝 Setup Instructions

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the root directory of your project with the following content:

```env
# Backend API URL for production
VITE_API_URL=https://virtual-persona-backend-831351726786.europe-west8.run.app

# Gemini API Key (if needed for local development)
# GEMINI_API_KEY=your_key_here
```

**Note:** This file is already in `.gitignore`, so it won't be committed to your repository.

### Step 2: Update CORS in Backend (if deploying frontend)

If you deploy your frontend to a different domain (e.g., Vercel, Netlify), you'll need to update the CORS settings in `main.py` by setting the `ALLOWED_ORIGINS` environment variable in your Cloud Run deployment:

```powershell
gcloud run services update virtual-persona-backend `
  --region europe-west8 `
  --update-env-vars ALLOWED_ORIGINS="http://localhost:3000,https://your-frontend-domain.com"
```

Or add it during deployment:
```powershell
--set-env-vars GEMINI_API_KEY=your_key,APP_ENV=prod,ALLOWED_ORIGINS="http://localhost:3000,https://your-frontend-domain.com"
```

### Step 3: Rebuild Frontend

After creating `.env.local`, rebuild your frontend:

```powershell
npm run build
```

Or if running in development:
```powershell
npm run dev
```

---

## 🔍 Where the Backend URL is Used

The backend URL is referenced in these files:

1. **`services/geminiService.ts`** - API calls for chat functionality
2. **`App.tsx`** - CV download and PDF links
3. **`components/ChatInterface.tsx`** - Image loading from knowledge base

All these files use: `import.meta.env.VITE_API_URL || 'http://localhost:8000'`

So they will automatically use the production URL when `VITE_API_URL` is set in `.env.local`.

---

## ✅ Verification

1. **Test the backend health endpoint:**
   ```powershell
   curl https://virtual-persona-backend-831351726786.europe-west8.run.app/health
   ```

2. **Check in browser:**
   Open: `https://virtual-persona-backend-831351726786.europe-west8.run.app/health`
   
   You should see a JSON response like:
   ```json
   {"status":"healthy","timestamp":"..."}
   ```

---

## 🔄 For Local Development

When developing locally, the frontend will:
- Use `http://localhost:8000` if `.env.local` doesn't exist or `VITE_API_URL` is not set
- Use the production URL if `VITE_API_URL` is set in `.env.local`

To switch back to local development, either:
- Remove `VITE_API_URL` from `.env.local`, or
- Comment it out: `# VITE_API_URL=https://...`

---

## 📚 Related Files

- **Backend CORS settings:** `main.py` (lines 47-50)
- **Frontend API service:** `services/geminiService.ts`
- **Frontend components:** `App.tsx`, `components/ChatInterface.tsx`

