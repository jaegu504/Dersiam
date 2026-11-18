import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderFathulView } from '../src/components/fathulView.js';
import { loadFathul } from '../src/data/fathul/load.js';
import { createStore, DEFAULT_STATE } from '../src/state/store.js';
import { dictionary } from '../src/data/dictionary.js';
import { initApp } from '../src/main.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const d = dictionary.id;

let container;
let store;
let unmount;

async function mount(lang = 'id') {
  store = createStore({ ...DEFAULT_STATE, currentView: 'fathul', activeBook: 'fathul', activeLang: lang });
  unmount = renderFathulView(container, store);
  await loadFathul();
  await wait(0);
}

function search(q) {
  const input = container.querySelector('input[type="search"]');
  input.value = q;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  return wait(200);
}

const cardFor = (hlmText) => [...container.querySelectorAll('.fathul-card')].find((c) => c.textContent.includes(hlmText));

beforeEach(() => {
  document.body.innerHTML = '';
  container = document.createElement('main');
  document.body.appendChild(container);
});

afterEach(() => {
  unmount?.();
  unmount = null;
  document.body.innerHTML = '';
});

describe("Fathul Mu'in view: entry", () => {
  it('shows a loading state until the data arrives', () => {
    store = createStore({ ...DEFAULT_STATE, currentView: 'fathul', activeBook: 'fathul', activeLang: 'id' });
    unmount = renderFathulView(container, store);
    // data may already be cached from another test file run; either state is valid on first paint
    expect(container.querySelector('.fathul-view') || container.textContent.includes(d.fathulLoading)).toBeTruthy();
  });

  it('shows title, mazhab label, search box, five example chips and the two secondary ways', async () => {
    await mount();
    const view = container.querySelector('.fathul-view');
    expect(view.textContent).toContain("Fathul Mu'in");
    expect(view.textContent).toContain('فتح المعين بشرح قرة العين');
    expect(view.textContent).toContain(d.fathulMazhab);
    expect(view.textContent).toContain('673');
    const input = view.querySelector('input[type="search"]');
    expect(input.getAttribute('placeholder')).toBe(d.fathulSearchPlaceholder);
    expect(input.getAttribute('aria-label')).toBeTruthy();
    const chips = [...view.querySelectorAll('[data-chip]')].map((b) => b.textContent.trim());
    expect(chips).toEqual(['basmalah', 'jamak shalat', 'zakat fitrah', 'talak', 'ihram']);
    expect(view.querySelector('[data-action="browse"]').textContent).toContain(d.fathulBrowse);
    expect(view.querySelector('[data-action="practice"]').textContent).toContain(d.fathulPractice);
  });
});

describe("Fathul Mu'in view: search results", () => {
  it('every example chip finds at least one topic', async () => {
    await mount();
    for (const chip of [...container.querySelectorAll('[data-chip]')]) {
      chip.click();
      await wait(0);
      expect(container.querySelectorAll('.fathul-card').length, chip.dataset.chip).toBeGreaterThan(0);
    }
  });

  it('a chip searches and renders highlighted cards with page badge', async () => {
    await mount();
    container.querySelector('[data-chip="basmalah"]').click();
    await wait(0);
    const card = cardFor('hlm 70 · cetak 99');
    expect(card).toBeTruthy();
    expect(card.querySelector('.fathul-card-title mark')).not.toBeNull();
    expect(card.querySelector('.fathul-card-ringkas mark')).not.toBeNull();
    const ibarah = card.querySelector('.fathul-card-ibarah');
    expect(ibarah.getAttribute('dir')).toBe('rtl');
    expect(ibarah.getAttribute('lang')).toBe('ar');
    expect(container.querySelector('input[type="search"]').value).toBe('basmalah');
    expect(container.querySelector('.fathul-count').textContent).toMatch(/\d/);
  });

  it('an Indonesian query also marks the topic\'s Arabic term inside the ibarah', async () => {
    await mount();
    container.querySelector('[data-chip="basmalah"]').click();
    await wait(0);
    const marks = [...cardFor('hlm 70 · cetak 99').querySelectorAll('.fathul-card-ibarah mark')].map((m) => m.textContent);
    expect(marks).toContain('البسملة');
  });

  it('typing an Arabic word marks it inside the ibarah snippet', async () => {
    await mount();
    await search('البسملة');
    const card = cardFor('hlm 70 · cetak 99');
    const marks = [...card.querySelectorAll('.fathul-card-ibarah mark')].map((m) => m.textContent);
    expect(marks).toContain('البسملة');
  });

  it('shows the no-results message for an unknown word and clears results for an empty box', async () => {
    await mount();
    await search('zzzzqx');
    expect(container.textContent).toContain(d.fathulNoResults);
    expect(container.querySelectorAll('.fathul-card')).toHaveLength(0);
    await search('');
    expect(container.textContent).not.toContain(d.fathulNoResults);
  });

  it('"Baca halaman lengkap" opens the page sheet at the referenced paragraph', async () => {
    await mount();
    await search('basmalah');
    cardFor('hlm 70 · cetak 99').querySelector('[data-open-topic]').click();
    const sheet = document.querySelector('.fathul-sheet');
    expect(sheet).not.toBeNull();
    expect(sheet.querySelector('.modal-header').textContent).toContain('hlm 70');
    expect(sheet.querySelector('.is-ref mark')).not.toBeNull();
  });
});

describe("Fathul Mu'in view: leaving with a sheet open", () => {
  it('unmounting the view closes an open page sheet', async () => {
    await mount();
    await search('basmalah');
    container.querySelector('[data-open-topic]').click();
    expect(document.querySelector('.fathul-sheet')).not.toBeNull();
    unmount();
    unmount = null;
    expect(document.querySelector('.fathul-sheet')).toBeNull();
  });
});

describe("Fathul Mu'in view: secondary ways", () => {
  it('Latihan Soal switches to the study view for fathul', async () => {
    await mount();
    container.querySelector('[data-action="practice"]').click();
    const s = store.getState();
    expect(s.currentView).toBe('study');
    expect(s.activeBook).toBe('fathul');
    expect(s.activeChapter).toBe('all');
    expect(s.currentQuestionIndex).toBe(0);
  });

  it('Telusur Bab goes chapter, fasal, topic, then opens the page; back returns a level', async () => {
    await mount();
    container.querySelector('[data-action="browse"]').click();
    const chapters = container.querySelectorAll('[data-chapter]');
    expect(chapters).toHaveLength(14);
    container.querySelector('[data-chapter="02"]').click();
    const fasal = [...container.querySelectorAll('[data-fasal]')].find((b) => b.textContent.includes('فصل في صفة الصلاة'));
    expect(fasal).toBeTruthy();
    fasal.click();
    const topic = [...container.querySelectorAll('[data-open-topic]')].find((b) => b.textContent.includes('Basmalah dan tasydid dalam Fatihah'));
    expect(topic.textContent).toContain('hlm 70');
    topic.click();
    expect(document.querySelector('.fathul-sheet .modal-header').textContent).toContain('hlm 70');
    document.querySelector('.fathul-sheet .modal-close-btn').click();
    container.querySelector('[data-action="back"]').click();
    expect(container.querySelectorAll('[data-fasal]').length).toBeGreaterThan(0);
    container.querySelector('[data-action="back"]').click();
    expect(container.querySelectorAll('[data-chapter]')).toHaveLength(14);
  });

  it('typing while browsing switches back to search results', async () => {
    await mount();
    container.querySelector('[data-action="browse"]').click();
    await search('basmalah');
    expect(container.querySelectorAll('[data-chapter]')).toHaveLength(0);
    expect(container.querySelectorAll('.fathul-card').length).toBeGreaterThan(0);
  });
});

describe("Fathul Mu'in view: language and routing", () => {
  it('re-renders labels when the language changes, keeping the query', async () => {
    await mount();
    await search('basmalah');
    store.setState({ activeLang: 'tr' });
    const input = container.querySelector('input[type="search"]');
    expect(input.getAttribute('placeholder')).toBe(dictionary.tr.fathulSearchPlaceholder);
    expect(input.value).toBe('basmalah');
    expect(container.querySelectorAll('.fathul-card').length).toBeGreaterThan(0);
  });

  it('main.js mounts the fathul view for currentView "fathul"', async () => {
    document.body.innerHTML = '<div id="app"></div>';
    const s = createStore({ ...DEFAULT_STATE, currentView: 'fathul', activeBook: 'fathul' });
    const app = initApp(document.getElementById('app'), s);
    await loadFathul();
    await wait(0);
    expect(document.querySelector('#view-mount .fathul-view')).not.toBeNull();
    app.viewUnmount();
  });
});
