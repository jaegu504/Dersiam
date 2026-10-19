/**
 * Evaluation Dashboard Sidebar (Progress, Khatam %, Retention Ratio & Chapter Breakdown)
 * 100% Bebas Emoji: All icons use pure SVG vectors.
 * 100% Bilingual Reactivity: Instant TR (Osmanlıca) <-> ID (Indonesian) switching.
 */

import { booksData } from '../data/books.js';
import { dictionary } from '../data/dictionary.js';
import { loadUserProgress, calculateMetrics } from '../state/storage.js';
import { getIconSvg } from './icons.js';

/**
 * Formats metric values into standard percentage and count strings for the sidebar.
 *
 * @param {object} metrics - Raw metrics object.
 * @param {number} [metrics.completionPct] - Khatam percentage.
 * @param {number} [metrics.retentionPct] - Retention percentage.
 * @param {number} [metrics.remembered] - Count of remembered questions.
 * @param {number} [metrics.rememberedCount] - Alternative key for remembered count.
 * @param {number} [metrics.repeat] - Count of repeat questions.
 * @param {number} [metrics.repeatCount] - Alternative key for repeat count.
 * @returns {{ completionText: string, retentionText: string, rememberedText: string, repeatText: string }}
 */
export function formatSidebarMetrics(metrics = {}) {
  const completionPct = Number(metrics?.completionPct ?? 0);
  const retentionPct = Number(metrics?.retentionPct ?? 0);
  const remembered = Number(metrics?.remembered ?? metrics?.rememberedCount ?? 0);
  const repeat = Number(metrics?.repeat ?? metrics?.repeatCount ?? 0);

  return {
    completionText: `%${completionPct}`,
    retentionText: `%${retentionPct}`,
    rememberedText: `${remembered}`,
    repeatText: `${repeat}`
  };
}

/**
 * Extracts unique chapters from book questions data.
 *
 * @param {string} bookKey - Key of the book (e.g. 'quduri').
 * @returns {Array<{ id: string, nameTr: string, nameId: string }>}
 */
function getBookChapters(bookKey) {
  const rawQuestions = booksData[bookKey] || [];
  const chapterMap = new Map();
  rawQuestions.forEach((q) => {
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

/**
 * Renders the reactive evaluation dashboard sidebar and collapsible drawer.
 *
 * @param {HTMLElement} container - DOM mount element (#sidebar-mount)
 * @param {import('../state/store.js').AppStore} store - Reactive application store
 * @returns {Function} Clean unmount teardown function
 */
export function renderSidebar(container, store) {
  if (!container || !store) return () => {};

  let isDrawerOpen = false;

  function getDict() {
    const lang = store.getState().activeLang || 'tr';
    return dictionary[lang] || dictionary.tr;
  }

  function setDrawerOpen(open) {
    isDrawerOpen = Boolean(open);
    const sidebarEl = container.querySelector('#evaluation-sidebar');
    const backdropEl = container.querySelector('#sidebar-backdrop');
    if (sidebarEl) {
      sidebarEl.classList.toggle('sidebar-open', isDrawerOpen);
    }
    if (backdropEl) {
      backdropEl.classList.toggle('hidden', !isDrawerOpen);
    }
    const toggleBtn = document.getElementById('btn-toggle-eval');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', String(isDrawerOpen));
      toggleBtn.classList.toggle('active', isDrawerOpen);
    }
  }

  function renderContent() {
    const state = store.getState();
    const activeBook = state.activeBook || 'quduri';
    const activeChapter = state.activeChapter || 'all';
    const lang = state.activeLang || 'tr';
    const isTr = lang === 'tr';
    const dict = getDict();

    const bookQuestions = booksData[activeBook] || [];
    const totalQuestions = bookQuestions.length;
    const progress = loadUserProgress(activeBook);
    const metrics = calculateMetrics(progress, totalQuestions);
    const formatted = formatSidebarMetrics({
      completionPct: metrics.completionPct,
      retentionPct: metrics.retentionPct,
      remembered: metrics.rememberedCount,
      repeat: metrics.repeatCount
    });

    const chapters = getBookChapters(activeBook);

    const chaptersHtml = chapters.map((ch) => {
      const chName = isTr ? ch.nameTr : ch.nameId;
      const chQuestions = bookQuestions.filter((q) => q.chapterId === ch.id);
      const chTotal = chQuestions.length;
      const chViewed = chQuestions.filter((q) => progress.viewedIds && progress.viewedIds.includes(q.id)).length;
      const chPct = chTotal > 0 ? Math.round((chViewed / chTotal) * 100) : 0;
      const isActive = activeChapter === ch.id;

      return `
        <div class="chapter-item neu-card-interactive flex flex-col gap-1 p-2.5 rounded-xl border border-subtle cursor-pointer transition-all ${isActive ? 'active neu-inset' : ''}" data-chapter-id="${ch.id}" role="button" tabindex="0" aria-label="${chName}">
          <div class="flex items-center justify-between text-xs">
            <span class="chapter-name font-semibold truncate mr-2 ${isActive ? 'text-accent' : 'text-primary'}">${chName}</span>
            <span class="chapter-ratio shrink-0 text-secondary font-mono">${chViewed}/${chTotal} (%${chPct})</span>
          </div>
          <div class="neu-inset-sm h-1.5 w-full rounded-full overflow-hidden bg-surface mt-1">
            <div class="chapter-progress-bar h-full bg-accent-primary rounded-full transition-all duration-300" style="width: ${chPct}%"></div>
          </div>
        </div>
      `;
    }).join('');

    const headingText = dict.evalHeading || (isTr ? 'Mütalaa Değerlendirmesi' : 'Evaluasi & Statistik Belajar');
    const completionLabel = dict.statCompletion || (isTr ? '% Tamamlanma' : 'Tingkat Khatam');
    const retentionLabel = dict.retentionLabel || (isTr ? 'Kavrama Oranı' : 'Tingkat Penguasaan');
    const rememberedLabel = dict.evalRemembered || (isTr ? 'Hatırlandı' : 'Dihafal');
    const repeatLabel = dict.evalRepeat || (isTr ? 'Tekrar Et' : 'Perlu Diulang');
    const starredLabel = dict.filterStarred || (isTr ? 'Yıldızlı Sorular' : 'Soal Berbintang');
    const chapterProgressTitle = dict.chapterProgressTitle || (isTr ? 'Bölümlere Göre İlerleme' : 'Kemajuan Tiap Bab');
    const isStarredActive = activeChapter === 'starred';

    container.innerHTML = `
      <!-- Slide-over Backdrop for Mobile -->
      <div id="sidebar-backdrop" class="sidebar-backdrop fixed inset-0 z-40 ${isDrawerOpen ? '' : 'hidden'}"></div>

      <!-- Evaluation Sidebar / Slide-over Drawer Panel -->
      <aside id="evaluation-sidebar" class="sidebar-panel sidebar-panel-drawer neu-card flex flex-col gap-5 p-5 w-full bg-surface ${isDrawerOpen ? 'sidebar-open' : ''}" aria-label="${headingText}">
        <!-- Header with Title & Mobile Close Button -->
        <div class="flex items-center justify-between border-b border-subtle pb-3">
          <div class="flex items-center gap-2">
            ${getIconSvg('chart', 20, 'text-accent')}
            <h2 id="eval-heading" class="text-base font-bold text-primary">${headingText}</h2>
          </div>
          <button id="btn-close-sidebar" class="neu-button p-2 lg:hidden" aria-label="${dict.closeSidebar || 'Kapat'}" title="${dict.closeSidebar || 'Kapat'}">
            ${getIconSvg('close', 18)}
          </button>
        </div>

        <!-- Metric 1: Khatam / Completion Progress -->
        <div class="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-elevated border border-subtle">
          <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-secondary">${completionLabel}</span>
            <span id="stat-completion-value" class="font-bold text-primary font-mono">${formatted.completionText}</span>
          </div>
          <div class="neu-inset-sm h-2.5 w-full rounded-full overflow-hidden bg-surface">
            <div id="progress-bar-completion" class="h-full bg-accent-primary rounded-full transition-all duration-300" style="width: ${metrics.completionPct}%"></div>
          </div>
        </div>

        <!-- Metric 2: Retention / Understanding Progress -->
        <div class="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-elevated border border-subtle">
          <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-secondary">${retentionLabel}</span>
            <span id="stat-retention-value" class="font-bold text-primary font-mono">${formatted.retentionText}</span>
          </div>
          <div class="neu-inset-sm h-2.5 w-full rounded-full overflow-hidden bg-surface">
            <div id="progress-bar-retention" class="h-full bg-emerald-600 rounded-full transition-all duration-300" style="width: ${metrics.retentionPct}%"></div>
          </div>
        </div>

        <!-- Counters Row: Remembered vs Repeat -->
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col items-center justify-center p-3 rounded-xl bg-surface border border-subtle text-center gap-1">
            <div class="flex items-center gap-1.5 text-xs text-secondary">
              ${getIconSvg('check', 14, 'text-emerald-600')}
              <span>${rememberedLabel}</span>
            </div>
            <span id="badge-remembered" class="neu-badge neu-badge-success text-sm font-bold font-mono">${formatted.rememberedText}</span>
          </div>

          <div class="flex flex-col items-center justify-center p-3 rounded-xl bg-surface border border-subtle text-center gap-1">
            <div class="flex items-center gap-1.5 text-xs text-secondary">
              ${getIconSvg('cross', 14, 'text-amber-600')}
              <span>${repeatLabel}</span>
            </div>
            <span id="badge-repeat" class="neu-badge neu-badge-warning text-sm font-bold font-mono">${formatted.repeatText}</span>
          </div>
        </div>

        <!-- Starred List Trigger Button -->
        <button id="btn-filter-starred" class="neu-button flex items-center justify-between w-full py-2 px-3 ${isStarredActive ? 'active neu-inset' : ''}" aria-label="${starredLabel}">
          <div class="flex items-center gap-2">
            ${getIconSvg('starFilled', 16, 'text-amber-500')}
            <span class="starred-label text-xs font-semibold">${starredLabel}</span>
          </div>
          <span id="badge-starred" class="neu-badge neu-badge-accent font-mono text-xs font-bold">${metrics.starredCount}</span>
        </button>

        <!-- Chapter Progress Breakdown Section -->
        <div class="flex flex-col gap-2 pt-2 border-t border-subtle">
          <h3 class="text-xs font-bold text-secondary uppercase tracking-wider">${chapterProgressTitle}</h3>
          <div id="chapter-breakdown-list" class="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
            ${chaptersHtml}
          </div>
        </div>
      </aside>
    `;

    // Re-attach interactive event listeners
    const closeBtn = container.querySelector('#btn-close-sidebar');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => setDrawerOpen(false));
    }

    const backdropEl = container.querySelector('#sidebar-backdrop');
    if (backdropEl) {
      backdropEl.addEventListener('click', () => setDrawerOpen(false));
    }

    const starredBtn = container.querySelector('#btn-filter-starred');
    if (starredBtn) {
      starredBtn.addEventListener('click', () => {
        const cur = store.getState().activeChapter;
        const nextChapter = cur === 'starred' ? 'all' : 'starred';
        store.setState({ activeChapter: nextChapter, currentQuestionIndex: 0 });
      });
    }

    const chapterItems = container.querySelectorAll('[data-chapter-id]');
    chapterItems.forEach((item) => {
      item.addEventListener('click', () => {
        const chId = item.getAttribute('data-chapter-id');
        if (chId) {
          store.setState({ activeChapter: chId, currentQuestionIndex: 0 });
          // If on mobile drawer, close drawer after selection
          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setDrawerOpen(false);
          }
        }
      });
    });
  }

  // Handle toggle trigger from header/toolbar
  function handleToggleClick() {
    setDrawerOpen(!isDrawerOpen);
  }

  function bindToggleTrigger() {
    const toggleBtn = document.getElementById('btn-toggle-eval') || container.querySelector('#btn-toggle-eval');
    if (toggleBtn) {
      toggleBtn.removeEventListener('click', handleToggleClick);
      toggleBtn.addEventListener('click', handleToggleClick);
    }
  }

  // Initial render
  renderContent();
  bindToggleTrigger();

  // Reactive store subscription
  const unsubscribeStore = store.subscribe((nextState, prevState) => {
    if (
      nextState.activeBook !== prevState?.activeBook ||
      nextState.activeChapter !== prevState?.activeChapter ||
      nextState.activeLang !== prevState?.activeLang ||
      nextState.lastProgressUpdate !== prevState?.lastProgressUpdate ||
      nextState.progressVersion !== prevState?.progressVersion
    ) {
      renderContent();
      bindToggleTrigger();
    }
  });

  return () => {
    if (typeof unsubscribeStore === 'function') {
      unsubscribeStore();
    }
    const toggleBtn = document.getElementById('btn-toggle-eval') || container.querySelector('#btn-toggle-eval');
    if (toggleBtn) {
      toggleBtn.removeEventListener('click', handleToggleClick);
    }
  };
}
