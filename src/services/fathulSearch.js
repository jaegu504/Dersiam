/**
 * Fathul Mu'in topic search.
 * Searches the 1,698 mapped topics (title, keywords, ringkas, ibarah) and
 * highlights matches in the original text, harakat included.
 *
 * Zero emojis - Indonesian + Arabic content
 */

import { normalizeArabic, normalizeLatin, isArabicText } from './search.js';

const FIELD_WEIGHTS = { title: 8, keywords: 5, ringkas: 3, ibarah: 2 };
const MIN_TOKEN = 2;

const HARAKAT = /[ً-ٰٟـ]/;
const ARABIC_KEEP = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿0-9٠-٩۰-۹]/;
const ARABIC_PUNCT = /[،؛؟٪٫٬«».,:;!'"()[\]{}/\\<>\-_+=*&^%$#@~`|]/;
const ARABIC_FOLD = { 'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ة': 'ه', 'ۀ': 'ه', 'ى': 'ي', 'ی': 'ي', 'ک': 'ك', 'ؤ': 'و' };
const LATIN_FOLD = {
  'â': 'a', 'ä': 'a', 'à': 'a', 'á': 'a', 'ã': 'a', 'ā': 'a',
  'î': 'i', 'ï': 'i', 'ì': 'i', 'í': 'i', 'ī': 'i',
  'û': 'u', 'ü': 'u', 'ù': 'u', 'ú': 'u', 'ū': 'u',
  'ô': 'o', 'ö': 'o', 'ò': 'o', 'ó': 'o', 'ō': 'o',
  'ê': 'e', 'ë': 'e', 'è': 'e', 'é': 'e', 'ē': 'e',
  'ç': 'c', 'ğ': 'g', 'ş': 's'
};
const LATIN_DROP = /['’‘`-]/;

/**
 * Normalize like normalizeArabic / normalizeLatin, keeping for every output
 * character the index of the original character it came from.
 *
 * @param {string} text
 * @param {'ar'|'lat'} script
 * @returns {{ norm: string, map: number[] }}
 */
export function normalizeWithMap(text, script) {
  const chars = [];
  const src = typeof text === 'string' ? text : '';

  if (script === 'ar') {
    for (let i = 0; i < src.length; i++) {
      let c = src[i];
      if (HARAKAT.test(c) || c === 'ء') continue;
      c = ARABIC_FOLD[c] || c;
      if (ARABIC_PUNCT.test(c) || !(ARABIC_KEEP.test(c) || /\s/.test(c))) c = ' ';
      chars.push([c, i]);
    }
  } else {
    let seq = [];
    for (let i = 0; i < src.length; i++) {
      let c = src[i];
      if (c === 'İ' || c === 'I' || c === 'ı') c = 'i';
      for (let ch of c.toLowerCase()) {
        ch = LATIN_FOLD[ch] || ch;
        if (LATIN_DROP.test(ch)) continue;
        seq.push([ch, i]);
      }
    }
    // dh -> d, th -> t, dz -> z, applied in that order like normalizeLatin
    for (const [a, b, out] of [['d', 'h', 'd'], ['t', 'h', 't'], ['d', 'z', 'z']]) {
      const next = [];
      for (let k = 0; k < seq.length; k++) {
        if (seq[k][0] === a && seq[k + 1]?.[0] === b) {
          next.push([out, seq[k][1]]);
          k++;
        } else {
          next.push(seq[k]);
        }
      }
      seq = next;
    }
    for (const [ch, i] of seq) chars.push([/[a-z0-9]/.test(ch) || /\s/.test(ch) ? ch : ' ', i]);
  }

  let norm = '';
  const map = [];
  for (const [c, i] of chars) {
    if (/\s/.test(c)) {
      if (norm === '' || norm.endsWith(' ')) continue;
      norm += ' ';
    } else {
      norm += c;
    }
    map.push(i);
  }
  if (norm.endsWith(' ')) {
    norm = norm.slice(0, -1);
    map.pop();
  }
  return { norm, map };
}

/**
 * Split a query into normalized tokens, each tagged with its script.
 *
 * @param {string} query
 * @returns {Array<{ script: 'ar'|'lat', text: string }>}
 */
function queryTokens(query) {
  if (!query || typeof query !== 'string') return [];
  const seen = new Set();
  const out = [];
  for (const raw of query.split(/\s+/)) {
    if (!raw) continue;
    const script = isArabicText(raw) ? 'ar' : 'lat';
    const norm = script === 'ar' ? normalizeArabic(raw) : normalizeLatin(raw);
    for (const text of norm.split(' ')) {
      const key = `${script}:${text}`;
      if (text.length >= MIN_TOKEN && !seen.has(key)) {
        seen.add(key);
        out.push({ script, text });
      }
    }
  }
  return out;
}

/**
 * Precompute normalized fields for every topic.
 *
 * @param {object[]} topics - corpus.topics
 * @returns {Array<{ topic: object, fields: object }>}
 */
export function buildFathulIndex(topics = []) {
  return topics.map((topic) => {
    const keywords = (topic.keywords || []).join(' ');
    return {
      topic,
      fields: {
        title: { lat: normalizeLatin(topic.titleId), ar: normalizeArabic(topic.titleAr) },
        keywords: { lat: normalizeLatin(keywords), ar: normalizeArabic(keywords) },
        ringkas: { lat: normalizeLatin(topic.ringkas), ar: normalizeArabic(topic.ringkas) },
        ibarah: { lat: '', ar: normalizeArabic(topic.ibarah) }
      }
    };
  });
}

/**
 * Search topics. Every query word must match at least one field.
 *
 * @param {ReturnType<typeof buildFathulIndex>} index
 * @param {string} query - Indonesian or Arabic, with or without harakat
 * @param {number} [maxResults=50]
 * @returns {Array<{ topic: object, score: number }>}
 */
export function searchFathul(index, query, maxResults = 50) {
  const tokens = queryTokens(query);
  if (!tokens.length || !index || maxResults <= 0) return [];

  const results = [];
  for (const entry of index) {
    let score = 0;
    let allMatched = true;
    for (const tok of tokens) {
      let tokScore = 0;
      for (const [name, weight] of Object.entries(FIELD_WEIGHTS)) {
        const field = entry.fields[name][tok.script];
        if (!field) continue;
        const at = field.indexOf(tok.text);
        if (at === -1) continue;
        tokScore += weight;
        if (at === 0 || field[at - 1] === ' ') tokScore += 1;
      }
      if (!tokScore) {
        allMatched = false;
        break;
      }
      score += tokScore;
    }
    if (allMatched) results.push({ topic: entry.topic, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Original-text ranges [start, end) of every query token occurrence. */
function matchRanges(text, query) {
  const tokens = queryTokens(query);
  const ranges = [];
  const cache = {};
  for (const tok of tokens) {
    cache[tok.script] ||= normalizeWithMap(text, tok.script);
    const { norm, map } = cache[tok.script];
    let from = 0;
    let at;
    while ((at = norm.indexOf(tok.text, from)) !== -1) {
      const start = map[at];
      let end = map[at + tok.text.length - 1] + 1;
      // the normalizer drops harakat, tatweel and hamza; keep them inside the mark
      while (end < text.length && (HARAKAT.test(text[end]) || text[end] === 'ء')) end++;
      ranges.push([start, end]);
      from = at + tok.text.length;
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([...r]);
  }
  return merged;
}

/**
 * HTML-escape text and wrap every match of the query in <mark>.
 *
 * @param {string} text
 * @param {string} query
 * @returns {string}
 */
export function highlightText(text, query) {
  if (!text) return '';
  let out = '';
  let pos = 0;
  for (const [start, end] of matchRanges(text, query)) {
    out += escapeHtml(text.slice(pos, start)) + '<mark>' + escapeHtml(text.slice(start, end)) + '</mark>';
    pos = end;
  }
  return out + escapeHtml(text.slice(pos));
}

/**
 * Plain-text window of the ibarah around the first match.
 *
 * @param {string} text
 * @param {string} query
 * @param {number} [maxLen=180]
 * @returns {string}
 */
export function ibarahSnippet(text, query, maxLen = 180) {
  const flat = (text || '').replace(/\s*\n\s*/g, ' ').trim();
  if (flat.length <= maxLen) return flat;

  const first = matchRanges(flat, query)[0];
  let start = 0;
  if (first) {
    start = Math.max(0, first[0] - Math.floor(maxLen / 2));
    if (start + maxLen > flat.length) start = Math.max(0, flat.length - maxLen);
  }
  let end = Math.min(flat.length, start + maxLen);

  // cut on word boundaries without losing the match
  if (start > 0) {
    const sp = flat.indexOf(' ', start);
    if (sp !== -1 && (!first || sp < first[0])) start = sp + 1;
  }
  if (end < flat.length) {
    const sp = flat.lastIndexOf(' ', end);
    if (sp > start && (!first || sp >= first[1])) end = sp;
  }
  return (start > 0 ? '…' : '') + flat.slice(start, end).trim() + (end < flat.length ? '…' : '');
}

const TITLE_STOPWORDS = new Set(['علي', 'الي', 'التي', 'الذي', 'غير', 'بين', 'عند', 'بعد', 'قبل'].map((w) => normalizeArabic(w)));

/**
 * Words to highlight for one topic. A Latin (Indonesian) query never occurs in
 * the Arabic text, so the topic's Arabic title terms are added to it.
 *
 * @param {{ titleAr: string }} topic
 * @param {string} query
 * @returns {string}
 */
export function highlightQueryFor(topic, query) {
  const q = (query || '').trim();
  if (!q || isArabicText(q)) return q;
  const terms = (topic?.titleAr || '')
    .split(/\s+/)
    .filter((w) => {
      const n = normalizeArabic(w);
      return n.length >= 3 && !n.includes(' ') && !TITLE_STOPWORDS.has(n);
    });
  return [q, ...terms].join(' ');
}
