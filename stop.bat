@echo off
setlocal
echo ========================================================
echo        Stopping e-Gov Lallana Application
echo ========================================================

docker compose down

echo.
echo Application stopped.
pause
