

```bash
#!/bin/bash
echo "🚀 Setting up Todo-App Backend"
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
  echo "   - Firebase Project ID"
  echo "   - Firebase Private Key"
  echo "   - Firebase Client Email"
  echo "   - MongoDB URI"
  echo "   - JWT Secret"
  echo ""
  echo "💡 Get Firebase credentials from:"
  echo "   Firebase Console → Project Settings → Service Accounts"
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
echo "👉 Run: npm run dev"
echo "👉 Edit: backend/.env"