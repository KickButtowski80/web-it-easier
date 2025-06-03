#!/bin/bash
# Script to update the sitemap.xml with all blog posts

# Navigate to the project root directory
cd "$(dirname "$0")/.." || exit

# Install dependencies if not already installed
if [ ! -d "node_modules/firebase" ]; then
  echo "Installing required dependencies..."
  pnpm install firebase dotenv
fi

# Run the sitemap generator
echo "Generating sitemap..."
node scripts/generate-sitemap.js

echo "Sitemap update complete!"
echo "Sitemap has been updated at public/sitemap.xml"

# Display the contents of the sitemap
echo "\nSitemap contents:"
cat public/sitemap.xml
