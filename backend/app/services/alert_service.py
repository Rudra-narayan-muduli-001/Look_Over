from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.change import Change


async def get_alerts(db: AsyncSession, unseen_only: bool, person_id: int | None) -> list[Change]:
    q = select(Change).order_by(Change.detected_at.desc())
    if unseen_only:
        q = q.where(Change.seen == 0)
    if person_id is not None:
        q = q.where(Change.person_id == person_id)
    return list((await db.execute(q)).scalars().all())


async def mark_seen(db: AsyncSession, change_id: int) -> Change | None:
    change = await db.get(Change, change_id)
    if change is None:
        return None
    change.seen = 1
    await db.commit()
    await db.refresh(change)
    return change


async def mark_all_seen(db: AsyncSession, person_id: int | None) -> int:
    q = update(Change).where(Change.seen == 0)
    if person_id is not None:
        q = q.where(Change.person_id == person_id)
    res = await db.execute(q.values(seen=1))
    await db.commit()
    return res.rowcount or 0
