from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import optional_api_key
from app.core.sanitize import sanitize_manual_snapshot
from app.core.url_validator import extract_handle, validate_link
from app.db.session import get_db
from app.models.person import Person
from app.models.profile_link import ProfileLink
from app.schemas.link import LinkCreate, LinkOut
from app.schemas.manual import ManualSnapshotIn
from app.services.snapshot_service import process_link_snapshot

router = APIRouter(tags=["links"])


@router.post("/persons/{person_id}/links", response_model=LinkOut, status_code=201, dependencies=[optional_api_key])
async def add_link(person_id: int, body: LinkCreate, db: AsyncSession = Depends(get_db)):
    person = await db.get(Person, person_id)
    if person is None:
        raise HTTPException(404, "person not found")
    platform = validate_link(body.platform, body.url)
    link = ProfileLink(person_id=person_id, platform=platform, url=body.url.strip(),
                       handle=extract_handle(platform, body.url))
    db.add(link)
    await db.commit()
    await db.refresh(link)
    return link


@router.delete("/links/{link_id}", status_code=204, dependencies=[optional_api_key])
async def delete_link(link_id: int, db: AsyncSession = Depends(get_db)):
    link = await db.get(ProfileLink, link_id)
    if link is None:
        raise HTTPException(404, "link not found")
    await db.delete(link)
    await db.commit()
    return None


@router.post("/links/{link_id}/manual-snapshot", dependencies=[optional_api_key])
async def manual_snapshot(link_id: int, body: ManualSnapshotIn, db: AsyncSession = Depends(get_db)):
    link = await db.get(ProfileLink, link_id)
    if link is None:
        raise HTTPException(404, "link not found")
    for p in body.posts:
        if not isinstance(p, dict) or "id" not in p:
            raise HTTPException(422, "each post needs an 'id'")
    clean_profile, clean_posts = sanitize_manual_snapshot(body.profile, body.posts)
    out = await process_link_snapshot(db, link.person_id, link, clean_profile, clean_posts, trigger="manual")
    await db.commit()
    await db.refresh(link)
    return out
