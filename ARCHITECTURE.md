# Application Architecture

This document explains how the Virtual Persona CV application works, from the frontend interface to the backend AI processing. It's written to help understand the system even if you're not deeply familiar with all the technologies involved.

## High-Level Overview

The application has two main parts that work together:

1. **Frontend** - The website you see in your browser (React + TypeScript)
2. **Backend** - The Python server that handles AI processing (FastAPI + Google Gemini)

They communicate over HTTP using a REST API. When you type a question in the chat, the frontend sends it to the backend, the backend processes it with AI, and streams the response back.

## Frontend Architecture

### What It Is

The frontend is a single-page application built with React. This means the entire website runs in your browser as JavaScript, and it communicates with the backend API to get data and AI responses.

### Key Components

**App.tsx** - The main component that renders the portfolio. It shows your resume, projects, skills, and includes the chat button.

**ChatInterface.tsx** - The chat component that handles the conversation UI. It manages the message list, input field, and streaming responses from the backend.

**geminiService.ts** - A service layer that handles communication with the backend API. It creates chat sessions and manages the streaming response from the FastAPI server.

**constants.ts** - Contains all the static resume data (experience, education, projects) that gets displayed on the portfolio page.

### How Frontend Works

1. User opens the website
2. React renders the portfolio from data in `constants.ts`
3. User clicks chat button or it auto-opens on desktop
4. User types a question
5. Frontend sends POST request to backend `/chat` endpoint
6. Backend streams response back
7. Frontend displays response as it arrives (streaming)

The frontend doesn't do any AI processing itself. It's purely a UI layer that talks to the Python backend.

## Backend Architecture

### What It Is

The backend is a Python web server built with FastAPI. It handles all the AI logic, knowledge base searching, and response generation. It runs as a separate service that the frontend calls.

### Main Components

**main.py.backend** - The entire backend application in one file. It contains:
- FastAPI app setup
- Knowledge base loading
- Persona data loading
- Chat endpoint with AI processing
- Search functionality
- Session management

### Knowledge Base System

The knowledge base is a collection of files in the `kb/` folder:
- PDFs from projects and assignments
- Markdown files with project documentation
- Extracted images from PDFs

When the backend starts, it loads all these files into memory. It processes PDFs to extract text and images, and stores everything in dictionaries for fast lookup.

### Persona Data

The `me/` folder contains personal information:
- `summary.txt` - Your bio and background information
- CV and LinkedIn PDFs

This data is loaded separately and used to build the system prompt that tells the AI how to respond as you.

### Search System

The backend has two search methods:

1. **Keyword Search** - Searches for exact words and phrases in documents. Fast and always available.

2. **FAISS Vector Search** - Uses AI embeddings to find semantically similar content. More accurate but requires building an index first. Optional - falls back to keyword search if not available.

When you ask a question, the backend:
1. Determines if it's a personal question (about you) or project question (about work)
2. Searches the appropriate knowledge base
3. Retrieves the most relevant document chunks
4. Builds context from those chunks
5. Sends everything to Google Gemini to generate a response

### AI Processing Flow

Here's what happens when you ask a question:

1. **Request arrives** at `/chat` endpoint
2. **Question classification** - Is it personal? Project-related? Education?
3. **Knowledge retrieval** - Search kb/ or me/ folders for relevant info
4. **Context building** - Combine retrieved documents with conversation history
5. **System prompt** - Build instructions telling Gemini how to respond
6. **AI generation** - Send to Google Gemini API with all context
7. **Streaming response** - Gemini streams tokens back, backend forwards to frontend
8. **Session storage** - Save conversation for follow-up questions

### Session Management

The backend keeps track of chat sessions. Each conversation gets a unique session ID. The backend stores:
- Chat history (for context in follow-up questions)
- System prompt version (to detect when prompts change)
- Session timestamps (for cleanup of old sessions)

Sessions are stored in memory using Python dictionaries. They're thread-safe using locks to handle multiple users simultaneously.

### Q&A Database

There's a SQLite database (`data/qadb.sqlite`) that stores question-answer pairs. This serves as a memory system:
- Frequently asked questions get cached
- Good answers are saved for reuse
- Unknown questions are logged for review

This helps the system learn and improve over time.

## How Frontend and Backend Communicate

### API Endpoints

The backend exposes several endpoints:

- `POST /chat` - Main chat endpoint. Takes a message and session_id, returns streaming response
- `GET /health` - Health check endpoint. Returns system status
- `GET /me/status` - Returns persona files status
- `GET /kb/status` - Returns knowledge base status
- `POST /kb/build-faiss` - Builds FAISS vector index (optional)

### Communication Flow

1. Frontend makes HTTP request to backend
2. Backend processes request (searches KB, calls Gemini)
3. Backend streams response back using Server-Sent Events (SSE)
4. Frontend receives chunks and displays them as they arrive

The streaming is important because it makes the conversation feel natural - you see the response being typed out rather than waiting for the entire thing.

## Data Flow Example

Let's trace what happens when you ask "What projects have you worked on?"

1. **Frontend**: User types question, clicks send
2. **Frontend**: `geminiService.ts` sends POST to `http://localhost:8000/chat` with message and session_id
3. **Backend**: FastAPI receives request at `/chat` endpoint
4. **Backend**: Classifies question as "project question"
5. **Backend**: Searches `kb/` folder for project-related documents
6. **Backend**: Retrieves top 3-5 most relevant project documents
7. **Backend**: Builds system prompt with your persona info
8. **Backend**: Builds user message with question + retrieved context
9. **Backend**: Calls Google Gemini API with system prompt and user message
10. **Backend**: Gemini streams response tokens
11. **Backend**: Forwards each token to frontend via streaming response
12. **Frontend**: Receives tokens and displays them in chat UI
13. **Backend**: Saves conversation to session for future context

## Key Technologies Explained

### FastAPI

FastAPI is a Python web framework. Think of it as the engine that powers the backend. It handles HTTP requests, routing, and response formatting. It's chosen because it's fast, supports async operations (important for AI API calls), and has automatic API documentation.

### Google Gemini API

Gemini is Google's large language model. It's the AI brain that generates responses. The backend sends it:
- A system prompt (instructions on how to respond)
- The user's question
- Relevant context from the knowledge base
- Conversation history

Gemini then generates a response based on all this information.

### Retrieval-Augmented Generation (RAG)

RAG is the technique that makes the chatbot accurate. Instead of relying only on what Gemini learned during training, the system:
1. Searches your actual documents
2. Retrieves relevant information
3. Feeds that information to Gemini along with the question

This ensures responses are grounded in your actual work and projects, not hallucinations.

### FAISS

FAISS (Facebook AI Similarity Search) is a library for vector similarity search. When enabled, it:
1. Converts all documents into vector embeddings (numerical representations)
2. Stores them in an index
3. When you ask a question, converts it to a vector
4. Finds the most similar document vectors

This is more accurate than keyword search because it understands meaning, not just exact word matches.

### SQLite

SQLite is a lightweight database that stores data in a single file. The Q&A database uses it to:
- Store question-answer pairs
- Enable fast lookups for common questions
- Provide persistent memory across server restarts

## Deployment Architecture

### Backend (Google Cloud Run)

The backend runs in a Docker container on Google Cloud Run. This means:
- The Python code is packaged into a container
- Cloud Run manages scaling and availability
- The container includes all dependencies (Python packages, system libraries)
- It automatically scales based on traffic

### Frontend (Railway)

The frontend is deployed on Railway, which:
- Detects it's a Node.js project
- Builds it using Vite
- Serves the static files
- Automatically deploys when you push to GitHub

### Communication Between Services

The frontend (Railway) and backend (Cloud Run) communicate over HTTPS:
- Frontend makes requests to the Cloud Run URL
- Cloud Run processes and responds
- CORS (Cross-Origin Resource Sharing) is configured to allow this

## File Organization

### Frontend Files
- `components/` - React components (UI pieces)
- `services/` - API communication code
- `public/` - Static assets (images, favicons)
- `constants.ts` - Resume data

### Backend Files
- `main.py.backend` - Entire backend application
- `kb/` - Knowledge base documents
- `me/` - Personal information files
- `data/` - SQLite database files

### Configuration Files
- `requirements.txt.backend` - Python dependencies
- `package.json` - Node.js dependencies
- `Dockerfile.backend` - Container build instructions
- `.env.local` - Environment variables (not in git)

## Security Considerations

- API keys are never stored in code - only in environment variables
- CORS is configured to only allow requests from your domain
- Rate limiting prevents abuse
- Input validation prevents injection attacks
- Sensitive files are excluded from git

## Performance Optimizations

- Knowledge base is loaded once at startup (not on every request)
- Sessions are cached in memory for fast access
- Streaming responses start immediately (don't wait for full response)
- FAISS index is built once and reused
- Embedding cache prevents redundant API calls

## Error Handling

The system handles various error cases:
- Backend unavailable - Frontend shows error message
- API rate limits - Backend retries with backoff
- Invalid responses - Safety filters catch and handle
- Missing files - Fail-fast in production, warnings in development

## Future Improvements

Potential enhancements:
- More sophisticated vector search
- Better session persistence
- Analytics and monitoring
- Multi-language support
- Voice interface

This architecture is designed to be maintainable, scalable, and understandable. Each component has a clear responsibility, and the separation between frontend and backend makes it easy to update or replace parts independently.
