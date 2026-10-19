/**
 * Central Reactive State Store for 5-Kitab Madrasah Q&A Portal.
 * Lightweight pub/sub observer pattern managing navigation, book selections,
 * exam states, and UI preferences.
 */

export const DEFAULT_STATE = {
  currentView: 'home',
  activeBook: null,
  activeLang: 'tr',
  activeChapter: 'all',
  isDarkMode: false,
  isAudioMuted: false,
  activeAlgorithm: 'random',
  examMode: 'oral',
  examTimerSec: 30,
  isAnswerRevealed: false
};

/**
 * Creates a reactive pub/sub store with isolated state.
 *
 * @param {object} initialState - Initial store state object.
 * @returns {{ getState: Function, setState: Function, subscribe: Function }}
 */
export function createStore(initialState = {}) {
  let state = { ...initialState };
  const listeners = new Set();

  return {
    /**
     * Returns a snapshot of the current state.
     * @returns {object}
     */
    getState() {
      return state;
    },

    /**
     * Merges a partial patch into the current state and notifies subscribers.
     * Supports passing either a patch object or an updater function.
     *
     * @param {object|Function} patch - State changes or updater function.
     * @returns {object} Updated state.
     */
    setState(patch) {
      const prevState = state;
      const nextPatch = typeof patch === 'function' ? patch(state) : patch;
      state = { ...state, ...nextPatch };

      listeners.forEach(listener => {
        try {
          listener(state, prevState);
        } catch (err) {
          console.error(err);
        }
      });

      return state;
    },

    /**
     * Subscribes a listener to state changes.
     *
     * @param {Function} listener - Callback receiving (state, prevState).
     * @returns {Function} Unsubscribe function.
     */
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
}

/**
 * Default application singleton store instance.
 */
export const store = createStore(DEFAULT_STATE);

export const getState = store.getState;
export const setState = store.setState;
export const subscribe = store.subscribe;

export default store;
