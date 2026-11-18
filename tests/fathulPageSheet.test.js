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
  try { localStorage.removeItem('fathulFont'); localStorage.removeItem('fathulTranslation'); } catch { /* storage may be blocked */ }
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

  // happy-dom's History is a stub (pushState stores nothing), so these use spies;
  // the real back gesture is checked in the browser.
  it('opening adds a history entry so the back gesture closes the sheet', () => {
    const push = vi.spyOn(history, 'pushState');
    openFathulPage({ hlm: 70, lang: 'id' });
    expect(push).toHaveBeenCalledTimes(1);
    expect(push.mock.calls[0][0]).toMatchObject({ fathulSheet: true });
    push.mockRestore();
    const back = vi.spyOn(history, 'back');
    window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    expect(sheet()).toBeNull();
    expect(back).not.toHaveBeenCalled();
    back.mockRestore();
  });

  it('closing with the button removes its own history entry', () => {
    openFathulPage({ hlm: 70, lang: 'id' });
    const state = vi.spyOn(history, 'state', 'get').mockReturnValue({ fathulSheet: true });
    const back = vi.spyOn(history, 'back').mockImplementation(() => {});
    sheet().querySelector('.modal-close-btn').click();
    expect(back).toHaveBeenCalledTimes(1);
    back.mockRestore();
    state.mockRestore();
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

  describe('Indonesian translation toggle', () => {
    const trLines = (section) => sheet().querySelectorAll(`.${section} .fathul-tr`);
    const arLines = (section) => sheet().querySelectorAll(`.${section} [lang="ar"]`);
    const shown = () => vi.waitFor(() => expect(sheet().querySelectorAll('.fathul-tr').length).toBeGreaterThan(0));

    it('is off by default and shows no translation lines', () => {
      openFathulPage({ hlm: 70, lang: 'id' });
      expect(btn('translate').getAttribute('aria-pressed')).toBe('false');
      expect(btn('translate').textContent).toContain(dictionary.id.fathulTranslation);
      expect(sheet().querySelector('.fathul-tr')).toBeNull();
    });

    it('shows one Indonesian line under each Arabic line, then hides them again', async () => {
      openFathulPage({ hlm: 70, lang: 'id' });
      btn('translate').click();
      await shown();
      expect(btn('translate').getAttribute('aria-pressed')).toBe('true');
      for (const s of ['fathul-matn', 'fathul-syarah']) expect(trLines(s).length).toBe(arLines(s).length);
      expect(trLines('fathul-syarah').length).toBe(corpus.pages['70'].syarah.length);
      const first = sheet().querySelector('.fathul-syarah [lang="ar"]');
      expect(first.nextElementSibling.classList.contains('fathul-tr')).toBe(true);
      expect(first.nextElementSibling.getAttribute('lang')).toBe('id');
      expect(sheet().textContent).toContain(dictionary.id.fathulTranslationNote);
      btn('translate').click();
      expect(sheet().querySelector('.fathul-tr')).toBeNull();
      expect(btn('translate').getAttribute('aria-pressed')).toBe('false');
    });

    it('keeps the reference highlight and search marks on the Arabic', async () => {
      const t = topicBy((x) => x.titleId === 'Basmalah dan tasydid dalam Fatihah');
      openFathulPage({ hlm: 70, topicId: t.id, query: 'البسملة', lang: 'id' });
      btn('translate').click();
      await shown();
      const ref = sheet().querySelectorAll('.is-ref');
      expect(ref).toHaveLength(1);
      expect(ref[0].getAttribute('lang')).toBe('ar');
      expect(sheet().querySelector('.fathul-tr mark')).toBeNull();
    });

    it('remembers the choice for the next opening', async () => {
      openFathulPage({ hlm: 70, lang: 'id' });
      btn('translate').click();
      await shown();
      document.body.innerHTML = '';
      openFathulPage({ hlm: 71, lang: 'id' });
      await shown();
      expect(btn('translate').getAttribute('aria-pressed')).toBe('true');
    });

    it('stays on across next / prev paging with matching line counts', async () => {
      openFathulPage({ hlm: 71, lang: 'id' });
      btn('translate').click();
      await shown();
      btn('next').click();
      expect(header()).toContain('hlm 72');
      expect(trLines('fathul-syarah').length).toBe(corpus.pages['72'].syarah.length);
      btn('prev').click();
      btn('prev').click();
      expect(header()).toContain('hlm 70');
      expect(trLines('fathul-syarah').length).toBe(corpus.pages['70'].syarah.length);
    });

    it('translation data covers every page with the same line counts as the Arabic', async () => {
      const { default: tr } = await import('../src/data/fathul/translation-id.json');
      const pages = Object.keys(corpus.pages);
      expect(Object.keys(tr).sort()).toEqual(pages.sort());
      for (const h of pages) for (const f of ['matn', 'syarah', 'footnotes']) expect(tr[h][f].length).toBe(corpus.pages[h][f].length);
    });

    it('marks uncertain translation lines and sends the reader to the original kitab', async () => {
      const { default: ragu } = await import('../src/data/fathul/ragu.json');
      openFathulPage({ hlm: 13, lang: 'id' });
      btn('translate').click();
      await shown();
      const lines = [...sheet().querySelectorAll('.fathul-syarah .fathul-tr')];
      const flagged = lines.filter((l) => l.classList.contains('is-ragu'));
      expect(flagged).toHaveLength(ragu['13'].syarah.length);
      expect(lines[ragu['13'].syarah[0]].classList.contains('is-ragu')).toBe(true);
      expect(flagged[0].textContent).toContain(dictionary.id.fathulRaguLine);
      expect(sheet().querySelector('.fathul-matn .is-ragu')).toBeNull();
    });

    it('translates footnotes too', async () => {
      openFathulPage({ hlm: 2, lang: 'id' });
      btn('translate').click();
      await shown();
      expect(trLines('fathul-footnotes').length).toBe(corpus.pages['2'].footnotes.length);
    });
  });
});
