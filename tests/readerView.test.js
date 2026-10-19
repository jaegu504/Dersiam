import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateReaderListItems, renderReaderView } from '../src/components/readerView.js';
import { createStore, DEFAULT_STATE } from '../src/state/store.js';
import { booksData, booksMetadata } from '../src/data/books.js';

describe('Raw Reader Mode (Task 11)', () => {
  describe('generateReaderListItems Unit Tests', () => {
    it('generates reader items matching active language', () => {
      const mockItems = [
        {
          id: 'test-1',
          bookKey: 'quduri',
          originalNumber: 1,
          chapterNameTr: 'مقدمة',
          chapterNameId: 'Mukaddimah',
          question_tr: 'Q_TR',
          answer_tr: 'A_TR',
          question_id: 'Q_ID',
          answer_id: 'A_ID'
        }
      ];

      const trList = generateReaderListItems(mockItems, 'tr');
      expect(trList).toHaveLength(1);
      expect(trList[0].id).toBe('test-1');
      expect(trList[0].question).toBe('Q_TR');
      expect(trList[0].answer).toBe('A_TR');
      expect(trList[0].chapterName).toBe('مقدمة');
      expect(trList[0].bookKey).toBe('quduri');
      expect(trList[0].number).toBe(1);

      const idList = generateReaderListItems(mockItems, 'id');
      expect(idList).toHaveLength(1);
      expect(idList[0].id).toBe('test-1');
      expect(idList[0].question).toBe('Q_ID');
      expect(idList[0].answer).toBe('A_ID');
      expect(idList[0].chapterName).toBe('Mukaddimah');
      expect(idList[0].bookKey).toBe('quduri');
      expect(idList[0].number).toBe(1);
    });

    it('handles empty or non-array inputs gracefully', () => {
      expect(generateReaderListItems([], 'tr')).toEqual([]);
      expect(generateReaderListItems(null, 'tr')).toEqual([]);
      expect(generateReaderListItems(undefined, 'id')).toEqual([]);
    });

    it('falls back to index + 1 when originalNumber is missing', () => {
      const mock = [{ id: 'item-x', question_tr: 'Soru', answer_tr: 'Cevap' }];
      const res = generateReaderListItems(mock, 'tr');
      expect(res[0].number).toBe(1);
    });
  });

  describe('renderReaderView DOM Integration Tests', () => {
    let container;
    let store;
    let unmount;

    beforeEach(() => {
      document.body.innerHTML = '';
      container = document.createElement('main');
      container.id = 'view-mount';
      document.body.appendChild(container);

      store = createStore({
        ...DEFAULT_STATE,
        currentView: 'reader',
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
      document.body.innerHTML = '';
    });

    it('renders toolbar with book badge, chapter dropdown, search input, and exit button', () => {
      unmount = renderReaderView(container, store);

      // Book badge
      const bookBadge = container.querySelector('#reader-book-badge');
      expect(bookBadge).toBeTruthy();
      expect(bookBadge.textContent).toContain("Muhtasarü'l-Kudûrî");

      // Chapter select
      const chapterSelect = container.querySelector('#reader-chapter-select');
      expect(chapterSelect).toBeTruthy();
      expect(chapterSelect.options.length).toBeGreaterThan(1);

      // Search input
      const searchInput = container.querySelector('#reader-search-input');
      expect(searchInput).toBeTruthy();

      // Exit button
      const exitBtn = container.querySelector('#btn-exit-reader');
      expect(exitBtn).toBeTruthy();
      expect(exitBtn.textContent).toContain('Okumadan Çık');

      // Count badge
      const countBadge = container.querySelector('#reader-count-badge');
      expect(countBadge).toBeTruthy();
      expect(countBadge.textContent).toContain(String(booksData.quduri.length));
    });

    it('renders uninterrupted flow list of all questions in current book with copy buttons', () => {
      unmount = renderReaderView(container, store);

      const listContainer = container.querySelector('#reader-list-container');
      expect(listContainer).toBeTruthy();

      const cards = listContainer.querySelectorAll('.reader-card');
      expect(cards.length).toBe(booksData.quduri.length);

      // Check first item content
      const firstCard = cards[0];
      const firstData = booksData.quduri[0];
      expect(firstCard.innerHTML).toContain(firstData.question_tr);
      expect(firstCard.innerHTML).toContain(firstData.answer_tr);

      // Copy button exists with expected id
      const copyBtn = firstCard.querySelector(`#btn-copy-item-${firstData.id}`);
      expect(copyBtn).toBeTruthy();
    });

    it('applies RTL Amiri typography for Turkish and LTR Plus Jakarta Sans for Indonesian', () => {
      unmount = renderReaderView(container, store);

      const firstCard = container.querySelector('.reader-card');
      const questionEl = firstCard.querySelector('.reader-question-text');
      expect(questionEl.classList.contains('font-arabic')).toBe(true);
      expect(questionEl.classList.contains('text-rtl')).toBe(true);

      // Switch to Indonesian
      store.setState({ activeLang: 'id' });

      const updatedCard = container.querySelector('.reader-card');
      const updatedQuestionEl = updatedCard.querySelector('.reader-question-text');
      expect(updatedQuestionEl.classList.contains('font-latin')).toBe(true);
      expect(updatedQuestionEl.classList.contains('text-ltr')).toBe(true);

      const firstData = booksData.quduri[0];
      expect(updatedQuestionEl.textContent).toContain(firstData.question_id);

      const exitBtn = container.querySelector('#btn-exit-reader');
      expect(exitBtn.textContent).toContain('Keluar');
    });

    it('returns to study view when exit button is clicked', () => {
      unmount = renderReaderView(container, store);

      const exitBtn = container.querySelector('#btn-exit-reader');
      exitBtn.click();

      expect(store.getState().currentView).toBe('study');
    });

    it('filters flow list when chapter select dropdown changes', () => {
      unmount = renderReaderView(container, store);

      const chapterSelect = container.querySelector('#reader-chapter-select');
      const availableChapters = Array.from(chapterSelect.options).map(o => o.value);
      const chosenChapter = availableChapters.find(ch => ch !== 'all');
      expect(chosenChapter).toBeTruthy();

      chapterSelect.value = chosenChapter;
      chapterSelect.dispatchEvent(new Event('change'));

      const filteredCount = booksData.quduri.filter(q => q.chapterId === chosenChapter).length;
      const cards = container.querySelectorAll('.reader-card');
      expect(cards.length).toBe(filteredCount);

      const countBadge = container.querySelector('#reader-count-badge');
      expect(countBadge.textContent).toContain(String(filteredCount));
      expect(store.getState().activeChapter).toBe(chosenChapter);
    });

    it('filters items in real-time when searching in reader search input', () => {
      unmount = renderReaderView(container, store);

      const searchInput = container.querySelector('#reader-search-input');
      const firstItem = booksData.quduri[0];

      // Search for specific word in first item's question
      searchInput.value = firstItem.question_tr.slice(0, 8);
      searchInput.dispatchEvent(new Event('input'));

      const cards = container.querySelectorAll('.reader-card');
      expect(cards.length).toBeGreaterThan(0);
      expect(cards.length).toBeLessThan(booksData.quduri.length);

      // Search non-existent string
      searchInput.value = 'xyznonexistent99999';
      searchInput.dispatchEvent(new Event('input'));

      const noCards = container.querySelectorAll('.reader-card');
      expect(noCards.length).toBe(0);

      const emptyState = container.querySelector('#reader-empty-state');
      expect(emptyState).toBeTruthy();
      expect(emptyState.classList.contains('hidden')).toBe(false);

      // Clear search
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      const restoredCards = container.querySelectorAll('.reader-card');
      expect(restoredCards.length).toBe(booksData.quduri.length);
    });

    it('copies item question and answer when quick copy button is clicked', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        configurable: true,
        writable: true
      });

      unmount = renderReaderView(container, store);

      const firstData = booksData.quduri[0];
      const copyBtn = container.querySelector(`#btn-copy-item-${firstData.id}`);
      expect(copyBtn).toBeTruthy();

      copyBtn.click();

      expect(writeTextMock).toHaveBeenCalled();
      const copiedText = writeTextMock.mock.calls[0][0];
      expect(copiedText).toContain(firstData.question_tr);
      expect(copiedText).toContain(firstData.answer_tr);

      const toast = container.querySelector('.reader-toast');
      expect(toast).toBeTruthy();
      expect(toast.textContent).toContain('panoya kopyalandı');
    });

    it('updates view when activeBook is updated in store', () => {
      unmount = renderReaderView(container, store);

      store.setState({ activeBook: 'akaid' });

      const bookBadge = container.querySelector('#reader-book-badge');
      expect(bookBadge.textContent).toContain("Metn-i Akāid");

      const cards = container.querySelectorAll('.reader-card');
      expect(cards.length).toBe(booksData.akaid.length);
    });

    it('cleans up subscriptions on unmount', () => {
      unmount = renderReaderView(container, store);
      unmount();

      const countBadge = container.querySelector('#reader-count-badge');
      const beforeText = countBadge.textContent;

      store.setState({ activeLang: 'id', activeBook: 'akaid' });
      // Should not have updated the detached container
      expect(countBadge.textContent).toBe(beforeText);
    });
  });

  describe('main.js initApp reader view mounting', () => {
    let appRoot;
    let store;
    let appLifecycle;

    beforeEach(() => {
      document.body.innerHTML = '<div id="app"></div>';
      appRoot = document.getElementById('app');
      store = createStore({
        ...DEFAULT_STATE,
        currentView: 'reader',
        activeBook: 'quduri'
      });
    });

    afterEach(() => {
      if (appLifecycle?.viewUnmount) {
        appLifecycle.viewUnmount();
      }
      if (appLifecycle?.headerUnmount) {
        appLifecycle.headerUnmount();
      }
      document.body.innerHTML = '';
    });

    it('mounts renderReaderView when currentView is reader', async () => {
      const { initApp } = await import('../src/main.js');
      appLifecycle = initApp(appRoot, store);

      const readerList = appRoot.querySelector('#reader-list-container');
      expect(readerList).toBeTruthy();
      const exitBtn = appRoot.querySelector('#btn-exit-reader');
      expect(exitBtn).toBeTruthy();
    });
  });

  describe('Zero-Emoji Guarantee', () => {
    it('guarantees zero emoji in readerView.js source file', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');
      const source = fs.readFileSync(path.resolve(__dirname, '../src/components/readerView.js'), 'utf-8');
      const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
      expect(emojiRegex.test(source)).toBe(false);
    });

    it('guarantees zero emoji in rendered reader view DOM', () => {
      const container = document.createElement('main');
      const store = createStore({
        ...DEFAULT_STATE,
        currentView: 'reader',
        activeBook: 'quduri',
        activeLang: 'tr'
      });
      const unmount = renderReaderView(container, store);

      const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
      expect(emojiRegex.test(container.innerHTML)).toBe(false);

      store.setState({ activeLang: 'id' });
      expect(emojiRegex.test(container.innerHTML)).toBe(false);

      unmount();
    });
  });
});
