import { describe, it, expect } from 'vitest';
import {
  searchAllBooks,
  searchBook,
  normalizeArabic,
  normalizeLatin,
  stripHtml
} from '../src/services/search.js';

describe('Universal Bilingual Search Engine', () => {
  describe('String Normalization Utilities', () => {
    it('strips HTML tags cleanly from text', () => {
      const html = "<span lang='ar' dir='rtl'>مَعْرِفَةُ</span><br>Artinya: Mengetahui.";
      const stripped = stripHtml(html);
      expect(stripped).not.toContain('<span');
      expect(stripped).not.toContain('<br>');
      expect(stripped).toContain('مَعْرِفَةُ');
      expect(stripped).toContain('Artinya: Mengetahui.');
    });

    it('normalizes Arabic and Ottoman text with harakat, alif, ta marbuta, and ya', () => {
      // Stripping harakat / tashkeel
      expect(normalizeArabic('مَعْرِفَةُ النَّفْسِ')).toBe('معرفه النفس');
      // Alif normalization: أ, إ, آ, ٱ -> ا
      expect(normalizeArabic('أَفْعَالُ الإِنْسَانِ آيَاتٌ')).toBe('افعال الانسان ايات');
      // Ta marbuta normalization: ة -> ه
      expect(normalizeArabic('مقدمة')).toBe('مقدمه');
      // Ya / alif maqsura: ى -> ي
      expect(normalizeArabic('معنى')).toBe('معني');
    });

    it('normalizes Latin, Turkish, and Indonesian text', () => {
      // Turkish dotted and dotless I case folding
      expect(normalizeLatin('İSİM')).toBe('isim');
      expect(normalizeLatin('Işık')).toBe('isik');
      // Circumflex vowel normalization
      expect(normalizeLatin('Muhtasarü\'l-Kudûrî')).toBe('muhtasarulkuduri');
      expect(normalizeLatin('Kâfiye')).toBe('kafiye');
      // Common Indonesian transliterations
      expect(normalizeLatin('wudhu')).toBe('wudu');
      expect(normalizeLatin('thaharah')).toBe('taharah');
    });
  });

  describe('Core Search Capabilities', () => {
    it('finds items when searching in Indonesian keywords', () => {
      const results = searchAllBooks('hukum syariat praktis');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.bookKey).toBe('quduri');
      expect(results[0].matchedLanguage).toBe('id');
      expect(results[0].matchSnippet).toBeTruthy();
    });

    it('finds items when searching in Ottoman/Arabic keywords', () => {
      const results = searchAllBooks('فقه علمندن');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.bookKey).toBe('quduri');
      expect(results[0].matchedLanguage).toBe('tr');
      expect(results[0].matchSnippet).toBeTruthy();
    });

    it('finds items when searching with Arabic harakat identical to unvowelled', () => {
      const vowelled = searchAllBooks('مَعْرِفَةُ');
      const unvowelled = searchAllBooks('معرفة');
      expect(vowelled.length).toBeGreaterThan(0);
      expect(unvowelled.length).toBeGreaterThan(0);
      expect(vowelled[0].item.id).toBe(unvowelled[0].item.id);
    });

    it('matches across all 6 books simultaneously and returns snippets', () => {
      const results = searchAllBooks('Mukaddime');
      expect(results.length).toBeGreaterThan(1);
      const bookKeys = new Set(results.map(r => r.item.bookKey));
      expect(bookKeys.size).toBeGreaterThan(1);
      results.forEach(r => {
        expect(r.matchSnippet).toBeTruthy();
        expect(r.matchSnippet).not.toContain('<span');
        expect(r.matchSnippet).not.toContain('<br>');
      });
    });

    it('finds specific book domains accurately', () => {
      // Quduri fikih questions
      const quduriTaharah = searchAllBooks('taharah');
      expect(quduriTaharah.length).toBeGreaterThan(0);
      expect(quduriTaharah.some(r => r.item.bookKey === 'quduri')).toBe(true);

      const quduriWudhu = searchAllBooks('wudhu');
      expect(quduriWudhu.length).toBeGreaterThan(0);
      expect(quduriWudhu.some(r => r.item.bookKey === 'quduri')).toBe(true);

      const quduriOttoman = searchAllBooks('طهارت');
      expect(quduriOttoman.length).toBeGreaterThan(0);
      expect(quduriOttoman.some(r => r.item.bookKey === 'quduri')).toBe(true);

      // Talkhis balaghah questions
      const talkhisResults = searchAllBooks('Talkhis');
      expect(talkhisResults.length).toBeGreaterThan(0);
      expect(talkhisResults.some(r => r.item.bookKey === 'talhis')).toBe(true);

      const tafilResults = searchAllBooks("Taf'il");
      expect(tafilResults.length).toBeGreaterThan(0);
      expect(tafilResults.some(r => r.item.bookKey === 'talhis')).toBe(true);

      // Kafiye nahwu questions
      const nahwuResults = searchAllBooks('Nahwu');
      expect(nahwuResults.length).toBeGreaterThan(0);
      expect(nahwuResults.some(r => r.item.bookKey === 'kafiye')).toBe(true);

      const isimResults = searchAllBooks('isim');
      expect(isimResults.length).toBeGreaterThan(0);
      expect(isimResults.some(r => r.item.bookKey === 'kafiye')).toBe(true);

      const alismResults = searchAllBooks('الاسم');
      expect(alismResults.length).toBeGreaterThan(0);
      expect(alismResults.some(r => r.item.bookKey === 'kafiye')).toBe(true);
    });

    it('orders results by relevance score descending', () => {
      const results = searchAllBooks('hukum');
      expect(results.length).toBeGreaterThan(1);
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
      }
    });

    it('populates valid SearchResultItem fields with correct types', () => {
      const results = searchAllBooks('definisi');
      expect(results.length).toBeGreaterThan(0);
      const top = results[0];
      expect(top.item).toBeDefined();
      expect(top.item.id).toBeTruthy();
      expect(['tr', 'id', 'both']).toContain(top.matchedLanguage);
      expect(['question', 'answer', 'chapter', 'keywords']).toContain(top.matchField);
      expect(typeof top.matchSnippet).toBe('string');
      expect(top.matchSnippet.length).toBeGreaterThan(0);
      expect(typeof top.score).toBe('number');
      expect(top.score).toBeGreaterThan(0);
    });

    it('supports searching within a specific book via searchBook', () => {
      const results = searchBook('quduri', 'wudhu');
      expect(results.length).toBeGreaterThan(0);
      results.forEach(r => {
        expect(r.item.bookKey).toBe('quduri');
      });

      const nonexistent = searchBook('nonexistent_book', 'wudhu');
      expect(nonexistent).toEqual([]);
    });

    it('returns empty array when query is empty, whitespace, or invalid', () => {
      expect(searchAllBooks('')).toEqual([]);
      expect(searchAllBooks('   ')).toEqual([]);
      expect(searchAllBooks(null)).toEqual([]);
      expect(searchAllBooks(undefined)).toEqual([]);
      expect(searchBook('quduri', '')).toEqual([]);
      expect(searchBook('quduri', '  ')).toEqual([]);
    });

    it('respects maxResults parameter', () => {
      const results5 = searchAllBooks('hukum', 5);
      expect(results5.length).toBeLessThanOrEqual(5);

      const results1 = searchAllBooks('hukum', 1);
      expect(results1.length).toBe(1);

      const resultsZero = searchAllBooks('hukum', 0);
      expect(resultsZero).toEqual([]);
    });

    it('handles special and regex characters safely without throwing SyntaxError', () => {
      expect(() => searchAllBooks('***+++???()[]{}')).not.toThrow();
      expect(searchAllBooks('***+++???()[]{}')).toEqual([]);

      expect(() => searchAllBooks('wudhu + taharah (bersuci)?')).not.toThrow();
      const results = searchAllBooks('wudhu + taharah (bersuci)?');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.item.bookKey === 'quduri')).toBe(true);

      expect(() => searchAllBooks('فقه*+?')).not.toThrow();
      const arResults = searchAllBooks('فقه*+?');
      expect(arResults.length).toBeGreaterThan(0);
      expect(arResults.some(r => r.item.bookKey === 'quduri')).toBe(true);
    });

    it('performs exact Arabic whole-word matching using word boundary token sets', () => {
      const results = searchAllBooks('فقه');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].score).toBeGreaterThan(0);
      // Normalized field should contain the exact word token
      const topTokens = normalizeArabic(results[0].item.question_tr + ' ' + results[0].item.answer_tr).split(/\s+/);
      expect(topTokens).toContain('فقه');

      // Verify book-level Arabic whole-word search in Quduri
      const quduriResults = searchBook('quduri', 'فقه');
      expect(quduriResults.length).toBeGreaterThan(0);
      expect(quduriResults[0].item.id).toBe('quduri-001');
      const quduriTokens = normalizeArabic(quduriResults[0].item.answer_tr).split(/\s+/);
      expect(quduriTokens).toContain('فقه');
    });
  });

  describe('Zero Emoji Policy', () => {
    it('ensures search results contain zero emojis', () => {
      const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
      const results = searchAllBooks('wudhu', 20);
      results.forEach(r => {
        expect(emojiRegex.test(r.matchSnippet)).toBe(false);
      });
    });
  });
});
