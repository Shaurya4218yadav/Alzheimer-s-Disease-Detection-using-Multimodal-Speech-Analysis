#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Early Alzheimer Detection System - Backend Setup    ${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"

cd backend || exit

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${BLUE}Creating virtual environment...${NC}"
    python -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}\n"
fi

# Activate virtual environment
echo -e "${BLUE}Activating virtual environment...${NC}"
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi
echo -e "${GREEN}✓ Virtual environment activated${NC}\n"

# Install dependencies
echo -e "${BLUE}Installing Python dependencies...${NC}"
pip install -r requirements.txt
echo -e "${GREEN}✓ Dependencies installed${NC}\n"

# Create necessary directories
echo -e "${BLUE}Creating directories...${NC}"
mkdir -p data/audio
mkdir -p database
echo -e "${GREEN}✓ Directories created${NC}\n"

# Run the Flask app
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   Starting Flask Backend Server...${NC}"
echo -e "${GREEN}   API running on: http://localhost:5000${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}\n"

python app.py
