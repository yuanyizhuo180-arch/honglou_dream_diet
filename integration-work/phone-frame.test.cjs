const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={URL,window:{}};vm.runInNewContext(fs.readFileSync('integration-work/mobile-source/phone-core.js','utf8'),context);const core=context.window.HonglouPhone;
assert.equal(core.isPhone({userAgent:'Mozilla iPhone Mobile',maxTouchPoints:5},true),true);
assert.equal(core.isPhone({userAgent:'Mozilla Macintosh',maxTouchPoints:0},false),false);
assert.equal(core.isPhone({userAgent:'Mozilla Macintosh',maxTouchPoints:5},true),false);
for(const [w,h]of [[390,844],[844,390],[667,375],[375,667],[844,340]]){const a=core.fit(w,h);assert.equal(a.angle,90);assert.equal(a.width,h);assert.equal(a.height,w);assert.equal(a.scale,1);}
assert.equal(core.safePage('//external.example/','http://localhost:5183'),'/');assert.equal(core.safePage('/catalog/#entity=FOOD-0002','http://localhost:5183'),'/catalog/#entity=FOOD-0002');
console.log('PASS 固定右转90°、宽高互换铺满、手机识别及站内路径');
