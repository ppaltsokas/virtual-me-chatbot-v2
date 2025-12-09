FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for PDF processing
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
# Handle both requirements.txt and requirements.txt.backend
COPY requirements.txt* ./
RUN if [ -f requirements.txt.backend ]; then cp requirements.txt.backend requirements.txt; fi
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Rename main.py.backend to main.py for uvicorn (if it exists)
RUN if [ -f main.py.backend ]; then mv main.py.backend main.py; fi

# Expose port (Cloud Run uses PORT env var, default to 8080)
EXPOSE 8080

# Run the application
# Cloud Run will set PORT environment variable
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}

