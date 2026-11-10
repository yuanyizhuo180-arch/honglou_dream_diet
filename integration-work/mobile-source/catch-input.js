// Shared by all three catch games. Coordinates use the rendered (scaled) surface.
window.bindCatchInput = function ({surface, rect, enabled, move}) {
 let active = null;
 const update = e => {if(enabled()){const r=rect();if(r.width>0)move((e.clientX-r.left)/r.width);}};
 const release = e => {
  if(active===null || (e?.pointerId!==undefined && e.pointerId!==active))return;
  const id=active; active=null;
  if(surface.hasPointerCapture(id))surface.releasePointerCapture(id);
 };
 surface.addEventListener('pointerdown',e=>{
  if(e.target?.closest('button,a,.game-header'))return;
  if(!enabled() || (e.pointerType==='mouse'&&e.button!==0) || active!==null)return;
  active=e.pointerId;surface.setPointerCapture(active);e.preventDefault();update(e);
 });
 surface.addEventListener('pointermove',e=>{
  if(e.pointerType==='mouse'||e.pointerId===active)update(e);
 });
 for(const type of ['pointerup','pointercancel','lostpointercapture'])surface.addEventListener(type,release);
 window.addEventListener('blur',()=>release());
 window.addEventListener('honglou:orientation',()=>release());
};
