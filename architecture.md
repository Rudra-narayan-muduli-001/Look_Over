# Eyes on You — Architecture

Single-user local tracker. Add a person + their social links, take a baseline snapshot on first check, then show diffs / new activity on later checks (manual + scheduled).

## 1. Stack

- Backend: Python 3.11+ (verified 3.12), FastAPI, SQLAlchemy 2.0, SQLite (aiosqlite), APScheduler, httpx, BeautifulSoup4, Playwright (JS-heavy sites only), Pydantic v2, pytest
- Frontend: Vite + React 18 + TS, Tailwind, React Router, TanStack Query, Axios, date-fns
- No auth (localhost). No Docker/Redis/Postgres in v1 (ponytail: add when single-user SQLite measurably falls short).

## 2. Repo layout

```
eyes-on-you/
  architecture.md
  design.md
  backend/
    requirements.txt
    app/main.py            # FastAPI app, CORS for :5173, router mounts, scheduler lifespan
    app/core/config.py     # settings, DATA_DIR, check defaults
    app/core/scheduler.py  # APScheduler: per-person interval jobs + jitter
    app/db/session.py      # async engine + session factory (WAL mode)
    app/db/base.py         # Base import registry
    app/models/            # person, profile_link, snapshot, post, change, check_run
    app/schemas/           # Pydantic v2 DTOs
    app/api/               # persons, links, checks, timeline, alerts
    app/services/          # snapshot_service, diff_engine, alert_service
    app/scrapers/          # base, github, x, instagram, facebook, linkedin, manual
    tests/                 # test_diff_engine, test_api
  frontend/
    src/lib/api.ts         # Axios client, baseURL http://localhost:8000
    src/hooks/             # usePersons, usePerson, useTimeline, useAlerts
    src/pages/             # Dashboard, PersonDetail, AddPerson, Alerts
    src/components/        # PersonCard, StatusDot, LinkRow, TimelineItem, PostCard, DiffBadge, CheckNowButton
```

## 3. Data model (SQLite)

- `persons(id INTEGER PK, name TEXT, notes TEXT, avatar_url TEXT, check_interval_hours INT DEFAULT 6, created_at DATETIME)`
- `profile_links(id, person_id FK CASCADE, platform TEXT CHECK IN ('github','x','instagram','facebook','linkedin','other'), url TEXT, handle TEXT, last_status TEXT DEFAULT 'never', last_checked_at DATETIME)`
- `snapshots(id, person_id FK, link_id FK NULL, platform TEXT, raw_json TEXT, hash TEXT, taken_at DATETIME, trigger TEXT)`
- `posts(id, person_id FK, link_id FK, platform TEXT, external_id TEXT, text TEXT, media_urls TEXT(JSON), posted_at DATETIME NULL, first_seen_at DATETIME, UNIQUE(link_id, external_id))`
- `changes(id, person_id FK, link_id FK NULL, type TEXT, field TEXT NULL, old_value TEXT NULL, new_value TEXT NULL, detected_at DATETIME, seen INT DEFAULT 0)`
- `check_runs(id, person_id FK, started_at, finished_at, status TEXT, per_link_results TEXT(JSON))`

Indexes: `posts(link_id, first_seen_at)`, `changes(person_id, seen, detected_at)`, `snapshots(person_id, link_id, taken_at)`.

## 4. Core flow

1. `POST /persons {name, notes}` → `POST /persons/{id}/links {platform, url}` (regex-validate + normalize handle per platform).
2. `POST /persons/{id}/check?trigger=manual` or scheduler tick → `SnapshotService.run_person_check(person_id, trigger)`.
3. Per link: `ADAPTERS[platform].fetch(url)` → `AdapterResult(profile:{display_name,bio,avatar,followers,following,posts_count}, posts:[{id,text,media,posted_at}])` or `{status: blocked|needs_login|rate_limited|error, error}`. Adapter never raises past boundary.
4. Persist one snapshot per link + aggregate person snapshot (hash = sha256 of canonical JSON). First-ever snapshot per link = baseline, emits no changes.
5. `DiffEngine.compare(prev_profile, new_profile, prev_post_ids, new_posts)` → list of changes: `field_change` (bio, display_name, avatar, counts), `new_post` (one row + one `posts` row each), `deleted` only if previously-seen post id absent AND adapter reports full-list confidence (conservative: skip otherwise).
6. `GET /persons/{id}/timeline?since=` → snapshots + changes merged chronologically. `GET /alerts?unseen=true` → `changes.seen=0`. `PATCH /changes/{id}/seen`.

## 5. Adapters

`BaseAdapter.fetch(url) -> AdapterResult`. Shared: 15s timeout, desktop UA, 2 retries w/ backoff, Playwright headless only when needed.

- `github`: httpx against `api.github.com/users/{handle}` + `/events/public` (or `/repos` sorted by pushed_at as fallback). Reliable, build first. No auth for public data (60 req/h; optional GITHUB_TOKEN raises to 5000).
- `x|instagram|facebook|linkedin`: Playwright public-page fetch, cookies loaded from `backend/cookies/<platform>.json` if user exports them (documented in `docs/cookies.md`, never harvested in-app). On block/login wall → `status=blocked|needs_login`, UI offers manual paste.
- `manual`: accepts user-pasted `{profile, posts}`, goes through identical snapshot+diff pipeline — guarantees app is useful even when scrapers are blocked.

## 6. Scheduler

APScheduler AsyncIOScheduler started in FastAPI lifespan. One interval job per person (`check_interval_hours`, default 6, jitter ±10 min via random offset at schedule time). Jobs call `SnapshotService` with a fresh DB session. Manual `POST /check` uses the same code path. All per-link outcomes recorded in `check_runs.per_link_results` even on partial failure.

## 7. API contract (JSON, no auth)

- `GET /health`
- `GET+POST /persons` | `GET+PUT+DELETE /persons/{id}`
- `POST /persons/{id}/links` | `DELETE /links/{link_id}`
- `POST /persons/{id}/check?trigger=manual`
- `GET /persons/{id}/timeline?since=ISO` → `{snapshots:[], changes:[]}`
- `GET /persons/{id}/posts` → unified cross-platform feed
- `GET /alerts?unseen=true&person_id=` | `PATCH /changes/{id}/seen` | `PATCH /alerts/seen-all?person_id=`
- `POST /links/{link_id}/manual-snapshot {profile, posts}` (fallback input)

Validation: Pydantic v2, platform URL regexes, `handle` auto-extracted. Errors: 404 person/link, 422 bad URL, 502 adapter failure surfaced as link `last_status`, never 500 for a single-link failure.

## 8. Error handling

Per-link try/except isolation (one blocked platform ≠ failed person check). Scheduler job exceptions logged, check_run marked `partial`. SQLite WAL + `check_same_thread=False` + short transactions for API/scheduler concurrency. Playwright browser singleton reused, closed on shutdown.

## 9. Testing

`pytest`: diff-engine unit tests (field change / new post / no-change / count change), API CRUD + check + timeline tests on in-memory SQLite, adapter contract test with recorded fixture (no live network in CI). Target: diff + API paths covered; live scrapers excluded.

## 10. Build order (ponytail: smallest working diff first)

P0 scaffold (venv, health, CORS) → P1 persons+links CRUD + GitHub adapter + baseline snapshot → P2 manual-snapshot + remaining adapter stubs → P3 diff+timeline+alerts → P4 scheduler+manual check → P5 frontend wiring → P6 Playwright hardening.

## 11. Ethics

Public data / consented monitoring only. Respect robots/ToS, back off on 429, identify via UA. Documented in README.
