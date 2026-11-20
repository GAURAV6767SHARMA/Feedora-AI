@echo off
title Feedora AI Launcher
echo ==================================================
echo   LAUNCHING FEEDORA AI (SERVER + CLIENT)
echo ==================================================

:: Ensure Node and NPM are available in PATH
set "PATH=%LOCALAPPDATA%\pi-node\current;%LOCALAPPDATA%\hermes\tools\node-26.12.1-win32-x64;%PATH%"

echo [1/3] Starting Feedora AI Backend on http://localhost:5000...
start "Feedora AI Backend" cmd /k "cd /d ""%~dp0server"" && node server.js"

echo [2/3] Waiting for Backend to initialize...
timeout /t 3 /nobreak > nul

echo [3/3] Starting Feedora AI Frontend on http://localhost:5173...
start "Feedora AI Frontend" cmd /k "cd /d ""%~dp0client"" && npm.cmd run dev"

timeout /t 2 /nobreak > nul
echo Opening Feedora AI in your default browser...
start http://localhost:5173

echo ==================================================
echo   FEEDORA AI IS LIVE!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ==================================================