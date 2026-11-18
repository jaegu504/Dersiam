# Fathul Mu'in di Dersiam: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tambah kitab Fathul Mu'in (Syafi'i) ke Dersiam dengan layar Cari Mas'alah (pencarian satu kata, sorotan, hlm, ibarah), lembar halaman lengkap, Telusur Bab, dan 1.698 soal untuk mode latihan yang sudah ada.

**Architecture:** Skrip Python mengekspor peta `/Users/sp/Documents/Fathul Muin/` menjadi `corpus.json` (topik, halaman, bab) dan `questions.json` (skema soal Dersiam), plus `meta.js` kecil yang diimpor statis. Data besar dimuat lewat `import()` dinamis oleh `loadFathul()`, yang juga mendaftarkan soal ke `booksData.fathul`. View baru `fathul` memakai servis pencarian sendiri (`fathulSearch.js`) yang memakai ulang `normalizeArabic`/`normalizeLatin`. Mode study/exam/reader yang ada dipakai apa adanya, dijaga oleh guard pemuatan di `mountView`.

**Tech Stack:** Vite 5, JavaScript ES modules tanpa framework, GSAP (via `src/services/motion.js`), Vitest + happy-dom, Python 3 (stdlib saja) untuk ekspor.

**Spec:** `docs/superpowers/specs/2026-11-18-fathul-muin-design.md`

## Global Constraints

- Tanpa AI, tanpa backend, tanpa dependensi npm baru. Python skrip: stdlib saja, jalankan dengan `python3 -I`.
- Konten Indonesia + Arab saja. Field `_tr` soal = salinan `_id`; `chapterNameTr` = nama bab Arab.
- Beranda: tampilan sama. Hanya satu kartu baru lewat templat kartu yang ada; tanpa kelas, gaya, atau penanda kartu baru.
- Data Fathul Mu'in tidak boleh masuk bundel awal: hanya `src/data/fathul/meta.js` (< 3 KB) yang diimpor statis.
- Setiap ringkasan dan jawaban membawa `hlm` dan ibarah yang ada di halaman itu (atau halaman berikutnya).
- Token warna dari `src/styles/neumorphism.css` saja; sorotan memakai `--sun` / `--sun-surface`. Teks UI fungsional ≥ 11px.
- Tampilkan halaman sebagai `hlm N · cetak M`.
- Label mazhab: `categoryId: "Fikih Syafi'i"`, `categoryTr: "Şâfiî Fıkhı"`.
- Kerja di branch `feat/fathul-muin` (repo ada di `main`). Jangan push/deploy.
- Semua 169 tes lama tetap lulus.

## Review Focus

1. Kueri pendek atau hanya harakat/tanda baca (`"ا"`, `"ُ"`, `"?"`): tidak error, tidak membanjiri hasil (minimal 2 karakter setelah normalisasi) → tes di Task 3.
2. Kata sangat umum (`"الله"`, `"dan"`): hasil dibatasi 50 dan pencarian < 50 ms atas 1.698 topik → tes di Task 3.
3. Topik yang ibarahnya tidak cocok dengan halaman (`anchor: null`): lembar tetap terbuka tanpa sorotan, tanpa error → tes di Task 6.
4. Halaman tanpa matan (372, 424, 426, 513, 514, 550, 569) dan halaman dengan catatan kaki: terender benar → tes di Task 1 (data) dan Task 6 (render).
5. Lanjutkan sesi / tombol back browser ke `study` dengan `activeBook: 'fathul'` sebelum data dimuat: muncul status memuat lalu kartu soal, bukan daftar kosong → tes di Task 4.

---

### Task 1: Ekspor korpus (topik, halaman, bab)

**Files:**
- Create: `scripts/build_fathul_data.py`
- Create (generated): `src/data/fathul/corpus.json`, `src/data/fathul/meta.js`, `scripts/fathul/report.txt`
- Test: `tests/fathulData.test.js`

**Interfaces:**
- Produces `corpus.json`:
  - `chapters: [{ id: "01".."14", nameAr, nameId, fasals: [{ id: "02-03", nameAr, topicIds: [] }] }]`
  - `topics: [{ id: "fm-0001".., chapterId, fasalId, titleId, titleAr, hlm, cetak, keywords: string[], ringkas, ibarah, anchor: { hlm, para } | null }]` (urutan = urutan di peta)
  - `pages: { [hlm]: { hlm, cetak, matn: string[], syarah: string[], footnotes: string[] } }`
- Produces `meta.js`: `export const fathulMeta = { totalTopics, totalPages, totalChapters, totalQuestions }`.
- CLI: `python3 -I scripts/build_fathul_data.py --source "/Users/sp/Documents/Fathul Muin"` (tanpa `--questions` hanya korpus).

- [ ] **Step 1: Branch**

Run: `git switch -c feat/fathul-muin`

- [ ] **Step 2: Write the failing test** `tests/fathulData.test.js`

```js
import corpus from '../src/data/fathul/corpus.json';
import { fathulMeta } from '../src/data/fathul/meta.js';
it('exports all topics, pages, chapters', () => {
  expect(corpus.topics).toHaveLength(1698);
  expect(Object.keys(corpus.pages)).toHaveLength(673);
  expect(corpus.chapters).toHaveLength(14);
  expect(fathulMeta.totalTopics).toBe(1698);
});
it('splits matan and syarah; pages without separator have no matan', () => {
  expect(corpus.pages['70'].matn[0]).toBe('مع بسملة وتشديدات ورعاية حروف ومخارجها');
  for (const h of ['372','424','426','513','514','550','569']) expect(corpus.pages[h].matn).toEqual([]);
});
it('keeps footnotes apart', () => {
  expect(corpus.pages['2'].footnotes.length).toBeGreaterThan(0);   // page with "_________" (fathul-muin.txt:24)
  expect(corpus.pages['2'].syarah.join('\n')).not.toContain('_________');
});
it('anchors the basmalah topic to its paragraph on hlm 70', () => {
  const t = corpus.topics.find(t => t.titleId === 'Basmalah dan tasydid dalam Fatihah');
  expect(t.hlm).toBe(70); expect(t.cetak).toBe(99);
  expect(t.anchor.hlm).toBe(70);
  expect(corpus.pages['70'].syarah[t.anchor.para]).toContain('مع قراءة البسملة');
});
it('every topic has hlm, ringkas, ibarah and a valid chapter', () => {
  const ids = new Set(corpus.chapters.map(c => c.id));
  for (const t of corpus.topics) { expect(ids.has(t.chapterId)).toBe(true); expect(t.ringkas).toBeTruthy(); expect(t.ibarah).toBeTruthy(); expect(corpus.pages[t.hlm]).toBeDefined(); }
});
```

Verify which page holds `fathul-muin.txt:24` before writing the footnote assertion; use that page's hlm.

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/fathulData.test.js`. Expected: FAIL (cannot resolve `corpus.json`).

- [ ] **Step 4: Implement `scripts/build_fathul_data.py`**

Parsing rules (from spec "Format sumber"):
- Pages: split `fathul-muin.txt` on `^===== \[hlm (\d+) \| cetak (\d+)\] =====$`. Within a page: lines before the first `ــ` line → `matn` (if no `ــ`, `matn = []` and everything is syarah); a line starting with `_____` starts `footnotes` (to page end); remaining non-empty lines → `syarah` (one entry per line = paragraph).
- Topics: walk `kitab/*/*.md` sorted. `### <titleId> | <titleAr>` starts a topic; `> hlm N · kata kunci: a, b` → `hlm`, `keywords` (split on `,`, trimmed); `> ringkas: …` → `ringkas`; following non-heading, non-`>` lines until next `#`-heading → `ibarah` (joined `\n`). `cetak` from the page table.
- Chapter `nameId`: fixed dict in the script for the 14 folder names (mukadimah, shalat, zakat, puasa, haji dan umrah, jual beli, nikah, jinayah, riddah, hudud, jihad, qadha, dakwa dan bayyinah, i'taq). `nameAr` = folder name minus `NN-`. Fasal `nameAr` = file name minus `NN-` and `.md`.
- Anchor: normalize (strip harakat `[ً-ٰٟـ]`, unify alif/ya/ta marbuta like `normalizeArabic`, collapse spaces). Split ibarah into fragments on lines and `...`/`…`; drop fragments < 8 chars. First fragment found in a syarah/matn paragraph of page `hlm`, else page `hlm+1` → `{ hlm, para }` (para indexes `syarah`; matn hits use the first syarah para). None → `null`, and append `id hlm titleId` to `scripts/fathul/report.txt`.
- Write JSON with `ensure_ascii=False`, sorted page keys numeric. Print `topics, pages, anchored, unanchored`.

- [ ] **Step 5: Run script, then tests**

Run: `python3 -I scripts/build_fathul_data.py --source "/Users/sp/Documents/Fathul Muin" && npx vitest run tests/fathulData.test.js`. Expected: PASS. Add one more assertion locking the printed unanchored count: `expect(corpus.topics.filter(t => !t.anchor)).toHaveLength(<printed>)`; if it exceeds 85 (5%), inspect `report.txt` and fix the matcher before continuing.

- [ ] **Step 6: Commit**

```bash
git add scripts/build_fathul_data.py scripts/fathul/report.txt src/data/fathul tests/fathulData.test.js docs/superpowers
git commit -m "feat(fathul): export Fathul Mu'in corpus from the kitab map"
```

### Task 2: Soal: perakitan + 30 sampel untuk dicek pemilik

**Files:**
- Modify: `scripts/build_fathul_data.py` (add `--questions`)
- Create: `scripts/fathul/questions/sample.json` (authored), generated `src/data/fathul/questions.json`
- Test: `tests/fathulData.test.js` (append)

**Interfaces:**
- Consumes: `corpus.topics` (Task 1).
- Authored file format: `[{ "topicId": "fm-0123", "question": "Bagaimana kalau …?" }]`. All files in `scripts/fathul/questions/*.json` are merged; duplicate `topicId` = error.
- Produces `questions.json`: array of Dersiam items `{ id: "fathul-0123", bookKey: "fathul", chapterId, chapterNameTr (nameAr), chapterNameId, originalNumber (topic index+1), question_id, answer_id, question_tr = question_id, answer_tr = answer_id, clozeKeyWord_id, clozeKeyWord_tr, keywords (comma string), topicId, hlm }`.
- `answer_id` = `${ringkas}<br><span lang='ar' dir='rtl'>${ibarah with \n→<br>}</span><br><small>Fathul Mu'in hlm ${hlm} · cetak ${cetak}</small>`.
- `clozeKeyWord`: first word of the ibarah (surface form, ≥ 3 letters) whose normalized form equals a normalized word of `titleAr`; else the longest Arabic word in the first ibarah line.
- Topics without an authored question are skipped; script prints `questions N / 1698`.

- [ ] **Step 1: Write the failing test** (append)

```js
import questions from '../src/data/fathul/questions.json';
it('builds valid Dersiam items from authored questions', () => {
  expect(questions.length).toBeGreaterThanOrEqual(30);
  for (const q of questions) {
    expect(q.bookKey).toBe('fathul');
    expect(q.question_id).toMatch(/\?$/);
    expect(q.question_tr).toBe(q.question_id);
    expect(q.answer_id).toContain(`hlm ${q.hlm}`);
    expect(q.answer_id).toContain(q.clozeKeyWord_id);
  }
  expect(new Set(questions.map(q => q.topicId)).size).toBe(questions.length);
});
```

- [ ] **Step 2: Run to verify it fails.** `npx vitest run tests/fathulData.test.js` → FAIL (no `questions.json`).

- [ ] **Step 3: Author 30 sample questions** in `scripts/fathul/questions/sample.json`: 8 shalat/thaharah, 4 zakat/puasa, 4 haji, 5 jual beli, 5 nikah/talak, 4 jinayah/hudud. Each question: natural Indonesian case question a santri would ask, answerable by that topic's `ringkas` + ibarah, ending in `?`, no ruling stated in the question. Pick topic ids from `corpus.json`.

- [ ] **Step 4: Implement `--questions`, run script and tests** → PASS.

- [ ] **Step 5: Commit** `feat(fathul): assemble question items and 30 samples`

- [ ] **Step 6: Owner checkpoint (blocking for Task 8 only).** Render the 30 samples (question, ringkas, ibarah, hlm) into a readable page and show the owner. Record the owner's style corrections in `scripts/fathul/questions/STYLE.md`; apply them to `sample.json`, rerun, commit. Tasks 3 to 7 continue meanwhile.

### Task 3: Servis pencarian Fathul Mu'in

**Files:**
- Create: `src/services/fathulSearch.js`
- Test: `tests/fathulSearch.test.js`

**Interfaces:**
- Consumes: `normalizeArabic`, `normalizeLatin`, `isArabicText` from `src/services/search.js`; `corpus.topics`.
- Produces:
  - `buildFathulIndex(topics) -> Index` (precomputed normalized title/keywords/ringkas/ibarah).
  - `searchFathul(index, query, maxResults = 50) -> Array<{ topic, score }>`; `[]` when normalized query < 2 chars.
  - `highlightText(text, query) -> string` HTML-escaped text with matches wrapped in `<mark>`; Arabic matched without harakat, mark covers the original characters including harakat.
  - `ibarahSnippet(text, query, maxLen = 180) -> string` plain-text window around the first match (whole text if shorter), with `…` at cut ends.
- Score weights: title 8, keywords 5, ringkas 3, ibarah 2; every query token must match somewhere; ties keep corpus order.

- [ ] **Step 1: Write failing tests**

```js
const idx = buildFathulIndex(corpus.topics);
const top = q => searchFathul(idx, q).slice(0, 5).map(r => r.topic.hlm);
it('finds basmalah topics in Indonesian and Arabic', () => {
  for (const q of ['basmalah', 'البسملة', 'بسملة', 'بَسْمَلَة']) { expect(top(q)).toContain(70); expect(top(q)).toContain(72); }
});
it('highlights Arabic through harakat', () => {
  expect(highlightText('مَعَ بَسْمَلَةٍ', 'بسملة')).toBe('مَعَ <mark>بَسْمَلَةٍ</mark>');
});
it('highlights Latin case-insensitively and escapes HTML', () => {
  expect(highlightText('Basmalah <b>', 'basmalah')).toBe('<mark>Basmalah</mark> &lt;b&gt;');
});
it('ignores too-short or symbol-only queries', () => {
  for (const q of ['', 'ا', 'ُ', '?', '  ']) expect(searchFathul(idx, q)).toEqual([]);
});
it('caps common words and stays fast', () => {
  const t0 = performance.now(); const r = searchFathul(idx, 'الله'); 
  expect(r.length).toBeLessThanOrEqual(50); expect(performance.now() - t0).toBeLessThan(50);
});
it('snippet centres on the match', () => {
  const s = ibarahSnippet('أ '.repeat(200) + 'البسملة' + ' ب'.repeat(200), 'بسملة');
  expect(s).toContain('البسملة'); expect(s.startsWith('…')).toBe(true);
});
```

- [ ] **Step 2: Run** `npx vitest run tests/fathulSearch.test.js` → FAIL.

- [ ] **Step 3: Implement.** Highlight algorithm: build normalized string plus an array mapping each normalized char index to its original index; find matches in normalized; extend each match end over trailing combining marks (`[ً-ٰٟ]`) in the original; escape segments outside and inside marks.

- [ ] **Step 4: Run** → PASS. **Step 5: Commit** `feat(fathul): topic search with harakat-safe highlighting`

### Task 4: Pemuat data, registri kitab, guard mount

**Files:**
- Create: `src/data/fathul/load.js`
- Modify: `src/data/books.js` (add `booksMetadata.fathul`), `src/main.js` (`mountView`, view `fathul`)
- Test: `tests/fathulLoad.test.js`

**Interfaces:**
- `loadFathul() -> Promise<{ corpus, questions, index }>`: one cached promise; `import('./corpus.json')`, `import('./questions.json')`; sets `booksData.fathul = questions`; builds `index` with `buildFathulIndex`.
- `isFathulLoaded() -> boolean`.
- `booksMetadata.fathul = { id: 'fathul', titleId: "Fathul Mu'in", titleTr: "Fethu'l-Muîn", titleAr: 'فتح المعين', categoryId: "Fikih Syafi'i", categoryTr: 'Şâfiî Fıkhı', descId: "Syarah Qurratul 'Ain karya Zainuddin al-Malibari, rujukan fikih madzhab Syafi'i.", descTr: "Zeynüddîn el-Melîbârî'nin Şâfiî fıkhına dair Kurretü'l-Ayn şerhi.", authorId: 'Zainuddin al-Malibari', authorTr: 'Zeynüddîn el-Melîbârî', totalChapters: fathulMeta.totalChapters, totalQuestions: fathulMeta.totalQuestions, themeColor: '#2F7A40' }`. `booksData` stays without `fathul` at import time.
- `main.js mountView`: `'fathul'` → `renderFathulView` (Task 5). For `study|exam|reader` with `activeBook === 'fathul'` and `!isFathulLoaded()`: render a loading card (`dict.fathulLoading`), await `loadFathul()`, then mount the requested view if `currentView` is unchanged; on rejection render `dict.fathulLoadError` with the existing back-home button.

- [ ] **Step 1: Failing tests**

```js
it('registers questions only after loading', async () => {
  expect(booksData.fathul).toBeUndefined();
  const { corpus } = await loadFathul();
  expect(isFathulLoaded()).toBe(true);
  expect(booksData.fathul.length).toBe(fathulMeta.totalQuestions);
  expect(corpus.topics).toHaveLength(1698);
});
it('study view for fathul shows loading then cards (resume / back button)', async () => {
  // fresh module registry: vi.resetModules(); initApp with store { currentView: 'study', activeBook: 'fathul' }
  // expect container text toContain dictionary.id.fathulLoading, then after await: '.study-card' (existing card selector) present
});
```

Existing `tests/data.test.js` and `tests/i18n.test.js` must stay green (they check the six keys of `booksData`).

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** `npx vitest run` (full) → PASS.

- [ ] **Step 5: Commit** `feat(fathul): lazy loader, book metadata and mount guard`

### Task 5: View Fathul Mu'in (layar pertama, hasil, Telusur Bab)

**Files:**
- Create: `src/components/fathulView.js`, `src/styles/fathul.css`
- Modify: `src/data/dictionary.js` (keys in both `tr` and `id`), `src/main.js` (import `fathul.css`)
- Test: `tests/fathulView.test.js`

**Interfaces:**
- `renderFathulView(container, store) -> unmount()`.
- Consumes `loadFathul`, `searchFathul`, `highlightText`, `ibarahSnippet`, `openFathulPage` (Task 6; until then a stub that the test spies on).
- Dictionary keys (tr + id, Indonesian text may repeat in tr): `fathulSearchPlaceholder` ("Cari mas'alah… (contoh: qashar, najis, wali nikah)"), `fathulOtherWays` ("Cara lain"), `fathulBrowse` ("Telusur Bab"), `fathulPractice` ("Latihan Soal"), `fathulReadPage` ("Baca halaman lengkap"), `fathulResults` ("{n} topik ditemukan"), `fathulNoResults`, `fathulLoading`, `fathulLoadError`, `fathulMazhab` ("Mazhab Syafi'i"), `fathulMatn` ("Matan"), `fathulSyarah` ("Syarah"), `fathulFootnotes` ("Catatan kaki"), `fathulRelated` ("Topik lain di fasal ini"), `fathulCopy` ("Salin ibarah + hlm"), `fathulCopied`, `fathulFontSize` ("Perbesar huruf"), `fathulPrevPage`, `fathulNextPage`, `fathulBack`.

Layout per mockups `.superpowers/brainstorm/6255-1794993527/content/pintu-kitab.html` (entry) and `halaman-lengkap.html` (card B):
- Entry: `فتح المعين بشرح قرة العين`, "Fathul Mu'in", "Zainuddin al-Malibari · Mazhab Syafi'i · 673 halaman"; search input (debounced 150 ms, `type="search"`, label = placeholder); chips `basmalah`, `jamak shalat`, `zakat fitrah`, `talak`, `ihram`; "Cara lain" with Telusur Bab and Latihan Soal buttons.
- Results: count line; cards (`neu-card`) with highlighted title, `hlm N · cetak M` badge, `bab · fasal`, highlighted ringkas, highlighted Arabic snippet (`dir="rtl"`, `lang="ar"`), button "Baca halaman lengkap" → `openFathulPage({ hlm: topic.anchor?.hlm ?? topic.hlm, topicId, query })`.
- Telusur Bab: chapters list → fasal list → topic list (title + hlm); topic tap opens the page sheet.
- Latihan Soal: `store.setState({ activeBook: 'fathul', currentView: 'study', activeChapter: 'all', currentQuestionIndex: 0 })`.

- [ ] **Step 1: Failing tests** (happy-dom, real data via `loadFathul`)

```js
it('entry shows search, chips and secondary ways', async () => { /* render; await load; expect input, 5 chips, buttons fathulBrowse & fathulPractice */ });
it('chip search renders highlighted cards with hlm', async () => {
  /* click chip 'basmalah'; wait 200ms; first cards contain 'hlm 70 · cetak 99'; card.querySelectorAll('mark').length > 0 inside title, ringkas and [dir=rtl] */
});
it('Baca halaman lengkap calls openFathulPage with anchor', async () => { /* spy; expect({ hlm: 70, topicId, query: 'basmalah' }) */ });
it('Latihan Soal switches to study for fathul', async () => { /* expect store state */ });
it('Telusur Bab lists 14 chapters then fasals then topics', async () => { /* … */ });
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** (reuse `staggerIn` for cards; call `playPureSfx` with the same sound names `homeView.js`/`studyView.js` already use for equivalent actions, no new sounds). **Step 4: Run full suite** → PASS (dictionary key parity tests included).

- [ ] **Step 5: Commit** `feat(fathul): Cari Mas'alah view with results and chapter browser`

### Task 6: Lembar halaman lengkap

**Files:**
- Create: `src/components/fathulPageSheet.js`
- Modify: `src/styles/fathul.css`
- Test: `tests/fathulPageSheet.test.js`

**Interfaces:**
- `openFathulPage({ hlm, topicId?, query? }) -> close()`; reads data from `loadFathul()` cache; uses `dialogIn` from `motion.js`; `role="dialog"`, `aria-modal`, Escape and backdrop close, focus returns to the opener.
- Content: header `Fathul Mu'in · hlm N · cetak M · <fasal>`; matn box (hidden when `matn` empty); syarah paragraphs with `highlightText(p, query)`; paragraph `anchor.para` of `topicId` gets class `is-ref` and is scrolled into view; footnotes block (smaller, ≥ 11px) when present; related topics of the same fasal (excluding current) as buttons that reopen at their hlm; tools: copy (`navigator.clipboard.writeText(\`${ibarah}\n— Fathul Mu'in, hlm ${hlm}\`)`, falls back silently), font size toggle (stored in `localStorage` key `fathulFont`, try/catch); prev/next buttons, disabled at hlm 1 and 673; prev/next keep the query highlight, drop `is-ref`.

- [ ] **Step 1: Failing tests**

```js
it('hlm 70 shows matan, syarah, highlighted reference paragraph', async () => { /* .is-ref contains 'مع قراءة' and a <mark> */ });
it('prev/next move pages and disable at the ends', async () => { /* 70→69/71; open 1: prev disabled; open 673: next disabled */ });
it('page without separator renders no matan box', async () => { /* hlm 372 */ });
it('footnotes render separately', async () => { /* page from Task 1 footnote test */ });
it('topic without anchor opens without is-ref', async () => { /* first topic with anchor null */ });
it('Escape closes and restores focus', async () => { /* … */ });
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS.

- [ ] **Step 5: Commit** `feat(fathul): full page sheet with reference highlight and paging`

### Task 7: Beranda: tambah kartu tanpa ubah desain

**Files:**
- Modify: `src/components/homeView.js:15` (`BOOK_KEYS`), click handler (~line 160), `src/data/dictionary.js` (count copy)
- Test: `tests/homeView.test.js` (new)

**Interfaces:**
- `BOOK_KEYS` gains `'fathul'` (last). Click: `bookKey === 'fathul'` → `store.setState({ activeBook: 'fathul', currentView: 'fathul' })`; others unchanged. Resume card unchanged (guard from Task 4 handles loading).
- Copy: `brandSubtitle` and `welcomeTitle` counts 6 → 7 in `tr` and `id` ("Yedi Temel Klasik Kitap", "7 Temel Eserde…", "…7 Kitab Utama"), following commit 581f3d8's precedent. No other home markup or CSS changes.

- [ ] **Step 1: Failing tests**

```js
it('renders 7 cards with the existing card template', () => { /* 7 .book-card; fathul card has category "Fikih Syafi'i" in id lang; same class list as quduri card */ });
it('fathul card opens the fathul view; others still open study', () => { /* … */ });
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run full suite** → PASS.

- [ ] **Step 5: Commit** `feat(fathul): add Fathul Mu'in to the home grid`

### Task 8: Sisa 1.668 soal (setelah pemilik menyetujui sampel)

**Files:**
- Create: `scripts/fathul/questions/NN-<bab>.json` (one per chapter folder)
- Test: `tests/fathulData.test.js` (tighten)

- [ ] **Step 1: Tighten test**: `expect(questions).toHaveLength(1698)`; every `topicId` in corpus has exactly one question.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Author per chapter** with subagents (one chapter per agent, parallel), each given `STYLE.md`, `sample.json` as examples, and its chapter's topics (`titleId`, `ringkas`, `ibarah`, `hlm`). Output format as Task 2. Main session spot-checks 10 per chapter against `ringkas`.
- [ ] **Step 4: Rebuild and run full suite** → PASS.
- [ ] **Step 5: Commit** `feat(fathul): author questions for all 1,698 topics`

### Task 9: Verifikasi akhir

- [ ] **Step 1:** `npm test` → all pass (169 old + new).
- [ ] **Step 2:** `npm run build`; compare `dist/assets/index-*.js` size with `main` (build on `main` first, record size). Expected: growth < 10 KB; `corpus` and `questions` in separate chunks.
- [ ] **Step 3:** `npm run preview` and a headless browser check at 390 px: home shows 7 cards, layout unchanged apart from the new card; "basmalah" search shows hlm 70 with marks; sheet opens, scrolls to `.is-ref`; Latihan Soal shows a card; no console errors; no horizontal overflow.
- [ ] **Step 4:** Report to the owner with screenshots. Do not deploy.
