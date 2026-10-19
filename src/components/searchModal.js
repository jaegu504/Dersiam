/**
 * Universal Bilingual Search Dialog Component
 * 100% Bebas Emoji: Zero unicode emojis anywhere in code, SVG, or markup.
 * 100% Dwibahasa Penuh: Full bilingual reactivity (Turkish & Indonesian).
 */

import { searchAllBooks } from '../services/search.js';
import { booksData, booksMetadata } from '../data/books.js';
import { dictionary } from '../data/dictionary.js';
import { getIconSvg } from './icons.js';
import { playPureSfx } from '../services/audio.js';

/**
 * Traps keyboard focus within an element.
 *
 * @param {HTMLElement} element - Container modal element
 * @returns {Function} Cleanup function
 */
function trapFocus(element) {
  function handleFocus(e) {
    if (e.key !== 'Tab') return;

    const focusables = element.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables || focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  element.addEventListener('keydown', handleFocus);
  return () => {
    element.removeEventListener('keydown', handleFocus);
  };
}

/**
 * Opens the universal search dialog allowing real-time searching across all 5 classical books.
 * Clicking a result deep-jumps into study view with that question active.
 *
 * @param {import('../state/store.js').AppStore} store - Reactive application store
 * @returns {() => void} Close modal function
 */
export function openSearchModal(store) {
  playPureSfx('click');
  const state = store.getState();
  const lang = state.activeLang || 'tr';
  const dict = dictionary[lang] || dictionary.tr;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop search-modal-backdrop';

  const modal = document.createElement('div');
  modal.className = 'modal-dialog search-modal neu-card p-0';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', dict.searchTitle);

  modal.innerHTML = `
    <div class="modal-header">
      <div class="flex items-center gap-2">
        ${getIconSvg('search', 20)}
        <h3 class="font-bold text-base md:text-lg">${dict.searchTitle}</h3>
      </div>
      <button class="modal-close-btn neu-button" aria-label="${dict.close}" title="${dict.close}">
        ${getIconSvg('close', 18)}
      </button>
    </div>

    <div class="modal-body flex flex-col gap-3">
      <!-- Search Input -->
      <div class="relative w-full">
        <input
          type="text"
          class="neu-input search-input w-full pr-10"
          placeholder="${dict.searchPlaceholder}"
          aria-label="${dict.searchTitle}"
          autofocus
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
          ${getIconSvg('search', 18)}
        </div>
      </div>

      <!-- Results Container -->
      <div class="search-results-container flex flex-col gap-2 min-h-[220px]">
        <div class="search-hint text-xs text-secondary text-center py-6">
          ${dict.searchHint}
        </div>
        <div class="search-results-list hidden"></div>
      </div>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  const cleanupFocus = trapFocus(modal);
  const inputEl = modal.querySelector('input.search-input');
  const resultsContainer = modal.querySelector('.search-results-container');
  const resultsList = modal.querySelector('.search-results-list');
  const hintEl = modal.querySelector('.search-hint');

  function getBookTitle(bookKey) {
    const meta = booksMetadata[bookKey];
    if (!meta) return bookKey ? bookKey.toUpperCase() : '';
    return lang === 'id' ? meta.titleId : meta.titleTr;
  }

  function getChapterName(item) {
    return lang === 'id'
      ? (item.chapterNameId || item.chapterNameTr || item.chapterId || '')
      : (item.chapterNameTr || item.chapterNameId || item.chapterId || '');
  }

  function handleSearch() {
    const query = inputEl.value.trim();

    if (!query) {
      hintEl.classList.remove('hidden');
      resultsList.classList.add('hidden');
      resultsList.innerHTML = '';
      return;
    }

    hintEl.classList.add('hidden');
    resultsList.classList.remove('hidden');

    const results = searchAllBooks(query, 50);

    if (results.length === 0) {
      resultsList.innerHTML = `
        <div class="search-no-results neu-card p-6 text-center text-secondary text-sm">
          ${dict.noResultsFound}
        </div>
      `;
      return;
    }

    resultsList.innerHTML = results.map(res => {
      const bookTitle = getBookTitle(res.item.bookKey);
      const chapterName = getChapterName(res.item);
      const langLabel = res.matchedLanguage ? res.matchedLanguage.toUpperCase() : 'TR';

      return `
        <div
          class="search-result-item neu-card-interactive flex flex-col gap-2 p-3.5"
          role="button"
          tabindex="0"
          data-book="${res.item.bookKey}"
          data-chapter="${res.item.chapterId || ''}"
          data-id="${res.item.id}"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="neu-badge neu-badge-accent book-badge">${bookTitle}</span>
              <span class="text-xs text-secondary result-chapter">${chapterName}</span>
            </div>
            <span class="neu-badge lang-badge font-bold">${langLabel}</span>
          </div>
          <div class="result-snippet text-sm leading-relaxed text-primary">
            ${res.matchSnippet}
          </div>
        </div>
      `;
    }).join('');

    // Attach click and enter key handlers to each result item
    const resultElements = resultsList.querySelectorAll('.search-result-item');
    resultElements.forEach(itemEl => {
      function triggerJump() {
        playPureSfx('click');
        const bookKey = itemEl.getAttribute('data-book');
        const chapterId = itemEl.getAttribute('data-chapter');
        const itemId = itemEl.getAttribute('data-id');

        const allQuestions = booksData[bookKey] || [];
        const chapterQuestions = (chapterId && chapterId !== 'all')
          ? allQuestions.filter(q => q.chapterId === chapterId)
          : allQuestions;

        const targetIndex = Math.max(0, chapterQuestions.findIndex(q => q.id === itemId));

        store.setState({
          activeBook: bookKey,
          currentView: 'study',
          activeChapter: chapterId || 'all',
          isAnswerRevealed: false,
          currentQuestionIndex: targetIndex
        });

        closeModal();
      }

      itemEl.addEventListener('click', triggerJump);
      itemEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerJump();
        }
      });
    });
  }

  inputEl?.addEventListener('input', handleSearch);

  function closeModal() {
    cleanupFocus();
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyDown);
    }
    if (backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  const closeBtn = modal.querySelector('.modal-close-btn');
  closeBtn?.addEventListener('click', () => {
    playPureSfx('click');
    closeModal();
  });

  // Autofocus input
  setTimeout(() => {
    inputEl?.focus();
  }, 50);

  return closeModal;
}
