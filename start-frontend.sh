#!/bin/sh
# Railway start script - serves built frontend

PORT=${PORT:-3000}
echo "Starting static file server on port $PORT"

# Check dist folder exists
if [ ! -d "dist" ]; then
  echo "Error: dist folder not found. Build might have failed."
  exit 1
fi

# List dist contents
echo "Files in dist folder:"
ls -la dist/ | head -10

# Start Node.js static server
exec node server.js

