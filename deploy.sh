#!/bin/bash

# Manual deployment script for GitHub Pages
echo "🚀 Starting deployment to GitHub Pages..."

# Build the project
echo "📦 Building project..."
npm run build:gh-pages

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Create a temporary directory for gh-pages branch
echo "📁 Preparing deployment files..."
rm -rf .deploy
mkdir .deploy
cp -r dist/* .deploy/

# Switch to gh-pages branch
echo "🌿 Switching to gh-pages branch..."
git checkout -B gh-pages

# Remove old files and copy new ones
rm -rf *.html *.js *.css assets/
cp -r .deploy/* .

# Add and commit files
echo "📝 Committing changes..."
git add .
git commit -m "Deploy: $(date)"

# Push to gh-pages branch
echo "🚀 Pushing to GitHub..."
git push origin gh-pages --force

# Switch back to main branch
git checkout main

# Clean up
rm -rf .deploy

echo "✅ Deployment complete! Your site should be live in a few minutes."
echo "🌐 Check your GitHub Pages settings to get the live URL."