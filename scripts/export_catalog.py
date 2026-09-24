#!/usr/bin/env python3
"""Convert the reviewed candidate records into public-catalogue datasets."""

import argparse
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
ENTITY_FILE = ROOT / "dreamfood-work/data/candidates/consolidated-entities.json"
OCCURRENCE_FILE = ROOT / "dreamfood-work/data/candidates/consolidated-occurrences.json"
SOURCE_BOOKS = {
    "SRC-JRR-MSDG-001": {
        "id": "SRC-JRR-MSDG-001",
        "short_name": "jrr",
        "title": "红楼梦美食大观",
        "author": "蒋荣荣",
    },
    "SRC-QYM-YSP-001": {
        "id": "SRC-QYM-YSP-001",
        "short_name": "qym",
        "title": "红楼梦饮食谱",
        "author": "秦一民",
    },
}


def load_records(path, key):
    data = json.loads(path.read_text(encoding="utf-8"))
    return data[key]


def source_locator(record):
    printed = record.get("Printed_Page")
    suffix = f"；印刷页 {printed}" if printed is not None else ""
    return f"{record['Source_ID']}：PDF 第 {record['PDF_Page']} 页{suffix}"


def build_catalog():
    raw_entities = load_records(ENTITY_FILE, "Entities")
    raw_occurrences = load_records(OCCURRENCE_FILE, "Occurrences")
    entity_ids = {item["Entity_ID"] for item in raw_entities}

    entities = [
        {
            "id": item["Entity_ID"],
            "name": item["Name"],
            "categories": item.get("Categories", []),
            "decisions": item.get("Decisions", []),
            "novel_candidate": bool(item.get("Novel_Candidate")),
        }
        for item in raw_entities
    ]

    occurrences = []
    aliases = []
    seen_aliases = set()
    for record in raw_occurrences:
        entity_id = record.get("Entity_ID")
        if entity_id not in entity_ids:
            raise ValueError(f"Unknown entity for {record['Occurrence_ID']}: {entity_id}")
        if record["Source_ID"] not in SOURCE_BOOKS:
            raise ValueError(f"Unknown source for {record['Occurrence_ID']}: {record['Source_ID']}")
        occurrences.append(
            {
                "id": record["Occurrence_ID"],
                "entity_id": entity_id,
                "source_book_id": record["Source_ID"],
                "name": record["Name"],
                "category": record.get("Category"),
                "decision": record.get("Decision"),
                "pdf_page": record.get("PDF_Page"),
                "printed_page": record.get("Printed_Page"),
                "source_page_id": record.get("Source_Page_ID"),
                "source_locator": source_locator(record),
                "notes": record.get("Notes") or "",
                "source_transcription": record.get("Source_Transcription") or "",
                "verification_status": record.get("Verification_Status") or "",
                "semantic_verification": record.get("Semantic_Verification") or "",
                "organization_status": record.get("Organization_Status") or "",
                "chapter_hints": record.get("Chapter_Hints") or [],
                "assertion_boundary": "来源作者说法",
            }
        )
        for anchor in record.get("Primary_Anchors") or []:
            alias = (anchor.get("Matched_Query") or "").strip()
            key = (entity_id, alias)
            if alias and alias != record["Name"] and key not in seen_aliases:
                aliases.append({"entity_id": entity_id, "alias": alias, "kind": "原文定位词"})
                seen_aliases.add(key)

    return {
        "metadata": {
            "title": "红楼梦食资料库",
            "entity_count": len(entities),
            "occurrence_count": len(occurrences),
            "assertion_boundary": "来源作者说法",
        },
        "source_books": list(SOURCE_BOOKS.values()),
        "entities": entities,
        "occurrences": occurrences,
        "aliases": aliases,
        "relations": [],
    }


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def export(output):
    catalog = build_catalog()
    write_json(output, catalog)
    write_json(ROOT / "dreamfood-db/site/data/catalog-snapshot.json", catalog)
    import_dir = ROOT / "dreamfood-db/data/import"
    write_json(import_dir / "source_books.json", catalog["source_books"])
    write_json(import_dir / "entities.json", catalog["entities"])
    write_json(import_dir / "occurrences.json", catalog["occurrences"])
    write_json(import_dir / "aliases.json", catalog["aliases"])
    return catalog


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        type=Path,
        default=ROOT / "dreamfood-db/data/catalog-snapshot.json",
    )
    args = parser.parse_args()
    catalog = export(args.output)
    print(f"Exported {catalog['metadata']['entity_count']} entities and {catalog['metadata']['occurrence_count']} occurrences")


if __name__ == "__main__":
    main()
