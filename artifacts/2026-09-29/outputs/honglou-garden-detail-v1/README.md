# 红楼小灶 · 大观园精细三维样板 v1

本轮把白模加工为曲檐灰瓦、窗棂木构、台阶院墙、五间素木门、竹蕉花木、孔洞山石与三屋田舍；园路水系平滑，桥廊可辨。HTML面板使用实际三维场景特写。

运行：在本目录启动 `python3 -m http.server 5174`，打开 http://localhost:5174/garden 。当前任务已启动预览。

无需安装构建工具，依赖全部本地。浏览器需要WebGL2；失败时保留SVG和节点列表。`/garden?fallback`演示二维降级。

默认拖动平移；点击“旋转看园”可水平环看360度，再点击切回平移。滚轮、双指与按钮缩放；Home或恢复总览复位；方向键可操作，Esc关闭面板。

- gallery.html：桌面/手机、五角度与六景特写画廊。
- docs/design/garden-layout.md / .svg：坐标、道路、水系与原著边界。
- docs/design/visual-review.md：待用户审阅记录。
- docs/design/verification.md / performance.json：实际验证与测试条件。
- docs/design/asset-register.md：原创程序资产、Three.js许可与参考图边界。
- assets/：程序纹理PNG导出、SVG图标；previews/：实际页面和特写。

精细版本是独立副本，没有修改原同步项目、资料库网站、sources/、第四版图片或白模v2。参考图仍用于审美对照，不承诺逐像素一致。
