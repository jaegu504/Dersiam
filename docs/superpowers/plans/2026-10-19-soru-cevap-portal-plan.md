# Portal Soru Cevap 5 Kitab Klasik Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun portal web terintegrasi modern dan responsif untuk muthala'ah dan hafalan soal-jawab 5 kitab klasik madrasah (*Mukhtasar al-Quduri*, *Talkhis al-Miftah*, *Al-Kafiyah*, *Manar al-Anwar*, dan *Matn al-'Aqa'id*) dengan antarmuka Soft Neumorphism dwimode (*Warm Ivory* & *Obsidian Dark*), 100% dwibahasa (Osmanlıca ⇄ Bahasa Indonesia santri), mesin pencari universal lintas-kitab, mode ujian dengan navigasi berkelanjutan, dan sistem evaluasi hafalan lokal (*offline-ready*).

**Architecture:** Single Page Application (SPA) berbasis Vanilla JavaScript modular terstruktur menggunakan bundler Vite, Web Audio API sintetis untuk efek haptik suara, State Store berbasis Event/Reducer lokal tersinkronisasi ke `localStorage`, dan sistem styling CSS murni Neumorphic Soft UI (WCAG AAA).

**Tech Stack:** Vanilla JavaScript (ES2022+), Vite 5, Vitest (TDD unit testing framework), Pure SVG Vector Registry, Web Audio API, Service Worker / PWA manifest.

**Spec:** [docs/superpowers/specs/2026-10-19-soru-cevap-portal-design.md](file:///Users/sp/Documents/Soru%20cevap%20sitesi/docs/superpowers/specs/2026-10-19-soru-cevap-portal-design.md)

---

## Global Constraints

* **100% Bebas Emoji:** Seluruh ikon antarmuka (bintang, grafik, navigasi, pengaturan, pencarian, status) **wajib menggunakan SVG vektor murni**, dilarang keras memakai karakter emoji unicode.
* **Aturan Visibilitas Bar Atas:** Tombol `[ 🏠 Ana Sayfa ]` dan nama kitab **hanya boleh muncul saat berada di dalam kitab** (Ruang Belajar / Ujian / Düz Okuma). Pada halaman Beranda (Home / Kitap Seçimi), tombol Home dan nama kitab **wajib disembunyikan sepenuhnya**.
* **100% Dwibahasa Penuh (Osmanlıca ⇄ Bahasa Indonesia Santri):** Seluruh elemen antarmuka (landing page, tombol, kartu evaluasi, modal, tooltip, dan konten materi pertanyaan-jawaban) wajib diterjemahkan secara dinamis dan akurat, tanpa ada teks yang tertinggal dalam bahasa asal saat sakelar bahasa ditekan.
* **Mesin Pencari Universal:** Pencarian kata kunci harus mencocokkan teks Osmanlıca dan teks Bahasa Indonesia secara simultan di seluruh 5 kitab, dan mendukung navigasi loncat langsung (*deep-jump*) ke butir soal yang dipilih.
* **Logika Acak Asli:** Logika pengacakan bawaan repositori lama (`Math.random` + pelacak riwayat `displayedQuestionIndices`) wajib dipertahankan persis tanpa ada soal berulang dalam satu siklus.
* **Tipografi:** Teks Latin wajib menggunakan **Plus Jakarta Sans**; teks Arab/Osmanlıca wajib menggunakan **Amiri / Scheherazade New**.

---

## Review Focus

1. **Pencarian Dwibahasa Simultan:** Memasukkan kata kunci bahasa Indonesia (misal: "syariat", "wudhu", "isim") tetap menemukan soal meskipun aplikasi sedang dalam mode Turki, dan sebaliknya memasukkan kata kunci Turki/Arab ("فقه", "abdest", "nahiv") tetap menemukan soal yang tepat.
2. **Kelengkapan Terjemahan Landing Page:** Saat berada di halaman Beranda utama (*Kitap Seçimi*), mengubah bahasa ke Indonesia harus menerjemahkan seluruh subjudul, deskripsi bab, dan lencana kategori seluruh 5 kartu kitab tanpa ada teks Turki yang tersisa.
3. **Penyembunyian Tombol Home di Beranda:** Saat berpindah kembali ke Beranda melalui tombol Home atau logo, tombol Home dan indikator nama kitab harus tersembunyi secara instan tanpa berkedip (*flash of unstyled content*).
4. **Navigasi Berkelanjutan Mode Ujian:** Menekan tombol `[ Sonraki Soru ▶ ]` di mode Ujian Lisan (*Sözlü İmtihan*) atau Tebak Kata Kunci (*Boşluk Doldurma*) harus memuat soal berikutnya, mereset hitung mundur 30 detik, menyamarkan kembali kata kunci ke bentuk `[ • • • ? • • • ]`, dan menyembunyikan kotak kunci jawaban sebelumnya.
5. **Eksklusivitas Status Evaluasi Belajar:** Menandai soal sebagai `Hatırladım` harus menghapusnya dari daftar `repeatIds` dan menambahkannya ke `rememberedIds`, serta memperbarui formula persentase penguasaan (*Kavrama Oranı*) secara matematis tanpa bias.

---

## File Structure

```
.
├── index.html                           # Entrypoint HTML & font linking
├── package.json                         # Dependencies (vite, vitest) & scripts
├── vite.config.js                       # Vite configuration
├── src/
│   ├── main.js                          # Application bootstrap & view routing
│   ├── styles/
│   │   ├── main.css                     # Global reset, variables & utilities
│   │   ├── neumorphism.css              # Soft UI raised & inset shadow definitions
│   │   └── typography.css               # Plus Jakarta Sans & Amiri web font rules
│   ├── data/
│   │   ├── books.js                     # 5 Books metadata & chapter schemas
│   │   ├── quduri.js                    # Mukhtasar al-Quduri Q&A dataset
│   │   ├── talhis.js                    # Talkhis al-Miftah Q&A dataset
│   │   ├── kafiye.js                    # Al-Kafiyah Q&A dataset
│   │   ├── menar.js                     # Manar al-Anwar Q&A dataset
│   │   ├── akaid.js                     # Matn al-'Aqa'id Q&A dataset
│   │   └── dictionary.js                # 100% Comprehensive TR ⇄ ID translation dictionary
│   ├── state/
│   │   ├── store.js                     # Central reactive state manager & observer
│   │   ├── storage.js                   # LocalStorage persistence & metric calculations
│   │   └── algorithms.js                # Original random, sequential, spaced repetition logic
│   ├── services/
│   │   ├── audio.js                     # Web Audio API synthetic sounds (click, flip, chime)
│   │   └── search.js                    # Universal cross-book bilingual search engine
│   └── components/
│       ├── icons.js                     # SVG vector icon registry (zero emojis)
│       ├── header.js                    # Top navigation bar with strict Home button rule
│       ├── homeView.js                  # Landing page with 5 big interactive book cards
│       ├── studyView.js                 # Study flashcard, tactile dock & self-eval buttons
│       ├── sidebarView.js               # Evaluation dashboard & progress breakdown
│       ├── examView.js                  # Oral exam 30s & Cloze deletion with continuous flow
│       ├── readerView.js                # Raw reader single-page flow list
│       ├── searchModal.js               # Universal global search modal
│       └── settingsModal.js             # Settings dialog & algorithm (?) popup
└── tests/
    ├── search.test.js                   # Unit tests for bilingual search indexing
    ├── algorithms.test.js               # Unit tests for random, sequential & spaced algorithms
    ├── i18n.test.js                     # Automated audit test for 100% bilingual coverage
    ├── exam.test.js                     # Tests for continuous exam flow & cloze masking
    └── storage.test.js                  # Tests for metric formulas & progress persistence
```

---

### Task 1: Project Scaffolding & Test Framework Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `tests/setup.test.js`

**Interfaces:**
- Produces: NPM scripts `dev`, `build`, `test`, dan lingkungan pengujian Vitest berbasis DOM (happy-dom/jsdom).

- [ ] **Step 1: Write failing scaffolding test**

```javascript
// tests/setup.test.js
import { describe, it, expect } from 'vitest';

describe('Project Environment Setup', () => {
  it('has node environment properly configured', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails (before installing dependencies)**

Run: `npx vitest run tests/setup.test.js`
Expected: FAIL (vitest not installed or configured).

- [ ] **Step 3: Create `package.json`, `vite.config.js`, and `index.html`**

```json
{
  "name": "portal-soru-cevap-5-kitab",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "vitest": "^2.0.0",
    "happy-dom": "^14.12.0"
  }
}
```

Configured `vite.config.js` with `test: { environment: 'happy-dom' }`.

- [ ] **Step 4: Install dependencies and run test to verify it passes**

Run: `npm install && npm test`
Expected: PASS (1 passed).

- [ ] **Step 5: Commit scaffolding**

```bash
git add package.json vite.config.js index.html tests/setup.test.js
git commit -m "chore: scaffold vite and vitest testing environment"
```

---

### Task 2: Core Data Schema, Complete Datasets & 100% Bilingual Dictionary

**Files:**
- Create: `src/data/dictionary.js`
- Create: `src/data/books.js`
- Create: `src/data/quduri.js`
- Create: `src/data/talhis.js`
- Create: `src/data/kafiye.js`
- Create: `src/data/menar.js`
- Create: `src/data/akaid.js`
- Test: `tests/data.test.js`

**Interfaces:**
- Produces:
  - `dictionary: { tr: Record<string, string>, id: Record<string, string> }`
  - `booksMetadata: Record<string, BookMetadata>`
  - `booksData: Record<string, SoruCevapItem[]>`

- [ ] **Step 1: Write failing data schema & dictionary validation test**

```javascript
// tests/data.test.js
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/data.test.js`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `dictionary.js`, `books.js`, and the 5 book datasets**

- In `src/data/dictionary.js`: Implement exhaustive key-value pairs covering brand logo, home button, settings, search, modes, exam countdown, cloze deletion, reader flow, evaluation metrics, and dialogs.
- In `src/data/talhis.js` & `src/data/kafiye.js`: Port and structure questions from `jaegu504/talhis` (1000+ lines) and `jaegu504/Kafiyah` (320+ lines) paired with accurate santri Indonesian translations.
- In `src/data/quduri.js`, `src/data/menar.js`, `src/data/akaid.js`: Structure classical madrasah questions with both Osmanlıca and Indonesian translations, plus `clozeKeyWord_tr` and `clozeKeyWord_id`.
- In `src/data/books.js`: Re-export all datasets consolidated under `booksData` and `booksMetadata`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/data.test.js`
Expected: PASS (2 passed).

- [ ] **Step 5: Commit data modules**

```bash
git add src/data/ tests/data.test.js
git commit -m "feat: implement 5-kitab datasets and exhaustive bilingual dictionary"
```

---

### Task 3: State Management, Local Storage Persistence & Shuffle Algorithms

**Files:**
- Create: `src/state/algorithms.js`
- Create: `src/state/storage.js`
- Create: `src/state/store.js`
- Test: `tests/algorithms.test.js`
- Test: `tests/storage.test.js`

**Interfaces:**
- Produces:
  - `getNextQuestion(questions, displayedIndices, algorithm, repeatIds): SoruCevapItem`
  - `loadUserProgress(bookKey): UserBookProgress`
  - `saveUserProgress(bookKey, progress): void`
  - `calculateMetrics(progress, totalQuestions): { completionPct: number, retentionPct: number }`
  - `createStore(initialState): AppStore`

- [ ] **Step 1: Write failing tests for shuffle algorithms and storage metrics**

```javascript
// tests/algorithms.test.js
import { describe, it, expect } from 'vitest';
import { getNextOriginalRandomQuestion, getNextSequentialQuestion } from '../src/state/algorithms.js';

describe('Shuffle Algorithms', () => {
  const mockQuestions = [{ id: 'q1' }, { id: 'q2' }, { id: 'q3' }];

  it('original random does not repeat questions until full cycle completes', () => {
    const displayed = [];
    const q1 = getNextOriginalRandomQuestion(mockQuestions, displayed);
    expect(displayed.length).toBe(1);
    const q2 = getNextOriginalRandomQuestion(mockQuestions, displayed);
    expect(displayed.length).toBe(2);
    expect(q1.id).not.toBe(q2.id);
  });

  it('resets displayed indices when all questions have been shown', () => {
    const displayed = [0, 1, 2];
    const q = getNextOriginalRandomQuestion(mockQuestions, displayed);
    expect(displayed.length).toBe(1);
    expect(mockQuestions).toContain(q);
  });
});
```

```javascript
// tests/storage.test.js
import { describe, it, expect } from 'vitest';
import { calculateMetrics, recordSelfEvaluation } from '../src/state/storage.js';

describe('Storage and Metric Formulas', () => {
  it('calculates completion and retention percentage accurately', () => {
    const progress = {
      viewedIds: ['1', '2', '3', '4'],
      rememberedIds: ['1', '2', '3'],
      repeatIds: ['4']
    };
    const metrics = calculateMetrics(progress, 10);
    expect(metrics.completionPct).toBe(40); // (4 / 10) * 100
    expect(metrics.retentionPct).toBe(75);  // 3 / (3 + 1) * 100
  });

  it('ensures rememberedIds and repeatIds are strictly mutually exclusive', () => {
    let progress = { rememberedIds: ['1'], repeatIds: [] };
    progress = recordSelfEvaluation(progress, '1', 'repeat');
    expect(progress.rememberedIds).not.toContain('1');
    expect(progress.repeatIds).toContain('1');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/algorithms.test.js tests/storage.test.js`
Expected: FAIL with missing functions.

- [ ] **Step 3: Implement `algorithms.js`, `storage.js`, and reactive `store.js`**

- In `src/state/algorithms.js`: Implement `getNextOriginalRandomQuestion` with identical `Math.random` and `displayedQuestionIndices` tracker from original repository; implement sequential and weighted spaced repetition.
- In `src/state/storage.js`: Implement `localStorage` serialization, `calculateMetrics`, and mutually-exclusive `recordSelfEvaluation`.
- In `src/state/store.js`: Create lightweight pub/sub store for state changes (`currentView`, `activeBook`, `activeLang`, `activeChapter`, `isDarkMode`, `isAudioMuted`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/algorithms.test.js tests/storage.test.js`
Expected: PASS.

- [ ] **Step 5: Commit state management**

```bash
git add src/state/ tests/algorithms.test.js tests/storage.test.js
git commit -m "feat: implement shuffle algorithms, metric formulas, and state storage"
```

---

### Task 4: Universal Bilingual Search Engine (Simultaneous TR & ID Search)

**Files:**
- Create: `src/services/search.js`
- Test: `tests/search.test.js`

**Interfaces:**
- Consumes: `booksData` from `src/data/books.js`
- Produces:
  - `searchAllBooks(query: string, maxResults?: number): SearchResultItem[]`
  - `SearchResultItem: { item: SoruCevapItem, matchedLanguage: 'tr' | 'id', matchSnippet: string }`

- [ ] **Step 1: Write failing test for universal bilingual search**

```javascript
// tests/search.test.js
import { describe, it, expect } from 'vitest';
import { searchAllBooks } from '../src/services/search.js';

describe('Universal Bilingual Search Engine', () => {
  it('finds items when searching in Indonesian keywords', () => {
    const results = searchAllBooks('hukum syariat praktis');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.bookKey).toBe('quduri');
  });

  it('finds items when searching in Ottoman/Arabic keywords', () => {
    const results = searchAllBooks('فقه علمندن');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.bookKey).toBe('quduri');
  });

  it('matches across all 5 books simultaneously and returns snippets', () => {
    const results = searchAllBooks('Mukaddime');
    expect(results.length).toBeGreaterThan(1);
    const bookKeys = new Set(results.map(r => r.item.bookKey));
    expect(bookKeys.size).toBeGreaterThan(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/search.test.js`
Expected: FAIL.

- [ ] **Step 3: Implement `src/services/search.js`**

Implement normalized string matching supporting Arabic diacritics removal (harakat), Turkish lowercasing (`İ` -> `i`, `I` -> `ı`), and Indonesian text matching against `question_tr`, `answer_tr`, `question_id`, `answer_id`, and chapter names.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/search.test.js`
Expected: PASS.

- [ ] **Step 5: Commit search engine**

```bash
git add src/services/search.js tests/search.test.js
git commit -m "feat: implement universal cross-book bilingual search engine"
```

---

### Task 5: Pure SVG Vector Icons Registry & Web Audio API Sound Synthesizer

**Files:**
- Create: `src/components/icons.js`
- Create: `src/services/audio.js`
- Test: `tests/icons.test.js`

**Interfaces:**
- Produces:
  - `getIconSvg(name: string, size?: number, className?: string): string`
  - `playPureSfx(type: 'click' | 'flip' | 'chime'): void`
  - `toggleAudioMute(): boolean`

- [ ] **Step 1: Write failing test verifying zero emoji usage and valid SVG generation**

```javascript
// tests/icons.test.js
import { describe, it, expect } from 'vitest';
import { getIconSvg, ICON_NAMES } from '../src/components/icons.js';

describe('Zero-Emoji SVG Vector Registry', () => {
  it('renders valid SVG strings for all icon keys', () => {
    ICON_NAMES.forEach(name => {
      const svg = getIconSvg(name);
      expect(svg).toMatch(/^<svg/);
      expect(svg).toMatch(/<\/svg>$/);
      // Ensure zero emojis in icon output
      expect(svg).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/icons.test.js`
Expected: FAIL.

- [ ] **Step 3: Implement `src/components/icons.js` and `src/services/audio.js`**

- In `src/components/icons.js`: Define clean vector paths for `home`, `sun`, `moon`, `search`, `settings`, `chart`, `star`, `arrowLeft`, `arrowRight`, `eye`, `copy`, `pencil`, `cross`, `check`, `refresh`, `help`.
- In `src/services/audio.js`: Implement Web Audio API tone synthesis for `flip` (smooth sine pitch drop), `click` (short soft tick), and `chime` (gentle pentatonic ding) with zero external audio assets.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/icons.test.js`
Expected: PASS.

- [ ] **Step 5: Commit icon registry and audio service**

```bash
git add src/components/icons.js src/services/audio.js tests/icons.test.js
git commit -m "feat: add pure SVG vector registry and web audio API synthesizer"
```

---

### Task 6: Neumorphic Styling System (Warm Ivory Light & Obsidian Dark)

**Files:**
- Create: `src/styles/typography.css`
- Create: `src/styles/neumorphism.css`
- Create: `src/styles/main.css`

**Interfaces:**
- Produces:
  - CSS custom properties (`--bg-primary`, `--text-primary`, `--neu-raised`, `--neu-inset`, `--accent-primary`)
  - Typography classes `.arabic-typography` (Amiri) and `.latin-typography` (Plus Jakarta Sans)
  - Theme toggler classes `.theme-light` and `.theme-dark`

- [ ] **Step 1: Create typography and web font loading in `src/styles/typography.css`**

Import Google Fonts `Plus Jakarta Sans:wght@400;500;600;700;800` and `Amiri:wght@400;700`. Set up fluid scale and RTL support for Ottoman/Arabic text.

- [ ] **Step 2: Create soft UI tactile shadow definitions in `src/styles/neumorphism.css`**

Implement double shadow curves for Light mode (`-6px -6px 14px rgba(255,255,255,0.95), 6px 6px 14px rgba(198,190,178,0.65)`) and Dark mode (`-5px -5px 12px rgba(255,255,255,0.04), 6px 6px 16px rgba(0,0,0,0.7)`).

- [ ] **Step 3: Create base layout, reset, and button classes in `src/styles/main.css`**

Add responsive container classes, mobile breakpoint styles (`@media (max-width: 820px)`), and tactile button active states (`:active { box-shadow: var(--neu-inset); }`).

- [ ] **Step 4: Verify CSS files load cleanly without syntax errors**

Run: `npx vite build --dry-run`
Expected: Build passes with no CSS compilation errors.

- [ ] **Step 5: Commit styling system**

```bash
git add src/styles/
git commit -m "style: implement tactile neumorphic styling and typography system"
```

---

### Task 7: Header & Landing Page (Home View - 5 Kitab Selection)

**Files:**
- Create: `src/components/header.js`
- Create: `src/components/homeView.js`
- Modify: `src/main.js`
- Test: `tests/header.test.js`

**Interfaces:**
- Produces:
  - `renderHeader(container: HTMLElement, store: AppStore): void`
  - `renderHomeView(container: HTMLElement, store: AppStore): void`
  - Enforces: Home button and active book title **hidden on Home screen**, visible on all study/exam/reader screens.

- [ ] **Step 1: Write failing test for strict header display rules**

```javascript
// tests/header.test.js
import { describe, it, expect } from 'vitest';
import { getHeaderVisibility } from '../src/components/header.js';

describe('Header Visibility Rules', () => {
  it('hides Home button and active book name when currentView is home', () => {
    const visibility = getHeaderVisibility('home');
    expect(visibility.showHomeBtn).toBe(false);
    expect(visibility.showBookInfo).toBe(false);
    expect(visibility.showBrandLogo).toBe(true);
  });

  it('shows Home button and active book name when currentView is study, exam, or reader', () => {
    ['study', 'exam', 'reader'].forEach(view => {
      const visibility = getHeaderVisibility(view);
      expect(visibility.showHomeBtn).toBe(true);
      expect(visibility.showBookInfo).toBe(true);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/header.test.js`
Expected: FAIL.

- [ ] **Step 3: Implement `src/components/header.js` and `src/components/homeView.js`**

- In `src/components/header.js`: Render header with brand title, search button, language toggle, single sun/moon dark mode toggle, settings button, and conditional `[ 🏠 Ana Sayfa ]` + book badge.
- In `src/components/homeView.js`: Render 5 large neumorphic cards for *Kudûrî Şerîf*, *Telhîsu'l-Miftâh*, *el-Kâfiye*, *Menâru'l-Envâr*, and *Metn-i Akāid* with dynamic translations for category badges and descriptions.
- In `src/main.js`: Initialize store and mount header and main viewport.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/header.test.js`
Expected: PASS.

- [ ] **Step 5: Commit header and landing page**

```bash
git add src/components/header.js src/components/homeView.js src/main.js tests/header.test.js
git commit -m "feat: implement header with strict home visibility and 5-kitab landing page"
```

---

### Task 8: Study View (Main Flashcard Card + Floating Dock + Self-Assessment Buttons)

**Files:**
- Create: `src/components/studyView.js`
- Modify: `src/main.js`
- Test: `tests/studyView.test.js`

**Interfaces:**
- Produces:
  - `renderStudyView(container: HTMLElement, store: AppStore): void`
  - Action dock: `[ ◀ Geri ]`, `[ 👁️ Cevabı Gör / Gizle ]`, `[ İleri ▶ ]`
  - Self-assessment: `[ ✕ Tekrar Et ]` & `[ ✓ Hatırladım ]` inside revealed answer container

- [ ] **Step 1: Write failing test for study view state transitions**

```javascript
// tests/studyView.test.js
import { describe, it, expect } from 'vitest';
import { getStudyCardState } from '../src/components/studyView.js';

describe('Study View Card State', () => {
  it('initial state hides answer and evaluation buttons', () => {
    const state = getStudyCardState(false);
    expect(state.isAnswerVisible).toBe(false);
    expect(state.showSelfEvalButtons).toBe(false);
  });

  it('revealed state displays answer and self-assessment buttons', () => {
    const state = getStudyCardState(true);
    expect(state.isAnswerVisible).toBe(true);
    expect(state.showSelfEvalButtons).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/studyView.test.js`
Expected: FAIL.

- [ ] **Step 3: Implement `src/components/studyView.js`**

Implement study card component with question text, revealed answer box containing `[ ✕ Tekrar Et ]` & `[ ✓ Hatırladım ]`, quick utilities (copy text, private note textarea), floating action dock (`Geri`, `Cevabı Gör`, `İleri`), keyboard shortcuts (Space to flip, Left/Right arrow to navigate), and touch swipe handlers.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/studyView.test.js`
Expected: PASS.

- [ ] **Step 5: Commit study view**

```bash
git add src/components/studyView.js tests/studyView.test.js
git commit -m "feat: implement study flashcard view with tactile dock and self-eval buttons"
```

---

### Task 9: Evaluation Dashboard Sidebar (Progress, Khatam %, Retention Ratio & Chapter Breakdown)

**Files:**
- Create: `src/components/sidebarView.js`
- Modify: `src/components/studyView.js`
- Test: `tests/sidebarView.test.js`

**Interfaces:**
- Produces:
  - `renderSidebar(container: HTMLElement, store: AppStore): void`
  - Displays: % Tamamlanma, Kavrama Oranı, Hatırlandı count, Tekrar count, Chapter progress bars, Starred filter toggle.

- [ ] **Step 1: Write failing test for sidebar view metric rendering**

```javascript
// tests/sidebarView.test.js
import { describe, it, expect } from 'vitest';
import { formatSidebarMetrics } from '../src/components/sidebarView.js';

describe('Sidebar Metrics Formatting', () => {
  it('formats metric values and percentage strings correctly', () => {
    const formatted = formatSidebarMetrics({ completionPct: 60, retentionPct: 85, remembered: 17, repeat: 3 });
    expect(formatted.completionText).toBe('%60');
    expect(formatted.retentionText).toBe('%85');
    expect(formatted.rememberedText).toContain('17');
    expect(formatted.repeatText).toContain('3');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/sidebarView.test.js`
Expected: FAIL.

- [ ] **Step 3: Implement `src/components/sidebarView.js`**

Build the evaluation sidebar on desktop and collapsible drawer on mobile. Connect to store metrics and chapter selection events.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/sidebarView.test.js`
Expected: PASS.

- [ ] **Step 5: Commit sidebar view**

```bash
git add src/components/sidebarView.js tests/sidebarView.test.js
git commit -m "feat: implement evaluation dashboard sidebar with progress metrics"
```

---

### Task 10: Exam Mode (Sözlü İmtihan 30s, Boşluk Doldurma & Continuous Multi-Question Navigation)

**Files:**
- Create: `src/components/examView.js`
- Modify: `src/main.js`
- Test: `tests/exam.test.js`

**Interfaces:**
- Produces:
  - `renderExamView(container: HTMLElement, store: AppStore): void`
  - Submode 1: *Sözlü İmtihan* (30s timer, reveal answer button, next question button)
  - Submode 2: *Boşluk Doldurma* (hidden `[ • • • ? • • • ]`, reveal word button, next question button)
  - Exit button: `[ İmtihandan Çık ✕ ]` returning cleanly to study view

- [ ] **Step 1: Write failing test for continuous exam navigation and cloze masking**

```javascript
// tests/exam.test.js
import { describe, it, expect } from 'vitest';
import { maskClozeAnswer, getNextExamState } from '../src/components/examView.js';

describe('Exam Mode Logic', () => {
  it('masks target keyword with dotted placeholder in hidden state', () => {
    const answer = 'قدوری شریف کتابی فقه علمندن بحث ايدر.';
    const masked = maskClozeAnswer(answer, 'فقه', false);
    expect(masked).toContain('[ • • • ? • • • ]');
    expect(masked).not.toContain('فقه');
  });

  it('reveals highlighted keyword when isRevealed is true', () => {
    const answer = 'قدوری شریف کتابی فقه علمندن بحث ايدر.';
    const revealed = maskClozeAnswer(answer, 'فقه', true);
    expect(revealed).toContain('revealed-highlight');
    expect(revealed).toContain('فقه');
  });

  it('advancing exam question resets timer to 30s and re-masks cloze keyword', () => {
    const nextState = getNextExamState({ timer: 12, isClozeRevealed: true, currentIndex: 0 }, 5);
    expect(nextState.currentIndex).toBe(1);
    expect(nextState.timer).toBe(30);
    expect(nextState.isClozeRevealed).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/exam.test.js`
Expected: FAIL.

- [ ] **Step 3: Implement `src/components/examView.js`**

Implement oral exam countdown (30s interval with color shift at $\le 5$s), oral check button, cloze deletion masking with auto-blank fallback, continuous `[ Sonraki Soru ▶ / Soal Selanjutnya ▶ ]` button for uninterrupted multi-question practice, and `[ İmtihandan Çık ✕ ]`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/exam.test.js`
Expected: PASS.

- [ ] **Step 5: Commit exam view**

```bash
git add src/components/examView.js tests/exam.test.js
git commit -m "feat: implement continuous exam mode with oral test and cloze deletion"
```

---

### Task 11: Raw Reader Mode (Düz Okuma Flow List)

**Files:**
- Create: `src/components/readerView.js`
- Modify: `src/main.js`
- Test: `tests/readerView.test.js`

**Interfaces:**
- Produces:
  - `renderReaderView(container: HTMLElement, store: AppStore): void`
  - Uninterrupted flow list of all questions in current book/chapter with `[ Okumadan Çık ✕ ]` button.

- [ ] **Step 1: Write failing test for reader list generator**

```javascript
// tests/readerView.test.js
import { describe, it, expect } from 'vitest';
import { generateReaderListItems } from '../src/components/readerView.js';

describe('Raw Reader List Generator', () => {
  it('generates reader items matching active language', () => {
    const mockItems = [{ id: '1', question_tr: 'Q_TR', answer_tr: 'A_TR', question_id: 'Q_ID', answer_id: 'A_ID' }];
    const trList = generateReaderListItems(mockItems, 'tr');
    expect(trList[0].question).toBe('Q_TR');
    expect(trList[0].answer).toBe('A_TR');

    const idList = generateReaderListItems(mockItems, 'id');
    expect(idList[0].question).toBe('Q_ID');
    expect(idList[0].answer).toBe('A_ID');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/readerView.test.js`
Expected: FAIL.

- [ ] **Step 3: Implement `src/components/readerView.js`**

Implement raw reader view displaying sequential cards in a continuous scrolling column with easy copy buttons and exit button `[ Okumadan Çık ✕ ]`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/readerView.test.js`
Expected: PASS.

- [ ] **Step 5: Commit reader view**

```bash
git add src/components/readerView.js tests/readerView.test.js
git commit -m "feat: implement raw reader flow list view"
```

---

### Task 12: Universal Search Dialog & Settings Modal with Algorithm (?) Popup

**Files:**
- Create: `src/components/searchModal.js`
- Create: `src/components/settingsModal.js`
- Modify: `src/main.js`
- Test: `tests/modals.test.js`

**Interfaces:**
- Produces:
  - `openSearchModal(store: AppStore): void`
  - `openSettingsModal(store: AppStore): void`
  - `openAlgorithmInfoModal(algoType: string, lang: string): void`

- [ ] **Step 1: Write failing test for modal state and algorithm explanation data**

```javascript
// tests/modals.test.js
import { describe, it, expect } from 'vitest';
import { getAlgorithmExplanation } from '../src/components/settingsModal.js';

describe('Settings Modal & Algorithm Info', () => {
  it('returns comprehensive explanations in Turkish and Indonesian', () => {
    ['original', 'sequential', 'spaced'].forEach(algo => {
      const infoTr = getAlgorithmExplanation(algo, 'tr');
      const infoId = getAlgorithmExplanation(algo, 'id');
      expect(infoTr.title).toBeTruthy();
      expect(infoTr.description).toBeTruthy();
      expect(infoId.title).toBeTruthy();
      expect(infoId.description).toBeTruthy();
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/modals.test.js`
Expected: FAIL.

- [ ] **Step 3: Implement `src/components/searchModal.js` and `src/components/settingsModal.js`**

- In `src/components/searchModal.js`: Search input with instant bilingual matching, book badge tags, and click-to-jump handler.
- In `src/components/settingsModal.js`: Dark/light toggle, font size stepper, algorithm radio buttons with `(?)` pop-up explaining the mathematical logic in both Turkish and Indonesian, and data reset button.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/modals.test.js`
Expected: PASS.

- [ ] **Step 5: Commit modals**

```bash
git add src/components/searchModal.js src/components/settingsModal.js tests/modals.test.js
git commit -m "feat: implement universal search modal and settings with algorithm explanation popup"
```

---

### Task 13: 100% Comprehensive Bilingual UI Audit & E2E Verification

**Files:**
- Create: `tests/i18n.test.js`
- Modify: All components if any missing translation key is detected
- Test: `tests/i18n.test.js`

**Interfaces:**
- Validates:
  - Every single rendered UI string on Home, Study, Sidebar, Exam, Reader, Search, and Settings modals changes dynamically between TR and ID.
  - Zero residual hardcoded Turkish or Indonesian in markup.

- [ ] **Step 1: Write exhaustive automated i18n audit test**

```javascript
// tests/i18n.test.js
import { describe, it, expect } from 'vitest';
import { dictionary } from '../src/data/dictionary.js';

describe('100% Comprehensive Bilingual Coverage Audit', () => {
  it('guarantees all dictionary values are non-empty and distinct across languages', () => {
    Object.keys(dictionary.tr).forEach(key => {
      const trVal = dictionary.tr[key];
      const idVal = dictionary.id[key];
      expect(trVal).toBeTruthy();
      expect(idVal).toBeTruthy();
      // Values should not be identical unless intentionally language-neutral (like SVG paths)
      if (!['brandLogo'].includes(key)) {
        expect(trVal).not.toEqual(idVal);
      }
    });
  });
});
```

- [ ] **Step 2: Run test to verify coverage**

Run: `npm test tests/i18n.test.js`
Expected: PASS.

- [ ] **Step 3: Perform full integration test across all test suites**

Run: `npm test`
Expected: All test suites PASS (100% passing).

- [ ] **Step 4: Test production build and service worker generation**

Run: `npm run build`
Expected: Build succeeds with optimized bundles in `dist/`.

- [ ] **Step 5: Commit final integration verification**

```bash
git add tests/i18n.test.js
git commit -m "test: add comprehensive 100% bilingual audit and verify production build"
```
