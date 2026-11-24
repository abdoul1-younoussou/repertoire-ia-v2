
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

result = subprocess.run(
    [sys.executable, "-m", "monitor.monitor"],
    cwd=ROOT,
    check=False
)

sys.exit(result.returncode)
