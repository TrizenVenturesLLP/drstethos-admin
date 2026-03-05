@echo off
REM DrStethos Cloud Functions Setup Script (Windows)
REM This script helps you set up Firebase Cloud Functions for notifications

echo.
echo 🚀 DrStethos Cloud Functions Setup
echo ===================================
echo.

REM Check if service-account-key.json exists
if not exist "backend\service-account-key.json" (
    echo ⚠️  service-account-key.json not found in backend\
    echo 📝 Please add your Firebase service account key:
    echo.
    echo 1. Go to: https://console.firebase.google.com
    echo 2. Select 'drstethos-app' project
    echo 3. Settings ^> Service Accounts ^> Firebase Admin SDK
    echo 4. Click 'Generate new private key'
    echo 5. Save the file as: backend\service-account-key.json
    echo.
    pause
)

if not exist "backend\service-account-key.json" (
    echo ❌ Setup cancelled - service account key is required
    exit /b 1
)

echo ✅ Service account key found
echo.

REM Check if in backend directory
if not exist "backend\package.json" (
    echo Installing dependencies...
    cd backend
    call npm install
    cd ..
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🔐 Logging in to Firebase...
call firebase login

echo.
echo 📤 Deploying Cloud Functions...
call firebase deploy --only functions

echo.
echo ✅ Setup complete!
echo.
echo 📊 Verify deployment:
echo    firebase functions:list
echo    firebase functions:log
echo.
echo 📖 For more information, see: CLOUD_FUNCTIONS_SETUP.md
echo.
pause
