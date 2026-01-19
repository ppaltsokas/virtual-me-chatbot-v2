from __future__ import annotations

import os
import random
import threading
import time
from typing import Iterable

import requests

try:
    from duckduckgo_search import DDGS
except ImportError:
    DDGS = None

try:
    from sentence_transformers import SentenceTransformer, util
except Exception:  # pragma: no cover - optional dependency
    SentenceTransformer = None
    util = None


def _safe_log(*parts) -> None:
    """Safe logging that handles Unicode."""
    try:
        message = " ".join(str(p) for p in parts)
        print(message.encode("utf-8", errors="ignore").decode("utf-8"))
    except Exception:
        pass


class WebSearchTool:
    """Brave Search API client with caching, rate limiting, and optional re-ranking."""

    SEARCH_ENDPOINT = "https://api.search.brave.com/res/v1/web/search"

    def __init__(self):
        self.api_key = os.getenv("BRAVE_API_KEY")
        self.use_brave = bool(self.api_key)
        if not self.api_key and DDGS is None:
            raise EnvironmentError(
                "Either BRAVE_API_KEY must be set or duckduckgo_search must be installed. "
                "Install with: pip install duckduckgo-search"
            )

        self.ranker = None
        if SentenceTransformer is not None:
            try:
                self.ranker = SentenceTransformer("all-mpnet-base-v2")
            except Exception:
                self.ranker = None

        self.cache: dict[str, list[str]] = {}
        self.last_request_time = 0.0
        min_delay_env = os.getenv("WEB_SEARCH_MIN_DELAY")
        try:
            configured_delay = float(min_delay_env) if min_delay_env else None
        except ValueError:
            configured_delay = None
        self.min_delay = max(1.0, configured_delay) if configured_delay else 1.0
        self.lock = threading.Lock()
        self.quota_exceeded = False

    def search(self, query: str, max_results: int = 5, retries: int = 3) -> list[str]:
        cache_key = f"{query}::{max_results}"
        if cache_key in self.cache:
            return self.cache[cache_key]

        for attempt in range(retries):
            try:
                self._respect_rate_limit()
                hits = self._perform_search(query, max_results)
                docs = self._format_results(hits)
                if not docs:
                    return []

                reranked = self._rerank(docs, query) if self.ranker else docs
                self.cache[cache_key] = reranked
                return reranked

            except Exception as exc:
                if self._is_retryable_error(exc) and attempt < retries - 1:
                    wait_time = self.min_delay * (2 ** attempt) + random.uniform(0, 1)
                    time.sleep(wait_time)
                    continue
                raise

        return []

    def _perform_search(self, query: str, max_results: int) -> Iterable[dict]:
        # Try Brave first if available and quota not exceeded
        if self.use_brave and not self.quota_exceeded:
            try:
                headers = {
                    "Accept": "application/json",
                    "X-Subscription-Token": self.api_key,
                }
                params = {
                    "q": query,
                    "count": max(1, min(max_results, 20)),
                }

                response = requests.get(
                    self.SEARCH_ENDPOINT,
                    headers=headers,
                    params=params,
                    timeout=float(os.getenv("WEB_SEARCH_TIMEOUT", "10")),
                )
                response.raise_for_status()

                data = response.json()
                results = data.get("web", {}).get("results", [])
                if results:
                    return results
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 429:
                    self.quota_exceeded = True
                    _safe_log("Brave API quota exceeded, falling back to DuckDuckGo")
                else:
                    raise
            except Exception:
                # Fall through to DuckDuckGo
                pass
        
        # Fallback to DuckDuckGo
        if DDGS is None:
            raise RuntimeError("No search provider available (Brave quota exceeded and DuckDuckGo not installed)")
        
        try:
            with DDGS() as ddgs:
                hits = list(ddgs.text(query, max_results=max_results))
                # Convert to same format as Brave
                return [
                    {
                        "title": hit.get("title", "Untitled"),
                        "url": hit.get("href", ""),
                        "description": hit.get("body", ""),
                    }
                    for hit in hits
                ]
        except Exception as e:
            raise RuntimeError(f"DuckDuckGo search failed: {e}") from e

    def _respect_rate_limit(self) -> None:
        with self.lock:
            elapsed = time.time() - self.last_request_time
            delay = max(0.0, self.min_delay - elapsed)
            if delay > 0:
                time.sleep(delay)
            self.last_request_time = time.time()

    @staticmethod
    def _is_retryable_error(exc: Exception) -> bool:
        message = str(exc).lower()
        if any(keyword in message for keyword in ("429", "too many requests", "ratelimit", "rate limit")):
            return True
        if isinstance(exc, requests.exceptions.Timeout):
            return True
        return False

    @staticmethod
    def _format_results(hits: Iterable[dict]) -> list[str]:
        docs: list[str] = []
        for hit in hits or []:
            title = hit.get("title") or "Untitled"
            href = hit.get("url") or hit.get("link") or "No URL"
            description = hit.get("description") or hit.get("snippet") or ""
            docs.append(f"{title} — {href}\n{description}")
        return docs

    def _rerank(self, docs: list[str], question: str) -> list[str]:
        if not docs or not self.ranker or util is None:
            return docs
        emb = self.ranker.encode([question] + docs, convert_to_tensor=True)
        sims = util.cos_sim(emb[0], emb[1:])[0]
        scored = sorted(zip(docs, sims), key=lambda x: float(x[1]), reverse=True)
        return [d for d, _ in scored]
