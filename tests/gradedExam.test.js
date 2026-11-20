import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { pickExamQuestions, scoreExam, EXAM_SIZE, MARKS } from '../src/components/gradedExam.js';
import { renderExamView } from '../src/components/examView.js';
import { createStore, DEFAULT_STATE } from '../src/state/store.js';
import { booksData } from '../src/data/books.js';

describe('Graded exam (Puanlı İmtihan)', () => {
  describe('pickExamQuestions', () => {
    const pool = Array.from({ length: 40 }, (_, i) => ({ id: `q${i}`, chapterId: i < 15 ? 'a' : 'b' }));

    it('picks 10 distinct questions from the whole book', () => {
      const picked = pickExamQuestions(pool, 'all');
      expect(picked).toHaveLength(EXAM_SIZE);
      expect(new Set(picked.map((q) => q.id)).size).toBe(EXAM_SIZE);
    });

    it('stays inside the chosen chapter', () => {
      const picked = pickExamQuestions(pool, 'a');
      expect(picked).toHaveLength(EXAM_SIZE);
      picked.forEach((q) => expect(q.chapterId).toBe('a'));
    });

    it('uses every question when a chapter has fewer than 10', () => {
      const small = pool.slice(0, 4);
      expect(pickExamQuestions(small, 'all')).toHaveLength(4);
    });

    it('is shuffled, not just the first ten', () => {
      let rnd = 0.999;
      const picked = pickExamQuestions(pool, 'all', EXAM_SIZE, () => (rnd = (rnd * 7.3) % 1));
      expect(picked.map((q) => q.id)).not.toEqual(pool.slice(0, EXAM_SIZE).map((q) => q.id));
    });
  });

  describe('scoreExam', () => {
    it('adds 10 / 5 / 0 per question', () => {
      expect(scoreExam([MARKS.correct, MARKS.half, MARKS.wrong, MARKS.correct])).toBe(25);
    });

    it('ignores ungraded questions', () => {
      expect(scoreExam([MARKS.correct, undefined, null])).toBe(10);
    });
  });

  describe('exam view integration', () => {
    let container;
    let store;
    let unmount;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
      store = createStore({ ...DEFAULT_STATE, currentView: 'exam', activeBook: 'quduri', activeLang: 'tr' });
    });

    afterEach(() => {
      if (typeof unmount === 'function') unmount();
      container.remove();
    });

    it('runs a 10-question graded exam from a chapter and shows the final score', () => {
      unmount = renderExamView(container, store);
      container.querySelector('#btn-tab-graded').click();

      const graded = container.querySelector('#graded-section');
      expect(graded.classList.contains('hidden')).toBe(false);
      expect(container.querySelector('#exam-card').classList.contains('hidden')).toBe(true);

      const scope = graded.querySelector('#graded-scope');
      scope.value = 'munakahat';
      scope.dispatchEvent(new Event('change'));
      graded.querySelector('#btn-graded-start').click();

      const munakahatIds = new Set(booksData.quduri.filter((q) => q.chapterId === 'munakahat').map((q) => q.id));
      const marks = ['correct', 'half', 'wrong', 'correct', 'correct', 'correct', 'wrong', 'half', 'correct', 'correct'];
      marks.forEach((mark, i) => {
        expect(graded.querySelector('#graded-counter').textContent).toContain(`${i + 1} / 10`);
        expect(munakahatIds.has(graded.querySelector('#graded-question').dataset.id)).toBe(true);
        graded.querySelector('#btn-graded-reveal').click();
        expect(graded.querySelector('#graded-answer').classList.contains('hidden')).toBe(false);
        graded.querySelector(`[data-mark="${mark}"]`).click();
      });

      // 6 x 10 + 2 x 5 + 2 x 0 = 70
      expect(graded.querySelector('#graded-total').textContent).toContain('70');
      expect(graded.querySelectorAll('.graded-result-row')).toHaveLength(10);
    });

    it('can restart with a new random set after the result', () => {
      unmount = renderExamView(container, store);
      container.querySelector('#btn-tab-graded').click();
      const graded = container.querySelector('#graded-section');
      graded.querySelector('#btn-graded-start').click();
      for (let i = 0; i < 10; i++) graded.querySelector('[data-mark="correct"]').click();
      expect(graded.querySelector('#graded-total').textContent).toContain('100');

      graded.querySelector('#btn-graded-again').click();
      expect(graded.querySelector('#graded-counter').textContent).toContain('1 / 10');
    });

    it('stops the oral timer while the graded tab is open', () => {
      unmount = renderExamView(container, store);
      container.querySelector('#btn-tab-graded').click();
      expect(store.getState().examMode).toBe('graded');
      expect(container.querySelector('#oral-section').classList.contains('hidden')).toBe(true);
    });
  });
});
