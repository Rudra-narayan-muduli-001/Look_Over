from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.person import Person
from app.schemas.check import CheckRunOut
from app.services.snapshot_service import run_person_check

router = APIRouter(tags=["checks"])


@router.post("/persons/{person_id}/check", response_model=CheckRunOut)
async def check_person(person_id: int, trigger: str = "manual", db: AsyncSession = Depends(get_db)):
    if await db.get(Person, person_id) is None:
        raise HTTPException(404, "person not found")
    try:
        run = await run_person_check(person_id, trigger=trigger, db=db)
    except LookupError:
        raise HTTPException(404, "person not found")
    return run
