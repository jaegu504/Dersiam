import './styles/main.css';
import './styles/taman.css';
import store from './state/store.js';
import { renderHeader } from './components/header.js';
import { renderHomeView } from './components/homeView.js';
import { renderStudyView } from './components/studyView.js';
import { renderExamView } from './components/examView.js';
import { renderReaderView } from './components/readerView.js';
import { openSearchModal } from './components/searchModal.js';
import { openSettingsModal } from './components/settingsModal.js';
import { loadSettings, saveSettings } from './state/storage.js';
import { setAudioMute } from './services/audio.js';

const SETTING_KEYS = ['isDarkMode', 'isAudioMuted', 'activeAlgorithm', 'activeLang', 'fontSize'];

/**
 * Applies settings that live outside the component tree (theme, font size, mute).
 * @param {object} state
 */
function applyGlobalSettings(state) {
  setAudioMute(Boolean(state.isAudioMuted));
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', state.isDarkMode ? 'dark' : 'light');
  root.setAttribute('lang', state.activeLang === 'id' ? 'id' : 'tr');
  const size = state.fontSize || 'medium';
  root.setAttribute('data-font-size', size);
  root.style.fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', state.isDarkMode ? '#0F1A13' : '#EEF4E8');
}

/**
 * Initializes the application lifecycle and reactive view mounting.
 * @param {HTMLElement} [appRoot] - Root DOM container (#app)
 * @param {import('./state/store.js').AppStore} [appStore] - Reactive application store
 * @returns {{ headerUnmount: Function, viewUnmount: Function }}
 */
export function initApp(appRoot = document.getElementById('app'), appStore = store) {
  if (!appRoot) return null;

  // Restore saved preferences before the first render
  const saved = loadSettings();
  appStore.setState(Object.fromEntries(SETTING_KEYS.map((key) => [key, saved[key] ?? appStore.getState()[key]])));
  applyGlobalSettings(appStore.getState());

  appRoot.innerHTML = `
    <div class="app-container">
      <header id="header-mount"></header>
      <main id="view-mount" class="view-container"></main>
    </div>
  `;

  const headerMount = appRoot.querySelector('#header-mount');
  const viewMount = appRoot.querySelector('#view-mount');

  // Render sticky top header
  const headerUnmount = renderHeader(headerMount, appStore);

  let currentViewUnmount = null;
  let isPopstateNavigation = false;

  // Initialize browser history entry if needed
  if (typeof window !== 'undefined' && window.history) {
    const initialState = appStore.getState();
    if (!window.history.state || !window.history.state.view) {
      window.history.replaceState(
        { view: initialState.currentView, book: initialState.activeBook },
        '',
        window.location.pathname
      );
    }
  }

  function mountView(currentView) {
    if (typeof currentViewUnmount === 'function') {
      currentViewUnmount();
      currentViewUnmount = null;
    }

    if (currentView === 'home') {
      currentViewUnmount = renderHomeView(viewMount, appStore);
    } else if (currentView === 'study') {
      currentViewUnmount = renderStudyView(viewMount, appStore);
    } else if (currentView === 'exam') {
      currentViewUnmount = renderExamView(viewMount, appStore);
    } else if (currentView === 'reader') {
      currentViewUnmount = renderReaderView(viewMount, appStore);
    } else {
      // Placeholder for next stages (study, exam, reader)
      const state = appStore.getState();
      const isTr = state.activeLang === 'tr';
      viewMount.innerHTML = `
        <div class="neu-card flex flex-col gap-4 items-center justify-center p-8 text-center my-8">
          <span class="neu-badge neu-badge-accent">${state.activeBook ? state.activeBook.toUpperCase() : 'KITAB'}</span>
          <h2 class="font-bold text-xl">${currentView.toUpperCase()} ${isTr ? 'GÖRÜNÜMÜ' : 'TAMPILAN'}</h2>
          <p class="text-secondary max-w-md text-sm">
            ${isTr 
              ? 'Bu çalışma modülü sonraki aşamalarda aktifleşecektir. Ana sayfaya dönmek için yukarıdaki Ana Sayfa butonuna tıklayabilirsiniz.' 
              : 'Modul belajar ini akan diaktifkan pada tahap berikutnya. Klik tombol Beranda di atas untuk kembali.'}
          </p>
          <button id="btn-back-home" class="neu-button neu-button-primary mt-2">
            ${isTr ? 'Ana Sayfaya Dön' : 'Kembali ke Beranda'}
          </button>
        </div>
      `;

      const backBtn = viewMount.querySelector('#btn-back-home');
      backBtn?.addEventListener('click', () => {
        appStore.setState({ currentView: 'home' });
      });
    }
  }

  // Initial view render
  mountView(appStore.getState().currentView);

  // Subscribe to view changes
  const unsubscribeView = appStore.subscribe((state, prevState) => {
    if (SETTING_KEYS.some((key) => state[key] !== prevState?.[key])) {
      applyGlobalSettings(state);
      saveSettings({ ...loadSettings(), ...Object.fromEntries(SETTING_KEYS.map((key) => [key, state[key]])) });
    }

    if (state.currentView !== prevState?.currentView) {
      mountView(state.currentView);
    }

    // Synchronize browser history for native back buttons and mobile edge-swipe
    if (!isPopstateNavigation && typeof window !== 'undefined' && window.history) {
      const hState = window.history.state;
      const viewChanged = state.currentView !== prevState?.currentView;
      const bookChanged = state.activeBook !== prevState?.activeBook && state.currentView !== 'home';
      if (viewChanged || bookChanged) {
        const stateChanged = !hState || hState.view !== state.currentView || hState.book !== state.activeBook;
        if (stateChanged) {
          window.history.pushState(
            { view: state.currentView, book: state.activeBook },
            '',
            window.location.pathname
          );
        }
      }
    }
  });

  function handlePopState(event) {
    isPopstateNavigation = true;
    try {
      const hState = event.state;
      if (hState && hState.view) {
        appStore.setState({
          currentView: hState.view,
          activeBook: hState.book || null
        });
      } else {
        appStore.setState({
          currentView: 'home',
          activeBook: null
        });
      }
    } finally {
      isPopstateNavigation = false;
    }
  }

  // Modal trigger handlers
  function handleOpenSearch() {
    openSearchModal(appStore);
  }

  function handleOpenSettings() {
    openSettingsModal(appStore);
  }

  function handleGlobalKeyDown(e) {
    const activeTag = document.activeElement?.tagName;
    const isEditing = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT';

    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      openSearchModal(appStore);
    } else if (e.key === '/' && !isEditing) {
      e.preventDefault();
      openSearchModal(appStore);
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('open-search', handleOpenSearch);
    window.addEventListener('open-settings', handleOpenSettings);
    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('popstate', handlePopState);
  }

  return {
    headerUnmount,
    viewUnmount: () => {
      if (typeof currentViewUnmount === 'function') currentViewUnmount();
      if (typeof unsubscribeView === 'function') unsubscribeView();
      if (typeof window !== 'undefined') {
        window.removeEventListener('open-search', handleOpenSearch);
        window.removeEventListener('open-settings', handleOpenSettings);
        window.removeEventListener('keydown', handleGlobalKeyDown);
        window.removeEventListener('popstate', handlePopState);
      }
    }
  };
}

// Auto-initialize when running in DOM environment
if (typeof document !== 'undefined') {
  const root = document.getElementById('app');
  if (root) {
    initApp(root, store);
  }
}
