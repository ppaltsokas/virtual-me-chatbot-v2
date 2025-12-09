# Quick Deployment Script for Virtual Persona Backend to Google Cloud Run
# Make sure you've run the initial setup from GCP_SETUP_GUIDE.md first!

# Configuration - UPDATE THESE VALUES
$PROJECT_ID = "831351726786"  # Your Google Cloud Project ID
$REGION = "europe-west8"        # Your preferred region
$SERVICE_NAME = "virtual-persona-backend"
$REPO_NAME = "virtual-persona-repo"

# Get API key from environment variable (secure)
$GEMINI_API_KEY = $env:GEMINI_API_KEY
if (-not $GEMINI_API_KEY) {
    Write-Host "ERROR: GEMINI_API_KEY environment variable is not set!" -ForegroundColor Red
    Write-Host "Please set it before running this script:" -ForegroundColor Yellow
    Write-Host "  `$env:GEMINI_API_KEY = 'your-api-key-here'" -ForegroundColor White
    Write-Host "Or create a .env.local file with: GEMINI_API_KEY=your-api-key-here" -ForegroundColor White
    exit 1
}

Write-Host "=== Virtual Persona Backend Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get current commit hash
Write-Host "Step 1: Getting commit hash..." -ForegroundColor Yellow
$commit = (git rev-parse --short HEAD)
Write-Host "Commit: $commit" -ForegroundColor Green
Write-Host ""

# Step 2: Build and tag Docker image
Write-Host "Step 2: Building and tagging Docker image..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
$imageTag = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:${commit}"
gcloud builds submit --tag $imageTag
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy to Cloud Run
Write-Host "Step 3: Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $SERVICE_NAME `
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
$serviceUrl = gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)"
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

