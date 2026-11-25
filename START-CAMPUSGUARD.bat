@echo off
setlocal
cd /d "%~dp0"
title CampusGuard AI - Local Server
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install the LTS version from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)
if not exist node_modules\express\package.json (
  echo Installing required packages...
  call npm install
  if errorlevel 1 (echo Package installation failed.& pause & exit /b 1)
)
echo Starting CampusGuard AI...
start "" cmd /c "timeout /t 3 /nobreak ^>nul ^& start http://localhost:3000"
call npm start
pause
