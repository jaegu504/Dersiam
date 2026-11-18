import { describe, it, expect } from 'vitest';
import corpus from '../src/data/fathul/corpus.json';
import { normalizeArabic, normalizeLatin } from '../src/services/search.js';
import {
  buildFathulIndex,
  searchFathul,
  highlightText,
  ibarahSnippet,
  normalizeWithMap,
  highlightQueryFor
} from '../src/services/fathulSearch.js';

const idx = buildFathulIndex(corpus.topics);
const topHlm = (q, n = 5) => searchFathul(idx, q).slice(0, n).map((r) => r.topic.hlm);

describe('normalizeWithMap', () => {
  it('produces exactly what normalizeArabic / normalizeLatin produce, over the whole corpus', () => {
    for (const t of corpus.topics) {
      for (const text of [t.titleAr, t.ibarah.split('\n')[0]]) {
        expect(normalizeWithMap(text, 'ar').norm).toBe(normalizeArabic(text));
      }
      for (const text of [t.titleId, t.ringkas]) {
        // fathul search folds sh->s and zh->z on top of normalizeLatin (map spells both shalat and salat)
        expect(normalizeWithMap(text, 'lat').norm).toBe(normalizeLatin(text).replace(/sh/g, 's').replace(/zh/g, 'z'));
      }
    }
  });

  it('maps every normalized character back to an original index', () => {
    const text = 'مَعَ  بَسْمَلَةٍ، Wudhu';
    for (const script of ['ar', 'lat']) {
      const { norm, map } = normalizeWithMap(text, script);
      expect(map).toHaveLength(norm.length);
      map.forEach((i) => expect(i).toBeGreaterThanOrEqual(0));
    }
  });
});

describe('searchFathul', () => {
  it('finds the basmalah topics (hlm 70, 72) in Indonesian and Arabic, with and without harakat', () => {
    for (const q of ['basmalah', 'Basmalah', 'البسملة', 'بسملة', 'بَسْمَلَة']) {
      expect(topHlm(q, 8)).toContain(70);
      expect(topHlm(q, 8)).toContain(72);
    }
  });

  it('requires every query word to match (AND), across fields', () => {
    const res = searchFathul(idx, 'ragu basmalah');
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].topic.hlm).toBe(72);
    expect(searchFathul(idx, 'basmalah zzzzqx')).toEqual([]);
  });

  it('ranks title matches above ibarah-only matches', () => {
    const res = searchFathul(idx, 'basmalah');
    const firstTitleMiss = res.findIndex((r) => !normalizeLatin(r.topic.titleId).includes('basmalah'));
    const lastTitleHit = res.map((r) => normalizeLatin(r.topic.titleId).includes('basmalah')).lastIndexOf(true);
    if (firstTitleMiss !== -1) expect(lastTitleHit).toBeLessThan(firstTitleMiss);
  });

  it('accepts Indonesian spelling variants the normalizer folds (shalat / salat, wudhu / wudu)', () => {
    expect(searchFathul(idx, 'salat jumat').length).toBeGreaterThan(0);
    expect(topHlm('wudu', 10)).toEqual(topHlm('wudhu', 10));
  });

  it('treats shalat / salat and zhuhur / zuhur as the same word', () => {
    const ids = (q) => searchFathul(idx, q, 5000).map((r) => r.topic.id).sort();
    expect(ids('shalat')).toEqual(ids('salat'));
    expect(ids('shalat').length).toBeGreaterThan(139);
    expect(ids('zhuhur')).toEqual(ids('zuhur'));
    expect(highlightText('Shalat jamak', 'salat')).toBe('<mark>Shalat</mark> jamak');
    expect(highlightText('salat jamak', 'shalat')).toBe('<mark>salat</mark> jamak');
  });

  it('ignores too-short or symbol-only queries', () => {
    for (const q of ['', 'ا', 'ُ', '?', '  ', 'a', null, undefined]) {
      expect(searchFathul(idx, q)).toEqual([]);
    }
  });

  it('caps very common words at 50 results and stays fast', () => {
    for (const q of ['الله', 'dan']) {
      const t0 = performance.now();
      const r = searchFathul(idx, q);
      expect(performance.now() - t0).toBeLessThan(50);
      expect(r.length).toBeLessThanOrEqual(50);
      expect(r.length).toBeGreaterThan(0);
    }
  });

  it('honours a custom maxResults', () => {
    expect(searchFathul(idx, 'shalat', 3)).toHaveLength(3);
  });
});

describe('highlightText', () => {
  it('marks Arabic through harakat, covering the diacritics', () => {
    expect(highlightText('مَعَ بَسْمَلَةٍ', 'بسملة')).toBe('مَعَ <mark>بَسْمَلَةٍ</mark>');
  });

  it('keeps a trailing hamza inside the mark', () => {
    expect(highlightText('في الوضوء وغيره', 'الوضوء')).toBe('في <mark>الوضوء</mark> وغيره');
    expect(highlightText('في الوُضُوءِ', 'وضوء')).toBe('في ال<mark>وُضُوءِ</mark>');
  });

  it('marks a substring inside a longer Arabic word', () => {
    expect(highlightText('مع قراءة البسملة فإنها', 'بسملة')).toBe('مع قراءة ال<mark>بسملة</mark> فإنها');
  });

  it('marks Latin case-insensitively and escapes HTML', () => {
    expect(highlightText('Basmalah <b>', 'basmalah')).toBe('<mark>Basmalah</mark> &lt;b&gt;');
  });

  it('marks folded spellings over their original letters', () => {
    expect(highlightText('Doa setelah wudhu', 'wudu')).toBe('Doa setelah <mark>wudhu</mark>');
  });

  it('marks every query word and merges overlaps', () => {
    expect(highlightText('Ragu basmalah di tengah Fatihah', 'basmalah ragu basma')).toBe('<mark>Ragu</mark> <mark>basmalah</mark> di tengah Fatihah');
  });

  it('marks only matching script in mixed text', () => {
    expect(highlightText('ragu basmalah, الشك في البسملة', 'البسملة')).toBe('ragu basmalah, الشك في <mark>البسملة</mark>');
  });

  it('returns escaped text unchanged when nothing matches or the query is empty', () => {
    expect(highlightText('a & b', 'zzz')).toBe('a &amp; b');
    expect(highlightText('a & b', '')).toBe('a &amp; b');
    expect(highlightText('', 'x')).toBe('');
  });
});

describe('highlightText invariants over the corpus', () => {
  const esc = (x) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  it('never loses or reorders characters, and marks are balanced', () => {
    const queries = ['basmalah', 'البسملة', 'shalat jumat', 'نجس', 'wudhu', 'الله', "mu'in"];
    for (const t of corpus.topics.slice(0, 400)) {
      for (const text of [t.titleId, t.ringkas, t.ibarah]) {
        for (const q of queries) {
          const html = highlightText(text, q);
          expect(html.replace(/<\/?mark>/g, '')).toBe(esc(text));
          expect((html.match(/<mark>/g) || []).length).toBe((html.match(/<\/mark>/g) || []).length);
        }
      }
    }
  });

  it('every marked span normalizes to text containing a query word', () => {
    const t = corpus.topics.find((x) => x.hlm === 70 && x.ibarah.includes('البسملة'));
    const html = highlightText(t.ibarah, 'بسملة');
    const spans = [...html.matchAll(/<mark>(.*?)<\/mark>/g)].map((m) => normalizeArabic(m[1]));
    expect(spans.length).toBeGreaterThan(0);
    spans.forEach((s) => expect(s).toContain('بسمله'));
  });
});

describe('ibarahSnippet', () => {
  it('centres on the match with ellipses at cut ends', () => {
    const text = 'أ '.repeat(200) + 'البسملة' + ' ب'.repeat(200);
    const s = ibarahSnippet(text, 'بسملة');
    expect(s).toContain('البسملة');
    expect(s.startsWith('…')).toBe(true);
    expect(s.endsWith('…')).toBe(true);
    expect(s.length).toBeLessThanOrEqual(182);
  });

  it('returns short text whole and falls back to the start when nothing matches', () => {
    expect(ibarahSnippet('قصير', 'بسملة')).toBe('قصير');
    const long = 'ج '.repeat(300);
    const s = ibarahSnippet(long, 'بسملة');
    expect(s.startsWith('…')).toBe(false);
    expect(s.endsWith('…')).toBe(true);
  });

  it('joins ibarah lines with spaces', () => {
    expect(ibarahSnippet('سطر أول\nسطر ثان', 'ثان')).toBe('سطر أول سطر ثان');
  });
});

describe('highlightQueryFor', () => {
  const topic = { titleAr: 'التسمية في الوضوء' };
  it('adds the Arabic title terms to a Latin query, skipping particles', () => {
    expect(highlightQueryFor(topic, 'basmalah wudhu')).toBe('basmalah wudhu التسمية الوضوء');
  });
  it('keeps an Arabic query as typed', () => {
    expect(highlightQueryFor(topic, 'بسملة')).toBe('بسملة');
  });
  it('returns an empty string for an empty query', () => {
    expect(highlightQueryFor(topic, '  ')).toBe('');
  });
});
