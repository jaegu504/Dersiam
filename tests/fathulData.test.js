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

describe("Fathul Mu'in question items", async () => {
  const { default: questions } = await import('../src/data/fathul/questions.json');

  it('builds valid Dersiam items from authored questions', () => {
    expect(questions.length).toBeGreaterThanOrEqual(30);
    for (const q of questions) {
      expect(q.bookKey).toBe('fathul');
      expect(q.question_id).toMatch(/\?$/);
      expect(q.question_tr).toBe(q.question_id);
      expect(q.answer_tr).toBe(q.answer_id);
      expect(q.answer_id).toContain(`hlm ${q.hlm}`);
      expect(q.answer_id).toContain(q.clozeKeyWord_id);
      expect(q.chapterNameTr).toBeTruthy();
      expect(q.chapterNameId).toBeTruthy();
      expect(q.clozeKeyWord_id).not.toMatch(/[،؛؟.,:!()]/);
      expect(['من', 'الى', 'إلى', 'على', 'في', 'عن', 'بعد', 'قبل', 'مع', 'ثم', 'مرة', 'كان', 'قال']).not.toContain(q.clozeKeyWord_id);
    }
    expect(new Set(questions.map((q) => q.topicId)).size).toBe(questions.length);
  });

  it('the cloze word only ever occurs as a whole word in its answer', () => {
    const letter = /[\u0621-\u064A\u064B-\u065F\u0670\u0671-\u06D3]/;
    for (const q of questions) {
      const w = q.clozeKeyWord_id;
      let at = q.answer_id.indexOf(w);
      expect(at, q.id).toBeGreaterThanOrEqual(0);
      while (at !== -1) {
        const before = q.answer_id[at - 1] || ' ';
        const after = q.answer_id[at + w.length] || ' ';
        expect(letter.test(before) || letter.test(after), `${q.id} ${w}`).toBe(false);
        at = q.answer_id.indexOf(w, at + w.length);
      }
    }
  });

  it('answers carry the topic ringkas and ibarah of the same topic', () => {
    const byId = Object.fromEntries(corpus.topics.map((t) => [t.id, t]));
    for (const q of questions) {
      const t = byId[q.topicId];
      expect(q.hlm).toBe(t.hlm);
      expect(q.answer_id.startsWith(t.ringkas)).toBe(true);
      expect(q.answer_id).toContain(t.ibarah.split('\n')[0]);
    }
  });
});

describe('question integrity guard', async () => {
  const { execFileSync } = await import('node:child_process');
  const { mkdtempSync, writeFileSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { default: questions } = await import('../src/data/fathul/questions.json');
  const { default: sample } = await import('../scripts/fathul/questions/sample.json');

  it('question ids are stable hashes, unique, independent of topic position', () => {
    for (const q of questions) expect(q.id).toMatch(/^fathul-[0-9a-f]{10}$/);
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
  });

  it('authored rows record the hlm and Arabic title of their topic', () => {
    const byId = Object.fromEntries(corpus.topics.map((t) => [t.id, t]));
    for (const row of sample) {
      expect(row.hlm).toBe(byId[row.topicId].hlm);
      expect(row.titleAr).toBe(byId[row.topicId].titleAr);
    }
  });

  it('the exporter refuses a question whose topic no longer matches, and writes nothing', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fathul-q-'));
    const bad = [{ ...sample[0], hlm: sample[0].hlm + 1 }];
    writeFileSync(join(dir, 'bad.json'), JSON.stringify(bad));
    let err;
    try {
      execFileSync('python3', ['-I', 'scripts/build_fathul_data.py', '--source', '/Users/sp/Documents/Fathul Muin', '--questions', '--questions-dir', dir, '--dry-run'], { stdio: 'pipe' });
    } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(String(err.stderr)).toContain('no longer matches');
  });
});
