@echo off
color 0B

echo ============================================================
echo    Early Alzheimer Detection System - Frontend Setup
echo ============================================================
echo.

cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
    echo [OK] Dependencies installed
    echo.
) else (
    echo [OK] Dependencies already installed
    echo.
)

REM Run the development server
echo ============================================================
echo    Starting React Development Server...
echo    Frontend running on: http://localhost:3000
echo ============================================================
echo.

call npm run dev

pause
