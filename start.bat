@echo off
title STUDYSYNC — Dev Servers
echo.
echo  ╔═══════════════════════════════════════╗
echo  ║   STUDYSYNC — Starting Servers    ║
echo  ╚═══════════════════════════════════════╝
echo.

echo [1/2] Starting Backend on port 5000...
start "STUDYSYNC Backend" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend on port 5173...
start "STUDYSYNC Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo  ✅ Both servers starting in separate windows!
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:5173
echo.
pause
