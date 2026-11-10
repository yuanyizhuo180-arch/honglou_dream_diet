(() => {
 const stage=document.getElementById('stage'),back=document.querySelector('a.site-return');
 if(!stage||!back)return;
 const toolbar=document.createElement('nav');toolbar.className='story-toolbar';toolbar.setAttribute('aria-label','剧情导航与出处');
 toolbar.append(back);stage.append(toolbar);
 const source=document.getElementById('source')||document.getElementById('scene-source');
 if(source){source.classList.add('story-source');toolbar.append(source);}
 // The original scene renderer still owns source text and its hidden state.
 // It also owns the scene, portraits, dialogue and all completion controls.
 const intro=document.getElementById('intro-next')||document.getElementById('intro-advance');
 if(intro){intro.textContent='入梦';intro.setAttribute('aria-label','入梦');}
})();
// Size measurements only position controls; they never shrink dialogue text.
(() => {
 const stage=document.getElementById('stage'),dialogue=document.getElementById('dialogue'),toolbar=document.querySelector('.story-toolbar');
 if(!stage||!dialogue)return;
 const sync=()=>{stage.style.setProperty('--story-dialogue-height',dialogue.getBoundingClientRect().height+'px');stage.style.setProperty('--story-toolbar-height',(toolbar?.getBoundingClientRect().height||44)+'px');};
 const observer=new ResizeObserver(sync);observer.observe(dialogue);if(toolbar)observer.observe(toolbar);window.addEventListener('resize',sync);sync();
})();
