# PowerShell script to create admin user
Write-Host "Creating admin user..." -ForegroundColor Green
Set-Location -Path ".\api"
node scripts/createAdmin.js
Write-Host "Admin user creation process completed." -ForegroundColor Green
Set-Location -Path ".."
