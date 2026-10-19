import './styles/main.css';
import store from './state/store.js';
import { renderHeader } from './components/header.js';
import { renderHomeView } from './components/homeView.js';
import { renderStudyView } from './components/studyView.js';

/**
 * Initializes the application lifecycle and reactive view mounting.
 * @param {HTMLElement} [appRoot] - Root DOM container (#app)
 * @param {import('./state/store.js').AppStore} [appStore] - Reactive application store
 * @returns {{ headerUnmount: Function, viewUnmount: Function }}
 */
export function initApp(appRoot = document.getElementById('app'), appStore = store) {
  if (!appRoot) return null;

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

  function mountView(currentView) {
    if (typeof currentViewUnmount === 'function') {
      currentViewUnmount();
      currentViewUnmount = null;
    }

    if (currentView === 'home') {
      currentViewUnmount = renderHomeView(viewMount, appStore);
    } else if (currentView === 'study') {
      currentViewUnmount = renderStudyView(viewMount, appStore);
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
    if (state.currentView !== prevState?.currentView) {
      mountView(state.currentView);
    }
  });

  return {
    headerUnmount,
    viewUnmount: () => {
      if (typeof currentViewUnmount === 'function') currentViewUnmount();
      if (typeof unsubscribeView === 'function') unsubscribeView();
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
