# Virtual Persona CV - Project Overview

## What This Project Is

A modern, interactive portfolio website that combines a traditional CV/resume with an AI-powered chatbot. This application serves as an online professional presence where visitors can view experience, projects, and skills, then have a conversation with an AI version that knows about the work, education, and projects.

## Architecture

### Frontend
- **Framework:** React + TypeScript + Vite
- **Deployment:** Railway
- **Features:**
  - Interactive portfolio/resume display
  - AI chatbot interface
  - Responsive design with animations
  - Project showcase with PDF links

### Backend
- **Framework:** FastAPI (Python)
- **Deployment:** Google Cloud Run
- **AI:** Google Gemini API
- **Features:**
  - Chat API with streaming responses
  - Knowledge base integration (PDFs, markdown)
  - Image extraction from project documents
  - Random project selection
  - CORS-enabled for frontend access

### Knowledge Base
- **Location:** `kb/` directory
- **Contents:**
  - Data Science projects (PDFs, markdown)
  - Machine Learning projects (PDFs)
  - Extracted images from documents
  - Personal information (`me/` folder)

## Key Features

1. **Interactive Portfolio**
   - Professional experience display
   - Education background
   - Technical projects showcase
   - Skills and expertise
   - Contact information

2. **AI Chatbot**
   - Answers questions about experience and background
   - Discusses projects in detail
   - Provides insights about work
   - Shares information from knowledge base
   - Shows images and documentation from projects
   - Special greetings (e.g., "Hello there" → General Kenobi response)
   - Random project selection from ML/Data Science portfolios

3. **Knowledge Base Integration**
   - Automatic PDF processing
   - Image extraction from documents
   - Semantic search for relevant content
   - Random selection for variety

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS (implied from styling)

### Backend
- Python 3.11
- FastAPI
- Google Generative AI (Gemini)
- PyPDF2 (PDF processing)
- PIL/Pillow (image processing)

### Deployment
- **Backend:** Google Cloud Run
- **Frontend:** Railway
- **Container Registry:** Google Artifact Registry
- **Build System:** Cloud Build (backend), Railpack (frontend)

## Project Structure

```
Virtual Persona CV/
├── components/          # React components
│   └── ChatInterface.tsx
├── services/           # Frontend services
│   └── geminiService.ts
├── kb/                 # Knowledge base
│   ├── Data_Science_projects/
│   ├── ML_projects/
│   └── images/
├── me/                 # Personal information
│   ├── summary.txt
│   ├── linkedin.pdf
│   └── CV PALTSOKAS PANAGIOTIS.pdf
├── main.py.backend     # FastAPI backend
├── constants.ts        # Frontend constants
├── App.tsx             # Main React component
└── [config files]      # Deployment configs
```

## Environment Variables

### Local Development (`.env.local`)
- `GEMINI_API_KEY` - Google Gemini API key
- `VITE_API_URL` - Backend API URL (defaults to localhost:8000)

### Production (Cloud Run)
- `GEMINI_API_KEY` - Google Gemini API key
- `APP_ENV` - Environment (prod)
- `ALLOWED_ORIGINS` - CORS allowed origins

### Production (Railway - Frontend)
- `VITE_API_URL` - Backend API URL
- `PORT` - Server port (auto-set by Railway)

## Deployment

### Backend Deployment
Use `deploy-backend.ps1` script or manual gcloud commands. See `DEPLOYMENT.md` for details.

### Frontend Deployment
Automatically deploys from GitHub via Railway. See `RAILWAY_DEPLOYMENT_GUIDE.md` for configuration.

## Security

- API keys stored in environment variables only
- No API keys exposed in frontend code
- `.env.local` excluded from git
- All sensitive files in `.gitignore`
- CORS configured for specific domains

## Current Status

✅ **Backend:** Deployed on Google Cloud Run  
✅ **Frontend:** Deployed on Railway  
✅ **Knowledge Base:** Loaded and functional  
✅ **Chatbot:** Working with Gemini API  
✅ **Random Selection:** Fixed and working  
✅ **Security:** Hardened and compliant  

## URLs

- **Backend:** `https://virtual-persona-backend-831351726786.europe-west8.run.app`
- **Frontend:** `https://virtual-me-chatbot-v2-production.up.railway.app`
- **Custom Domain:** `https://www.ppaltsokas.com` (if configured)

## Quick Start

1. Clone repository
2. Create `.env.local` with `GEMINI_API_KEY` and `VITE_API_URL`
3. Install dependencies: `npm install` (frontend), `pip install -r requirements.txt.backend` (backend)
4. Run locally: `.\start-all.ps1`
5. Deploy: Use `deploy-backend.ps1` for backend, Railway auto-deploys frontend

## Documentation

- `README.md` - Main project documentation
- `DEPLOYMENT.md` - Deployment guide
- `SECURITY.md` - Security guidelines
- `DEPLOYMENT_HISTORY.md` - Complete deployment history and fixes

