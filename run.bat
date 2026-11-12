@echo off
set SCRIPT_DIR=%~dp0
echo Starting FriendConnect DAA Mini Project...
echo ===========================================
echo 1. Launching FastAPI Backend on http://localhost:8000
start cmd /k "cd /d "%SCRIPT_DIR%backend" && py -m uvicorn main:app --reload --port 8000"
timeout /t 2 /nobreak >nul
echo 2. Launching React Frontend on http://localhost:3000
start cmd /k "cd /d "%SCRIPT_DIR%frontend" && npm run dev"
echo ===========================================
echo Backend: http://localhost:8000 (Swagger docs at /docs)
echo Frontend: http://localhost:3000
pause
