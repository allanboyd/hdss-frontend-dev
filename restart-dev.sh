#!/bin/bash

echo "🔄 Restarting development server..."

# Stop any running Next.js processes
pkill -f "next dev" || true

# Clear Next.js cache
rm -rf .next

# Clear node modules cache (optional)
# rm -rf node_modules/.cache

# Reinstall dependencies (optional, uncomment if needed)
# npm install

# Start development server
echo "🚀 Starting development server..."
npm run dev 