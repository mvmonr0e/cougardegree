@echo off
REM Quick launcher for UH Grad Planner

echo ========================================
echo    UH Graduation Planner Launcher
echo ========================================
echo.

REM Set Gemini API Key
set GOOGLE_API_KEY=AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU

echo [1/2] Starting backend server...
echo.

REM Start backend in background
start /B "UH Grad Planner Backend" cmd /c "python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000"

echo [2/2] Waiting for server to start...
timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo    Server is running!
echo ========================================
echo.
echo Web Interface: http://127.0.0.1:8000/static/index.html
echo API Docs:      http://127.0.0.1:8000/docs
echo.
echo Opening browser...
start http://127.0.0.1:8000/static/index.html

echo.
echo Press any key to stop the server...
pause > nul

echo.
echo Stopping server...
taskkill /FI "WindowTitle eq UH Grad Planner Backend*" /T /F > nul 2>&1

echo Done!
