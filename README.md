# 红楼梦食资料库

此目录将两部研究书的候选资料转换为 Supabase PostgreSQL 实体数据库，并提供可部署到 GitHub Pages 的公开查询网站。

## 数据与边界

- 当前快照含 528 个同名实体组、729 条来源记录。
- 研究书中关于历史、物种、药效、配方、版本和原著的说明均显示为“来源作者说法”。
- `dreamfood-work/` 中的来源资料和 OCR 档案不由本工程修改。

## 生成导入资料

在项目根目录运行：

```sh
python3 dreamfood-db/scripts/export_catalog.py
python3 dreamfood-db/scripts/import_supabase.py --dry-run
```

这会生成 `data/catalog-snapshot.json`、网页快照和下列导入文件：

1. `data/import/source_books.json`
2. `data/import/entities.json`
3. `data/import/aliases.json`
4. `data/import/occurrences.json`

## 载入 Supabase

1. 在 Supabase 建立项目，在 SQL Editor 中执行 `supabase/migrations/0001_catalog.sql`。
2. 该迁移会在所有公开表上启用**行级安全**，只向匿名访客授予 `SELECT`；不要自行向 `anon` 增加写入权限。
3. 在本机终端设置 `SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY`，再运行：

```sh
python3 dreamfood-db/scripts/import_supabase.py
```

`SUPABASE_SERVICE_ROLE_KEY` 是服务角色密钥，只能保存在本机或受保护的 CI 密钥中，绝不能写入 GitHub、网页或浏览器配置。用于网页的只是 Supabase **发布密钥**，且仍受只读行级安全策略约束。

## 发布 GitHub Pages

1. 将 `dreamfood-db` 作为 GitHub 仓库根目录，或将工作流中的路径改为实际子目录。
2. 在 GitHub 仓库 Settings → Pages 中选择 GitHub Actions 作为发布来源。
3. 复制 `site/config.example.js` 为 `site/config.js`，填入 Supabase URL 与发布密钥；发布密钥可公开，但不要提交服务角色密钥。
4. 在 `site/index.html` 的 `app.js` 之前加入 `<script src="config.js"></script>`。
5. 推送后，`.github/workflows/pages.yml` 会发布网站。未添加 `config.js` 时，网站仍会使用随站点发布的静态快照。

## 日常编辑

在 Supabase Table Editor 编辑 `catalog_entity`、`entity_alias` 和 `source_occurrence`。需要从现有候选资料重新生成时，先运行导出器，再重新运行导入器；导入器使用 upsert，可重复执行。
