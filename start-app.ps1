# PowerShell script to start the UrbanRent application
Write-Host "Starting UrbanRent application..." -ForegroundColor Green

# Start the API server in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -Path '.\api'; npm start"

# Wait a moment for the API to initialize
Start-Sleep -Seconds 3

# Start the client in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -Path '.\client'; npm run dev"

Write-Host "UrbanRent application started in separate windows." -ForegroundColor Green
