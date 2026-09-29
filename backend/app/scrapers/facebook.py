from app.scrapers.base import AdapterResult, BaseAdapter

_MSG = (
    "Facebook scraping needs Playwright + login cookies (export to backend/cookies/facebook.json, "
    "see docs/cookies.md). Use manual-snapshot fallback for now."
)


class FacebookAdapter(BaseAdapter):
    platform = "facebook"
    needs_playwright = True

    async def fetch(self, url: str) -> AdapterResult:
        return AdapterResult(status="blocked", error=_MSG)
