import assert from 'node:assert/strict';
const path='../view.js';let module;try{module=await import(path)}catch{}
assert.ok(module,'图片地图视图模块尚未实现');
const {View}=module;const v=new View(1000,600);v.resize(600,400);assert.equal(v.zoom,1);assert.deepEqual(v.center,[.5,.5]);
v.scale(2,300,200);assert.equal(v.zoom,2);v.pan(90,0);const before=v.point(240,200);v.scale(1.2,240,200);assert.ok(Math.abs(before[0]-v.point(240,200)[0])<1e-8,'指针处图像位置不变');
const c=[...v.center],z=v.zoom;v.resize(500,400);assert.deepEqual(v.center,c);assert.equal(v.zoom,z);v.pan(100000,100000);assert.ok(v.center.every(x=>x>=0&&x<=1));v.reset();assert.equal(v.zoom,1);assert.deepEqual(v.center,[.5,.5]);console.log('视图缩放、锚点、边界、复位验证通过');
