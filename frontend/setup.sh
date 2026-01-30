#!/bin/bash
echo "🚀 Setting up Todo-App Frontend"
echo "================================"

# Check if .env exists
if [ -f ".env" ]; then
  echo "⚠️  .env file already exists. Backing up..."
  cp .env .env.backup.$(date +%Y%m%d%H%M%S)
fi

# Create .env from example
if [ -f ".env.example" ]; then
  cp .env.example .env
  echo "✅ Created .env file from example"
  echo ""
  echo "📝 Please edit the .env file with your credentials:"
  echo "   - REACT_APP_FIREBASE_API_KEY"
  echo "   - REACT_APP_FIREBASE_AUTH_DOMAIN"
  echo "   - REACT_APP_FIREBASE_PROJECT_ID"
  echo "   - REACT_APP_FIREBASE_STORAGE_BUCKET"
  echo "   - REACT_APP_FIREBASE_MESSAGING_SENDER_ID"
  echo "   - REACT_APP_FIREBASE_APP_ID"
  echo ""
  echo "💡 Get Firebase Web Config from:"
  echo "   Firebase Console → Project Settings → General → Your apps"
  echo ""
else
  echo "❌ .env.example not found!"
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🎉 Setup complete!"
echo "👉 Run: npm start"
echo "👉 Edit: frontend/.env"