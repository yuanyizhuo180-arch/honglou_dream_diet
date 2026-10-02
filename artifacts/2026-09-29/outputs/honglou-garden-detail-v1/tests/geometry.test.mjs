import assert from 'node:assert/strict';
import { roofGeometry, roofPoint } from '../geometry.js';
const g=roofGeometry(20,14,4);const p=g.getAttribute('position'),n=g.getAttribute('normal');
assert.ok(p.count>80,'屋顶须是连续曲面');assert.ok(g.index.count>300);
for(let i=0;i<p.count;i++){assert.ok([p.getX(i),p.getY(i),p.getZ(i),n.getX(i),n.getY(i),n.getZ(i)].every(Number.isFinite));}
assert.ok(roofPoint(10,7,20,14,4)[1]>roofPoint(0,6,20,14,4)[1],'角檐高于中段檐口');
assert.ok(roofPoint(0,0,20,14,4)[1]>roofPoint(0,6,20,14,4)[1],'屋脊高于屋面');
g.computeBoundingBox();assert.ok(g.boundingBox.max.x>=10&&g.boundingBox.min.x<=-10);assert.ok(g.boundingBox.max.z>=7&&g.boundingBox.min.z<=-7);
console.log('PASS: continuous curved roof, finite geometry/normals, uplifted eaves, complete bounds');
