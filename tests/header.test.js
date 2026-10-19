import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getHeaderVisibility, renderHeader } from '../src/components/header.js';
import { renderHomeView } from '../src/components/homeView.js';
import { createStore, DEFAULT_STATE } from '../src/state/store.js';

describe('Header & Navigation Component', () => {
  describe('getHeaderVisibility', () => {
    it('hides Home button and active book name when currentView is home', () => {
      const visibility = getHeaderVisibility('home');
      expect(visibility.showHomeBtn).toBe(false);
      expect(visibility.showBookInfo).toBe(false);
      expect(visibility.showBrandLogo).toBe(true);
    });

    it('shows Home button and active book name when currentView is study, exam, or reader', () => {
      ['study', 'exam', 'reader'].forEach(view => {
        const visibility = getHeaderVisibility(view);
        expect(visibility.showHomeBtn).toBe(true);
        expect(visibility.showBookInfo).toBe(true);
        expect(visibility.showBrandLogo).toBe(true);
      });
    });
  });

  describe('renderHeader DOM tests', () => {
    let container;
    let store;

    beforeEach(() => {
      document.body.innerHTML = '';
      container = document.createElement('header');
      container.id = 'header-mount';
      document.body.appendChild(container);
      store = createStore({
        ...DEFAULT_STATE,
        currentView: 'home',
        activeBook: null,
        activeLang: 'tr',
        isDarkMode: false
      });
    });

    it('renders header bar and all required control buttons with zero emojis', () => {
      renderHeader(container, store);

      const headerBar = container.querySelector('#header-bar');
      expect(headerBar).toBeTruthy();

      const homeBtn = container.querySelector('#btn-home');
      const bookTitle = container.querySelector('#active-book-title');
      const searchBtn = container.querySelector('#btn-search-trigger');
      const langToggle = container.querySelector('#btn-lang-toggle');
      const themeToggle = container.querySelector('#btn-theme-toggle');
      const settingsBtn = container.querySelector('#btn-settings-trigger');

      expect(homeBtn).toBeTruthy();
      expect(bookTitle).toBeTruthy();
      expect(searchBtn).toBeTruthy();
      expect(langToggle).toBeTruthy();
      expect(themeToggle).toBeTruthy();
      expect(settingsBtn).toBeTruthy();

      // Zero emoji guarantee
      const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
      expect(emojiRegex.test(container.innerHTML)).toBe(false);
    });

    it('strictly hides Home button and active book title when currentView is home', () => {
      renderHeader(container, store);

      const homeBtn = container.querySelector('#btn-home');
      const bookTitle = container.querySelector('#active-book-title');

      expect(homeBtn.classList.contains('hidden')).toBe(true);
      expect(bookTitle.classList.contains('hidden')).toBe(true);
    });

    it('unhides Home button and active book title when currentView switches to study', () => {
      renderHeader(container, store);

      const homeBtn = container.querySelector('#btn-home');
      const bookTitle = container.querySelector('#active-book-title');

      store.setState({ currentView: 'study', activeBook: 'quduri' });

      expect(homeBtn.classList.contains('hidden')).toBe(false);
      expect(bookTitle.classList.contains('hidden')).toBe(false);
      expect(bookTitle.textContent).toContain("Muhtasarü'l-Kudûrî");
    });

    it('translates header labels and active book title when activeLang changes', () => {
      renderHeader(container, store);

      store.setState({ currentView: 'study', activeBook: 'quduri', activeLang: 'tr' });
      const bookTitle = container.querySelector('#active-book-title');
      const homeBtn = container.querySelector('#btn-home');
      expect(bookTitle.textContent).toContain("Muhtasarü'l-Kudûrî");
      expect(homeBtn.textContent).toContain('Ana Sayfa');

      store.setState({ activeLang: 'id' });
      expect(bookTitle.textContent).toContain('Mukhtashar al-Quduri');
      expect(homeBtn.textContent).toContain('Beranda');
    });

    it('toggles language when #btn-lang-toggle is clicked', () => {
      renderHeader(container, store);
      const langToggle = container.querySelector('#btn-lang-toggle');

      expect(store.getState().activeLang).toBe('tr');
      langToggle.click();
      expect(store.getState().activeLang).toBe('id');
      langToggle.click();
      expect(store.getState().activeLang).toBe('tr');
    });

    it('toggles theme when #btn-theme-toggle is clicked', () => {
      renderHeader(container, store);
      const themeToggle = container.querySelector('#btn-theme-toggle');

      expect(store.getState().isDarkMode).toBe(false);
      themeToggle.click();
      expect(store.getState().isDarkMode).toBe(true);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      themeToggle.click();
      expect(store.getState().isDarkMode).toBe(false);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('navigates back to home view when #btn-home is clicked', () => {
      store.setState({ currentView: 'study', activeBook: 'talhis' });
      renderHeader(container, store);

      const homeBtn = container.querySelector('#btn-home');
      expect(homeBtn.classList.contains('hidden')).toBe(false);

      homeBtn.click();
      expect(store.getState().currentView).toBe('home');
      expect(homeBtn.classList.contains('hidden')).toBe(true);
    });
  });
});

describe('HomeView Landing Page Component', () => {
  let container;
  let store;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('main');
    container.id = 'view-mount';
    document.body.appendChild(container);
    store = createStore({
      ...DEFAULT_STATE,
      currentView: 'home',
      activeBook: null,
      activeLang: 'tr'
    });
  });

  it('renders hero section and all 5 kitab cards with zero emojis', () => {
    renderHomeView(container, store);

    const cards = container.querySelectorAll('.book-card');
    expect(cards.length).toBe(5);

    const bookKeys = ['quduri', 'talhis', 'kafiye', 'menar', 'akaid'];
    bookKeys.forEach(key => {
      const card = container.querySelector(`[data-book-id="${key}"]`);
      expect(card).toBeTruthy();
      expect(card.querySelector('.arabic-title')).toBeTruthy();
      expect(card.querySelector('.book-title')).toBeTruthy();
      expect(card.querySelector('.category-badge')).toBeTruthy();
      expect(card.querySelector('.chapter-count')).toBeTruthy();
      expect(card.querySelector('.question-count')).toBeTruthy();
    });

    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
    expect(emojiRegex.test(container.innerHTML)).toBe(false);
  });

  it('translates hero and cards when activeLang toggles from tr to id', () => {
    renderHomeView(container, store);

    const heroTitle = container.querySelector('.hero-title');
    expect(heroTitle.textContent).toContain('Beş Temel Klasik Kitap');

    store.setState({ activeLang: 'id' });

    expect(heroTitle.textContent).toContain('Lima Kitab Klasik Utama');
    const quduriCard = container.querySelector('[data-book-id="quduri"]');
    expect(quduriCard.querySelector('.book-title').textContent).toContain('Mukhtashar al-Quduri');
    expect(quduriCard.querySelector('.category-badge').textContent).toContain('Fikih');
  });

  it('clicking a book card updates activeBook, currentView to study, and activeChapter to all', () => {
    renderHomeView(container, store);

    const kafiyeCard = container.querySelector('[data-book-id="kafiye"]');
    kafiyeCard.click();

    const state = store.getState();
    expect(state.activeBook).toBe('kafiye');
    expect(state.currentView).toBe('study');
    expect(state.activeChapter).toBe('all');
  });

  it('guarantees zero emoji in header.js, homeView.js, and main.js source files', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const files = [
      path.resolve(__dirname, '../src/components/header.js'),
      path.resolve(__dirname, '../src/components/homeView.js'),
      path.resolve(__dirname, '../src/main.js'),
    ];

    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
    for (const file of files) {
      const code = fs.readFileSync(file, 'utf-8');
      expect(emojiRegex.test(code), `Emoji found in ${file}`).toBe(false);
    }
  });
});

describe('initApp Application Entrypoint', () => {
  it('mounts header in #header-mount and home view in #view-mount', async () => {
    const { initApp } = await import('../src/main.js');
    document.body.innerHTML = '<div id="app"></div>';
    const root = document.getElementById('app');
    const customStore = createStore({
      ...DEFAULT_STATE,
      currentView: 'home',
      activeLang: 'tr'
    });

    const instance = initApp(root, customStore);
    expect(root.querySelector('#header-mount')).toBeTruthy();
    expect(root.querySelector('#view-mount')).toBeTruthy();
    expect(root.querySelector('#header-bar')).toBeTruthy();
    expect(root.querySelector('.home-view')).toBeTruthy();
    expect(root.querySelectorAll('.book-card').length).toBe(5);

    // Navigate to study
    customStore.setState({ currentView: 'study', activeBook: 'quduri' });
    expect(root.querySelector('#header-mount #btn-home').classList.contains('hidden')).toBe(false);

    instance.viewUnmount();
  });
});


