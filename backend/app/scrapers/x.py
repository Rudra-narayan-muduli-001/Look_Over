from app.scrapers.base import AdapterResult, BaseAdapter

_MSG = (
    "X scraping needs Playwright + login cookies (export to backend/cookies/x.json, "
    "see docs/cookies.md). Use manual-snapshot fallback for now."
)


class XAdapter(BaseAdapter):
    platform = "x"
    needs_playwright = True

    async def fetch(self, url: str) -> AdapterResult:
        return AdapterResult(status="needs_login", error=_MSG)
