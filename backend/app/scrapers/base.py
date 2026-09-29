from dataclasses import dataclass, field


@dataclass
class AdapterResult:
    """Never raises past boundary. status: ok | blocked | needs_login | rate_limited | error."""

    profile: dict | None = None
    posts: list[dict] = field(default_factory=list)
    status: str = "ok"
    error: str | None = None


class BaseAdapter:
    platform: str = "other"
    needs_playwright: bool = False

    async def fetch(self, url: str) -> AdapterResult:
        raise NotImplementedError


DESKTOP_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36 EyesOnYou/1.0"
)
