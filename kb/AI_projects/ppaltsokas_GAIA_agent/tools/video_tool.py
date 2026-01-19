import os
import shutil
import subprocess
import tempfile
import re

try:
    import whisper
except Exception:  # pragma: no cover - optional dependency
    whisper = None


class VideoTool:
    def __init__(self):
        self.model = None
        if whisper is not None:
            try:
                self.model = whisper.load_model("base")
            except Exception:
                self.model = None

        # Allow users to point to bundled ffmpeg explicitly; otherwise fall back to PATH discovery.
        self.ffmpeg_location = (
            os.getenv("FFMPEG_PATH")
            or os.getenv("FFMPEG_BINARY")
            or shutil.which("ffmpeg")
        )

    def extract_youtube_url(self, text):
        match = re.search(r'(https?://(?:www\.)?youtube\.com/watch\?v=[\w-]+)', text)
        return match.group(1) if match else None

    def extract_transcript(self, youtube_url: str) -> str:
        if self.model is None:
            return "Video transcription unavailable: whisper dependency not loaded."
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                audio_path = os.path.join(tmpdir, "audio")  # path sans extension

                cmd = [
                    "yt-dlp",
                    "-f", "bestaudio[ext=m4a]/bestaudio",
                    "-x", "--audio-format", "wav",
                    "-o", f"{audio_path}.%(ext)s",   # prevents double extension
                    youtube_url,
                ]
                if self.ffmpeg_location:
                    cmd.insert(6, self.ffmpeg_location)
                    cmd.insert(6, "--ffmpeg-location")

                subprocess.run(
                    cmd,
                    text=True,
                    capture_output=True,
                    check=True,
                )

                # yt‑dlp will have produced audio.wav
                wav_file = f"{audio_path}.wav"
                transcription = self.model.transcribe(wav_file)
                return transcription.get("text", "").strip()

        except subprocess.CalledProcessError as e:
            return f"Video download failed:\n{e.stderr.strip()}"
        except Exception as e:
            return f"Video transcription failed: {e}"
