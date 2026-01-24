# Quick Deployment Script for Virtual Persona Backend to Google Cloud Run
# Make sure you've run the initial setup from GCP_SETUP_GUIDE.md first!

# Configuration - UPDATE THESE VALUES
$PROJECT_NUMBER = "831351726786"
$PROJECT_ID = "virtualpersonacv"
$REGION = "europe-west8"
$SERVICE_NAME = "virtual-persona-backend"
$REPO_NAME = "virtual-persona-repo"

# Get API key from environment variable or .env.local file
$GEMINI_API_KEY = $env:GEMINI_API_KEY

# If not set in environment, try reading from .env.local
if (-not $GEMINI_API_KEY) {
    $envLocalPath = ".env.local"
    if (Test-Path $envLocalPath) {
        Write-Host "Reading GEMINI_API_KEY from .env.local..." -ForegroundColor Yellow
        $envContent = Get-Content $envLocalPath -Raw
        if ($envContent -match "GEMINI_API_KEY\s*=\s*(.+)") {
            $GEMINI_API_KEY = $matches[1].Trim()
            # Remove quotes if present
            $GEMINI_API_KEY = $GEMINI_API_KEY -replace '^["'']|["'']$', ''
            Write-Host "Found GEMINI_API_KEY in .env.local" -ForegroundColor Green
        }
    }
}

# Final check - if still not set, show error
if (-not $GEMINI_API_KEY) {
    Write-Host "ERROR: GEMINI_API_KEY not found!" -ForegroundColor Red
    Write-Host "Please set it in one of these ways:" -ForegroundColor Yellow
    Write-Host "  1. Environment variable: `$env:GEMINI_API_KEY = 'your-api-key-here'" -ForegroundColor White
    Write-Host "  2. Create .env.local file with: GEMINI_API_KEY=your-api-key-here" -ForegroundColor White
    exit 1
}

Write-Host "=== Virtual Persona Backend Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Recommended: make sure gcloud is targeting the right project
gcloud config set project $PROJECT_ID | Out-Null

# Step 1: Get current commit hash
Write-Host "Step 1: Getting commit hash..." -ForegroundColor Yellow
$commit = (git rev-parse --short HEAD)
Write-Host "Commit: $commit" -ForegroundColor Green
Write-Host ""

# Step 2: Build and tag Docker image
Write-Host "Step 2: Building and tagging Docker image..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray

# IMPORTANT: Artifact Registry uses PROJECT_ID, not PROJECT_NUMBER
$imageTag = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:${commit}"

# Create a temporary cloudbuild.yaml for the build
$cloudbuildYaml = @"
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-f', 'Dockerfile.backend', '-t', '$imageTag', '.']
images:
- '$imageTag'
"@
$cloudbuildYaml | Out-File -FilePath "cloudbuild-temp.yaml" -Encoding utf8

gcloud builds submit --config cloudbuild-temp.yaml --project $PROJECT_ID

# Clean up temporary file
Remove-Item "cloudbuild-temp.yaml" -ErrorAction SilentlyContinue
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy to Cloud Run
Write-Host "Step 3: Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $SERVICE_NAME `
    --project $PROJECT_ID `
    --image $imageTag `
    --region $REGION `
    --platform managed `
    --allow-unauthenticated `
    --port 8000 `
    --set-env-vars "GEMINI_API_KEY=$GEMINI_API_KEY,APP_ENV=prod" `
    --max-instances 3 `
    --cpu 1 `
    --memory 512Mi `
    --concurrency 80 `
    --timeout 60

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Get the service URL
Write-Host "Step 4: Getting service URL..." -ForegroundColor Yellow
$serviceUrl = gcloud run services describe $SERVICE_NAME --project $PROJECT_ID --region $REGION --format="value(status.url)"
Write-Host ""
Write-Host "=== Deployment Complete! ===" -ForegroundColor Green
Write-Host "Service URL: $serviceUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test the health endpoint:" -ForegroundColor Yellow
Write-Host "  $serviceUrl/health" -ForegroundColor White
Write-Host ""
Write-Host "View logs:" -ForegroundColor Yellow
Write-Host "  gcloud run services logs read $SERVICE_NAME --region $REGION --limit 50" -ForegroundColor White
Write-Host ""

