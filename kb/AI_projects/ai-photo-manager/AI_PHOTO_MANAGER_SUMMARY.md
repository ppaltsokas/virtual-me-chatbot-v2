# AI Photo Gallery Manager Project

**Project:** AI Photo Gallery Manager - Local Photo Manager with Semantic Search  
**Repository:** https://github.com/ppaltsokas/ai-photo-manager  
**Date:** 2024  
**Technologies:** Python, SQLite, OpenAI Vision API, Google Gemini, Semantic Embeddings, FAISS (optional)

## Project Description

A local photo manager application that helps users search, review, and safely delete images using natural language queries. The application scans photo folders, generates short captions using AI vision models, and enables semantic search capabilities. Unlike traditional photo managers that rely on folders, file names, or manual tags, this app is designed for large, messy collections where users want to search by meaning (e.g., scanned notes, whiteboards, screenshots, documents).

## Key Features

### Core Functionality
- **Semantic Search:** Search images using natural language queries (e.g., "math notes", "handwritten equations", "whiteboard", "documents")
- **AI-Powered Captioning:** Generates short captions for each image using AI vision models
- **Local-First Architecture:** Runs locally with SQLite database; images never moved or copied
- **Safe Deletion:** Deleted files go to Windows Recycle Bin; nothing permanently deleted
- **Visual Review:** Results show thumbnails, captions, and relevance scores before taking action

### Architecture

**Local Components:**
- Folder scanning and image processing
- SQLite database for metadata storage
- Image previews and thumbnail generation
- Search ranking and relevance scoring
- Deletion logic with Recycle Bin integration

**Remote Components (via API):**
- Image captioning using AI vision models
- Text embeddings for semantic search

**Pluggable AI Providers:**
- OpenAI (default) - GPT-4 Vision for captions, text-embedding-3-small for embeddings
- Google Gemini (swappable) - Alternative provider support
- Provider choice controlled via environment variables

### Project Structure

```
app.py                    # Main application entry point
core/
  db.py                   # SQLite database operations
  indexer.py             # Image indexing and captioning
  search.py               # Semantic search implementation
providers/
  base.py                # Base provider interface
  openai_provider.py     # OpenAI implementation
  gemini_provider.py     # Google Gemini implementation
utils/
  images.py              # Image processing utilities
  paths.py               # Path handling utilities
  clipboard.py           # Clipboard integration
```

## Technical Implementation

### Indexing Process
1. Scans specified photo folders recursively
2. Loads and downsizes images for processing speed
3. Generates short captions using AI vision model
4. Creates semantic embeddings for each caption
5. Stores metadata in local SQLite database
6. Images remain in original locations (no copying/moving)

### Search Process
1. User enters natural language query
2. Query is embedded using same embedding model
3. Semantic similarity search against stored captions
4. Results ranked by relevance score
5. Visual results displayed with thumbnails and captions

### Safety Features
- All deletions go to Windows Recycle Bin
- Deleted items marked in database (not removed)
- No permanent deletion from within app
- Images stay on disk; only metadata stored

## Use Cases

- **Academic Notes:** Search through scanned lecture notes, whiteboard photos, handwritten equations
- **Document Management:** Find specific documents, screenshots, or text-heavy images
- **Photo Organization:** Organize large collections of similar content (e.g., passport photos, ID cards)
- **Content Discovery:** Find images by meaning rather than filename or folder structure

## Design Philosophy

- **Privacy-First:** All processing happens locally except AI API calls
- **User Control:** Users review all results before deletion
- **No Vendor Lock-In:** Pluggable provider architecture
- **Simple Interface:** Focus on semantic search, not complex tagging systems

