# Quick start script for the Virtual Persona CV backend
# Run this script each time you open Cursor to start the backend

Write-Host "🚀 Starting Virtual Persona CV Backend..." -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

# Activate virtual environment
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & .\venv\Scripts\Activate.ps1
} else {
    Write-Host "⚠️  Virtual environment not found. Creating one..." -ForegroundColor Yellow
    python -m venv venv
    & .\venv\Scripts\Activate.ps1
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt.backend
}

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  WARNING: .env.local not found!" -ForegroundColor Red
    Write-Host "   Make sure you have:" -ForegroundColor Yellow
    Write-Host "   - GEMINI_API_KEY=your-key" -ForegroundColor White
    Write-Host "   - OPENAI_API_KEY=your-key (optional, for FAISS)" -ForegroundColor White
}

# Check if backend is already running
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ Backend is already running!" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor Gray
    Write-Host "   KB Documents: $($health.kb_documents)" -ForegroundColor Gray
    Write-Host "   FAISS Status: $($health.faiss_status)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the backend" -ForegroundColor Yellow
    Write-Host ""
    exit 0
} catch {
    # Backend not running, continue to start it
}

# Start the backend
Write-Host "Starting backend server..." -ForegroundColor Green
Write-Host "   Backend will be available at: http://localhost:8000" -ForegroundColor Gray
Write-Host "   Health check: http://localhost:8000/health" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop the backend" -ForegroundColor Yellow
Write-Host ""

python main.py.backend
