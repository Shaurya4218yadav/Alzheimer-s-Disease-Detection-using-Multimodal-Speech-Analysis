#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Early Alzheimer Detection System - Frontend Setup   ${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"

cd frontend || exit

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing npm dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}\n"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}\n"
fi

# Run the development server
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   Starting React Development Server...${NC}"
echo -e "${GREEN}   Frontend running on: http://localhost:3000${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}\n"

npm run dev
