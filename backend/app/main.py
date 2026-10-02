from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import alerts, checks, links, persons, timeline
from app.core.config import CORS_ORIGINS
from app.db.session import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    from app.core import scheduler as sched

    try:
        await sched.schedule_all()
    except Exception:
        pass
    try:
        sched.start()
    except Exception:
        pass
    yield
    try:
        sched.shutdown()
    except Exception:
        pass


app = FastAPI(title="Eyes on You", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True}


app.include_router(persons.router)
app.include_router(links.router)
app.include_router(checks.router)
app.include_router(timeline.router)
app.include_router(alerts.router)
