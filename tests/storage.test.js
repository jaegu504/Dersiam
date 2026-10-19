import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateMetrics,
  recordSelfEvaluation,
  toggleStarred,
  saveNote,
  loadUserProgress,
  saveUserProgress,
  resetUserProgress,
  loadSettings,
  saveSettings,
  STORAGE_KEYS
} from '../src/state/storage.js';
import { store, createStore } from '../src/state/store.js';

describe('Storage and State Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Metric Formulas (calculateMetrics)', () => {
    it('calculates completion and retention percentage accurately', () => {
      const progress = {
        viewedIds: ['1', '2', '3', '4'],
        rememberedIds: ['1', '2', '3'],
        repeatIds: ['4']
      };
      const metrics = calculateMetrics(progress, 10);
      expect(metrics.completionPct).toBe(40); // (4 / 10) * 100
      expect(metrics.retentionPct).toBe(75);  // 3 / (3 + 1) * 100
      expect(metrics.viewedCount).toBe(4);
      expect(metrics.rememberedCount).toBe(3);
      expect(metrics.repeatCount).toBe(1);
      expect(metrics.totalQuestions).toBe(10);
    });

    it('returns 0 for retention percentage when neither remembered nor repeat items exist', () => {
      const progress = {
        viewedIds: ['1', '2'],
        rememberedIds: [],
        repeatIds: []
      };
      const metrics = calculateMetrics(progress, 10);
      expect(metrics.completionPct).toBe(20);
      expect(metrics.retentionPct).toBe(0);
    });

    it('handles totalQuestions = 0 without dividing by zero', () => {
      const progress = {
        viewedIds: [],
        rememberedIds: [],
        repeatIds: []
      };
      const metrics = calculateMetrics(progress, 0);
      expect(metrics.completionPct).toBe(0);
      expect(metrics.retentionPct).toBe(0);
    });

    it('rounds percentages to nearest integer', () => {
      const progress = {
        viewedIds: ['1', '2', '3'],
        rememberedIds: ['1', '2'],
        repeatIds: ['3']
      };
      // 3 / 7 = 42.857% -> 43%
      // 2 / 3 = 66.666% -> 67%
      const metrics = calculateMetrics(progress, 7);
      expect(metrics.completionPct).toBe(43);
      expect(metrics.retentionPct).toBe(67);
    });
  });

  describe('Self Evaluation Mutual Exclusivity (recordSelfEvaluation)', () => {
    it('ensures rememberedIds and repeatIds are strictly mutually exclusive', () => {
      let progress = {
        viewedIds: [],
        rememberedIds: ['1'],
        repeatIds: []
      };

      progress = recordSelfEvaluation(progress, '1', 'repeat');
      expect(progress.rememberedIds).not.toContain('1');
      expect(progress.repeatIds).toContain('1');
      expect(progress.viewedIds).toContain('1');

      progress = recordSelfEvaluation(progress, '1', 'remembered');
      expect(progress.rememberedIds).toContain('1');
      expect(progress.repeatIds).not.toContain('1');
      expect(progress.viewedIds).toContain('1');
    });

    it('adds questionId to viewedIds if not present without duplicating', () => {
      let progress = {
        viewedIds: ['1'],
        rememberedIds: [],
        repeatIds: []
      };

      progress = recordSelfEvaluation(progress, '2', 'remembered');
      expect(progress.viewedIds).toEqual(['1', '2']);

      progress = recordSelfEvaluation(progress, '2', 'repeat');
      expect(progress.viewedIds).toEqual(['1', '2']);
    });

    it('handles partially uninitialized progress objects gracefully', () => {
      const bareProgress = {};
      const updated = recordSelfEvaluation(bareProgress, 'q1', 'remembered');
      expect(updated.rememberedIds).toEqual(['q1']);
      expect(updated.repeatIds).toEqual([]);
      expect(updated.viewedIds).toEqual(['q1']);
    });
  });

  describe('Starred and Notes Management', () => {
    it('toggles question in starredIds correctly', () => {
      let progress = { starredIds: [] };

      progress = toggleStarred(progress, 'q1');
      expect(progress.starredIds).toContain('q1');

      progress = toggleStarred(progress, 'q2');
      expect(progress.starredIds).toEqual(['q1', 'q2']);

      progress = toggleStarred(progress, 'q1');
      expect(progress.starredIds).toEqual(['q2']);
    });

    it('saves private note for a specific question', () => {
      let progress = { notes: {} };

      progress = saveNote(progress, 'q1', 'Faida penting mengenai syarat wudhu');
      expect(progress.notes['q1']).toBe('Faida penting mengenai syarat wudhu');

      progress = saveNote(progress, 'q1', 'Catatan diperbarui');
      expect(progress.notes['q1']).toBe('Catatan diperbarui');
    });
  });

  describe('LocalStorage Persistence (Progress & Settings)', () => {
    it('saves and loads user progress for a book correctly', () => {
      const bookKey = 'quduri';
      const sampleProgress = {
        bookKey,
        viewedIds: ['q1', 'q2'],
        rememberedIds: ['q1'],
        repeatIds: ['q2'],
        starredIds: ['q1'],
        notes: { q1: 'catatan quduri' },
        algorithm: 'spaced',
        activeChapterFilter: 'taharah'
      };

      saveUserProgress(bookKey, sampleProgress);

      const raw = localStorage.getItem(`soru_cevap_progress_${bookKey}`);
      expect(raw).toBeTruthy();

      const loaded = loadUserProgress(bookKey);
      expect(loaded.bookKey).toBe(bookKey);
      expect(loaded.viewedIds).toEqual(['q1', 'q2']);
      expect(loaded.rememberedIds).toEqual(['q1']);
      expect(loaded.repeatIds).toEqual(['q2']);
      expect(loaded.starredIds).toEqual(['q1']);
      expect(loaded.notes.q1).toBe('catatan quduri');
      expect(loaded.algorithm).toBe('spaced');
      expect(loaded.activeChapterFilter).toBe('taharah');
    });

    it('returns default progress when nothing is stored for a book', () => {
      const loaded = loadUserProgress('talhis');
      expect(loaded.bookKey).toBe('talhis');
      expect(loaded.viewedIds).toEqual([]);
      expect(loaded.rememberedIds).toEqual([]);
      expect(loaded.repeatIds).toEqual([]);
      expect(loaded.starredIds).toEqual([]);
      expect(loaded.notes).toEqual({});
      expect(loaded.algorithm).toBe('random');
      expect(loaded.activeChapterFilter).toBe('all');
    });

    it('resets user progress for a specific book in localStorage', () => {
      const bookKey = 'kafiye';
      saveUserProgress(bookKey, {
        bookKey,
        viewedIds: ['k1'],
        rememberedIds: ['k1'],
        repeatIds: [],
        starredIds: [],
        notes: {}
      });

      expect(localStorage.getItem(`soru_cevap_progress_${bookKey}`)).toBeTruthy();

      const reset = resetUserProgress(bookKey);
      expect(reset.viewedIds).toEqual([]);
      expect(localStorage.getItem(`soru_cevap_progress_${bookKey}`)).toBeNull();
    });

    it('saves and loads global user settings correctly', () => {
      const initialSettings = loadSettings();
      expect(initialSettings.isDarkMode).toBe(false);
      expect(initialSettings.isAudioMuted).toBe(false);
      expect(initialSettings.activeLang).toBe('tr');

      const newSettings = {
        isDarkMode: true,
        isAudioMuted: true,
        activeAlgorithm: 'spaced',
        activeLang: 'id',
        fontSize: 'large'
      };

      saveSettings(newSettings);

      const loaded = loadSettings();
      expect(loaded.isDarkMode).toBe(true);
      expect(loaded.isAudioMuted).toBe(true);
      expect(loaded.activeAlgorithm).toBe('spaced');
      expect(loaded.activeLang).toBe('id');
      expect(loaded.fontSize).toBe('large');
    });
  });

  describe('Reactive Pub/Sub Store (src/state/store.js)', () => {
    it('has default state properly defined', () => {
      const state = store.getState();
      expect(state.currentView).toBe('home');
      expect(state.activeBook).toBeNull();
      expect(state.activeLang).toBe('tr');
      expect(state.activeChapter).toBe('all');
      expect(state.isDarkMode).toBe(false);
      expect(state.isAudioMuted).toBe(false);
      expect(state.activeAlgorithm).toBe('random');
      expect(state.examMode).toBe('oral');
      expect(state.examTimerSec).toBe(30);
      expect(state.isAnswerRevealed).toBe(false);
    });

    it('updates state via setState and triggers subscribers', () => {
      let callCount = 0;
      let lastState = null;
      let previousState = null;

      const testStore = createStore({ currentView: 'home', activeBook: null });
      const unsubscribe = testStore.subscribe((state, prev) => {
        callCount++;
        lastState = state;
        previousState = prev;
      });

      testStore.setState({ currentView: 'study', activeBook: 'quduri' });

      expect(callCount).toBe(1);
      expect(lastState.currentView).toBe('study');
      expect(lastState.activeBook).toBe('quduri');
      expect(previousState.currentView).toBe('home');
      expect(previousState.activeBook).toBeNull();

      unsubscribe();
      testStore.setState({ currentView: 'exam' });
      expect(callCount).toBe(1); // Subscriber was removed
    });
  });
});
