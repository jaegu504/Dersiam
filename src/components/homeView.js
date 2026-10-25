/**
 * Home View (Landing Page) Component
 * 6 Kitab Selection with Neumorphic Cards & 100% Bilingual Support.
 *
 * Zero emojis - Pure SVG vector icons.
 */

import { booksMetadata } from '../data/books.js';
import { dictionary } from '../data/dictionary.js';
import { playPureSfx } from '../services/audio.js';
import { getIconSvg } from './icons.js';
import { loadLastSession } from '../state/storage.js';
import { staggerIn } from '../services/motion.js';

const BOOK_KEYS = ['quduri', 'talhis', 'kafiye', 'menar', 'akaid', 'maksud'];

/** First letter of the book's distinctive word: "مختصر القدوري" gives "ق". */
function bookGlyph(titleAr) {
  const word = titleAr.replace(/^(كتاب|متن|مختصر)\s+/, '').trim();
  return word.replace(/^ال/, '').charAt(0);
}

/**
 * Renders the home landing page: hero, "continue" card and the six kitab cards.
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
    const chapterLabel = dict.chaptersShort || (isTr ? 'Bölüm' : 'Bab');
    const questionLabel = dict.questionsShort || (isTr ? 'Soru' : 'Soal');
    const startLabel = dict.startStudying || (isTr ? 'Mütalaaya Başla' : 'Mulai Belajar');

    return `
      <article class="book-card neu-card neu-card-interactive flex flex-col justify-between gap-4" data-book-id="${key}" role="button" tabindex="0" aria-label="${title}" style="--book-color: ${book.themeColor || 'var(--accent-primary)'}">
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-2">
            <span class="book-chip" aria-hidden="true">${bookGlyph(book.titleAr)}</span>
            <span class="category-badge neu-badge neu-badge-accent">${category}</span>
          </div>

          <div class="arabic-title font-arabic text-rtl font-bold">
            ${book.titleAr}
          </div>

          <h3 class="book-title">
            ${title}
          </h3>
          <span class="author-name text-xs text-secondary">${author}</span>

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

  const session = loadLastSession();
  const sessionBook = session && booksMetadata[session.book] ? booksMetadata[session.book] : null;

  function resumeHtml(currentLang) {
    if (!sessionBook) return '';
    const d = dictionary[currentLang] || dictionary.tr;
    const tr = currentLang === 'tr';
    const total = Math.max(session.total || 0, 1);
    const pos = Math.min((session.index || 0) + 1, total);
    const chapterName = session.chapter === 'all' || !session.chapter
      ? (d.allChapters || '')
      : ((tr ? session.chapterNameTr : session.chapterNameId) || '');
    const meta = `${chapterName} · ${tr ? 'Soru' : 'Soal'} ${pos}/${total}`;
    return `
      <a href="#" class="resume-card neu-card" id="resume-card" aria-label="${d.continueStudying}: ${tr ? sessionBook.titleTr : sessionBook.titleId}, ${meta}">
        <span class="resume-top">
          <span class="resume-label">${d.continueStudying}</span>
          <span class="resume-title font-arabic">${sessionBook.titleAr}</span>
        </span>
        <span class="resume-meta">${meta}</span>
        <span class="resume-bar" aria-hidden="true"><i style="width: ${Math.round((pos / total) * 100)}%"></i></span>
        <span class="resume-go">${d.continueShort}${getIconSvg('arrowRight', 16)}</span>
      </a>
    `;
  }

  container.innerHTML = `
    <section class="home-view flex flex-col gap-8 w-full animate-fade-in">
      <!-- Hero Section -->
      <header class="hero-section flex flex-col gap-3">
        <span class="hero-badge neu-badge neu-badge-accent text-xs">${dict.brandSubtitle || '6 Temel Eser'}</span>
        <h1 class="hero-title">
          ${dict.welcomeTitle || 'Altı Temel Klasik Kitap'}
        </h1>
        <p class="hero-subtitle text-secondary">
          ${dict.welcomeSubtitle || 'Ezberleme, mütalaa ve imtihan portalına hoş geldiniz.'}
        </p>
      </header>

      ${resumeHtml(lang)}

      <!-- Kitab Cards Grid -->
      <section class="kitab-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="${dict.selectBook || 'Kitap Seçimi'}">
        ${cardsHtml}
      </section>
    </section>
  `;

  function bindResume() {
    container.querySelector('#resume-card')?.addEventListener('click', (e) => {
      e.preventDefault();
      playPureSfx('start');
      store.setState({
        activeBook: session.book,
        currentView: 'study',
        activeChapter: session.chapter || 'all',
        currentQuestionIndex: session.index || 0
      });
    });
  }
  bindResume();

  // Attach click listeners to cards
  const cardElements = container.querySelectorAll('.book-card');
  staggerIn(container.querySelectorAll('.hero-section > *, .resume-card, .book-card'), { stagger: 0.05 });
  cardElements.forEach((card) => {
    const bookKey = card.getAttribute('data-book-id');

    const handleSelect = (e) => {
      e.preventDefault();
      playPureSfx('start');
      store.setState({
        activeBook: bookKey,
        currentView: 'study',
        activeChapter: 'all',
        currentQuestionIndex: 0
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

    if (heroBadge) heroBadge.textContent = nextDict.brandSubtitle || '6 Temel Eser';
    if (heroTitle) heroTitle.textContent = nextDict.welcomeTitle || 'Altı Temel Klasik Kitap';
    if (heroSubtitle) heroSubtitle.textContent = nextDict.welcomeSubtitle || 'Ezberleme, mütalaa ve imtihan portalına hoş geldiniz.';
    if (kitabGrid) kitabGrid.setAttribute('aria-label', nextDict.selectBook || 'Kitap Seçimi');

    const resumeEl = container.querySelector('#resume-card');
    if (resumeEl) {
      resumeEl.outerHTML = resumeHtml(currentLang);
      bindResume();
    }

    cardElements.forEach((card) => {
      const key = card.getAttribute('data-book-id');
      const book = booksMetadata[key];
      if (!book) return;

      const title = nextIsTr ? book.titleTr : book.titleId;
      const category = nextIsTr ? book.categoryTr : book.categoryId;
      const desc = nextIsTr ? book.descTr : book.descId;
      const author = nextIsTr ? book.authorTr : book.authorId;
      const chapterLabel = nextDict.chaptersShort || (nextIsTr ? 'Bölüm' : 'Bab');
      const questionLabel = nextDict.questionsShort || (nextIsTr ? 'Soru' : 'Soal');
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
