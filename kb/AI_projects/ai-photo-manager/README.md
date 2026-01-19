# AI Photo Gallery Manager

A local photo manager that helps you search, review, and safely delete images using natural language.

It scans your photo folders, generates short captions with an AI vision model, and lets you search with prompts like:

- "math notes"
- "handwritten equations"
- "whiteboard"
- "documents"
- "screenshots with text"

You stay in control: the app runs locally, deletions go to the Windows Recycle Bin, and images stay on disk.

---

## How it works

### 1. Index your folders
Point the app at one or more photo folders. For each image it:

- Loads and downsizes for speed
- Generates a short caption
- Creates a semantic embedding
- Stores the metadata in a local SQLite database

Only metadata is stored -- your images are never moved or copied.

---

### 2. Search by meaning
Search using natural language instead of file names.

Examples:
- "math notes"
- "handwritten formulas"
- "passport photo"
- "notes on lined paper"

Your query is embedded and matched against the captions, so similar concepts show up even if the words differ.

---

### 3. Review results visually
Results show:

- Thumbnails
- Captions
- Relevance scores

You can inspect everything before taking action.

---

### 4. Delete safely
You can remove selected images from inside the app.

Important:
- Files go to the Windows Recycle Bin
- Nothing is permanently deleted
- Deleted items are marked in the database

---

## Why this exists
Most photo managers rely on folders, file names, or manual tags. This app is for large, messy collections where you want to search by meaning: scanned notes, whiteboards, screenshots, and similar content.

---

## AI provider design (OpenAI / Gemini)
The provider is pluggable:

- OpenAI is the default
- Gemini can be swapped in later
- Provider choice is controlled via environment variables

This keeps the core app stable and avoids lock-in.

---

## What runs locally vs remotely

Local:
- Folder scanning
- Image previews
- Database (SQLite)
- Search ranking
- Deletion logic

Remote (via API):
- Image captioning
- Text embeddings

Images and metadata stay local except during the AI request itself.

---

## Project structure (simplified)

```
app.py
core/
  db.py
  indexer.py
  search.py
providers/
  openai_provider.py
  gemini_provider.py
utils/
  images.py
  paths.py
```

