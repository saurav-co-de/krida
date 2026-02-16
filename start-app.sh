#!/bin/bash

echo "========================================"
echo "   TurfBooker - Starting Application"
echo "========================================"
echo ""

echo "Starting Backend Server..."
cd backend
npm start &
BACKEND_PID=$!

cd ..

sleep 3

echo "Starting Frontend Server..."
cd frontend
npm start &
FRONTEND_PID=$!

cd ..

echo ""
echo "========================================"
echo "Both servers are running!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
