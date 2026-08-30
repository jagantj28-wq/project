@echo off
title PrepPulse AI Server
echo ======================================================================
echo   Launching PrepPulse AI Server...
echo   Open your browser at: http://localhost:8000
echo ======================================================================
cd /d "%~dp0"
"%~dp0.venv\Scripts\python.exe" "%~dp0run.py"
pause
