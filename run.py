"""Eyes on You — one-command launcher.

Usage:  python run.py [--skip-install] [--backend-only] [--no-browser]

- Installs backend deps (pip) and frontend deps (npm) when missing.
- Starts FastAPI on :8000 and Vite dev UI on :5173, opens the browser.
- Ctrl+C stops both servers. Stdlib only.
"""

import argparse
import shutil
import subprocess
import sys
import time
import urllib.request
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND = ROOT / "backend"
FRONTEND = ROOT / "frontend"
API_URL = "http://localhost:8000"
UI_URL = "http://localhost:5173"


def run(cmd, cwd, check=True):
    print(f"$ {' '.join(cmd)}  (in {cwd})")
    subprocess.run(cmd, cwd=cwd, check=check)


def pip_install():
    run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], BACKEND)


def npm_install():
    npm = shutil.which("npm")
    if not npm:
        sys.exit("ERROR: Node.js/npm not found. Install Node 18+ from https://nodejs.org, then re-run.")
    run([npm, "install"], FRONTEND)


def ensure_deps(skip_install):
    try:
        import fastapi  # noqa: F401
        backend_ok = True
    except ImportError:
        backend_ok = False
    if not backend_ok and not skip_install:
        print("Backend deps missing — installing...")
        pip_install()
    elif not backend_ok:
        sys.exit("ERROR: backend deps missing. Re-run without --skip-install.")

    if not (FRONTEND / "node_modules").is_dir() and not skip_install:
        print("Frontend deps missing — installing (one-time, may take a minute)...")
        npm_install()
    elif not (FRONTEND / "node_modules").is_dir():
        sys.exit("ERROR: frontend node_modules missing. Re-run without --skip-install.")


def wait_for_health(timeout=60):
    for _ in range(timeout):
        try:
            with urllib.request.urlopen(API_URL + "/health", timeout=2) as r:
                if r.status == 200:
                    return True
        except Exception:
            time.sleep(1)
    return False


def main():
    ap = argparse.ArgumentParser(description="Run Eyes on You (backend + UI).")
    ap.add_argument("--skip-install", action="store_true", help="skip dep checks")
    ap.add_argument("--backend-only", action="store_true", help="start API only, no UI")
    ap.add_argument("--no-browser", action="store_true", help="don't auto-open browser")
    args = ap.parse_args()

    if not BACKEND.is_dir() or not FRONTEND.is_dir():
        sys.exit("ERROR: run this from the project root (backend/ and frontend/ must exist).")

    ensure_deps(args.skip_install)
    npm = shutil.which("npm")

    backend = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--port", "8000"],
        cwd=BACKEND,
    )
    procs = [backend]
    try:
        if not wait_for_health():
            raise RuntimeError("backend did not become healthy on :8000")
        print(f"API ready at {API_URL}")

        if not args.backend_only:
            frontend = subprocess.Popen([npm, "run", "dev"], cwd=FRONTEND)
            procs.append(frontend)
            print(f"UI starting at {UI_URL}")
            if not args.no_browser:
                time.sleep(3)
                webbrowser.open(UI_URL)

        print("Running. Press Ctrl+C to stop.")
        for p in procs:
            p.wait()
    except KeyboardInterrupt:
        print("\nStopping...")
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        for p in procs:
            if p.poll() is None:
                p.terminate()


if __name__ == "__main__":
    main()
