# 正式地图页 QA 记录

2026-10-02，正式包：`outputs/honglou-garden/`。

- 正式包结构：通过。包含 `/garden`、本地清理底图、内容适配层和发布元数据。
- 内容边界：通过。无 `foodCardId` 的节点仅显示“食笺 · 关系待核验”，不创建制作入口。
- 浏览器：通过。桌面 `/garden?place=xiaoxiang` 直接打开潇湘馆；关闭面板后中心与倍率保持；无 canvas 或三维渲染；六标签可见。
- 手机：通过。390×844 无横向溢出；藕香榭显示“无固定居住人物”。
- 截图：`outputs/honglou-garden/previews/official-desktop.png`、`official-mobile.png`。

限制：该目录是当前可写环境中的正式发布包。同步项目镜像只读；若后续提供正式应用仓库，应把该包的路由和资源迁入该仓库，而不是改写镜像。
