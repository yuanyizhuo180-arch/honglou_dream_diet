# 大观园精细三维样板 Implementation Plan

**Goal:** 在独立目录把既有六景WebGL白模加工为可环看的园林细节样板。
**Architecture:** 保持JSON空间与HTML交互，将资产拆为几何、材质、植物、建筑及环境模块；场景控制器保留相机状态和射线拾取。
**Tech Stack:** 本地Three.js 0.180.0、ES模块、HTML/CSS、Playwright。
**Spec:** 用户本次附件的十五项精细化要求；docs/design/detail-spec.md。

## 全局约束

- 原同步项目、sources/、第四版与白模v2只读。
- 六节点邻近与水系分支关系保留；固定仰角、独立水平360度模式。
- 主场景为真实几何；场所特写由同一场景的独立相机渲染。
- 无AI/数据库伪接入，不开放未核验制作入口。
- 本轮审美为待审阅，不继承v4确认。

## Task 1: 几何与材质样板

Create: geometry.js、materials.js、structures.js、vegetation.js；Test: tests/geometry.test.mjs。
接口：`roofGeometry(width,depth,rise)`→BufferGeometry；`createBuilder(scene)`提供实例批次、盒体、杆件、曲线及提交；`buildResidence(builder,node)`构建可拾取建筑。

- [x] 先执行几何测试，确认缺少曲檐表面与完整索引时失败。
- [x] 实现连续曲檐屋顶、瓦垄、木柱梁、四面窗棂、台基台阶、院墙墙帽。
- [x] 使用可重复的程序纹理：灰泥、木纹、石铺、瓦与茅草；纹理本地导出。
- [x] 完成潇湘馆竹林、苔径与廊道，用实际截图检查。
- [x] 几何测试检查边界、有效法线、有限坐标和曲面檐口，不测装饰物数量。

## Task 2: 六景与园林

Create: environment.js；Modify: scene.js、garden-data.json。
接口：`buildEnvironment(builder,data)`；`buildVegetation(builder,data)`；每个建筑实例持有稳定节点ID。

- [x] 把建筑规则扩展到六景：蕉棠、香草石组、田舍井畦、轻盈水榭；避免全园同形资产。
- [x] 沿原坐标生成平滑溪流、连续池面和岸石；桥廊保持连接。
- [x] 五间素木门、门后障景、外围墙帽；薄边地台和局部分组植物。
- [x] 浏览器检查后侧、90/180/270度与中间角度，保存截图。

## Task 3: 页面与相机

Modify: app.js、index.html、styles.css。
接口：`createScene(host,data,onPick,onView)`返回state/project/zoom/pan/rotate/reset/thumbnail/inspect。

- [x] 用现有交互用例先检查新目录，记录未建立页面时失败。
- [x] 保持平移、缩放、旋转、拖动阈值、键盘与面板关闭状态。
- [x] 桌面左侧宽幅地图与右侧阅读面板；手机折叠列表和底部面板。
- [x] 独立相机渲染六景特写，不改变主地图状态。
- [x] 本地加载与WebGL降级，失败时列表仍可浏览。

## Task 4: 实页验证与交付

Create: previews/、docs/design/{verification,visual-review,asset-register,garden-layout}.md。

- [x] 浏览器运行至networkidle，再按真实控件检查标签/模型选择、平移、两指缩放、缩放边界、旋转、复位、Esc与焦点。
- [x] 1440×900、390×844无横向溢出；标签边界和重叠检查。
- [x] 截图总览、四方向、六景特写及桌面手机面板。
- [x] 记录真实构建时间、渲染统计、交互帧耗时和测试浏览器条件，不代替真手机性能声明。
- [x] 整理源文件、开源许可与可运行入口；状态保持待用户审阅。

按当前任务直接在本会话执行；独立输出不涉及Git合并或部署。
