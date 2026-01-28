@echo off
REM JobShare Pro - Complete Setup Script (Windows)
REM This script will set up everything you need to run the application

echo ========================================
echo    JobShare Pro - Complete Setup
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% detected

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% detected
echo.

REM Install root dependencies
echo Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install root dependencies
    pause
    exit /b 1
)
echo [OK] Root dependencies installed
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Backend dependencies installed
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend dependencies installed
echo.

REM Set up environment file
echo Setting up environment variables...
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo [WARNING] Created backend\.env file
    echo [WARNING] Please edit backend\.env and set your MongoDB connection string
) else (
    echo [OK] backend\.env already exists
)
echo.

REM Check MongoDB
echo Checking MongoDB...
where mongod >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB is installed locally
    echo     You can use: mongodb://localhost:27017/jobshare
) else (
    echo [WARNING] MongoDB not found locally
    echo     You can either:
    echo     1. Install MongoDB locally: https://www.mongodb.com/try/download/community
    echo     2. Use MongoDB Atlas (cloud - FREE): https://www.mongodb.com/cloud/atlas
)
echo.

REM Summary
echo ========================================
echo     Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Configure your database:
echo    - Edit backend\.env
echo    - Set MONGODB_URI to your MongoDB connection string
echo.
echo 2. Start the application:
echo    npm run dev
echo.
echo 3. Open your browser:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo.
echo Documentation:
echo    - QUICKSTART.md - Quick setup guide
echo    - README.md - Full documentation
echo    - DEPLOYMENT.md - Deploy to production
echo.
echo Need help? Check the documentation files!
echo.
pause
