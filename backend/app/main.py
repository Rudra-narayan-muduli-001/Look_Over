from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import alerts, checks, links, persons, timeline
from app.core.config import CORS_ORIGINS, DATA_DIR
from app.core.error_handlers import register_error_handlers
from app.core.rate_limit import init_rate_limiter
from app.db.session import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    await init_db()
    from app.core import scheduler as sched

    try:
        await sched.schedule_all()
    except Exception as e:
        logging.warning("scheduler init failed: %s", e)
    try:
        sched.start()
    except Exception as e:
        logging.warning("scheduler start failed: %s", e)
    yield
    try:
        sched.shutdown()
    except Exception as e:
        logging.warning("scheduler shutdown failed: %s", e)


app = FastAPI(title="Eyes on You", lifespan=lifespan)

init_rate_limiter(app)
register_error_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
