# PowerShell script to start the frontend development server

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Frontend Server (React/Vite)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting frontend development server..." -ForegroundColor Green
Write-Host "URL: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 TIP: If you see an old chatbot:" -ForegroundColor Magenta
Write-Host "   Press Ctrl+Shift+R (hard refresh)" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

npm run dev

