/**
 * Raw Reader Mode Component (Düz Okuma Flow List)
 * Uninterrupted continuous flow list of classical Q&A items.
 *
 * 100% Bebas Emoji: All icons use pure SVG vectors.
 * 100% Bilingual Reactivity: Instant Ottoman Turkish (TR) <-> Indonesian (ID) switching.
 */

import { booksData, booksMetadata } from '../data/books.js';
import { dictionary } from '../data/dictionary.js';
import { playPureSfx } from '../services/audio.js';
import { getIconSvg } from './icons.js';

/**
 * Strips HTML tags for clean clipboard copying.
 * @param {string} html - HTML string
 * @returns {string} Plain text string
 */
function stripHtml(html) {
  if (!html) return '';
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]*>/g, '');
  }
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

/**
 * Mappable Reader List Item Generator.
 * Transforms raw book question objects to reader-ready localized structures.
 *
 * @param {Array<object>} items - Raw book questions array
 * @param {'tr' | 'id'} [lang='tr'] - Target language
 * @returns {Array<{ id: string, question: string, answer: string, chapterName: string, bookKey: string, number: number }>}
 */
export function generateReaderListItems(items = [], lang = 'tr') {
  if (!Array.isArray(items)) return [];

  const isTr = lang === 'tr';

  return items.map((item, index) => {
    const rawNumber = typeof item.originalNumber === 'number'
      ? item.originalNumber
      : (index + 1);

    const chapterName = isTr
      ? (item.chapterNameTr || item.chapterName || '')
      : (item.chapterNameId || item.chapterName || '');

    return {
      id: item.id || String(index + 1),
      question: isTr ? (item.question_tr || '') : (item.question_id || ''),
      answer: isTr ? (item.answer_tr || '') : (item.answer_id || ''),
      chapterName,
      bookKey: item.bookKey || '',
      number: rawNumber
    };
  });
}

/**
 * Renders the reactive continuous raw reader flow view.
 *
 * @param {HTMLElement} container - DOM mount target element
 * @param {import('../state/store.js').AppStore} store - Central application store
 * @returns {Function} Clean unmount teardown function
 */
export function renderReaderView(container, store) {
  if (!container || !store) return () => {};

  let state = store.getState();
  let activeBook = state.activeBook || 'quduri';
  let activeLang = state.activeLang || 'tr';
  let activeChapter = state.activeChapter || 'all';
  let searchQuery = '';

  let toastTimer = null;

  function getDict(lang = activeLang) {
    return dictionary[lang] || dictionary.tr;
  }

  function getBookQuestions() {
    return booksData[activeBook] || [];
  }

  function getChapters() {
    const raw = getBookQuestions();
    const chapterMap = new Map();
    raw.forEach((q) => {
      if (q.chapterId && !chapterMap.has(q.chapterId)) {
        chapterMap.set(q.chapterId, {
          id: q.chapterId,
          nameTr: q.chapterNameTr || q.chapterId,
          nameId: q.chapterNameId || q.chapterId
        });
      }
    });
    return Array.from(chapterMap.values());
  }

  function showToast(message) {
    let toastEl = container.querySelector('.reader-toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'reader-toast neu-badge neu-badge-accent fixed top-20 right-6 z-50 animate-fade-in shadow-md';
      container.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.remove('hidden');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl?.classList.add('hidden');
    }, 2200);
  }

  // Scaffold DOM structure
  container.innerHTML = `
    <div class="reader-view flex flex-col gap-6 w-full animate-fade-in pb-24">
      <!-- Top Toolbar -->
      <header class="reader-toolbar neu-card flex flex-wrap items-center justify-between gap-4 p-4">
        <!-- Book Badge & Chapter Filter -->
        <div class="flex flex-wrap items-center gap-3">
          <span id="reader-book-badge" class="neu-badge neu-badge-accent text-xs font-bold"></span>
          <select id="reader-chapter-select" class="neu-input text-xs py-2 px-3 rounded-lg bg-surface border border-subtle" aria-label="Chapter Filter">
          </select>
          <span id="reader-count-badge" class="neu-badge neu-badge-info text-xs font-bold"></span>
        </div>

        <!-- Real-time Filter Search Input -->
        <div class="flex items-center gap-2 flex-1 max-w-xs min-w-[180px]">
          <div class="relative w-full">
            <input
              type="text"
              id="reader-search-input"
              class="neu-input w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-surface border border-subtle"
              placeholder=""
              aria-label="Filter questions"
            />
            <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
              ${getIconSvg('search', 14)}
            </span>
          </div>
        </div>

        <!-- Exit Button -->
        <div class="flex items-center gap-2">
          <button id="btn-exit-reader" class="neu-button flex items-center gap-2 text-danger hover:text-danger" aria-label="Exit Reader">
            ${getIconSvg('close', 16)}
            <span class="exit-reader-label text-xs sm:text-sm font-bold"></span>
          </button>
        </div>
      </header>

      <!-- Empty State -->
      <div id="reader-empty-state" class="neu-card flex flex-col items-center justify-center p-8 text-center my-4 hidden">
        <p class="text-secondary text-sm" id="reader-empty-text"></p>
      </div>

      <!-- Continuous Question List Container -->
      <div id="reader-list-container" class="reader-list flex flex-col gap-6 w-full"></div>
    </div>
  `;

  // Handles
  const bookBadge = container.querySelector('#reader-book-badge');
  const chapterSelect = container.querySelector('#reader-chapter-select');
  const countBadge = container.querySelector('#reader-count-badge');
  const searchInput = container.querySelector('#reader-search-input');
  const btnExit = container.querySelector('#btn-exit-reader');
  const exitLabel = container.querySelector('.exit-reader-label');
  const emptyState = container.querySelector('#reader-empty-state');
  const emptyText = container.querySelector('#reader-empty-text');
  const listContainer = container.querySelector('#reader-list-container');

  function updateChapterSelectOptions() {
    const isTr = activeLang === 'tr';
    const dict = getDict();
    const chapters = getChapters();

    const options = [
      `<option value="all"${activeChapter === 'all' ? ' selected' : ''}>${dict.allChapters || 'Tüm Kitap (Bütün Bölümler)'}</option>`,
      ...chapters.map((ch) => {
        const name = isTr ? ch.nameTr : ch.nameId;
        return `<option value="${ch.id}"${activeChapter === ch.id ? ' selected' : ''}>${name}</option>`;
      })
    ].join('');

    chapterSelect.innerHTML = options;
  }

  function getVisibleItems() {
    const rawQuestions = getBookQuestions();
    let scoped = rawQuestions;

    if (activeChapter && activeChapter !== 'all') {
      scoped = rawQuestions.filter((q) => q.chapterId === activeChapter);
    }

    const items = generateReaderListItems(scoped, activeLang);

    if (!searchQuery) {
      return items;
    }

    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      const qText = item.question.toLowerCase();
      const aText = item.answer.toLowerCase();
      const chText = item.chapterName.toLowerCase();
      const numText = String(item.number);
      return qText.includes(query) || aText.includes(query) || chText.includes(query) || numText.includes(query);
    });
  }

  function renderList() {
    const isTr = activeLang === 'tr';
    const dict = getDict();
    const bookMeta = booksMetadata[activeBook] || {};

    // Toolbar text updates
    bookBadge.textContent = isTr
      ? (bookMeta.titleTr || activeBook)
      : (bookMeta.titleId || activeBook);

    exitLabel.textContent = dict.exitReader || (isTr ? 'Okumadan Çık' : 'Keluar Baca');
    btnExit.setAttribute('aria-label', exitLabel.textContent);

    searchInput.placeholder = dict.readerSearchPlaceholder || (isTr ? 'Sorularda veya cevaplarda arayınız...' : 'Cari dalam pertanyaan atau jawaban...');

    const visibleItems = getVisibleItems();
    const countLabel = isTr ? 'Soru' : 'Soal';
    countBadge.textContent = `${visibleItems.length} ${countLabel}`;

    if (visibleItems.length === 0) {
      emptyState.classList.remove('hidden');
      emptyText.textContent = dict.noResultsFound || (isTr ? 'Aradığınız terime uygun bir soru veya cevap bulunamadı.' : 'Tidak ditemukan soal atau jawaban yang sesuai.');
      listContainer.innerHTML = '';
      return;
    }

    emptyState.classList.add('hidden');

    const copyBtnText = dict.copyText || (isTr ? 'Kopyala' : 'Salin');

    const cardsHtml = visibleItems.map((item) => {
      const qClass = isTr
        ? 'reader-question-text font-arabic text-rtl text-xl md:text-2xl font-bold leading-loose'
        : 'reader-question-text font-latin text-ltr text-base md:text-lg font-bold leading-relaxed';

      const aClass = isTr
        ? 'reader-answer-text font-arabic text-rtl text-lg md:text-xl leading-loose text-primary bg-surface-elevated p-4 rounded-xl border border-subtle'
        : 'reader-answer-text font-latin text-ltr text-sm md:text-base leading-relaxed text-primary bg-surface-elevated p-4 rounded-xl border border-subtle';

      return `
        <article class="reader-card neu-card flex flex-col gap-4 p-6 md:p-8" id="reader-card-${item.id}" data-id="${item.id}">
          <div class="flex items-center justify-between gap-2 border-b border-subtle pb-3">
            <div class="flex items-center gap-2">
              <span class="reader-chapter-badge neu-badge neu-badge-accent text-xs">${item.chapterName}</span>
              <span class="reader-number-badge neu-badge text-xs">No: ${item.number}</span>
            </div>
            <button
              id="btn-copy-item-${item.id}"
              class="neu-button btn-copy-reader-item flex items-center gap-1.5 text-xs py-1 px-2.5"
              aria-label="${copyBtnText}"
              title="${copyBtnText}"
              data-id="${item.id}"
            >
              ${getIconSvg('copy', 14)}
              <span class="copy-label hidden sm:inline">${copyBtnText}</span>
            </button>
          </div>

          <div class="reader-question-container py-1">
            <div class="${qClass}">${item.question}</div>
          </div>

          <div class="reader-answer-container pt-3 border-t border-subtle">
            <div class="${aClass}">${item.answer}</div>
          </div>
        </article>
      `;
    }).join('');

    listContainer.innerHTML = cardsHtml;
  }

  // Interactive Events
  chapterSelect.addEventListener('change', () => {
    activeChapter = chapterSelect.value;
    store.setState({ activeChapter });
    renderList();
  });

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    renderList();
  });

  btnExit.addEventListener('click', () => {
    playPureSfx('click');
    store.setState({ currentView: 'study' });
  });

  // Delegated copy event listener
  listContainer.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.btn-copy-reader-item');
    if (!copyBtn) return;

    const itemId = copyBtn.getAttribute('data-id');
    const visibleItems = getVisibleItems();
    const targetItem = visibleItems.find((it) => it.id === itemId);
    if (!targetItem) return;

    const isTr = activeLang === 'tr';
    const dict = getDict();

    const plainQuestion = stripHtml(targetItem.question);
    const plainAnswer = stripHtml(targetItem.answer);
    const textToCopy = `${plainQuestion}\n\n${plainAnswer}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy).catch(() => {});
    }

    playPureSfx('click');
    showToast(dict.textCopied || (isTr ? 'Metin panoya kopyalandı' : 'Teks berhasil disalin ke clipboard'));
  });

  // Reactive store subscription
  const unsubscribe = store.subscribe((nextState, prevState) => {
    let shouldUpdateSelect = false;
    let shouldRender = false;

    if (nextState.activeLang !== activeLang) {
      activeLang = nextState.activeLang || 'tr';
      shouldUpdateSelect = true;
      shouldRender = true;
    }

    if (nextState.activeBook !== activeBook) {
      activeBook = nextState.activeBook || 'quduri';
      activeChapter = nextState.activeChapter || 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      shouldUpdateSelect = true;
      shouldRender = true;
    } else if (nextState.activeChapter !== activeChapter) {
      activeChapter = nextState.activeChapter || 'all';
      if (chapterSelect) chapterSelect.value = activeChapter;
      shouldRender = true;
    }

    if (shouldUpdateSelect) {
      updateChapterSelectOptions();
    }
    if (shouldRender) {
      renderList();
    }
  });

  // Initial render
  updateChapterSelectOptions();
  renderList();

  return () => {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    unsubscribe();
  };
}
