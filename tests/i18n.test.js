import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { dictionary } from '../src/data/dictionary.js';
import { booksMetadata, booksData } from '../src/data/books.js';
import { renderHomeView } from '../src/components/homeView.js';
import { renderHeader } from '../src/components/header.js';
import { renderStudyView } from '../src/components/studyView.js';
import { renderExamView } from '../src/components/examView.js';
import { renderReaderView } from '../src/components/readerView.js';
import { openSettingsModal, openAlgorithmInfoModal, getAlgorithmExplanation } from '../src/components/settingsModal.js';
import { openSearchModal } from '../src/components/searchModal.js';
import { createStore, DEFAULT_STATE } from '../src/state/store.js';
import { resetUserProgress } from '../src/state/storage.js';

const EMOJI_REGEX = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

describe('Task 13: 100% Comprehensive Bilingual UI Audit & E2E Verification', () => {
  let store;
  let container;
  let unmount;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);

    resetUserProgress('quduri');
    resetUserProgress('talhis');
    resetUserProgress('kafiye');
    resetUserProgress('menar');
    resetUserProgress('akaid');

    store = createStore({
      ...DEFAULT_STATE,
      currentView: 'home',
      activeBook: 'quduri',
      activeLang: 'id',
      activeChapter: 'all',
      isDarkMode: false,
      isAudioMuted: false,
      activeAlgorithm: 'random',
      fontSize: 'medium',
      isAnswerRevealed: false
    });
  });

  afterEach(() => {
    if (typeof unmount === 'function') {
      unmount();
      unmount = null;
    }
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('1. Exhaustive Dictionary Integrity & Coverage Validation', () => {
    it('guarantees identical key parity between TR and ID dictionaries with non-empty values', () => {
      const trKeys = Object.keys(dictionary.tr).sort();
      const idKeys = Object.keys(dictionary.id).sort();

      expect(trKeys.length).toBeGreaterThan(100);
      expect(idKeys.length).toBeGreaterThan(100);
      expect(trKeys).toEqual(idKeys);

      trKeys.forEach((key) => {
        const trVal = dictionary.tr[key];
        const idVal = dictionary.id[key];

        expect(typeof trVal).toBe('string');
        expect(typeof idVal).toBe('string');
        expect(trVal.trim().length).toBeGreaterThan(0);
        expect(idVal.trim().length).toBeGreaterThan(0);

        // Every key must have distinct translations
        expect(trVal).not.toEqual(idVal);
      });
    });

    it('guarantees zero English or Turkish placeholders in the Indonesian dictionary', () => {
      const suspiciousEnglish = [
        /\btodo\b/i,
        /\bundefined\b/i,
        /\bnull\b/i,
        /\bplaceholder\b/i,
        /\bthe\b/i,
        /\band\b/i,
        /\bquestion\b/i,
        /\banswer\b/i,
        /\bsettings\b/i,
        /\bsearch\b/i,
        /\[object Object\]/
      ];

      const suspiciousTurkish = [
        /\bSoru\b/i,
        /\bCevap\b/i,
        /\bBölüm\b/i,
        /\bHatırladım\b/i,
        /\bTekrar\b/i,
        /\bAyarlar\b/i,
        /\bAydınlık\b/i,
        /\bKaranlık\b/i,
        /\bÖnceki\b/i,
        /\bSonraki\b/i,
        /\bİmtihan\b/i,
        /\bMütalaa\b/i
      ];

      Object.entries(dictionary.id).forEach(([key, val]) => {
        suspiciousEnglish.forEach((pattern) => {
          expect(pattern.test(val)).toBe(false);
        });

        suspiciousTurkish.forEach((pattern) => {
          expect(pattern.test(val)).toBe(false);
        });
      });
    });

    it('guarantees all 5 classical books metadata have complete bilingual attributes', () => {
      const bookKeys = ['quduri', 'talhis', 'kafiye', 'menar', 'akaid'];
      bookKeys.forEach((key) => {
        const meta = booksMetadata[key];
        expect(meta).toBeTruthy();

        // Turkish attributes
        expect(meta.titleTr).toBeTruthy();
        expect(meta.categoryTr).toBeTruthy();
        expect(meta.descTr).toBeTruthy();
        expect(meta.authorTr).toBeTruthy();

        // Indonesian attributes
        expect(meta.titleId).toBeTruthy();
        expect(meta.categoryId).toBeTruthy();
        expect(meta.descId).toBeTruthy();
        expect(meta.authorId).toBeTruthy();

        // Non-identical between languages
        expect(meta.titleTr).not.toEqual(meta.titleId);
        expect(meta.categoryTr).not.toEqual(meta.categoryId);
        expect(meta.descTr).not.toEqual(meta.descId);
        expect(meta.authorTr).not.toEqual(meta.authorId);
      });
    });

    it('guarantees all questions in all 5 books have complete bilingual fields', () => {
      const bookKeys = ['quduri', 'talhis', 'kafiye', 'menar', 'akaid'];
      bookKeys.forEach((key) => {
        const questions = booksData[key];
        expect(questions.length).toBeGreaterThan(0);

        questions.forEach((q) => {
          expect(q.id).toBeTruthy();
          expect(q.question_tr).toBeTruthy();
          expect(q.question_id).toBeTruthy();
          expect(q.answer_tr).toBeTruthy();
          expect(q.answer_id).toBeTruthy();
          expect(q.chapterNameTr).toBeTruthy();
          expect(q.chapterNameId).toBeTruthy();

          expect(q.question_tr).not.toEqual(q.question_id);
          expect(q.answer_tr).not.toEqual(q.answer_id);
        });
      });
    });
  });

  describe('2. Comprehensive DOM Render Audit (Indonesian Mode)', () => {
    it('renders homeView with 100% Indonesian headings, 5 book cards, categories, descriptions, and badges', () => {
      store.setState({ activeLang: 'id', currentView: 'home' });
      unmount = renderHomeView(container, store);

      // Hero section in Indonesian
      const heroTitle = container.querySelector('.hero-title');
      const heroSubtitle = container.querySelector('.hero-subtitle');
      const heroBadge = container.querySelector('.hero-badge');

      expect(heroTitle.textContent.trim()).toBe('Lima Kitab Klasik Utama');
      expect(heroSubtitle.textContent.trim()).toBe(
        "Selamat datang di portal hafalan, muthala'ah, dan ujian madrasah. Silakan pilih bidang ilmu dan kitab yang ingin dipelajari."
      );
      expect(heroBadge.textContent.trim()).toBe("Sistem Muthala'ah dan Ujian 5 Kitab Utama");

      // Grid with 5 books
      const cards = container.querySelectorAll('.book-card');
      expect(cards.length).toBe(5);

      const expectedBooks = [
        { key: 'quduri', title: 'Mukhtashar al-Quduri', cat: 'Fikih', author: 'Abul Hasan al-Quduri' },
        { key: 'talhis', title: 'Talkhis al-Miftah', cat: 'Balaghah', author: 'Khatib al-Qazwini' },
        { key: 'kafiye', title: 'Al-Kafiyah', cat: 'Nahwu', author: 'Ibnu al-Hajib' },
        { key: 'menar', title: 'Manar al-Anwar', cat: 'Ushul Fiqh', author: 'Hafizhud Din an-Nasafi' },
        { key: 'akaid', title: "Matn al-'Aqa'id", cat: 'Akidah & Kalam', author: 'Najmuddin Umar an-Nasafi' }
      ];

      expectedBooks.forEach(({ key, title, cat, author }) => {
        const card = container.querySelector(`[data-book-id="${key}"]`);
        expect(card).toBeTruthy();

        const cardTitle = card.querySelector('.book-title').textContent.trim();
        const cardCat = card.querySelector('.category-badge').textContent.trim();
        const cardAuthor = card.querySelector('.author-name').textContent.trim();
        const startBtnLabel = card.querySelector('.start-btn-label').textContent.trim();
        const chapterCount = card.querySelector('.chapter-count').textContent.trim();
        const questionCount = card.querySelector('.question-count').textContent.trim();

        expect(cardTitle).toBe(title);
        expect(cardCat).toBe(cat);
        expect(cardAuthor).toBe(author);
        expect(startBtnLabel).toBe('Mulai Belajar');
        expect(chapterCount).toContain('Bab');
        expect(questionCount).toContain('Soal');
      });
    });

    it('renders header with dynamic bilingual text switching (TR ⇄ ID)', () => {
      store.setState({ currentView: 'study', activeBook: 'quduri', activeLang: 'tr' });
      unmount = renderHeader(container, store);

      const brandTitle = container.querySelector('.brand-title');
      const homeLabel = container.querySelector('.home-btn-label');
      const bookTitleBadge = container.querySelector('#active-book-title');
      const langLabel = container.querySelector('.lang-label');
      const searchBtn = container.querySelector('#btn-search-trigger');
      const settingsBtn = container.querySelector('#btn-settings-trigger');

      // In Turkish
      expect(brandTitle.textContent.trim()).toBe('Klasik Medrese Portal');
      expect(homeLabel.textContent.trim()).toBe('Ana Sayfa');
      expect(bookTitleBadge.textContent.trim()).toBe("Muhtasarü'l-Kudûrî");
      expect(langLabel.textContent.trim()).toBe('TR');
      expect(searchBtn.getAttribute('aria-label')).toBe('Genel Arama');
      expect(settingsBtn.getAttribute('aria-label')).toBe('Ayarlar');

      // Switch to Indonesian
      store.setState({ activeLang: 'id' });

      expect(brandTitle.textContent.trim()).toBe('Portal Madrasah Klasik');
      expect(homeLabel.textContent.trim()).toBe('Beranda');
      expect(bookTitleBadge.textContent.trim()).toBe('Mukhtashar al-Quduri');
      expect(langLabel.textContent.trim()).toBe('ID');
      expect(searchBtn.getAttribute('aria-label')).toBe('Pencarian Global');
      expect(settingsBtn.getAttribute('aria-label')).toBe('Pengaturan');
    });

    it('renders studyView with 100% Indonesian text, question, answer, and inside-answer eval buttons', () => {
      store.setState({
        currentView: 'study',
        activeBook: 'quduri',
        activeLang: 'id',
        activeChapter: 'all',
        isAnswerRevealed: true
      });

      unmount = renderStudyView(container, store);

      // Mode switch buttons
      const modeStudyLabel = container.querySelector('.mode-study-label').textContent.trim();
      const modeExamLabel = container.querySelector('.mode-exam-label').textContent.trim();
      const modeReaderLabel = container.querySelector('.mode-reader-label').textContent.trim();
      expect(modeStudyLabel).toBe("Mode Kartu Muthala'ah");
      expect(modeExamLabel).toBe('Mode Ujian');
      expect(modeReaderLabel).toBe('Mode Baca Berkelanjutan');

      // Question counter and chapter badge
      const questionCounter = container.querySelector('#question-counter').textContent.trim();
      expect(questionCounter).toMatch(/^Soal 1 \/ \d+/);
      const chapterBadge = container.querySelector('#chapter-badge').textContent.trim();
      expect(chapterBadge).toBe('Mukaddimah');

      // Question text and Answer text in Indonesian (Latin)
      const questionText = container.querySelector('#question-text');
      expect(questionText.className).toContain('font-latin');
      expect(questionText.textContent.length).toBeGreaterThan(0);

      const answerText = container.querySelector('#answer-text');
      expect(answerText.className).toContain('font-latin');
      expect(answerText.textContent.length).toBeGreaterThan(0);

      // Inside-answer evaluation buttons [ ✓ Dihafal ] & [ ✕ Perlu Diulang ]
      const evalRememberedLabel = container.querySelector('.eval-remembered-label').textContent.trim();
      const evalRepeatLabel = container.querySelector('.eval-repeat-label').textContent.trim();
      expect(evalRememberedLabel).toBe('Dihafal');
      expect(evalRepeatLabel).toBe('Perlu Diulang');

      // Action dock navigation buttons
      const prevLabel = container.querySelector('.prev-label').textContent.trim();
      const nextLabel = container.querySelector('.next-label').textContent.trim();
      const toggleAnswerLabel = container.querySelector('.toggle-answer-label').textContent.trim();
      expect(prevLabel).toBe('Sebelumnya');
      expect(nextLabel).toBe('Selanjutnya');
      expect(toggleAnswerLabel).toBe('Sembunyikan Jawaban');

      // Utility labels
      const copyQaLabel = container.querySelector('.copy-qa-label').textContent.trim();
      const noteToggleLabel = container.querySelector('.note-toggle-label').textContent.trim();
      expect(copyQaLabel).toBe('Salin Teks');
      expect(noteToggleLabel).toBe('Tambah Catatan Faidah');
    });

    it('renders examView with oral 30s countdown, check answer, cloze masking, and exit button in Indonesian', () => {
      store.setState({
        currentView: 'exam',
        activeBook: 'quduri',
        activeLang: 'id',
        examMode: 'oral'
      });

      unmount = renderExamView(container, store);

      // Tabs and exit button
      const tabOralLabel = container.querySelector('.tab-oral-label').textContent.trim();
      const tabClozeLabel = container.querySelector('.tab-cloze-label').textContent.trim();
      const exitLabel = container.querySelector('.exit-label').textContent.trim();
      expect(tabOralLabel).toBe('Ujian Lisan (30 Detik)');
      expect(tabClozeLabel).toBe('Tebak Kata Kunci');
      expect(exitLabel).toBe('Keluar dari Ujian');

      // Oral exam banner & controls
      const timerUnitLabel = container.querySelector('#timer-unit-label').textContent.trim();
      const oralHintText = container.querySelector('#oral-hint-text').textContent.trim();
      const checkOralLabel = container.querySelector('.check-oral-label').textContent.trim();
      const nextExamLabel = container.querySelector('.next-exam-label').textContent.trim();

      expect(timerUnitLabel).toBe('detik');
      expect(oralHintText).toBe('Ucapkan jawaban secara lisan atau dalam hati sebelum batas waktu berakhir.');
      expect(checkOralLabel).toBe('Periksa Jawaban');
      expect(nextExamLabel).toBe('Soal Selanjutnya');

      // Switch to cloze tab
      const clozeTabBtn = container.querySelector('#btn-tab-cloze');
      clozeTabBtn.click();

      const clozeHintText = container.querySelector('#cloze-hint-text').textContent.trim();
      const toggleClozeLabel = container.querySelector('.toggle-cloze-label').textContent.trim();
      expect(clozeHintText).toBe('Tebak kata kunci istilah yang disembunyikan di dalam kotak titik-titik.');
      expect(toggleClozeLabel).toBe('Buka Kata yang Hilang');

      // Cloze masking placeholder
      const clozeContainer = container.querySelector('#cloze-answer-container');
      expect(clozeContainer.innerHTML).toContain('[ • • • ? • • • ]');
    });

    it('renders readerView with continuous flow, chapter headers, copy buttons, and exit button in Indonesian', () => {
      store.setState({
        currentView: 'reader',
        activeBook: 'quduri',
        activeLang: 'id',
        activeChapter: 'all'
      });

      unmount = renderReaderView(container, store);

      const exitReaderLabel = container.querySelector('.exit-reader-label').textContent.trim();
      const searchInput = container.querySelector('#reader-search-input');
      const countBadge = container.querySelector('#reader-count-badge').textContent.trim();

      expect(exitReaderLabel).toBe('Keluar Baca');
      expect(searchInput.placeholder).toBe('Cari dalam teks pertanyaan atau jawaban...');
      expect(countBadge).toMatch(/\d+ Soal/);

      // Reader cards
      const readerCards = container.querySelectorAll('.reader-card');
      expect(readerCards.length).toBeGreaterThan(0);

      const firstCard = readerCards[0];
      const chapterBadge = firstCard.querySelector('.reader-chapter-badge').textContent.trim();
      const copyBtn = firstCard.querySelector('.btn-copy-reader-item');

      expect(chapterBadge).toBe('Mukaddimah');
      expect(copyBtn.getAttribute('aria-label')).toBe('Salin Teks');
    });

    it('renders settingsModal with 100% Indonesian titles, options, and algorithm explanations', () => {
      store.setState({ activeLang: 'id' });
      const closeSettings = openSettingsModal(store);

      const modal = document.querySelector('.settings-modal');
      expect(modal).toBeTruthy();

      const title = modal.querySelector('.modal-header h3').textContent.trim();
      expect(title).toBe('Pengaturan Portal');

      const modalText = modal.textContent;
      expect(modalText).toContain('Ganti Tema');
      expect(modalText).toContain('Mode Terang');
      expect(modalText).toContain('Mode Gelap');
      expect(modalText).toContain('Beralih ke Osmanlıca');
      expect(modalText).toContain('Ukuran Teks Arab & Terjemah');
      expect(modalText).toContain('Ukuran Kecil');
      expect(modalText).toContain('Ukuran Sedang');
      expect(modalText).toContain('Ukuran Besar');
      expect(modalText).toContain('Efek Suara');
      expect(modalText).toContain('Logika Pengacakan Soal');
      expect(modalText).toContain('Acak Asli (Siklik)');
      expect(modalText).toContain('Berurutan (Nomor Kitab)');
      expect(modalText).toContain('Pengulangan Pintar (Berbobot)');
      expect(modalText).toContain('Hapus Seluruh Data Belajar');

      closeSettings();
    });

    it('renders algorithm explanation popup with Indonesian mathematical formulas and workflow', () => {
      const algorithms = ['random', 'sequential', 'spaced'];
      algorithms.forEach((algo) => {
        const closeInfo = openAlgorithmInfoModal(algo, 'id');
        const modal = document.querySelector('.algo-info-modal');
        expect(modal).toBeTruthy();

        const badge = modal.querySelector('.neu-badge').textContent.trim();
        expect(badge).toBe('PANDUAN ALGORITMA');

        const content = modal.textContent;
        expect(content).toContain('Deskripsi');
        expect(content).toContain('Logika Matematis');
        expect(content).toContain('Tahapan Alur Kerja');
        expect(content).toContain('Mengerti & Tutup');

        if (algo === 'random') {
          expect(content).toContain('Fisher-Yates');
        } else if (algo === 'sequential') {
          expect(content).toContain('mod N');
        } else if (algo === 'spaced') {
          expect(content).toContain('w=3');
          expect(content).toContain('P(soal_i)');
        }

        closeInfo();
      });
    });

    it('renders searchModal with Indonesian search placeholder, hint, and empty state', () => {
      store.setState({ activeLang: 'id' });
      const closeSearch = openSearchModal(store);

      const modal = document.querySelector('.search-modal');
      expect(modal).toBeTruthy();

      const title = modal.querySelector('.modal-header h3').textContent.trim();
      expect(title).toBe('Pencarian Global Seluruh Kitab');

      const input = modal.querySelector('input.search-input');
      expect(input.placeholder).toBe('Ketik kata kunci dalam bahasa Arab, Osmanlıca, atau Indonesia...');

      const hint = modal.querySelector('.search-hint').textContent.trim();
      expect(hint).toBe('Klik pada hasil pencarian untuk langsung membuka kartu soal terkait.');

      // Test empty results state
      input.value = 'xyznonexistentterm12345';
      input.dispatchEvent(new Event('input'));

      const noResults = modal.querySelector('.search-no-results').textContent.trim();
      expect(noResults).toBe('Tidak ditemukan soal atau jawaban yang sesuai dengan kata kunci tersebut.');

      closeSearch();
    });
  });

  describe('3. Automated Unicode Emoji Scan across All Rendered Component DOMs', () => {
    it('guarantees zero unicode emojis in homeView rendered DOM', () => {
      store.setState({ currentView: 'home', activeLang: 'id' });
      unmount = renderHomeView(container, store);
      expect(EMOJI_REGEX.test(container.innerHTML)).toBe(false);
    });

    it('guarantees zero unicode emojis in header rendered DOM', () => {
      store.setState({ currentView: 'study', activeBook: 'quduri', activeLang: 'id' });
      unmount = renderHeader(container, store);
      expect(EMOJI_REGEX.test(container.innerHTML)).toBe(false);
    });

    it('guarantees zero unicode emojis in studyView rendered DOM', () => {
      store.setState({
        currentView: 'study',
        activeBook: 'quduri',
        activeLang: 'id',
        isAnswerRevealed: true
      });
      unmount = renderStudyView(container, store);
      expect(EMOJI_REGEX.test(container.innerHTML)).toBe(false);
    });

    it('guarantees zero unicode emojis in examView rendered DOM (oral and cloze)', () => {
      store.setState({
        currentView: 'exam',
        activeBook: 'quduri',
        activeLang: 'id',
        examMode: 'oral'
      });
      unmount = renderExamView(container, store);
      expect(EMOJI_REGEX.test(container.innerHTML)).toBe(false);

      const clozeTab = container.querySelector('#btn-tab-cloze');
      clozeTab.click();
      expect(EMOJI_REGEX.test(container.innerHTML)).toBe(false);
    });

    it('guarantees zero unicode emojis in readerView rendered DOM', () => {
      store.setState({
        currentView: 'reader',
        activeBook: 'quduri',
        activeLang: 'id'
      });
      unmount = renderReaderView(container, store);
      expect(EMOJI_REGEX.test(container.innerHTML)).toBe(false);
    });

    it('guarantees zero unicode emojis in settingsModal rendered DOM', () => {
      store.setState({ activeLang: 'id' });
      const close = openSettingsModal(store);
      const modal = document.querySelector('.settings-modal');
      expect(EMOJI_REGEX.test(modal.innerHTML)).toBe(false);
      close();
    });

    it('guarantees zero unicode emojis in algorithmInfoModal rendered DOM', () => {
      ['random', 'sequential', 'spaced'].forEach((algo) => {
        const close = openAlgorithmInfoModal(algo, 'id');
        const modal = document.querySelector('.algo-info-modal');
        expect(EMOJI_REGEX.test(modal.innerHTML)).toBe(false);
        close();
      });
    });

    it('guarantees zero unicode emojis in searchModal rendered DOM', () => {
      store.setState({ activeLang: 'id' });
      const close = openSearchModal(store);
      const modal = document.querySelector('.search-modal');
      expect(EMOJI_REGEX.test(modal.innerHTML)).toBe(false);
      close();
    });
  });
});
