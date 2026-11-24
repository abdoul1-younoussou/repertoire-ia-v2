
from pathlib import Path

# Racine du projet
ROOT_DIR = Path(__file__).resolve().parent.parent

# Dossiers de données et de rapports
DATA_DIR = ROOT_DIR / "data"
REPORTS_DIR = ROOT_DIR / "reports"

# Fichiers JSON à surveiller
CATALOG_FILES = [
    "tools.json",
    "formations.json",
    "tutorials.json",
]

# Paramètres de vérification
REQUEST_TIMEOUT = 15
MAX_WORKERS = 10

# Fichier de rapport
REPORT_FILE = REPORTS_DIR / "link-monitor-report.json"
