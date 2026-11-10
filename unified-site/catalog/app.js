(() => {
  'use strict';
  const PROJECT_URL = 'https://lbecpdjnmhvewfyhfels.supabase.co';
  const PUBLISHABLE_KEY = 'sb_publishable_MT44SvYWAnCvehgRgba1Zw_gLZvjXG5';
  const ORDER = ['红楼菜肴','红楼主食','红楼点心','红楼饮料','红楼果品','红楼补品补食','红楼外国食品','食材','器具'];
  const TYPE_LABEL = {food:'食品',ingredient:'食材',food_activity:'饮食活动',utensil:'器具'};
  let catalog = window.__CATALOG_SNAPSHOT__;
  let sourceMode = 'snapshot';
  let searchType = 'all';
  const app = document.getElementById('app');
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const all = () => Array.isArray(catalog?.entities) ? catalog.entities : [];
  const countFor = (category) => all().filter(e => category === '食材' ? e.type === 'ingredient' : category === '器具' ? e.type === 'utensil' : e.type === 'food' && e.categories?.includes(category)).length;
  const matchCategory = (entity, category) => category === '食材' ? entity.type === 'ingredient' : category === '器具' ? entity.type === 'utensil' : entity.type === 'food' && entity.categories?.includes(category);
  const route = () => { const raw = decodeURIComponent(location.hash.slice(1)); const index = raw.indexOf('='); return index < 0 ? {kind:'home',value:''} : {kind:raw.slice(0,index),value:raw.slice(index+1)}; };
  const setRoute = (kind, value) => { location.hash = kind + '=' + encodeURIComponent(value); };
  const modeLabel = () => sourceMode === 'live' ? '已连接公开数据库' : '已审核公开数据快照';
  const bottom = `<div class="bottom-line"><span>当前收录 <strong>${all().length}</strong> 条</span></div>`;
  const navigateBack = () => { if (history.length > 1) history.back(); else location.hash = ''; };
  const searchForm = (value='') => `<form class="search-wrap" id="search-form" role="search"><span class="search-icon" aria-hidden="true">⌕</span><input id="search-input" type="search" value="${escape(value)}" placeholder="搜索食物、食材、器具或编号" aria-label="搜索实体名称或编号"><button class="search-button" type="submit">查阅食典</button></form>`;

  function renderHome() {
    document.title = '红楼食典 · 文献中的饮食';
    app.innerHTML = `<div class="eyebrow">文献中的饮食</div><div class="title-line"><h1 class="title">红楼食典</h1><span class="seal" aria-hidden="true">文献可考</span></div><p class="intro">循着一席饮食，查阅<strong>名称、分类与文献出处</strong>。</p>${searchForm()}<div class="section-head"><h2>循类而览</h2><small>九类 · ${ORDER.reduce((sum,name)=>sum+countFor(name),0)} 条可分类浏览</small></div><div class="category-grid">${ORDER.map(name => `<button class="category-card ${name === '食材' || name === '器具' ? 'type-card':''}" data-category="${escape(name)}" aria-label="浏览${escape(name)}，${countFor(name)}条"><span class="category-name">${escape(name)}</span><span class="category-count"><b>${countFor(name)}</b>条收录</span></button>`).join('')}</div><p class="note">食材与器具为独立实体类型。饮食活动保留在数据库中，暂不设首页入口。</p>${bottom}`;
    app.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => setRoute('category',button.dataset.category)));
    attachSearch();
  }

  function attachSearch() {
    const form = document.getElementById('search-form');
    form?.addEventListener('submit', event => {event.preventDefault();setRoute('search',document.getElementById('search-input').value.trim());});
  }

  function renderList(kind, value) {
    const isCategory = kind === 'category';
    const query = value.trim().toLocaleLowerCase('zh-CN');
    const found = all().filter(e => isCategory ? matchCategory(e,value) : (!query || [e.name,e.id,e.description,...(e.categories||[])].some(t => String(t||'').toLocaleLowerCase('zh-CN').includes(query))));
    const filtered = !isCategory && searchType !== 'all' ? found.filter(e => e.type === searchType) : found;
    document.title = `${isCategory ? value : '搜索结果'} · 红楼食典`;
    app.innerHTML = `<button class="back" id="back-home" type="button">← 返回分类目录</button><div class="eyebrow" style="margin-top:23px">${isCategory ? '按类查阅' : '检索食典'}</div><h1 class="sub-title">${escape(isCategory ? value : '搜索结果')}</h1><p class="sub-meta">${isCategory ? '本类' : query ? `“${escape(value)}”共找到` : '全部'} ${filtered.length} 条条目 · 点击名称查看来源</p>${searchForm(isCategory ? '' : value)}${isCategory ? '' : `<div class="result-tools">${[['all','全部'],['food','食品'],['ingredient','食材'],['utensil','器具'],['food_activity','饮食活动']].map(([id,label]) => `<button class="chip" type="button" data-type="${id}" aria-pressed="${String(searchType===id)}">${label}</button>`).join('')}</div>`}<div class="entry-list" role="list">${filtered.length ? filtered.map(e => `<button class="entry" role="listitem" data-entity="${escape(e.id)}"><span class="entry-head"><span class="entry-name">${escape(e.name)}</span><span class="entry-id">${escape(e.id)}</span></span><span class="entry-detail">${escape(e.description || (e.categories?.length ? e.categories.join(' · ') : TYPE_LABEL[e.type] || '实体'))}</span></button>`).join('') : '<p class="empty">没有找到对应实体。可试试名称中的单个词，或返回分类目录浏览。</p>'}</div>${bottom}`;
    app.querySelector('#back-home').addEventListener('click',() => {location.hash='';});
    app.querySelectorAll('[data-entity]').forEach(button => button.addEventListener('click',() => setRoute('entity',button.dataset.entity)));
    app.querySelectorAll('[data-type]').forEach(button => button.addEventListener('click',() => {searchType=button.dataset.type;renderList(kind,value);}));
    attachSearch();
  }

  function renderDetail(id) {
    const e = all().find(row => row.id === id);
    if (!e) { app.innerHTML = `<button class="back" id="back-home" type="button">← 返回分类目录</button><p class="empty">暂时找不到这条内容，请返回目录继续查阅。</p>`;app.querySelector('#back-home').addEventListener('click',()=>location.hash='');return; }
    const detail = e.reader_detail || {};
    const evs = (catalog.evidence_locators||[]).filter(row => row.entity_id === id);
    const cats = e.categories?.length ? e.categories.join('、') : TYPE_LABEL[e.type] || '未分类';
    const sourceRows = Array.isArray(detail.bibliography) && detail.bibliography.length ? detail.bibliography : evs.map(ev => {
      const title = ev.source_title || '文献来源';
      const offset = title.includes('红楼梦美食大观') ? 13 : title.includes('红楼梦饮食谱') ? 15 : null;
      const printStart = offset !== null && ev.pdf_page_start ? ev.pdf_page_start - offset : null;
      const printEnd = offset !== null && ev.pdf_page_end ? ev.pdf_page_end - offset : printStart;
      return {title: title.startsWith('《') ? title : `《${title}》`, printed_page_start:printStart, printed_page_end:printEnd, pdf_page_start:ev.pdf_page_start, pdf_page_end:ev.pdf_page_end};
    });
    const pageSpan = (start, end) => start == null ? '' : (end != null && end !== start ? `${escape(start)}—${escape(end)}` : escape(start));
    const bibliography = sourceRows.length ? sourceRows.map(source => {
      const paper = pageSpan(source.printed_page_start, source.printed_page_end);
      const pdf = pageSpan(source.pdf_page_start, source.pdf_page_end);
      const location = paper && pdf ? `纸本第 ${paper} 页（PDF 第 ${pdf} 页）` : paper ? `纸本第 ${paper} 页` : pdf ? `PDF 第 ${pdf} 页` : '';
      return `<div class="evidence"><strong>${escape(source.title || '文献来源')}</strong>${location ? `<small>${location}</small>` : ''}</div>`;
    }).join('') : '<p>暂无可考的记载。</p>';
    const originalSection = e.original_context ? `<section class="detail-card"><span class="label">原著情节</span><p>${escape(e.original_context)}</p>${e.original_context_chapter ? `<p class="quiet">《红楼梦》第 ${escape(e.original_context_chapter)} 回</p>` : ''}</section>` : '';
    const knowledgeSection = e.type === 'food' && detail.xiaozhao_kepu ? `<section class="detail-card"><span class="label">小灶科普</span><p>${escape(detail.xiaozhao_kepu)}</p></section>` : '';
    const originalRecords = Array.isArray(e.original_context_records) ? e.original_context_records : [];
    const originalStatus = e.original_context_finding_status || '当前工作底本未检出可靠出处';
    const originalContent = originalRecords.length ? originalRecords.map(item => {
      const chapter = item.chapter == null ? '回数待核' : `第 ${escape(item.chapter)} 回`;
      const title = item.chapter_title ? `《${escape(item.chapter_title)}》` : '回目标题待核';
      return `<article class="original-entry"><h3>${chapter} ${title}</h3><p class="original-context">${escape(item.context || '')}</p></article>`;
    }).join('') : `<p>${originalStatus === '当前工作底本未检出可靠出处' ? '当前工作底本未检出可靠出处。' : '暂无可展示的原著上下文。'}</p>`;
    const originalRecordsSection = `<section class="detail-card"><span class="label">回溯原著</span>${originalContent}</section>`;
    document.title = `${e.name} · 红楼食典`;
    app.innerHTML = `<button class="back" id="back-detail" type="button">← 返回上页</button><div class="detail-scroll"><div class="eyebrow" style="margin-top:23px">饮食名物 · 查阅出处</div><h1 class="sub-title">${escape(e.name)}</h1><section class="detail-card"><span class="label">分类</span><p>${escape(cats)}</p></section>${knowledgeSection}${originalRecordsSection}<section class="detail-card"><span class="label">文献出处</span>${bibliography}</section></div>`;
    app.querySelector('#back-detail').addEventListener('click',navigateBack);
  }

  function render() {
    const {kind,value} = route();
    if (kind === 'category' && ORDER.includes(value)) renderList(kind,value);
    else if (kind === 'search') renderList(kind,value);
    else if (kind === 'entity') renderDetail(value);
    else renderHome();
  }

  async function refreshFromSupabase() {
    try {
      const response = await fetch(`${PROJECT_URL}/rest/v1/honglou_v1_catalog?select=payload&version=eq.v1`, {headers:{'apikey':PUBLISHABLE_KEY,'Accept':'application/json'},cache:'no-store'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const rows = await response.json();
      const next = rows?.[0]?.payload;
      if (!Array.isArray(next?.entities) || !Array.isArray(next?.evidence_locators)) throw new Error('invalid_catalog');
      catalog=next;sourceMode='live';render();
    } catch (_) { sourceMode='snapshot';render(); }
  }
  window.addEventListener('hashchange',render);
  render();
  refreshFromSupabase();
})();
