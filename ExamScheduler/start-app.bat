@echo off
echo Starting Exam Scheduler Application...
echo.

echo Starting Spring Boot Backend...
start "Spring Boot Backend" cmd /k "cd ExamScheduler && mvn spring-boot:run"

echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo Starting React Frontend...
start "React Frontend" cmd /k "cd ExamScheduler\frontend && npm start"

echo.
echo Both applications are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul
