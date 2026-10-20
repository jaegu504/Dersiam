/**
 * Header and Navigation Component
 * Zero emojis - Pure SVG vector icons & full bilingual reactivity.
 *
 * Enforces strict visibility:
 * - Home button and active book title badge are strictly hidden on Home screen.
 * - Visible on all study/exam/reader screens.
 */

import { getIconSvg } from './icons.js';
import { dictionary } from '../data/dictionary.js';
import { booksMetadata } from '../data/books.js';
import { playPureSfx } from '../services/audio.js';

/**
 * Calculates visibility states for header elements based on current view.
 * @param {string} currentView - 'home' | 'study' | 'exam' | 'reader'
 * @returns {{ showHomeBtn: boolean, showBookInfo: boolean, showBrandLogo: boolean }}
 */
export function getHeaderVisibility(currentView) {
  const isHome = currentView === 'home';
  return {
    showHomeBtn: !isHome,
    showBookInfo: !isHome,
    showBrandLogo: true
  };
}

/**
 * Renders the responsive header navigation bar.
 * @param {HTMLElement} container - Header container element (#header-mount)
 * @param {import('../state/store.js').AppStore} store - Reactive application store
 */
export function renderHeader(container, store) {
  if (!container || !store) return;

  function getLocalizedText(lang, key, fallback = '') {
    return dictionary[lang]?.[key] || dictionary.tr?.[key] || fallback;
  }

  function getBookTitle(activeBook, lang) {
    if (!activeBook || !booksMetadata[activeBook]) return '';
    const meta = booksMetadata[activeBook];
    return lang === 'id' ? meta.titleId : meta.titleTr;
  }

  const initialState = store.getState();
  const initialVisibility = getHeaderVisibility(initialState.currentView);
  const initialLang = initialState.activeLang || 'tr';
  const initialBookTitle = getBookTitle(initialState.activeBook, initialLang);
  const isInitialDark = Boolean(initialState.isDarkMode);

  // Sync document theme attribute
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', isInitialDark ? 'dark' : 'light');
  }

  container.innerHTML = `
    <nav id="header-bar" class="header-bar">
      <!-- Left Section: Brand & Context Navigation -->
      <div class="flex items-center gap-3">
        <div class="header-brand flex items-center gap-2">
          <span class="brand-title font-bold text-lg cursor-pointer">${getLocalizedText(initialLang, 'brandTitle', 'Klasik Medrese Portal')}</span>
        </div>

        <button id="btn-home" class="neu-button${initialVisibility.showHomeBtn ? '' : ' hidden'}" aria-label="${getLocalizedText(initialLang, 'homeBtn', 'Ana Sayfa')}">
          ${getIconSvg('home', 18)}
          <span class="home-btn-label">${getLocalizedText(initialLang, 'homeBtn', 'Ana Sayfa')}</span>
        </button>

        <span id="active-book-title" class="neu-badge neu-badge-accent${initialVisibility.showBookInfo && initialBookTitle ? '' : ' hidden'}">
          ${initialBookTitle}
        </span>
      </div>

      <!-- Right Section: Tools & Settings -->
      <div class="flex items-center gap-2">
        <button id="btn-search-trigger" class="neu-button" aria-label="${getLocalizedText(initialLang, 'searchNav', 'Genel Arama')}" title="${getLocalizedText(initialLang, 'searchNav', 'Genel Arama')}">
          ${getIconSvg('search', 18)}
        </button>

        <button id="btn-lang-toggle" class="neu-button" aria-label="${getLocalizedText(initialLang, 'langToggle', 'Dili Değiştir')}" title="${getLocalizedText(initialLang, 'langToggle', 'Dili Değiştir')}">
          <span class="lang-label font-bold">${initialLang.toUpperCase()}</span>
        </button>

        <button id="btn-theme-toggle" class="neu-button" aria-label="${getLocalizedText(initialLang, 'themeToggle', 'Temayı Değiştir')}" title="${getLocalizedText(initialLang, 'themeToggle', 'Temayı Değiştir')}">
          <span class="theme-icon">${getIconSvg(isInitialDark ? 'sun' : 'moon', 18)}</span>
        </button>

        <button id="btn-settings-trigger" class="neu-button" aria-label="${getLocalizedText(initialLang, 'settingsNav', 'Ayarlar')}" title="${getLocalizedText(initialLang, 'settingsNav', 'Ayarlar')}">
          ${getIconSvg('settings', 18)}
        </button>
      </div>
    </nav>
  `;

  // Element references
  const brandTitleEl = container.querySelector('.brand-title');
  if (brandTitleEl && initialVisibility.showHomeBtn) {
    brandTitleEl.classList.add('hidden-sm');
  }
  const homeBtn = container.querySelector('#btn-home');
  const homeLabel = container.querySelector('.home-btn-label');
  const bookTitleBadge = container.querySelector('#active-book-title');
  const searchBtn = container.querySelector('#btn-search-trigger');
  const langToggleBtn = container.querySelector('#btn-lang-toggle');
  const langLabel = container.querySelector('.lang-label');
  const themeToggleBtn = container.querySelector('#btn-theme-toggle');
  const themeIconContainer = container.querySelector('.theme-icon');
  const settingsBtn = container.querySelector('#btn-settings-trigger');

  // Event handlers
  brandTitleEl?.addEventListener('click', () => {
    playPureSfx('click');
    store.setState({ currentView: 'home' });
  });

  homeBtn?.addEventListener('click', () => {
    playPureSfx('click');
    store.setState({ currentView: 'home' });
  });

  searchBtn?.addEventListener('click', () => {
    playPureSfx('click');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-search'));
    }
  });

  langToggleBtn?.addEventListener('click', () => {
    playPureSfx('click');
    const currentLang = store.getState().activeLang || 'tr';
    const nextLang = currentLang === 'tr' ? 'id' : 'tr';
    store.setState({ activeLang: nextLang });
  });

  themeToggleBtn?.addEventListener('click', () => {
    playPureSfx('click');
    const nextDark = !store.getState().isDarkMode;
    store.setState({ isDarkMode: nextDark });
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', nextDark ? 'dark' : 'light');
    }
  });

  settingsBtn?.addEventListener('click', () => {
    playPureSfx('click');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-settings'));
    }
  });

  // Reactive store subscription
  const unsubscribe = store.subscribe((state) => {
    const lang = state.activeLang || 'tr';
    const visibility = getHeaderVisibility(state.currentView);
    const bookTitle = getBookTitle(state.activeBook, lang);
    const isDark = Boolean(state.isDarkMode);

    // Update Brand Title
    if (brandTitleEl) {
      brandTitleEl.textContent = getLocalizedText(lang, 'brandTitle', 'Klasik Medrese Portal');
      brandTitleEl.classList.toggle('hidden-sm', visibility.showHomeBtn);
    }

    // Update Home Button
    if (homeBtn) {
      if (visibility.showHomeBtn) {
        homeBtn.classList.remove('hidden');
      } else {
        homeBtn.classList.add('hidden');
      }
      homeBtn.setAttribute('aria-label', getLocalizedText(lang, 'homeBtn', 'Ana Sayfa'));
    }
    if (homeLabel) {
      homeLabel.textContent = getLocalizedText(lang, 'homeBtn', 'Ana Sayfa');
    }

    // Update Active Book Title Badge
    if (bookTitleBadge) {
      if (visibility.showBookInfo && bookTitle) {
        bookTitleBadge.classList.remove('hidden');
        bookTitleBadge.textContent = bookTitle;
      } else {
        bookTitleBadge.classList.add('hidden');
        bookTitleBadge.textContent = '';
      }
    }

    // Update Tools aria-labels & labels
    if (searchBtn) {
      searchBtn.setAttribute('aria-label', getLocalizedText(lang, 'searchNav', 'Genel Arama'));
      searchBtn.setAttribute('title', getLocalizedText(lang, 'searchNav', 'Genel Arama'));
    }

    if (langToggleBtn) {
      langToggleBtn.setAttribute('aria-label', getLocalizedText(lang, 'langToggle', 'Dili Değiştir'));
      langToggleBtn.setAttribute('title', getLocalizedText(lang, 'langToggle', 'Dili Değiştir'));
    }
    if (langLabel) {
      langLabel.textContent = lang.toUpperCase();
    }

    // Update Theme toggle
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', getLocalizedText(lang, 'themeToggle', 'Temayı Değiştir'));
      themeToggleBtn.setAttribute('title', getLocalizedText(lang, 'themeToggle', 'Temayı Değiştir'));
    }
    if (themeIconContainer) {
      themeIconContainer.innerHTML = getIconSvg(isDark ? 'sun' : 'moon', 18);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }

    if (settingsBtn) {
      settingsBtn.setAttribute('aria-label', getLocalizedText(lang, 'settingsNav', 'Ayarlar'));
      settingsBtn.setAttribute('title', getLocalizedText(lang, 'settingsNav', 'Ayarlar'));
    }
  });

  return unsubscribe;
}
