import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy import select

scheduler = AsyncIOScheduler()


async def _run_person_job(person_id: int):
    from app.db.session import AsyncSessionLocal
    from app.services.snapshot_service import run_person_check

    try:
        async with AsyncSessionLocal() as db:
            await run_person_check(person_id, trigger="scheduled", db=db)
    except Exception:
        logging.exception("scheduled check failed for person %s", person_id)


def add_or_update_person_job(person_id: int, interval_hours: int) -> None:
    job_id = f"person-{person_id}"
    trigger = IntervalTrigger(hours=max(interval_hours, 1), jitter=600)  # ±10 min
    if scheduler.get_job(job_id):
        scheduler.reschedule_job(job_id, trigger=trigger)
    else:
        scheduler.add_job(_run_person_job, trigger=trigger, args=[person_id],
                          id=job_id, max_instances=1, coalesce=True)


def remove_person_job(person_id: int) -> None:
    try:
        scheduler.remove_job(f"person-{person_id}")
    except Exception as e:
        logging.warning("remove job failed for person %s: %s", person_id, e)


async def schedule_all() -> None:
    from app.db.session import AsyncSessionLocal
    from app.models.person import Person

    async with AsyncSessionLocal() as db:
        persons = (await db.execute(select(Person))).scalars().all()
    for p in persons:
        try:
            add_or_update_person_job(p.id, p.check_interval_hours or 6)
        except Exception as e:
            logging.warning("schedule failed for person %s: %s", p.id, e)


def start() -> None:
    if scheduler.running:
        return
    # randomize first run so all persons don't fire at boot
    for job in scheduler.get_jobs():
        job.trigger.jitter = 600
    scheduler.start()


def shutdown() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)
