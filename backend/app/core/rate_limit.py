from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse

from app.core.config import API_KEY


def get_rate_limit_key(request: Request) -> str:
    if API_KEY:
        api_key = request.headers.get("x-api-key")
        if api_key:
            return f"apikey:{api_key}"
    return get_remote_address(request)


limiter = Limiter(key_func=get_rate_limit_key, default_limits=["100/minute"])


def init_rate_limiter(app: FastAPI) -> None:
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)