#!/usr/bin/env python3
"""Idempotently import generated catalogue JSON into Supabase's Data API."""

import argparse
import json
import os
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[2]
IMPORTS = (
    ("source_books", "source_book"),
    ("entities", "catalog_entity"),
    ("aliases", "entity_alias"),
    ("occurrences", "source_occurrence"),
)


def read_records(data_dir, filename):
    return json.loads((data_dir / f"{filename}.json").read_text(encoding="utf-8"))


def validate_api_key(key):
    if not key.isascii():
        raise ValueError("SUPABASE_SECRET_KEY must contain ASCII characters only.")
    if not (key.startswith("sb_secret_") or key.startswith("eyJ")):
        raise ValueError("Use a Supabase Secret key (sb_secret_...) or legacy service_role key.")


def post_batch(url, key, table, records):
    request = Request(
        f"{url.rstrip('/')}/rest/v1/{table}",
        data=json.dumps(records, ensure_ascii=False).encode("utf-8"),
        headers={
            "apikey": key,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        },
        method="POST",
    )
    with urlopen(request, timeout=30) as response:
        if response.status not in (200, 201, 204):
            raise RuntimeError(f"{table} returned HTTP {response.status}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", type=Path, default=ROOT / "dreamfood-db/data/import")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    datasets = [(label, table, read_records(args.data_dir, label)) for label, table in IMPORTS]
    for label, _, records in datasets:
        print(f"{label}: {len(records)} records")
    if args.dry_run:
        return

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SECRET_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise SystemExit("Set SUPABASE_URL and SUPABASE_SECRET_KEY before importing.")

    try:
        validate_api_key(key)
        for label, table, records in datasets:
            for start in range(0, len(records), 100):
                post_batch(url, key, table, records[start:start + 100])
            print(f"Imported {label}")
    except (HTTPError, URLError, RuntimeError, ValueError) as error:
        raise SystemExit(f"Import failed: {error}") from error


if __name__ == "__main__":
    main()
