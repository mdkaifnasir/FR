#!/bin/bash

# Function to kill background processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p) 2>/dev/null
}

trap cleanup EXIT

echo "Starting Backend (Laravel)..."
cd backend
php artisan serve &
BACKEND_PID=$!
cd ..

echo "Starting Frontend (React/Vite)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Servers are running."
echo "Press Ctrl+C to stop both servers."

wait $BACKEND_PID $FRONTEND_PID
