# 资产与许可

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
