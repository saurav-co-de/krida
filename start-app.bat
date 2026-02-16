@echo off
echo ========================================
echo    TurfBooker - Starting Application
echo ========================================
echo.

echo Starting Backend Server...
start cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > NUL

echo Starting Frontend Server...
start cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit this window...
pause > NUL
