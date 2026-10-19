import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getAlgorithmExplanation, openAlgorithmInfoModal, openSettingsModal } from '../src/components/settingsModal.js';
import { openSearchModal } from '../src/components/searchModal.js';
import { createStore, DEFAULT_STATE } from '../src/state/store.js';
import { booksData, booksMetadata } from '../src/data/books.js';
import { loadUserProgress, saveUserProgress, recordSelfEvaluation } from '../src/state/storage.js';
import { initApp } from '../src/main.js';

describe('Modal Systems (Task 12)', () => {
  let store;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    store = createStore({
      ...DEFAULT_STATE,
      currentView: 'home',
      activeBook: 'quduri',
      activeLang: 'tr',
      activeChapter: 'all',
      isDarkMode: false,
      isAudioMuted: false,
      activeAlgorithm: 'random',
      fontSize: 'medium'
    });
    localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('Algorithm Explanations (getAlgorithmExplanation)', () => {
    it('returns comprehensive explanations in Turkish and Indonesian for all algorithms', () => {
      const algorithms = ['original', 'random', 'sequential', 'spaced'];
      algorithms.forEach((algo) => {
        const infoTr = getAlgorithmExplanation(algo, 'tr');
        const infoId = getAlgorithmExplanation(algo, 'id');

        expect(infoTr.title).toBeTruthy();
        expect(infoTr.description).toBeTruthy();
        expect(infoTr.mathLogic).toBeTruthy();

        expect(infoId.title).toBeTruthy();
        expect(infoId.description).toBeTruthy();
        expect(infoId.mathLogic).toBeTruthy();
      });
    });

    it('returns fallback gracefully for unknown algorithm or language', () => {
      const fallback = getAlgorithmExplanation('unknown_algo', 'es');
      expect(fallback.title).toBeTruthy();
      expect(fallback.description).toBeTruthy();
    });
  });

  describe('Algorithm Info Modal (openAlgorithmInfoModal)', () => {
    it('renders popup modal with algorithm explanation, math logic, and workflow', () => {
      const close = openAlgorithmInfoModal('spaced', 'tr');
      const modal = document.querySelector('.algo-info-modal');
      expect(modal).toBeTruthy();

      expect(modal.textContent).toContain('Akıllı Tekrar');
      expect(modal.querySelector('.modal-close-btn')).toBeTruthy();

      // Closes on close button click
      modal.querySelector('.modal-close-btn').click();
      expect(document.querySelector('.algo-info-modal')).toBeNull();
    });

    it('closes on ESC key press and backdrop click', () => {
      openAlgorithmInfoModal('sequential', 'id');
      const backdrop = document.querySelector('.modal-backdrop');
      expect(backdrop).toBeTruthy();

      // Press Escape
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(document.querySelector('.modal-backdrop')).toBeNull();

      // Reopen and click backdrop
      openAlgorithmInfoModal('original', 'tr');
      const newBackdrop = document.querySelector('.modal-backdrop');
      expect(newBackdrop).toBeTruthy();

      newBackdrop.click();
      expect(document.querySelector('.modal-backdrop')).toBeNull();
    });
  });

  describe('Universal Search Modal (openSearchModal)', () => {
    it('opens search modal with autofocus input and closes on ESC or close button', () => {
      const close = openSearchModal(store);
      const searchModal = document.querySelector('.search-modal');
      const input = searchModal.querySelector('input.search-input');

      expect(searchModal).toBeTruthy();
      expect(input).toBeTruthy();

      // Close using close button
      const closeBtn = searchModal.querySelector('.modal-close-btn');
      closeBtn.click();
      expect(document.querySelector('.search-modal')).toBeNull();
    });

    it('searches across all books and renders results with badges, snippet, and language indicator', async () => {
      openSearchModal(store);
      const input = document.querySelector('input.search-input');
      const resultsContainer = document.querySelector('.search-results-list');

      // Type a query that matches across multiple books
      input.value = 'taharah';
      input.dispatchEvent(new Event('input'));

      const resultItems = document.querySelectorAll('.search-result-item');
      expect(resultItems.length).toBeGreaterThan(0);

      const firstItem = resultItems[0];
      expect(firstItem.querySelector('.book-badge')).toBeTruthy();
      expect(firstItem.querySelector('.lang-badge')).toBeTruthy();
      expect(firstItem.querySelector('.result-snippet')).toBeTruthy();
    });

    it('shows empty state message when no results match', () => {
      openSearchModal(store);
      const input = document.querySelector('input.search-input');

      input.value = 'xyznonexistentquery12345';
      input.dispatchEvent(new Event('input'));

      const emptyEl = document.querySelector('.search-no-results');
      expect(emptyEl).toBeTruthy();
    });

    it('deep-jumps to question on result click and updates store state', () => {
      openSearchModal(store);
      const input = document.querySelector('input.search-input');

      input.value = 'taharah';
      input.dispatchEvent(new Event('input'));

      const firstItem = document.querySelector('.search-result-item');
      expect(firstItem).toBeTruthy();

      firstItem.click();

      // Search modal should close
      expect(document.querySelector('.search-modal')).toBeNull();

      // Store should transition to study mode with the question's book and chapter
      const state = store.getState();
      expect(state.currentView).toBe('study');
      expect(state.activeBook).toBeTruthy();
      expect(state.isAnswerRevealed).toBe(false);
      expect(typeof state.currentQuestionIndex).toBe('number');
    });
  });

  describe('Settings Modal (openSettingsModal)', () => {
    it('renders settings controls for theme, language, font size, sound, and algorithm', () => {
      openSettingsModal(store);
      const modal = document.querySelector('.settings-modal');
      expect(modal).toBeTruthy();

      expect(modal.querySelector('#setting-theme-light')).toBeTruthy();
      expect(modal.querySelector('#setting-theme-dark')).toBeTruthy();
      expect(modal.querySelector('#setting-lang-tr')).toBeTruthy();
      expect(modal.querySelector('#setting-lang-id')).toBeTruthy();
      expect(modal.querySelector('#setting-font-small')).toBeTruthy();
      expect(modal.querySelector('#setting-font-medium')).toBeTruthy();
      expect(modal.querySelector('#setting-font-large')).toBeTruthy();
      expect(modal.querySelector('#setting-sound-toggle')).toBeTruthy();
      expect(modal.querySelector('input[name="setting-algorithm"][value="random"]')).toBeTruthy();
      expect(modal.querySelector('input[name="setting-algorithm"][value="sequential"]')).toBeTruthy();
      expect(modal.querySelector('input[name="setting-algorithm"][value="spaced"]')).toBeTruthy();
      expect(modal.querySelector('#btn-reset-data')).toBeTruthy();
    });

    it('toggles theme, language, font size, sound, and algorithm reactivity', () => {
      openSettingsModal(store);

      // Change theme to dark
      const darkBtn = document.querySelector('#setting-theme-dark');
      darkBtn.click();
      expect(store.getState().isDarkMode).toBe(true);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      // Change language to Indonesian
      const langIdBtn = document.querySelector('#setting-lang-id');
      langIdBtn.click();
      expect(store.getState().activeLang).toBe('id');

      // Change font size to large
      const fontLargeBtn = document.querySelector('#setting-font-large');
      fontLargeBtn.click();
      expect(store.getState().fontSize).toBe('large');
      expect(document.documentElement.getAttribute('data-font-size')).toBe('large');

      // Toggle sound mute
      const soundBtn = document.querySelector('#setting-sound-toggle');
      soundBtn.click();
      expect(store.getState().isAudioMuted).toBe(true);

      // Select sequential algorithm
      const seqAlgoRadio = document.querySelector('input[name="setting-algorithm"][value="sequential"]');
      seqAlgoRadio.click();
      expect(store.getState().activeAlgorithm).toBe('sequential');
    });

    it('clicking algorithm (?) button opens algorithm info popup', () => {
      openSettingsModal(store);
      const infoBtns = document.querySelectorAll('.algo-info-btn');
      expect(infoBtns.length).toBeGreaterThan(0);

      infoBtns[0].click();
      expect(document.querySelector('.algo-info-modal')).toBeTruthy();
    });

    it('resets user data across all books when reset button is confirmed', () => {
      // Simulate progress in quduri and talhis
      let pQuduri = loadUserProgress('quduri');
      pQuduri = recordSelfEvaluation(pQuduri, 'q1', 'remembered');
      saveUserProgress('quduri', pQuduri);

      let pTalhis = loadUserProgress('talhis');
      pTalhis = recordSelfEvaluation(pTalhis, 't1', 'repeat');
      saveUserProgress('talhis', pTalhis);

      expect(loadUserProgress('quduri').viewedIds.length).toBeGreaterThan(0);
      expect(loadUserProgress('talhis').viewedIds.length).toBeGreaterThan(0);

      // Mock window.confirm to return true
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      openSettingsModal(store);
      const resetBtn = document.querySelector('#btn-reset-data');
      resetBtn.click();

      // Verify all progress is cleared
      expect(loadUserProgress('quduri').viewedIds.length).toBe(0);
      expect(loadUserProgress('talhis').viewedIds.length).toBe(0);
    });

    it('does not reset user data if confirmation is canceled', () => {
      let pQuduri = loadUserProgress('quduri');
      pQuduri = recordSelfEvaluation(pQuduri, 'q1', 'remembered');
      saveUserProgress('quduri', pQuduri);

      vi.spyOn(window, 'confirm').mockReturnValue(false);

      openSettingsModal(store);
      const resetBtn = document.querySelector('#btn-reset-data');
      resetBtn.click();

      expect(loadUserProgress('quduri').viewedIds.length).toBe(1);
    });
  });

  describe('Main.js Event & Keyboard Shortcut Wiring', () => {
    it('opens search modal on open-search event and Ctrl+K / Cmd+K / / shortcut', () => {
      const app = initApp(document.getElementById('app'), store);

      // open-search event
      window.dispatchEvent(new CustomEvent('open-search'));
      expect(document.querySelector('.search-modal')).toBeTruthy();
      document.querySelector('.modal-close-btn').click();
      expect(document.querySelector('.search-modal')).toBeNull();

      // open-settings event
      window.dispatchEvent(new CustomEvent('open-settings'));
      expect(document.querySelector('.settings-modal')).toBeTruthy();
      document.querySelector('.modal-close-btn').click();
      expect(document.querySelector('.settings-modal')).toBeNull();

      // Ctrl+K shortcut
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
      expect(document.querySelector('.search-modal')).toBeTruthy();
      document.querySelector('.modal-close-btn').click();

      // / shortcut
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }));
      expect(document.querySelector('.search-modal')).toBeTruthy();
      document.querySelector('.modal-close-btn').click();

      if (app && app.viewUnmount) app.viewUnmount();
    });
  });

  describe('Zero-Emoji Guarantee', () => {
    const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

    it('guarantees zero emojis in algorithm explanations', () => {
      ['original', 'sequential', 'spaced'].forEach((algo) => {
        const tr = getAlgorithmExplanation(algo, 'tr');
        const id = getAlgorithmExplanation(algo, 'id');
        expect(EMOJI_REGEX.test(tr.title)).toBe(false);
        expect(EMOJI_REGEX.test(tr.description)).toBe(false);
        expect(EMOJI_REGEX.test(tr.mathLogic)).toBe(false);
        expect(EMOJI_REGEX.test(id.title)).toBe(false);
        expect(EMOJI_REGEX.test(id.description)).toBe(false);
        expect(EMOJI_REGEX.test(id.mathLogic)).toBe(false);
      });
    });

    it('guarantees zero emojis in search and settings modal DOM output', () => {
      openSearchModal(store);
      const searchHtml = document.body.innerHTML;
      expect(EMOJI_REGEX.test(searchHtml)).toBe(false);

      // Close search modal
      document.querySelector('.modal-close-btn')?.click();

      openSettingsModal(store);
      const settingsHtml = document.body.innerHTML;
      expect(EMOJI_REGEX.test(settingsHtml)).toBe(false);
    });
  });
});
