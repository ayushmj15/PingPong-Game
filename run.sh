#!/bin/bash

echo "Starting Terminal Ping Pong Game..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js (which includes npm)."
    exit 1
fi

echo "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed."
fi

echo ""
echo "Starting game server..."
echo "Game will be available at http://localhost:3000"
echo "Press Ctrl+C to stop the server."
echo ""

# Start the game server
node server.js