import { describe, it, expect, afterEach } from 'vitest';
import { booksData, booksMetadata } from '../src/data/books.js';
import { fathulMeta } from '../src/data/fathul/meta.js';
import { loadFathul, isFathulLoaded } from '../src/data/fathul/load.js';
import { createStore, DEFAULT_STATE } from '../src/state/store.js';
import { initApp } from '../src/main.js';
import { dictionary } from '../src/data/dictionary.js';

const tick = () => new Promise((r) => setTimeout(r, 0));

describe("Fathul Mu'in loader", () => {
  let app;
  afterEach(() => {
    app?.viewUnmount?.();
    app?.headerUnmount?.();
    document.body.innerHTML = '';
  });

  // Order matters: this file starts with the data not yet loaded.
  it('study view for fathul shows a loading state, then the flashcards (resume / back button path)', async () => {
    expect(booksData.fathul).toBeUndefined();
    expect(isFathulLoaded()).toBe(false);
    document.body.innerHTML = '<div id="app"></div>';
    const store = createStore({ ...DEFAULT_STATE, currentView: 'study', activeBook: 'fathul', activeLang: 'id' });
    app = initApp(document.getElementById('app'), store);
    const mount = document.getElementById('view-mount');
    const loadingText = dictionary[store.getState().activeLang].fathulLoading; // initApp restores the saved language
    expect(mount.textContent).toContain(loadingText);
    await loadFathul();
    await tick();
    expect(mount.querySelector('.study-view')).not.toBeNull();
    expect(mount.textContent).not.toContain(loadingText);
  });

  it('registers questions in booksData once loaded and returns corpus and index', async () => {
    const { corpus, questions, index } = await loadFathul();
    expect(isFathulLoaded()).toBe(true);
    expect(booksData.fathul).toBe(questions);
    expect(questions).toHaveLength(fathulMeta.totalQuestions);
    expect(corpus.topics).toHaveLength(1698);
    expect(index).toHaveLength(1698);
  });

  it('returns the same cached promise on every call', () => {
    expect(loadFathul()).toBe(loadFathul());
  });

  it('does not remount a view the user already left while loading', async () => {
    document.body.innerHTML = '<div id="app"></div>';
    const store = createStore({ ...DEFAULT_STATE, currentView: 'home', activeLang: 'id' });
    app = initApp(document.getElementById('app'), store);
    store.setState({ activeBook: 'fathul', currentView: 'exam' });
    store.setState({ currentView: 'home', activeBook: null });
    await loadFathul();
    await tick();
    expect(document.querySelector('.home-view')).not.toBeNull();
  });
});

describe("Fathul Mu'in book metadata", () => {
  it('describes the book with Syafi\'i labels in both languages', () => {
    const m = booksMetadata.fathul;
    expect(m.id).toBe('fathul');
    expect(m.titleAr).toBe('فتح المعين');
    expect(m.titleId).toBe("Fathul Mu'in");
    expect(m.categoryId).toBe("Fikih Syafi'i");
    expect(m.categoryTr).toBe('Şâfiî Fıkhı');
    for (const k of ['titleTr', 'descTr', 'descId', 'authorTr', 'authorId', 'themeColor']) expect(m[k]).toBeTruthy();
    expect(m.totalChapters).toBe(14);
    expect(m.totalQuestions).toBe(fathulMeta.totalQuestions);
  });

  it('has loader messages in both dictionaries', () => {
    for (const lang of ['tr', 'id']) {
      expect(dictionary[lang].fathulLoading).toBeTruthy();
      expect(dictionary[lang].fathulLoadError).toBeTruthy();
    }
  });
});
