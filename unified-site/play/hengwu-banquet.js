(() => {
  'use strict';
  const ids = ['crab','wine','platter','crab_basket','cup','osmanthus','grape','pomegranate','peach','pear','lychee'];
  const names = {crab:'螃蟹',wine:'酒坛',platter:'果碟',crab_basket:'蟹篓',cup:'酒杯',osmanthus:'桂花枝',grape:'葡萄',pomegranate:'石榴',peach:'桃',pear:'梨',lychee:'荔枝'};
  const $ = selector => document.querySelector(selector);
  const cabinet = $('#cabinet');
  let board = [], selected = -1, done = 0, seconds = 0, paused = true, resolving = false, timer;
  let pointerDrag = null, audioContext = null, suppressClick = false;
  const iconPath = id => `assets/hengwu-goods/${id}.png`;
  function readyAudio() {
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    } catch (_) { /* Sound is optional. */ }
  }
  function chime() {
    if (!audioContext || audioContext.state !== 'running') return;
    try {
      const now = audioContext.currentTime;
      const gain = audioContext.createGain();
      const tone = audioContext.createOscillator();
      tone.type = 'sine';
      tone.frequency.setValueAtTime(880, now);
      tone.frequency.exponentialRampToValueAtTime(1175, now + .09);
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(.18, now + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, now + .24);
      tone.connect(gain).connect(audioContext.destination);
      tone.start(now); tone.stop(now + .25);
    } catch (_) { /* Never interrupt a match for audio. */ }
  }
  function endDrag() {
    if (!pointerDrag) return;
    pointerDrag.source?.classList.remove('drag-source');
    pointerDrag.preview?.remove();
    pointerDrag = null;
  }
  function beginDrag(event, index, slot) {
    if (paused || resolving || !board[index] || event.button > 0) return;
    readyAudio();
    pointerDrag = { index, source: slot, pointerId: event.pointerId, x: event.clientX, y: event.clientY, active: false };
    slot.setPointerCapture(event.pointerId);
  }
  function dragMove(event) {
    const drag = pointerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.active && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 6) return;
    if (!drag.active) {
      const image = drag.source.querySelector('img');
      if (!image) return;
      drag.preview = document.createElement('img');
      drag.preview.src = iconPath(board[drag.index]);
      drag.preview.alt = '';
      drag.preview.draggable = false;
      drag.preview.className = 'drag-preview';
      const rect = image.getBoundingClientRect();
      drag.preview.style.width = `${rect.width}px`;
      drag.preview.style.height = `${rect.height}px`;
      document.body.append(drag.preview);
      drag.source.classList.add('drag-source');
      drag.active = true;
    }
    event.preventDefault();
    drag.preview.style.left = `${event.clientX}px`;
    drag.preview.style.top = `${event.clientY}px`;
  }
  function dragEnd(event) {
    const drag = pointerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const target = drag.active ? document.elementFromPoint(event.clientX, event.clientY)?.closest('.slot') : null;
    const destination = target ? Number(target.dataset.index) : -1;
    if (drag.active) {
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
    }
    endDrag();
    if (destination >= 0) move(drag.index, destination);
  }
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  function update() {
    $('#count').textContent = done;
    $('#total').textContent = ids.length;
    $('#bar').style.width = `${done / ids.length * 100}%`;
  }
  function render() {
    cabinet.replaceChildren();
    for (let shelfIndex = 0; shelfIndex < 12; shelfIndex++) {
      const shelf = document.createElement('div');
      shelf.className = 'shelf';
      for (let position = 0; position < 3; position++) {
        const index = shelfIndex * 3 + position;
        const id = board[index];
        const slot = document.createElement('button');
        slot.type = 'button';
        slot.className = `slot${id ? '' : ' empty'}${selected === index ? ' selected' : ''}`;
        slot.dataset.index = index;
        slot.setAttribute('aria-label', `${id ? names[id] : '空位'}，第${shelfIndex + 1}格柜第${position + 1}位`);
        if (id) {
          const icon = document.createElement('img');
          icon.className = 'icon';
          icon.src = iconPath(id);
          icon.alt = '';
          icon.draggable = false;
          slot.append(icon);
        }
        slot.addEventListener('click', () => { if (!suppressClick) select(index); });
        slot.draggable = false;
        slot.addEventListener('dragstart', event => event.preventDefault());
        slot.addEventListener('pointerdown', event => beginDrag(event, index, slot));
        slot.addEventListener('pointermove', dragMove);
        slot.addEventListener('pointerup', dragEnd);
        slot.addEventListener('pointercancel', endDrag);
        slot.addEventListener('lostpointercapture', endDrag);
        shelf.append(slot);
      }
      cabinet.append(shelf);
    }
  }
  document.addEventListener('dragstart', event => event.preventDefault());
  window.addEventListener('blur', endDrag);
  document.addEventListener('visibilitychange', () => { if (document.hidden) endDrag(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') endDrag(); });
  function select(index) {
    if (paused || resolving) return;
    if (board[index]) {
      selected = index;
      render();
      $('#status').textContent = `已选中${names[board[index]]}，请点空位或拖动放置。`;
    } else if (selected >= 0) move(selected, index);
  }
  function move(from, to) {
    if (paused || resolving || from < 0 || from === to || !board[from] || board[to]) return;
    board[to] = board[from];
    board[from] = null;
    selected = -1;
    const first = Math.floor(to / 3) * 3;
    const group = board.slice(first, first + 3);
    if (group[0] && group.every(id => id === group[0])) {
      const name = names[group[0]];
      resolving = true;
      render();
      const matched = [...cabinet.querySelectorAll('.slot')].slice(first, first + 3);
      matched.forEach(slot => slot.classList.add('match-burst'));
      chime();
      setTimeout(() => {
        board.splice(first, 3, null, null, null);
        done++;
        resolving = false;
        update();
        $('#status').textContent = `${name}三件已整理！`;
        render();
        if (done === ids.length) {
          paused = true;
          clearInterval(timer);
          show('宴席物件已备齐', '宝钗与湘云筹备的螃蟹、酒与果碟已整理妥当。具体水果与柜格操作为游戏改编。', '再玩一次', start, true);
        }
      }, 360);
      return;
    } else $('#status').textContent = '继续移动，让同一柜格凑齐三件相同物件。';
    render();
  }
  function show(title, description, action, callback, allowContinue = false) {
    $('#modal-continue').hidden = !allowContinue;
    $('#modal-title').textContent = title;
    $('#modal-text').textContent = description;
    $('#modal-action').textContent = action;
    $('#modal-action').onclick = callback;
    $('#modal').hidden = false;
  }
  function start() {
    readyAudio();
    endDrag();
    resolving = false;
    board = shuffle(ids.flatMap(id => [id, id, id]).concat([null, null, null]));
    done = 0;
    seconds = 0;
    selected = -1;
    paused = false;
    $('#time').textContent = '00:00';
    $('#modal').hidden = true;
    $('#modal-continue').hidden = true;
    update();
    render();
    clearInterval(timer);
    timer = setInterval(() => {
      if (!paused) {
        seconds++;
        $('#time').textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
      }
    }, 1000);
  }
  $('#modal-action').onclick = start;
  $('#restart').onclick = start;
  $('#pause').onclick = () => {
    if (paused || resolving) return;
    endDrag();
    paused = true;
    show('游戏暂停', '已暂停计时与移动。', '继续游戏', () => {
      $('#modal').hidden = true;
      paused = false;
    });
  };
  $('#shuffle').onclick = () => {
    if (paused || resolving) return;
    endDrag();
    const filled = shuffle(board.filter(Boolean));
    board = shuffle(filled.concat(Array(36 - filled.length).fill(null)));
    selected = -1;
    render();
    $('#status').textContent = '柜格已重排。';
  };
  $('#hint').onclick = () => {
    if (paused) return;
    if (resolving) return;
    endDrag();selected=-1;render();
    const hint=CabinetHint.find(board);
    if(!hint)return;
    const cells=cabinet.querySelectorAll('.slot');
    board.forEach((id,index)=>{if(id===hint.id)cells[index].classList.add('hint');});
  };
})();
