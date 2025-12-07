#!/bin/sh
# Railway start script
# Railway sets PORT environment variable automatically

PORT=${PORT:-8000}
exec uvicorn main:app --host 0.0.0.0 --port $PORT



