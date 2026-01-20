# Virtual Persona CV

An AI-powered professional portfolio that combines a traditional resume with a retrieval-augmented chatbot capable of answering detailed questions about experience, projects, and technical background in real-time.

🌐 **Live at**: https://www.ppaltsokas.com

## Why I Built This

I wanted to explore how large language models can be combined with structured personal data to create more natural and informative professional interfaces. This project demonstrates my ability to design, build, and deploy AI systems that go beyond static content and provide contextual, explainable answers using retrieval-augmented generation (RAG).

As someone working in AI Operations and RLHF, I'm particularly interested in how AI systems can be made more transparent and grounded in actual data rather than generating responses from training data alone.

## Who This Is For

- **Recruiters and hiring managers** exploring my background and capabilities
- **Technical peers** interested in RAG-style systems and LLM integration
- **Anyone curious** about how LLMs can be used for interactive professional profiles

## Overview

This is a two-part application:

1. **Interactive Portfolio Website** - A responsive CV/resume showcasing professional experience, education, projects, and skills
2. **AI Chatbot** - A retrieval-augmented conversational interface that dynamically references my project documents, academic work, and professional background to answer questions in detail

## Key Features

- **Retrieval-Augmented Generation (RAG)**: The chatbot uses retrieval-augmented generation over my documents, dynamically referencing project files, assignments, and professional data at inference time
- **Knowledge Base Integration**: Semantic search across 150+ documents including:
  - Data Science projects (analysis reports, notebooks)
  - Machine Learning assignments (HW1-HW6 with full documentation)
  - AI projects (GAIA Agent, Photo Manager with source code)
  - Academic work with extracted images and visualizations
- **Real-time Streaming**: FastAPI backend with streaming responses for natural conversation flow
- **Session Management**: Thread-safe chat session handling with automatic cleanup
- **Precise Project Matching**: Advanced search with negative keyword detection to ensure accurate project retrieval

## Architecture

### Frontend (React + TypeScript)
- **React 19** - Modern UI framework with server components support
- **TypeScript** - Strong typing for maintainability and reliability
- **Vite** - Fast build tool and development server
- **React Markdown** - Secure markdown rendering for project documentation
- **Tailwind CSS** - Utility-first styling for responsive design

### Backend (FastAPI + Python)
- **FastAPI** - Lightweight, async backend for low-latency AI requests
- **Google Gemini 2.5 Flash** - LLM used for controlled, document-grounded responses
- **PyPDF2** - PDF parsing to enable reasoning over real academic and project artifacts
- **Pillow** - Image extraction and processing from project documents
- **Semantic Search** - Custom relevance scoring with phrase matching, metadata extraction, and negative keyword detection

### How It Works

1. User query arrives at FastAPI backend
2. Backend performs semantic search across knowledge base (PDFs, markdown files)
3. Relevant document chunks are retrieved and ranked by relevance
4. Context is built with retrieved documents and conversation history
5. Google Gemini generates a grounded response using the context
6. Response streams back to frontend in real-time

The system only searches the knowledge base on initial queries or explicit requests—follow-up questions leverage conversation history for context continuity.

## Tech Stack

### Core Technologies
- **Python 3.11+** - Backend runtime
- **Node.js** - Frontend toolchain
- **FastAPI** - Async Python web framework
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript

### AI & ML
- **Google Gemini API** - Large language model for text generation
- **Retrieval-Augmented Generation** - Document grounding approach
- **Semantic Search** - Custom relevance scoring algorithm

### Infrastructure
- **Google Cloud Run** - Backend deployment (containerized)
- **Railway** - Frontend deployment
- **Docker** - Containerization

### Document Processing
- **PyPDF2** - PDF text and image extraction
- **Pillow (PIL)** - Image processing
- **Markdown** - Project documentation format

## Quick Start

### Prerequisites
- Node.js (for frontend)
- Python 3.11+ (for backend)
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone repository
git clone https://github.com/ppaltsokas/virtual-me-chatbot-v2.git
cd virtual-me-chatbot-v2

# Install frontend dependencies
npm install

# Install backend dependencies
pip install -r requirements.txt.backend
```

### Configuration

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_api_key_here
VITE_API_URL=http://localhost:8000
```

### Running Locally

```bash
# Terminal 1 - Start backend
python main.py.backend

# Terminal 2 - Start frontend
npm run dev
```

Access at `http://localhost:5173` (or port shown in terminal).

## Project Structure

```
virtual-me-chatbot-v2/
├── components/          # React UI components
│   └── ChatInterface.tsx
├── services/           # Frontend API services
│   └── geminiService.ts
├── kb/                 # Knowledge base
│   ├── Data_Science_projects/
│   ├── ML_projects/    # HW1-HW6 organized by assignment
│   ├── AI_projects/    # GAIA Agent, Photo Manager
│   └── images/         # Extracted PDF images
├── me/                 # Personal profile data
│   ├── CV PALTSOKAS PANAGIOTIS.pdf
│   ├── linkedin.pdf
│   └── summary.txt
├── main.py.backend     # FastAPI backend server
└── constants.ts        # Resume data and configuration
```

## Security & Privacy

- **No personal data is intentionally stored** by the application
- **Sensitive files are excluded** from version control via `.gitignore`
- **API keys are handled** via environment variables only
- **Environment files** (`.env*`) are excluded from the repository
- Infrastructure-level logs may exist at deployment platform

## Documentation

- **PROJECT_OVERVIEW.md** - Technical architecture and design decisions
- **SECURITY.md** - Security best practices and key management
- **DEV_NOTES.md** - Development notes, learning resources, and implementation details

## Live Portfolio

🌐 **Live Site**: https://www.ppaltsokas.com  
🚂 **Railway Deployment**: https://virtual-me-chatbot-v2-production.up.railway.app

The portfolio is live and fully functional with custom domain, SSL certificate, and all features enabled including the AI chatbot.

## Author

**Panagiotis Paltsokas**  
Data Scientist / AI Trust & Safety Professional  
Working at TaskUs (AI Operations | RLHF & Model Optimization)  
MSc in Data Science & Machine Learning | BSc in Mathematics  
Based in Thessaloniki, Greece

---

**Repository**: https://github.com/ppaltsokas/virtual-me-chatbot-v2
