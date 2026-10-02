# SDD ledger — plan: docs/superpowers/plans/2026-09-29-正式二维插画地图页.md

Ruling: 当前可写工作区不存在正式前端仓库；同步项目中的 `honglou-web` 为只读镜像。因此将 `outputs/honglou-garden/` 作为正式可发布地图包，而非改写同步镜像。成本：后续若提供正式仓库，仍需执行一次迁入。

Pre-flight: Task 2 consumes Task 1 的正式视觉基线；Task 3 与 Task 4 消费 Task 2 的正式地图页面；Task 5 消费前四项。接口一致，按顺序执行。
