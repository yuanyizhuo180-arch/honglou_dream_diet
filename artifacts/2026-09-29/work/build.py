import json,pathlib
p=pathlib.Path('outputs/honglou-white-v2')
d=json.loads((p/'garden-data.json').read_text())
# screen-aligned x/z coordinates, orthographic front view
positions=[[-38,-8,0],[-34,24,0],[0,-37,0],[37,-28,0],[34,32,0],[48,4,0]]
for n,pos in zip(d['nodes'],positions):n['position']=pos
# Paths meet forecourt doors, never building centres.
d['walkways']=[{'id':'entry','points':[[0,65],[-13,57],[-13,37],[-18,32]]},{'id':'short','points':[[-34,33],[-47,33],[-52,9],[-38,1]]},{'id':'main','points':[[-18,32],[-18,9],[-16,-13],[0,-24],[0,-27]]},{'id':'west','points':[[-38,1],[-27,4],[-18,9]]},{'id':'rear','points':[[0,-24],[24,-18],[37,-18]]},{'id':'right','points':[[37,-18],[64,-18],[64,4],[64,22],[34,42]]},{'id':'pavilion','bridge':True,'points':[[64,4],[58,4],[54,8],[48,8]]},{'id':'bamboo-bridge','bridge':True,'points':[[48,-1],[48,-10],[64,-10]]},{'id':'return','points':[[34,42],[24,46],[12,54],[0,65]]}]
d['waterway']=[{'id':'inlet','kind':'inlet','points':[[-62,-54],[-54,-43],[-50,-30],[-46,-22]]},{'id':'bamboo-stream','kind':'stream','points':[[-46,-22],[-43,-12],[-39,-6],[-34,-3],[-26,0]]},{'id':'branch-east','kind':'branch','points':[[-26,0],[-8,0],[6,5],[20,3],[26,0]]},{'id':'branch-south','kind':'branch','points':[[-26,0],[-23,15],[-7,23],[14,19],[28,14]]},{'id':'pavilion-pool','kind':'pool','points':[[26,0],[31,-8],[49,-10],[59,-2],[59,13],[48,20],[28,14],[23,7],[26,0]]},{'id':'merge','kind':'merge','points':[[48,20],[54,27],[58,34]]},{'id':'outlet','kind':'outlet','points':[[58,34],[60,48],[63,60],[68,66]]}]
for w in d['walkways']:w.pop('length',None)
d['version']='white-model-v2';(p/'garden-data.json').write_text(json.dumps(d,ensure_ascii=False,indent=2))
# SVG uses same coordinates.
svg=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 920"><rect width="960" height="920" fill="#f6f0e5"/><text x="50" y="52" font-size="28" fill="#793b49">红楼小灶 · 六景布局</text><text x="50" y="80" font-size="14">艺术化坐标 · 上方为画面后部，不代表原著北方</text><g transform="translate(470 435) scale(5)">']
def pts(a):return ' '.join(f'{x},{z}' for x,z,*_ in a)
svg+=['<rect x="-70" y="-62" width="140" height="132" fill="#e9e2d4" stroke="#baa985" stroke-width=".5"/>']
for w in d['waterway']:svg.append(f'<{ "polygon" if w["kind"]=="pool" else "polyline"} points="{pts(w["points"])}" fill="{ "#abc8c4" if w["kind"]=="pool" else "none"}" stroke="#84ada9" stroke-width="2.6" stroke-linejoin="round"/>')
for w in d['walkways']:svg.append(f'<polyline points="{pts(w["points"])}" fill="none" stroke="{ "#8d7155" if w.get("bridge") else "#c9b78e"}" stroke-width="1.8" stroke-linejoin="round"/>')
for n in d['nodes']:
 x,z,_=n['position'];w,h=n['footprint'];svg.append(f'<rect x="{x-w/2}" y="{z-h/2}" width="{w}" height="{h}" fill="#faf6ee" stroke="#69685e" stroke-width=".5"/><text x="{x}" y="{z+1}" text-anchor="middle" font-size="3.3">{n["name"]}</text>')
svg+=['<ellipse cx="0" cy="45" rx="8" ry="5" fill="#96978e"/><text x="0" y="47" text-anchor="middle" font-size="3">假山</text><rect x="-12" y="63" width="24" height="4" fill="#967758"/><text x="0" y="74" text-anchor="middle" font-size="3.4">素木园门</text><path d="M0 64V50" stroke="#873f49" stroke-width=".5" stroke-dasharray="1 1"/><text x="4" y="57" font-size="2.4">地面视线止于山石</text></g><g font-size="16" fill="#433f36"><text x="55" y="850">水系：入水 → 竹院曲溪 → 两支 → 局部池面 → 汇流 → 出水</text><text x="55" y="879">浅金：步行路径　褐色：桥廊　灰：建筑 / 障景　水绿：连续水系</text></g></svg>']
(p/'docs/design/garden-layout.svg').write_text(''.join(svg))
