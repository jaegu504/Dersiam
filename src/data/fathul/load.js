/**
 * Lazy loader for Fathul Mu'in.
 * The corpus (~3 MB raw) and questions stay out of the initial bundle; they are
 * fetched the first time the book is opened, then registered in booksData so the
 * existing study, exam and reader views can use them.
 */

import { booksData } from '../books.js';
import { buildFathulIndex } from '../../services/fathulSearch.js';
import { dictionary } from '../dictionary.js';

let promise = null;
let loaded = false;
let data = null;

/**
 * @returns {Promise<{ corpus: object, questions: object[], index: object[] }>}
 */
export function loadFathul() {
  if (!promise) {
    promise = Promise.all([import('./corpus.json'), import('./questions.json'), import('./ragu.json')])
      .then(([corpusMod, questionsMod, raguMod]) => {
        const corpus = corpusMod.default;
        const questions = questionsMod.default;
        const ragu = raguMod.default;
        for (const t of corpus.topics) t.ragu = isRaguTopic(t, ragu);
        applyRaguNotes(questions, corpus.topics, ragu);
        booksData.fathul = questions;
        loaded = true;
        data = { corpus, questions, ragu, index: buildFathulIndex(corpus.topics) };
        return data;
      })
      .catch((err) => {
        promise = null; // allow a retry after a network failure
        throw err;
      });
  }
  return promise;
}

/** @returns {{ corpus: object, questions: object[], index: object[] } | null} data once loaded */
export function getFathulData() {
  return data;
}

/** @returns {boolean} */
export function isFathulLoaded() {
  return loaded;
}

let translationPromise = null;

/** Indonesian translation lines keyed by hlm; a separate chunk loaded only when the reader turns it on. */
export function loadFathulTranslation() {
  translationPromise ??= import('./translation-id.json')
    .then((m) => m.default)
    .catch((err) => { translationPromise = null; throw err; });
  return translationPromise;
}

/** True when the syarah line a topic quotes was marked RAGU (uncertain reading) by the meaning check. */
export function isRaguTopic(topic, ragu) {
  const a = topic.anchor;
  return Boolean(a && ragu[String(a.hlm)]?.syarah?.includes(a.para));
}

/** Appends a "check the original kitab" note to answers whose topic quotes an uncertain line. Safe to call twice. */
export function applyRaguNotes(questions, topics, ragu) {
  const byId = new Map(topics.map((t) => [t.id, t]));
  for (const q of questions) {
    const t = byId.get(q.topicId);
    if (!t || !isRaguTopic(t, ragu)) continue;
    for (const lang of ['id', 'tr']) {
      const key = `answer_${lang}`;
      const note = dictionary[lang].fathulRaguNote;
      if (q[key] && !q[key].includes(note)) q[key] += `<br><span class="fathul-ragu-note">${note} (hlm ${t.anchor.hlm}).</span>`;
    }
  }
}
