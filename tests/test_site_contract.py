import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "dreamfood-db/site"


class SiteContractTests(unittest.TestCase):
    def test_catalogue_has_search_filter_detail_and_source_boundary(self):
        html = (SITE / "index.html").read_text(encoding="utf-8")
        javascript = (SITE / "app.js").read_text(encoding="utf-8")
        self.assertIn('id="search"', html)
        self.assertIn('id="category"', html)
        self.assertIn('id="detail"', html)
        self.assertIn("来源作者说法", html)
        self.assertIn("loadCatalog", javascript)
        self.assertIn("renderResults", javascript)
        self.assertIn("DREAMFOOD_SUPABASE", javascript)

    def test_operating_guide_explains_safe_import_and_pages_deployment(self):
        readme = (ROOT / "dreamfood-db/README.md").read_text(encoding="utf-8")
        workflow = (ROOT / "dreamfood-db/.github/workflows/pages.yml").read_text(encoding="utf-8")
        for phrase in ("行级安全", "发布密钥", "服务角色密钥", "source_books.json", "GitHub Pages"):
            self.assertIn(phrase, readme)
        self.assertIn("deploy-pages", workflow)


if __name__ == "__main__":
    unittest.main()
