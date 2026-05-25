#!/bin/bash

# Streamlit Expense Tracker Setup Script for macOS/Linux

echo ""
echo "========================================"
echo "Expense Tracker - Streamlit Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed"
    echo "Please install Python 3.8+ from https://www.python.org"
    exit 1
fi

echo "[OK] Python found"
python3 --version

# Create virtual environment
echo ""
echo "[STEP 1] Creating virtual environment..."
if [ -d "venv" ]; then
    echo "Virtual environment already exists"
else
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
echo "[STEP 2] Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "[STEP 3] Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install dependencies"
    exit 1
fi

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the app, run:"
echo "  streamlit run app.py"
echo ""
echo "The app will open at: http://localhost:8501"
echo ""
echo "Make sure your .env file has:"
echo "  - NEXT_PUBLIC_GEMINI_API_KEY=your_key"
echo "  - MONGODB_URI=your_mongodb_connection"
echo ""
