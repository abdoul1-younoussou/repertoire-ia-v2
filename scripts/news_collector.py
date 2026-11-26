#!/usr/bin/env python3
"""Collecte des métadonnées RSS/Atom. Aucune publication automatique."""
from __future__ import annotations

import hashlib
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES_FILE = ROOT / "data" / "news_sources.json"
PENDING_FILE = ROOT / "data" / "news_pending.json"
PUBLISHED_FILE = ROOT / "data" / "news.json"
MAX_PER_SOURCE = 15
TIMEOUT = 20

def load_json(path: Path, default):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as exc:
        print(f"[ERREUR] Lecture {path}: {exc}")
        return default

def clean_html(value: str) -> str:
    value = re.sub(r"<script\b[^>]*>.*?</script>", " ", value or "", flags=re.I | re.S)
    value = re.sub(r"<style\b[^>]*>.*?</style>", " ", value, flags=re.I | re.S)
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", unescape(value)).strip()

def child_text(node, names):
    for name in names:
        found = node.find(name)
        if found is not None and found.text:
            return found.text.strip()
    # Atom uses namespaced tags
    for child in list(node):
        local = child.tag.rsplit("}", 1)[-1]
        if local in names and child.text:
            return child.text.strip()
    return ""

def item_link(node):
    link = node.find("link")
    if link is not None:
        href = link.attrib.get("href")
        if href:
            return href.strip()
        if link.text:
            return link.text.strip()
    for child in list(node):
        if child.tag.rsplit("}", 1)[-1] == "link":
            href = child.attrib.get("href")
            if href:
                return href.strip()
    return ""

def classify(title: str, summary: str) -> str:
    text = (title + " " + summary).lower()
    caution = ("surveillance", "deepfake", "facial recognition", "weapon", "military",
               "cyberattack", "malware", "biometric", "manipulation", "désinformation")
    harmful = ("phishing kit", "ransomware", "credential theft", "fraud automation")
    if any(term in text for term in harmful):
        return "non_recommande"
    if any(term in text for term in caution):
        return "a_examiner"
    return "a_examiner"  # Le collecteur ne donne pas de feu vert éthique automatique.

def parse_feed(xml_bytes, source):
    root = ET.fromstring(xml_bytes)
    nodes = root.findall(".//item")
    if not nodes:
        nodes = [n for n in root.iter() if n.tag.rsplit("}", 1)[-1] == "entry"]

    records = []
    for node in nodes[:MAX_PER_SOURCE]:
        title = child_text(node, ["title"])
        link = item_link(node)
        summary_raw = child_text(node, ["description", "summary", "content", "encoded"])
        summary = clean_html(summary_raw)[:600]
        published = child_text(node, ["pubDate", "published", "updated", "date"])
        if not title or not link:
            continue
        key = hashlib.sha256(link.strip().lower().encode("utf-8")).hexdigest()
        records.append({
            "id": key,
            "title": clean_html(title),
            "summary": summary,
            "source_name": source["name"],
            "source_url": source["url"],
            "article_url": link,
            "language": source.get("language", "unknown"),
            "source_type": source.get("type", "other"),
            "published_at": published,
            "collected_at": datetime.now(timezone.utc).isoformat(),
            "editorial_status": classify(title, summary),
            "review_status": "pending",
            "review_note": ""
        })
    return records

def fetch_source(source):
    request = urllib.request.Request(
        source["url"],
        headers={"User-Agent": "RepertoireIA-NewsCollector/1.0 (+https://github.com/abdoul1-younoussou/repertoire-ia-v2)"}
    )
    with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
        if response.status != 200:
            raise RuntimeError(f"HTTP {response.status}")
        return response.read()

def main():
    sources = load_json(SOURCES_FILE, [])
    pending = load_json(PENDING_FILE, [])
    published = load_json(PUBLISHED_FILE, [])
    known = {item.get("id") for item in pending + published if item.get("id")}
    added = 0
    errors = 0

    for source in sources:
        if not source.get("active", False):
            continue
        try:
            records = parse_feed(fetch_source(source), source)
            for record in records:
                if record["id"] not in known:
                    pending.append(record)
                    known.add(record["id"])
                    added += 1
            print(f"[OK] {source['name']}: {len(records)} éléments lus")
        except Exception as exc:
            errors += 1
            print(f"[AVERTISSEMENT] {source.get('name', 'Source')}: {exc}")

    pending.sort(key=lambda item: item.get("collected_at", ""), reverse=True)
    PENDING_FILE.write_text(json.dumps(pending, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Collecte terminée : {added} nouvelle(s) actualité(s), {errors} source(s) en erreur.")
    print("Aucune actualité n'a été publiée automatiquement.")
    if errors == len([s for s in sources if s.get("active", False)]) and errors:
        sys.exit(1)

if __name__ == "__main__":
    main()
