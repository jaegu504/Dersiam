/**
 * Storage and metric calculation services for 6-Kitab Madrasah Q&A Portal.
 * Handles localStorage persistence for user progress, settings, notes, and study metrics.
 */

export const STORAGE_KEYS = {
  progress: (bookKey) => `soru_cevap_progress_${bookKey}`,
  settings: 'soru_cevap_settings',
  lastSession: 'soru_cevap_last_session'
};

export const DEFAULT_SETTINGS = {
  isDarkMode: false,
  isAudioMuted: false,
  activeAlgorithm: 'random',
  activeLang: 'tr',
  fontSize: 'medium'
};

/**
 * Returns a clean default progress structure for a given book.
 *
 * @param {string} bookKey - Identifier of the book (e.g. 'quduri', 'talhis').
 * @returns {object} Default progress object.
 */
export function getDefaultProgress(bookKey) {
  return {
    bookKey,
    viewedIds: [],
    rememberedIds: [],
    repeatIds: [],
    starredIds: [],
    notes: {},
    algorithm: 'random',
    activeChapterFilter: 'all'
  };
}

/**
 * Loads user study progress for a specific book from localStorage.
 *
 * @param {string} bookKey - Key of the book.
 * @returns {object} Progress object.
 */
export function loadUserProgress(bookKey) {
  const defaultProgress = getDefaultProgress(bookKey);
  try {
    const raw = typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.progress(bookKey))
      : null;
    if (!raw) return defaultProgress;

    const parsed = JSON.parse(raw);
    return {
      ...defaultProgress,
      ...parsed,
      viewedIds: Array.isArray(parsed.viewedIds) ? parsed.viewedIds : [],
      rememberedIds: Array.isArray(parsed.rememberedIds) ? parsed.rememberedIds : [],
      repeatIds: Array.isArray(parsed.repeatIds) ? parsed.repeatIds : [],
      starredIds: Array.isArray(parsed.starredIds) ? parsed.starredIds : [],
      notes: (parsed.notes && typeof parsed.notes === 'object') ? parsed.notes : {}
    };
  } catch {
    return defaultProgress;
  }
}

/**
 * Persists user study progress for a book to localStorage.
 *
 * @param {string} bookKey - Key of the book.
 * @param {object} progress - Progress state to save.
 */
export function saveUserProgress(bookKey, progress) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.progress(bookKey), JSON.stringify(progress));
    }
  } catch {
    // Graceful fallback if storage quota exceeded or disabled
  }
}

/**
 * Clears saved progress for a book and returns default progress.
 *
 * @param {string} bookKey - Key of the book.
 * @returns {object} Default progress object.
 */
export function resetUserProgress(bookKey) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.progress(bookKey));
    }
  } catch {
    // Ignore error
  }
  return getDefaultProgress(bookKey);
}

/**
 * Calculates completion and retention percentage metrics for the evaluation dashboard.
 *
 * completionPct = (viewedCount / totalQuestions) * 100
 * retentionPct = rememberedCount / (rememberedCount + repeatCount) * 100
 *
 * @param {object} progress - User progress object.
 * @param {number} totalQuestions - Total count of questions in active scope.
 * @returns {{ completionPct: number, retentionPct: number, viewedCount: number, rememberedCount: number, repeatCount: number, starredCount: number, totalQuestions: number }}
 */
export function calculateMetrics(progress, totalQuestions = 0) {
  const p = progress || {};
  const viewedCount = Array.isArray(p.viewedIds) ? p.viewedIds.length : 0;
  const rememberedCount = Array.isArray(p.rememberedIds) ? p.rememberedIds.length : 0;
  const repeatCount = Array.isArray(p.repeatIds) ? p.repeatIds.length : 0;
  const starredCount = Array.isArray(p.starredIds) ? p.starredIds.length : 0;

  const completionPct = totalQuestions > 0
    ? Math.round((viewedCount / totalQuestions) * 100)
    : 0;

  const evalTotal = rememberedCount + repeatCount;
  const retentionPct = evalTotal > 0
    ? Math.round((rememberedCount / evalTotal) * 100)
    : 0;

  return {
    completionPct,
    retentionPct,
    viewedCount,
    rememberedCount,
    repeatCount,
    starredCount,
    totalQuestions
  };
}

/**
 * Records user self-evaluation (remembered vs repeat) for a question.
 * Strictly enforces mutual exclusivity:
 * - 'remembered' adds to rememberedIds and removes from repeatIds.
 * - 'repeat' adds to repeatIds and removes from rememberedIds.
 * Always ensures questionId is marked as viewed.
 *
 * @param {object} progress - Current progress object.
 * @param {string} questionId - ID of evaluated question.
 * @param {'remembered'|'repeat'} status - Assessment result.
 * @returns {object} Updated progress object.
 */
export function recordSelfEvaluation(progress, questionId, status) {
  const current = progress || {};
  const viewedIds = Array.isArray(current.viewedIds) ? [...current.viewedIds] : [];
  let rememberedIds = Array.isArray(current.rememberedIds) ? [...current.rememberedIds] : [];
  let repeatIds = Array.isArray(current.repeatIds) ? [...current.repeatIds] : [];

  if (!viewedIds.includes(questionId)) {
    viewedIds.push(questionId);
  }

  if (status === 'remembered') {
    if (!rememberedIds.includes(questionId)) {
      rememberedIds.push(questionId);
    }
    repeatIds = repeatIds.filter(id => id !== questionId);
  } else if (status === 'repeat') {
    if (!repeatIds.includes(questionId)) {
      repeatIds.push(questionId);
    }
    rememberedIds = rememberedIds.filter(id => id !== questionId);
  }

  return {
    ...current,
    viewedIds,
    rememberedIds,
    repeatIds
  };
}

/**
 * Toggles a question in the starred list.
 *
 * @param {object} progress - Current progress object.
 * @param {string} questionId - ID of question to toggle.
 * @returns {object} Updated progress object.
 */
export function toggleStarred(progress, questionId) {
  const current = progress || {};
  const starredIds = Array.isArray(current.starredIds) ? [...current.starredIds] : [];
  const index = starredIds.indexOf(questionId);

  if (index === -1) {
    starredIds.push(questionId);
  } else {
    starredIds.splice(index, 1);
  }

  return {
    ...current,
    starredIds
  };
}

/**
 * Saves a private study note for a question.
 *
 * @param {object} progress - Current progress object.
 * @param {string} questionId - Question ID.
 * @param {string} noteText - Note content.
 * @returns {object} Updated progress object.
 */
export function saveNote(progress, questionId, noteText) {
  const current = progress || {};
  const notes = { ...(current.notes || {}) };
  notes[questionId] = noteText;

  return {
    ...current,
    notes
  };
}

/**
 * Loads application settings from localStorage.
 *
 * @returns {object} User settings merged with defaults.
 */
export function loadSettings() {
  try {
    const raw = typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.settings)
      : null;
    if (!raw) return { ...DEFAULT_SETTINGS };

    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Persists application settings to localStorage.
 *
 * @param {object} settings - Settings object to save.
 */
export function saveSettings(settings) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    }
  } catch {
    // Graceful fallback
  }
}

/**
 * Remembers where the user last studied, for the home "continue" card.
 *
 * @param {{ book: string, chapter: string, index: number, total: number, chapterNameTr?: string, chapterNameId?: string }} session
 */
export function saveLastSession(session) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.lastSession, JSON.stringify({ ...session, at: Date.now() }));
    }
  } catch {
    // Graceful fallback
  }
}

/**
 * Loads the last study position, or null when there is none.
 *
 * @returns {{ book: string, chapter: string, index: number, total: number, chapterNameTr?: string, chapterNameId?: string } | null}
 */
export function loadLastSession() {
  try {
    const raw = typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.lastSession)
      : null;
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed.book === 'string' ? parsed : null;
  } catch {
    return null;
  }
}
