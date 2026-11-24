import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MONITOR = ROOT / "monitor" / "monitor.py"

if not MONITOR.exists():
    raise FileNotFoundError(f"Fichier introuvable : {MONITOR}")

result = subprocess.run(
    [sys.executable, str(MONITOR)],
    cwd=ROOT,
    check=False
)

sys.exit(result.returncode)
