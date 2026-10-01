from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.scheduler import add_or_update_person_job, remove_person_job
from app.db.session import get_db
from app.models.person import Person
from app.schemas.person import PersonCreate, PersonOut, PersonUpdate

router = APIRouter(tags=["persons"])


@router.get("/persons", response_model=list[PersonOut])
async def list_persons(db: AsyncSession = Depends(get_db)):
    return list((await db.execute(select(Person).order_by(Person.created_at.desc()))).scalars().all())


@router.post("/persons", response_model=PersonOut, status_code=201)
async def create_person(body: PersonCreate, db: AsyncSession = Depends(get_db)):
    person = Person(name=body.name.strip(), notes=body.notes)
    db.add(person)
    await db.commit()
    await db.refresh(person)
    try:
        add_or_update_person_job(person.id, person.check_interval_hours or 6)
    except Exception:
        pass
    return person


@router.get("/persons/{person_id}", response_model=PersonOut)
async def get_person(person_id: int, db: AsyncSession = Depends(get_db)):
    person = await db.get(Person, person_id)
    if person is None:
        raise HTTPException(404, "person not found")
    return person


@router.put("/persons/{person_id}", response_model=PersonOut)
async def update_person(person_id: int, body: PersonUpdate, db: AsyncSession = Depends(get_db)):
    person = await db.get(Person, person_id)
    if person is None:
        raise HTTPException(404, "person not found")
    data = body.model_dump(exclude_unset=True)
    if "name" in data and data["name"] is not None:
        data["name"] = data["name"].strip()
    for k, v in data.items():
        setattr(person, k, v)
    await db.commit()
    await db.refresh(person)
    try:
        add_or_update_person_job(person.id, person.check_interval_hours or 6)
    except Exception:
        pass
    return person


@router.delete("/persons/{person_id}", status_code=204)
async def delete_person(person_id: int, db: AsyncSession = Depends(get_db)):
    person = await db.get(Person, person_id)
    if person is None:
        raise HTTPException(404, "person not found")
    await db.delete(person)
    await db.commit()
    try:
        remove_person_job(person_id)
    except Exception:
        pass
    return None
