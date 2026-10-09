import pytest


async def test_full_flow_manual_snapshot(client):
    r = await client.post("/persons", json={"name": "Ada", "notes": "test"})
    assert r.status_code == 201, r.text
    pid = r.json()["id"]

    r = await client.post(f"/persons/{pid}/links",
                          json={"platform": "github", "url": "https://github.com/octocat"})
    assert r.status_code == 201, r.text
    link = r.json()
    assert link["handle"] == "octocat"
    lid = link["id"]

    r = await client.post(f"/persons/{pid}/links",
                          json={"platform": "github", "url": "https://example.com/nope"})
    assert r.status_code == 422

    # baseline: no changes
    r = await client.post(f"/links/{lid}/manual-snapshot", json={
        "profile": {"display_name": "Octo", "bio": "hi"},
        "posts": [{"id": "p1", "text": "hello"}],
    })
    assert r.status_code == 200, r.text
    assert r.json()["changes"] == 0

    r = await client.get(f"/persons/{pid}/timeline")
    assert r.status_code == 200
    assert len(r.json()["snapshots"]) >= 1

    # second snapshot: bio change + new post
    r = await client.post(f"/links/{lid}/manual-snapshot", json={
        "profile": {"display_name": "Octo", "bio": "changed"},
        "posts": [{"id": "p1", "text": "hello"}, {"id": "p2", "text": "new"}],
    })
    assert r.status_code == 200
    assert r.json()["changes"] == 2

    r = await client.get("/alerts?unseen=true")
    assert r.status_code == 200
    alerts = r.json()
    types = {a["type"] for a in alerts}
    assert {"field_change", "new_post"} <= types

    cid = alerts[0]["id"]
    r = await client.patch(f"/changes/{cid}/seen")
    assert r.status_code == 200
    assert r.json()["seen"] == 1

    r = await client.get(f"/persons/{pid}/posts")
    assert r.status_code == 200
    assert {p["external_id"] for p in r.json()} == {"p1", "p2"}
