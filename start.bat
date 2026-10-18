@echo off
setlocal
echo ========================================================
echo        e-Gov Lallana Application Launcher
echo ========================================================

REM Check if Docker is installed and running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running or not installed!
    echo Please make sure Docker Desktop is installed and running before launching.
    echo Download Docker Desktop: https://www.docker.com/products/docker-desktop/
    echo.
    pause
    exit /b 1
)

REM Check if .env exists
if not exist .env (
    echo [ERROR] .env file not found!
    echo Please place the provided .env configuration file in this folder.
    echo.
    pause
    exit /b 1
)

REM Load Docker image from tar archive if present
if exist e-gov-lallana.tar (
    echo [INFO] Found e-gov-lallana.tar. Loading Docker image...
    docker load -i e-gov-lallana.tar
    echo [INFO] Image loaded successfully.
)

REM Start containers in detached mode
echo [INFO] Starting application and database containers...
docker compose up -d

if %errorlevel% neq 0 (
    echo [ERROR] Failed to start containers. Check Docker logs for details.
    pause
    exit /b 1
)

echo.
echo ========================================================
echo  Application is running!
echo  Access URL: http://localhost:8080
echo ========================================================
echo To stop the application, run stop.bat.
echo.
pause
