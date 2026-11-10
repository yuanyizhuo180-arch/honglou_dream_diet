(() => {
 const init=()=>{
  const notify=()=>parent.postMessage({type:'honglou:page',page:location.pathname+location.search+location.hash,title:document.title},location.origin);
  for(const method of ['pushState','replaceState']){const original=history[method].bind(history);history[method]=(...args)=>{const result=original(...args);notify();return result;};}
  window.addEventListener('hashchange',notify);window.addEventListener('popstate',notify);notify();
  if(document.documentElement){
   document.addEventListener('pointerdown',e=>document.documentElement.classList.toggle('phone-touch-input',e.pointerType==='touch'||e.pointerType==='pen'),true);
   document.addEventListener('keydown',()=>document.documentElement.classList.remove('phone-touch-input'),true);
  }
  const column=document.getElementById('game-column'),zone=document.getElementById('play-zone'),catchZone=document.getElementById('catch-zone');
  if(!column||!zone||!catchZone)return;
  // A uniform world transform preserves object proportions and logical game rules.
  if(document.body){
   const header=document.querySelector('.game-header');
   const world=()=>{const scale=Math.min(1,innerWidth/960);document.body.style.setProperty('--catch-world-scale',scale);document.body.style.setProperty('--catch-world-width',innerWidth/scale+'px');document.body.style.setProperty('--catch-world-height',innerHeight/scale+'px');if(header)column.style.setProperty('--catch-play-top',header.offsetTop+header.offsetHeight+10+'px');};
   window.addEventListener('resize',world);if(header)new ResizeObserver(world).observe(header);world();
  }
  let active=null;
  const enabled=()=>document.getElementById('modal')?.hidden && document.getElementById('pause')?.getAttribute('aria-pressed')!=='true';
  const end=e=>{if(active===null||(e?.pointerId!==undefined&&e.pointerId!==active))return;const id=active;active=null;if(column.hasPointerCapture(id))column.releasePointerCapture(id);};
  // Native iframe hit testing converts scaled screen touches to logical coordinates.
  const forward=e=>zone.dispatchEvent(new PointerEvent('pointermove',{clientX:e.clientX,clientY:e.clientY,pointerId:e.pointerId,pointerType:e.pointerType,bubbles:true}));
  column.addEventListener('pointerdown',e=>{
   if(e.target.closest('button,a,.game-header')||!enabled()||active!==null||(e.pointerType==='mouse'&&e.button!==0))return;
   active=e.pointerId;column.setPointerCapture(active);e.preventDefault();forward(e);
  });
  column.addEventListener('pointermove',e=>{
   if(e.pointerId!==active||!enabled()||e.target===zone)return;
   forward(e);
  });
  for(const name of ['pointerup','pointercancel','lostpointercapture'])column.addEventListener(name,end);
  window.addEventListener('blur',()=>end());
  const hint=document.querySelector('.control-hint');if(hint)hint.textContent='拖动碟子接物 · 鼠标或方向键亦可操作';
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
