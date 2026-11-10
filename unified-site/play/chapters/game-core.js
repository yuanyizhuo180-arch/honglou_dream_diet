(function(root){
  const presets=Object.freeze({
    oux:{targets:{crab:3,vinegar:2,chopsticks:2,tea:1},traps:['rice','honey','bamboo']},
    xiao:{targets:{nest:2,sugar:2,pot:1,bowl:1},traps:['crab','caltrop','vinegar']}
  });
  function createGame(preset){return {counts:Object.fromEntries(Object.keys(preset.targets).map(id=>[id,0])),mistakes:0,status:'playing'};}
  function catchItem(preset,state,id){
    if(state.status!=='playing')return state;
    const counts={...state.counts};let mistakes=state.mistakes;
    if(Object.hasOwn(preset.targets,id)&&counts[id]<preset.targets[id])counts[id]++;else mistakes++;
    const status=mistakes>=3?'lost':Object.keys(preset.targets).every(key=>counts[key]===preset.targets[key])?'won':'playing';
    return {counts,mistakes,status};
  }
  function chooseDrop(preset,state,random=Math.random){
    const needed=Object.keys(preset.targets).filter(id=>state.counts[id]<preset.targets[id]);
    if(!needed.length)return preset.traps[Math.floor(random()*preset.traps.length)];
    const pool=random()<.74?needed:preset.traps;
    return pool[Math.floor(random()*pool.length)];
  }
  const api={presets,createGame,catchItem,chooseDrop};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChapterGameCore=api;
})(typeof globalThis!=='undefined'?globalThis:window);
