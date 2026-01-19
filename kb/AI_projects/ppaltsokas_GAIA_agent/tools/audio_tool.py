import os
import openai


class AudioTranscriptionTool:
    """
    Handles both openai‑python ≥1.3 (returns object with .text)
    and older versions that return a dict.
    """
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def transcribe_audio(self, file_path: str) -> str:
        try:
            with open(file_path, "rb") as audio_file:
                resp = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file
                )

            # Newer SDKs return a dataclass with .text; older ones return a dict.
            return (resp.text if hasattr(resp, "text") else resp["text"]).strip()

        except Exception as e:
            return f"Audio transcription failed: {e}"
