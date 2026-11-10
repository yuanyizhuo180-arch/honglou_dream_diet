(function (root) {
  const top = [[400,514],[480,415],[570,387],[800,402],[1000,415],[1180,433],[1205,444]];
  const bottom = [[400,514],[480,614],[570,648],[800,640],[1000,630],[1180,617],[1205,610]];
  function edge(points,x) {
    for(let i=1;i<points.length;i++) if(x<=points[i][0]) {
      const [a,b]=[points[i-1],points[i]];
      return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);
    }
    return points.at(-1)[1];
  }
  function isOnBody(p) {return p.x>=420&&p.x<=1195&&p.y>=edge(top,p.x)+7&&p.y<=edge(bottom,p.x)-7;}
  function isWaveStroke(points) {
    if(!points||points.length<7||!isOnBody(points[0])||!isOnBody(points.at(-1)))return false;
    if(points.filter(isOnBody).length/points.length<.82)return false;
    const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
    if(Math.max(...xs)-Math.min(...xs)<220||Math.max(...ys)-Math.min(...ys)<50)return false;
    let length=0,turns=0,lastSign=0,anchor=points[0].y;
    for(let i=1;i<points.length;i++) {
      length+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);
      const delta=points[i].y-anchor;
      if(Math.abs(delta)>=22){const sign=Math.sign(delta);if(lastSign&&sign!==lastSign)turns++;lastSign=sign;anchor=points[i].y;}
    }
    return length>=340&&turns>=3;
  }
  function createPeelGesture() {
    const points=[];
    let closed=false,eligible=false,minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,length=0,turns=0,lastSign=0,anchor=null;
    return {
      get points(){return points;},get eligible(){return eligible;},get closed(){return closed;},
      add(point){
        if(closed)return false;
        if(!isOnBody(point)){closed=true;return false;}
        const previous=points.at(-1);
        if(previous&&Math.hypot(point.x-previous.x,point.y-previous.y)<8)return false;
        if(previous)length+=Math.hypot(point.x-previous.x,point.y-previous.y);
        points.push(point);
        minX=Math.min(minX,point.x);maxX=Math.max(maxX,point.x);minY=Math.min(minY,point.y);maxY=Math.max(maxY,point.y);
        if(anchor===null)anchor=point.y;
        const delta=point.y-anchor;
        if(Math.abs(delta)>=22){const sign=Math.sign(delta);if(lastSign&&sign!==lastSign)turns++;lastSign=sign;anchor=point.y;}
        if(!eligible&&points.length>=7&&maxX-minX>=220&&maxY-minY>=50&&length>=340&&turns>=3)eligible=true;
        return true;
      }
    };
  }
  const cells=[];
  for(let y=405;y<=635;y+=20)for(let x=420;x<=1195;x+=20)if(isOnBody({x,y}))cells.push({x,y,id:`${x}:${y}`});
  function createPeelState(){return {covered:new Set(),progress:0,strokes:0,complete:false};}
  function pointDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);}
  function applyPeelStroke(state,points){
    if(state.complete||!isWaveStroke(points))return {accepted:false,state};
    const covered=new Set(state.covered);
    for(const cell of cells)if(!covered.has(cell.id))for(let i=1;i<points.length;i++)if(pointDistance(cell,points[i-1],points[i])<=74){covered.add(cell.id);break;}
    const progress=covered.size/cells.length,complete=progress>=.82;
    return {accepted:true,state:{covered,progress:complete?1:progress,strokes:state.strokes+1,complete}};
  }
  const api={isOnBody,isWaveStroke,createPeelGesture,createPeelState,applyPeelStroke};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.HonglouEggplantPeel=api;
})(typeof window!=='undefined'?window:globalThis);
