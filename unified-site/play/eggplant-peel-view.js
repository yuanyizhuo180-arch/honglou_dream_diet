(function (root) {
  const NS='http://www.w3.org/2000/svg';
  const SHAPE='M399 514 C398 453 471 400 574 387 C679 376 805 404 930 410 C1060 414 1170 426 1205 444 C1228 405 1252 399 1280 428 C1301 454 1314 476 1378 514 C1393 525 1391 548 1370 556 C1316 572 1301 600 1278 625 C1257 650 1222 642 1201 614 C1110 624 1011 635 904 635 C800 636 682 647 573 648 C469 647 399 598 399 514 Z';
  const BODY='M399 514 C398 453 471 400 574 387 C679 376 805 404 930 410 C1060 414 1170 426 1205 444 L1201 614 C1110 624 1011 635 904 635 C800 636 682 647 573 648 C469 647 399 598 399 514 Z';
  function svg(tag,attrs={}){const el=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));return el;}
  function mountEggplantPeel(container,{onComplete,onStatus}={}){
    let state=HonglouEggplantPeel.createPeelState(),paused=false,finished=false,destroyed=false,pointer=null,gesture=null,preview=null,idle=null,paintFrame=null,completionFrame=null,completionActive=false,completionElapsed=0,completionLast=0,pathText='';
    const scene=document.createElement('div');scene.className='peel-scene';
    const canvas=svg('svg',{class:'eggplant-canvas peel-canvas',viewBox:'0 0 1672 941',preserveAspectRatio:'xMidYMid meet','aria-label':'在茄子表面按住并连续画波浪线去皮'});
    const defs=svg('defs');
    const clip=svg('clipPath',{id:'peel-eggplant-outline'});clip.append(svg('path',{d:SHAPE}));defs.append(clip);
    const blur=svg('filter',{id:'peel-shadow-blur',x:'-25%',y:'-100%',width:'150%',height:'300%'});blur.append(svg('feGaussianBlur',{stdDeviation:13}));defs.append(blur);
    const gradient=svg('linearGradient',{id:'peel-purple',x1:'0',y1:'0',x2:'0',y2:'1'});
    [['0%','#86649a'],['25%','#664476'],['70%','#42234f'],['100%','#291735']].forEach(([offset,color])=>gradient.append(svg('stop',{offset,'stop-color':color})));defs.append(gradient);
    const mask=svg('mask',{id:'peel-removed-mask',maskUnits:'userSpaceOnUse',maskContentUnits:'userSpaceOnUse',x:0,y:0,width:1672,height:941});mask.append(svg('rect',{x:0,y:0,width:1672,height:941,fill:'white'}));
    const committed=svg('g',{class:'peel-committed'}),active=svg('g',{class:'peel-active'});mask.append(committed,active);defs.append(mask);
    canvas.append(defs);
    canvas.append(svg('rect',{x:0,y:0,width:1672,height:941,fill:'transparent'}));
    canvas.append(svg('ellipse',{cx:892.5,cy:653,rx:497.5,ry:25,fill:'#4c2c18',opacity:'.23',filter:'url(#peel-shadow-blur)'}));
    const base=svg('g',{'clip-path':'url(#peel-eggplant-outline)'});base.append(svg('image',{href:'assets/eggplant-cut/cut-0-v3.png',x:0,y:0,width:1672,height:941,preserveAspectRatio:'none'}));canvas.append(base);
    const skin=svg('g',{'mask':'url(#peel-removed-mask)',class:'peel-skin'});
    skin.append(svg('path',{d:BODY,fill:'url(#peel-purple)'}));
    skin.append(svg('path',{d:'M453 499 C566 421 734 426 910 444 C1035 454 1130 442 1191 460 M435 549 C570 613 715 596 860 609 C1002 621 1120 591 1190 594',fill:'none',stroke:'#a586b0','stroke-width':9,opacity:'.19','stroke-linecap':'round'}));
    canvas.append(skin);
    const hint=svg('g',{class:'peel-hint','aria-hidden':'true',style:'opacity:0;pointer-events:none'});
    hint.innerHTML='<path class="peel-hint-halo" d="M585 475 L628 436 L674 486 L722 435 L769 485 L817 433 L866 481 L912 430"/><path class="peel-hint-wave" d="M585 475 L628 436 L674 486 L722 435 L769 485 L817 433 L866 481 L912 430"/><g transform="translate(905 452) rotate(-17)"><path class="peel-hint-finger" d="M-11 21 L-18 -23 Q-20 -35 -9 -38 Q2 -40 5 -28 L12 0 Q16 -8 24 -4 Q29 -10 37 -5 Q44 -8 50 -1 Q57 7 54 23 L48 46 Q42 61 24 63 L2 59 Q-11 53 -20 37 Q-27 26 -18 21 Q-14 19 -11 21 Z"/><path class="peel-hint-detail" d="M12 0 L17 19 M29 -2 L31 18 M43 -2 L44 18"/></g>';
    canvas.append(hint);scene.append(canvas);container.append(scene);
    const coordinate=p=>`${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    function hideHint(){hint.style.opacity='0';}
    function resetIdle(){clearTimeout(idle);hideHint();if(!paused&&!finished&&!destroyed)idle=setTimeout(()=>{if(pointer===null&&!paused&&!finished)hint.style.opacity='1';},2000);}
    function local(event){const p=canvas.createSVGPoint();p.x=event.clientX;p.y=event.clientY;const q=p.matrixTransform(canvas.getScreenCTM().inverse());return {x:q.x,y:q.y};}
    function paint(){paintFrame=null;if(preview&&!destroyed)preview.setAttribute('d',pathText);}
    function queuePaint(){if(paintFrame===null)paintFrame=requestAnimationFrame(paint);}
    function flushPaint(){if(paintFrame!==null){cancelAnimationFrame(paintFrame);paintFrame=null;}paint();}
    function addPoint(point){
      if(!gesture||!gesture.add(point))return;
      pathText+=`${gesture.points.length===1?'M':' L'}${coordinate(point)}`;
      if(gesture.eligible){
        if(!preview){preview=svg('path',{fill:'none',stroke:'black','stroke-width':148,'stroke-linecap':'round','stroke-linejoin':'round'});active.append(preview);}
        queuePaint();
      }
    }
    function completionTick(now){
      completionFrame=null;if(destroyed||paused||!completionActive)return;
      completionElapsed+=now-completionLast;completionLast=now;
      const fade=matchMedia('(prefers-reduced-motion: reduce)').matches?0:230;
      if(fade)skin.style.opacity=String(1-Math.min(1,completionElapsed/fade));
      if(completionElapsed>=fade&&skin.isConnected)skin.remove();
      if(completionElapsed>=650){completionActive=false;onComplete?.();return;}
      completionFrame=requestAnimationFrame(completionTick);
    }
    function finishGesture(finalPoint){
      if(pointer===null)return;
      if(finalPoint)addPoint(finalPoint);
      const oldPointer=pointer;pointer=null;
      if(canvas.hasPointerCapture(oldPointer))canvas.releasePointerCapture(oldPointer);
      const result=gesture?.eligible?HonglouEggplantPeel.applyPeelStroke(state,gesture.points):{accepted:false,state};
      if(result.accepted){flushPaint();committed.append(preview);state=result.state;onStatus?.(`去皮 ${Math.round(state.progress*100)}%`);}
      else{if(paintFrame!==null){cancelAnimationFrame(paintFrame);paintFrame=null;}preview?.remove();onStatus?.('请在茄子上按住并连续画波浪线。');}
      preview=null;gesture=null;pathText='';
      if(state.complete){finished=true;clearTimeout(idle);hideHint();onStatus?.('茄子已去皮。');completionActive=true;completionLast=performance.now();completionFrame=requestAnimationFrame(completionTick);}
      else resetIdle();
    }
    function down(event){if(paused||finished||destroyed||pointer!==null)return;resetIdle();const p=local(event);if(!HonglouEggplantPeel.isOnBody(p))return;pointer=event.pointerId;gesture=HonglouEggplantPeel.createPeelGesture();addPoint(p);canvas.setPointerCapture(pointer);clearTimeout(idle);event.preventDefault();}
    function move(event){if(paused||finished||destroyed||pointer!==event.pointerId)return;const samples=event.getCoalescedEvents?.();for(const sample of samples?.length?samples:[event])addPoint(local(sample));event.preventDefault();}
    function end(event){if(pointer!==event.pointerId)return;finishGesture(event.type==='pointerup'?local(event):null);event.preventDefault();}
    function lostCapture(event){if(pointer===event.pointerId)finishGesture(null);}
    canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',lostCapture);
    resetIdle();
    return {
      get state(){return state;},
      setPaused(value){if(value&&pointer!==null)finishGesture(null);paused=value;if(value){clearTimeout(idle);hideHint();if(completionFrame!==null){cancelAnimationFrame(completionFrame);completionFrame=null;}}else if(completionActive){completionLast=performance.now();completionFrame=requestAnimationFrame(completionTick);}else resetIdle();},
      destroy(){destroyed=true;clearTimeout(idle);if(paintFrame!==null)cancelAnimationFrame(paintFrame);if(completionFrame!==null)cancelAnimationFrame(completionFrame);scene.remove();}
    };
  }
  root.HonglouEggplantPeelView={mountEggplantPeel};
})(window);
