# Quick launcher for UH Grad Planner (PowerShell)

Write-Host "========================================"
Write-Host "   UH Graduation Planner Launcher"
Write-Host "========================================"
Write-Host ""

# Set Gemini API Key
$Env:GOOGLE_API_KEY = "AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"

Write-Host "[1/2] Starting backend server..."
Write-Host ""

# Start backend in background using Start-Process
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; `$Env:GOOGLE_API_KEY='AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU'; python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000" -WindowStyle Normal

Write-Host "[2/2] Waiting for server to start..."
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================"
Write-Host "   Server is running!"
Write-Host "========================================"
Write-Host ""
Write-Host "Web Interface: http://127.0.0.1:8000/static/index.html"
Write-Host "API Docs:      http://127.0.0.1:8000/docs"
Write-Host ""
Write-Host "Opening browser..."

Start-Process "http://127.0.0.1:8000/static/index.html"

Write-Host ""
Write-Host "Backend is running in a separate window."
Write-Host "Close that window when you're done."
Write-Host ""
Write-Host "Press any key to exit this launcher..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
