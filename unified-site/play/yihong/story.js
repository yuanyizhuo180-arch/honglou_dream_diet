const scenes = {
  A0: { next: "A1" },
  A1: { source: "原著引文 · 第三十七回", speaker: "袭人", line: "这一个缠丝白玛瑙碟子那去了？", xiren: "normal", next: "A2" },
  A2: { source: "原著引文 · 第三十七回", speaker: "晴雯", line: "给三姑娘送荔枝去的，还没送来呢。", qingwen: "smile", next: "A3" },
  A3: { source: "原著引文 · 第三十七回", speaker: "秋纹", line: "提起瓶来，我又想起笑话。", qiuwen: "smile", next: "A4" },
  A4: { source: "事实概述 · 第三十七回", speaker: "叙述", line: "秋纹说，宝玉曾把园中新开的桂花插成两瓶，分别送给贾母和王夫人。", qiuwen: "smile", next: "A5" },
  A5: { source: "事实概述 · 第三十七回", speaker: "叙述", line: "袭人备好两只小掐丝盒：一盒装红菱、鸡头，另一盒装一碟桂花糖蒸新栗粉糕。", xiren: "normal", song: "normal", next: "A6" },
  A6: { source: "原著引文 · 第三十七回", speaker: "袭人", line: "这都是今年咱们这里园里新结的果子，宝二爷送来与姑娘尝尝。", xiren: "smile", song: "normal", next: "A7" },
  A7: { source: "事实概述 · 第三十七回", speaker: "叙述", line: "袭人还托宋嬷嬷带去湘云喜欢的玛瑙碟，以及湘云先前托她做的活计。", xiren: "normal", song: "normal", next: "A8" },
  A8: { source: "原著引文 · 第三十七回", speaker: "袭人", line: "替我们请安，替二爷问好就是了。", xiren: "smile", song: "normal", next: "A9" },
  A9: { source: "游戏改编 · 想象试做", speaker: "我（游戏厨师）", line: "书中只写了这碟糕点，没有细说做法。我也想试做一份。", next: "A10" },
  A10: { source: "游戏改编 · 想象试做", speaker: "我（游戏厨师）", line: "从备料开始。", action: "开始烹饪" },
  B1: { source: "事实概述 · 第三十七回", speaker: "叙述", line: "宋嬷嬷带着礼物从后门出去。袭人提醒她，外面已有小子和车等着。", song: "normal", next: "B2" },
  B2: { source: "事实概述 · 第三十七回", speaker: "叙述", line: "宝玉回来，说起诗社。袭人告诉他，宋嬷嬷已经给湘云送东西去了。", xiren: "normal", baoyu: "normal", next: "B3" },
  B3: { source: "原著引文 · 第三十七回", speaker: "贾宝玉", line: "偏忘了他。", xiren: "normal", baoyu: "normal", next: "B4" },
  B4: { source: "事实概述 · 第三十七回", speaker: "叙述", line: "宝玉想起湘云：诗社若少了她，便少了意思。", xiren: "normal", baoyu: "smile", next: "B5" },
  B5: { source: "事实概述 · 第三十七回", speaker: "叙述", line: "袭人顾虑湘云在家不能自主，怕贸然说起诗社，反让她牵挂。", xiren: "normal", baoyu: "normal", next: "B6" },
  B6: { source: "事实概述 · 第三十七回", speaker: "叙述", line: "宝玉打算请贾母派人接湘云来。", baoyu: "smile", next: "B7" },
  B7: { source: "事实概述 · 第三十七回", speaker: "叙述", line: "宋嬷嬷回来，说湘云听闻众人起诗社却没有告诉她，很着急。", song: "normal", baoyu: "normal", next: "B8" },
  B8: { source: "事实概述 · 第三十七回", speaker: "叙述", line: "宝玉去请贾母接湘云。次日午后，湘云来到园中。", baoyu: "smile", action: "查看栗粉糕食笺" }
};

const stage = document.getElementById("stage");
const dialogue = document.getElementById("dialogue");
const action = document.getElementById("scene-cta");
const introAdvance = document.getElementById("intro-advance");
const portraits = Object.fromEntries(["xiren", "song", "baoyu", "qingwen", "qiuwen"].map(name => [name, document.querySelector(`.portrait.${name}`)]));
const portraitNames = { xiren: "袭人", song: "宋嬷嬷", baoyu: "贾宝玉", qingwen: "晴雯", qiuwen: "秋纹" };
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let currentId = "A0";
let transitioning = false;
let activeAnimations = [];
let transitionSerial = 0;

function sceneFromAddress() {
  const hashScene = /^#scene=(A(?:10|[0-9])|B[1-8])$/i.exec(window.location.hash)?.[1];
  const requested = (hashScene || new URLSearchParams(window.location.search).get("scene"))?.toUpperCase();
  return Object.hasOwn(scenes, requested) ? requested : "A0";
}

function rememberScene(id) {
  try { window.history.pushState({ scene: id }, "", `story.html?scene=${id}`); }
  catch { window.location.hash = `scene=${id}`; }
}

function setPortraits(scene) {
  for (const [name, portrait] of Object.entries(portraits)) {
    const version = scene[name];
    portrait.hidden = !version;
    if (version) {
      portrait.src = `assets/${name}-${version}.png`;
      portrait.alt = `${portraitNames[name]}${version === "smile" ? "微笑" : "正常"}立绘`;
    }
  }
}

function setSceneText(id) {
  const scene = scenes[id];
  document.title = "红楼小灶 · 桂花糖蒸新栗粉糕";
  document.getElementById("intro-content").hidden = id !== "A0";
  if (id !== "A0") {
    document.getElementById("scene-source").textContent = scene.source;
    document.getElementById("speaker").textContent = scene.speaker;
    document.getElementById("line").textContent = scene.line;
  }
  action.hidden = !scene.action;
  if (scene.action) {
    action.textContent = scene.action;
    action.disabled = id !== "A10" && id !== "B8";
    action.title = "";
  }
  document.getElementById("advance").hidden = !scene.next;
  if (scene.next && id !== "A0") {
    dialogue.tabIndex = 0;
    dialogue.setAttribute("role", "button");
    dialogue.setAttribute("aria-label", `继续到 ${scene.next}`);
  } else {
    dialogue.removeAttribute("tabindex");
    dialogue.removeAttribute("role");
    dialogue.removeAttribute("aria-label");
  }
}

function showScene(id) {
  currentId = id;
  stage.className = `stage story-stage ${id.toLowerCase()}`;
  setPortraits(scenes[id]);
  setSceneText(id);
  updateDialoguePosition();
}

function updateDialoguePosition() {
  const stageRect = stage.getBoundingClientRect();
  const dialogueRect = dialogue.getBoundingClientRect();
  stage.style.setProperty("--dialogue-top-offset", `${stageRect.bottom - dialogueRect.top}px`);
}

function preloadPortraits(scene) {
  return Promise.all(Object.keys(portraits).filter(name => scene[name]).map(name => new Promise(resolve => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = resolve;
    image.src = `assets/${name}-${scene[name]}.png`;
  })));
}

function oldPortraitCopies() {
  const stageRect = stage.getBoundingClientRect();
  return Object.entries(portraits).filter(([, portrait]) => !portrait.hidden).map(([name, portrait]) => {
    const rect = portrait.getBoundingClientRect();
    const copy = portrait.cloneNode();
    copy.className = "transition-portrait";
    copy.style.left = `${rect.left - stageRect.left}px`;
    copy.style.top = `${rect.top - stageRect.top}px`;
    copy.style.width = `${rect.width}px`;
    copy.style.height = `${rect.height}px`;
    copy.removeAttribute("hidden");
    stage.appendChild(copy);
    return { name, copy, rect };
  });
}

async function advanceScene() {
  const targetId = scenes[currentId].next;
  if (!targetId || transitioning) return;
  transitioning = true;
  const serial = ++transitionSerial;
  const target = scenes[targetId];
  try {
    await preloadPortraits(target);
    if (serial !== transitionSerial) return;
    if (reduceMotion.matches || !Element.prototype.animate) {
      showScene(targetId);
    } else {
      stage.classList.add("is-dialogue-fading");
      await new Promise(resolve => window.setTimeout(resolve, 100));
      if (serial !== transitionSerial) return;
      const copies = oldPortraitCopies();
      stage.className = `stage story-stage ${targetId.toLowerCase()} is-transitioning`;
      setPortraits(target);
      activeAnimations = copies.map(({ name, copy, rect }) => {
        const targetPortrait = portraits[name];
        const targetRect = target[name] ? targetPortrait.getBoundingClientRect() : rect;
        const dx = targetRect.left - rect.left;
        const dy = targetRect.top - rect.top;
        const sx = targetRect.width / rect.width;
        const sy = targetRect.height / rect.height;
        const turnAway = name === "song" && currentId === "B1" && !target[name];
        const end = turnAway ? "rotateY(180deg)" : `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
        return copy.animate([
          { transform: "none", opacity: 1, offset: 0 },
          { transform: end, opacity: target[name] ? 1 : 0.5, offset: target[name] ? 0.72 : 0.55 },
          { transform: end, opacity: 0, offset: 1 }
        ], { duration: 480, easing: "ease-in-out", fill: "forwards" });
      });
      for (const [name, portrait] of Object.entries(portraits)) {
        if (!target[name]) continue;
        activeAnimations.push(portrait.animate([
          { opacity: 0, offset: 0 },
          { opacity: 0, offset: 0.7 },
          { opacity: 1, offset: 1 }
        ], { duration: 480, easing: "ease-in-out", fill: "forwards" }));
      }
      await Promise.all(activeAnimations.map(animation => animation.finished.catch(() => {})));
      if (serial !== transitionSerial) return;
      copies.forEach(({ copy }) => copy.remove());
      activeAnimations.forEach(animation => animation.cancel());
      activeAnimations = [];
      currentId = targetId;
      setSceneText(targetId);
      stage.classList.remove("is-transitioning");
      updateDialoguePosition();
    }
    rememberScene(targetId);
  } finally {
    if (serial === transitionSerial) transitioning = false;
  }
}

dialogue.addEventListener("click", () => { void advanceScene(); });
dialogue.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    void advanceScene();
  }
});
introAdvance.addEventListener("click", () => { void advanceScene(); });
action.addEventListener("click", () => {
  if (currentId === "A10") window.location.href = "cake-game.html";
  if (currentId === "B8") window.location.href = "food-note.html";
});
function restoreSceneFromAddress() {
  if (sceneFromAddress() === currentId && !transitioning) return;
  transitionSerial += 1;
  activeAnimations.forEach(animation => animation.cancel());
  activeAnimations = [];
  stage.querySelectorAll(".transition-portrait").forEach(copy => copy.remove());
  showScene(sceneFromAddress());
  transitioning = false;
}
window.addEventListener("popstate", restoreSceneFromAddress);
window.addEventListener("hashchange", restoreSceneFromAddress);
window.addEventListener("resize", updateDialoguePosition);
new ResizeObserver(updateDialoguePosition).observe(dialogue);
showScene(sceneFromAddress());
