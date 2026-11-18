import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { loadFathul } from '../src/data/fathul/load.js';
import { openFathulPage } from '../src/components/fathulPageSheet.js';
import { dictionary } from '../src/data/dictionary.js';

let corpus;
const topicBy = (pred) => corpus.topics.find(pred);
const sheet = () => document.querySelector('.fathul-sheet');
const header = () => sheet().querySelector('.modal-header').textContent;
const btn = (name) => sheet().querySelector(`[data-action="${name}"]`);

beforeAll(async () => {
  ({ corpus } = await loadFathul());
});

afterEach(() => {
  document.body.innerHTML = '';
  try { localStorage.removeItem('fathulFont'); } catch { /* storage may be blocked */ }
});

describe("Fathul Mu'in full page sheet", () => {
  it('hlm 70 shows matan, syarah and the highlighted reference paragraph', () => {
    const t = topicBy((x) => x.titleId === 'Basmalah dan tasydid dalam Fatihah');
    openFathulPage({ hlm: 70, topicId: t.id, query: 'basmalah', lang: 'id' });
    expect(sheet().getAttribute('role')).toBe('dialog');
    expect(header()).toContain('hlm 70');
    expect(header()).toContain('cetak 99');
    expect(sheet().querySelector('.fathul-matn').textContent).toContain('مع بسملة وتشديدات');
    const paras = sheet().querySelectorAll('.fathul-syarah .fathul-para');
    expect(paras).toHaveLength(corpus.pages['70'].syarah.length);
    const ref = sheet().querySelectorAll('.is-ref');
    expect(ref).toHaveLength(1);
    expect(ref[0].textContent).toContain('مع قراءة البسملة');
  });

  it('marks the Arabic search word even when the query was typed in Arabic', () => {
    openFathulPage({ hlm: 70, query: 'البسملة', lang: 'id' });
    const marks = [...sheet().querySelectorAll('.fathul-syarah mark')].map((m) => m.textContent);
    expect(marks).toContain('البسملة');
  });

  it('next / prev move pages, keep the query, drop the reference highlight', () => {
    const t = topicBy((x) => x.titleId === 'Basmalah dan tasydid dalam Fatihah');
    openFathulPage({ hlm: 70, topicId: t.id, query: 'basmalah', lang: 'id' });
    btn('next').click();
    expect(header()).toContain('hlm 71');
    expect(sheet().querySelector('.is-ref')).toBeNull();
    btn('prev').click();
    btn('prev').click();
    expect(header()).toContain('hlm 69');
  });

  it('disables prev on the first page and next on the last page', () => {
    openFathulPage({ hlm: 1, lang: 'id' });
    expect(btn('prev').disabled).toBe(true);
    expect(btn('next').disabled).toBe(false);
    document.body.innerHTML = '';
    openFathulPage({ hlm: 673, lang: 'id' });
    expect(btn('next').disabled).toBe(true);
  });

  it('page without a matan separator renders no matan box', () => {
    openFathulPage({ hlm: 372, lang: 'id' });
    expect(sheet().querySelector('.fathul-matn')).toBeNull();
    expect(sheet().querySelectorAll('.fathul-para').length).toBeGreaterThan(0);
  });

  it('footnotes render in their own block', () => {
    openFathulPage({ hlm: 2, lang: 'id' });
    const fn = sheet().querySelector('.fathul-footnotes');
    expect(fn).not.toBeNull();
    expect(fn.textContent).toContain(dictionary.id.fathulFootnotes);
    expect(sheet().querySelector('.fathul-syarah').textContent).not.toContain(corpus.pages['2'].footnotes[0]);
  });

  it('topic without an anchor opens its page without a reference highlight', () => {
    const t = topicBy((x) => x.anchor === null);
    expect(() => openFathulPage({ hlm: t.hlm, topicId: t.id, lang: 'id' })).not.toThrow();
    expect(header()).toContain(`hlm ${t.hlm}`);
    expect(sheet().querySelector('.is-ref')).toBeNull();
  });

  it('lists other topics of the same fasal and jumps to one', () => {
    const t = topicBy((x) => x.titleId === 'Basmalah dan tasydid dalam Fatihah');
    openFathulPage({ hlm: 70, topicId: t.id, lang: 'id' });
    const related = [...sheet().querySelectorAll('.fathul-related [data-topic-id]')];
    expect(related.length).toBeGreaterThan(0);
    expect(related.map((b) => b.dataset.topicId)).not.toContain(t.id);
    const target = related.find((b) => corpus.topics.find((x) => x.id === b.dataset.topicId).titleId === 'Ragu basmalah di tengah Fatihah');
    target.click();
    expect(header()).toContain('hlm 72');
    expect(sheet().querySelector('.is-ref').textContent).toContain('بسمل');
  });

  it('Escape closes the sheet and returns focus to the opener', () => {
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();
    openFathulPage({ hlm: 70, lang: 'id' });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(sheet()).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('the returned close function and the close button both close it', () => {
    const close = openFathulPage({ hlm: 70, lang: 'id' });
    close();
    expect(sheet()).toBeNull();
    openFathulPage({ hlm: 70, lang: 'id' });
    sheet().querySelector('.modal-close-btn').click();
    expect(sheet()).toBeNull();
  });

  it('font size toggle enlarges the text and remembers the choice', () => {
    openFathulPage({ hlm: 70, lang: 'id' });
    btn('font').click();
    expect(sheet().classList.contains('is-large')).toBe(true);
    expect(btn('font').getAttribute('aria-pressed')).toBe('true');
    document.body.innerHTML = '';
    openFathulPage({ hlm: 70, lang: 'id' });
    expect(sheet().classList.contains('is-large')).toBe(true);
  });

  it('copy puts the topic ibarah and its page on the clipboard', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const t = topicBy((x) => x.titleId === 'Basmalah dan tasydid dalam Fatihah');
    openFathulPage({ hlm: 70, topicId: t.id, lang: 'id' });
    btn('copy').click();
    expect(writeText).toHaveBeenCalledWith(`${t.ibarah}\n— Fathul Mu'in, hlm 70 · cetak 99`);
    await Promise.resolve();
    expect(btn('copy').textContent).toContain(dictionary.id.fathulCopied);
  });

  it('labels are translated in Turkish mode while the text stays Arabic', () => {
    openFathulPage({ hlm: 70, lang: 'tr' });
    expect(btn('next').getAttribute('aria-label')).toBe(dictionary.tr.fathulNextPage);
  });
});
