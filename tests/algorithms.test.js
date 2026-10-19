import { describe, it, expect, beforeEach } from 'vitest';
import {
  getNextOriginalRandomQuestion,
  getNextSequentialQuestion,
  getNextSpacedRepetitionQuestion,
  getNextQuestion
} from '../src/state/algorithms.js';

describe('Shuffle and Navigation Algorithms', () => {
  const mockQuestions = [
    { id: 'q1', originalNumber: 1 },
    { id: 'q2', originalNumber: 2 },
    { id: 'q3', originalNumber: 3 },
    { id: 'q4', originalNumber: 4 }
  ];

  describe('Original Random Algorithm', () => {
    it('does not repeat questions until full cycle completes', () => {
      const displayed = [];
      const q1 = getNextOriginalRandomQuestion(mockQuestions, displayed);
      expect(displayed.length).toBe(1);

      const q2 = getNextOriginalRandomQuestion(mockQuestions, displayed);
      expect(displayed.length).toBe(2);
      expect(q1.id).not.toBe(q2.id);

      const q3 = getNextOriginalRandomQuestion(mockQuestions, displayed);
      expect(displayed.length).toBe(3);
      expect([q1.id, q2.id]).not.toContain(q3.id);

      const q4 = getNextOriginalRandomQuestion(mockQuestions, displayed);
      expect(displayed.length).toBe(4);
      expect([q1.id, q2.id, q3.id]).not.toContain(q4.id);
    });

    it('resets displayed indices when all questions have been shown', () => {
      const displayed = [0, 1, 2, 3];
      const q = getNextOriginalRandomQuestion(mockQuestions, displayed);
      expect(displayed.length).toBe(1);
      expect(mockQuestions).toContain(q);
    });

    it('returns null when question list is empty', () => {
      const displayed = [];
      const q = getNextOriginalRandomQuestion([], displayed);
      expect(q).toBeNull();
      expect(displayed.length).toBe(0);
    });

    it('handles single question array properly', () => {
      const single = [{ id: 'solo' }];
      const displayed = [];
      const q1 = getNextOriginalRandomQuestion(single, displayed);
      expect(q1.id).toBe('solo');
      expect(displayed.length).toBe(1);

      const q2 = getNextOriginalRandomQuestion(single, displayed);
      expect(q2.id).toBe('solo');
      expect(displayed.length).toBe(1);
    });
  });

  describe('Sequential Navigation Algorithm', () => {
    it('navigates forward through questions in sequence', () => {
      const q0 = getNextSequentialQuestion(mockQuestions, -1, 'next');
      expect(q0.id).toBe('q1');

      const q1 = getNextSequentialQuestion(mockQuestions, 0, 'next');
      expect(q1.id).toBe('q2');

      const q2 = getNextSequentialQuestion(mockQuestions, 1, 'next');
      expect(q2.id).toBe('q3');

      const q3 = getNextSequentialQuestion(mockQuestions, 2, 'next');
      expect(q3.id).toBe('q4');
    });

    it('wraps forward to the beginning when reaching the end', () => {
      const qWrapped = getNextSequentialQuestion(mockQuestions, 3, 'next');
      expect(qWrapped.id).toBe('q1');
    });

    it('navigates backward through questions in sequence', () => {
      const q2 = getNextSequentialQuestion(mockQuestions, 3, 'prev');
      expect(q2.id).toBe('q3');

      const q1 = getNextSequentialQuestion(mockQuestions, 2, 'prev');
      expect(q1.id).toBe('q2');

      const q0 = getNextSequentialQuestion(mockQuestions, 1, 'prev');
      expect(q0.id).toBe('q1');
    });

    it('wraps backward to the end when at the beginning', () => {
      const qWrapped = getNextSequentialQuestion(mockQuestions, 0, 'prev');
      expect(qWrapped.id).toBe('q4');
    });

    it('handles invalid or undefined currentIndex gracefully', () => {
      const qNext = getNextSequentialQuestion(mockQuestions, undefined, 'next');
      expect(qNext.id).toBe('q1');

      const qPrev = getNextSequentialQuestion(mockQuestions, undefined, 'prev');
      expect(qPrev.id).toBe('q4');
    });

    it('returns null for empty question list', () => {
      expect(getNextSequentialQuestion([], 0, 'next')).toBeNull();
      expect(getNextSequentialQuestion([], 0, 'prev')).toBeNull();
    });
  });

  describe('Spaced Repetition Algorithm', () => {
    it('does not repeat questions within an active cycle', () => {
      const displayed = [];
      const repeatIds = ['q2'];
      const starredIds = [];

      const picked = [];
      for (let i = 0; i < mockQuestions.length; i++) {
        const q = getNextSpacedRepetitionQuestion(mockQuestions, repeatIds, starredIds, displayed);
        expect(picked).not.toContain(q.id);
        picked.push(q.id);
      }
      expect(displayed.length).toBe(mockQuestions.length);
      expect(picked.length).toBe(mockQuestions.length);
    });

    it('resets cycle when all questions are displayed', () => {
      const displayed = [0, 1, 2, 3];
      const q = getNextSpacedRepetitionQuestion(mockQuestions, ['q1'], [], displayed);
      expect(displayed.length).toBe(1);
      expect(mockQuestions).toContain(q);
    });

    it('gives higher probability weight (3x) to questions in repeatIds or starredIds', () => {
      // With questions: q1 (weight 1), q2 (repeat, weight 3), q3 (weight 1), q4 (weight 1)
      // Total weight = 6. Expected probability of q2 being first pick = 3/6 = 50%
      // Normal items have 1/6 = 16.6% each.
      // Run 600 trials and verify q2 is selected significantly more frequently than q1.
      let q2FirstCount = 0;
      let q1FirstCount = 0;
      const trials = 600;

      for (let i = 0; i < trials; i++) {
        const displayed = [];
        const first = getNextSpacedRepetitionQuestion(mockQuestions, ['q2'], [], displayed);
        if (first.id === 'q2') q2FirstCount++;
        if (first.id === 'q1') q1FirstCount++;
      }

      // 3x weight means q2 should be picked roughly 3x as often as q1
      expect(q2FirstCount).toBeGreaterThan(q1FirstCount * 1.8);
      expect(q2FirstCount).toBeGreaterThan(trials * 0.35);
    });

    it('returns null for empty question list', () => {
      const displayed = [];
      expect(getNextSpacedRepetitionQuestion([], ['q1'], [], displayed)).toBeNull();
    });
  });

  describe('getNextQuestion Dispatcher', () => {
    it('dispatches to random algorithm by default or when random/original is specified', () => {
      const displayed = [];
      const qDefault = getNextQuestion(mockQuestions, displayed);
      expect(mockQuestions).toContain(qDefault);
      expect(displayed.length).toBe(1);

      const qRandom = getNextQuestion(mockQuestions, displayed, 'random');
      expect(mockQuestions).toContain(qRandom);
      expect(displayed.length).toBe(2);

      const qOriginal = getNextQuestion(mockQuestions, displayed, 'original');
      expect(mockQuestions).toContain(qOriginal);
      expect(displayed.length).toBe(3);
    });

    it('dispatches to sequential algorithm when sequential is specified', () => {
      const qSeq = getNextQuestion(mockQuestions, [], 'sequential', [], [], 1, 'next');
      expect(qSeq.id).toBe('q3');

      const qPrev = getNextQuestion(mockQuestions, [], 'sequential', [], [], 1, 'prev');
      expect(qPrev.id).toBe('q1');
    });

    it('dispatches to spaced algorithm when spaced is specified', () => {
      const displayed = [];
      const qSpaced = getNextQuestion(mockQuestions, displayed, 'spaced', ['q1'], []);
      expect(mockQuestions).toContain(qSpaced);
      expect(displayed.length).toBe(1);
    });
  });
});
