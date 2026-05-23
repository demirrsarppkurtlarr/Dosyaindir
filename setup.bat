@echo off
echo Dosyaindir Setup Script
echo ========================
echo.

echo Installing npm dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies.
    echo Please try running: npm install
    echo manually in PowerShell with execution policy enabled.
    echo.
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Copy .env.example to .env.local
echo 2. Add your Supabase credentials to .env.local
echo 3. Run: npm run dev
echo.
pause
