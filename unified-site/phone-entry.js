(() => {
 const child=window.parent!==window && (()=>{try{return parent.location.pathname==='/mobile/';}catch{return false;}})();
 if(child){
  document.documentElement.classList.add('phone-frame');
  const css=document.createElement('link');css.rel='stylesheet';css.href='/phone-frame.css?v=20261110-smooth-v6';document.head.append(css);
  const reading=document.createElement('script');reading.src='/phone-reading.js?v=20261110-smooth-v6';reading.async=false;document.head.append(reading);
  const js=document.createElement('script');js.src='/phone-frame.js?v=20261110-smooth-v6';js.async=false;document.head.append(js);
  return;
 }
 const touch=navigator.maxTouchPoints>0||matchMedia('(pointer:coarse)').matches;
 if(HonglouPhone.isPhone(navigator,touch)){
  const page=location.pathname+location.search+location.hash;
  location.replace('/mobile/?page='+encodeURIComponent(page));
 }
})();
