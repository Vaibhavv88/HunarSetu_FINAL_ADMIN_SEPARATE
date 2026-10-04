@echo off
echo ========================================================
echo   Stopping HunarSetu Dev Server on Port 3000
echo ========================================================
echo.

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Terminating PID: %%a on port 3000...
    taskkill /f /pid %%a >nul 2>&1
)

echo [SUCCESS] Any running HunarSetu dev instances on port 3000 have been stopped.
pause
