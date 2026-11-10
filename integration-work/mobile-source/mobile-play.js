(() => {
 const body=document.body;
 const mobile=matchMedia('(max-width:1024px) and (max-height:1024px)');
 const portrait=matchMedia('(orientation:portrait)');
 const notice=document.createElement('div');notice.className='rotate-notice';notice.hidden=true;
 notice.setAttribute('role','dialog');notice.setAttribute('aria-label','请横屏体验');
 notice.innerHTML='<div><span aria-hidden="true">↻</span><h2>请横屏体验</h2><p>旋转手机后，继续园中故事。<br>当前进度会为你保留。</p><a href="/garden/">返回大观园</a></div>';
 document.body.append(notice);
 let held=false;
 const sync=()=>{
  const blocked=mobile.matches&&portrait.matches;
  const pause=document.querySelector('#pause,#kitchen-pause');
  if(blocked&&notice.hidden){
   held=!!pause&&pause.textContent.trim()==='暂停'&&(!document.getElementById('modal')||document.getElementById('modal').hidden);
   if(held)pause.click();
  } else if(!blocked&&!notice.hidden&&held){
   if(body.dataset.mobileKind==='cabinet'&&document.getElementById('modal-title')?.textContent==='游戏暂停')document.getElementById('modal-action').click();
   else if(pause&&/^(继续|继续游戏)$/.test(pause.textContent.trim()))pause.click();
   held=false;
  }
  const changed=notice.hidden===blocked;
  notice.hidden=!blocked;
  body.classList.toggle('phone-portrait',blocked);
  const surface=document.querySelector('main');if(surface)surface.inert=blocked;
  if(body.dataset.mobileKind==='catch'){
   const width=innerWidth,height=innerHeight;
   body.style.setProperty('--play-scale',Math.min(width/1200,height/675));
  }
  window.dispatchEvent(new Event('honglou:viewport'));
  if(changed)window.dispatchEvent(new Event('honglou:orientation'));
 };
 window.addEventListener('resize',sync);window.visualViewport?.addEventListener('resize',sync);
 mobile.addEventListener('change',sync);portrait.addEventListener('change',sync);sync();
})();
