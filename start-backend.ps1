# PowerShell script to start the backend server
# This ensures only one instance runs

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend Server (FastAPI)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill any existing Python processes on port 8000
Write-Host "Checking for existing processes on port 8000..." -ForegroundColor Yellow
$existing = netstat -ano | findstr :8000 | findstr LISTENING
if ($existing) {
    Write-Host "Found existing processes. Cleaning up..." -ForegroundColor Yellow
    $existing | ForEach-Object {
        $parts = $_ -split '\s+'
        $processId = $parts[-1]
        if ($processId -and $processId -ne "0") {
            try {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host "  ✓ Killed process $processId" -ForegroundColor Green
            } catch {
                # Process may already be dead
            }
        }
    }
    Start-Sleep -Seconds 2
} else {
    Write-Host "  ✓ Port 8000 is free" -ForegroundColor Green
}

# Activate virtual environment and start server
Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Green
Write-Host "URL: http://localhost:8000" -ForegroundColor Yellow
Write-Host "Health: http://localhost:8000/health" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

& ".\venv\Scripts\python.exe" main.py

