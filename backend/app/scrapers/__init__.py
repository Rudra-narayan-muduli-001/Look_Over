from app.scrapers.base import AdapterResult, BaseAdapter
from app.scrapers.facebook import FacebookAdapter
from app.scrapers.github import GithubAdapter
from app.scrapers.instagram import InstagramAdapter
from app.scrapers.linkedin import LinkedinAdapter
from app.scrapers.x import XAdapter


class _OtherStub(BaseAdapter):
    platform = "other"

    async def fetch(self, url: str) -> AdapterResult:
        return AdapterResult(
            status="needs_login",
            error="No auto-scraper for generic URLs. Use manual-snapshot fallback.",
        )


ADAPTERS: dict[str, BaseAdapter] = {
    "github": GithubAdapter(),
    "x": XAdapter(),
    "instagram": InstagramAdapter(),
    "facebook": FacebookAdapter(),
    "linkedin": LinkedinAdapter(),
    "other": _OtherStub(),
}
ADAPTERS["manual"] = ADAPTERS["other"]

__all__ = ["ADAPTERS"]
