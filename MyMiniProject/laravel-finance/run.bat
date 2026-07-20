@echo off
cd /d "%~dp0"

if not exist database\database.sqlite type nul > database\database.sqlite
if not exist public\uploads\slips mkdir public\uploads\slips

php artisan migrate --force
php artisan db:seed --force

start "Ledger Laravel" cmd /k "cd /d "%~dp0" && php artisan serve --port=5231 --host=127.0.0.1"
echo.
echo App: http://127.0.0.1:5231
echo Login: admin / admin123
