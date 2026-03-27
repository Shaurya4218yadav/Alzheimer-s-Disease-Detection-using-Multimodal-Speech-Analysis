@echo off
color 0B

echo ============================================================
echo    Early Alzheimer Detection System - Backend Setup
echo ============================================================
echo.

cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo [OK] Virtual environment created
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
echo [OK] Virtual environment activated
echo.

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
echo [OK] Dependencies installed
echo.

REM Create necessary directories
echo Creating directories...
if not exist "data\audio" mkdir data\audio
if not exist "database" mkdir database
echo [OK] Directories created
echo.

REM Run the Flask app
echo ============================================================
echo    Starting Flask Backend Server...
echo    API running on: http://localhost:5000
echo ============================================================
echo.

python app.py

pause
