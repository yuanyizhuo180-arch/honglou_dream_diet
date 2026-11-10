(function (root) {
  const NS = 'http://www.w3.org/2000/svg';
  const SHAPE = 'M399 514 C398 453 471 400 574 387 C679 376 805 404 930 410 C1060 414 1170 426 1205 444 C1228 405 1252 399 1280 428 C1301 454 1314 476 1378 514 C1393 525 1391 548 1370 556 C1316 572 1301 600 1278 625 C1257 650 1222 642 1201 614 C1110 624 1011 635 904 635 C800 636 682 647 573 648 C469 647 399 598 399 514 Z';
  const FACE = {620:{y:517,ry:126},900:{y:523,ry:111},1150:{y:526,ry:98}};
  const top = {620:389,900:407,1150:419};
  const bottom = {620:648,900:640,1150:629};
  const easing = t => 1 - Math.pow(1-t,3);

  function svg(name, attrs = {}) {
    const node = document.createElementNS(NS,name);
    for (const [key,value] of Object.entries(attrs)) node.setAttribute(key,String(value));
    return node;
  }

  function mountEggplantCut(container, {onComplete,onStatus}) {
    let state = HonglouEggplantCut.createEggplantCutState();
    let paused = false, busy = false, pointer = null, gesture = [], raf = null, animation = null, destroyed = false;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = document.createElement('div'); scene.className = 'cut-scene';
    const canvas = svg('svg',{class:'eggplant-canvas',viewBox:'0 0 1672 941',preserveAspectRatio:'xMidYMid meet','aria-label':'在蓝色箭头处从上往下滑动切茄子'});
    const defs = svg('defs');
    const outline = svg('clipPath',{id:'eggplant-outline'}); outline.append(svg('path',{d:SHAPE}));defs.append(outline);
    const shadowBlur = svg('filter',{id:'eggplant-shadow-blur',x:'-25%',y:'-100%',width:'150%',height:'300%'});
    shadowBlur.append(svg('feGaussianBlur',{stdDeviation:13}));defs.append(shadowBlur);
    canvas.append(defs);
    canvas.append(svg('rect',{class:'cut-hit-surface',x:0,y:0,width:1672,height:941,fill:'transparent'}));
    const segmentsLayer = svg('g',{class:'eggplant-segments'});
    canvas.append(segmentsLayer);
    const arrow = svg('g',{class:'cut-arrow','aria-hidden':'true'});
    arrow.innerHTML = '<path class="cut-arrow-halo" d="M0 -118 V98 M-23 75 L0 105 L23 75"/><path class="cut-arrow-blue" d="M0 -118 V98 M-23 75 L0 105 L23 75"/>';
    canvas.append(arrow);scene.append(canvas);container.append(scene);
    const nodes = new Map();
    const offsets = new Map();

    function faceAt(x,side) {
      const {y,ry} = FACE[x];
      const group = svg('g',{class:'eggplant-face',opacity:'1'});
      group.append(svg('ellipse',{cx:x+(side==='left'?3:-3),cy:y,rx:15,ry,fill:'#fae8bd',stroke:'#d7ab71','stroke-width':3}));
      group.append(svg('ellipse',{cx:x+(side==='left'?4:-4),cy:y,rx:9,ry:ry-9,fill:'#fff0cf',opacity:'.74'}));
      group.append(svg('path',{d:`M${x} ${y-ry+16} Q${x+8} ${y} ${x} ${y+ry-15}`,fill:'none',stroke:'#d9a875','stroke-width':2,opacity:'.52'}));
      return group;
    }

    function makeSegment(segment, offset, freshFace) {
      const group = svg('g',{'data-segment-id':segment.id,class:'eggplant-segment'});
      const shadow = svg('ellipse',{cx:(segment.from+segment.to)/2,cy:653,rx:Math.max(42,(segment.to-segment.from)/2),ry:25,fill:'#4c2c18',opacity:'.23',filter:'url(#eggplant-shadow-blur)'});
      group.append(shadow);
      const clipId = `cut-piece-${segment.id}`;
      const clip = svg('clipPath',{id:clipId});clip.append(svg('rect',{x:segment.from-1,y:350,width:segment.to-segment.from+2,height:320}));defs.append(clip);
      const crop = svg('g',{'clip-path':`url(#${clipId})`});
      const shape = svg('g',{'clip-path':'url(#eggplant-outline)'});
      shape.append(svg('image',{href:'assets/eggplant-cut/cut-0-v3.png',x:0,y:0,width:1672,height:941,preserveAspectRatio:'none'}));
      crop.append(shape);group.append(crop);
      if (segment.leftCut) { const face = faceAt(segment.from,'left');if(freshFace===segment.from)face.setAttribute('opacity','0');group.append(face); }
      if (segment.rightCut) { const face = faceAt(segment.to,'right');if(freshFace===segment.to)face.setAttribute('opacity','0');group.append(face); }
      group.setAttribute('transform',`translate(${offset} 0)`);
      nodes.set(segment.id,group);offsets.set(segment.id,offset);
      return group;
    }

    segmentsLayer.append(makeSegment(state.segments[0],0,false));
    function showArrow() {
      const line = HonglouEggplantCut.nextCut(state);
      if (line === null || busy || paused || destroyed) {arrow.style.opacity='0';return;}
      const activeOffset = offsets.get(state.activeId)||0;
      arrow.setAttribute('transform',`translate(${line+activeOffset} 516)`);
      arrow.style.opacity='1';
      onStatus?.(`第 ${state.cuts+1} 刀：从蓝色箭头上方向下划过茄子。`);
    }
    showArrow();

    function localPoint(event) {
      const point = canvas.createSVGPoint();point.x=event.clientX;point.y=event.clientY;
      const converted = point.matrixTransform(canvas.getScreenCTM().inverse());
      return {x:converted.x,y:converted.y};
    }
    function target() {
      const line = HonglouEggplantCut.nextCut(state);
      const offset = offsets.get(state.activeId)||0;
      return {x:line+offset,top:top[line],bottom:bottom[line],halfWidth:Math.max(47,(bottom[line]-top[line])*.19)};
    }
    function clearGesture() { pointer=null;gesture=[]; }

    function onPointerDown(event) {
      if (paused || busy || destroyed || pointer !== null || HonglouEggplantCut.nextCut(state)===null) return;
      const point = localPoint(event);
      if (!HonglouCutGesture.canStartCut(point,target())) return;
      pointer=event.pointerId;gesture=[point];canvas.setPointerCapture(pointer);event.preventDefault();arrow.style.opacity='0';
    }
    function onPointerMove(event) {
      if (event.pointerId!==pointer || paused) return;
      gesture.push(localPoint(event));event.preventDefault();
    }
    function onPointerEnd(event) {
      if (event.pointerId!==pointer) return;
      if (!paused) gesture.push(localPoint(event));
      const valid = event.type==='pointerup' && !paused && HonglouCutGesture.isDownwardCut(gesture,target());
      clearGesture();event.preventDefault();
      if (valid) performCut();else if (!paused) {showArrow();onStatus?.('请从箭头上方开始，沿箭头向下划过茄子。');}
    }
    canvas.addEventListener('pointerdown',onPointerDown);
    canvas.addEventListener('pointermove',onPointerMove);
    canvas.addEventListener('pointerup',onPointerEnd);
    canvas.addEventListener('pointercancel',onPointerEnd);

    function performCut() {
      if (busy || paused) return;
      const line = HonglouEggplantCut.nextCut(state);
      const prior = state.segments.find(s=>s.id===state.activeId);
      const result = HonglouEggplantCut.applyCut(state,line);
      if (!result.accepted) return;
      busy=true;arrow.style.opacity='0';
      const old = nodes.get(prior.id), startOffset = offsets.get(prior.id)||0;
      const [left,right] = result.state.segments.slice(-2);
      const leftNode=makeSegment(left,startOffset,line), rightNode=makeSegment(right,startOffset,line);
      old.replaceWith(leftNode,rightNode);nodes.delete(prior.id);offsets.delete(prior.id);
      state=result.state;
      onStatus?.(`第 ${state.cuts} 刀完成，茄子正在分开。`);
      const duration = reduceMotion ? 0 : 560;
      const started = performance.now();
      animation = {leftNode,rightNode,startOffset,left,right,started,elapsed:0,duration,last:started};
      function frame(now) {
        if (destroyed) return;
        if (paused) {animation.last=now;raf=requestAnimationFrame(frame);return;}
        animation.elapsed += now-animation.last;animation.last=now;
        const p=duration===0?1:Math.min(1,animation.elapsed/duration), eased=easing(p);
        leftNode.setAttribute('transform',`translate(${startOffset-12*eased} 0)`);
        rightNode.setAttribute('transform',`translate(${startOffset+15*eased} 0)`);
        for(const node of [leftNode,rightNode]){
          const face=node.querySelector('.eggplant-face:last-child');if(face)face.setAttribute('opacity',String(eased));
          node.querySelector('ellipse').setAttribute('opacity',String(.18+.05*eased));
        }
        if(p<1){raf=requestAnimationFrame(frame);return;}
        offsets.set(left.id,startOffset-12);offsets.set(right.id,startOffset+15);
        animation=null;raf=null;busy=false;
        if(state.cuts===3){onStatus?.('三刀完成，茄子分成四段。');onComplete?.();}
        else showArrow();
      }
      raf=requestAnimationFrame(frame);
    }

    return {
      get state(){return state;},
      getPotHandoff(){
        if (state.cuts!==3 || busy || destroyed) return null;
        return {canvas,segmentsLayer,segments:state.segments.map(segment=>({
          ...segment,node:nodes.get(segment.id),offset:offsets.get(segment.id)||0
        }))};
      },
      setPaused(value){paused=value;if(value){clearGesture();arrow.style.opacity='0';}else if(!busy)showArrow();},
      destroy(){destroyed=true;if(raf)cancelAnimationFrame(raf);scene.remove();}
    };
  }
  root.HonglouEggplantCutView = {mountEggplantCut};
})(window);
