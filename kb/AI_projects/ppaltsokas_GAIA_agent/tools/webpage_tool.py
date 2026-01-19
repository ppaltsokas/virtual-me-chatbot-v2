from __future__ import annotations

import os
import time
from typing import Any

import requests

try:
    from bs4 import BeautifulSoup
except ImportError:
    BeautifulSoup = None


class WebpageTool:
    """Tool for fetching and extracting text content from web pages."""

    def __init__(self):
        if BeautifulSoup is None:
            raise ImportError(
                "BeautifulSoup4 not installed. Install with: pip install beautifulsoup4"
            )
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        self.last_request_time = 0.0
        self.min_delay = 0.5  # Minimum delay between requests

    def visit(self, url: str, max_length: int = 5000) -> str:
        """
        Fetch a webpage and extract its main text content.
        Returns cleaned text content, truncated to max_length characters.
        """
        # Rate limiting
        elapsed = time.time() - self.last_request_time
        if elapsed < self.min_delay:
            time.sleep(self.min_delay - elapsed)
        self.last_request_time = time.time()

        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()

            # Parse HTML
            soup = BeautifulSoup(response.content, "html.parser")

            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()

            # Get text
            text = soup.get_text()

            # Clean up whitespace
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = " ".join(chunk for chunk in chunks if chunk)

            # Truncate if needed
            if len(text) > max_length:
                text = text[:max_length] + "... [truncated]"

            return text if text else f"Could not extract text content from {url}"

        except requests.exceptions.Timeout:
            return f"Request to {url} timed out."
        except requests.exceptions.RequestException as e:
            return f"Error fetching {url}: {e}"
        except Exception as e:
            return f"Error processing webpage {url}: {e}"

