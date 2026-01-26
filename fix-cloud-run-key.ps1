# Fix Cloud Run API Key - Separates GEMINI_API_KEY and APP_ENV correctly
# Updates GEMINI_API_KEY in Cloud Run from environment variable
# Or it will automatically load from .env.local if it exists

# Load .env.local if it exists
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remove quotes if present
            if ($value -match '^["''](.*)["'']$') {
                $value = $matches[1]
            }
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
    Write-Host "Loaded environment variables from .env.local" -ForegroundColor Green
}

if (-not $env:GEMINI_API_KEY) {
    Write-Host "ERROR: GEMINI_API_KEY environment variable is not set!" -ForegroundColor Red
    Write-Host "Please set it first:" -ForegroundColor Yellow
    Write-Host "  `$env:GEMINI_API_KEY = 'your-new-api-key-here'" -ForegroundColor White
    Write-Host "Or create a .env.local file with: GEMINI_API_KEY=your-key-here" -ForegroundColor White
    exit 1
}

Write-Host "Fixing Cloud Run environment variables..." -ForegroundColor Yellow
Write-Host "Setting GEMINI_API_KEY and APP_ENV as separate variables..." -ForegroundColor Cyan

gcloud run services update virtual-persona-backend `
    --region europe-west8 `
    --update-env-vars "GEMINI_API_KEY=$env:GEMINI_API_KEY,APP_ENV=prod"

if ($LASTEXITCODE -eq 0) {
    Write-Host "" 
    Write-Host "✅ Success! Cloud Run environment variables fixed." -ForegroundColor Green
    Write-Host "" 
    Write-Host "Verifying..." -ForegroundColor Yellow
    gcloud run services describe virtual-persona-backend --region europe-west8 --format="get(spec.template.spec.containers[0].env)"
} else {
    Write-Host "❌ Failed to update Cloud Run" -ForegroundColor Red
}