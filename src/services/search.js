/**
 * Universal Bilingual Search Engine
 * Simultaneous search across classical madrasah books in Turkish/Ottoman and Santri Indonesian.
 *
 * Zero emojis - 100% Bilingual
 */

import { booksData, booksMetadata } from '../data/books.js';

const ARABIC_UNICODE_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

/**
 * Remove HTML tags and entities cleanly.
 *
 * @param {string} text
 * @returns {string}
 */
export function stripHtml(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize Arabic / Ottoman text:
 * - Strips harakat / tashkeel ([\u064B-\u065F\u0670\u0640])
 * - Normalizes alifs: أ, إ, آ, ٱ -> ا
 * - Normalizes ta marbuta: ة, ۀ -> ه
 * - Normalizes ya / alif maqsura: ى, ی -> ي
 * - Normalizes Ottoman kaf: ک -> ك
 * - Normalizes waw with hamza: ؤ -> و
 * - Strips punctuation and excessive whitespace
 *
 * @param {string} text
 * @returns {string}
 */
export function normalizeArabic(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ةۀ]/g, 'ه')
    .replace(/[ىی]/g, 'ي')
    .replace(/ک/g, 'ك')
    .replace(/ؤ/g, 'و')
    .replace(/[ءـ]/g, '')
    .replace(/[،؛:!\?؟\(\)\[\]\{\}"'«»\/\.\\\-–—\^]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize Latin / Turkish / Indonesian text:
 * - Case folding with Turkish dotted/dotless I (İ -> i, I -> i, ı -> i)
 * - Lowercasing
 * - Normalizing circumflex and accented vowels (â -> a, î -> i, û -> u, etc.)
 * - Normalizing Turkish consonants (ç -> c, ğ -> g, ş -> s)
 * - Normalizing Indonesian transliteration variants (wudhu -> wudu, thaharah -> taharah)
 * - Removing punctuation, apostrophes, and collapsing whitespace
 *
 * @param {string} text
 * @returns {string}
 */
export function normalizeLatin(text) {
  if (!text || typeof text !== 'string') return '';
  let str = text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .toLowerCase()
    .replace(/[âäàáãā]/g, 'a')
    .replace(/[îïìíī]/g, 'i')
    .replace(/[ûüùúū]/g, 'u')
    .replace(/[ôöòóō]/g, 'o')
    .replace(/[êëèéē]/g, 'e')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ş/g, 's')
    .replace(/['’‘`\-]/g, '');

  str = str.replace(/dh/g, 'd');
  str = str.replace(/th/g, 't');
  str = str.replace(/dz/g, 'z');

  return str
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize text based on whether it contains Arabic script or Latin script.
 *
 * @param {string} text
 * @returns {string}
 */
export function normalizeText(text) {
  if (!text) return '';
  return ARABIC_UNICODE_REGEX.test(text) ? normalizeArabic(text) : normalizeLatin(text);
}

/**
 * Detect if text contains Arabic/Ottoman characters.
 *
 * @param {string} text
 * @returns {boolean}
 */
export function isArabicText(text) {
  return ARABIC_UNICODE_REGEX.test(text || '');
}

/**
 * Generate a clean excerpt showing the matched context without HTML tags.
 *
 * @param {string} rawText
 * @param {string} query
 * @param {number} maxLen
 * @returns {string}
 */
export function createSnippet(rawText, query, maxLen = 110) {
  const clean = stripHtml(rawText);
  if (!clean) return '';
  if (clean.length <= maxLen) return clean;

  const isAr = isArabicText(query);
  const normClean = isAr ? normalizeArabic(clean) : normalizeLatin(clean);
  const normQ = isAr ? normalizeArabic(query) : normalizeLatin(query);

  let matchIdx = -1;

  if (normQ) {
    const idx = normClean.indexOf(normQ);
    if (idx !== -1) {
      matchIdx = idx;
    }
  }

  if (matchIdx === -1 && normQ) {
    const tokens = normQ.split(' ').filter(w => w.length > 2);
    for (const t of tokens) {
      const idx = normClean.indexOf(t);
      if (idx !== -1) {
        matchIdx = idx;
        break;
      }
    }
  }

  if (matchIdx === -1) {
    return clean.slice(0, maxLen - 3).trim() + '...';
  }

  const approxStart = Math.max(0, matchIdx - 25);
  const approxEnd = Math.min(clean.length, approxStart + maxLen);
  let snippet = clean.slice(approxStart, approxEnd).trim();
  if (approxStart > 0) snippet = '...' + snippet;
  if (approxEnd < clean.length) snippet = snippet + '...';
  return snippet;
}

/**
 * Calculate match score for a single field against a query.
 *
 * @param {string} fieldRaw
 * @param {boolean} isArQuery
 * @param {string} normQ
 * @param {string[]} tokens
 * @returns {{ score: number, matchedWords: number, snippetSource: string }}
 */
function scoreField(fieldRaw, isArQuery, normQ, tokens) {
  const stripped = stripHtml(fieldRaw);
  if (!stripped) return { score: 0, matchedWords: 0, snippetSource: '' };

  const normField = isArQuery ? normalizeArabic(stripped) : normalizeLatin(stripped);
  if (!normField) return { score: 0, matchedWords: 0, snippetSource: stripped };

  let score = 0;
  let matchedWords = 0;

  // Exact full phrase match
  if (normQ && normField.includes(normQ)) {
    score += 60;
  }

  // Consecutive token subphrase matches (2+ tokens)
  if (tokens.length > 1) {
    for (let i = 0; i < tokens.length - 1; i++) {
      const pair = tokens[i] + ' ' + tokens[i + 1];
      if (normField.includes(pair)) {
        score += 35;
      }
    }
  }

  // Individual token matches
  for (const t of tokens) {
    const wholeWordRegex = new RegExp('\\b' + t + '\\b');
    if (wholeWordRegex.test(normField)) {
      matchedWords++;
      score += 15;
    } else if (normField.includes(t)) {
      matchedWords += 0.5;
      score += 5;
    }
  }

  if (score > 0) {
    const coverage = tokens.length > 0 ? (matchedWords / tokens.length) : 1;
    score = score * (0.6 + 0.4 * coverage) + (5 / Math.sqrt(Math.max(10, stripped.length)));
  }

  return { score, matchedWords, snippetSource: stripped };
}

/**
 * Score a single item across all fields and languages.
 *
 * @param {object} item - SoruCevapItem
 * @param {string} query - raw search query
 * @returns {object|null}
 */
function evaluateItem(item, query) {
  const isAr = isArabicText(query);
  const normQ = isAr ? normalizeArabic(query) : normalizeLatin(query);
  const tokens = normQ ? normQ.split(' ').filter(Boolean) : [];
  if (!normQ || tokens.length === 0) return null;

  // Question fields
  const qTr = scoreField(item.question_tr, isAr, normQ, tokens);
  const qId = scoreField(item.question_id, isAr, normQ, tokens);

  // Answer fields
  const aTr = scoreField(item.answer_tr, isAr, normQ, tokens);
  const aId = scoreField(item.answer_id, isAr, normQ, tokens);

  // Chapter fields
  const cTr = scoreField(item.chapterNameTr, isAr, normQ, tokens);
  const cId = scoreField(item.chapterNameId + ' ' + (item.chapterId || ''), isAr, normQ, tokens);

  // Keywords and Cloze metadata
  const kwText = (item.keywords || []).join(' ') + ' ' + (item.clozeKeyWord_tr || '') + ' ' + (item.clozeKeyWord_id || '');
  const kw = scoreField(kwText, isAr, normQ, tokens);

  // Field importance multipliers: question > answer > chapter > keywords
  const qScoreTr = qTr.score * 1.5;
  const qScoreId = qId.score * 1.5;
  const aScoreTr = aTr.score * 1.0;
  const aScoreId = aId.score * 1.0;
  const cScoreTr = cTr.score * 0.8;
  const cScoreId = cId.score * 0.8;
  const kwScore = kw.score * 0.5;

  const trTotal = qScoreTr + aScoreTr + cScoreTr + (isAr ? kwScore : 0);
  const idTotal = qScoreId + aScoreId + cScoreId + (!isAr ? kwScore : 0);
  const totalScore = trTotal + idTotal;

  if (totalScore <= 0) return null;

  // Determine matchedLanguage ('tr' | 'id' | 'both')
  let matchedLanguage = 'both';
  if (trTotal > 0 && idTotal === 0) {
    matchedLanguage = 'tr';
  } else if (idTotal > 0 && trTotal === 0) {
    matchedLanguage = 'id';
  } else if (trTotal > 0 && idTotal > 0) {
    if (trTotal >= idTotal * 2) matchedLanguage = 'tr';
    else if (idTotal >= trTotal * 2) matchedLanguage = 'id';
    else matchedLanguage = 'both';
  }

  // Determine matchField ('question' | 'answer' | 'chapter' | 'keywords') and snippet source
  let matchField = 'question';
  let snippetRaw = '';

  const maxQuestionScore = Math.max(qScoreTr, qScoreId);
  const maxAnswerScore = Math.max(aScoreTr, aScoreId);
  const maxChapterScore = Math.max(cScoreTr, cScoreId);

  if (maxQuestionScore > 0 && maxQuestionScore >= maxAnswerScore && maxQuestionScore >= maxChapterScore) {
    matchField = 'question';
    snippetRaw = qScoreId >= qScoreTr ? item.question_id : item.question_tr;
  } else if (maxAnswerScore > 0 && maxAnswerScore >= maxChapterScore) {
    matchField = 'answer';
    snippetRaw = aScoreId >= aScoreTr ? item.answer_id : item.answer_tr;
  } else if (maxChapterScore > 0) {
    matchField = 'chapter';
    snippetRaw = cScoreId >= cScoreTr ? item.chapterNameId : item.chapterNameTr;
  } else {
    matchField = 'keywords';
    snippetRaw = kw.snippetSource;
  }

  const matchSnippet = createSnippet(snippetRaw, query);

  return {
    item,
    matchedLanguage,
    matchField,
    matchSnippet,
    score: totalScore
  };
}

/**
 * Universal bilingual search across all 5 books simultaneously.
 *
 * @param {string} query - search query in Turkish, Ottoman, Arabic, or Indonesian
 * @param {number} [maxResults=50] - maximum number of results to return
 * @returns {Array<{ item: object, matchedLanguage: 'tr'|'id'|'both', matchField: 'question'|'answer'|'chapter'|'keywords', matchSnippet: string, score: number }>}
 */
export function searchAllBooks(query, maxResults = 50) {
  if (!query || typeof query !== 'string' || !query.trim() || maxResults <= 0) {
    return [];
  }

  const results = [];
  for (const items of Object.values(booksData)) {
    for (const item of items) {
      const res = evaluateItem(item, query);
      if (res) {
        results.push(res);
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

/**
 * Search within a specific book.
 *
 * @param {string} bookKey - key of the book (quduri, talhis, kafiye, menar, akaid)
 * @param {string} query - search query
 * @param {number} [maxResults=50] - maximum number of results
 * @returns {Array<{ item: object, matchedLanguage: 'tr'|'id'|'both', matchField: 'question'|'answer'|'chapter'|'keywords', matchSnippet: string, score: number }>}
 */
export function searchBook(bookKey, query, maxResults = 50) {
  if (!bookKey || !booksData[bookKey] || !query || typeof query !== 'string' || !query.trim() || maxResults <= 0) {
    return [];
  }

  const items = booksData[bookKey];
  const results = [];
  for (const item of items) {
    const res = evaluateItem(item, query);
    if (res) {
      results.push(res);
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}
