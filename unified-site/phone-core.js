window.HonglouPhone = {
 isPhone(nav,coarse){return !!coarse && (nav.userAgentData?.mobile===true || /iPhone|iPod|Android.*Mobile|Windows Phone/i.test(nav.userAgent||''));},
 fit(width,height){return {width:height,height:width,angle:90,scale:1};},
 safePage(value,origin){try{const u=new URL(value||'/',origin);return u.origin===origin&&!u.pathname.startsWith('/mobile/')?u.pathname+u.search+u.hash:'/';}catch{return '/';}}
};
