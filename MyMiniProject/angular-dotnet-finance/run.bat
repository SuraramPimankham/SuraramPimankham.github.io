@echo off
cd /d "%~dp0"
if not exist data mkdir data
if not exist uploads\slips mkdir uploads\slips
start "Finance API Angular" cmd /k "cd /d "%~dp0backend" && dotnet run"
timeout /t 3 /nobreak >nul
start "Finance UI Angular" cmd /k "cd /d "%~dp0frontend" && npm start"
echo Backend: http://localhost:5210
echo Frontend: http://localhost:4210
echo Login: admin / admin123
