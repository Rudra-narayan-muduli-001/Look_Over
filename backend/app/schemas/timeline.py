from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ChangeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    person_id: int
    link_id: int | None = None
    type: str
    field: str | None = None
    old_value: str | None = None
    new_value: str | None = None
    detected_at: datetime
    seen: int


class SnapshotOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    person_id: int
    link_id: int | None = None
    platform: str
    hash: str
    taken_at: datetime
    trigger: str


class TimelineOut(BaseModel):
    snapshots: list[SnapshotOut]
    changes: list[ChangeOut]
