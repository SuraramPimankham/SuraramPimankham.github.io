@echo off
cd /d "%~dp0"
title CRUD .NET (port 5000)
echo.
echo  CRUD .NET - http://localhost:5000
echo  กำลังเปิดเบราว์เซอร์...
echo  กด Ctrl+C เพื่อหยุด
echo.
start "" cmd /c "ping 127.0.0.1 -n 4 >nul && start http://localhost:5000"
dotnet run
pause
