from pydantic import BaseModel, Field


class ManualSnapshotIn(BaseModel):
    profile: dict = Field(default_factory=dict)
    posts: list[dict] = Field(default_factory=list)
