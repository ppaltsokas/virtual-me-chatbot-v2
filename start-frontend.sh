#!/bin/sh
# Railway start script for frontend
# Railway sets PORT environment variable automatically

PORT=${PORT:-3000}
echo "Starting Vite preview on port $PORT"

# Ensure dist folder exists
if [ ! -d "dist" ]; then
  echo "Error: dist folder not found. Build might have failed."
  exit 1
fi

# Start Vite preview with explicit port
exec npx vite preview --host 0.0.0.0 --port $PORT

