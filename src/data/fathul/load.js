/**
 * Lazy loader for Fathul Mu'in.
 * The corpus (~3 MB raw) and questions stay out of the initial bundle; they are
 * fetched the first time the book is opened, then registered in booksData so the
 * existing study, exam and reader views can use them.
 */

import { booksData } from '../books.js';
import { buildFathulIndex } from '../../services/fathulSearch.js';

let promise = null;
let loaded = false;

/**
 * @returns {Promise<{ corpus: object, questions: object[], index: object[] }>}
 */
export function loadFathul() {
  if (!promise) {
    promise = Promise.all([import('./corpus.json'), import('./questions.json')])
      .then(([corpusMod, questionsMod]) => {
        const corpus = corpusMod.default;
        const questions = questionsMod.default;
        booksData.fathul = questions;
        loaded = true;
        return { corpus, questions, index: buildFathulIndex(corpus.topics) };
      })
      .catch((err) => {
        promise = null; // allow a retry after a network failure
        throw err;
      });
  }
  return promise;
}

/** @returns {boolean} */
export function isFathulLoaded() {
  return loaded;
}
