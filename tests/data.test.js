import { describe, it, expect } from 'vitest';
import { dictionary } from '../src/data/dictionary.js';
import { booksMetadata, booksData } from '../src/data/books.js';

describe('Data Schema and Bilingual Dictionary', () => {
  it('contains matching translation keys for TR and ID with no missing values', () => {
    const trKeys = Object.keys(dictionary.tr).sort();
    const idKeys = Object.keys(dictionary.id).sort();
    expect(trKeys).toEqual(idKeys);
    trKeys.forEach(key => {
      expect(dictionary.tr[key]).toBeTruthy();
      expect(dictionary.id[key]).toBeTruthy();
    });
  });

  it('contains valid data items for all 5 books with required bilingual fields', () => {
    const bookKeys = ['quduri', 'talhis', 'kafiye', 'menar', 'akaid'];
    expect(Object.keys(booksData).sort()).toEqual(bookKeys.sort());

    bookKeys.forEach(k => {
      const items = booksData[k];
      expect(items.length).toBeGreaterThan(0);
      items.forEach(item => {
        expect(item.id).toBeTruthy();
        expect(item.bookKey).toBe(k);
        expect(item.question_tr).toBeTruthy();
        expect(item.answer_tr).toBeTruthy();
        expect(item.question_id).toBeTruthy();
        expect(item.answer_id).toBeTruthy();
        expect(item.chapterNameTr).toBeTruthy();
        expect(item.chapterNameId).toBeTruthy();
      });
    });
  });

  it('contains valid booksMetadata for all 5 books', () => {
    const bookKeys = ['quduri', 'talhis', 'kafiye', 'menar', 'akaid'];
    bookKeys.forEach(k => {
      const meta = booksMetadata[k];
      expect(meta).toBeDefined();
      expect(meta.id).toBe(k);
      expect(meta.titleTr).toBeTruthy();
      expect(meta.titleId).toBeTruthy();
      expect(meta.titleAr).toBeTruthy();
      expect(meta.categoryTr).toBeTruthy();
      expect(meta.categoryId).toBeTruthy();
      expect(meta.descTr).toBeTruthy();
      expect(meta.descId).toBeTruthy();
      expect(meta.totalChapters).toBeGreaterThan(0);
    });
  });

  it('has zero emojis across dictionary and all datasets', () => {
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
    
    // Check dictionary
    Object.values(dictionary.tr).forEach(val => {
      expect(emojiRegex.test(val)).toBe(false);
    });
    Object.values(dictionary.id).forEach(val => {
      expect(emojiRegex.test(val)).toBe(false);
    });

    // Check all book items
    Object.values(booksData).forEach(items => {
      items.forEach(item => {
        expect(emojiRegex.test(item.question_tr)).toBe(false);
        expect(emojiRegex.test(item.answer_tr)).toBe(false);
        expect(emojiRegex.test(item.question_id)).toBe(false);
        expect(emojiRegex.test(item.answer_id)).toBe(false);
      });
    });
  });

  it('ensures each question has cloze keywords that are substrings of answers', () => {
    Object.values(booksData).forEach(items => {
      items.forEach(item => {
        expect(item.clozeKeyWord_tr).toBeTruthy();
        expect(item.clozeKeyWord_id).toBeTruthy();
        expect(item.answer_tr).toContain(item.clozeKeyWord_tr);
        expect(item.answer_id).toContain(item.clozeKeyWord_id);
      });
    });
  });
});
