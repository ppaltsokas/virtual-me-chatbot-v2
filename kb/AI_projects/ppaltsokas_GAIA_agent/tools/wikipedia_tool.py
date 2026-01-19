from __future__ import annotations

import os
import time
from typing import Any

try:
    import wikipedia
except ImportError:
    wikipedia = None


class WikipediaTool:
    """Wikipedia search and page content retrieval tool."""

    def __init__(self):
        if wikipedia is None:
            raise ImportError(
                "wikipedia library not installed. Install with: pip install wikipedia"
            )
        # Set language to English by default
        wikipedia.set_lang("en")
        # Disable rate limiting warnings
        wikipedia.set_rate_limiting(True)

    def search(self, query: str, max_results: int = 5) -> list[str]:
        """
        Search Wikipedia for articles matching the query.
        Returns a list of article titles.
        """
        try:
            results = wikipedia.search(query, results=max_results)
            return results if results else []
        except Exception as e:
            return [f"Wikipedia search failed: {e}"]

    def get_page(self, title: str, sentences: int = 10) -> str:
        """
        Get the content of a Wikipedia page by title.
        Returns a summary (first N sentences) of the page.
        """
        try:
            page = wikipedia.page(title, auto_suggest=False)
            summary = page.summary
            # Limit to first N sentences if requested
            if sentences > 0:
                sentences_list = summary.split(". ")
                summary = ". ".join(sentences_list[:sentences])
                if not summary.endswith("."):
                    summary += "."
            return f"Title: {page.title}\nURL: {page.url}\n\n{summary}"
        except wikipedia.exceptions.DisambiguationError as e:
            # Return disambiguation options
            options = e.options[:5]  # Limit to 5 options
            return f"Disambiguation page. Options: {', '.join(options)}"
        except wikipedia.exceptions.PageError:
            return f"Wikipedia page '{title}' not found."
        except Exception as e:
            return f"Error retrieving Wikipedia page: {e}"

    def search_and_get(self, query: str, max_results: int = 3, sentences: int = 10) -> str:
        """
        Search Wikipedia and retrieve content from the top result.
        """
        try:
            results = self.search(query, max_results=1)
            if not results or results[0].startswith("Wikipedia"):
                return f"No Wikipedia results found for: {query}"
            return self.get_page(results[0], sentences=sentences)
        except Exception as e:
            return f"Wikipedia search and retrieval failed: {e}"

