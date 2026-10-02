export class View{
 constructor(iw,ih){this.iw=iw;this.ih=ih;this.width=1;this.height=1;this.zoom=1;this.center=[.5,.5];this.base=1}
 get scaleValue(){return this.base*this.zoom}
 resize(w,h){this.width=w;this.height=h;this.base=Math.min(w/this.iw,h/this.ih);this.clamp()}
 point(x,y){const s=this.scaleValue;return[this.center[0]+(x-this.width/2)/(s*this.iw),this.center[1]+(y-this.height/2)/(s*this.ih)]}
 project(x,y){return[this.width/2+(x-this.center[0])*this.iw*this.scaleValue,this.height/2+(y-this.center[1])*this.ih*this.scaleValue]}
 scale(f,x=this.width/2,y=this.height/2){const p=this.point(x,y);this.zoom=Math.max(.7,Math.min(3,this.zoom*f));const q=this.point(x,y);this.center=[this.center[0]+p[0]-q[0],this.center[1]+p[1]-q[1]];this.clamp()}
 pan(x,y){this.center=[this.center[0]-x/(this.iw*this.scaleValue),this.center[1]-y/(this.ih*this.scaleValue)];this.clamp()}
 clamp(){const dims=[this.iw,this.ih],vp=[this.width,this.height];this.center=this.center.map((c,i)=>{const ratio=vp[i]/(dims[i]*this.scaleValue);if(ratio>=1)return .5;const edge=ratio/2;return Math.max(edge,Math.min(1-edge,c))})}
 reset(){this.zoom=1;this.center=[.5,.5]}
}
