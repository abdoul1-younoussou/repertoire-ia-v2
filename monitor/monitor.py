
import json
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit
from concurrent.futures import ThreadPoolExecutor

import requests

from .config import FILES, REPORT, TIMEOUT, RETRIES, MAX_WORKERS

NON_VERIFIABLE = {401, 403, 429}
TEMPORARY = {408, 425, 500, 502, 503, 504}

ALL_STATUSES = (
    "ok", "redirect", "broken", "non_verifiable",
    "temporary_error", "connection_error", "invalid_url"
)


def classify(code):
    if code is None:
        return "unknown"
    if 200 <= code < 300:
        return "ok"
    if 300 <= code < 400:
        return "redirect"
    if code in NON_VERIFIABLE:
        return "non_verifiable"
    if code in TEMPORARY or code >= 500:
        return "temporary_error"
    if 400 <= code < 500:
        return "broken"
    return "unknown"


def valid_http_url(url):
    try:
        parsed = urlsplit(str(url).strip())
        return parsed.scheme in {"http", "https"} and bool(parsed.netloc)
    except (TypeError, ValueError):
        return False


def load_resources(files=FILES):
    resources = []
    for path in files:
        path = Path(path)
        if not path.exists():
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(data, list):
            raise ValueError(f"{path.name} doit contenir une liste JSON")
        for item in data:
            if isinstance(item, dict) and item.get("url"):
                resources.append({
                    "id": item.get("id"),
                    "name": item.get("name", "Sans nom"),
                    "category": item.get("category"),
                    "priority": item.get("priority"),
                    "url": item["url"],
                    "source_file": path.name,
                })
    return resources


def check_url(url, session=None):
    if not valid_http_url(url):
        return {
            "status": "invalid_url",
            "http_status": None,
            "final_url": None,
            "attempts": [],
            "reason": "URL invalide ou protocole non HTTP(S).",
            "auto_updated": False,
            "redirected": False,
        }

    client = session or requests.Session()
    attempts = []

    for number in range(1, RETRIES + 2):
        try:
            response = client.get(
                url,
                timeout=TIMEOUT,
                allow_redirects=True,
                stream=True,
                headers={
                    "User-Agent": "RepertoireIA-LinkChecker/2.1",
                    "Accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
                },
            )

            code = response.status_code
            final_url = response.url
            redirected = bool(getattr(response, "history", [])) or final_url != url
            response.close()

            status = classify(code)
            if redirected and status == "ok":
                status = "redirect"

            attempts.append({
                "attempt": number,
                "http_status": code,
                "classification": status,
                "redirected": redirected,
            })

            if status == "temporary_error" and number <= RETRIES:
                time.sleep(1)
                continue

            return {
                "status": status,
                "http_status": code,
                "final_url": final_url,
                "attempts": attempts,
                "reason": None,
                "auto_updated": False,
                "redirected": redirected,
            }

        except requests.RequestException as exc:
            attempts.append({
                "attempt": number,
                "http_status": None,
                "classification": "connection_error",
                "error": str(exc)[:300],
            })
            if number <= RETRIES:
                time.sleep(1)

    return {
        "status": "connection_error",
        "http_status": None,
        "final_url": None,
        "attempts": attempts,
        "reason": "Échec de connexion après plusieurs tentatives.",
        "auto_updated": False,
        "redirected": False,
    }


def build_report(resources=None, session=None):
    resources = resources if resources is not None else load_resources()

    def inspect(item):
        return {**item, **check_url(item["url"], session=session)}

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        results = list(executor.map(inspect, resources))

    summary = {status: 0 for status in ALL_STATUSES}
    for item in results:
        summary[item["status"]] = summary.get(item["status"], 0) + 1

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total": len(results),
        "summary": summary,
        "policy": {
            "links_modified_automatically": False,
            "401_403_429_are_broken": False,
            "redirects_are_reported": True,
            "source_catalogue_modified": False,
        },
        "results": results,
    }


def main():
    report = build_report()
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Rapport créé : {REPORT} — {report['total']} liens analysés")
    print("Résumé :", report["summary"])


if __name__ == "__main__":
    main()
          
