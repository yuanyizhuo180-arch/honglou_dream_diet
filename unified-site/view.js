export class View {
 constructor(iw,ih){this.iw=iw;this.ih=ih;this.width=1;this.height=1;this.zoom=1;this.center=[.5,.5];this.base=1;this.ready=false;}
 get scaleValue(){return this.base*this.zoom;}
 fit(){const gap=Math.min(16,this.width*.04,this.height*.04);return Math.min((this.width-2*gap)/this.iw,(this.height-2*gap)/this.ih);}
 resize(w,h){const scale=this.scaleValue,zoomed=this.ready;this.width=Math.max(1,w);this.height=Math.max(1,h);if(!zoomed)this.base=this.fit();else this.base=scale/this.zoom;this.ready=true;this.clamp();}
 point(x,y){const s=this.scaleValue;return[this.center[0]+(x-this.width/2)/(s*this.iw),this.center[1]+(y-this.height/2)/(s*this.ih)];}
 project(x,y){return[this.width/2+(x-this.center[0])*this.iw*this.scaleValue,this.height/2+(y-this.center[1])*this.ih*this.scaleValue];}
 scale(f,x=this.width/2,y=this.height/2){const p=this.point(x,y);this.zoom=Math.max(.7,Math.min(3,this.zoom*f));const q=this.point(x,y);this.center=[this.center[0]+p[0]-q[0],this.center[1]+p[1]-q[1]];this.clamp();}
 pan(x,y){this.center=[this.center[0]-x/(this.iw*this.scaleValue),this.center[1]-y/(this.ih*this.scaleValue)];this.clamp();}
 clamp(){const dims=[this.iw,this.ih],vp=[this.width,this.height];this.center=this.center.map((c,i)=>{const size=dims[i]*this.scaleValue,gutter=Math.min(56,vp[i]*.12);if(size<=vp[i]-2*gutter)return .5;const edge=(vp[i]/2-gutter)/size;return Math.max(edge,Math.min(1-edge,c));});}
 reset(){this.zoom=1;this.base=this.fit();this.center=[.5,.5];}
}
