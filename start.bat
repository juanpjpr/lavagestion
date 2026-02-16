@echo off
title LavaGestion - All Services

echo === LavaGestion ===
echo.
echo Starting Backend on :3001...
start "LavaGestion-Backend" cmd /k "cd /d %~dp0backend && npm run dev"

echo Starting Frontend on :5173...
start "LavaGestion-Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Starting Landing on :3000...
start "LavaGestion-Landing" cmd /k "cd /d %~dp0landing && npx serve . -l 3000"

echo.
echo === All services started ===
echo   Backend:  http://localhost:3001
echo   Frontend: http://localhost:5173
echo   Landing:  http://localhost:3000
echo.
echo Close each window to stop its service.
pause
