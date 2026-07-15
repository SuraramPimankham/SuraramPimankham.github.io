@echo off
cd /d "%~dp0"
if not exist data mkdir data
if not exist uploads\slips mkdir uploads\slips

start "Finance API" cmd /k "cd /d "%~dp0backend" && dotnet run"
timeout /t 3 /nobreak >nul
start "Ledger Laravel" cmd /k "cd /d "%~dp0frontend" && php artisan serve --port=5231 --host=127.0.0.1"
echo.
echo Backend:  http://localhost:5230
echo Frontend: http://127.0.0.1:5231
echo Login: admin / admin123
