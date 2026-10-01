import re
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.person import Person
from app.models.profile_link import PLATFORMS, ProfileLink
from app.schemas.link import LinkCreate, LinkOut
from app.schemas.manual import ManualSnapshotIn
from app.services.snapshot_service import process_link_snapshot

router = APIRouter(tags=["links"])

_PATTERNS: dict[str, tuple[re.Pattern, int | None]] = {
    "github": (re.compile(r"^https?://(www\.)?github\.com/([A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?)/?\s*$", re.I), 2),
    "x": (re.compile(r"^https?://(www\.)?(x\.com|twitter\.com)/([A-Za-z0-9_]{1,15})/?\s*$", re.I), 3),
    "instagram": (re.compile(r"^https?://(www\.)?instagram\.com/([A-Za-z0-9._]{1,30})/?\s*$", re.I), 2),
    "facebook": (re.compile(r"^https?://(www\.)?facebook\.com/([A-Za-z0-9._-]+)/?\s*$", re.I), 2),
    "linkedin": (re.compile(r"^https?://(www\.)?linkedin\.com/in/([A-Za-z0-9_%-]+)/?\s*$", re.I), 2),
    "other": (re.compile(r"^https?://.+\..+", re.I), None),
}


def extract_handle(platform: str, url: str) -> str | None:
    pat, group = _PATTERNS[platform]
    m = pat.match(url.strip())
    if not m:
        return None
    return m.group(group) if group else None


def validate_link(platform: str, url: str) -> str | None:
    platform = platform.strip().lower()
    if platform not in PLATFORMS:
        raise HTTPException(422, f"platform must be one of {list(PLATFORMS)}")
    if platform not in _PATTERNS or not _PATTERNS[platform][0].match(url.strip()):
        raise HTTPException(422, f"URL does not look like a {platform} profile URL")
    return platform


@router.post("/persons/{person_id}/links", response_model=LinkOut, status_code=201)
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


@router.delete("/links/{link_id}", status_code=204)
async def delete_link(link_id: int, db: AsyncSession = Depends(get_db)):
    link = await db.get(ProfileLink, link_id)
    if link is None:
        raise HTTPException(404, "link not found")
    await db.delete(link)
    await db.commit()
    return None


@router.post("/links/{link_id}/manual-snapshot")
async def manual_snapshot(link_id: int, body: ManualSnapshotIn, db: AsyncSession = Depends(get_db)):
    link = await db.get(ProfileLink, link_id)
    if link is None:
        raise HTTPException(404, "link not found")
    for p in body.posts:
        if not isinstance(p, dict) or "id" not in p:
            raise HTTPException(422, "each post needs an 'id'")
    out = await process_link_snapshot(db, link.person_id, link, body.profile, body.posts, trigger="manual")
    await db.commit()
    await db.refresh(link)
    return out
