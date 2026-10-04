@echo off
echo ========================================================
echo   Starting HunarSetu (हुनर सेतु)
echo   AI-Enabled Family & Vocational Career Decision System
echo ========================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js 18+ or 20+ from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if node_modules exists, install if missing
if not exist "node_modules\" (
    echo [INFO] Installing required dependencies...
    call npm install
)

:: Set environment default port if not set
set PORT=3000

echo [INFO] Launching HunarSetu Full-Stack Application on http://localhost:3000 ...
echo [INFO] Press Ctrl+C in this terminal window to stop the server anytime.
echo.

call npm run dev
