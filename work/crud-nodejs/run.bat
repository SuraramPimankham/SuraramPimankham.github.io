@echo off
cd /d "%~dp0"
title CRUD Node.js (port 3000)
echo.
echo  CRUD Node.js - http://localhost:3000
echo  กำลังเปิดเบราว์เซอร์...
echo  กด Ctrl+C เพื่อหยุด
echo.
start "" cmd /c "ping 127.0.0.1 -n 3 >nul && start http://localhost:3000"
npm start
pause
