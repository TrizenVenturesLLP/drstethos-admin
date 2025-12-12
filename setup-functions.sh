#!/bin/bash

# DrStethos Cloud Functions Setup Script
# This script helps you set up Firebase Cloud Functions for notifications

echo "🚀 DrStethos Cloud Functions Setup"
echo "=================================="
echo ""

# Check if service-account-key.json exists
if [ ! -f "backend/service-account-key.json" ]; then
    echo "⚠️  service-account-key.json not found in backend/"
    echo "📝 Please add your Firebase service account key:"
    echo ""
    echo "1. Go to: https://console.firebase.google.com"
    echo "2. Select 'drstethos-app' project"
    echo "3. Settings → Service Accounts → Firebase Admin SDK"
    echo "4. Click 'Generate new private key'"
    echo "5. Save the file as: backend/service-account-key.json"
    echo ""
    read -p "Press Enter once you've added the file..."
fi

if [ ! -f "backend/service-account-key.json" ]; then
    echo "❌ Setup cancelled - service account key is required"
    exit 1
fi

echo "✅ Service account key found"
echo ""

# Check if in backend directory
if [ ! -f "backend/package.json" ]; then
    echo "Installing dependencies..."
    cd backend || exit
    npm install
    cd ..
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🔐 Logging in to Firebase..."
firebase login

echo ""
echo "📤 Deploying Cloud Functions..."
firebase deploy --only functions

echo ""
echo "✅ Setup complete!"
echo ""
echo "📊 Verify deployment:"
echo "   firebase functions:list"
echo "   firebase functions:log"
echo ""
echo "📖 For more information, see: CLOUD_FUNCTIONS_SETUP.md"
