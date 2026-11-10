(function (root) {
  const NS='http://www.w3.org/2000/svg';
  const plateTargets=[[1175,267],[1360,267],[1180,372],[1360,374]];
  const potTargets=[[580,405],[780,405],[580,480],[770,480]];
  const ease=t=>1-Math.pow(1-t,3);
  const copy={oil:'入锅：先将鸡油倒入锅中',pot:'入锅：点击茄子，逐段放入锅中',fry:'掌火：调至中火，炸制茄子',mix:'加料：点击配料盘，将切丁配料一同入锅',broth:'煨制：将鸡汤倒入锅中',simmer:'煨制：保持中火，直到鸡汤收干',sesame:'调味：加入香油',zao:'调味：加入糟油',done:'茄鲞已烹成'};
  function svg(name,attrs={}) {const node=document.createElementNS(NS,name);for(const [key,value] of Object.entries(attrs))node.setAttribute(key,String(value));return node;}
  function mountEggplantPot(handoff,{onPhase,onStatus}={}) {
    if(!handoff||handoff.segments.length!==4)throw new Error('入锅需要切块终态');
    const {canvas,segmentsLayer,segments}=handoff;
    // The original full-table texture includes wood between the calyx leaves.
    // Restrict only the stem segment to eggplant-colored pixels during the pot scene.
    const cleanDefs=svg('defs');
    cleanDefs.innerHTML=`<filter id="pot-calyx-color" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -5 5 0 0 1.2"/></filter><clipPath id="pot-calyx-zone"><rect x="1195" y="370" width="201" height="310"/></clipPath><mask id="pot-calyx-clean" maskUnits="userSpaceOnUse" x="1145" y="350" width="255" height="330"><rect x="1145" y="350" width="50" height="330" fill="white"/><image href="assets/eggplant-cut/cut-0-v3.png" x="0" y="0" width="1672" height="941" preserveAspectRatio="none" clip-path="url(#pot-calyx-zone)" filter="url(#pot-calyx-color)"/></mask><filter id="cook-soften" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".014 .052" numOctaves="2" seed="4" result="cook-warp"/><feDisplacementMap id="cook-warp-strength" in="SourceGraphic" in2="cook-warp" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>`;
    canvas.insertBefore(cleanDefs,segmentsLayer);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let state=HonglouEggplantPot.createPotState(segments.map(item=>item.id));
    let phase='staging',paused=false,destroyed=false,raf=null,animation=null,idle=null,clock=null,clockLast=null;
    let heat=0,progress=0,locked=false,dragging=false;
    const base=svg('g',{class:'pot-tableware',opacity:0,'pointer-events':'none'});
    base.innerHTML=`<defs>
      <radialGradient id="cook-oil"><stop stop-color="#f8d271" stop-opacity=".68"/><stop offset="1" stop-color="#b88023" stop-opacity=".35"/></radialGradient>
      <radialGradient id="cook-broth"><stop stop-color="#eacb8b" stop-opacity=".73"/><stop offset="1" stop-color="#b4753d" stop-opacity=".76"/></radialGradient>
      <linearGradient id="cook-ceramic" x2="0" y2="1"><stop stop-color="#fff9df"/><stop offset=".62" stop-color="#eee0b9"/><stop offset="1" stop-color="#bd966e"/></linearGradient>
      <linearGradient id="cook-brass" x2="0" y2="1"><stop stop-color="#ffeca1"/><stop offset=".5" stop-color="#bc833b"/><stop offset="1" stop-color="#79502c"/></linearGradient>
      <linearGradient id="cook-volume" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff0c7" stop-opacity=".15"/><stop offset=".52" stop-color="#a76431" stop-opacity="0"/><stop offset="1" stop-color="#633018" stop-opacity=".53"/></linearGradient>
      <radialGradient id="cook-glaze"><stop stop-color="#f9d88c" stop-opacity=".5"/><stop offset=".75" stop-color="#a75b30" stop-opacity=".28"/><stop offset="1" stop-color="#7b3c24" stop-opacity="0"/></radialGradient>
    </defs>
    <image href="assets/eggplant-pot/wok-v4.png" x="260" y="174" width="850" height="568" preserveAspectRatio="none"/>
    <image id="cook-main-plate" href="assets/eggplant-pot/plate-v4.png" x="978" y="103" width="577" height="385" preserveAspectRatio="none"/>
    <ellipse id="cook-oil-surface" cx="688" cy="488" rx="230" ry="147" fill="url(#cook-oil)" opacity="0"/>
    <ellipse id="cook-broth-surface" cx="690" cy="493" rx="245" ry="152" fill="url(#cook-broth)" opacity="0"/>
    <g id="cook-bubbles" opacity="0" fill="none" stroke="#ffe6a3" stroke-width="4"><circle cx="565" cy="420" r="8"/><circle cx="804" cy="513" r="12"/><circle cx="714" cy="390" r="6"/><circle cx="615" cy="570" r="10"/></g>`;
    canvas.insertBefore(base,segmentsLayer);
    const toppings=svg('g',{opacity:0,'pointer-events':'none'});
    toppings.innerHTML='<ellipse id="cook-finished-glaze" cx="690" cy="493" rx="222" ry="136" fill="url(#cook-glaze)" opacity="0"/>';
    canvas.insertBefore(toppings,segmentsLayer.nextSibling);
    const ingredientsBack=svg('g',{opacity:0,'pointer-events':'none',class:'cook-ingredients-back'});
    canvas.insertBefore(ingredientsBack,segmentsLayer);
    const ingredientPieces=HonglouEggplantCookVisuals.makePieces();
    const ingredientNodes=ingredientPieces.map(piece=>{
      const node=svg('g',{'data-ingredient-id':piece.id,'data-ingredient-kind':piece.kind,'data-ingredient-location':'plate'});
      const col=piece.cell%3,row=Math.floor(piece.cell/3);
      const crop=svg('svg',{x:-piece.size/2,y:-piece.size/2,width:piece.size,height:piece.size,viewBox:`${col*512+64} ${row*512+64} 384 384`,overflow:'hidden'});
      crop.append(svg('image',{href:'assets/eggplant-pot/ingredient-atlas-v2.png',x:0,y:0,width:1536,height:1024,preserveAspectRatio:'none'}));
      node.append(crop);if(piece.layer==='back')ingredientsBack.append(node);else toppings.insertBefore(node,toppings.firstChild);
      return node;
    });
    const controls=svg('g',{class:'cook-controls'});canvas.append(controls);
    const hint=svg('g',{class:'pot-idle-hint','aria-hidden':'true',opacity:0,'pointer-events':'none'});
    hint.innerHTML='<circle r="22" fill="#fffdf0" opacity=".28"/><circle r="9" fill="#fffef6"/><circle r="4" fill="#fff"/>';canvas.append(hint);
    const oilSurface=base.querySelector('#cook-oil-surface'),brothSurface=base.querySelector('#cook-broth-surface'),bubbles=base.querySelector('#cook-bubbles'),plate=base.querySelector('#cook-main-plate'),glaze=toppings.querySelector('#cook-finished-glaze');
    segments.forEach((item,index)=>item.index=index);
    const byId=new Map(segments.map(item=>[item.id,item]));
    function pose(item,target,scale,cooked=0){const center=(item.from+item.to)/2;const tilt=[-4,3,2,-5][item.index]*cooked;item.node.setAttribute('transform',`translate(${target[0]} ${target[1]+cooked*3}) rotate(${tilt}) scale(${scale*(1-cooked*.055)} ${scale*(1-cooked*.09)}) translate(${-center} -520)`);}
    function cutPose(item){return [(item.from+item.to)/2+item.offset,520,1];}
    function platePose(item){return [...plateTargets[item.index],.5];}
    function potPose(item){return [...potTargets[item.index],.61];}
    function interpolate(item,from,to,p){const t=ease(p);pose(item,[from[0]+(to[0]-from[0])*t,from[1]+(to[1]-from[1])*t],from[2]+(to[2]-from[2])*t);}
    function poseIngredient(node,piece,fromPot=0){const x=piece.plate[0]+(piece.pot[0]-piece.plate[0])*fromPot,y=piece.plate[1]+(piece.pot[1]-piece.plate[1])*fromPot;node.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${piece.rotation+fromPot*15}) scale(${(1-fromPot*.12).toFixed(3)})`);}
    ingredientNodes.forEach((node,index)=>poseIngredient(node,ingredientPieces[index]));
    function cancelIdle(){if(idle){clearTimeout(idle);idle=null;}hint.setAttribute('opacity','0');}
    function hintTarget(){if(phase==='pot'){const next=state.pieces.find(piece=>piece.location==='plate');return next?plateTargets[byId.get(next.id).index]:null;}if(phase==='oil')return [1350,672];if(phase==='mix')return [1265,315];if(phase==='broth')return [1350,672];if(phase==='sesame'||phase==='zao')return [1350,672];if(phase==='fry'||phase==='simmer')return [1320+heat*2,745];return null;}
    function scheduleIdle(){cancelIdle();if(paused||destroyed)return;const target=hintTarget();if(!target)return;idle=setTimeout(()=>{idle=null;if(paused||destroyed)return;const point=hintTarget();if(!point)return;hint.setAttribute('transform',`translate(${point[0]} ${point[1]})`);hint.setAttribute('opacity','1');},2050);}
    function activity(){if(!paused)scheduleIdle();}
    canvas.addEventListener('pointerdown',activity);canvas.addEventListener('pointermove',activity);
    function run(duration,draw,done){if(raf)cancelAnimationFrame(raf);animation={duration:reduced?0:duration,elapsed:0,last:null,draw,done};function tick(now){if(destroyed||!animation)return;if(animation.last!==null&&!paused)animation.elapsed+=Math.min(50,now-animation.last);animation.last=now;const p=animation.duration===0?1:Math.min(1,animation.elapsed/animation.duration);if(!paused)animation.draw(p);if(p>=1&&!paused){const complete=animation.done;animation=null;raf=null;complete();return;}raf=requestAnimationFrame(tick);}raf=requestAnimationFrame(tick);}
    function setPhase(next){phase=next;locked=false;progress=0;heat=0;dragging=false;clockLast=null;if(next==='mix'){toppings.setAttribute('opacity','1');ingredientsBack.setAttribute('opacity','1');}renderControls();scheduleIdle();onPhase?.(next,copy[next]);}
    function drawVessel(label,fill,callback){
      const oils={鸡油:['chicken-oil-v1.png',1255,526,190,254],香油:['sesame-oil-v1.png',1250,561,200,219],糟油:['zao-oil-v1.png',1250,548,200,232],鸡汤:['chicken-broth-jug-v1.png',1238,526,220,254]};
      const art=oils[label];
      controls.innerHTML=art
        ?`<g class="cook-vessel" role="button" tabindex="0" aria-label="${label}" style="cursor:pointer"><ellipse cx="1350" cy="782" rx="72" ry="13" fill="#3c2416" opacity=".25"/><image href="assets/eggplant-pot/${art[0]}" x="${art[1]}" y="${art[2]}" width="${art[3]}" height="${art[4]}" preserveAspectRatio="xMidYMid meet"/><rect x="${art[1]}" y="${art[2]}" width="${art[3]}" height="${art[4]}" fill="transparent" pointer-events="all"/></g>`
        :`<g class="cook-vessel" role="button" tabindex="0" aria-label="${label}" style="cursor:pointer"><ellipse cx="1350" cy="782" rx="76" ry="17" fill="#3c2416" opacity=".27"/><path d="M1300 595 Q1304 578 1328 574 L1373 574 Q1397 579 1400 595 L1395 715 Q1379 741 1310 715 Z" fill="url(#cook-ceramic)" stroke="#9c704b" stroke-width="7"/><path d="M1320 615 Q1350 601 1380 615 L1375 686 Q1350 698 1325 686 Z" fill="${fill}" opacity=".8"/><path d="M1323 574 L1326 546 Q1350 532 1375 546 L1377 574 Z" fill="url(#cook-brass)" stroke="#79502c" stroke-width="5"/><text x="1350" y="665" text-anchor="middle" fill="#532e21" font-size="29" font-family="Songti SC,serif">${label}</text></g>`;
      const hit=controls.querySelector('.cook-vessel');hit.addEventListener('click',callback);hit.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();callback();}});
    }
    function drawMix(){controls.innerHTML='<g class="cook-mix" role="button" tabindex="0" aria-label="将混合配料倒入锅中" style="cursor:pointer"><ellipse cx="1265" cy="315" rx="210" ry="120" fill="transparent" pointer-events="all"/></g>';const hit=controls.querySelector('.cook-mix');hit.addEventListener('click',addMix);hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();addMix();}});}
    function drawHeat(){
      const zone=HonglouEggplantPot.heatZone(phase);
      const zoneX=1190+zone.min*3.05,zoneWidth=(zone.max-zone.min)*3.05;
      controls.innerHTML=`<g class="cook-heat" aria-label="火候控制"><rect x="1100" y="698" width="466" height="105" rx="22" fill="#f2e1c9" stroke="#a35c41" stroke-width="4"/><text x="1130" y="735" fill="#713e2f" font-size="22" font-family="Songti SC,serif">火候</text><rect x="1190" y="733" width="305" height="18" rx="9" fill="#a58b78"/><rect x="${zoneX}" y="729" width="${zoneWidth}" height="26" rx="9" fill="#74a377" opacity=".7"/><rect class="cook-heat-progress" x="${zoneX}" y="757" width="0" height="5" rx="2" fill="#4e865a"/><circle class="cook-heat-knob" cx="1190" cy="742" r="26" fill="url(#cook-brass)" stroke="#78502b" stroke-width="5"/><rect class="cook-heat-hit" x="1172" y="707" width="345" height="72" fill="transparent" style="cursor:ew-resize;touch-action:none" role="slider" tabindex="0" aria-label="火候" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"/><text class="cook-heat-tip" x="1325" y="784" text-anchor="middle" fill="#7d2c25" font-size="19" font-family="Songti SC,serif">拖入绿色区，连续保持 1.5 秒</text></g>`;
      const hit=controls.querySelector('.cook-heat-hit');
      function setHeat(value){heat=Math.max(0,Math.min(100,value));controls.querySelector('.cook-heat-knob').setAttribute('cx',1190+heat*3.05);hit.setAttribute('aria-valuenow',String(Math.round(heat)));if(heat<zone.min||heat>zone.max){progress=0;controls.querySelector('.cook-heat-progress').setAttribute('width','0');}controls.querySelector('.cook-heat-tip').textContent=heat<zone.min?'火力偏小，请调高':heat>zone.max?'火力偏旺，请调低':'中火适宜，保持 1.5 秒';}
      function update(e){const point=canvas.createSVGPoint();point.x=e.clientX;point.y=e.clientY;const p=point.matrixTransform(canvas.getScreenCTM().inverse());setHeat((p.x-1190)/3.05);}
      hit.addEventListener('pointerdown',e=>{if(paused||locked)return;const point=canvas.createSVGPoint();point.x=e.clientX;point.y=e.clientY;const p=point.matrixTransform(canvas.getScreenCTM().inverse());if(Math.abs(p.x-(1190+heat*3.05))>32)return;dragging=true;hit.setPointerCapture(e.pointerId);e.preventDefault();});
      hit.addEventListener('pointermove',e=>{if(dragging&&!paused){update(e);e.preventDefault();}});
      for(const event of ['pointerup','pointercancel','lostpointercapture'])hit.addEventListener(event,()=>dragging=false);
      hit.addEventListener('keydown',e=>{if(paused)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();setHeat(heat+(e.key==='ArrowRight'?2:-2));}});
    }
    function renderControls(){controls.replaceChildren();if(phase==='oil')drawVessel('鸡油','#dbac58',addOil);if(phase==='fry'||phase==='simmer'){drawHeat();controls.querySelector('.cook-heat-knob').setAttribute('cx',1190+heat*3.05);}if(phase==='mix')drawMix();if(phase==='broth')drawVessel('鸡汤','#bd8b59',addBroth);if(phase==='sesame')drawVessel('香油','#c49449',addSesame);if(phase==='zao')drawVessel('糟油','#a66941',addZao);}
    function pour(surface,amount,after){if(paused||locked)return;locked=true;cancelIdle();const vessel=controls.firstElementChild;const initial=Number(surface.getAttribute('opacity'))||0;const stream=svg('path',{d:'M1045 484 Q960 467 845 481',fill:'none',stroke:phase==='broth'?'#dfb879':'#e9bd62','stroke-width':13,'stroke-linecap':'round',opacity:0,'pointer-events':'none'});controls.append(stream);run(650,p=>{if(vessel)vessel.setAttribute('transform',`translate(${-360*ease(p)} ${-180*ease(p)}) rotate(${-45*ease(p)} 1350 650)`);stream.setAttribute('opacity',String(p>.35&&p<.91?.8:0));surface.setAttribute('opacity',String(initial+(amount-initial)*Math.max(0,(p-.35)/.65)));},()=>{controls.replaceChildren();surface.setAttribute('opacity',String(amount));after();});}
    function addOil(){if(phase!=='oil')return;pour(oilSurface,.75,()=>setPhase('pot'));}
    function addMix(){if(phase!=='mix'||paused||locked)return;locked=true;cancelIdle();controls.querySelector('.cook-mix')?.blur();run(900,p=>{for(let i=0;i<ingredientNodes.length;i++){const delay=(i%12)*.018;const travel=ease(Math.max(0,Math.min(1,(p-delay)/(1-delay))));poseIngredient(ingredientNodes[i],ingredientPieces[i],travel);if(travel>0)ingredientNodes[i].dataset.ingredientLocation='moving';}plate.setAttribute('opacity',String(1-ease(p)));},()=>{for(let i=0;i<ingredientNodes.length;i++){poseIngredient(ingredientNodes[i],ingredientPieces[i],1);ingredientNodes[i].dataset.ingredientLocation='pot';}plate.setAttribute('opacity','0');setPhase('broth');});}
    function addBroth(){if(phase!=='broth')return;pour(brothSurface,.78,()=>setPhase('simmer'));}
    function addSesame(){if(phase!=='sesame')return;pour(glaze,.13,()=>{cookedSprites.forEach(node=>node.style.filter='brightness(1.04) saturate(1.08)');setPhase('zao');});}
    function addZao(){if(phase!=='zao')return;pour(glaze,.18,()=>{cookedSprites.forEach(node=>node.style.filter='brightness(1.03) saturate(1.15) sepia(.04)');setPhase('done');onStatus?.('鸡油炸、鸡汤煨干，香油与糟油已调入。');});}
    function transfer(id){if(phase!=='pot'||paused||destroyed||locked)return;const next=HonglouEggplantPot.beginTransfer(state,id);if(!next.accepted)return;state=next.state;locked=true;cancelIdle();const item=byId.get(id);item.node.dataset.location='moving';item.node.style.cursor='default';const hit=item.node.querySelector('.pot-piece-hit');if(hit){hit.blur();hit.setAttribute('tabindex','-1');hit.style.pointerEvents='none';}const from=platePose(item),to=potPose(item);run(570,p=>interpolate(item,from,to,p),()=>{state=HonglouEggplantPot.finishTransfer(state,id).state;item.node.dataset.location='pot';locked=false;const n=HonglouEggplantPot.counts(state);onStatus?.(`已放入 ${n.pot} 段茄子。`);if(n.pot===4){locked=true;run(620,()=>{},()=>{state=HonglouEggplantPot.enterHeat(state);setPhase('fry');});}else scheduleIdle();});}
    const cookedTextures=[],cookedVolumes=[],cookedSprites=[],rawVisuals=[];
    const cookedCells=[{box:[163,63,576,379],size:[290,205],centerY:472},{box:[908,75,551,366],size:[294,188],centerY:472},{box:[229,511,498,367],size:[265,195],centerY:552},{box:[912,516,569,373],size:[295,194],centerY:552}];
    for(const item of segments){item.node.dataset.location='staging';item.node.style.pointerEvents='none';const shape=item.node.querySelector('g[clip-path="url(#eggplant-outline)"]');shape?.setAttribute('filter','url(#cook-soften)');if(item.index===3)shape?.setAttribute('mask','url(#pot-calyx-clean)');const texture=svg('image',{href:'assets/eggplant-pot/cooked-eggplant-texture-v1.png',x:395,y:384,width:810,height:265,preserveAspectRatio:'none',opacity:0,'pointer-events':'none'});texture.style.filter='brightness(.95) saturate(1.1)';shape?.append(texture);cookedTextures.push(texture);const volume=svg('rect',{x:395,y:384,width:810,height:265,fill:'url(#cook-volume)',opacity:0,'pointer-events':'none'});shape?.append(volume);cookedVolumes.push(volume);
      const cell=cookedCells[item.index],center=(item.from+item.to)/2;
      const cooked=svg('svg',{class:'cook-piece-art',x:center-cell.size[0]/2,y:cell.centerY-cell.size[1]/2,width:cell.size[0],height:cell.size[1],viewBox:cell.box.join(' '),preserveAspectRatio:'none',overflow:'hidden',opacity:0,'pointer-events':'none'});
      cooked.append(svg('image',{href:'assets/eggplant-pot/cooked-segments-v1.png',x:0,y:0,width:1672,height:941,preserveAspectRatio:'none'}));
      item.node.append(cooked);cookedSprites.push(cooked);rawVisuals.push([item.node.querySelector('g[clip-path^="url(#cut-piece-"]'),...item.node.querySelectorAll('.eggplant-face')]);
      const hit=svg('rect',{x:item.from,y:397,width:item.to-item.from,height:249,fill:'transparent','pointer-events':'all',class:'pot-piece-hit','data-pot-piece':item.id,role:'button',tabindex:0,'aria-label':`将第 ${item.index+1} 段茄子放入锅中`});hit.addEventListener('click',()=>transfer(item.id));hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();transfer(item.id);}});item.node.append(hit);}
    function setCooked(amount){cleanDefs.querySelector('#cook-warp-strength').setAttribute('scale',String(amount*20));for(let i=0;i<segments.length;i++){const item=segments[i],blend=Math.min(1,amount/.8),finish=Math.max(0,Math.min(1,(amount-.6)/.4));cookedTextures[i].setAttribute('opacity',String(Math.min(.96,amount*.96)));cookedVolumes[i].setAttribute('opacity',String(amount));for(const raw of rawVisuals[i])raw?.setAttribute('opacity',String(1-blend));cookedSprites[i].setAttribute('opacity',String(blend));cookedSprites[i].style.filter=`brightness(${(1.18-finish*.18).toFixed(2)}) saturate(${(.78+finish*.22).toFixed(2)})`;pose(item,potTargets[i],.61,amount);}}
    function tickClock(now){
      if(destroyed)return;
      if(clockLast!==null&&!paused&&(phase==='fry'||phase==='simmer')){
        const dt=Math.min(80,now-clockLast),zone=HonglouEggplantPot.heatZone(phase);
        progress=HonglouEggplantPot.advanceHeat(progress,dt,heat,phase);
        const meter=controls.querySelector('.cook-heat-progress');
        if(meter)meter.setAttribute('width',String((zone.max-zone.min)*3.05*progress));
        if(heat>=zone.min&&heat<=zone.max){
          if(phase==='fry'){
            bubbles.setAttribute('opacity',String(.16+Math.sin(progress*Math.PI)*.48));
            oilSurface.setAttribute('opacity',String(.75-progress*.59));setCooked(progress*.8);
          }else{
            brothSurface.setAttribute('opacity',String(.78*Math.pow(1-progress,1.3)));
            brothSurface.setAttribute('rx',String(245-progress*102));brothSurface.setAttribute('ry',String(152-progress*66));
            oilSurface.setAttribute('opacity',String(.16-progress*.12));setCooked(.8+progress*.2);
            glaze.setAttribute('opacity',String(progress*.08));
            ingredientNodes.forEach(node=>{node.style.filter=`sepia(${(progress*.12).toFixed(2)}) saturate(${(1+progress*.1).toFixed(2)})`;});
          }
          if(progress>=1){
            if(phase==='fry'){bubbles.setAttribute('opacity','.1');setCooked(.8);setPhase('mix');}
            else{brothSurface.setAttribute('opacity','0');oilSurface.setAttribute('opacity','.04');setCooked(1);setPhase('sesame');}
          }
        }
      }
      clockLast=now;clock=requestAnimationFrame(tickClock);
    }
    clock=requestAnimationFrame(tickClock);
    run(700,p=>{base.setAttribute('opacity',String(Math.min(1,p*2.2)));for(const item of segments)interpolate(item,cutPose(item),platePose(item),p);},()=>{for(const item of segments){item.node.dataset.location='plate';item.node.style.cursor='pointer';}setPhase('oil');});
    return {get state(){return state;},get phase(){return phase;},setPaused(value){paused=value;dragging=false;cancelIdle();if(!value)scheduleIdle();},destroy(){destroyed=true;cancelIdle();if(raf)cancelAnimationFrame(raf);if(clock)cancelAnimationFrame(clock);canvas.removeEventListener('pointerdown',activity);canvas.removeEventListener('pointermove',activity);base.remove();ingredientsBack.remove();toppings.remove();controls.remove();hint.remove();cleanDefs.remove();}};
  }
  root.HonglouEggplantPotView={mountEggplantPot};
})(window);
