from app.scrapers.base import AdapterResult, BaseAdapter

_MSG = (
    "LinkedIn scraping needs Playwright + login cookies (export to backend/cookies/linkedin.json, "
    "see docs/cookies.md). Use manual-snapshot fallback for now."
)


class LinkedinAdapter(BaseAdapter):
    platform = "linkedin"
    needs_playwright = True

    async def fetch(self, url: str) -> AdapterResult:
        return AdapterResult(status="blocked", error=_MSG)
