@echo off
REM Streamlit Expense Tracker Setup Script for Windows

echo.
echo ========================================
echo Expense Tracker - Streamlit Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org
    pause
    exit /b 1
)

echo [OK] Python found
python --version

REM Create virtual environment
echo.
echo [STEP 1] Creating virtual environment...
if exist "venv" (
    echo Virtual environment already exists
) else (
    python -m venv venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo [STEP 2] Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo [STEP 3] Installing dependencies...
pip install --upgrade pip
pip install -r requirements.txt

if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the app, run:
echo   streamlit run app.py
echo.
echo The app will open at: http://localhost:8501
echo.
echo Make sure your .env file has:
echo   - NEXT_PUBLIC_GEMINI_API_KEY=your_key
echo   - MONGODB_URI=your_mongodb_connection
echo.
pause
