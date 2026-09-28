import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
EXPORTER = ROOT / "dreamfood-db" / "scripts" / "export_catalog.py"
sys.path.insert(0, str(ROOT / "dreamfood-db" / "scripts"))
import import_supabase


class CatalogExportTests(unittest.TestCase):
    def test_export_preserves_entity_occurrence_counts_and_source_locators(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "catalog-snapshot.json"
            subprocess.run(
                [sys.executable, str(EXPORTER), "--output", str(output)],
                cwd=ROOT,
                check=True,
            )
            catalog = json.loads(output.read_text(encoding="utf-8"))

        self.assertEqual(528, catalog["metadata"]["entity_count"])
        self.assertEqual(729, catalog["metadata"]["occurrence_count"])
        self.assertTrue(all(item["source_locator"] for item in catalog["occurrences"]))
        self.assertTrue(all(item["assertion_boundary"] == "来源作者说法" for item in catalog["occurrences"]))

    def test_import_datasets_and_migration_preserve_public_read_only_contract(self):
        output = ROOT / "dreamfood-db/data/catalog-snapshot.json"
        subprocess.run([sys.executable, str(EXPORTER), "--output", str(output)], cwd=ROOT, check=True)
        for name in ("entities", "occurrences", "aliases", "source_books"):
            records = json.loads((ROOT / f"dreamfood-db/data/import/{name}.json").read_text(encoding="utf-8"))
            self.assertTrue(records, name)
        occurrences = json.loads((ROOT / "dreamfood-db/data/import/occurrences.json").read_text(encoding="utf-8"))
        self.assertTrue(all(item["id"] and item["source_locator"] for item in occurrences))
        migration = (ROOT / "dreamfood-db/supabase/migrations/0001_catalog.sql").read_text(encoding="utf-8")
        self.assertIn("enable row level security", migration)
        self.assertIn("grant select", migration)
        self.assertNotIn("grant insert, update, delete on table public.catalog_entity to anon", migration)

    def test_importer_dry_run_reads_every_import_dataset_without_credentials(self):
        importer = ROOT / "dreamfood-db/scripts/import_supabase.py"
        result = subprocess.run(
            [sys.executable, str(importer), "--dry-run"],
            cwd=ROOT,
            capture_output=True,
            text=True,
        )
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertIn("source_books", result.stdout)
        self.assertIn("occurrences", result.stdout)

    def test_importer_rejects_non_ascii_secret_key_before_request(self):
        with self.assertRaisesRegex(ValueError, "ASCII"):
            import_supabase.validate_api_key("sb_secret_误输入")


if __name__ == "__main__":
    unittest.main()
