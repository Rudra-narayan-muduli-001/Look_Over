from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import optional_api_key
from app.db.session import get_db
from app.schemas.timeline import ChangeOut
from app.services import alert_service

router = APIRouter(tags=["alerts"])


@router.get("/alerts", response_model=list[ChangeOut])
async def list_alerts(unseen: bool = True, person_id: int | None = None, db: AsyncSession = Depends(get_db)):
    return await alert_service.get_alerts(db, unseen_only=unseen, person_id=person_id)


@router.patch("/changes/{change_id}/seen", response_model=ChangeOut, dependencies=[optional_api_key])
async def mark_change_seen(change_id: int, db: AsyncSession = Depends(get_db)):
    change = await alert_service.mark_seen(db, change_id)
    if change is None:
        raise HTTPException(404, "change not found")
    return change


@router.patch("/alerts/seen-all", dependencies=[optional_api_key])
async def mark_all_seen(person_id: int | None = None, db: AsyncSession = Depends(get_db)):
    count = await alert_service.mark_all_seen(db, person_id)
    return {"marked": count}
