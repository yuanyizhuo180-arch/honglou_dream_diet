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

## 大观园地图页

正式二维插画地图位于 [`garden/`](garden/)，包含本地底图、六景交互与设计 QA 文档。

## 完整工作资料

`artifacts/2026-09-29/` 保留本次地图工作的完整可分享资料：全部地图版本、设计文档、预览图、浏览器测试、实现脚本与执行记录。它不包含本机同步镜像、Git 元数据、运行缓存或任何本机凭据。

## 统一网站（2026-11-10）

当前正式网站：https://honglou-mengshi.pages.dev/

完整可部署文件位于 [`unified-site/`](unified-site/)，涵盖首页、二维大观园、最新食典和六章剧情／游戏／食笺。Cloudflare 发布目录选择 `unified-site`，无需构建命令。原 `site/`、`garden/` 与研究资料保留。

手机端固定顺时针旋转 90°，阅读滑动与触控修复仅在手机环境生效；电脑保留原版显示。茄鲞 A5 显示“你把茄鲞搛些餵他。”。

本地预览：`python3 -m http.server 5183 --directory unified-site`。手机与电脑处于同一局域网时访问电脑的局域网 IP 与此端口。显式手机入口为 `/mobile/?page=%2F`。

手机辅助构建来源保存在 `integration-work/mobile-source/`。从仓库根目录执行 `python3 -c "import sys; from pathlib import Path; sys.path.insert(0, 'integration-work'); from mobile_adjustments import apply; apply(Path('unified-site'))"` 可重新同步辅助文件。发布文件清单见 [`docs/releases/2026-11-10-manifest.json`](docs/releases/2026-11-10-manifest.json)。

本次不改变原数据库导入流程和 GitHub Pages 工作流。Cloudflare 与 GitHub 仓库是分别更新的，不配置自动联动。
