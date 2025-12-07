# PowerShell script to start both backend and frontend
# Opens them in separate terminal windows

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Virtual Persona CV - Starting App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill any existing Python processes on port 8000
Write-Host "Cleaning up old processes..." -ForegroundColor Yellow
$existing = netstat -ano | findstr :8000 | findstr LISTENING
if ($existing) {
    $existing | ForEach-Object {
        $parts = $_ -split '\s+'
        $processId = $parts[-1]
        if ($processId -and $processId -ne "0") {
            try {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            } catch {}
        }
    }
    Start-Sleep -Seconds 1
}

# Start backend in a new window
Write-Host "Starting backend server..." -ForegroundColor Green
$backendWindow = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'Backend Server Starting...' -ForegroundColor Cyan; .\venv\Scripts\python.exe main.py" -PassThru

# Wait a moment for backend to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start frontend in a new window
Write-Host "Starting frontend server..." -ForegroundColor Green
$frontendWindow = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'Frontend Server Starting...' -ForegroundColor Cyan; npm run dev" -PassThru

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Both servers are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Two new terminal windows have opened:" -ForegroundColor Cyan
Write-Host "   - One for the backend (Python/FastAPI)" -ForegroundColor White
Write-Host "   - One for the frontend (React/Vite)" -ForegroundColor White
Write-Host ""
Write-Host "Wait ~10 seconds, then open:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "TIP: If you see an old chatbot, press Ctrl+Shift+R" -ForegroundColor Magenta
Write-Host ""
Write-Host ""

