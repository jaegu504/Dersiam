import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { maskClozeAnswer, getNextExamState, renderExamView } from '../src/components/examView.js';
import { createStore, DEFAULT_STATE } from '../src/state/store.js';
import * as audioService from '../src/services/audio.js';

describe('Exam Mode Component & Logic (Task 10)', () => {
  describe('maskClozeAnswer unit tests', () => {
    it('masks target keyword with dotted placeholder in hidden state', () => {
      const answer = 'قدوری شریف کتابی فقه علمندن بحث ايدر.';
      const masked = maskClozeAnswer(answer, 'فقه', false);
      expect(masked).toContain('[ • • • ? • • • ]');
      expect(masked).not.toContain('فقه');
      expect(masked).toContain('cloze-placeholder');
      expect(masked).toContain('neu-inset-sm');
    });

    it('reveals highlighted keyword when isRevealed is true', () => {
      const answer = 'قدوری شریف کتابی فقه علمندن بحث ايدر.';
      const revealed = maskClozeAnswer(answer, 'فقه', true);
      expect(revealed).toContain('revealed-highlight');
      expect(revealed).toContain('cloze-revealed');
      expect(revealed).toContain('فقه');
      expect(revealed).not.toContain('[ • • • ? • • • ]');
    });

    it('handles Indonesian text cloze masking and revealing correctly', () => {
      const answer = 'Kitab Quduri Sharif membahas tentang ilmu fikih.';
      const masked = maskClozeAnswer(answer, 'fikih', false);
      expect(masked).toContain('[ • • • ? • • • ]');
      expect(masked).not.toContain('fikih');

      const revealed = maskClozeAnswer(answer, 'fikih', true);
      expect(revealed).toContain('revealed-highlight');
      expect(revealed).toContain('fikih');
    });

    it('returns original answer safely if keyword or answer is missing', () => {
      expect(maskClozeAnswer('', 'test', false)).toBe('');
      expect(maskClozeAnswer('Cevap metni', '', false)).toBe('Cevap metni');
      expect(maskClozeAnswer(null, 'test', false)).toBe('');
    });
  });

  describe('getNextExamState unit tests', () => {
    it('advancing exam question resets timer to 30s and re-masks cloze keyword', () => {
      const nextState = getNextExamState({ timer: 12, isClozeRevealed: true, currentIndex: 0 }, 5);
      expect(nextState.currentIndex).toBe(1);
      expect(nextState.timer).toBe(30);
      expect(nextState.isClozeRevealed).toBe(false);
      expect(nextState.isOralRevealed).toBe(false);
    });

    it('wraps question index modulo totalQuestions', () => {
      const nextState = getNextExamState({ timer: 4, isClozeRevealed: false, currentIndex: 4 }, 5);
      expect(nextState.currentIndex).toBe(0);
      expect(nextState.timer).toBe(30);
    });

    it('handles edge case when totalQuestions is 1 or 0', () => {
      const state1 = getNextExamState({ timer: 0, isClozeRevealed: true, currentIndex: 0 }, 1);
      expect(state1.currentIndex).toBe(0);
      expect(state1.timer).toBe(30);

      const state0 = getNextExamState({ timer: 0, isClozeRevealed: true, currentIndex: 0 }, 0);
      expect(state0.currentIndex).toBe(0);
      expect(state0.timer).toBe(30);
    });
  });

  describe('renderExamView DOM integration', () => {
    let container;
    let store;
    let unmount;
    let playPureSfxSpy;

    beforeEach(() => {
      vi.useFakeTimers();
      playPureSfxSpy = vi.spyOn(audioService, 'playPureSfx').mockImplementation(() => {});

      document.body.innerHTML = '';
      container = document.createElement('main');
      container.id = 'view-mount';
      document.body.appendChild(container);

      store = createStore({
        ...DEFAULT_STATE,
        currentView: 'exam',
        activeBook: 'quduri',
        activeLang: 'tr',
        examMode: 'oral',
        examTimerSec: 30
      });
    });

    afterEach(() => {
      if (typeof unmount === 'function') {
        unmount();
        unmount = null;
      }
      vi.clearAllTimers();
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it('renders header banner, submode tabs, exit button, and initial oral exam card', () => {
      unmount = renderExamView(container, store);

      // Header components
      const exitBtn = container.querySelector('#btn-exit-exam');
      expect(exitBtn).toBeTruthy();

      const tabOral = container.querySelector('#btn-tab-oral');
      const tabCloze = container.querySelector('#btn-tab-cloze');
      expect(tabOral).toBeTruthy();
      expect(tabCloze).toBeTruthy();
      expect(tabOral.classList.contains('active')).toBe(true);

      // Oral exam controls
      const timerEl = container.querySelector('#exam-timer');
      expect(timerEl).toBeTruthy();
      expect(timerEl.textContent).toContain('30');

      const checkOralBtn = container.querySelector('#btn-check-oral-answer');
      expect(checkOralBtn).toBeTruthy();

      const nextQuestionBtn = container.querySelector('#btn-next-exam-question');
      expect(nextQuestionBtn).toBeTruthy();

      // Answer should initially be hidden
      const answerContainer = container.querySelector('#exam-answer-container');
      expect(answerContainer).toBeTruthy();
      expect(answerContainer.classList.contains('hidden')).toBe(true);
    });

    it('counts down from 30s, shifts color to warning at <= 5s, and chimes at 0s', () => {
      unmount = renderExamView(container, store);

      const timerEl = container.querySelector('#exam-timer');
      expect(timerEl.textContent).toContain('30');
      expect(timerEl.classList.contains('timer-warning')).toBe(false);

      // Advance by 10s -> 20s remaining
      vi.advanceTimersByTime(10000);
      expect(timerEl.textContent).toContain('20');
      expect(timerEl.classList.contains('timer-warning')).toBe(false);

      // Advance by 15s -> 5s remaining (warning threshold)
      vi.advanceTimersByTime(15000);
      expect(timerEl.textContent).toContain('5');
      expect(timerEl.classList.contains('timer-warning')).toBe(true);

      // Advance by 5s -> 0s remaining (chime played)
      vi.advanceTimersByTime(5000);
      expect(timerEl.textContent).toContain('0');
      expect(timerEl.classList.contains('timer-warning')).toBe(true);
      expect(playPureSfxSpy).toHaveBeenCalledWith('chime');

      // Advancing further does not go below 0
      vi.advanceTimersByTime(2000);
      expect(timerEl.textContent).toContain('0');
    });

    it('reveals oral answer when check button is clicked', () => {
      unmount = renderExamView(container, store);

      const checkOralBtn = container.querySelector('#btn-check-oral-answer');
      const answerContainer = container.querySelector('#exam-answer-container');

      expect(answerContainer.classList.contains('hidden')).toBe(true);

      checkOralBtn.click();

      expect(answerContainer.classList.contains('hidden')).toBe(false);
      expect(playPureSfxSpy).toHaveBeenCalledWith('click');
    });

    it('continuous next question resets timer to 30s and hides revealed answer', () => {
      unmount = renderExamView(container, store);

      const checkOralBtn = container.querySelector('#btn-check-oral-answer');
      const answerContainer = container.querySelector('#exam-answer-container');
      const nextQuestionBtn = container.querySelector('#btn-next-exam-question');
      const timerEl = container.querySelector('#exam-timer');

      // Fast-forward timer to 15s and reveal answer
      vi.advanceTimersByTime(15000);
      expect(timerEl.textContent).toContain('15');

      checkOralBtn.click();
      expect(answerContainer.classList.contains('hidden')).toBe(false);

      // Click next question button
      nextQuestionBtn.click();

      // Timer should reset to 30s and answer should hide
      expect(timerEl.textContent).toContain('30');
      expect(timerEl.classList.contains('timer-warning')).toBe(false);
      expect(answerContainer.classList.contains('hidden')).toBe(true);

      // Timer resumes counting down from 30
      vi.advanceTimersByTime(2000);
      expect(timerEl.textContent).toContain('28');
    });

    it('switches to cloze submode, reveals hidden keyword, and re-masks on next question', () => {
      unmount = renderExamView(container, store);

      const tabCloze = container.querySelector('#btn-tab-cloze');
      tabCloze.click();

      expect(tabCloze.classList.contains('active')).toBe(true);

      // Timer should not be active in cloze mode
      const clozeContainer = container.querySelector('#cloze-answer-container');
      expect(clozeContainer).toBeTruthy();
      expect(clozeContainer.innerHTML).toContain('[ • • • ? • • • ]');
      expect(clozeContainer.innerHTML).not.toContain('revealed-highlight');

      // Click reveal cloze button
      const toggleClozeBtn = container.querySelector('#btn-toggle-cloze');
      expect(toggleClozeBtn).toBeTruthy();
      toggleClozeBtn.click();

      expect(clozeContainer.innerHTML).toContain('revealed-highlight');

      // Click next question button -> advances and re-masks keyword
      const nextQuestionBtn = container.querySelector('#btn-next-exam-question');
      nextQuestionBtn.click();

      expect(clozeContainer.innerHTML).toContain('[ • • • ? • • • ]');
      expect(clozeContainer.innerHTML).not.toContain('revealed-highlight');
    });

    it('exit exam button returns store to study view and cleans up interval', () => {
      unmount = renderExamView(container, store);

      const exitBtn = container.querySelector('#btn-exit-exam');
      exitBtn.click();

      expect(store.getState().currentView).toBe('study');

      // Interval should have stopped
      const timerCallsBefore = playPureSfxSpy.mock.calls.length;
      vi.advanceTimersByTime(35000);
      // No chime should be fired because timer was cleared
      expect(playPureSfxSpy.mock.calls.length).toBe(timerCallsBefore);
    });

    it('reacts to language changes dynamically and renders appropriate typography', () => {
      unmount = renderExamView(container, store);

      // Default TR (Osmanlıca)
      const questionEl = container.querySelector('#exam-question-text');
      expect(questionEl.classList.contains('font-arabic')).toBe(true);
      expect(questionEl.classList.contains('text-rtl')).toBe(true);

      // Switch to ID
      store.setState({ activeLang: 'id' });

      expect(questionEl.classList.contains('font-latin')).toBe(true);
      expect(questionEl.classList.contains('text-ltr')).toBe(true);

      const exitBtn = container.querySelector('#btn-exit-exam');
      expect(exitBtn.textContent).toContain('Keluar');
    });

    it('renders zero emojis anywhere in DOM markup', () => {
      unmount = renderExamView(container, store);

      const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
      expect(emojiRegex.test(container.innerHTML)).toBe(false);

      // Also test in cloze mode
      const tabCloze = container.querySelector('#btn-tab-cloze');
      tabCloze.click();
      expect(emojiRegex.test(container.innerHTML)).toBe(false);
    });
  });

  describe('Zero-Emoji source code guarantee', () => {
    it('guarantees zero emoji in examView.js source file', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');
      const source = fs.readFileSync(path.resolve(__dirname, '../src/components/examView.js'), 'utf-8');
      const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
      expect(emojiRegex.test(source)).toBe(false);
    });
  });
});
