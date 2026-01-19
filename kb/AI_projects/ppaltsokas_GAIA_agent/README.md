---
title: Template Final Assignment
emoji: 🕵🏻‍♂️
colorFrom: indigo
colorTo: indigo
sdk: gradio
sdk_version: 5.25.2
app_file: app.py
pinned: false
hf_oauth: true
# optional, default duration is 8 hours/480 minutes. Max duration is 30 days/43200 minutes.
hf_oauth_expiration_minutes: 480
---

Check out the configuration reference at https://huggingface.co/docs/hub/spaces-config-reference

## Local Setup

1. Create/activate the virtual environment.
2. Install dependencies:
   ```
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the project root and add:
   ```
   GOOGLE_API_KEY=<your gemini key>
   OPENAI_API_KEY=<needed for Whisper audio transcription>
   HF_TOKEN=<hugging face token>
   BRAVE_API_KEY=<your brave search api key>
   ```
   (You can request a free Brave API key at https://search.brave.com/help/api .)
4. Install FFmpeg (required for `yt-dlp` + Whisper):
   - Download the latest release from https://www.gyan.dev/ffmpeg/builds/
   - Extract and add the `bin` directory to the system PATH.
   - If you prefer to point to a bundled binary explicitly, set `FFMPEG_PATH` (or `FFMPEG_BINARY`) in your environment to the full path of `ffmpeg.exe`.

## Running the Agent

- Launch the Gradio app (full 30-question run + submission):
  ```
  python app.py
  ```
  Log in with the Hugging Face button, click **Run Evaluation & Submit All Answers**, and wait for completion.

- Dry-run a single question locally without submitting:
  ```
  python run_single.py --question "What is 2+2?" --task-id 12345
  ```
  Add `--save-log logs/sample.json` to store the response.

## Tips

- Warm up Whisper by running one short audio transcription task ahead of the timed evaluation; the first download can take ~1 minute.
- Inspect console logs during runs to see tool selection, file downloads, and any errors quickly.