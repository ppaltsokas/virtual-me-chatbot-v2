# Development Notes & Learning Resources

> **Note for future me:** This document contains development notes, implementation details, and learning resources. The main README is focused on recruiters and technical peers—this is where we keep the "how I built it" details and memory aids.

## Project Context

This project was built with the help of AI tools (primarily Gemini, ChatGPT, and Cursor AI). These notes are here to help me (and others learning) understand the implementation details, decisions made, and how things work under the hood.

## Key Implementation Details

### Retrieval-Augmented Generation (RAG)

**Important**: The chatbot uses retrieval-augmented generation, NOT training or fine-tuning.

- **What we're doing**: At inference time, we search the knowledge base, retrieve relevant documents, and pass them as context to the LLM
- **What we're NOT doing**: We are not fine-tuning or training a model on personal data
- **Why it matters**: This is more accurate, transparent, and aligns with current best practices for document-grounded AI systems

### Knowledge Base Structure

The `kb/` folder contains:
- **Data_Science_projects/** - Analysis projects (PDFs, markdown)
- **ML_projects/** - Organized by assignment (HW1-HW6), each with:
  - Markdown documentation converted from Jupyter notebooks
  - PNG images extracted from notebooks
- **AI_projects/** - Complete projects with source code:
  - `ppaltsokas_GAIA_agent/` - Multi-tool AI agent implementation
  - `ai-photo-manager/` - Photo management with AI integration

### Search Algorithm

The custom search uses multiple scoring factors:
1. **Exact filename matching** (highest priority) - 500 points
2. **Project title matching** - 200 points
3. **Distinguishing keyword matching** - 150 points per match
4. **Phrase matching in content** - 80-100 points
5. **Header matching** - 60 points
6. **Word frequency** - 0.3x multiplier
7. **Negative keyword detection** - Penalizes mismatches (-100 to -200)

This ensures that when someone asks about "GAIA Agent", they get GAIA Agent files, not Photo Manager files.

### Session Management

- Chat sessions are stored in memory with thread-safe locks
- Sessions auto-cleanup after 1 hour of inactivity
- Knowledge base search only happens on:
  - First message in a conversation
  - Explicit random selection requests
- Follow-up questions rely on conversation history (cheaper, faster, more context-aware)

## Development Workflow

### Converting Jupyter Notebooks to Markdown

See `CONVERT_NOTEBOOKS.md` for detailed instructions. Key points:
- Markdown is better than PDF images for AI processing
- Text-based, searchable, smaller file size
- Preserves code blocks as executable text
- Better for version control

### Local Development

```bash
# Backend (FastAPI)
python main.py.backend
# Runs on http://localhost:8000

# Frontend (Vite)
npm run dev
# Runs on http://localhost:5173 (or shown port)
```

### Environment Setup

Required environment variables:
- `GEMINI_API_KEY` - Google Gemini API key
- `VITE_API_URL` - Backend URL (defaults to localhost:8000)
- `ALLOWED_ORIGINS` - CORS origins (comma-separated)
- `PUSHOVER_TOKEN` / `PUSHOVER_USER` - Optional notification service

## What's What (Project Structure Explained)

For beginners and future reference:

```
components/ChatInterface.tsx  # The chat window you see on screen
services/geminiService.ts     # Handles talking to the backend API
kb/                           # Knowledge base - all project files the AI can reference
me/                           # Personal info (CV, LinkedIn, summary) for system prompt
main.py.backend              # FastAPI server with chat endpoint and KB search
constants.ts                 # Resume data (experience, skills, projects) shown on page
```

## How The Magic Works

When you ask the chatbot a question:

1. **Frontend** sends message to FastAPI backend (`/chat` endpoint)
2. **Backend** checks if this is a new session or follow-up
3. **If new/explicit request**: Searches knowledge base using semantic search
4. **Retrieval**: Finds relevant document chunks (top 2-3 most relevant)
5. **Context building**: Combines retrieved docs + conversation history
6. **LLM call**: Sends context + user message to Google Gemini
7. **Streaming**: Gemini streams response back, frontend displays in real-time
8. **Session storage**: Conversation history maintained for follow-up questions

The "magic" is in the search algorithm—it needs to be smart enough to find the right projects even when queries are vague or specific project names aren't mentioned.

## Common Tasks

### Reload Knowledge Base

```bash
# Via API endpoint (if backend running)
curl -X POST http://localhost:8000/kb/reload

# Or restart the backend server
```

### Extract Images from PDFs

```bash
# Via API endpoint
curl -X POST http://localhost:8000/kb/extract-images
```

### Check Knowledge Base Status

```bash
curl http://localhost:8000/kb/status
```

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (needs 3.11+)
- Check dependencies: `pip install -r requirements.txt.backend`
- Check for `.env.local` file with `GEMINI_API_KEY`

### Frontend won't connect
- Check backend is running on port 8000
- Check `VITE_API_URL` in `.env.local`
- Check CORS settings in backend

### Chatbot gives wrong projects
- Check knowledge base loaded correctly: `/kb/status`
- Check search logs in backend console
- Verify project files are in correct folders

### Images not showing
- Images are extracted from PDFs on first load
- Check `/kb/images/` folder exists
- Re-extract if needed: `/kb/extract-images` endpoint

## Deployment Notes

### Backend (Google Cloud Run)
- Uses `Dockerfile.backend` for containerization
- Deployed via `deploy-backend.ps1` script
- Environment variables set in Cloud Run console
- See `PROJECT_OVERVIEW.md` for architecture details

### Frontend (Railway)
- Uses `railpack.toml` for Node.js detection
- Static files served via `server.js`
- Environment variables set in Railway dashboard
- Auto-deploys on push to main branch

## Future Improvements

Ideas for enhancement (for future reference):

- [ ] Add embedding-based semantic search (currently using keyword matching)
- [ ] Implement caching for frequently asked questions
- [ ] Add admin panel for knowledge base management
- [ ] Support more file formats (DOCX, HTML, etc.)
- [ ] Add analytics for common questions
- [ ] Implement rate limiting
- [ ] Add conversation export/download

## Learning Resources

Helpful references used during development:

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [React 19 Features](https://react.dev/blog)
- [RAG Best Practices](https://www.pinecone.io/learn/retrieval-augmented-generation/)

## Fun Facts (For Memory)

- The "Hello there" greeting triggers a Star Wars reference in responses
- Session cleanup runs automatically every hour
- PDFs can extract up to 50 images per file (to prevent hangs)
- Markdown files automatically find PNG images in the same folder
- First messages trigger Pushover notifications (if configured)

---

*Last updated: After major README refactoring for professional portfolio positioning*
