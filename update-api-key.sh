#!/bin/bash

# Script to update GEMINI_API_KEY in .env file
# Usage: ./update-api-key.sh YOUR_NEW_API_KEY

if [ -z "$1" ]; then
    echo "❌ Error: No API key provided"
    echo ""
    echo "Usage: ./update-api-key.sh YOUR_NEW_API_KEY"
    echo ""
    echo "Example:"
    echo "  ./update-api-key.sh AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    exit 1
fi

NEW_API_KEY="$1"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    exit 1
fi

# Backup the current .env file
cp .env .env.backup
echo "✅ Created backup: .env.backup"

# Update the API key
if grep -q "GEMINI_API_KEY=" .env; then
    # Replace existing key
    sed -i.tmp "s/GEMINI_API_KEY=.*/GEMINI_API_KEY=\"$NEW_API_KEY\"/" .env
    rm .env.tmp 2>/dev/null || true
    echo "✅ Updated GEMINI_API_KEY in .env"
else
    # Add new key
    echo "GEMINI_API_KEY=\"$NEW_API_KEY\"" >> .env
    echo "✅ Added GEMINI_API_KEY to .env"
fi

echo ""
echo "🎉 Done! Your .env file has been updated."
echo ""
echo "Next steps:"
echo "1. Update the same key in Vercel environment variables"
echo "2. Redeploy on Vercel"
echo "3. Test the 'Generate Info' button"
echo ""
