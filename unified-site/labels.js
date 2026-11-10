// All labels stay available, including off-screen places. Layout is separate
// from world coordinates: pin only the label, never the actual map hotspot.
export function layoutLabels(nodes,view,labels){
 const occupied=[];
 const bounded=(v,a,b)=>Math.max(a,Math.min(b,v));
 for(const n of nodes){
  const b=labels.get(n.id),[ax,ay]=view.project(...n.anchor),w=b.offsetWidth||34,h=b.offsetHeight||86;
  const x=bounded(ax,w/2+10,view.width-w/2-10),y=bounded(ay,h/2+10,view.height-h/2-10);
  let best={x,y,score:Infinity};
  for(const dy of [0,h+8,-h-8,2*(h+8),-2*(h+8)])for(const dx of [0,w+8,-w-8,2*(w+8),-2*(w+8)]){
   const px=bounded(x+dx,w/2+10,view.width-w/2-10),py=bounded(y+dy,h/2+10,view.height-h/2-10);
   const collisions=occupied.filter(q=>Math.abs(q.x-px)<(q.w+w)/2+4&&Math.abs(q.y-py)<(q.h+h)/2+4).length;
   const score=collisions*1e6+(px-x)**2+(py-y)**2;if(score<best.score)best={x:px,y:py,score};
  }
  occupied.push({...best,w,h});b.hidden=false;b.style.left=best.x+'px';b.style.top=best.y+'px';
  const pinned=Math.abs(best.x-ax)>w/2||Math.abs(best.y-ay)>h/2;
  b.classList.toggle('edge-pinned',pinned);b.title=pinned?n.name+'（点击移至此处）':n.name;
 }
}
