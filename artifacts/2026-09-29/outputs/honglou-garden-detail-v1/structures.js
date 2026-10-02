import * as T from './vendor/three.module.js';
import {roofGeometry,roofPoint,seeded} from './geometry.js';
export function buildRoof(b,x,z,w,d,h,rise=3.4,mat='roof',id,angle=0){
 const transform=(p)=>[x+p[0]*Math.cos(angle)+p[2]*Math.sin(angle),h+p[1],z-p[0]*Math.sin(angle)+p[2]*Math.cos(angle)];
 const geo=roofGeometry(w,d,rise);geo.rotateY(angle);b.add(geo,mat,[x,h,z],id);
 const under=geo.clone();const a=under.getAttribute('position');for(let i=0;i<a.count;i++)a.setY(i,a.getY(i)-.22);const ix=under.index.array;for(let i=0;i<ix.length;i+=3){const q=ix[i];ix[i]=ix[i+2];ix[i+2]=q}under.computeVertexNormals();b.add(under,'darkwood',[x,h,z],id);
 for(const side of [-1,1]){const pts=[];for(let i=0;i<=16;i++)pts.push(transform(roofPoint((i/16-.5)*w,side*d/2,w,d,rise)));b.curve(pts,mat,.14,id)}
 for(const side of [-1,1]){const pts=[];for(let j=0;j<=12;j++)pts.push(transform(roofPoint(side*w/2,(j/12-.5)*d,w,d,rise)));b.curve(pts,mat,.12,id)}
 const ridge=[];for(let i=0;i<=16;i++)ridge.push(transform(roofPoint((i/16-.5)*w*.77,0,w,d,rise).map((v,k)=>k===1?v+.17:v)));b.curve(ridge,mat,.17,id);
 // Individual rounded tile ridges are instanced, not one draw call per tile.
 const rows=Math.floor(w/.66);for(let i=0;i<=rows;i++){const xx=(i/rows-.5)*w;for(const sign of [-1,1])for(let j=0;j<7;j++){const z1=sign*d/2*j/7,z2=sign*d/2*(j+1)/7;const A=roofPoint(xx,z1,w,d,rise),B=roofPoint(xx,z2,w,d,rise);A[1]+=.065;B[1]+=.065;b.rod(transform(A),transform(B),mat==='thatch'?.034:.058,mat,id)}}
 if(mat==='thatch'){for(let i=0;i<w*6;i++){const xx=(i/(w*6)-.5)*w;b.rod(transform([xx,.35,d/2-.35]),transform([xx,.1,d/2+.35]),.02,'thatch')}}
 for(const sign of [-1,1]){const p=transform(roofPoint(sign*w*.37,0,w,d,rise));b.instance('sphere',mat,[p[0],p[1]+.45,p[2]],[.24,.38,.24],[0,0,0],id)}
}
function windowPanel(b,x,z,w,h,y,side,id){const rot=side==='side'?Math.PI/2:0;const X=(dx,dz)=>[x+dx*Math.cos(rot)+dz*Math.sin(rot),z-dx*Math.sin(rot)+dz*Math.cos(rot)];
 const p=X(0,0);b.instance('box','glass',[p[0],y+h/2,p[1]],[w,.08,h],[Math.PI/2,0,rot],id);
 for(const dx of [-w/2,w/2]){const q=X(dx,.08);b.box(q[0],q[1],.12,.15,h,'darkwood',y,id)}
 for(const yy of [0,h]){const A=X(-w/2,.08),B=X(w/2,.08);b.beam(A,B,.15,.12,'wood',y+yy,id)}
 const cell=.5;for(let dx=-w/2+cell;dx<w/2;dx+=cell){const q=X(dx,.1);b.box(q[0],q[1],.06,.06,h,'wood',y,id)}
 for(let yy=.5;yy<h;yy+=.5){b.beam(X(-w/2,.1),X(w/2,.1),.055,.055,'wood',y+yy,id)}
 // Diagonal top lattice, restrained in the same timber palette.
 for(let k=0;k<Math.floor(w/.65);k++){const q=X(-w/2+.3+k*.65,.1),r=X(-w/2+.62+k*.65,.1);b.rod([q[0],y+h-.7,q[1]],[r[0],y+h-.35,r[1]],.025,'wood',id)}
}
export function buildHouse(b,x,z,w,d,h,id,style='house'){
 const thatch=style.startsWith('farm'),pavilion=style==='pavilion';const base=pavilion?1.45:.65;const wall=thatch?'mud':'wall';
 b.box(x,z,w+1.4,d+1.4,.55,'stone',base-.55,id);b.box(x,z,w+.6,d+.6,.15,'path',base,id);
 if(!pavilion){b.box(x,z,w,d,h,wall,base,id);b.box(x,z,w+.2,d+.2,.38,'stone',base,id)}
 const front=z+d/2+.08;
 for(const zz of pavilion?[z-d/2,front]:[front]){
  for(let dx=-w/2;dx<=w/2+.1;dx+=w/4){b.box(x+dx,zz,.32,.32,h,'wood',base,id);b.box(x+dx,zz,.55,.55,.18,'stone',base,id);b.box(x+dx,zz,.65,.43,.17,'wood',base+h-.6,id);b.box(x+dx,zz,.45,.6,.15,'wood',base+h-.85,id)}
  b.beam([x-w/2,zz],[x+w/2,zz],.32,.4,'wood',base+h-.35,id);
  for(let dx=-w/2+w/8;dx<w/2;dx+=w/4){if(!pavilion&&Math.abs(dx)<w/7)continue;windowPanel(b,x+dx,zz+.15,w/4-.65,pavilion?2.9:3.2,base+1.7,'front',id)}
 }
 if(!pavilion){for(const zz of [z-d/2-.08])for(const dx of [-w/4,w/4])windowPanel(b,x+dx,zz,w/3,2.8,base+2,'front',id);for(const xx of [x-w/2-.06,x+w/2+.06])windowPanel(b,xx,z,d*.6,2.7,base+2,'side',id);
 b.box(x,front+.12,2.6,.2,h*.8,'darkwood',base,id);for(const dx of [-.67,.67]){b.box(x+dx,front+.25,1.2,.18,h*.72,'wood',base,id);b.box(x+dx,front+.38,.8,.07,h*.4,'darkwood',base+.6,id);for(let k=0;k<3;k++)b.box(x+dx,front+.44,.75,.06,.05,'wood',base+1+k*.65,id)}for(const dx of [-.18,.18])b.instance('torus','wood',[x+dx,base+2.2,front+.49],[.09,.09,.09],[0,0,0],id);
 if(style!=='farm-shed')for(let i=0;i<3;i++)b.box(x,z+d/2+1+i*.5,3.8,1.4,.17,'stone',.05+(2-i)*.17,id);
 }
 if(pavilion){for(const dx of [-w/2,w/2])for(const dz of [-d/2,d/2])b.box(x+dx,z+dz,.36,.36,h,'wood',base,id);for(const dx of [-w/2,w/2]){b.beam([x+dx,z-d/2],[x+dx,z+d/2],.3,.28,'wood',base+h-.3,id);for(const zz of [z-d/4,z+d/4])windowPanel(b,x+dx,zz,d/2-.6,2.9,base+2,'side',id)}
 for(const zz of [z-d/2,z+d/2]){b.beam([x-w/2,zz],[x+w/2,zz],.18,.15,'wood',base+1.2,id);for(let dx=-w/2;dx<=w/2;dx+=.65)b.box(x+dx,zz,.065,.09,1.2,'wood',base,id)}for(const dx of [-w/2,w/2])b.beam([x+dx,z-d/2],[x+dx,z+d/2],.2,.13,'wood',base+1.2,id);for(const dx of [-w*.35,w*.35])for(const dz of [-d*.35,d*.35])b.box(x+dx,z+dz,.45,.45,1.4,'stone',0,id);
 }
 b.box(x,z,w+.5,d+.5,.22,'darkwood',base+h-.08,id);buildRoof(b,x,z,w+3,d+3,base+h,thatch?2.7:3.8,thatch?'thatch':'roof',id);
}
export function wallSegment(b,a,c,h=2.8,mat='wall',gate=false){if(mat==='mud'){const length=Math.hypot(c[0]-a[0],c[1]-a[1]),steps=Math.ceil(length/1.5);for(let i=0;i<steps;i++){const A=[a[0]+(c[0]-a[0])*i/steps,a[1]+(c[1]-a[1])*i/steps],B=[a[0]+(c[0]-a[0])*(i+1)/steps,a[1]+(c[1]-a[1])*(i+1)/steps];b.beam(A,B,.7,h+.07*Math.sin(A[0]*1.1+A[1]),mat,.12)}}else b.beam(a,c,.65,h,mat,.12);b.beam(a,c,.9,.27,'stone',0);if(mat==='wall'){b.beam(a,c,.9,.14,'roof',h+.12);const len=Math.hypot(c[0]-a[0],c[1]-a[1]);for(let j=0;j<len;j+=.55){const t=j/len,x=a[0]+(c[0]-a[0])*t,z=a[1]+(c[1]-a[1])*t;const theta=Math.atan2(c[0]-a[0],c[1]-a[1]);b.instance('cyl','roof',[x,h+.35,z],[.24,.85,.24],[Math.PI/2,0,-theta]);}}}
function court(b,n){const [x,z]=n.position,[w,d]=n.footprint;const W=w+10,D=d+12,mat=n.id==='daoxiang'?'mud':'wall',h=n.id==='daoxiang'?1.5:2.6;
 b.box(x,z,W,D,.08,'path',.03);const corners=[[x-W/2,z-D/2],[x+W/2,z-D/2],[x+W/2,z+D/2],[x-W/2,z+D/2]];if(n.id==='yihong'){wallSegment(b,corners[0],[x-2,z-D/2],h,mat);wallSegment(b,[x+2,z-D/2],corners[1],h,mat);buildRoof(b,x,z-D/2,5.5,2.7,3.15,1,'roof')}else if(n.id==='xiaoxiang'){wallSegment(b,corners[0],[x-10.5,z-D/2],h,mat);wallSegment(b,[x-7.5,z-D/2],corners[1],h,mat);b.beam([x-10.5,z-D/2],[x-7.5,z-D/2],.7,h-1.25,mat,1.37);b.beam([x-10.5,z-D/2],[x-7.5,z-D/2],.9,.2,'roof',h+.12)}else wallSegment(b,corners[0],corners[1],h,mat);wallSegment(b,corners[0],corners[3],h,mat);if(n.id==='xiaoxiang'){wallSegment(b,corners[1],[x+W/2,-1.2],h,mat);wallSegment(b,[x+W/2,1.2],corners[2],h,mat);b.beam([x+W/2,-1.2],[x+W/2,1.2],.7,h-1.2,mat,1.32);b.beam([x+W/2,-1.2],[x+W/2,1.2],.9,.2,'roof',h+.12)}else wallSegment(b,corners[1],corners[2],h,mat);wallSegment(b,corners[3],[x-2,z+D/2],h,mat);wallSegment(b,[x+2,z+D/2],corners[2],h,mat);
 for(const dx of [-2,2]){b.box(x+dx,z+D/2,.65,.7,3.2,'wall',0);b.box(x+dx,z+D/2,.85,.8,.28,'stone')}
 if(n.id!=='daoxiang')buildRoof(b,x,z+D/2,5.5,2.7,3.15,1,'roof');
}
export function corridor(b,x,z,length,angle=0,id){const width=2.4;const A=[x-Math.sin(angle)*length/2,z-Math.cos(angle)*length/2],B=[x+Math.sin(angle)*length/2,z+Math.cos(angle)*length/2];b.beam(A,B,width,.35,'stone',.1,id);for(let t=-length/2;t<=length/2;t+=3){for(const s of [-1,1]){const xx=x+Math.sin(angle)*t+Math.cos(angle)*s*width*.4,zz=z+Math.cos(angle)*t-Math.sin(angle)*s*width*.4;b.box(xx,zz,.18,.18,3.3,'wood',.4,id)}}buildRoof(b,x,z,length+1,width+1.1,3.7,1.1,'roof',id,Math.PI/2-angle)}
export function buildResidence(b,n){const [x,z]=n.position,[w,d]=n.footprint,id=n.id;const h=n.height*.73;if(id!=='ouxiang')court(b,n);if(id==='daoxiang'){buildHouse(b,x,z-3,11,7,h,id,'farm');for(const side of [-1,1])buildHouse(b,x+side*7.5,z+6,5,5,3.1,id,'farm-shed')}else buildHouse(b,x,z-(id==='ouxiang'?0:2.2),w,d,h,id,id==='ouxiang'?'pavilion':'house');
 if(id==='xiaoxiang'){corridor(b,x+w/2+2.6,z,12,0,id);corridor(b,x+6,z-9,8,Math.PI/2,id)}
 if(id==='yihong'){for(const side of [-1,1])corridor(b,x+side*(w/2+2.5),z,14,0,id)}
 if(id==='qiushuang'){corridor(b,x+12,z-3,12,0,id)}
 if(id==='hengwu'){corridor(b,x-10,z-2,9,0,id)}
 if(id==='daoxiang'){b.instance('cyl','stone',[x+12,1,z+10],[2.2,2,2.2]);b.instance('cyl','darkwood',[x+12,2.02,z+10],[1.5,.08,1.5]);for(let j=0;j<16;j++)b.box(x-13+j*1.65,z+15,.11,.11,1.65,'bamboostem');b.beam([x-13,z+15],[x+13,z+15],.13,.12,'bamboo',1.2);for(let i=0;i<4;i++){b.box(x-9+i*4,z+11,2.8,4.7,.18,'field',.15);for(let j=0;j<5;j++)b.beam([x-10.3+i*4,z+9+j],[x-7.7+i*4,z+9+j],.15,.17,'herb',.32)}}
}
export function buildEntrance(b){const x=0,z=65; b.box(x,z,33,8,.6,'stone');for(let i=0;i<4;i++)b.box(x,z+4+i*.5,34+i*.4,1.4,.15,'stone',.45-i*.1);
 for(const xx of [-15,-9,-3,3,9,15]){b.box(xx,z,.6,.6,6,'wood',.6);b.box(xx,z,.85,.85,.25,'stone',.55)}
 for(const xx of [-12,-6,6,12]){b.box(xx,z,5.25,.18,4.6,'darkwood',.65);for(const dx of [-1.35,1.35])windowPanel(b,xx+dx,z+.16,2.2,2.7,1.8,'front')}
 b.beam([-15,z],[15,z],.5,.48,'wood',6.1);buildRoof(b,0,z,34,7.5,6.7,3,'roof');
 for(const xx of [-17,17]){b.box(xx,z,3,.8,4,'wall');buildRoof(b,xx,z,3.8,2,4.1,.8)}
}
