(function (root) {
  function createPotState(ids) {
    if (ids.length !== 4 || new Set(ids).size !== 4) throw new Error('入锅需要四段不同的茄子');
    return {stage:'pot', pieces:ids.map(id=>({id,location:'plate'}))};
  }
  function counts(state) {
    return {
      plate:state.pieces.filter(piece=>piece.location==='plate').length,
      moving:state.pieces.filter(piece=>piece.location==='moving').length,
      pot:state.pieces.filter(piece=>piece.location==='pot').length
    };
  }
  function change(state,id,from,to) {
    const piece=state.pieces.find(item=>item.id===id);
    if (!piece || piece.location!==from) return {accepted:false,state};
    return {accepted:true,state:{...state,pieces:state.pieces.map(item=>item.id===id?{...item,location:to}:item)}};
  }
  function beginTransfer(state,id) {
    if(state.stage!=='pot'||counts(state).moving) return {accepted:false,state};
    return change(state,id,'plate','moving');
  }
  function finishTransfer(state,id) {return change(state,id,'moving','pot');}
  function enterHeat(state) {
    return counts(state).pot===4?{...state,stage:'heat'}:state;
  }
  function heatZone(stage) {return stage==='simmer'?{min:32,max:48}:{min:52,max:68};}
  function advanceHeat(progress,elapsed,heat,stage) {
    const zone=heatZone(stage);
    return heat>=zone.min&&heat<=zone.max?Math.min(1,progress+elapsed/1500):0;
  }
  root.HonglouEggplantPot={createPotState,counts,beginTransfer,finishTransfer,enterHeat,heatZone,advanceHeat};
  if(typeof module!=='undefined') module.exports=root.HonglouEggplantPot;
})(typeof window==='undefined'?globalThis:window);
