@echo off
cd /d "%~dp0"
if not exist data mkdir data
if not exist uploads\slips mkdir uploads\slips

start "Finance API" cmd /k "cd /d "%~dp0backend" && dotnet run"
timeout /t 3 /nobreak >nul
start "Finance UI" cmd /k "cd /d "%~dp0frontend" && npm run dev"
echo.
echo Backend: http://localhost:5200
echo Frontend: http://localhost:5173
echo Login: admin / admin123
