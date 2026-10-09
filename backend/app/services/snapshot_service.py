import hashlib
import json
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.change import Change
from app.models.check_run import CheckRun
from app.models.person import Person
from app.models.post import Post
from app.models.profile_link import ProfileLink
from app.models.snapshot import Snapshot
from app.scrapers.manual import normalize_snapshot
from app.services.diff_engine import compare as diff_compare


def _canonical_hash(profile: dict, posts: list[dict]) -> str:
    blob = json.dumps({"profile": profile, "posts": posts}, separators=(",", ":"), default=str)
    return hashlib.md5(blob.encode()).hexdigest()


def _parse_dt(value) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None


async def process_link_snapshot(
    db: AsyncSession,
    person_id: int,
    link: ProfileLink,
    profile: dict,
    posts: list[dict],
    trigger: str = "manual",
) -> dict:
    """Persist snapshot + posts + changes for one link. First snapshot = baseline."""
    profile, posts = normalize_snapshot(profile, posts)
    prev = (
        await db.execute(
            select(Snapshot).where(Snapshot.link_id == link.id).order_by(Snapshot.taken_at.desc()).limit(1)
        )
    ).scalar_one_or_none()
    prev_profile = json.loads(prev.raw_json)["profile"] if prev else None
    prev_ids = set(
        (
            await db.execute(select(Post.external_id).where(Post.link_id == link.id))
        ).scalars().all()
    )
    changes = diff_compare(prev_profile, profile, prev_ids, posts)
    now = datetime.now(timezone.utc)
    snap = Snapshot(
        person_id=person_id,
        link_id=link.id,
        platform=link.platform,
        raw_json=json.dumps({"profile": profile, "posts": posts}, default=str),
        hash=_canonical_hash(profile, posts),
        taken_at=now,
        trigger=trigger,
    )
    db.add(snap)
    new_post_ids = {c["new_value"] for c in changes if c["type"] == "new_post"}
    if prev is None:
        to_insert = posts
    else:
        to_insert = [p for p in posts if p["id"] in new_post_ids]
    for p in to_insert:
        db.add(
            Post(
                person_id=person_id,
                link_id=link.id,
                platform=link.platform,
                external_id=str(p["id"]),
                text=p.get("text"),
                media_urls=json.dumps(p.get("media") or []),
                posted_at=_parse_dt(p.get("posted_at")),
                first_seen_at=now,
            )
        )
    for c in changes:
        db.add(
            Change(
                person_id=person_id,
                link_id=link.id,
                type=c["type"],
                field=c.get("field"),
                old_value=c.get("old_value"),
                new_value=c.get("new_value"),
                detected_at=now,
                seen=0,
            )
        )
    link.last_status = "ok"
    link.last_checked_at = now
    await db.flush()
    return {"link_id": link.id, "platform": link.platform, "status": "ok", "changes": len(changes)}


async def run_person_check(person_id: int, trigger: str, db: AsyncSession) -> CheckRun:
    """Per-link isolation: one blocked platform never fails the whole person check."""
    from app.scrapers import ADAPTERS  # local import: avoids cycle at module load

    person = await db.get(Person, person_id)
    if person is None:
        raise LookupError(f"person {person_id} not found")
    links = (await db.execute(select(ProfileLink).where(ProfileLink.person_id == person_id))).scalars().all()
    started = datetime.now(timezone.utc)
    results: list[dict] = []
    ok_any, fail_any = False, False
    for link in links:
        adapter = ADAPTERS.get(link.platform)
        if adapter is None:
            link.last_status = "error"
            results.append({"link_id": link.id, "platform": link.platform, "status": "error",
                            "error": f"No adapter for {link.platform!r}"})
            fail_any = True
            continue
        try:
            res = await adapter.fetch(link.url)
        except Exception as e:  # adapter boundary: never raise
            res = None
            err = f"Adapter raised: {e}"
        else:
            err = res.error
        if res is None or res.status != "ok":
            link.last_status = (res.status if res else "error")
            link.last_checked_at = datetime.now(timezone.utc)
            results.append({"link_id": link.id, "platform": link.platform,
                            "status": link.last_status, "error": err})
            fail_any = True
            continue
        try:
            out = await process_link_snapshot(db, person_id, link, res.profile or {}, res.posts or [], trigger)
            results.append(out)
            ok_any = True
        except Exception as e:
            results.append({"link_id": link.id, "platform": link.platform, "status": "error",
                            "error": f"Snapshot failed: {e}"})
            fail_any = True
    # Aggregate person-level snapshot (one row, link_id NULL) for timeline continuity.
    person_snap = Snapshot(
        person_id=person_id, link_id=None, platform="aggregate",
        raw_json=json.dumps({"results": results}, default=str),
        hash=_canonical_hash({"results": results}, []),
        taken_at=datetime.now(timezone.utc), trigger=trigger,
    )
    db.add(person_snap)
    status = "partial" if (ok_any and fail_any) or (fail_any and not ok_any and links) else "ok"
    run = CheckRun(person_id=person_id, started_at=started, finished_at=datetime.now(timezone.utc),
                   status=status, per_link_results=json.dumps(results, default=str))
    db.add(run)
    await db.commit()
    await db.refresh(run)
    return run
