(function (root) {
  const LINES = [620, 900, 1150];
  function createEggplantCutState() {
    return { cuts:0, activeId:'whole', segments:[{id:'whole',from:395,to:1390,leftCut:false,rightCut:false}] };
  }
  function nextCut(state) { return LINES[state.cuts] ?? null; }
  function applyCut(state, line) {
    if (nextCut(state) !== line) return {accepted:false,reason:'不是当前切线',state};
    const active = state.segments.find(s => s.id === state.activeId);
    if (!active || line <= active.from || line >= active.to) return {accepted:false,reason:'切线不在活动段内',state};
    const left = {...active,id:`piece-${state.cuts}-left`,to:line,rightCut:true};
    const right = {...active,id:`piece-${state.cuts}-right`,from:line,leftCut:true};
    const index = state.segments.indexOf(active);
    const segments = [...state.segments.slice(0,index),left,right,...state.segments.slice(index+1)];
    return {accepted:true,reason:null,state:{cuts:state.cuts+1,activeId:right.id,segments}};
  }
  root.HonglouEggplantCut = { createEggplantCutState, nextCut, applyCut };
  if (typeof module !== 'undefined') module.exports = root.HonglouEggplantCut;
})(typeof window === 'undefined' ? globalThis : window);
