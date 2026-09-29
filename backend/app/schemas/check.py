from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PostOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    person_id: int
    link_id: int
    platform: str
    external_id: str
    text: str | None = None
    posted_at: datetime | None = None
    first_seen_at: datetime


class CheckRunOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    person_id: int
    started_at: datetime
    finished_at: datetime | None = None
    status: str
    per_link_results: str
