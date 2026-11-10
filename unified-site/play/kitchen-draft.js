const chapters = {
  soup: { title:'酸笋鸡皮汤', context:'第八回的汤，做成一段可亲手操作的食事。', story:'第八回，宝玉在薛姨妈处用饭，后来喝了酸筍雞皮湯。', source:'第八回', origin:'第八回记载宝玉在薛姨妈处喝酸筍雞皮湯。', detail:'工作底本：catalog-work/data/source/chapters/chapter-008.txt，第 53 行。原文记“作酸筍雞皮湯，寶玉痛喝了兩碗”。', ingredients:[['酸笋','bamboo'],['鸡皮','skin'],['桂花','flower']], required:['酸笋','鸡皮'], process:'将食材切细', piece:'筍', serve:'瓷盅', plate:'盛汤' },
  cake: { title:'桂花糖蒸新栗粉糕', context:'移动碟子，接齐栗粉糕的四样食材。', story:'第三十七回，袭人备了一碟桂花糖蒸新栗粉糕，托人送给史湘云。', source:'第三十七回', origin:'第三十七回写袭人备糕，宝玉送史湘云尝。', detail:'工作底本：catalog-work/data/source/chapters/chapter-037.txt，第 77 行。原文记“一碟子桂花糖蒸新栗粉糕”。', ingredients:[['新栗粉','chestnut'],['桂花糖','flower'],['酸笋','bamboo']], required:['新栗粉','桂花糖'], process:'拌匀糕粉', piece:'栗', serve:'食盒', plate:'装盒' },
  eggplant: { title:'茄鲞', context:'从案板到熟铁锅，体验一道繁复菜肴的简化过程。', story:'第四十一回，凤姐夹茄鮺给刘姥姥吃，并讲起做法。', source:'第四十一回', origin:'第四十一回写凤姐向刘姥姥说明茄鮺的做法。', detail:'工作底本：catalog-work/data/source/chapters/chapter-041.txt，第 5 行。原文有切丁、煨干、收存等描述；游戏步骤大幅简化。', ingredients:[['茄子','eggplant'],['香菌','mushroom'],['桂花','flower']], required:['茄子','香菌'], process:'将茄肉切丁', piece:'茄', serve:'瓷罐', plate:'收存' }
};
const $ = s => document.querySelector(s);
const ui = { title:$('#chapter-title'), context:$('#chapter-context'), select:$('#chapter-select'), story:$('#story-text'), source:$('#source-chapter'), count:$('#step-count'), stepTitle:$('#step-title'), instruction:$('#instruction'), field:$('#playfield'), ghost:$('#drag-ghost'), feedback:$('#feedback'), steps:$('#step-list'), help:$('#help-button'), result:$('#result'), kitchenHud:$('#kitchen-hud'), kitchenTitle:$('#kitchen-title'), kitchenProgress:$('#kitchen-progress'), kitchenStep:$('#kitchen-step'), kitchenInstruction:$('#kitchen-instruction'), kitchenFeedback:$('#kitchen-feedback'), finishImage:$('#eggplant-finish-image'), finishLabels:$('#eggplant-finish-labels'), finishPanel:$('#eggplant-finish-panel') };
const names = ['选料','加工','掌火','盛放'];
let key = new URLSearchParams(location.search).get('chapter'); if (!chapters[key]) key = 'soup';
let cakeCatchView = null;
let step = -1, placed = new Set(), selected = null, strokes = 0, heat = 0, cooking = 0, paused = false, timer = null, sequence = 0, transitioning = false, dialogueIndex = 0, eggplantCutView = null, eggplantPotView = null, eggplantPhase = null, finishPending = false, finishNavigating = false;
function syncKitchenHud(){ui.kitchenTitle.textContent=chapters[key].title;const eggplant=key==='eggplant';const stage=eggplantPhase==='cut'?1:['oil','pot'].includes(eggplantPhase)?2:3;const label=stage===1?'切块':stage===2?'入锅':eggplantPhase==='done'?'完成':'掌火';ui.kitchenProgress.textContent=key==='cake'?'备料关卡':eggplant?`第 ${stage} 步 · ${label}／共 3 步`:`第 ${step+1} 步／共 4 步`;ui.kitchenStep.textContent=eggplant?label:names[step]||'';ui.kitchenInstruction.textContent=ui.instruction.textContent;ui.kitchenFeedback.textContent=ui.feedback.textContent}
function setCookingMode(active){document.body.classList.toggle('is-cooking',active);ui.kitchenHud.hidden=!active;if(!active){document.body.classList.remove('is-eggplant-cut','is-eggplant-pot');paused=false;ui.field.inert=false;$('#kitchen-pause-panel').hidden=true;$('#kitchen-pause').textContent='暂停'}else syncKitchenHud()}
function setKitchenPaused(next){if(step<0||step>3)return;paused=next;ui.field.inert=next;eggplantCutView?.setPaused(next);eggplantPotView?.setPaused(next);$('#kitchen-pause-panel').hidden=!next;$('#kitchen-pause').textContent=next?'继续':'暂停';say(next?'游戏已暂停。':'继续游戏。')}
function say(message){ui.feedback.textContent=message;if(document.body.classList.contains('is-cooking'))ui.kitchenFeedback.textContent=message}
function setSteps(){if(key==='cake'){ui.steps.innerHTML=step===4?'<li class="done">材料备齐</li>':'<li class="current">接取食材</li>';return}ui.steps.innerHTML=names.map((n,i)=>`<li class="${i<step?'done':i===step?'current':''}" ${i===step?'aria-current="step"':''}>${i+1}　${n}</li>`).join('')}
function stopTimer(){if(timer){clearInterval(timer);timer=null}}
function setChapter(next,{story=false}={}){sequence++;finishPending=false;finishNavigating=false;ui.finishPanel.hidden=true;ui.finishImage.hidden=true;ui.finishLabels.setAttribute('hidden','');ui.field.inert=false;document.body.classList.remove('is-cake-catch','is-eggplant-finished','is-eggplant-epilogue');stopTimer();eggplantPotView?.destroy();eggplantPotView=null;eggplantCutView?.destroy();eggplantCutView=null;ui.field.classList.remove('is-eggplant-cut','is-eggplant-pot');eggplantPhase=null;cakeCatchView?.destroy();cakeCatchView=null;key=next;step=-1;transitioning=false;dialogueIndex=0;placed=new Set();selected=null;strokes=0;heat=0;cooking=0;paused=false;ui.select.value=key;ui.result.hidden=true;$('#source-detail').hidden=true;const c=chapters[key];ui.title.textContent=c.title;ui.context.textContent=c.context;ui.story.textContent=c.story;ui.source.textContent=c.source;const url=new URL(location.href);url.searchParams.set('chapter',key);if(story)url.searchParams.set('story','1');else url.searchParams.delete('story');history.replaceState(null,'',url);if(key==='eggplant'&&!story){step=1;render()}else showIntro()}
function showIntro(){
  setCookingMode(false);
  const story=HonglouStory.getStory(key);
  const line=HonglouStory.getLine(key, dialogueIndex);
  const last=dialogueIndex===story.lines.length-1;
  ui.count.textContent=`剧情对话 · ${dialogueIndex+1}／${story.lines.length}`;
  ui.stepTitle.textContent='食事开场';
  ui.instruction.textContent='点击继续阅读简短剧情，随后进入烹饪。';
  ui.field.innerHTML=`<div class="story-scene"><div class="character-mark" aria-hidden="true"></div><div class="story-content"><p class="story-source">原著情境 · ${chapters[key].source}</p><p class="story-fact"></p><p class="story-label"></p><h3 class="dialogue-line"></h3><p class="dialogue-progress"></p><button class="game-button" id="next-dialogue" type="button"></button></div></div>`;
  $('.character-mark').textContent=line.speaker.slice(0,1);
  $('.story-fact').textContent=story.sourceFact;
  $('.story-label').textContent=`${story.label} · ${line.speaker}`;
  $('.dialogue-line').textContent=line.text;
  $('.dialogue-progress').textContent=`${dialogueIndex+1} / ${story.lines.length}`;
  $('#next-dialogue').textContent=last?'进入小灶':'继续';
  $('#next-dialogue').onclick=()=>{if(last){step=0;render()}else{dialogueIndex++;showIntro()}};
  setSteps();
  say('对白是游戏改编草稿，可在后续一起细化。');
}
function finishStep(){if(transitioning)return;transitioning=true;stopTimer();const at=++sequence;say(`${names[step]}完成`);function advance(){if(at!==sequence)return;if(paused){setTimeout(advance,100);return}step++;transitioning=false;if(step===4)showResult();else render()}setTimeout(advance,500)}
function render(){if(key==='cake'){renderCakeCatch();return}if(step!==1){eggplantPotView?.destroy();eggplantPotView=null;eggplantCutView?.destroy();eggplantCutView=null;eggplantPhase=null}setCookingMode(true);ui.field.classList.remove('is-eggplant-cut','is-eggplant-pot');document.body.classList.remove('is-eggplant-cut','is-eggplant-pot');setSteps();ui.count.textContent=`第 ${step+1} 步／共 4 步`;ui.stepTitle.textContent=names[step];if(step===0)renderIngredients();if(step===1)renderProcess();if(step===2)renderHeat();if(step===3)renderPlate();syncKitchenHud()}
function renderCakeCatch(){setCookingMode(true);document.body.classList.add('is-cake-catch');setSteps();ui.count.textContent='备料关卡';ui.stepTitle.textContent='接取食材';ui.instruction.textContent='左右移动碟子，接齐四种食材；接错三次重试。';cakeCatchView?.destroy();cakeCatchView=HonglouCakeCatch.mount(ui.field,{onStatus:say,onComplete(){const at=sequence;cakeCatchView?.destroy();cakeCatchView=null;step=4;setTimeout(()=>{if(at===sequence&&key==='cake')showResult()},450)}});syncKitchenHud()}
function dragItem(el,target,onDrop,onTap){let start=null,moved=false;el.addEventListener('pointerdown',e=>{if(el.disabled)return;start={x:e.clientX,y:e.clientY};moved=false;ui.ghost.textContent=el.dataset.dragLabel||el.textContent.trim();ui.ghost.style.left=e.clientX+'px';ui.ghost.style.top=e.clientY+'px';ui.ghost.hidden=false;e.preventDefault()});window.addEventListener('pointermove',e=>{if(!start)return;moved ||= Math.hypot(e.clientX-start.x,e.clientY-start.y)>8;ui.ghost.style.left=e.clientX+'px';ui.ghost.style.top=e.clientY+'px';const box=target.getBoundingClientRect();target.classList.toggle('over',e.clientX>=box.left&&e.clientX<=box.right&&e.clientY>=box.top&&e.clientY<=box.bottom)});window.addEventListener('pointerup',e=>{if(!start)return;ui.ghost.hidden=true;target.classList.remove('over');const box=target.getBoundingClientRect();if(moved&&e.clientX>=box.left&&e.clientX<=box.right&&e.clientY>=box.top&&e.clientY<=box.bottom)onDrop();else if(!moved)onTap();else say('请把食材或工具拖到发亮的目标位置。');start=null});el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onTap()}})}
function renderIngredients(){const c=chapters[key];ui.instruction.textContent='把本章需要的两种食材拖入右侧器皿。';ui.field.innerHTML='<div class="tray"><span class="zone-title">食材盘</span><div class="ingredients" id="ingredients"></div></div><button class="drop-zone" id="ingredient-target" type="button"><span class="bowl"></span><strong>把食材放进来</strong><span id="drop-count">0／2</span></button>';const target=$('#ingredient-target');target.onclick=()=>{if(selected)placeIngredient(selected);else say('先拿起食材，再点器皿。')};for(const [name,art] of c.ingredients){const el=document.createElement('button');el.className='ingredient';el.type='button';el.dataset.dragLabel=name;el.innerHTML=`<span class="ingredient-art ${art}" aria-hidden="true"></span><span>${name}</span>`;$('#ingredients').append(el);dragItem(el,target,()=>placeIngredient(name),()=>{selected=name;say(`拿起${name}，现在点右侧器皿。`)});}say('拖动食材入器皿；也可以点食材，再点器皿。')}
function placeIngredient(name){const c=chapters[key];if(placed.has(name))return;if(!c.required.includes(name)){say(`${name}不属于这一轮的游戏材料，请换一种。`);return}placed.add(name);selected=null;[...document.querySelectorAll('.ingredient')].find(x=>x.dataset.dragLabel===name)?.classList.add('placed');$('#drop-count').textContent=`${placed.size}／${c.required.length}`;say(`${name}已入器皿。`);if(placed.size===c.required.length)finishStep()}
function renderProcess(){
  const c=chapters[key];strokes=0;
  if(key==='eggplant'){renderEggplantCut();return}
  ui.instruction.textContent=`在案板上划动鼠标或手指，完成${c.process}。`;
  ui.field.innerHTML=`<div class="board" id="board" role="button" tabindex="0" aria-label="在案板上加工食材"><span class="board-progress" id="board-progress">0／3</span><span class="board-food">${c.piece}</span><span class="cut-marks"><i></i><i></i><i></i></span><span class="board-hint">沿食材滑动三次 · 点按也可加工</span></div>`;
  const b=$('#board');let start=null;let didSwipe=false;
  b.addEventListener('pointerdown',e=>{start={x:e.clientX,y:e.clientY};didSwipe=false});
  b.addEventListener('pointerup',e=>{if(!start)return;const length=Math.hypot(e.clientX-start.x,e.clientY-start.y);if(length>40){didSwipe=true;processStroke();setTimeout(()=>{didSwipe=false},0)}start=null});
  b.addEventListener('click',()=>{if(!didSwipe)processStroke();didSwipe=false});
  b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();processStroke()}});
  say('在案板上连续划动三次。')
}
function renderEggplantCut(){
  eggplantPhase='cut';
  ui.field.classList.add('is-eggplant-cut');
  document.body.classList.add('is-eggplant-cut');
  ui.instruction.textContent='切块：将茄子分为四段';
  ui.count.textContent='第 1 步／共 3 步';ui.stepTitle.textContent='切块';
  ui.field.innerHTML='';
  eggplantCutView=HonglouEggplantCutView.mountEggplantCut(ui.field,{
    onStatus(message){ui.feedback.textContent=message},
    onComplete(){strokes=3;const at=sequence;setTimeout(function advance(){if(at!==sequence||step!==1||key!=='eggplant')return;if(paused){setTimeout(advance,100);return;}renderEggplantPot();},850)}
  });
}
function renderEggplantPot(){
  const handoff=eggplantCutView?.getPotHandoff();if(!handoff)return;
  step=2;eggplantPhase='oil';ui.field.classList.remove('is-eggplant-cut');document.body.classList.remove('is-eggplant-cut');
  ui.field.classList.add('is-eggplant-pot');document.body.classList.add('is-eggplant-pot');
  ui.instruction.textContent='入锅：先将鸡油倒入锅中';ui.count.textContent='第 2 步／共 3 步';ui.stepTitle.textContent='入锅';
  setSteps();syncKitchenHud();
  eggplantPotView=HonglouEggplantPotView.mountEggplantPot(handoff,{
    onStatus(message){ui.feedback.textContent=message;ui.kitchenFeedback.textContent=message},
    onPhase(phase,instruction){if(key!=='eggplant'||step!==2)return;eggplantPhase=phase;ui.instruction.textContent=instruction;ui.count.textContent=phase==='oil'||phase==='pot'?'第 2 步／共 3 步':'第 3 步／共 3 步';ui.stepTitle.textContent=phase==='oil'||phase==='pot'?'入锅':phase==='done'?'完成':'掌火';syncKitchenHud();if(phase==='done')scheduleEggplantFinish();}
  });
}
function scheduleEggplantFinish(){
  if(finishPending)return;
  finishPending=true;
  const at=sequence;
  setTimeout(function reveal(){
    if(at!==sequence||key!=='eggplant'||eggplantPhase!=='done')return;
    if(paused){setTimeout(reveal,100);return;}
    ui.finishImage.hidden=false;ui.finishLabels.removeAttribute('hidden');
    requestAnimationFrame(()=>{if(at!==sequence)return;document.body.classList.add('is-eggplant-finished');ui.field.inert=true;ui.finishPanel.hidden=false;$('#eggplant-replay').focus({preventScroll:true});finishPending=false;});
  },350);
}
function continueEggplantStory(){
  if(finishNavigating||key!=='eggplant'||eggplantPhase!=='done')return;
  finishNavigating=true;
  window.location.href='eggplant-story/story.html?scene=B1';
}
function processStroke(){
  if(step!==1||strokes>=3||transitioning||paused)return;
  strokes++;
  if(key!=='eggplant'){
    $('#board-progress').textContent=`${strokes}／3`;
    document.querySelectorAll('.cut-marks i')[strokes-1].classList.add('done');
    say(`${chapters[key].process}：${strokes}／3`)
  }
  if(strokes===3)finishStep()
}
function renderHeat(){heat=0;cooking=0;paused=false;ui.instruction.textContent='转动火候控制，让炉火保持适中，完成烹制。';ui.field.innerHTML='<div class="stove"><div class="burner"><div class="pot"></div><div id="flame" class="flame"></div></div><div class="stove-controls"><label for="heat-knob">火候 <output id="heat-value">0</output></label><input id="heat-knob" type="range" min="0" max="100" value="0"><p>绿色目标区：55–75</p><div class="cook-meter" aria-label="烹制进度"><span id="cook-fill"></span></div><p id="cook-caption">等待调火</p><div class="stove-buttons"><button id="pause-fire" type="button">暂停</button><button id="assist-fire" type="button">辅助调至适中</button></div></div></div>';const input=$('#heat-knob');input.addEventListener('input',()=>{heat=Number(input.value);updateFlame()});$('#pause-fire').onclick=()=>{paused=!paused;$('#pause-fire').textContent=paused?'继续':'暂停';say(paused?'已暂停，进度保持。':'继续掌火。')};$('#assist-fire').onclick=()=>{input.value=65;heat=65;updateFlame();say('已调至适中，保持一会儿即可。')};updateFlame();timer=setInterval(()=>{if(step!==2||paused)return;if(heat>=55&&heat<=75){cooking=Math.min(100,cooking+2);$('#cook-fill').style.width=cooking+'%';$('#cook-caption').textContent=`烹制中 ${cooking}%`;if(cooking>=100)finishStep()}else if(heat>75){$('#cook-caption').textContent='火太旺，调低一些';}else{$('#cook-caption').textContent='火偏小，调高一些'}},120);say('拖动火候条控制炉火；没有倒计时。')}
function updateFlame(){const f=$('#flame');if(!f)return;$('#heat-value').textContent=heat;f.style.opacity=String(.12+heat/120);f.style.transform=`scale(${.5+heat/85})`}
function renderPlate(){const c=chapters[key];ui.instruction.textContent=`把盛取工具拖向右侧${c.serve}。`;ui.field.innerHTML=`<div class="source-dish" aria-label="已完成的食物">${c.piece}</div><button id="serving-tool" class="serving-tool" type="button">盛取工具</button><button id="plate-target" class="drop-zone plate-zone" type="button"><span class="bowl"></span><strong>${c.serve}</strong></button>`;const target=$('#plate-target'),tool=$('#serving-tool');tool.dataset.dragLabel='盛取工具';dragItem(tool,target,()=>plateFood(),()=>{selected='tool';say(`拿起工具，再点右侧${c.serve}。`)});target.onclick=()=>{if(selected==='tool')plateFood();else say('先拿起盛取工具。')};say(`把工具拖向${c.serve}；也可以依次点工具与器皿。`)}
function plateFood(){if(step!==3)return;$('#plate-target').classList.add('done');selected=null;finishStep()}
function showResult(){document.body.classList.remove('is-cake-catch');setCookingMode(false);const c=chapters[key],story=HonglouStory.getStory(key);ui.count.textContent='制作完成';ui.stepTitle.textContent='食笺已点亮';ui.instruction.textContent='查看出处、再做一次，或返回地图。';ui.result.hidden=false;ui.steps.innerHTML=key==='cake'?'<li class="done">材料备齐</li>':names.map((n,i)=>`<li class="done">${i+1}　${n}</li>`).join('');$('#result-title').textContent=c.title;$('#result-copy').textContent=key==='cake'?'你接齐了栗子、糯米粉、干桂花和蜜水，帮袭人备好了材料。':`你完成了${c.title}的游戏制作。`;$('#ending-speaker').textContent=`${story.label} · 完成旁白`;$('#result-dialogue').textContent=HonglouStory.getEnding(key);$('#result-origin').textContent=c.origin;$('#source-detail').textContent=c.detail;say('制作完成。');ui.result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
ui.select.onchange=()=>setChapter(ui.select.value);ui.help.onclick=()=>{if(key==='cake'){say('左右移动碟子或点击左、中、右按钮；接齐食单数量，接错三次重试，漏接不扣机会。');return}const help=['先选食材并拖入器皿；也可点食材再点器皿。',key==='eggplant'?('从蓝色箭头上方开始，按箭头方向划到茄子下方。'):'在案板上滑动三次；点按或按 Enter 也可加工。',key==='eggplant'?(eggplantPhase==='oil'?'先点鸡油壶，再将四段茄子放入锅中。':eggplantPhase==='pot'?'点击菜盘里的茄子，每次放入一段。':eggplantPhase==='fry'||eggplantPhase==='simmer'?'拖动火候滑杆到绿色中火区，并保持至完成。':'按画面提示点击当前配料或调味容器。'):'拖动火候条至 55–75 并保持；可暂停或辅助调火。','拖动盛取工具到器皿；也可依次点工具和器皿。'];say(step<0?'点击继续阅读对白，读完即可进入厨房。':help[step]||'查看下方食笺。')};$('#kitchen-pause').onclick=()=>setKitchenPaused(!paused);$('#kitchen-resume').onclick=()=>setKitchenPaused(false);$('#kitchen-exit').onclick=()=>{if(key==='eggplant'){if(finishNavigating)return;finishNavigating=true;window.location.href='eggplant-story/story.html?scene=B1';return}window.location.href='/garden/'};$('#replay').onclick=()=>{setChapter(key);scrollTo({top:0,behavior:'smooth'})};$('#eggplant-replay').onclick=()=>{if(finishNavigating||key!=='eggplant'||eggplantPhase!=='done')return;finishNavigating=true;setChapter('eggplant')};$('#eggplant-continue').onclick=continueEggplantStory;$('#show-source').onclick=()=>{$('#source-detail').hidden=!$('#source-detail').hidden};setChapter(key,{story:new URLSearchParams(location.search).get('story')==='1'});
