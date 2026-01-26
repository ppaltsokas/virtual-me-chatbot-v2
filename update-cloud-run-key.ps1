# Script to update GEMINI_API_KEY in Cloud Run deployment

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Update Cloud Run API Key" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get API key from environment variable (secure)
$API_KEY = $env:GEMINI_API_KEY
if (-not $API_KEY) {
    Write-Host "ERROR: GEMINI_API_KEY environment variable is not set!" -ForegroundColor Red
    Write-Host "Please set it before running this script:" -ForegroundColor Yellow
    Write-Host "  `$env:GEMINI_API_KEY = 'your-api-key-here'" -ForegroundColor White
    exit 1
}

$PROJECT_ID = "virtual-persona-cv"  # Update if different
$SERVICE_NAME = "virtual-persona-backend"
$REGION = "europe-west8"

Write-Host "Checking current Cloud Run configuration..." -ForegroundColor Yellow
Write-Host ""

# Get current environment variables
Write-Host "Current environment variables:" -ForegroundColor Cyan
gcloud run services describe $SERVICE_NAME --region $REGION --format="value(spec.template.spec.containers[0].env)" 2>&1

Write-Host ""
Write-Host "Updating GEMINI_API_KEY in Cloud Run..." -ForegroundColor Green
Write-Host ""

# Update the service with the new API key
gcloud run services update $SERVICE_NAME `
  --region $REGION `
  --update-env-vars GEMINI_API_KEY=$API_KEY,APP_ENV=prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Success! API Key Updated" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "The Cloud Run service will restart with the new key." -ForegroundColor Yellow
    Write-Host "This may take 1-2 minutes." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Get service URL:" -ForegroundColor Cyan
    Write-Host "gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)'" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Error updating Cloud Run service." -ForegroundColor Red
    Write-Host "Make sure you're logged in: gcloud auth login" -ForegroundColor Yellow
    Write-Host "Make sure project is set: gcloud config set project $PROJECT_ID" -ForegroundColor Yellow
}

