#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment to openclawex..."

# 1. Configuration swap
echo "📝 Switching Firebase configuration to openclawex..."
cat .firebaserc_for_openclawex > .firebaserc
cat firebase_for_openclawex.json > firebase.json

# 2. Build (Optional but recommended)
# echo "📦 Building the project..."
# npm run build

# 3. Deploy
echo "☁️ Deploying to Firebase Hosting (openclawex)..."
firebase deploy --only hosting:openclawex

echo "✅ Deployment complete! Check https://openclawex.web.app/"
