from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.change import Change
from app.models.person import Person
from app.models.post import Post
from app.models.snapshot import Snapshot
from app.schemas.check import PostOut
from app.schemas.timeline import TimelineOut

router = APIRouter(tags=["timeline"])


@router.get("/persons/{person_id}/timeline", response_model=TimelineOut)
async def get_timeline(person_id: int, since: str | None = None, db: AsyncSession = Depends(get_db)):
    if await db.get(Person, person_id) is None:
        raise HTTPException(404, "person not found")
    since_dt: datetime | None = None
    if since:
        try:
            since_dt = datetime.fromisoformat(since.replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(422, "since must be ISO datetime")
    sq = select(Snapshot).where(Snapshot.person_id == person_id).order_by(Snapshot.taken_at.asc())
    cq = select(Change).where(Change.person_id == person_id).order_by(Change.detected_at.asc())
    if since_dt is not None:
        sq = sq.where(Snapshot.taken_at >= since_dt)
        cq = cq.where(Change.detected_at >= since_dt)
    snapshots = list((await db.execute(sq)).scalars().all())
    changes = list((await db.execute(cq)).scalars().all())
    return {"snapshots": snapshots, "changes": changes}


@router.get("/persons/{person_id}/posts", response_model=list[PostOut])
async def get_posts(person_id: int, db: AsyncSession = Depends(get_db)):
    if await db.get(Person, person_id) is None:
        raise HTTPException(404, "person not found")
    q = select(Post).where(Post.person_id == person_id).order_by(Post.first_seen_at.desc()).limit(200)
    return list((await db.execute(q)).scalars().all())
