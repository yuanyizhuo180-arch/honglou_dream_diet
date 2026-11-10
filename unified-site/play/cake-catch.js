(function (root) {
  const ingredients = [
    { id: 'chestnut', name: '栗子', icon: '🌰', goal: 3 },
    { id: 'rice', name: '糯米粉', icon: '🍚', goal: 2 },
    { id: 'osmanthus', name: '干桂花', icon: '🌼', goal: 2 },
    { id: 'honey', name: '蜜水', icon: '🍯', goal: 1 }
  ];
  const distractions = [
    { id: 'waterchestnut', name: '红菱', icon: '🍒' },
    { id: 'pepper', name: '辣椒', icon: '🌶️' }
  ];
  const goals = Object.fromEntries(ingredients.map(item => [item.id, item.goal]));

  function createState() {
    return { counts: Object.fromEntries(ingredients.map(item => [item.id, 0])), mistakes: 0, status: 'playing' };
  }
  function catchItem(state, id) {
    if (state.status !== 'playing') return state;
    const counts = { ...state.counts };
    let mistakes = state.mistakes;
    if (Object.hasOwn(goals, id) && counts[id] < goals[id]) counts[id]++;
    else mistakes++;
    const status = mistakes >= 3 ? 'lost' : ingredients.every(item => counts[item.id] === item.goal) ? 'won' : 'playing';
    return { counts, mistakes, status };
  }

  function mount(container, { onStatus = () => {}, onComplete = () => {} } = {}) {
    let state = createState(), lane = 1, drops = [], raf = 0, lastFrame = 0, spawnClock = 0;
    let paused = false, disposed = false, nextId = 0;
    container.innerHTML = `<div class="cake-scene">
      <div class="cake-side cake-side-left" aria-hidden="true"></div>
      <div class="cake-side cake-side-right" aria-hidden="true"></div>
      <div class="cake-stage">
        <div class="cake-order"><div class="cake-order-title"><span>袭人的备料单</span><small>接齐食材，备好栗粉糕 · 游戏拟制配方</small></div><div class="cake-goals"></div><div class="cake-hearts" aria-label="接错次数"></div></div>
        <div class="cake-lanes" aria-label="三条食材落下的轨道"><div class="cake-lane"></div><div class="cake-lane"></div><div class="cake-lane"></div><div class="cake-drops"></div></div>
        <div class="cake-counter"><div class="cake-dish" aria-label="接食材的碟子"><div class="cake-dish-inner">🥣</div></div><div class="cake-lane-buttons"><button type="button" data-lane="0" aria-label="移动碟子到左侧轨道">左</button><button type="button" data-lane="1" aria-label="移动碟子到中间轨道">中</button><button type="button" data-lane="2" aria-label="移动碟子到右侧轨道">右</button></div></div>
        <div class="cake-overlay" hidden><div class="cake-overlay-card"><strong></strong><p></p><button type="button">重新备料</button></div></div>
      </div>
    </div>`;
    const scene = container.querySelector('.cake-scene');
    const stage = scene.querySelector('.cake-stage');
    const dropsLayer = scene.querySelector('.cake-drops');
    const dish = scene.querySelector('.cake-dish');
    const overlay = scene.querySelector('.cake-overlay');
    const hearts = scene.querySelector('.cake-hearts');
    const goalBox = scene.querySelector('.cake-goals');
    const laneButtons = [...scene.querySelectorAll('[data-lane]')];
    const renderStatus = () => {
      goalBox.innerHTML = ingredients.map(item => `<div class="cake-goal ${state.counts[item.id] === item.goal ? 'complete' : ''}"><span class="cake-goal-icon">${item.icon}</span><span>${item.name}</span><strong>${state.counts[item.id]}／${item.goal}</strong></div>`).join('');
      hearts.textContent = `${'♥'.repeat(3 - state.mistakes)}${'♡'.repeat(state.mistakes)}`;
      hearts.setAttribute('aria-label', `还可接错 ${3 - state.mistakes} 次`);
    };
    const setLane = value => {
      lane = Math.max(0, Math.min(2, value));
      dish.style.setProperty('--lane', lane);
      laneButtons.forEach((button, index) => button.classList.toggle('active', index === lane));
    };
    const availableTargets = () => ingredients.filter(item => state.counts[item.id] < item.goal);
    function spawn() {
      if (state.status !== 'playing') return;
      const needs = availableTargets();
      const pool = Math.random() < .72 ? needs : distractions;
      const item = pool[Math.floor(Math.random() * pool.length)];
      const dropLane = Math.floor(Math.random() * 3);
      const el = document.createElement('div');
      el.className = `cake-drop ${Object.hasOwn(goals, item.id) ? 'wanted' : 'other'}`;
      el.innerHTML = `<span class="cake-drop-icon">${item.icon}</span><span class="cake-drop-name">${item.name}</span>`;
      el.style.setProperty('--lane', dropLane);
      dropsLayer.append(el);
      drops.push({ id: ++nextId, item, lane: dropLane, y: -90, el });
    }
    function clearDrops() { drops.forEach(drop => drop.el.remove()); drops = []; }
    function reset() {
      clearDrops(); state = createState(); spawnClock = 0; overlay.hidden = true;
      setLane(1); renderStatus(); onStatus('左右移动碟子，接齐四种食材。漏接不扣机会。');
    }
    function receive(drop) {
      const before = state;
      state = catchItem(state, drop.item.id);
      renderStatus();
      if (state.mistakes > before.mistakes) {
        stage.classList.remove('cake-good'); stage.classList.add('cake-error');
        setTimeout(() => stage.classList.remove('cake-error'), 350);
        onStatus(`接错了：${drop.item.name}。还可接错 ${3 - state.mistakes} 次。`);
      } else {
        stage.classList.remove('cake-error'); stage.classList.add('cake-good');
        setTimeout(() => stage.classList.remove('cake-good'), 350);
        onStatus(`${drop.item.name}已接好：${state.counts[drop.item.id]}／${goals[drop.item.id]}。`);
      }
      if (state.status === 'lost') {
        overlay.hidden = false;
        overlay.querySelector('strong').textContent = '食材接错三次';
        overlay.querySelector('p').textContent = '再试一次，备齐栗粉糕的四样材料。';
      } else if (state.status === 'won') {
        clearDrops(); onStatus('四样材料已备齐！'); onComplete();
      }
    }
    function frame(time) {
      if (disposed) return;
      const dt = Math.min((time - (lastFrame || time)) / 1000, .05); lastFrame = time;
      if (!paused && state.status === 'playing') {
        spawnClock += dt;
        if (spawnClock >= 1.25) { spawnClock = 0; spawn(); }
        const height = dropsLayer.clientHeight;
        for (const drop of [...drops]) {
          if (state.status !== 'playing') break;
          drop.y += Math.max(145, height * .32) * dt;
          drop.el.style.transform = `translateY(${drop.y}px)`;
          if (drop.y >= height - 92) {
            drop.el.remove(); drops = drops.filter(entry => entry !== drop);
            if (drop.lane === lane) receive(drop);
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }
    function pointerLane(event) {
      if (paused || state.status !== 'playing') return;
      const box = stage.getBoundingClientRect();
      setLane(Math.floor(3 * (event.clientX - box.left) / box.width));
    }
    function onKey(event) {
      if (paused || state.status !== 'playing') return;
      if (event.key === 'ArrowLeft' || event.key === 'a') { event.preventDefault(); setLane(lane - 1); }
      if (event.key === 'ArrowRight' || event.key === 'd') { event.preventDefault(); setLane(lane + 1); }
    }
    stage.addEventListener('pointerdown', pointerLane);
    stage.addEventListener('pointermove', event => { if (event.buttons || event.pointerType === 'touch') pointerLane(event); });
    laneButtons.forEach(button => button.addEventListener('click', () => setLane(Number(button.dataset.lane))));
    overlay.querySelector('button').addEventListener('click', reset);
    window.addEventListener('keydown', onKey);
    reset(); raf = requestAnimationFrame(frame);
    return {
      setPaused(value) { paused = value; lastFrame = 0; },
      destroy() { disposed = true; cancelAnimationFrame(raf); window.removeEventListener('keydown', onKey); clearDrops(); container.innerHTML = ''; }
    };
  }
  const api = { ingredients, goals, createState, catchItem, mount };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HonglouCakeCatch = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
