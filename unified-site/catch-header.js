(() => {
 const header=document.querySelector('.game-header'),column=document.getElementById('game-column');
 if(!header||!column)return;
 const sync=()=>{const top=header.getBoundingClientRect().bottom-column.getBoundingClientRect().top+12;column.style.setProperty('--catch-play-top',Math.ceil(top)+'px');};
 new ResizeObserver(sync).observe(header);window.addEventListener('resize',sync);sync();
})();
