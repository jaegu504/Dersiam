import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getStudyCardState, renderStudyView } from '../src/components/studyView.js';
import { createStore, DEFAULT_STATE } from '../src/state/store.js';
import { loadUserProgress, resetUserProgress, saveUserProgress } from '../src/state/storage.js';
import { booksData } from '../src/data/books.js';

describe('Study View Component (Task 8)', () => {
  describe('getStudyCardState', () => {
    it('initial state hides answer and evaluation buttons', () => {
      const state = getStudyCardState(false);
      expect(state.isAnswerVisible).toBe(false);
      expect(state.showSelfEvalButtons).toBe(false);
    });

    it('revealed state displays answer and self-assessment buttons', () => {
      const state = getStudyCardState(true);
      expect(state.isAnswerVisible).toBe(true);
      expect(state.showSelfEvalButtons).toBe(true);
    });
  });

  describe('renderStudyView DOM Integration', () => {
    let container;
    let store;
    let unmount;

    beforeEach(() => {
      document.body.innerHTML = '';
      container = document.createElement('main');
      container.id = 'view-mount';
      document.body.appendChild(container);

      // Clean storage for quduri
      resetUserProgress('quduri');

      store = createStore({
        ...DEFAULT_STATE,
        currentView: 'study',
        activeBook: 'quduri',
        activeLang: 'tr',
        activeChapter: 'all',
        isDarkMode: false,
        isAudioMuted: false,
        activeAlgorithm: 'sequential',
        isAnswerRevealed: false
      });
    });

    afterEach(() => {
      if (typeof unmount === 'function') {
        unmount();
        unmount = null;
      }
      resetUserProgress('quduri');
    });

    it('renders initial question card, controls, and floating dock with zero emojis', () => {
      unmount = renderStudyView(container, store);

      // Chapter dropdown
      const chapterSelect = container.querySelector('#chapter-select');
      expect(chapterSelect).toBeTruthy();

      // Star favorite button
      const starBtn = container.querySelector('#btn-star');
      expect(starBtn).toBeTruthy();

      // Mode switch buttons
      const modeStudy = container.querySelector('#btn-mode-study');
      const modeExam = container.querySelector('#btn-mode-exam');
      const modeReader = container.querySelector('#btn-mode-reader');
      expect(modeStudy).toBeTruthy();
      expect(modeExam).toBeTruthy();
      expect(modeReader).toBeTruthy();

      // Question counter & content
      const counter = container.querySelector('#question-counter');
      expect(counter).toBeTruthy();
      expect(counter.textContent).toMatch(/Soru\s+1\s*\/\s*\d+/i);

      const questionText = container.querySelector('#question-text');
      expect(questionText).toBeTruthy();
      const firstQuduri = booksData.quduri[0];
      expect(questionText.innerHTML).toContain(firstQuduri.question_tr);

      // Answer box initially hidden
      const answerBox = container.querySelector('#answer-box');
      expect(answerBox).toBeTruthy();
      expect(answerBox.classList.contains('hidden')).toBe(true);

      // Floating dock controls
      const dock = container.querySelector('.floating-dock');
      expect(dock).toBeTruthy();
      const prevBtn = container.querySelector('#btn-prev');
      const toggleAnswerBtn = container.querySelector('#btn-toggle-answer');
      const nextBtn = container.querySelector('#btn-next');
      expect(prevBtn).toBeTruthy();
      expect(toggleAnswerBtn).toBeTruthy();
      expect(nextBtn).toBeTruthy();

      // Zero emoji guarantee
      const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
      expect(emojiRegex.test(container.innerHTML)).toBe(false);
    });

    it('toggles answer visibility when #btn-toggle-answer is clicked', () => {
      unmount = renderStudyView(container, store);

      const toggleAnswerBtn = container.querySelector('#btn-toggle-answer');
      const answerBox = container.querySelector('#answer-box');

      expect(answerBox.classList.contains('hidden')).toBe(true);
      expect(toggleAnswerBtn.textContent).toContain('Cevabı Gör');

      // Click to reveal
      toggleAnswerBtn.click();
      expect(answerBox.classList.contains('hidden')).toBe(false);
      expect(toggleAnswerBtn.textContent).toContain('Cevabı Gizle');

      // Check answer text content
      const firstQuduri = booksData.quduri[0];
      const answerText = container.querySelector('#answer-text');
      expect(answerText.innerHTML).toContain(firstQuduri.answer_tr);

      // Self-eval buttons should now be visible inside revealed answer box
      const evalRepeatBtn = answerBox.querySelector('#btn-eval-repeat');
      const evalRememberedBtn = answerBox.querySelector('#btn-eval-remembered');
      expect(evalRepeatBtn).toBeTruthy();
      expect(evalRememberedBtn).toBeTruthy();

      // Click to hide again
      toggleAnswerBtn.click();
      expect(answerBox.classList.contains('hidden')).toBe(true);
      expect(toggleAnswerBtn.textContent).toContain('Cevabı Gör');
    });

    it('navigates next and prev questions and resets answer visibility', () => {
      unmount = renderStudyView(container, store);

      const toggleAnswerBtn = container.querySelector('#btn-toggle-answer');
      const nextBtn = container.querySelector('#btn-next');
      const prevBtn = container.querySelector('#btn-prev');
      const counter = container.querySelector('#question-counter');
      const questionText = container.querySelector('#question-text');
      const answerBox = container.querySelector('#answer-box');

      expect(counter.textContent).toContain('1 /');

      // Reveal answer
      toggleAnswerBtn.click();
      expect(answerBox.classList.contains('hidden')).toBe(false);

      // Click next
      nextBtn.click();
      expect(counter.textContent).toContain('2 /');
      expect(answerBox.classList.contains('hidden')).toBe(true);
      const secondQuduri = booksData.quduri[1];
      expect(questionText.innerHTML).toContain(secondQuduri.question_tr);

      // Click prev
      prevBtn.click();
      expect(counter.textContent).toContain('1 /');
      expect(answerBox.classList.contains('hidden')).toBe(true);
      const firstQuduri = booksData.quduri[0];
      expect(questionText.innerHTML).toContain(firstQuduri.question_tr);
    });

    it('records mutually exclusive self-evaluations and persists to storage', () => {
      unmount = renderStudyView(container, store);

      const toggleAnswerBtn = container.querySelector('#btn-toggle-answer');
      toggleAnswerBtn.click();

      const answerBox = container.querySelector('#answer-box');
      const evalRememberedBtn = answerBox.querySelector('#btn-eval-remembered');
      const evalRepeatBtn = answerBox.querySelector('#btn-eval-repeat');
      const firstId = booksData.quduri[0].id;

      // Click Remembered
      evalRememberedBtn.click();

      let progress = loadUserProgress('quduri');
      expect(progress.rememberedIds).toContain(firstId);
      expect(progress.repeatIds).not.toContain(firstId);
      expect(progress.viewedIds).toContain(firstId);

      // Click Repeat
      evalRepeatBtn.click();

      progress = loadUserProgress('quduri');
      expect(progress.repeatIds).toContain(firstId);
      expect(progress.rememberedIds).not.toContain(firstId);
    });

    it('toggles star favorite state and updates icon dynamically', () => {
      unmount = renderStudyView(container, store);

      const starBtn = container.querySelector('#btn-star');
      const firstId = booksData.quduri[0].id;

      let progress = loadUserProgress('quduri');
      expect(progress.starredIds).not.toContain(firstId);

      // Star it
      starBtn.click();
      progress = loadUserProgress('quduri');
      expect(progress.starredIds).toContain(firstId);

      // Unstar it
      starBtn.click();
      progress = loadUserProgress('quduri');
      expect(progress.starredIds).not.toContain(firstId);
    });

    it('switches views when mode buttons are clicked', () => {
      unmount = renderStudyView(container, store);

      const modeExam = container.querySelector('#btn-mode-exam');
      modeExam.click();
      expect(store.getState().currentView).toBe('exam');

      store.setState({ currentView: 'study' });
      const modeReader = container.querySelector('#btn-mode-reader');
      modeReader.click();
      expect(store.getState().currentView).toBe('reader');
    });

    it('filters questions when chapter select changes', () => {
      unmount = renderStudyView(container, store);

      const chapterSelect = container.querySelector('#chapter-select');
      const chapters = Array.from(chapterSelect.options).map(o => o.value);
      expect(chapters.length).toBeGreaterThan(1);

      const chosenChapter = chapters[1];
      chapterSelect.value = chosenChapter;
      chapterSelect.dispatchEvent(new Event('change'));

      expect(store.getState().activeChapter).toBe(chosenChapter);

      const chapterQuestions = booksData.quduri.filter(q => q.chapterId === chosenChapter);
      const counter = container.querySelector('#question-counter');
      expect(counter.textContent).toContain(`1 / ${chapterQuestions.length}`);
    });

    it('expands note textarea and saves note on submit', () => {
      unmount = renderStudyView(container, store);

      const toggleAnswerBtn = container.querySelector('#btn-toggle-answer');
      toggleAnswerBtn.click();

      const noteToggleBtn = container.querySelector('#btn-note-toggle');
      const noteContainer = container.querySelector('#note-container');
      const noteTextarea = container.querySelector('#note-textarea');
      const saveNoteBtn = container.querySelector('#btn-save-note');

      expect(noteContainer.classList.contains('hidden')).toBe(true);

      noteToggleBtn.click();
      expect(noteContainer.classList.contains('hidden')).toBe(false);

      noteTextarea.value = 'Mühim bir fıkıh kaidesi: taharet bahsi.';
      saveNoteBtn.click();

      const firstId = booksData.quduri[0].id;
      const progress = loadUserProgress('quduri');
      expect(progress.notes[firstId]).toBe('Mühim bir fıkıh kaidesi: taharet bahsi.');
    });

    it('copies QA text to clipboard and shows toast feedback', async () => {
      // Mock clipboard
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        configurable: true,
        writable: true
      });

      unmount = renderStudyView(container, store);
      const toggleAnswerBtn = container.querySelector('#btn-toggle-answer');
      toggleAnswerBtn.click();

      const copyBtn = container.querySelector('#btn-copy-qa');
      copyBtn.click();

      expect(writeTextMock).toHaveBeenCalled();
      const toast = container.querySelector('.study-toast');
      expect(toast).toBeTruthy();
      expect(toast.textContent).toContain('panoya kopyalandı');
    });

    it('responds to keyboard shortcuts: Space for reveal, ArrowRight for next, ArrowLeft for prev', () => {
      unmount = renderStudyView(container, store);

      const answerBox = container.querySelector('#answer-box');
      const counter = container.querySelector('#question-counter');

      expect(answerBox.classList.contains('hidden')).toBe(true);

      // Space flips
      window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      expect(answerBox.classList.contains('hidden')).toBe(false);

      // ArrowRight goes next and hides answer
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(counter.textContent).toContain('2 /');
      expect(answerBox.classList.contains('hidden')).toBe(true);

      // ArrowLeft goes prev
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(counter.textContent).toContain('1 /');
    });

    it('reacts dynamically to language switches (TR <-> ID)', () => {
      unmount = renderStudyView(container, store);

      const counter = container.querySelector('#question-counter');
      expect(counter.textContent).toContain('Soru 1 /');

      store.setState({ activeLang: 'id' });
      expect(counter.textContent).toContain('Soal 1 /');

      const questionText = container.querySelector('#question-text');
      const firstQuduri = booksData.quduri[0];
      expect(questionText.textContent).toContain(firstQuduri.question_id);
    });

    it('cleans up event listeners and subscriptions when unmounted', () => {
      unmount = renderStudyView(container, store);
      unmount();

      const counter = container.querySelector('#question-counter');
      const initialText = counter.textContent;

      // Further state changes should not affect unmounted instance
      store.setState({ activeLang: 'id' });
      expect(counter.textContent).toBe(initialText);
    });
  });

  describe('main.js initApp study view mounting', () => {
    let appRoot;
    let store;
    let appLifecycle;

    beforeEach(async () => {
      document.body.innerHTML = '<div id="app"></div>';
      appRoot = document.getElementById('app');
      store = createStore({
        ...DEFAULT_STATE,
        currentView: 'study',
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

    it('mounts renderStudyView when currentView is study', async () => {
      const { initApp } = await import('../src/main.js');
      appLifecycle = initApp(appRoot, store);

      const studyCard = appRoot.querySelector('#study-card');
      expect(studyCard).toBeTruthy();
      const questionCounter = appRoot.querySelector('#question-counter');
      expect(questionCounter).toBeTruthy();
      expect(questionCounter.textContent).toContain('Soru 1 /');
    });
  });

  describe('Zero-Emoji Guarantee', () => {
    it('guarantees zero emoji in studyView.js source file', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');
      const source = fs.readFileSync(path.resolve(__dirname, '../src/components/studyView.js'), 'utf-8');
      const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
      expect(emojiRegex.test(source)).toBe(false);
    });

    it('guarantees zero emoji in main.js source file', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');
      const source = fs.readFileSync(path.resolve(__dirname, '../src/main.js'), 'utf-8');
      const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
      expect(emojiRegex.test(source)).toBe(false);
    });
  });
});
