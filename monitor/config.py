
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

FILES = [
    ROOT / "data" / "tools.json",
    ROOT / "data" / "formations.json",
    ROOT / "data" / "tutorials.json",
]

REPORT = ROOT / "reports" / "status.json"

TIMEOUT = 12
RETRIES = 2
MAX_WORKERS = 8
