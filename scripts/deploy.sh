#!/bin/bash

echo "🚀 Starting deployment process..."

# Bump version
echo "📈 Bumping version..."
node scripts/bump-version.js

# Add changes
echo "📦 Staging changes..."
git add .

# Commit with version bump
VERSION=$(node -p "require('./version.json').major + '.' + require('./version.json').minor + '.' + require('./version.json').patch")
git commit -m "Bump version to v$VERSION"

# Push to GitHub (triggers Render deployment)
echo "📤 Pushing to GitHub..."
git push origin main

# Deploy client to Vercel
echo "🔧 Deploying client to Vercel..."
cd client
vercel --prod
cd ..

echo "✅ Deployment complete! Version: v$VERSION"
echo "🔍 Check deployments:"
echo "   - Client: https://client.vercel.app"
echo "   - Server: https://designer-ai-server.onrender.com/api/health"
