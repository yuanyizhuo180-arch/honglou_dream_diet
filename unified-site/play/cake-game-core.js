(function (root) {
  const targets = Object.freeze({ chestnut: 3, rice: 2, osmanthus: 2, honey: 1 });
  const traps = Object.freeze(['caltrop', 'foxnut', 'bamboo']);
  const targetIds = Object.keys(targets);

  function createGame() {
    return { counts: Object.fromEntries(targetIds.map(id => [id, 0])), mistakes: 0, status: 'playing' };
  }

  function catchIngredient(state, id) {
    if (state.status !== 'playing') return state;
    const counts = { ...state.counts };
    let mistakes = state.mistakes;
    if (Object.hasOwn(targets, id) && counts[id] < targets[id]) counts[id]++;
    else mistakes++;
    const status = mistakes >= 3 ? 'lost' : targetIds.every(key => counts[key] === targets[key]) ? 'won' : 'playing';
    return { counts, mistakes, status };
  }

  function chooseDrop(state, random = Math.random) {
    const needed = targetIds.filter(id => state.counts[id] < targets[id]);
    if (!needed.length) return traps[Math.floor(random() * traps.length)];
    const list = random() < 0.74 ? needed : traps;
    return list[Math.floor(random() * list.length)];
  }

  const api = { targets, traps, createGame, catchIngredient, chooseDrop };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CakeGameCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
