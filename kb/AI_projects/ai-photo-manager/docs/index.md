# AI Photo Gallery Manager

A local, AI-powered photo management tool that helps you search, review, and safely delete photos using natural language.

## What it does
- Indexes photos with AI captions and semantic embeddings
- Lets you search by meaning (not just filenames)
- Shows visual results with captions and scores
- Sends deletions to the Windows Recycle Bin

## Local vs remote
Local:
- Folder scanning
- Image previews
- SQLite database
- Search ranking
- Deletion logic

Remote (via API):
- Image captioning
- Text embeddings

## Quick start
1. Create a `.env` from the example in the repo (keep it local)
2. Install dependencies from `requirements.txt`
3. Run the app with Streamlit

## Notes
- Images stay on disk; only metadata is stored locally
- AI provider is pluggable (OpenAI by default)
