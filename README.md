# Virtual Persona CV - Online Resume & AI Chatbot

A modern, interactive portfolio website that combines a traditional CV/resume with an AI-powered chatbot. This application serves as your **online professional presence** where visitors can view your experience, projects, and skills, then have a conversation with an AI version of you that knows about your work, education, and projects.

> **Note:** This project was built with the help of AI tools (primarily Cursor AI). This README is written as a beginner's guide—partly for others learning, but mostly so I remember what I did when I come back to this after a long time! 😄

## 🎯 What This App Is

This is a **two-in-one application**:

1. **📄 Online CV/Resume** - A beautiful, responsive portfolio website showcasing:
   - Professional experience
   - Education background
   - Technical projects
   - Skills and expertise
   - Contact information

2. **🤖 Virtual Me Chatbot** - An AI assistant that can:
   - Answer questions about your experience and background
   - Discuss your projects in detail
   - Provide insights about your work
   - Share information from your knowledge base
   - Show images and documentation from your projects

## ✨ Key Features

- **Interactive Portfolio**: Modern, responsive design with smooth animations
- **AI Chatbot**: Powered by Google Gemini, trained on your actual project files and resume
- **Knowledge Base Integration**: The chatbot has access to:
  - Data Science projects (PDFs, markdown files)
  - Machine Learning assignments and projects
  - Extracted images from project documentation
  - Personal summary and LinkedIn profile
- **Real-time Chat**: Streaming responses for natural conversation
- **Project Showcase**: Browse projects with downloadable PDFs
- **Smart Search**: The chatbot searches through my knowledge base to provide accurate, detailed answers

## 🏗️ How It Works

### Frontend (React + TypeScript)
- Built with **React 19** and **Vite** for fast development
- Modern UI with Tailwind CSS styling
- Chat interface with markdown rendering
- Responsive design for mobile and desktop

### Backend (FastAPI + Python)
- **FastAPI** REST API serving chat requests
- **Google Gemini AI** for generating responses
- Knowledge base system that loads and indexes:
  - PDF documents (project reports, assignments)
  - Markdown files (project documentation)
  - Extracted images from PDFs
- Streaming responses for real-time chat experience

### The Magic
When you ask the chatbot a question:
1. Your question is sent to the FastAPI backend
2. The backend searches through your knowledge base for relevant information
3. It builds a context with relevant project files and personal data
4. Google Gemini generates a response based on that context
5. The response streams back to you in real-time

## 🚀 Quick Start

### Prerequisites
- **Node.js** (for frontend)
- **Python 3.11+** (for backend)
- **Google Gemini API Key** (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ppaltsokas/virtual-me-chatbot-v2.git
   cd virtual-me-chatbot-v2
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   - Create a `.env.local` file in the root directory
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. **Start the application**
   ```powershell
   # Windows (PowerShell)
   .\start-all.ps1
   
   # Or manually:
   # Terminal 1 - Backend
   .\start-backend.ps1
   
   # Terminal 2 - Frontend
   .\start-frontend.ps1
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 📁 Project Structure (What's What)

Here's what each folder/file does (for beginners and future me):

```
virtual-me-chatbot-v2/
├── components/          # React UI components
│   └── ChatInterface.tsx  # The chat window you see on screen
├── services/            # Frontend API communication
│   └── geminiService.ts    # Handles talking to the backend
├── kb/                  # Knowledge base - all the project files
│   ├── Data_Science_projects/  # PDFs and docs for data science projects
│   ├── ML_projects/            # PDFs for machine learning projects
│   └── images/                 # Images extracted from PDFs
├── me/                  # Personal info the AI uses
│   ├── CV PALTSOKAS PANAGIOTIS.pdf  # My actual CV
│   ├── linkedin.pdf              # LinkedIn profile export
│   └── summary.txt               # Personal summary text
├── main.py.backend      # Python backend server (FastAPI)
├── requirements.txt.backend  # Python packages needed
├── package.json         # Node.js packages needed
├── App.tsx              # Main React component (the whole page)
├── constants.ts         # All the resume data (experience, skills, etc.)
└── public/              # Static files (images, sounds)
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Markdown** - Markdown rendering
- **Lucide React** - Icons

### Backend
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **Google Gemini AI** - Language model
- **PyPDF2** - PDF processing
- **Pillow** - Image processing

## 📝 What This Does

Instead of a boring static resume, this creates an interactive experience where visitors can:

- **Browse** your experience and projects (like a normal portfolio)
- **Chat** with an AI version of you that knows your work
- **Ask questions** and get detailed answers based on your actual project files
- **View** images and documentation from your projects
- **Download** your CV directly

The chatbot reads your actual project PDFs, markdown files, and personal info, so it can give real answers about your work—not generic responses.

> **Fun fact:** The AI was trained on my actual assignments, project reports, and personal summary. It's like having a digital version of me that remembers everything I've worked on!

## 🔒 Security & Privacy

- Environment variables (API keys) are excluded from version control
- Sensitive files are in `.gitignore`
- No personal data is stored or logged
- All API keys remain local to your environment

## 📚 Documentation

- **PROJECT_OVERVIEW.md** - Technical architecture overview
- **SECURITY.md** - How to keep your API keys safe

> **For future me:** If you're reading this months later and forgot how everything works, start with PROJECT_OVERVIEW.md. It explains the architecture without all the deployment details.

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

## 📄 License

This project is for personal use.

## 👤 Author

**Panagiotis Paltsokas**
- Data Scientist / AI Trust & Safety Professional
- Working at TaskUs (AI Operations | RLHF & Model Optimization)
- MSc in Data Science & Machine Learning
- Based in Thessaloniki, Greece

---

**Live Demo**: https://virtual-me-chatbot-v2-production.up.railway.app

**Repository**: https://github.com/ppaltsokas/virtual-me-chatbot-v2
