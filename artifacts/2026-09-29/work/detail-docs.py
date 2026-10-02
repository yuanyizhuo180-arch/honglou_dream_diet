import pathlib,json,math
p=pathlib.Path('outputs/honglou-garden-detail-v1');data=json.loads((p/'garden-data.json').read_text());perf=json.loads((p/'docs/design/performance.json').read_text());bridges=json.loads((p/'docs/design/bridge-layout.json').read_text())
layout='''# 大观园精细三维样板 v1

状态：待用户审阅。第四版仅确认视觉方向，不把它的确认转移到本次模型。本版本独立保存，未覆盖同步项目、sources/、v4参考图和白模v2。

## 空间与坐标

游戏单位：x向默认画面右，z向前，y为高度。不是原著东西南北方位。默认相机为正交投影，位置相对目标(0,185,170)，仰角固定；水平旋转360度。目标初始(0,0,4)，缩放70%–240%，平移每轴±35。闭合面板保持这些状态，复位回到初始位置、角度、缩放和平移模式。

|节点ID|名称|节点中心(x,z)|基准建筑范围|主屋墙身高|关联人物/性质|
|---|---|---|---|---|---|
'''
for n in data['nodes']:layout+=f'|{n["id"]}|{n["name"]}|{tuple(n["position"][:2])}|{n["footprint"][0]}×{n["footprint"][1]}|{n["height"]*.73:.2f}|{n["resident"] or "园林宴饮，无固定住客"}|\n'
layout+='''
与v2相比，节点中心没有变化。主屋通常向院后退2.2单位，给前庭、台阶和植物留空间。墙身高度为白模高度的73%，屋脊升高约3.8单位，使建筑更接近参考图的低矮园林比例。院墙在基准范围外扩大10×12单位。藕香榭保持池中独立体量，台基抬高。稻香村的20×15为田舍基准范围，实际采用11×7主屋与两座5×5小屋，屋檐略超出基准范围；仍在30×27泥墙围合内。

## 设计修正

- 潇湘馆细流由原先穿过实体房屋改为沿西侧和前庭穿院。后墙与右墙有溪流水口和高于水面的过梁。
- 怡红院后墙增设园路出口；短接路线由v2的67.1单位绕院路线改为约21单位，先出后门再到潇湘馆前庭。
- 池面向西适度展开，减少狭长条带感，使藕香榭更完整地位于水中。
- 曲溪和园路以centripetal Catmull–Rom曲线平滑，端点及分支关系保留。桥位根据平滑曲线交点重新求得，图示和实景一致。
- 外围改为轻微折转的园墙与薄地台，减轻厚重方形托盘感。
- 正门深化为五开间素木门，未沿用首页朱漆装置。门后石组峰高约7单位，中线地面眼高1.6的来访视线由石组遮挡，路径从x=-13旁绕。

布局图：[`garden-layout.svg`](garden-layout.svg)，入口地面视线图：[`entrance-sightline.svg`](entrance-sightline.svg)。SVG显示园路与水系中心线及建筑基准范围，不是施工测绘图。

## 步行路线

|ID|配置控制点(x,z)|折线实算长度|
|---|---|---|
'''
for w in data['walkways']:layout+=f'|{w["id"]}|{w["points"]}|{sum(math.dist(a,b) for a,b in zip(w["points"],w["points"][1:])):.2f}|\n'
layout+='''
以上是控制折线长度；曲线平滑后的路长略有差异。所有院墙前门保留开口，怡红院另有后门。桥廊两端加过渡踏步。藕香榭通过跨水折廊和后侧竹桥连岸。平滑曲线另有六处过溪桥板：

'''
for b in bridges:layout+=f'- {b["route"]}，中心({b["x"]:.2f},{b["z"]:.2f})。\n'
layout+='''
## 水系

后墙水口入水 → 潇湘馆西侧及前庭曲溪 → (-26,0)分成两支 → 右侧同一局部池面 → 池面东南侧汇流 → 前右墙下出水(70,66)。两支连通，桥廊不截断水面。水面为静态几何、程序波纹和环境反射材质，不做真实流体或实时镜面反射。

'''
for w in data['waterway']:layout+=f'- {w["id"]}：{w["points"]}。\n'
layout+='''
## 原著依据与艺术化边界

依据沿用原项目总计划5.5节保存的工作底本判断。未新增纸本校勘或权威机构认证，坐标、体量、植物数量及池形是艺术化设计。

|场所|工作依据|本轮细节|边界|
|---|---|---|---|
|园门|17回五间素木、白墙白石、山石障景|五开间、木窗格、灰瓦、石阶、入口石组|尺寸、雕花纹样为简化艺术化处理|
|潇湘馆|17、40回竹、廊、苔径、细流；23回相邻关系|分组竹、曲廊、灰泥木构、溪流穿院与水口|植物数量和精确朝向不是复原|
|怡红院|17回蕉棠游廊；23回两处相近|蕉叶、海棠分枝、侧廊、后门短接|内饰与距离艺术化|
|蘅芜苑|17回山石遮屋、香草藤蔓|孔洞石组、香草与攀藤，无院内普通乔木填空|石形与种类造型艺术化|
|秋爽斋|23回探春居所；40回晓翠堂|开阔主屋、窗棂与廊道、面板食事关联|体量、朝向、内部尚未原著复原|
|稻香村|17回茅屋泥墙篱井菜畦；23回李纨|三茅屋、起伏泥墙、井、菜畦与杏树|三屋具体组合和茅顶形态艺术化|
|藕香榭|38回池中榭、四面窗、曲廊竹桥|四面木窗、栏杆台基、折廊与竹桥|具体池形位置艺术化，无固定住客|

## 材质与页面

真实曲面屋顶、瓦垄、檐口、柱梁、门窗格、门环、石阶和院墙墙帽。重复构件实例化，静态同材质几何合并。灰泥、石铺、木纹、瓦、茅草和水纹采用确定种子的程序纹理；导出PNG保存在assets/，运行时按同一规则生成，不依赖CDN。完整侧背面支持水平环看。

桌面左侧宽幅地图与右侧阅读面板；关闭节点面板显示游园指引，不改变地图宽度或相机。场所特写由同一场景独立相机即时渲染，并缓存；生成特写不改变主画面。手机地图全宽、居所列表折叠、控件单排、面板从底部打开并可内部滚动。HTML真实文字替换参考图错误字。

WebGL建立失败或丢失上下文时，保留二维布局图和可用列表。`?fallback`可演示。食典与小书匣明确演示状态，没有已核验菜品关系，因此没有“入小灶”。

## 与参考图仍有差异

本轮为程序化精细模型样板。参考图中更复杂的建筑组合、自然植物枝叶、山石表面雕琢与材质旧化尚未逐项达到插画级效果，背面采用同一艺术化规则补充。不是参考图逐像素复现或原著建筑复原。后续应优先根据用户对默认视角、植物密度和山石的反馈深化；新的美术确认仍待用户审阅。
'''
(p/'docs/design/garden-layout.md').write_text(layout)
(p/'docs/design/asset-register.md').write_text('''# 资产与许可

|资产|来源/生成方式|位置|许可与边界|
|---|---|---|---|
|Three.js 0.180.0|上轮下载的官方npm分发，保持本地副本|vendor/three.module.js、three.core.js|MIT，见vendor/LICENSE-three.txt|
|建筑、屋顶、窗棂、柱梁、台阶、院墙、桥廊|本任务原创程序几何|geometry.js、structures.js、environment.js|可随本项目使用；艺术化设计，不是测绘复原|
|竹、蕉、海棠、杏、香草、柳|本任务原创程序几何与确定种子|vegetation.js|无外部商业资产；造型仍为样板|
|孔洞山石与岸石|本任务原创变形球体、环面组合|environment.js|可环看、有孔洞；非真实石体扫描|
|灰泥、石材、石铺、木纹、瓦、茅草、泥墙、水纹|Canvas程序纹理|materials.js，导出assets/*.png|原创，无外部照片或生成图贴地|
|环境反射|原创程序渐变与日光分布|assets/environment.png|环境反射，不声称实时反射场景|
|场所特写|同一Three.js场景实际渲染|previews/closeup-*.png、面板即时特写|不是独立生成插画|
|实际页面截图|本机Chromium/Metal实页|previews/desktop-*.png、mobile-*.png、rotation-*.png|模型为本版本实际效果|
|favicon与页面装饰|原创SVG/CSS、真实HTML字体排版|assets/favicon.svg、styles.css|系统字体依设备提供|
|第四版与本次参考图|用户确认的项目参考|外部只读路径，不打包为三维资产|只用于参考，未修改或覆盖|
''')
d=perf['desktop'];m=perf['mobile'];s=d['sample']
verify=f'''# 精细版验证记录

2026-09-29。Chromium 151 headless，本机Apple M5，ANGLE Metal图形加速；桌面1440×900页面、地图视口{d['viewport']}，设备像素比1。手机为同一本机上的390×844独立页面与触摸事件模拟，**不是实机手机**。

## 已通过

- 六个正确中文标签在桌面/手机初始总览均可见，无相互重叠。
- 0°/90°/180°/270°及45°截图完成，标签不重叠，背面屋顶墙窗与廊道完整。
- 模型射线点击、标签点击和列表选择同一节点。
- 平移与水平旋转工作，拖动结束不误开面板。
- 按钮缩放及70%–240%边界、触摸模拟双指缩放。
- 复位、方向键、Home、空格激活、Esc关闭、浮层不触发地图快捷键。
- 关闭面板保持相机状态，列表触发后焦点返回可见的居所一览控件。
- 特写使用同一场景；渲染特写前后主地图PNG逐字节一致，状态不变。
- 手机页面无横向溢出，底部面板与缩放控件保留，列表折叠可展开。
- `?fallback`二维降级与场所列表可浏览。
- 页内无未捕获脚本错误或失败资源请求。
- 曲檐几何：连续曲面、有限坐标和法线、角檐起翘、屋脊高于屋面、范围完整。
- 池面层级射线确认：水面0.13 > 地面0.01 > 薄底座顶面-0.05。

浏览器脚本见tests/。其中记录本机bundled Playwright及临时Chromium路径，移机时需替换路径或使用标准Playwright安装。

## 性能实测

- 桌面首次场景搭建与初始渲染约{d['buildMs']:.1f}ms；单帧{d['drawCalls']}次绘制，约{d['triangles']:,}个三角面。
- 60帧连续旋转采样：平均帧间隔{s['meanFrameIntervalMs']:.2f}ms，采样帧率约{s['measuredFps']:.1f}fps。
- 每帧包含GPU完成与1像素同步读回：平均{s['meanRenderMs']:.2f}ms，最大{s['maxRenderMs']:.2f}ms。
- 手机尺寸独立初始化约{m['buildMs']:.1f}ms，单帧{m['drawCalls']}次绘制，约{m['triangles']:,}面。阴影1024、叶片与花瓣减半，桌面阴影2048。
- 首次未合并静态构件时268次绘制，本版为42次。采用实例化、同材质静态合并与按需渲染。
- 初期软件渲染条件下同步读回耗时约528ms，说明无硬件加速环境不适合高画质；不能把Metal结果推广到所有设备。

这些值只代表本机、当前分辨率、短时采样。手机帧率、触感、长时间内存与低端设备仍需真实设备验证。没有把浏览器CPU提交耗时误报为GPU帧率。原始统计见performance.json。

## 仍需审阅

参考图的植物自然度、山石雕琢、建筑组合与材质旧化尚有差距。默认取景、池形、植物密度和三屋田舍的美术取舍待用户确认。原著逐字校勘和菜品对应未完成；没有制作入口或真实AI服务。
'''
(p/'docs/design/verification.md').write_text(verify)
(p/'docs/design/visual-review.md').write_text('''# 设计评审记录

|日期|版本|实现与交付|状态|
|---|---|---|---|
|2026-09-29|地图UI v4|用户确认“清雅富贵”、假山收束、绿植减少与留白方向|已确认视觉基准；原文件未修改|
|2026-09-29|三维白模v2|六景、WebGL几何、平移缩放、独立水平旋转、面板与降级|保持原版供对照|
|2026-09-29|精细三维样板v1|曲檐瓦垄、窗棂木构、五间素木门、石阶院墙、竹蕉分枝花木、孔洞山石、三屋田舍、平滑水岸桥廊、材质纹理、真实场景特写、桌面/手机及五角度截图|**待用户审阅**；不继承v4的确认|

## 反馈与授权

用户要求调用相关skill对现有白模加工，并提供精细化要求与参考图；本次按该要求执行，没有重新询问已确认整体风格。此前选择固定俯视高度、另设360度旋转模式，继续保留。

## 本轮需确认

- 默认构图和六景体量；参考图细节接近程度。
- 竹林、花木与山石的疏密和自然度。
- 局部池面扩展、怡红院后门短接，以及稻香村三屋田舍组合。
- 手机标签、面板与阅读尺寸。

## 实测与边界

详见verification.md及performance.json；本机Apple M5 Metal硬件加速完成桌面旋转采样，手机仅为浏览器尺寸/触摸模拟。图片均为可运行场景截图，不使用生成图替代三维主场景。精细资产仍为程序化美术样板，不是原著精确复原。
''')
(p/'README.md').write_text('''# 红楼小灶 · 大观园精细三维样板 v1

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
''')
items=[('desktop-overview.png','桌面总览'),('desktop-panel.png','场所面板'),('mobile-overview.png','手机总览'),('mobile-panel.png','手机面板')]+[(f'rotation-{a}.png',label) for a,label in [('front','正面'),('right','右侧'),('back','背面'),('left','左侧'),('diagonal','斜侧')]]+[(f'closeup-{n["id"]}.png',n['name']+'特写') for n in data['nodes']]
html='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>大观园精细版画廊</title><style>body{margin:0;padding:26px;background:#f5eddf;color:#493a2b;font-family:"Songti SC",serif}a{color:#7c303e}h1{font-size:28px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}figure{margin:0;background:#fff9ed;border:1px solid #b29058;padding:10px}img{width:100%;height:290px;object-fit:contain}figcaption{padding:12px;text-align:center}p{line-height:1.8}</style></head><body><h1>大观园 · 精细三维样板</h1><p><a href="/garden">打开可操作地图</a>　首版六景，艺术化布局；本页均为实际三维场景与网页截图，待审阅。</p><main>'''
for name,title in items:html+=f'<figure><a href="previews/{name}"><img src="previews/{name}" alt="{title}" loading="lazy"></a><figcaption>{title}</figcaption></figure>'
html+='</main></body></html>';(p/'gallery.html').write_text(html)
plan=p/'docs/superpowers/plans/2026-09-29-garden-detail.md';plan.write_text(plan.read_text().replace('- [ ]','- [x]'))
