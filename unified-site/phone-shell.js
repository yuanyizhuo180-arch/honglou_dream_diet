(() => {
 const host=document.getElementById('landscape-host'),frame=document.getElementById('landscape-frame');
 // Only size changes; the rotation stays 90 degrees and the document stays loaded.
 const visual=window.visualViewport;
 const sizeFrame=()=>{const r=host.getBoundingClientRect(),size=HonglouPhone.fit(r.width,r.height);frame.style.width=size.width+'px';frame.style.height=size.height+'px';};
 const fit=()=>{
  const values={'width':visual?.width||innerWidth,'height':visual?.height||innerHeight,'left':visual?.offsetLeft||0,'top':visual?.offsetTop||0};
  for(const [key,value]of Object.entries(values))document.documentElement.style.setProperty('--visual-'+key,value+'px');
  sizeFrame();
 };
 new ResizeObserver(sizeFrame).observe(host);window.addEventListener('resize',fit);visual?.addEventListener('resize',fit);visual?.addEventListener('scroll',fit);fit();
 const first=HonglouPhone.safePage(new URLSearchParams(location.search).get('page'),location.origin);
 frame.src=first;
 window.addEventListener('message',e=>{
  if(e.origin!==location.origin||e.source!==frame.contentWindow||e.data?.type!=='honglou:page')return;
  const page=HonglouPhone.safePage(e.data.page,location.origin);
  const next='/mobile/?page='+encodeURIComponent(page);
  if(location.pathname+location.search!==next)history.replaceState(null,'',next);
  if(typeof e.data.title==='string')document.title=e.data.title;
 });
 // A browser reload returns to the current inner page, including scene/search.
})();
