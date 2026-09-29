from datetime import datetime

from pydantic import BaseModel, ConfigDict


class LinkCreate(BaseModel):
    platform: str
    url: str


class LinkOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    person_id: int
    platform: str
    url: str
    handle: str | None = None
    last_status: str
    last_checked_at: datetime | None = None
