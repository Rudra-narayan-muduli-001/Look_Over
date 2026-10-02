import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import app

engine = create_async_engine(
    "sqlite+aiosqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSession = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def _override_get_db():
    async with TestSession() as session:
        yield session


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture(autouse=True)
async def _tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield


async def test_full_flow_manual_snapshot():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        r = await c.post("/persons", json={"name": "Ada", "notes": "test"})
        assert r.status_code == 201, r.text
        pid = r.json()["id"]

        r = await c.post(f"/persons/{pid}/links",
                         json={"platform": "github", "url": "https://github.com/octocat"})
        assert r.status_code == 201, r.text
        link = r.json()
        assert link["handle"] == "octocat"
        lid = link["id"]

        r = await c.post(f"/persons/{pid}/links",
                         json={"platform": "github", "url": "https://example.com/nope"})
        assert r.status_code == 422

        # baseline: no changes
        r = await c.post(f"/links/{lid}/manual-snapshot", json={
            "profile": {"display_name": "Octo", "bio": "hi"},
            "posts": [{"id": "p1", "text": "hello"}],
        })
        assert r.status_code == 200, r.text
        assert r.json()["changes"] == 0

        r = await c.get(f"/persons/{pid}/timeline")
        assert r.status_code == 200
        assert len(r.json()["snapshots"]) >= 1

        # second snapshot: bio change + new post
        r = await c.post(f"/links/{lid}/manual-snapshot", json={
            "profile": {"display_name": "Octo", "bio": "changed"},
            "posts": [{"id": "p1", "text": "hello"}, {"id": "p2", "text": "new"}],
        })
        assert r.status_code == 200
        assert r.json()["changes"] == 2

        r = await c.get("/alerts?unseen=true")
        assert r.status_code == 200
        alerts = r.json()
        types = {a["type"] for a in alerts}
        assert {"field_change", "new_post"} <= types

        cid = alerts[0]["id"]
        r = await c.patch(f"/changes/{cid}/seen")
        assert r.status_code == 200
        assert r.json()["seen"] == 1

        r = await c.get(f"/persons/{pid}/posts")
        assert r.status_code == 200
        assert {p["external_id"] for p in r.json()} == {"p1", "p2"}
