@echo off
cd /d "%~dp0"
title DotnetMVC (port 5100)
echo.
echo  DotnetMVC - http://localhost:5100
echo  API: /api/members
echo  กด Ctrl+C เพื่อหยุด
echo.
start "" cmd /c "ping 127.0.0.1 -n 4 >nul && start http://localhost:5100/"
dotnet run
pause
