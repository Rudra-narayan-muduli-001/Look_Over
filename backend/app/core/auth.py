from fastapi import Depends, Header, HTTPException, status

from app.core.config import API_KEY


async def verify_api_key(x_api_key: str | None = Header(None)) -> None:
    if not API_KEY:
        return
    if x_api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
        )


optional_api_key = Depends(verify_api_key)