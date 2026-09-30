import asyncio
import re

import httpx

from app.core.config import GITHUB_TOKEN
from app.scrapers.base import AdapterResult, BaseAdapter, DESKTOP_UA

_HANDLE_RE = re.compile(r"^https?://(www\.)?github\.com/([A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?)", re.I)


def _handle_from_url(url: str) -> str | None:
    m = _HANDLE_RE.match(url.strip())
    return m.group(2) if m else None


class GithubAdapter(BaseAdapter):
    platform = "github"

    async def fetch(self, url: str) -> AdapterResult:
        handle = _handle_from_url(url)
        if not handle:
            return AdapterResult(status="error", error=f"Cannot extract handle from {url!r}")
        headers = {"User-Agent": DESKTOP_UA, "Accept": "application/vnd.github+json"}
        if GITHUB_TOKEN:
            headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
        try:
            async with httpx.AsyncClient(timeout=15.0, headers=headers) as client:
                user = await self._get(client, f"https://api.github.com/users/{handle}")
                if user is None:
                    return AdapterResult(status="error", error=f"GitHub user {handle!r} not found")
                repos = await self._get(
                    client, f"https://api.github.com/users/{handle}/repos?sort=pushed&direction=desc&per_page=10"
                )
        except httpx.HTTPStatusError as e:
            code = e.response.status_code
            if code == 404:
                return AdapterResult(status="error", error=f"GitHub user {handle!r} not found")
            if code == 403 and "rate limit" in e.response.text.lower():
                return AdapterResult(status="rate_limited", error="GitHub rate limit hit; set GITHUB_TOKEN")
            return AdapterResult(status="error", error=f"GitHub HTTP {code}")
        except Exception as e:  # never raise past boundary
            return AdapterResult(status="error", error=f"GitHub fetch failed: {e}")
        profile = {
            "display_name": user.get("name") or user.get("login"),
            "bio": user.get("bio"),
            "avatar": user.get("avatar_url"),
            "followers": user.get("followers"),
            "following": user.get("following"),
            "posts_count": user.get("public_repos"),
        }
        posts = []
        for r in repos or []:
            desc = (r.get("description") or "").strip()
            posts.append(
                {
                    "id": str(r.get("id")),
                    "text": f"{r.get('name')}: {desc}" if desc else r.get("name"),
                    "media": [],
                    "posted_at": r.get("pushed_at"),
                }
            )
        return AdapterResult(profile=profile, posts=posts)

    async def _get(self, client: httpx.AsyncClient, url: str):
        last: Exception | None = None
        for attempt in range(3):  # 1 try + 2 retries w/ backoff
            try:
                resp = await client.get(url)
                if resp.status_code == 404:
                    return None
                resp.raise_for_status()
                return resp.json()
            except httpx.HTTPStatusError:
                raise
            except Exception as e:
                last = e
                await asyncio.sleep(0.5 * (attempt + 1))
        raise last or RuntimeError("GitHub request failed")
