/**
 * Fathul Mu'in full-page sheet.
 * Shows one printed page (matan, syarah, footnotes), highlights the referenced
 * paragraph and the search words, and pages back and forth.
 *
 * Zero emojis - Indonesian + Arabic content
 */

import { dictionary } from '../data/dictionary.js';
import { getFathulData, loadFathul, loadFathulTranslation } from '../data/fathul/load.js';
import { highlightText } from '../services/fathulSearch.js';
import { dialogIn } from '../services/motion.js';
import { playPureSfx } from '../services/audio.js';
import { getIconSvg } from './icons.js';
import { trapFocus } from './searchModal.js';

const FONT_KEY = 'fathulFont';

function readFontPref() {
  try { return localStorage.getItem(FONT_KEY) === 'large'; } catch { return false; }
}

function writeFontPref(large) {
  try { localStorage.setItem(FONT_KEY, large ? 'large' : 'normal'); } catch { /* storage blocked */ }
}

const TRANSLATION_KEY = 'fathulTranslation';

function readTranslationPref() {
  try { return localStorage.getItem(TRANSLATION_KEY) === 'on'; } catch { return false; }
}

function writeTranslationPref(on) {
  try { localStorage.setItem(TRANSLATION_KEY, on ? 'on' : 'off'); } catch { /* storage blocked */ }
}

/** Fasal of a page: the fasal of the last topic that starts on or before it. */
function fasalTopicForPage(topics, hlm) {
  let found = topics[0];
  for (const t of topics) {
    if (t.hlm <= hlm) found = t;
    else break;
  }
  return found;
}

/**
 * Open the sheet at a page. Loads the data first if needed.
 *
 * @param {{ hlm: number, topicId?: string|null, query?: string, lang?: 'tr'|'id' }} options
 * @returns {() => void} close function
 */
export function openFathulPage({ hlm, topicId = null, query = '', lang = 'id' }) {
  const data = getFathulData();
  if (!data) {
    let closed = false;
    let close = () => {};
    loadFathul().then(() => {
      if (!closed) close = openFathulPage({ hlm, topicId, query, lang });
    });
    return () => { closed = true; close(); };
  }

  const { corpus } = data;
  const dict = dictionary[lang] || dictionary.tr;
  const pageNumbers = Object.keys(corpus.pages).map(Number);
  const firstPage = Math.min(...pageNumbers);
  const lastPage = Math.max(...pageNumbers);
  const topicsById = new Map(corpus.topics.map((t) => [t.id, t]));
  const fasalNames = new Map(corpus.chapters.flatMap((c) => c.fasals.map((f) => [f.id, { ...f, chapter: c }])));

  const state = { hlm, topicId, large: readFontPref(), translate: readTranslationPref() };
  let translation = null; // Indonesian lines keyed by hlm, loaded on first use
  const opener = typeof document !== 'undefined' ? document.activeElement : null;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop fathul-sheet-backdrop';
  const sheet = document.createElement('div');
  sheet.className = 'modal-dialog fathul-sheet neu-card p-0';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('aria-labelledby', 'fathul-sheet-title');
  backdrop.appendChild(sheet);
  document.body.appendChild(backdrop);

  function paragraphs(lines, cls, refIndex = -1, trLines = null, raguLines = []) {
    return lines.map((line, i) => `<p class="${cls}${i === refIndex ? ' is-ref' : ''}" dir="rtl" lang="ar">${highlightText(line, query)}</p>${
      trLines?.[i] ? `<p class="fathul-tr${raguLines.includes(i) ? ' is-ragu' : ''}" dir="ltr" lang="id">${highlightText(trLines[i], '')}${
        raguLines.includes(i) ? `<span class="fathul-ragu-tag">${dict.fathulRaguLine}</span>` : ''}</p>` : ''}`).join('');
  }

  function showTranslation() {
    if (translation) return render();
    loadFathulTranslation()
      .then((t) => { translation = t; })
      .catch(() => { state.translate = false; }) // offline: fall back to Arabic only, button un-pressed
      .then(() => { if (sheet.isConnected) render(); });
  }

  function render() {
    const page = corpus.pages[String(state.hlm)];
    const topic = state.topicId ? topicsById.get(state.topicId) : null;
    const fasalTopic = topic || fasalTopicForPage(corpus.topics, state.hlm);
    const fasal = fasalNames.get(fasalTopic.fasalId);
    const refIndex = topic?.anchor && topic.anchor.hlm === state.hlm ? topic.anchor.para : -1;
    const chapterName = lang === 'id' ? fasal.chapter.nameId : fasal.chapter.nameAr;
    const tr = state.translate ? translation?.[String(state.hlm)] : null;
    const ragu = getFathulData()?.ragu?.[String(state.hlm)] || {};

    const related = fasal.topicIds
      .filter((id) => id !== state.topicId)
      .map((id) => topicsById.get(id))
      .map((t) => `<button type="button" class="fathul-related-item" data-topic-id="${t.id}">${highlightText(t.titleId, '')} <span class="fathul-related-hlm">hlm ${t.hlm}</span></button>`)
      .join('');

    sheet.classList.toggle('is-large', state.large);
    sheet.innerHTML = `
      <div class="modal-header">
        <div class="fathul-sheet-heading">
          <h3 id="fathul-sheet-title">Fathul Mu'in · hlm ${page.hlm} · cetak ${page.cetak}</h3>
          <p class="fathul-sheet-sub">${chapterName} · <span dir="rtl" lang="ar">${fasal.nameAr}</span></p>
        </div>
        <button type="button" class="modal-close-btn neu-button" aria-label="${dict.close}" title="${dict.close}">${getIconSvg('close', 18)}</button>
      </div>
      <div class="modal-body fathul-sheet-body">
        ${tr ? `<p class="fathul-tr-note">${dict.fathulTranslationNote}</p>` : ''}
        ${page.matn.length ? `<section class="fathul-matn"><div class="fathul-label">${dict.fathulMatn}</div>${paragraphs(page.matn, 'fathul-matn-line font-arabic', -1, tr?.matn, ragu.matn)}</section>` : ''}
        <section class="fathul-syarah"><div class="fathul-label">${dict.fathulSyarah}</div>${paragraphs(page.syarah, 'fathul-para font-arabic', refIndex, tr?.syarah, ragu.syarah)}</section>
        ${page.footnotes.length ? `<section class="fathul-footnotes"><div class="fathul-label">${dict.fathulFootnotes}</div>${paragraphs(page.footnotes, 'fathul-footnote font-arabic', -1, tr?.footnotes, ragu.footnotes)}</section>` : ''}
        ${related ? `<section class="fathul-related"><h4>${dict.fathulRelated}</h4><div class="fathul-related-list">${related}</div></section>` : ''}
      </div>
      <div class="modal-footer fathul-sheet-tools">
        <button type="button" class="neu-button" data-action="copy">${getIconSvg('copy', 16)}<span>${dict.fathulCopy}</span></button>
        <button type="button" class="neu-button" data-action="font" aria-pressed="${state.large}">${dict.fathulFontSize}</button>
        <button type="button" class="neu-button" data-action="translate" aria-pressed="${state.translate}">${dict.fathulTranslation}</button>
        <span class="fathul-sheet-paging">
          <button type="button" class="neu-button" data-action="prev" aria-label="${dict.fathulPrevPage}" ${state.hlm <= firstPage ? 'disabled' : ''}>${getIconSvg('arrowLeft', 16)}<span>${state.hlm > firstPage ? `hlm ${state.hlm - 1}` : ''}</span></button>
          <button type="button" class="neu-button" data-action="next" aria-label="${dict.fathulNextPage}" ${state.hlm >= lastPage ? 'disabled' : ''}><span>${state.hlm < lastPage ? `hlm ${state.hlm + 1}` : ''}</span>${getIconSvg('arrowRight', 16)}</button>
        </span>
      </div>
    `;

    const ref = sheet.querySelector('.is-ref');
    if (ref && typeof ref.scrollIntoView === 'function') ref.scrollIntoView({ block: 'center' });
    else sheet.querySelector('.fathul-sheet-body')?.scrollTo?.(0, 0);
  }

  function goTo(nextHlm, nextTopicId = null) {
    playPureSfx(nextHlm < state.hlm ? 'prev' : 'next');
    state.hlm = nextHlm;
    state.topicId = nextTopicId;
    render();
    sheet.querySelector('.modal-close-btn')?.focus();
  }

  function copy() {
    const page = corpus.pages[String(state.hlm)];
    const topic = state.topicId ? topicsById.get(state.topicId) : null;
    const text = topic ? topic.ibarah : page.syarah.join('\n');
    const label = sheet.querySelector('[data-action="copy"] span');
    navigator.clipboard?.writeText(`${text}\n— Fathul Mu'in, hlm ${page.hlm} · cetak ${page.cetak}`)
      .then(() => {
        if (!label) return;
        label.textContent = dict.fathulCopied;
        setTimeout(() => { label.textContent = dict.fathulCopy; }, 1500);
      })
      .catch(() => { /* clipboard denied: nothing to do */ });
  }

  function onClick(e) {
    if (e.target === backdrop) return close();
    const el = e.target.closest('button');
    if (!el || !sheet.contains(el)) return;
    if (el.classList.contains('modal-close-btn')) return close();
    if (el.dataset.topicId) {
      const t = topicsById.get(el.dataset.topicId);
      return goTo(t.anchor ? t.anchor.hlm : t.hlm, t.id);
    }
    const action = el.dataset.action;
    if (action === 'prev' && state.hlm > firstPage) goTo(state.hlm - 1);
    else if (action === 'next' && state.hlm < lastPage) goTo(state.hlm + 1);
    else if (action === 'copy') copy();
    else if (action === 'font') {
      state.large = !state.large;
      writeFontPref(state.large);
      playPureSfx('toggle');
      render();
    } else if (action === 'translate') {
      state.translate = !state.translate;
      writeTranslationPref(state.translate);
      playPureSfx('toggle');
      if (state.translate) showTranslation();
      else render();
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') close();
  }

  // The sheet owns one history entry: the phone back gesture closes it instead of leaving the book
  let ownsHistoryEntry = false;
  function onPopState() {
    ownsHistoryEntry = false;
    close();
  }

  let cleanupFocus = () => {};
  function close() {
    if (!backdrop.parentNode) return;
    cleanupFocus();
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('popstate', onPopState);
    backdrop.removeEventListener('click', onClick);
    backdrop.parentNode.removeChild(backdrop);
    if (ownsHistoryEntry && history.state?.fathulSheet) history.back();
    ownsHistoryEntry = false;
    if (opener && typeof opener.focus === 'function' && document.contains(opener)) opener.focus();
  }

  render();
  if (state.translate) showTranslation();
  backdrop.addEventListener('click', onClick);
  window.addEventListener('keydown', onKeyDown);
  if (typeof history !== 'undefined' && typeof history.pushState === 'function') {
    history.pushState({ ...(history.state || {}), fathulSheet: true }, '');
    ownsHistoryEntry = true;
    window.addEventListener('popstate', onPopState);
  }
  cleanupFocus = trapFocus(sheet);
  playPureSfx('open');
  dialogIn(backdrop, sheet);
  sheet.querySelector('.modal-close-btn')?.focus();

  return close;
}
