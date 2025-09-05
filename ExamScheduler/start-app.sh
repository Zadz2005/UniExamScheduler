#!/bin/bash

echo "Starting Exam Scheduler Application..."
echo

echo "Starting Spring Boot Backend..."
cd ExamScheduler
mvn spring-boot:run &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 10

echo "Starting React Frontend..."
cd frontend
npm start &
FRONTEND_PID=$!

echo
echo "Both applications are starting..."
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both applications"

# Function to cleanup background processes
cleanup() {
    echo "Stopping applications..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
