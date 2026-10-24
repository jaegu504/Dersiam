/**
 * Home View (Landing Page) Component
 * 5 Kitab Selection with Neumorphic Cards & 100% Bilingual Support.
 *
 * Zero emojis - Pure SVG vector icons.
 */

import { booksMetadata } from '../data/books.js';
import { dictionary } from '../data/dictionary.js';
import { playPureSfx } from '../services/audio.js';
import { getIconSvg } from './icons.js';

const BOOK_KEYS = ['quduri', 'talhis', 'kafiye', 'menar', 'akaid', 'maksud'];

/**
 * Renders the home landing page with hero header and 5 classical kitab cards.
 * @param {HTMLElement} container - View mount element (#view-mount)
 * @param {import('../state/store.js').AppStore} store - Reactive application store
 */
export function renderHomeView(container, store) {
  if (!container || !store) return;

  const state = store.getState();
  const lang = state.activeLang || 'tr';
  const isTr = lang === 'tr';
  const dict = dictionary[lang] || dictionary.tr;

  const cardsHtml = BOOK_KEYS.map((key) => {
    const book = booksMetadata[key];
    if (!book) return '';

    const title = isTr ? book.titleTr : book.titleId;
    const category = isTr ? book.categoryTr : book.categoryId;
    const desc = isTr ? book.descTr : book.descId;
    const author = isTr ? book.authorTr : book.authorId;
    const chapterLabel = dict.totalChapters || (isTr ? 'Bölüm' : 'Bab');
    const questionLabel = dict.totalQuestions || (isTr ? 'Soru' : 'Soal');
    const startLabel = dict.startStudying || (isTr ? 'Mütalaaya Başla' : 'Mulai Belajar');

    return `
      <article class="book-card neu-card neu-card-interactive flex flex-col justify-between gap-4" data-book-id="${key}" role="button" tabindex="0" aria-label="${title}">
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-2">
            <span class="category-badge neu-badge neu-badge-accent">${category}</span>
            <span class="author-name text-xs text-secondary">${author}</span>
          </div>

          <div class="arabic-title font-arabic text-rtl text-2xl font-bold py-1" style="color: ${book.themeColor || 'inherit'}">
            ${book.titleAr}
          </div>

          <h3 class="book-title font-bold text-lg leading-tight">
            ${title}
          </h3>

          <p class="book-desc text-secondary text-sm leading-relaxed">
            ${desc}
          </p>
        </div>

        <div class="flex flex-col gap-3 pt-2 border-t border-subtle">
          <div class="flex items-center justify-between gap-2 text-xs">
            <span class="chapter-count neu-badge">
              ${book.totalChapters} ${chapterLabel}
            </span>
            <span class="question-count neu-badge neu-badge-info">
              ${book.totalQuestions} ${questionLabel}
            </span>
          </div>

          <button type="button" class="neu-button neu-button-primary w-full flex items-center justify-center gap-2">
            ${getIconSvg('book', 16)}
            <span class="start-btn-label">${startLabel}</span>
          </button>
        </div>
      </article>
    `;
  }).join('');

  container.innerHTML = `
    <section class="home-view flex flex-col gap-8 w-full animate-fade-in">
      <!-- Hero Section -->
      <header class="hero-section neu-card flex flex-col items-center text-center gap-3 py-8 px-6">
        <span class="hero-badge neu-badge neu-badge-accent text-xs">${dict.brandSubtitle || '5 Temel Eser'}</span>
        <h1 class="hero-title font-extrabold text-2xl md:text-3xl">
          ${dict.welcomeTitle || 'Beş Temel Klasik Kitap'}
        </h1>
        <p class="hero-subtitle text-secondary max-w-2xl text-sm md:text-base leading-relaxed">
          ${dict.welcomeSubtitle || 'Ezberleme, mütalaa ve imtihan portalına hoş geldiniz.'}
        </p>
      </header>

      <!-- Kitab Cards Grid -->
      <section class="kitab-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="${dict.selectBook || 'Kitap Seçimi'}">
        ${cardsHtml}
      </section>
    </section>
  `;

  // Attach click listeners to cards
  const cardElements = container.querySelectorAll('.book-card');
  cardElements.forEach((card) => {
    const bookKey = card.getAttribute('data-book-id');

    const handleSelect = (e) => {
      e.preventDefault();
      playPureSfx('click');
      store.setState({
        activeBook: bookKey,
        currentView: 'study',
        activeChapter: 'all'
      });
    };

    card.addEventListener('click', handleSelect);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleSelect(e);
      }
    });
  });

  function updateTexts(currentLang) {
    const nextIsTr = currentLang === 'tr';
    const nextDict = dictionary[currentLang] || dictionary.tr;

    const heroBadge = container.querySelector('.hero-badge');
    const heroTitle = container.querySelector('.hero-title');
    const heroSubtitle = container.querySelector('.hero-subtitle');
    const kitabGrid = container.querySelector('.kitab-grid');

    if (heroBadge) heroBadge.textContent = nextDict.brandSubtitle || '5 Temel Eser';
    if (heroTitle) heroTitle.textContent = nextDict.welcomeTitle || 'Beş Temel Klasik Kitap';
    if (heroSubtitle) heroSubtitle.textContent = nextDict.welcomeSubtitle || 'Ezberleme, mütalaa ve imtihan portalına hoş geldiniz.';
    if (kitabGrid) kitabGrid.setAttribute('aria-label', nextDict.selectBook || 'Kitap Seçimi');

    cardElements.forEach((card) => {
      const key = card.getAttribute('data-book-id');
      const book = booksMetadata[key];
      if (!book) return;

      const title = nextIsTr ? book.titleTr : book.titleId;
      const category = nextIsTr ? book.categoryTr : book.categoryId;
      const desc = nextIsTr ? book.descTr : book.descId;
      const author = nextIsTr ? book.authorTr : book.authorId;
      const chapterLabel = nextDict.totalChapters || (nextIsTr ? 'Bölüm' : 'Bab');
      const questionLabel = nextDict.totalQuestions || (nextIsTr ? 'Soru' : 'Soal');
      const startLabel = nextDict.startStudying || (nextIsTr ? 'Mütalaaya Başla' : 'Mulai Belajar');

      card.setAttribute('aria-label', title);

      const catBadge = card.querySelector('.category-badge');
      if (catBadge) catBadge.textContent = category;

      const authorEl = card.querySelector('.author-name');
      if (authorEl) authorEl.textContent = author;

      const titleEl = card.querySelector('.book-title');
      if (titleEl) titleEl.textContent = title;

      const descEl = card.querySelector('.book-desc');
      if (descEl) descEl.textContent = desc;

      const chapterEl = card.querySelector('.chapter-count');
      if (chapterEl) chapterEl.textContent = `${book.totalChapters} ${chapterLabel}`;

      const questionEl = card.querySelector('.question-count');
      if (questionEl) questionEl.textContent = `${book.totalQuestions} ${questionLabel}`;

      const startLabelEl = card.querySelector('.start-btn-label');
      if (startLabelEl) startLabelEl.textContent = startLabel;
    });
  }

  // Subscribe to language changes while view is mounted
  const unsubscribe = store.subscribe((state, prevState) => {
    if (state.activeLang !== prevState?.activeLang) {
      updateTexts(state.activeLang || 'tr');
    }
  });

  return unsubscribe;
}
