from pathlib import Path
import os

APP_DIR = Path(__file__).resolve().parents[2]  # backend/
DATA_DIR = Path(os.getenv("DATA_DIR", str(APP_DIR / "data")))
DATA_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite+aiosqlite:///{(DATA_DIR / 'data.db').as_posix()}")
DEFAULT_CHECK_INTERVAL_HOURS = int(os.getenv("CHECK_INTERVAL_HOURS", "6"))
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
CORS_ORIGINS = ["http://localhost:5173"]
