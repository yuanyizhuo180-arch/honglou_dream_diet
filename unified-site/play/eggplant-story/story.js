const scenes = {
  A0: { next: "A1", description: "第四十一回 · 宴席引入" },
  A1: { source: "原著情节改编 · 第四十一回", speaker: "叙述", line: "席上笑声未歇，刘姥姥端着酒杯，又留意起桌上的菜。", jia: "smile", liu: "normal", next: "A2" },
  A2: { source: "游戏改编 · 宴席待客", speaker: "贾母", line: "慢些喝，仔细呛着。菜也摆在这里，合口味的就尝尝。", jia: "smile", liu: "normal", next: "A3" },
  A3: { source: "游戏改编 · 宴席待客", speaker: "刘姥姥", line: "菜样样都好，我连名字还认不全，倒不知先尝哪一道。", liu: "normal", next: "A4" },
  A4: { source: "游戏改编 · 宴席待客", speaker: "王熙凤", line: "您只管说想尝什么，我替您夹。要是叫不出名字，先尝这碟也使得。", wang: "smile", liu: "normal", next: "A5" },
  A5: { source: "原著摘录 · 第四十一回", speaker: "贾母", line: "你把茄鲞搛些餵他。", jia: "smile", wang: "normal", next: "A6" },
  A6: { source: "游戏改编 · 尝菜", speaker: "王熙凤", line: "这也是茄子做的。您先尝滋味，别急着猜。", wang: "smile", liu: "tasting", next: "A7" },
  A7: { source: "原著情节改编 · 第四十一回", speaker: "刘姥姥", line: "要说这是茄子，我可得再尝一口。平日的茄子，哪里是这个味儿？", liu: "surprised", next: "A8" },
  A8: { source: "原著摘录 · 第四十一回", speaker: "刘姥姥", line: "真是茄子？", liu: "surprised", wang: "smile", next: "A9" },
  A9: { source: "游戏改编 · 细品", speaker: "王熙凤", line: "您再细嚼嚼，看能不能尝出一点茄香。", wang: "smile", liu: "normal", next: "A10" },
  A10: { source: "原著情节改编 · 第四十一回", speaker: "刘姥姥", line: "香是有一点，可又不像寻常的茄子。这样费心做的菜，我倒想知道法子。", liu: "tasting", wang: "normal", next: "A11" },
  A11: { source: "原著做法转述 · 第四十一回", speaker: "王熙凤", line: "先取新茄的净肉，切成细丁，用鸡油炸。鸡脯、菌菇、新笋、腐干和干果也要切细。", wang: "smile", next: "A12" },
  A12: { source: "原著做法转述 · 第四十一回", speaker: "王熙凤", line: "配料入锅，以鸡汤煨到收干；香油、糟油随后调味，还要妥善收存。", wang: "normal", liu: "normal", next: "A13" },
  A13: { source: "游戏改编 · 宴席对话", speaker: "刘姥姥", line: "听着容易，做起来可够忙的！", liu: "smile", wang: "smile", next: "A14" },
  A14: { source: "游戏改编 · 想象试做", speaker: "我（游戏厨师）", line: "凤姐说得细，我也想照着次序试一回。", next: "A15" },
  A15: { source: "游戏改编 · 想象试做", speaker: "叙述", line: "原著把茄肉切成碎丁；游戏简化为四段，再依次入锅、掌火、加料和调味。", action: "开始烹饪" },
  B1: { source: "原著摘录 · 第四十一回", speaker: "刘姥姥", line: "我的佛祖！", liu: "surprised", wang: "smile", next: "B2" },
  B2: { source: "原著情节改编 · 第四十一回", speaker: "刘姥姥", line: "一道茄子，竟要这么多鸡来相配，怪不得尝着不同！", liu: "smile", wang: "smile", next: "B3" },
  B3: { source: "游戏改编 · 宴席说笑", speaker: "刘姥姥", line: "我还想着回去照做呢。听完这用料，先得好好掂量一番。", liu: "smile", next: "B4" },
  B4: { source: "游戏改编 · 宴席待客", speaker: "王熙凤", line: "您问的是做法，我可一味也没瞒。喜欢这口，就再尝些。", wang: "smile", liu: "smile", next: "B5" },
  B5: { source: "游戏改编 · 宴席待客", speaker: "贾母", line: "尝得高兴便好。酒慢慢喝，菜也慢慢品。", jia: "smile", liu: "smile", next: "B6" },
  B6: { source: "原著情节转述 · 第四十一回", speaker: "叙述", line: "刘姥姥边说边笑，酒渐渐吃完了，仍细看手里的杯子。", liu: "smile", wang: "smile", next: "B7" },
  B7: { source: "游戏改编 · 宴席收束", speaker: "王熙凤", line: "再添一杯，才算尽兴？", wang: "smile", liu: "normal", next: "B8" },
  B8: { source: "游戏改编 · 宴席收束", speaker: "刘姥姥", line: "菜我还惦记着，酒可不敢再多了！", liu: "smile", wang: "smile", action: "查看茄鲞食笺" }
};

const stage = document.getElementById("stage");
const dialogue = document.getElementById("dialogue");
const action = document.getElementById("scene-cta");
const next = document.getElementById("next-scene");
const portraits = Object.fromEntries(["wang", "liu", "jia"].map((name) => [name, document.querySelector(`.portrait.${name}`)]));
const portraitNames = { wang: "王熙凤", liu: "刘姥姥", jia: "贾母" };
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let currentId = "A0";
let transitioning = false;
let activeAnimations = [];
let transitionSerial = 0;

function sceneFromAddress() {
  const hashScene = /^#scene=(A(?:[0-9]|1[0-5])|B[1-8])$/i.exec(window.location.hash)?.[1];
  const requested = (hashScene || new URLSearchParams(window.location.search).get("scene"))?.toUpperCase();
  return Object.hasOwn(scenes, requested) ? requested : "A0";
}

function rememberScene(id) {
  try {
    window.history.pushState({ scene: id }, "", `story.html?scene=${id}`);
  } catch {
    window.location.hash = `scene=${id}`;
  }
}

function portraitFile(name, version) {
  if (name === "jia" && version === "smile") return "jia-mu-smile-v3.png";
  const stem = { wang: "wang-xifeng", liu: "liu-laolao", jia: "jia-mu" }[name];
  return `${stem}-${version}-v1.png`;
}

function setPortraits(scene) {
  for (const [name, portrait] of Object.entries(portraits)) {
    const version = scene[name];
    portrait.hidden = !version;
    if (version) {
      portrait.src = `assets/${portraitFile(name, version)}`;
      portrait.alt = `${portraitNames[name]}${({smile:"满意微笑",surprised:"惊讶",tasting:"细品"})[version] || "正常"}立绘`;
    }
  }
}

function setSceneText(id) {
  const scene = scenes[id];
  document.title = `红楼小灶 · 茄鲞 ${id}`;
  document.getElementById("intro-content").hidden = id !== "A0";
  if (id === "A0") document.getElementById("scene-title").textContent = "茄鲞 · A0";
  if (id !== "A0") {
    document.getElementById("scene-source").textContent = scene.source;
    document.getElementById("scene-title").textContent = `茄鲞 · ${id}`;
    document.getElementById("speaker").textContent = scene.speaker;
    document.getElementById("line").textContent = scene.line;
  }
  document.getElementById("scene-description").textContent = scene.description;
  action.hidden = !scene.action;
  if (scene.action) {
    action.textContent = scene.action;
    action.disabled = false;
    action.title = id === "A15" ? "进入茄鲞烹饪游戏" : "查看茄鲞食笺";
  }
  next.hidden = !scene.next;
  if (scene.next) {
    next.href = `story.html?scene=${scene.next}`;
    next.textContent = id === "A0" ? "入梦" : `继续到 ${scene.next} →`;
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
  document.querySelectorAll("[data-scene-link]").forEach((link) => {
    const active = link.dataset.sceneLink === id;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function showScene(id) {
  currentId = id;
  stage.className = sceneClass(id);
  setPortraits(scenes[id]);
  setSceneText(id);
}

function sceneClass(id) {
  const scene = scenes[id];
  const count = [scene.wang, scene.liu, scene.jia].filter(Boolean).length;
  const speaker = ({王熙凤:"wang",刘姥姥:"liu",贾母:"jia"})[scene.speaker] || "narrator";
  return `stage story-stage ${id.toLowerCase()} ${count === 1 ? "portrait-solo" : count === 2 ? "portrait-pair" : "portrait-none"} speaker-${speaker}`;
}

function preloadPortraits(scene) {
  return Promise.all(Object.entries(portraits).filter(([name]) => scene[name]).map(([name]) => new Promise((resolve) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = resolve;
    image.src = `assets/${portraitFile(name, scene[name])}`;
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
      await new Promise((resolve) => window.setTimeout(resolve, 100));
      if (serial !== transitionSerial) return;
      const copies = oldPortraitCopies();
      stage.className = `${sceneClass(targetId)} is-transitioning`;
      setPortraits(target);
      activeAnimations = copies.map(({ name, copy, rect }) => {
        const targetPortrait = portraits[name];
        const targetRect = target[name] ? targetPortrait.getBoundingClientRect() : rect;
        const dx = targetRect.left - rect.left;
        const dy = targetRect.top - rect.top;
        const sx = targetRect.width / rect.width;
        const sy = targetRect.height / rect.height;
        const end = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
        return copy.animate([
          { transform: "none", opacity: 1, offset: 0 },
          { transform: end, opacity: target[name] ? 1 : 0.6, offset: target[name] ? 0.72 : 0.55 },
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
      await Promise.all(activeAnimations.map((animation) => animation.finished.catch(() => {})));
      if (serial !== transitionSerial) return;
      copies.forEach(({ copy }) => copy.remove());
      activeAnimations.forEach((animation) => animation.cancel());
      activeAnimations = [];
      currentId = targetId;
      setSceneText(targetId);
      stage.classList.remove("is-transitioning");
    }
    rememberScene(targetId);
  } finally {
    if (serial === transitionSerial) transitioning = false;
  }
}

action.addEventListener("click", () => {
  if (transitioning) return;
  if (currentId === "A15") window.location.href = "../kitchen-draft.html?chapter=eggplant&from=story";
  if (currentId === "B8") window.location.href = "food-note.html";
});
dialogue.addEventListener("click", () => { void advanceScene(); });
dialogue.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    void advanceScene();
  }
});
next.addEventListener("click", (event) => {
  if (currentId === "A0" || !scenes[currentId].next) return;
  event.preventDefault();
  void advanceScene();
});
function restoreSceneFromAddress() {
  if (sceneFromAddress() === currentId && !transitioning) return;
  transitionSerial += 1;
  activeAnimations.forEach((animation) => animation.cancel());
  activeAnimations = [];
  stage.querySelectorAll(".transition-portrait").forEach((copy) => copy.remove());
  showScene(sceneFromAddress());
  transitioning = false;
}
window.addEventListener("popstate", restoreSceneFromAddress);
window.addEventListener("hashchange", restoreSceneFromAddress);

showScene(sceneFromAddress());
