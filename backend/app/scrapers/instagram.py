from app.scrapers.base import AdapterResult, BaseAdapter

_MSG = (
    "Instagram scraping needs Playwright + login cookies (export to backend/cookies/instagram.json, "
    "see docs/cookies.md). Use manual-snapshot fallback for now."
)


class InstagramAdapter(BaseAdapter):
    platform = "instagram"
    needs_playwright = True

    async def fetch(self, url: str) -> AdapterResult:
        return AdapterResult(status="needs_login", error=_MSG)
