(function (root) {
  // These short lines are provisional game adaptation, ready for script co-writing.
  const stories = {
    soup: {
      label: '游戏改编对白',
      sourceFact: '第八回记载宝玉在薛姨妈处喝酸筍雞皮湯。',
      lines: [
        { speaker: '薛姨妈', text: '席间备着一盅热汤，你可愿来帮忙？' },
        { speaker: '你', text: '我来试试，先把食材备齐。' },
        { speaker: '薛姨妈', text: '好。备好了，便到小灶前来。' }
      ],
      ending: '这一盅汤已盛好，可以端上席了。'
    },
    cake: {
      label: '游戏改编对白',
      sourceFact: '第三十七回写袭人备糕，宝玉送史湘云尝。',
      lines: [
        { speaker: '袭人', text: '这碟糕点要装好送去，你来搭把手可好？' },
        { speaker: '你', text: '好，我先把做糕的材料备齐。' },
        { speaker: '袭人', text: '栗子、糯米粉、干桂花和蜜水，都要备齐才好。' }
      ],
      ending: '材料已备齐，袭人接手蒸糕、装盒，准备托宋妈妈送去。'
    },
    eggplant: {
      label: '游戏改编对白',
      sourceFact: '第四十一回写凤姐夹茄鮺给刘姥姥，并向她说明做法。',
      lines: [
        { speaker: '刘姥姥', text: '这一口尝着新鲜，究竟怎样做出来的？' },
        { speaker: '王熙凤', text: '说来费工。你若想知道，不妨到案边亲手试试。' },
        { speaker: '你', text: '那我从备料开始。' }
      ],
      ending: '茄鲞已烹好。刘姥姥尝过这一口，才知其中费了许多工夫。'
    }
  };
  const getStory = id => stories[id] || null;
  const api = {
    getStory,
    getLine: (id, index) => getStory(id)?.lines[index] || null,
    getEnding: id => getStory(id)?.ending || null
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HonglouStory = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
