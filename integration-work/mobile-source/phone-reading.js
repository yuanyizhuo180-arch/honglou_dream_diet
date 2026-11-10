// Coordinates are already in the rotated document's own CSS-pixel space.
window.bindPhoneReadingScroll = function (doc) {
 const root=doc.documentElement,view=doc.defaultView||window;
 let drag=null,suppressUntil=0,momentum=0;
 const now=()=>performance.now();
 const stop=()=>{if(momentum&&view.cancelAnimationFrame)view.cancelAnimationFrame(momentum);momentum=0;};
 function scroller(target){
  for(let el=target;el&&el!==root;el=el.parentElement){const style=view.getComputedStyle(el);if(/auto|scroll/.test(style.overflowY)&&el.scrollHeight>el.clientHeight+1)return el;}
  return doc.scrollingElement||root;
 }
 const scroll=(el,amount)=>{const before=el.scrollTop;el.scrollTop=Math.max(0,Math.min(el.scrollHeight-el.clientHeight,before+amount));return el.scrollTop!==before;};
 function record(d,y,t){
  const last=d.samples[d.samples.length-1];
  if(last.t===t)last.y=y;else d.samples.push({t,y});
  while(d.samples.length>2&&d.samples[1].t<t-100)d.samples.shift();
 }
 function move(d,y,t){
  const delta=d.lastY-y;
  if(Math.abs(delta)>.2)d.lastMotion=t;
  scroll(d.el,delta);d.lastY=y;record(d,y,t);
 }
 function end(e,cancel=false){
  if(!drag||(e?.pointerId!==undefined&&e.pointerId!==drag.id))return;
  const d=drag,t=now();drag=null;
  if(!cancel&&d.moved&&Number.isFinite(e?.clientY))move(d,e.clientY,t);
  root.classList.remove('phone-reading-dragging');
  if(root.hasPointerCapture(d.id))root.releasePointerCapture(d.id);
  // Consume the compatibility click from this gesture, not a new deliberate tap.
  if(d.moved)suppressUntil=t+250;
  const first=d.samples[0],last=d.samples[d.samples.length-1];
  let velocity=last.t>first.t?(first.y-last.y)/(last.t-first.t):0;
  if(t-d.lastMotion>90)velocity=0;
  velocity=Math.max(-3,Math.min(3,velocity));
  if(!cancel&&d.moved&&d.type!=='mouse'&&Math.abs(velocity)>.08&&view.requestAnimationFrame){
   let previous=t;const decayTime=240;
   const step=time=>{
    const dt=Math.min(48,Math.max(1,time-previous));previous=time;
    const decay=Math.exp(-dt/decayTime),distance=velocity*decayTime*(1-decay);
    if(!scroll(d.el,distance)||Math.abs(velocity)<.02){momentum=0;return;}
    velocity*=decay;momentum=view.requestAnimationFrame(step);
   };
   momentum=view.requestAnimationFrame(step);
  }
 }
 doc.addEventListener('pointerdown',e=>{
  stop();suppressUntil=0;
  if(drag){end(undefined,true);return;}
  if((e.pointerType==='mouse'&&e.button!==0)||e.target?.closest?.('input,textarea,select,[contenteditable="true"]'))return;
  const t=now(),interactive=!!e.target?.closest?.('button,a,[role="button"]');
  drag={id:e.pointerId,type:e.pointerType,y:e.clientY,lastY:e.clientY,lastMotion:t,el:scroller(e.target),moved:false,threshold:interactive||e.pointerType==='mouse'?4:2,samples:[{t,y:e.clientY}]};
 },true);
 doc.addEventListener('pointermove',e=>{
  const d=drag;if(!d||d.id!==e.pointerId)return;
  if(!d.moved){if(Math.abs(e.clientY-d.y)<d.threshold)return;d.moved=true;root.setPointerCapture(d.id);root.classList.add('phone-reading-dragging');}
  move(d,e.clientY,now());e.preventDefault();
 },{passive:false,capture:true});
 doc.addEventListener('pointerup',e=>end(e),true);
 doc.addEventListener('pointercancel',e=>end(e,true),true);
 doc.addEventListener('lostpointercapture',e=>end(e,true),true);
 doc.addEventListener('click',e=>{if(now()<suppressUntil&&(e.detail!==0||e.pointerType==='touch')){e.preventDefault();e.stopImmediatePropagation();}},true);
 doc.addEventListener('dragstart',e=>e.preventDefault());
 doc.addEventListener('wheel',stop,{passive:true});doc.addEventListener('keydown',stop,true);
 const cancel=()=>{stop();end(undefined,true);};
 for(const event of ['blur','resize','hashchange','popstate'])view.addEventListener?.(event,cancel);
};
(() => {
 const init=()=>{if(['catalog','note'].includes(document.body?.dataset.mobileKind)){document.documentElement.classList.add('phone-reading');window.bindPhoneReadingScroll(document);}};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
