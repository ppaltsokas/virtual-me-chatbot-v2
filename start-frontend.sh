#!/bin/sh
# Railway start script for frontend
# Railway sets PORT environment variable automatically

PORT=${PORT:-3000}
echo "Starting static file server on port $PORT"

# Ensure dist folder exists
if [ ! -d "dist" ]; then
  echo "Error: dist folder not found. Build might have failed."
  exit 1
fi

# List files in dist to verify build
echo "Files in dist folder:"
ls -la dist/ | head -10

# Use Node.js static server instead of Vite preview for better Railway compatibility
exec node server.js

