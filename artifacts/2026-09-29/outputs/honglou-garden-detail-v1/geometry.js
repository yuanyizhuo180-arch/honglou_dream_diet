import * as T from './vendor/three.module.js';
export function roofPoint(x,z,w,d,rise){
 const a=Math.abs(z)/(d/2),b=Math.abs(x)/(w/2);const hip=Math.max(a,Math.max(0,(b-.65)/.35)*.78);const t=Math.min(1,hip);
 const y=rise*Math.pow(1-t,1.65)+.45*Math.pow(t,8)+.7*Math.pow(a*b,6);
 return [x,y,z];
}
export function roofGeometry(w,d,rise){const nx=24,nz=16,positions=[],uv=[],indices=[];
 for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){const x=(i/nx-.5)*w,z=(j/nz-.5)*d;positions.push(...roofPoint(x,z,w,d,rise));uv.push(i/nx,j/nz)}
 for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+1;indices.push(a,c,b,b,c,c+1)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
export function seeded(seed=81){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
export function leafGeometry(){const p=[],uv=[],index=[];for(let i=0;i<=6;i++){const t=i/6,v=Math.sin(Math.PI*t)*.36;for(const sign of [-1,1]){p.push(sign*v,Math.sin(Math.PI*t)*.15,t);uv.push(sign<0?0:1,t)}}for(let i=0;i<6;i++){const a=i*2;index.push(a,a+1,a+2,a+1,a+3,a+2)}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(index);g.computeVertexNormals();return g}
export function createBuilder(scene,materials,{mobile=false}={}){
 const geometries={box:new T.BoxGeometry(1,1,1),cyl:new T.CylinderGeometry(.5,.5,1,7),sphere:new T.SphereGeometry(1,10,7),leaf:leafGeometry(),torus:new T.TorusGeometry(1,.22,7,15)};
 const batches=new Map(),pickables=[],counts={},staticMeshes=[],attempts={};const dummy=new T.Object3D();
 function instance(type,mat,pos,scale,rotation=[0,0,0],id){attempts[type]=(attempts[type]||0)+1;if(mobile&&['leaf','petal'].includes(type)&&attempts[type]%2===0)return;const key=type+':'+mat;let b=batches.get(key);if(!b){b={geo:geometries[type],mat:materials[mat],items:[]};batches.set(key,b)}b.items.push({pos,scale,rotation,id});counts[type]=(counts[type]||0)+1;}
 function box(x,z,w,d,h,mat='wall',y=0,id){instance('box',mat,[x,y+h/2,z],[w,h,d],[0,0,0],id)}
 function rod(a,b,r,mat='wood',id){const A=new T.Vector3(...a),B=new T.Vector3(...b),v=B.clone().sub(A);const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize());const e=new T.Euler().setFromQuaternion(q);instance('cyl',mat,A.add(B).multiplyScalar(.5).toArray(),[r*2,v.length(),r*2],[e.x,e.y,e.z],id)}
 function beam(a,b,width,height,mat='wood',y=0,id){const dx=b[0]-a[0],dz=b[1]-a[1];instance('box',mat,[(a[0]+b[0])/2,y+height/2,(a[1]+b[1])/2],[width,height,Math.hypot(dx,dz)],[0,Math.atan2(dx,dz),0],id)}
 function add(geometry,mat,pos=[0,0,0],id){const m=new T.Mesh(geometry,materials[mat]);m.position.set(...pos);m.castShadow=!['water','ground','path'].includes(mat);m.receiveShadow=true;if(id){m.userData.id=id;pickables.push(m)}scene.add(m);staticMeshes.push(m);return m}
 function curve(points,mat='wood',radius=.1,id){const c=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return add(new T.TubeGeometry(c,Math.max(12,points.length*4),radius,5,false),mat,[0,0,0],id)}
 function flush(){
  pickables.length=0;const byMaterial=new Map();
  for(const m of staticMeshes){scene.remove(m);m.updateMatrix();const geo=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();geo.applyMatrix4(m.matrix);const key=m.material.name;let group=byMaterial.get(key);if(!group){group={material:m.material,geometries:[],ids:[]};byMaterial.set(key,group)}group.geometries.push(geo);group.ids.push(m.userData.id);}
  for(const g of byMaterial.values()){let total=0;for(const geo of g.geometries)total+=geo.getAttribute('position').count;const positions=new Float32Array(total*3),normals=new Float32Array(total*3),uvs=new Float32Array(total*2),ids=[];let offset=0;
   g.geometries.forEach((geo,i)=>{const p=geo.getAttribute('position'),n=geo.getAttribute('normal'),uv=geo.getAttribute('uv');positions.set(p.array,offset*3);if(n)normals.set(n.array,offset*3);if(uv)uvs.set(uv.array,offset*2);for(let j=0;j<p.count/3;j++)ids.push(g.ids[i]);offset+=p.count;geo.dispose()});
   const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('normal',new T.BufferAttribute(normals,3));geometry.setAttribute('uv',new T.BufferAttribute(uvs,2));const m=new T.Mesh(geometry,g.material);m.userData.faceIds=ids;m.castShadow=!['water','ground','path','sand'].includes(g.material.name);m.receiveShadow=true;scene.add(m);if(ids.some(Boolean))pickables.push(m);
  }
  for(const b of batches.values()){const m=new T.InstancedMesh(b.geo,b.mat,b.items.length);const ids=[];b.items.forEach((i,k)=>{dummy.position.set(...i.pos);dummy.scale.set(...i.scale);dummy.rotation.set(...i.rotation);dummy.updateMatrix();m.setMatrixAt(k,dummy.matrix);ids[k]=i.id});m.instanceMatrix.needsUpdate=true;m.castShadow=!['water','ground','path','moss','glass'].includes(b.mat.name);m.receiveShadow=true;m.userData.ids=ids;if(ids.some(Boolean))pickables.push(m);m.computeBoundingSphere();scene.add(m)}return {pickables,counts,batches:batches.size}}
 return {instance,box,rod,beam,add,curve,flush,scene,materials,register:(name,geometry)=>{geometries[name]=geometry}};
}
