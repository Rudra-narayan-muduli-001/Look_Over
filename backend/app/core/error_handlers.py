import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("eyesonyou.errors")


def is_production() -> bool:
    import os
    return os.getenv("ENVIRONMENT", "development").lower() == "production"


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        if is_production() and exc.status_code >= 500:
            logger.error(f"Internal server error: {exc.detail}", extra={"path": request.url.path})
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal server error"},
            )
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.exception(f"Unhandled exception: {exc}", extra={"path": request.url.path})
        if is_production():
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal server error"},
            )
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc)},
        )