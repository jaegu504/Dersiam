import { describe, it, expect } from 'vitest';
import corpus from '../src/data/fathul/corpus.json';
import { fathulMeta } from '../src/data/fathul/meta.js';

describe("Fathul Mu'in corpus export", () => {
  it('exports all topics, pages, chapters', () => {
    expect(corpus.topics).toHaveLength(1698);
    expect(Object.keys(corpus.pages)).toHaveLength(673);
    expect(corpus.chapters).toHaveLength(14);
    expect(fathulMeta.totalTopics).toBe(1698);
    expect(fathulMeta.totalPages).toBe(673);
    expect(fathulMeta.totalChapters).toBe(14);
  });

  it('splits matan and syarah; pages without separator have no matan', () => {
    expect(corpus.pages['70'].matn[0]).toBe('مع بسملة وتشديدات ورعاية حروف ومخارجها');
    expect(corpus.pages['70'].syarah.join('\n')).not.toContain('ــ');
    for (const h of ['372', '424', '426', '513', '514', '550', '569']) {
      expect(corpus.pages[h].matn).toEqual([]);
      expect(corpus.pages[h].syarah.length).toBeGreaterThan(0);
    }
  });

  it('keeps footnotes apart from the syarah', () => {
    expect(corpus.pages['2'].footnotes.length).toBeGreaterThan(0);
    expect(corpus.pages['2'].syarah.join('\n')).not.toContain('_____');
    expect(corpus.pages['2'].footnotes.join('\n')).not.toContain('_____');
  });

  it('anchors the basmalah topic to its paragraph on hlm 70', () => {
    const t = corpus.topics.find((x) => x.titleId === 'Basmalah dan tasydid dalam Fatihah');
    expect(t.hlm).toBe(70);
    expect(t.cetak).toBe(99);
    expect(t.anchor.hlm).toBe(70);
    expect(corpus.pages['70'].syarah[t.anchor.para]).toContain('مع قراءة البسملة');
  });

  it('every topic has hlm, ringkas, ibarah, keywords and a valid chapter and fasal', () => {
    const chapterIds = new Set(corpus.chapters.map((c) => c.id));
    const fasalIds = new Set(corpus.chapters.flatMap((c) => c.fasals.map((f) => f.id)));
    for (const t of corpus.topics) {
      expect(chapterIds.has(t.chapterId)).toBe(true);
      expect(fasalIds.has(t.fasalId)).toBe(true);
      expect(t.titleId).toBeTruthy();
      expect(t.titleAr).toBeTruthy();
      expect(t.ringkas).toBeTruthy();
      expect(t.ibarah).toBeTruthy();
      expect(Array.isArray(t.keywords)).toBe(true);
      expect(corpus.pages[t.hlm]).toBeDefined();
    }
  });

  it('anchors all but the two duplicated niat topics (see scripts/fathul/report.txt)', () => {
    const unanchored = corpus.topics.filter((t) => !t.anchor).map((t) => t.id);
    expect(unanchored).toEqual(['fm-0169', 'fm-0171']);
  });

  it('keeps footnotes and the matan separator out of topic ibarah', () => {
    for (const t of corpus.topics) {
      expect(t.ibarah).not.toMatch(/_{5,}/);
      expect(t.ibarah.split('\n')).not.toContain('ــ');
    }
  });

  it('chapter fasals list every topic exactly once, in corpus order', () => {
    const listed = corpus.chapters.flatMap((c) => c.fasals.flatMap((f) => f.topicIds));
    expect(listed).toEqual(corpus.topics.map((t) => t.id));
  });

  it('chapters carry Indonesian and Arabic names', () => {
    for (const c of corpus.chapters) {
      expect(c.nameId).toBeTruthy();
      expect(c.nameAr).toBeTruthy();
    }
    expect(corpus.chapters[1].nameId).toBe('Shalat');
  });
});
