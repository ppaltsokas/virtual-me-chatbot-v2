<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1I6SjB_4oYzUbdnueZU3HlPTeCEkQSjVU

## Run Locally

**Prerequisites:**  
- Node.js
- Python 3.11+ (with virtual environment)

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   pip install -r requirements.txt
   ```

2. **Set the `GEMINI_API_KEY` in `.env.local`** to your Gemini API key

3. **Start the backend** (in one terminal):
   ```powershell
   .\start-backend.ps1
   ```
   Or manually:
   ```bash
   .\venv\Scripts\python.exe main.py
   ```

4. **Start the frontend** (in another terminal):
   ```powershell
   .\start-frontend.ps1
   ```
   Or manually:
   ```bash
   npm run dev
   ```

5. **Open your browser** to `http://localhost:3000`

### Troubleshooting

**If you see an old chatbot:**
- Do a **hard refresh**: `Ctrl+Shift+R` (Chrome/Edge) or `Ctrl+F5`
- Or clear your browser cache
- Make sure only ONE backend instance is running on port 8000

**If port 8000 is already in use:**
- Kill existing processes: The `start-backend.ps1` script does this automatically
- Or manually: `netstat -ano | findstr :8000` then `taskkill /F /PID <pid>`
