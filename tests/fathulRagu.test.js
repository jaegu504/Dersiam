import { describe, it, expect } from 'vitest';
import { applyRaguNotes, isRaguTopic } from '../src/data/fathul/load.js';
import { dictionary } from '../src/data/dictionary.js';

const topics = [
  { id: 'fm-0029', hlm: 13, anchor: { hlm: 13, para: 4 } },
  { id: 'fm-0193', hlm: 70, anchor: { hlm: 70, para: 2 } },
  { id: 'fm-x', hlm: 5, anchor: null },
];
const ragu = { 13: { syarah: [4] } };

describe('RAGU notes for Fathul answers', () => {
  it('a topic is uncertain only when its anchor line is in the RAGU list', () => {
    expect(isRaguTopic(topics[0], ragu)).toBe(true);
    expect(isRaguTopic(topics[1], ragu)).toBe(false);
    expect(isRaguTopic(topics[2], ragu)).toBe(false);
  });

  it('adds the note to both answer languages of questions tied to an uncertain topic, once', () => {
    const qs = [
      { topicId: 'fm-0029', answer_id: 'Jawab', answer_tr: 'Cevap' },
      { topicId: 'fm-0193', answer_id: 'Jawab', answer_tr: 'Cevap' },
    ];
    applyRaguNotes(qs, topics, ragu);
    applyRaguNotes(qs, topics, ragu);
    expect(qs[0].answer_id).toContain(dictionary.id.fathulRaguNote);
    expect(qs[0].answer_tr).toContain(dictionary.tr.fathulRaguNote);
    expect(qs[0].answer_id.split(dictionary.id.fathulRaguNote)).toHaveLength(2);
    expect(qs[0].answer_id).toContain('hlm 13');
    expect(qs[1].answer_id).toBe('Jawab');
  });
});
