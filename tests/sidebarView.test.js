import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatSidebarMetrics, renderSidebar } from '../src/components/sidebarView.js';
import { createStore, DEFAULT_STATE } from '../src/state/store.js';
import { loadUserProgress, resetUserProgress, saveUserProgress, recordSelfEvaluation } from '../src/state/storage.js';
import { booksData } from '../src/data/books.js';

describe('Evaluation Dashboard Sidebar Component (Task 9)', () => {
  describe('formatSidebarMetrics Unit Tests', () => {
    it('formats metric values and percentage strings correctly', () => {
      const formatted = formatSidebarMetrics({
        completionPct: 60,
        retentionPct: 85,
        remembered: 17,
        repeat: 3
      });

      expect(formatted.completionText).toBe('%60');
      expect(formatted.retentionText).toBe('%85');
      expect(formatted.rememberedText).toContain('17');
      expect(formatted.repeatText).toContain('3');
    });

    it('handles zero or missing values safely with default fallbacks', () => {
      const formatted = formatSidebarMetrics();
      expect(formatted.completionText).toBe('%0');
      expect(formatted.retentionText).toBe('%0');
      expect(formatted.rememberedText).toContain('0');
      expect(formatted.repeatText).toContain('0');
    });

    it('handles alternative metric property names (rememberedCount / repeatCount)', () => {
      const formatted = formatSidebarMetrics({
        completionPct: 42,
        retentionPct: 91,
        rememberedCount: 15,
        repeatCount: 4
      });
      expect(formatted.completionText).toBe('%42');
      expect(formatted.retentionText).toBe('%91');
      expect(formatted.rememberedText).toContain('15');
      expect(formatted.repeatText).toContain('4');
    });
  });

  describe('renderSidebar DOM Integration Tests', () => {
    let container;
    let store;
    let unmount;

    beforeEach(() => {
      document.body.innerHTML = '';
      container = document.createElement('aside');
      container.id = 'sidebar-mount';
      document.body.appendChild(container);

      // Clean storage for quduri and talhis
      resetUserProgress('quduri');
      resetUserProgress('talhis');

      store = createStore({
        ...DEFAULT_STATE,
        currentView: 'study',
        activeBook: 'quduri',
        activeLang: 'tr',
        activeChapter: 'all'
      });
    });

    afterEach(() => {
      if (typeof unmount === 'function') {
        unmount();
        unmount = null;
      }
      resetUserProgress('quduri');
      resetUserProgress('talhis');
      document.body.innerHTML = '';
    });

    it('renders evaluation heading, completion progress, retention ratio, and counters', () => {
      // Simulate some progress
      let progress = loadUserProgress('quduri');
      progress.viewedIds = ['q1', 'q2', 'q3'];
      progress.rememberedIds = ['q1', 'q2'];
      progress.repeatIds = ['q3'];
      progress.starredIds = ['q1'];
      saveUserProgress('quduri', progress);

      unmount = renderSidebar(container, store);

      // Heading
      const heading = container.querySelector('#eval-heading');
      expect(heading).toBeTruthy();
      expect(heading.textContent).toContain('Mütalaa Değerlendirmesi');

      // Metric texts
      const sidebarContent = container.textContent;
      expect(sidebarContent).toContain('%');

      // Remembered & Repeat Badges
      const rememberedBadge = container.querySelector('#badge-remembered');
      const repeatBadge = container.querySelector('#badge-repeat');
      expect(rememberedBadge).toBeTruthy();
      expect(repeatBadge).toBeTruthy();
      expect(rememberedBadge.textContent).toContain('2');
      expect(repeatBadge.textContent).toContain('1');

      // Starred button trigger
      const starredBtn = container.querySelector('#btn-filter-starred');
      expect(starredBtn).toBeTruthy();
      expect(starredBtn.textContent).toContain('1');
    });

    it('renders chapter breakdown list with question counts and completion ratios', () => {
      unmount = renderSidebar(container, store);

      const chapterItems = container.querySelectorAll('[data-chapter-id]');
      expect(chapterItems.length).toBeGreaterThan(0);

      // First chapter of quduri is mukaddime
      const firstChapterItem = chapterItems[0];
      expect(firstChapterItem.textContent).toContain('مقدمة');
      expect(firstChapterItem.getAttribute('data-chapter-id')).toBe('mukaddime');
    });

    it('clicking a chapter triggers store activeChapter and currentQuestionIndex update', () => {
      unmount = renderSidebar(container, store);

      const chapterItems = container.querySelectorAll('[data-chapter-id]');
      const secondChapterItem = chapterItems[1];
      expect(secondChapterItem).toBeTruthy();
      const targetChapterId = secondChapterItem.getAttribute('data-chapter-id');

      secondChapterItem.click();

      expect(store.getState().activeChapter).toBe(targetChapterId);
      expect(store.getState().currentQuestionIndex).toBe(0);
    });

    it('clicking starred filter button toggles activeChapter to starred', () => {
      unmount = renderSidebar(container, store);

      const starredBtn = container.querySelector('#btn-filter-starred');
      expect(starredBtn).toBeTruthy();

      starredBtn.click();
      expect(store.getState().activeChapter).toBe('starred');
      expect(store.getState().currentQuestionIndex).toBe(0);

      // Clicking again toggles back to 'all'
      starredBtn.click();
      expect(store.getState().activeChapter).toBe('all');
    });

    it('toggles mobile slide-over drawer when toggle button and close button are clicked', () => {
      // Create external toggle button simulating studyView header
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'btn-toggle-eval';
      document.body.appendChild(toggleBtn);

      unmount = renderSidebar(container, store);

      const sidebarEl = container.querySelector('#evaluation-sidebar');
      const backdropEl = container.querySelector('#sidebar-backdrop');
      const closeBtn = container.querySelector('#btn-close-sidebar');

      expect(sidebarEl).toBeTruthy();
      expect(backdropEl).toBeTruthy();
      expect(closeBtn).toBeTruthy();

      // Initially closed
      expect(backdropEl.classList.contains('hidden')).toBe(true);

      // Click toggle -> opens
      toggleBtn.click();
      expect(backdropEl.classList.contains('hidden')).toBe(false);
      expect(sidebarEl.classList.contains('sidebar-open')).toBe(true);

      // Click close -> closes
      closeBtn.click();
      expect(backdropEl.classList.contains('hidden')).toBe(true);
      expect(sidebarEl.classList.contains('sidebar-open')).toBe(false);

      // Open again, then click backdrop -> closes
      toggleBtn.click();
      expect(backdropEl.classList.contains('hidden')).toBe(false);
      backdropEl.click();
      expect(backdropEl.classList.contains('hidden')).toBe(true);

      toggleBtn.remove();
    });

    it('re-renders reactively when activeLang changes to Indonesian (ID)', () => {
      unmount = renderSidebar(container, store);

      const heading = container.querySelector('#eval-heading');
      expect(heading.textContent).toContain('Mütalaa Değerlendirmesi');

      // Switch language to ID
      store.setState({ activeLang: 'id' });

      const updatedHeading = container.querySelector('#eval-heading');
      expect(updatedHeading.textContent).toContain('Evaluasi & Statistik Belajar');
      const starredBtn = container.querySelector('#btn-filter-starred');
      expect(starredBtn.textContent).toContain('Soal Berbintang');

      // Chapter names should switch to Indonesian
      const firstChapterItem = container.querySelector('[data-chapter-id="mukaddime"]');
      expect(firstChapterItem.textContent).toContain('Mukaddimah');
    });

    it('updates metrics when store signals progress update or activeBook changes', () => {
      unmount = renderSidebar(container, store);

      const initialRememberedBadge = container.querySelector('#badge-remembered');
      expect(initialRememberedBadge.textContent).toContain('0');

      // Update storage and trigger store update
      let progress = loadUserProgress('quduri');
      progress.rememberedIds = ['q1', 'q2', 'q3', 'q4'];
      progress.viewedIds = ['q1', 'q2', 'q3', 'q4'];
      saveUserProgress('quduri', progress);

      store.setState({ lastProgressUpdate: Date.now() });

      const updatedRememberedBadge = container.querySelector('#badge-remembered');
      expect(updatedRememberedBadge.textContent).toContain('4');

      // Change book to talhis
      store.setState({ activeBook: 'talhis' });
      const talhisChapterItem = container.querySelector('[data-chapter-id="ilm-maani"]');
      expect(talhisChapterItem).toBeTruthy();
      expect(talhisChapterItem.textContent).toContain('علمِ معانى');
    });

    it('cleans up store subscription and event handlers on unmount', () => {
      unmount = renderSidebar(container, store);

      const heading = container.querySelector('#eval-heading');
      expect(heading).toBeTruthy();

      unmount();
      unmount = null;

      // Changing state should not throw or cause errors
      expect(() => {
        store.setState({ activeLang: 'id', lastProgressUpdate: Date.now() });
      }).not.toThrow();
    });
  });

  describe('Zero-Emoji Compliance', () => {
    it('guarantees zero emoji in sidebarView.js source file', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');
      const source = fs.readFileSync(path.resolve(__dirname, '../src/components/sidebarView.js'), 'utf-8');
      const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
      expect(emojiRegex.test(source)).toBe(false);
    });
  });
});
