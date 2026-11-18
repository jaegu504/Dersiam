import { describe, it, expect, beforeEach } from 'vitest';
import { renderHomeView } from '../src/components/homeView.js';
import { createStore, DEFAULT_STATE } from '../src/state/store.js';

describe("Home view with Fathul Mu'in", () => {
  let container;
  let store;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('main');
    document.body.appendChild(container);
    store = createStore({ ...DEFAULT_STATE, currentView: 'home', activeBook: null, activeLang: 'id' });
    renderHomeView(container, store);
  });

  it('adds the Fathul Mu\'in card last, using the same card template as the other books', () => {
    const cards = [...container.querySelectorAll('.book-card')];
    expect(cards.map((c) => c.dataset.bookId)).toEqual(['quduri', 'talhis', 'kafiye', 'menar', 'akaid', 'maksud', 'fathul']);
    const fathul = cards[6];
    const maksud = cards[5]; // single-source book; Quduri adds a "2 sources" badge
    expect(fathul.className).toBe(maksud.className);
    const structure = (el) => [...el.querySelectorAll('*')].map((n) => `${n.tagName}.${n.className}`).join('|');
    expect(structure(fathul)).toBe(structure(maksud));
    expect(fathul.querySelector('.category-badge').textContent.trim()).toBe("Fikih Syafi'i");
  });

  it('the Fathul Mu\'in card opens the fathul view', () => {
    container.querySelector('[data-book-id="fathul"]').click();
    expect(store.getState().currentView).toBe('fathul');
    expect(store.getState().activeBook).toBe('fathul');
  });

  it('other cards still open the study view', () => {
    container.querySelector('[data-book-id="quduri"]').click();
    expect(store.getState().currentView).toBe('study');
    expect(store.getState().activeBook).toBe('quduri');
  });
});
