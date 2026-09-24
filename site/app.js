const state = { catalog: null, selectedId: null };
const $ = (selector) => document.querySelector(selector);

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

async function loadCatalog() {
  const config = window.DREAMFOOD_SUPABASE;
  if (config?.url && config?.publishableKey) {
    try {
      const headers = { apikey: config.publishableKey, Authorization: `Bearer ${config.publishableKey}` };
      const [entities, occurrences, aliases, books] = await Promise.all([
        fetch(`${config.url}/rest/v1/catalog_entity?select=*`, { headers }),
        fetch(`${config.url}/rest/v1/source_occurrence?select=*`, { headers }),
        fetch(`${config.url}/rest/v1/entity_alias?select=*`, { headers }),
        fetch(`${config.url}/rest/v1/source_book?select=*`, { headers }),
      ]);
      if (![entities, occurrences, aliases, books].every((response) => response.ok)) throw new Error("数据库读取失败");
      const [entityRows, occurrenceRows, aliasRows, bookRows] = await Promise.all([entities.json(), occurrences.json(), aliases.json(), books.json()]);
      return { metadata: { source: "Supabase" }, entities: entityRows, occurrences: occurrenceRows, aliases: aliasRows, source_books: bookRows };
    } catch (error) {
      $('#status').textContent = "实时资料暂时不可用，现显示本地资料快照。";
    }
  }
  const response = await fetch("data/catalog-snapshot.json");
  if (!response.ok) throw new Error("资料快照无法载入");
  return response.json();
}

function categories() {
  return [...new Set(state.catalog.entities.flatMap((entity) => entity.categories || []))].sort((left, right) => left.localeCompare(right, "zh-Hans"));
}

function matchingEntities() {
  const term = $('#search').value.trim().toLocaleLowerCase();
  const category = $('#category').value;
  const aliases = new Map();
  state.catalog.aliases.forEach((item) => aliases.set(item.entity_id, [...(aliases.get(item.entity_id) || []), item.alias]));
  return state.catalog.entities.filter((entity) => {
    const values = [entity.name, ...(entity.categories || []), ...(aliases.get(entity.id) || [])].join(" ").toLocaleLowerCase();
    return (!term || values.includes(term)) && (!category || (entity.categories || []).includes(category));
  });
}

function renderResults() {
  const results = matchingEntities();
  $('#count').textContent = `找到 ${results.length} 个条目`;
  $('#results').innerHTML = results.map((entity) => `<button class="result" data-id="${escapeHtml(entity.id)}"><h2>${escapeHtml(entity.name)}</h2><div class="tags">${(entity.categories || []).map((category) => `<span class="tag">${escapeHtml(category)}</span>`).join("")}</div></button>`).join("") || "<p>没有符合条件的条目。</p>";
  document.querySelectorAll(".result").forEach((button) => button.addEventListener("click", () => renderDetail(button.dataset.id)));
}

function renderDetail(id) {
  state.selectedId = id;
  const entity = state.catalog.entities.find((item) => item.id === id);
  const occurrences = state.catalog.occurrences.filter((item) => item.entity_id === id);
  const aliases = state.catalog.aliases.filter((item) => item.entity_id === id).map((item) => item.alias);
  $('#detail').innerHTML = `<h2>${escapeHtml(entity.name)}</h2><dl><dt>分类</dt><dd>${escapeHtml((entity.categories || []).join("、") || "未分类")}</dd><dt>别名</dt><dd>${escapeHtml(aliases.join("、") || "—")}</dd><dt>整理状态</dt><dd>${escapeHtml((entity.decisions || []).join("、"))}</dd></dl><p class="boundary">以下说明均为“来源作者说法”，并非独立事实核实。</p>${occurrences.map((item) => `<article class="source"><strong>${escapeHtml(item.source_locator)}</strong><p>${escapeHtml(item.notes || "未附文字说明。")}</p><small>${escapeHtml(item.organization_status || "")}</small></article>`).join("")}`;
}

function setup() {
  categories().forEach((category) => $('#category').insertAdjacentHTML("beforeend", `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`));
  $('#search').addEventListener("input", renderResults);
  $('#category').addEventListener("change", renderResults);
  renderResults();
}

loadCatalog().then((catalog) => {
  state.catalog = catalog;
  $('#status').textContent = $('#status').textContent.includes("暂时") ? $('#status').textContent : `已载入 ${catalog.entities.length} 个实体和 ${catalog.occurrences.length} 条来源记录。`;
  setup();
}).catch(() => { $('#status').textContent = "资料无法载入，请稍后重试。"; });
