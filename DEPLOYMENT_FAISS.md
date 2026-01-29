# FAISS Index Deployment & Sync Architecture

This document explains how the FAISS vector index is built, deployed, and synchronized between local development and production environments.

## Overview

The FAISS (Facebook AI Similarity Search) index is a critical component that enables semantic search across the knowledge base. This document covers:
- How the index is built locally vs. in production
- The deployment strategy that ensures the index is always up-to-date
- Security measures in place
- How local and production environments stay synchronized

## Problem Statement

**Original Challenge**: Building the FAISS index at runtime on Cloud Run caused:
- Request timeouts (60+ seconds for index build)
- Poor user experience (long wait times)
- Resource consumption during runtime
- Potential failures if build exceeded Cloud Run timeout limits

**Solution**: Pre-build the FAISS index during Docker image creation, so the deployed container already contains a ready-to-use index.

## Architecture

### Local Development Environment

When you run the backend locally:

1. **Startup**: `python main.py.backend` starts the FastAPI server
2. **Index Check**: Backend checks if `models/faiss/index.faiss` exists
3. **Auto-Build** (if missing): If index doesn't exist, it's built automatically using:
   - All markdown files from `kb/` folder
   - All PDF files from `kb/` folder
   - OpenAI embeddings API to create vector representations
4. **Storage**: Index files are saved to `models/faiss/`:
   - `index.faiss` - The vector index file
   - `store.jsonl` - Metadata mapping vectors to document chunks
   - `build_info.json` - Build metadata (timestamp, chunk count, git commit)

**Important**: These index files are in `.gitignore` and are **not** pushed to GitHub. They're generated locally and stay on your machine.

### Production Deployment (Cloud Run)

When code is pushed to GitHub, the following automated process occurs:

#### 1. Cloud Build Trigger

GitHub push → Cloud Build automatically starts (via Cloud Build trigger)

#### 2. Docker Image Build

The `Dockerfile.backend` performs these steps:

```dockerfile
# 1. Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy all code (including kb/ files)
COPY . .

# 3. Build FAISS index during image build
ARG OPENAI_API_KEY
RUN if [ -n "$OPENAI_API_KEY" ]; then \
      OPENAI_API_KEY="$OPENAI_API_KEY" python build_faiss_offline.py ; \
    fi
```

#### 3. Index Build Process

During Docker build, `build_faiss_offline.py`:
- Reads all `kb/` markdown and PDF files
- Creates embeddings using OpenAI API (requires `OPENAI_API_KEY` as build argument)
- Builds FAISS index into `models/faiss/`
- Writes `build_info.json` with build metadata
- **Bakes the index into the Docker image**

#### 4. Image Push & Deploy

- Docker image (with pre-built index) is pushed to Google Container Registry
- Cloud Run deploys the new image
- Container starts with FAISS index already loaded and ready

## Synchronization Mechanism

### Code Sync

```
Local Machine → GitHub → Cloud Build → Docker Image → Cloud Run
```

1. **You make changes** to `kb/` files locally
2. **Push to GitHub** (`git push`)
3. **Cloud Build triggers** automatically
4. **New Docker image** is built with updated FAISS index
5. **Cloud Run deploys** the new image
6. **Production is updated** with your latest knowledge base

### Key Points

- **FAISS index is rebuilt on every deployment** - Ensures it always matches your `kb/` files
- **No manual index updates needed** - Fully automated
- **Index is always fresh** - Reflects latest changes in your knowledge base
- **Local and production are independent** - Local index is separate from production index

## Security Measures

### 1. Production Endpoint Protection

The `/kb/build-faiss` endpoint is:
- **Disabled in production**: Returns `403 Forbidden` if `PORT` or `ENVIRONMENT=production` is set
- **Hidden from API docs**: `include_in_schema=False` removes it from Swagger/OpenAPI
- **Development only**: Can only be used in local/dev environments

```python
@app.post("/kb/build-faiss", include_in_schema=False)
async def build_faiss_index_endpoint():
    is_production = os.getenv("PORT") is not None or os.getenv("ENVIRONMENT") == "production"
    if is_production:
        raise HTTPException(status_code=403, detail="Disabled in production")
```

### 2. API Key Management

- **Secret Manager**: API keys are stored in Google Cloud Secret Manager
- **Build-time only**: `OPENAI_API_KEY` is passed as Docker build argument (not baked into final image)
- **Runtime environment**: Keys are set as Cloud Run environment variables (separate from build)
- **No exposure**: Keys never appear in code, logs, or Docker image layers

### 3. File Exclusions

The following are excluded from Git (via `.gitignore`):
- `models/faiss/*.faiss` - FAISS index files
- `models/faiss/*.jsonl` - Vector metadata
- `models/faiss/build_info.json` - Build metadata
- `data/*.sqlite` - Database files
- `.env*` - Environment variable files

## File Structure

```
virtual-me-chatbot-v2/
├── kb/                          # Knowledge base (source files)
│   ├── Data_Science_projects/
│   ├── ML_projects/
│   └── AI_projects/
├── models/
│   └── faiss/                   # FAISS index (generated, gitignored)
│       ├── index.faiss         # Vector index
│       ├── store.jsonl         # Metadata
│       └── build_info.json     # Build info
├── Dockerfile.backend          # Docker build instructions
├── build_faiss_offline.py      # Offline index builder
├── cloudbuild.yaml             # Cloud Build configuration
└── main.py.backend             # Backend application
```

## Build Process Details

### Local Build (Manual)

If you want to rebuild the index locally:

```bash
# Set API key
export OPENAI_API_KEY=your_key_here

# Run offline builder
python build_faiss_offline.py
```

### Production Build (Automated)

Production builds happen automatically via Cloud Build:

1. **Trigger**: Push to `main` branch
2. **Cloud Build** reads `cloudbuild.yaml`
3. **Secrets**: Pulls `OPENAI_API_KEY` and `GEMINI_API_KEY` from Secret Manager
4. **Docker Build**: 
   - Passes `OPENAI_API_KEY` as build argument
   - Runs `build_faiss_offline.py` during image build
   - Index is baked into image
5. **Deploy**: New image deployed to Cloud Run

### Cloud Build Configuration

The `cloudbuild.yaml` file defines:

```yaml
steps:
  # Build Docker image with FAISS index
  - name: 'gcr.io/cloud-builders/docker'
    secretEnv: ['OPENAI_API_KEY']
    args:
      - 'build'
      - '--build-arg'
      - 'OPENAI_API_KEY=${OPENAI_API_KEY}'
      - '-f'
      - 'Dockerfile.backend'
      - '.'

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    secretEnv: ['OPENAI_API_KEY', 'GEMINI_API_KEY']
    args:
      - 'run'
      - 'deploy'
      - 'virtual-persona-backend'
      - '--set-env-vars'
      - 'OPENAI_API_KEY=${OPENAI_API_KEY}'
      - '--set-env-vars'
      - 'GEMINI_API_KEY=${GEMINI_API_KEY}'

availableSecrets:
  secretManager:
    - versionName: projects/831351726786/secrets/OPENAI_API_KEY/versions/1
      env: 'OPENAI_API_KEY'
    - versionName: projects/831351726786/secrets/GEMINI_API_KEY/versions/1
      env: 'GEMINI_API_KEY'
```

## Verification

### Check Production Status

Query the `/health` endpoint to verify FAISS index status:

```bash
curl https://your-backend-url.run.app/health
```

Response includes:
```json
{
  "faiss_available": true,
  "faiss_status": "loaded",
  "faiss_chunks": 417,
  "faiss_build_info": {
    "build_timestamp": "2025-01-XX...",
    "build_duration_seconds": 45.2,
    "chunks_indexed": 417,
    "git_commit": "abc1234",
    "build_type": "docker_image_build"
  }
}
```

### Local Verification

Check local index:

```bash
# Check if index exists
ls models/faiss/

# Check build info
cat models/faiss/build_info.json
```

## Troubleshooting

### Index Not Building in Production

**Symptoms**: `faiss_status` shows "not_loaded" or "error"

**Possible Causes**:
1. `OPENAI_API_KEY` not provided during Docker build
2. Cloud Build service account lacks Secret Manager access
3. Build timeout (shouldn't happen with pre-built index)

**Solutions**:
- Verify Secret Manager permissions for Cloud Build service account
- Check Cloud Build logs for errors
- Ensure `build_faiss_offline.py` runs successfully during build

### Index Out of Date

**Symptoms**: Chatbot returns outdated information

**Solution**: Push changes to GitHub - Cloud Build will rebuild index automatically

### Local Index Issues

**Symptoms**: Local backend can't find or load index

**Solutions**:
- Delete `models/faiss/` folder and restart backend (auto-rebuilds)
- Manually run `python build_faiss_offline.py`
- Check `OPENAI_API_KEY` is set in environment

## Benefits of This Approach

1. **Fast Startup**: Production containers start immediately with pre-built index
2. **No Timeouts**: Index build happens during image creation, not at runtime
3. **Always Fresh**: Index is rebuilt on every deployment, ensuring it matches your `kb/` files
4. **Secure**: Production endpoint disabled, keys in Secret Manager
5. **Automated**: No manual intervention needed - push to GitHub and it deploys
6. **Independent Environments**: Local and production indexes are separate

## Summary

- **Local**: FAISS index built automatically when backend starts (if missing)
- **Production**: FAISS index built during Docker image creation, baked into image
- **Sync**: Code changes → GitHub → Cloud Build → New image with updated index → Cloud Run
- **Security**: Production endpoint disabled, keys in Secret Manager, index files gitignored

The deployed app automatically stays synchronized with your local code and knowledge base because every deployment rebuilds the FAISS index from your `kb/` files.
