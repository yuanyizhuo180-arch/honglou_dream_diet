(function () {
  const { targets, createGame, catchIngredient, chooseDrop } = window.CakeGameCore;
  const items = {
    chestnut: { name: '栗子', src: 'assets/cake-catch/chestnut.svg' },
    rice: { name: '糯米粉', src: 'assets/cake-catch/rice-flour.svg' },
    osmanthus: { name: '干桂花', src: 'assets/cake-catch/osmanthus.svg' },
    honey: { name: '蜜水', src: 'assets/cake-catch/honey-water.svg' },
    caltrop: { name: '红菱', src: 'assets/cake-catch/red-caltrop.svg' },
    foxnut: { name: '鸡头米', src: 'assets/cake-catch/fox-nut.svg' },
    bamboo: { name: '酸笋', src: 'assets/cake-catch/pickled-bamboo.svg' }
  };
  const game = document.getElementById('game');
  const column = document.getElementById('game-column');
  const zone = document.getElementById('play-zone');
  const catchZone = document.getElementById('catch-zone');
  const plate = document.getElementById('catch-plate');
  const dropsLayer = document.getElementById('drops');
  const goals = document.getElementById('goals');
  const mistakes = document.getElementById('mistakes');
  const status = document.getElementById('status');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCopy = document.getElementById('modal-copy');
  const modalAction = document.getElementById('modal-action');
  const modalContinue = document.getElementById('modal-continue');
  const pauseButton = document.getElementById('pause');
  const restartButton = document.getElementById('restart');
  const targetIds = Object.keys(targets);
  const lanes = [1 / 6, 1 / 2, 5 / 6];
  let state = createGame();
  let playing = false, paused = false, plateX = 0.5, drops = [], spawnTime = 0, previousTime = 0, held = 0, feedbackTimer = 0;

  function renderGoals() {
    goals.innerHTML = targetIds.map(id => {
      const item = items[id], done = state.counts[id] === targets[id];
      return `<div class="goal ${done ? 'done' : ''}"><img src="${item.src}" alt=""><span>${item.name}</span><strong>${state.counts[id]}／${targets[id]}</strong></div>`;
    }).join('');
    mistakes.textContent = `${'♥'.repeat(3 - state.mistakes)}${'♡'.repeat(state.mistakes)}`;
    mistakes.setAttribute('aria-label', `还可接错 ${3 - state.mistakes} 次`);
  }
  function setPlateX(value) {
    const margin = 95 / column.clientWidth;
    plateX = Math.max(margin, Math.min(1 - margin, value));
    plate.style.left = `${plateX * 100}%`;
  }
  function setFeedback(message, kind = '') {
    status.textContent = message;
    column.classList.remove('good', 'error');
    if (kind) column.classList.add(kind);
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => column.classList.remove('good', 'error'), 380);
  }
  function clearDrops() {
    for (const drop of drops) drop.element.remove();
    drops = [];
  }
  function showModal(title, copy, button, showContinue = false) {
    modalTitle.textContent = title;
    modalCopy.textContent = copy;
    modalAction.textContent = button;
    modalContinue.hidden = !showContinue;
    modal.hidden = false;
    modalAction.focus();
  }
  function start() {
    state = createGame();
    clearDrops();
    renderGoals();
    setPlateX(.5);
    spawnTime = 0;
    previousTime = 0;
    paused = false;
    playing = true;
    pauseButton.textContent = '暂停';
    pauseButton.setAttribute('aria-pressed', 'false');
    modal.hidden = true;
    setFeedback('接齐食材即可完成备料；漏接不扣机会。');
  }
  function spawn() {
    const id = chooseDrop(state);
    const lane = Math.floor(Math.random() * lanes.length);
    const item = items[id];
    const element = document.createElement('div');
    element.className = 'drop';
    element.dataset.id = id;
    element.innerHTML = `<img src="${item.src}" alt=""><span>${item.name}</span>`;
    dropsLayer.appendChild(element);
    drops.push({ id, lane, y: -105, element });
  }
  function receive(drop) {
    const before = state;
    state = catchIngredient(state, drop.id);
    renderGoals();
    if (state.mistakes > before.mistakes) {
      setFeedback(`接错了：${items[drop.id].name}。还可接错 ${3 - state.mistakes} 次。`, 'error');
    } else {
      setFeedback(`${items[drop.id].name}已接好：${state.counts[drop.id]}／${targets[drop.id]}`, 'good');
    }
    if (state.status === 'lost') {
      playing = false;
      clearDrops();
      showModal('需要重新备料', '已经接错三次。记住四样目标食材，再来一次。', '重新开始');
    } else if (state.status === 'won') {
      playing = false;
      clearDrops();
      showModal('四样食材已备齐', '栗子、糯米粉、干桂花和蜜水都已接好，袭人可以继续准备糕点了。', '再玩一次', true);
    }
  }
  function frame(time) {
    const dt = Math.min((time - (previousTime || time)) / 1000, .05);
    previousTime = time;
    if (playing && !paused) {
      if (held) setPlateX(plateX + held * dt * .6);
      spawnTime += dt;
      if (spawnTime >= 1.12) { spawnTime = 0; spawn(); }
      const height = zone.clientHeight;
      const speed = Math.max(175, height / 3.2);
      for (const drop of [...drops]) {
        if (!playing) break;
        drop.y += speed * dt;
        const x = lanes[drop.lane] * zone.clientWidth;
        drop.element.style.transform = `translate(${x - 54}px, ${drop.y}px)`;
        if (drop.y >= height - 68) {
          drop.element.remove();
          drops = drops.filter(item => item !== drop);
          const distance = Math.abs(x - plateX * zone.clientWidth);
          if (distance < 92) receive(drop);
        }
      }
    }
    requestAnimationFrame(frame);
  }
  function moveWithPointer(event) {
    if (!playing || paused) return;
    const rect = catchZone.getBoundingClientRect();
    setPlateX((event.clientX - rect.left) / rect.width);
  }
  window.addEventListener('pointermove', moveWithPointer, { passive: true });
  zone.addEventListener('pointerdown', moveWithPointer);
  catchZone.addEventListener('pointerdown', moveWithPointer);
  window.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') { event.preventDefault(); held = -1; }
    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') { event.preventDefault(); held = 1; }
    if (event.key === ' ' && playing) { event.preventDefault(); pauseButton.click(); }
  });
  window.addEventListener('keyup', event => {
    if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(event.key)) held = 0;
  });
  window.addEventListener('blur', () => { held = 0; if (playing && !paused) pauseButton.click(); });
  pauseButton.addEventListener('click', () => {
    if (!playing) return;
    paused = !paused;
    pauseButton.textContent = paused ? '继续' : '暂停';
    pauseButton.setAttribute('aria-pressed', String(paused));
    setFeedback(paused ? '已暂停' : '继续备料');
  });
  restartButton.addEventListener('click', start);
  modalAction.addEventListener('click', start);
  window.addEventListener('resize', () => setPlateX(plateX));
  renderGoals();
  setPlateX(.5);
  requestAnimationFrame(frame);
})();
