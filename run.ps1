$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Starting FriendConnect DAA Mini Project..." -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor DarkGray

Write-Host "1. Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ScriptDir\backend'; py -m uvicorn main:app --reload --port 8000"

Start-Sleep -Seconds 2

Write-Host "2. Starting React Vite Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ScriptDir\frontend'; npm run dev"

Write-Host "===========================================" -ForegroundColor DarkGray
Write-Host "FriendConnect is running!" -ForegroundColor Cyan
Write-Host "Backend API:  http://localhost:8000"
Write-Host "API Docs:     http://localhost:8000/docs"
Write-Host "Frontend App: http://localhost:3000"
