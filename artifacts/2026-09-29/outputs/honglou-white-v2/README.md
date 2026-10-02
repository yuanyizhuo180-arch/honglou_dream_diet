# 红楼小灶 · 三维白模 v2

本地预览：在本目录启动 `python3 -m http.server 5173`，打开 http://localhost:5173/garden 。当前任务已启动该预览。

全部依赖本地，无需安装构建工具。Three.js 0.180.0，MIT，文件在vendor/。动态场景用程序几何生成，浏览器需要支持WebGL2；失败时使用二维布局图和场所列表。`/garden?fallback`演示降级。

布局与原著边界：docs/design/garden-layout.md。
平面图：docs/design/garden-layout.svg。
评审：docs/design/visual-review.md。
实际截图：previews/。

本目录是独立交付副本，未修改ChatGPT同步项目、资料库网站或sources/。
