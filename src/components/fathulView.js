/**
 * Fathul Mu'in view: Cari Mas'alah (search first), Telusur Bab and the way into
 * Latihan Soal. Opening a topic shows the full page sheet.
 *
 * Zero emojis - Indonesian + Arabic content
 */

import { dictionary } from '../data/dictionary.js';
import { booksMetadata } from '../data/books.js';
import { loadFathul, getFathulData } from '../data/fathul/load.js';
import { searchFathul, highlightText, ibarahSnippet, highlightQueryFor } from '../services/fathulSearch.js';
import { openFathulPage } from './fathulPageSheet.js';
import { staggerIn } from '../services/motion.js';
import { playPureSfx } from '../services/audio.js';
import { getIconSvg } from './icons.js';

const CHIPS = ['basmalah', 'jamak shalat', 'zakat fitrah', 'talak', 'ihram'];
const SEARCH_DELAY = 150;
const MAX_RESULTS = 50;

/**
 * @param {HTMLElement} container
 * @param {import('../state/store.js').AppStore} store
 * @returns {() => void} unmount
 */
export function renderFathulView(container, store) {
  if (!container || !store) return () => {};

  let lang = store.getState().activeLang || 'tr';
  let alive = true;
  let timer = null;
  const ui = { mode: 'search', query: '', chapterId: null, fasalId: null };

  const dictFor = () => dictionary[lang] || dictionary.tr;

  function showStatus(key, role) {
    container.innerHTML = `
      <div class="neu-card flex flex-col gap-4 items-center justify-center p-8 text-center my-8" role="${role}">
        <p class="text-secondary">${dictFor()[key]}</p>
      </div>
    `;
  }

  function cardHtml(topic, query, data, d) {
    const chapter = data.corpus.chapters.find((c) => c.id === topic.chapterId);
    const fasal = chapter.fasals.find((f) => f.id === topic.fasalId);
    const arQuery = highlightQueryFor(topic, query);
    return `
      <article class="fathul-card neu-card">
        <h3 class="fathul-card-title">${highlightText(topic.titleId, query)}</h3>
        <div class="fathul-card-meta">
          <span class="fathul-hlm">hlm ${topic.hlm} · cetak ${topic.cetak}</span>
          <span>${lang === 'id' ? chapter.nameId : chapter.nameAr} · <span dir="rtl" lang="ar">${fasal.nameAr}</span></span>
        </div>
        <p class="fathul-card-ringkas">${highlightText(topic.ringkas, query)}</p>
        <p class="fathul-card-ibarah font-arabic" dir="rtl" lang="ar">${highlightText(ibarahSnippet(topic.ibarah, arQuery), arQuery)}</p>
        <button type="button" class="neu-button neu-button-primary fathul-read" data-open-topic="${topic.id}">${d.fathulReadPage}</button>
      </article>
    `;
  }

  function panelHtml(data) {
    const d = dictFor();
    if (ui.mode === 'browse') {
      const back = `<button type="button" class="neu-button fathul-back" data-action="back">${getIconSvg('arrowLeft', 16)}<span>${d.fathulBack}</span></button>`;
      if (ui.fasalId) {
        const chapter = data.corpus.chapters.find((c) => c.id === ui.chapterId);
        const fasal = chapter.fasals.find((f) => f.id === ui.fasalId);
        const byId = new Map(data.corpus.topics.map((t) => [t.id, t]));
        const items = fasal.topicIds.map((id) => byId.get(id)).map((t) => `
          <button type="button" class="fathul-list-item" data-open-topic="${t.id}">
            <span>${highlightText(t.titleId, '')}</span><span class="fathul-list-meta">hlm ${t.hlm}</span>
          </button>`).join('');
        return `${back}<h2 class="fathul-panel-title" dir="rtl" lang="ar">${fasal.nameAr}</h2><div class="fathul-list">${items}</div>`;
      }
      if (ui.chapterId) {
        const chapter = data.corpus.chapters.find((c) => c.id === ui.chapterId);
        const items = chapter.fasals.map((f) => `
          <button type="button" class="fathul-list-item" data-fasal="${f.id}">
            <span dir="rtl" lang="ar" class="font-arabic">${f.nameAr}</span><span class="fathul-list-meta">${f.topicIds.length} ${d.fathulTopics}</span>
          </button>`).join('');
        return `${back}<h2 class="fathul-panel-title">${lang === 'id' ? chapter.nameId : chapter.nameAr}</h2><div class="fathul-list">${items}</div>`;
      }
      const items = data.corpus.chapters.map((c) => `
        <button type="button" class="fathul-list-item" data-chapter="${c.id}">
          <span>${c.nameId}</span><span dir="rtl" lang="ar" class="font-arabic fathul-list-ar">${c.nameAr}</span>
        </button>`).join('');
      return `<h2 class="fathul-panel-title">${d.fathulBrowse}</h2><div class="fathul-list">${items}</div>`;
    }

    if (!ui.query.trim()) return '';
    const results = searchFathul(data.index, ui.query, MAX_RESULTS);
    if (!results.length) return `<p class="fathul-empty text-secondary">${d.fathulNoResults}</p>`;
    const n = results.length === MAX_RESULTS ? `${MAX_RESULTS}+` : String(results.length);
    return `
      <p class="fathul-count">${d.fathulResults.replace('{n}', n)}</p>
      <div class="fathul-results">${results.map((r) => cardHtml(r.topic, ui.query, data, d)).join('')}</div>
    `;
  }

  function renderPanel(animate = true) {
    const data = getFathulData();
    const panel = container.querySelector('.fathul-panel');
    if (!data || !panel) return;
    panel.innerHTML = panelHtml(data);
    if (animate) staggerIn(panel.querySelectorAll('.fathul-card, .fathul-list-item'), { stagger: 0.03 });
  }

  function render() {
    const data = getFathulData();
    if (!data) return;
    const d = dictFor();
    const meta = booksMetadata.fathul;
    const pages = Object.keys(data.corpus.pages).length;
    container.innerHTML = `
      <section class="fathul-view flex flex-col gap-6 w-full animate-fade-in">
        <header class="fathul-hero neu-card">
          <p class="fathul-hero-ar font-arabic" dir="rtl" lang="ar">فتح المعين بشرح قرة العين</p>
          <h1 class="fathul-hero-title">${lang === 'id' ? meta.titleId : meta.titleTr}</h1>
          <p class="fathul-hero-meta">${lang === 'id' ? meta.authorId : meta.authorTr} · <span class="fathul-mazhab">${d.fathulMazhab}</span> · ${pages} ${d.fathulPages}</p>
          <div class="fathul-search">
            ${getIconSvg('search', 18)}
            <input type="search" class="neu-input search-input" placeholder="${d.fathulSearchPlaceholder}" aria-label="${d.fathulSearchPlaceholder}" autocomplete="off" />
          </div>
          <div class="fathul-chips">
            ${CHIPS.map((c) => `<button type="button" class="fathul-chip" data-chip="${c}">${c}</button>`).join('')}
          </div>
          <div class="fathul-ways">
            <div class="fathul-label">${d.fathulOtherWays}</div>
            <div class="fathul-ways-row">
              <button type="button" class="neu-button" data-action="browse">${getIconSvg('book', 18)}<span>${d.fathulBrowse}</span></button>
              <button type="button" class="neu-button" data-action="practice">${getIconSvg('modeExam', 18)}<span>${d.fathulPractice}</span></button>
            </div>
          </div>
        </header>
        <div class="fathul-panel" aria-live="polite"></div>
      </section>
    `;
    container.querySelector('input[type="search"]').value = ui.query;
    renderPanel(false);
  }

  function runSearch(q) {
    ui.query = q;
    ui.mode = 'search';
    renderPanel();
  }

  function onInput(e) {
    if (!e.target.matches('input[type="search"]')) return;
    const q = e.target.value;
    clearTimeout(timer);
    timer = setTimeout(() => runSearch(q), SEARCH_DELAY);
  }

  function openTopic(id) {
    const data = getFathulData();
    const topic = data.corpus.topics.find((t) => t.id === id);
    openFathulPage({ hlm: topic.anchor ? topic.anchor.hlm : topic.hlm, topicId: topic.id, query: ui.mode === 'search' ? highlightQueryFor(topic, ui.query) : '', lang });
  }

  function onClick(e) {
    const el = e.target.closest('button');
    if (!el || !container.contains(el)) return;
    if (el.dataset.chip) {
      playPureSfx('click');
      clearTimeout(timer);
      container.querySelector('input[type="search"]').value = el.dataset.chip;
      return runSearch(el.dataset.chip);
    }
    if (el.dataset.openTopic) return openTopic(el.dataset.openTopic);
    if (el.dataset.chapter) {
      playPureSfx('click');
      ui.chapterId = el.dataset.chapter;
      return renderPanel();
    }
    if (el.dataset.fasal) {
      playPureSfx('click');
      ui.fasalId = el.dataset.fasal;
      return renderPanel();
    }
    const action = el.dataset.action;
    if (action === 'browse') {
      playPureSfx('click');
      Object.assign(ui, { mode: 'browse', chapterId: null, fasalId: null });
      renderPanel();
    } else if (action === 'back') {
      playPureSfx('click');
      if (ui.fasalId) ui.fasalId = null;
      else ui.chapterId = null;
      renderPanel();
    } else if (action === 'practice') {
      playPureSfx('start');
      store.setState({ activeBook: 'fathul', currentView: 'study', activeChapter: 'all', currentQuestionIndex: 0 });
    }
  }

  container.addEventListener('input', onInput);
  container.addEventListener('click', onClick);

  const unsubscribe = store.subscribe((next) => {
    if ((next.activeLang || 'tr') !== lang) {
      lang = next.activeLang || 'tr';
      render();
    }
  });

  if (getFathulData()) {
    render();
  } else {
    showStatus('fathulLoading', 'status');
    loadFathul().then(
      () => { if (alive) render(); },
      () => { if (alive) showStatus('fathulLoadError', 'alert'); }
    );
  }

  return () => {
    alive = false;
    clearTimeout(timer);
    unsubscribe();
    container.removeEventListener('input', onInput);
    container.removeEventListener('click', onClick);
  };
}
