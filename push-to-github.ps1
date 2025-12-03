# PowerShell script to push to GitHub
# This script will help you create the repository and push your code

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if remote already exists
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "Remote 'origin' already exists: $remoteExists" -ForegroundColor Yellow
    $useExisting = Read-Host "Use existing remote? (y/n)"
    if ($useExisting -ne "y") {
        git remote remove origin
    } else {
        Write-Host "Pushing to existing remote..." -ForegroundColor Green
        git push -u origin main
        exit 0
    }
}

Write-Host "Repository name: virtual-me-chatbot-v2" -ForegroundColor Yellow
Write-Host ""
Write-Host "Choose an option:" -ForegroundColor Cyan
Write-Host "1. I'll create the repo on GitHub.com manually (recommended)" -ForegroundColor White
Write-Host "2. I have a GitHub Personal Access Token (automated)" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Manual Setup Instructions" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "1. Go to: https://github.com/new" -ForegroundColor Yellow
    Write-Host "2. Repository name: virtual-me-chatbot-v2" -ForegroundColor Yellow
    Write-Host "3. Choose Public or Private" -ForegroundColor Yellow
    Write-Host "4. DO NOT check 'Add a README file'" -ForegroundColor Red
    Write-Host "5. DO NOT check 'Add .gitignore'" -ForegroundColor Red
    Write-Host "6. DO NOT check 'Choose a license'" -ForegroundColor Red
    Write-Host "7. Click 'Create repository'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After creating the repo, enter your GitHub username:" -ForegroundColor Cyan
    $username = Read-Host "GitHub username"
    
    if ($username) {
        Write-Host ""
        Write-Host "Adding remote and pushing..." -ForegroundColor Green
        git remote add origin "https://github.com/$username/virtual-me-chatbot-v2.git"
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
            Write-Host "Repository: https://github.com/$username/virtual-me-chatbot-v2" -ForegroundColor Cyan
        } else {
            Write-Host ""
            Write-Host "❌ Push failed. You may need to:" -ForegroundColor Red
            Write-Host "   - Enter your GitHub credentials" -ForegroundColor Yellow
            Write-Host "   - Use a Personal Access Token instead of password" -ForegroundColor Yellow
            Write-Host "   - Check that the repository exists on GitHub" -ForegroundColor Yellow
        }
    }
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "Enter your GitHub Personal Access Token:" -ForegroundColor Yellow
    Write-Host "(Create one at: https://github.com/settings/tokens)" -ForegroundColor Gray
    $token = Read-Host "Token" -AsSecureString
    $tokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))
    
    Write-Host ""
    Write-Host "Enter your GitHub username:" -ForegroundColor Yellow
    $username = Read-Host "Username"
    
    if ($tokenPlain -and $username) {
        Write-Host ""
        Write-Host "Creating repository on GitHub..." -ForegroundColor Green
        
        $body = @{
            name = "virtual-me-chatbot-v2"
            description = "Virtual Persona CV - AI chatbot with knowledge base integration"
            private = $false
        } | ConvertTo-Json
        
        $headers = @{
            "Authorization" = "token $tokenPlain"
            "Accept" = "application/vnd.github.v3+json"
        }
        
        try {
            $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
            Write-Host "✅ Repository created successfully!" -ForegroundColor Green
            
            Write-Host ""
            Write-Host "Adding remote and pushing..." -ForegroundColor Green
            git remote add origin "https://$tokenPlain@github.com/$username/virtual-me-chatbot-v2.git"
            git push -u origin main
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
                Write-Host "Repository: $($response.html_url)" -ForegroundColor Cyan
            }
        } catch {
            Write-Host ""
            Write-Host "❌ Error creating repository: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "You may need to create it manually on GitHub.com" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "Invalid choice. Exiting." -ForegroundColor Red
}

