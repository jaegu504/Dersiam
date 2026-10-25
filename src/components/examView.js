/**
 * Exam Mode Component (Sözlü İmtihan 30s, Boşluk Doldurma & Continuous Navigation)
 *
 * 100% Bebas Emoji: All icons use pure SVG vectors.
 * 100% Bilingual Reactivity: Instant Ottoman Turkish (TR) <-> Indonesian (ID) switching.
 */

import { booksData, booksMetadata } from '../data/books.js';
import { dictionary } from '../data/dictionary.js';
import { playPureSfx } from '../services/audio.js';
import { revealDown, slideSwap, pop, shake } from '../services/motion.js';

const RING_C = 2 * Math.PI * 44;
import { getIconSvg } from './icons.js';

/**
 * Escapes characters with special meaning in RegExp.
 * @param {string} str - Raw string
 * @returns {string} Escaped string
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Masks or reveals target keyword in a cloze question answer.
 *
 * @param {string} answer - Full answer string
 * @param {string} keyword - Target keyword to mask
 * @param {boolean} isRevealed - Whether the target keyword should be displayed
 * @returns {string} Masked or revealed answer HTML
 */
export function maskClozeAnswer(answer, keyword, isRevealed) {
  if (!answer) return '';
  if (!keyword) return answer;

  const replacement = isRevealed
    ? `<span class="cloze-revealed font-bold text-accent px-2 py-0.5 rounded neu-inset-sm revealed-highlight">${keyword}</span>`
    : `<span class="cloze-placeholder font-mono px-3 py-1 bg-amber-500/20 text-accent font-bold rounded neu-inset-sm">[ • • • ? • • • ]</span>`;

  if (answer.includes(keyword)) {
    return answer.split(keyword).join(replacement);
  }

  const regex = new RegExp(escapeRegExp(keyword), 'gi');
  if (regex.test(answer)) {
    return answer.replace(regex, replacement);
  }

  return answer;
}

/**
 * Calculates next continuous exam state.
 * Resets 30s timer, re-masks cloze keyword, and advances question index.
 *
 * @param {{ timer: number, isClozeRevealed: boolean, isOralRevealed?: boolean, currentIndex: number }} currentState
 * @param {number} totalQuestions - Total count of questions
 * @returns {{ currentIndex: number, timer: number, isClozeRevealed: boolean, isOralRevealed: boolean }}
 */
export function getNextExamState(currentState, totalQuestions) {
  const safeTotal = Math.max(Number(totalQuestions) || 1, 1);
  const currentIdx = Number(currentState?.currentIndex) || 0;
  const nextIndex = (currentIdx + 1) % safeTotal;

  return {
    currentIndex: nextIndex,
    timer: 30,
    isClozeRevealed: false,
    isOralRevealed: false
  };
}

/**
 * Extracts target cloze keyword for a given question and language.
 *
 * @param {object} item - Question object
 * @param {string} lang - 'tr' | 'id'
 * @returns {string} Keyword string
 */
function getClozeKeyword(item, lang) {
  if (!item) return '';
  if (lang === 'tr') {
    if (item.clozeKeyWord_tr) return item.clozeKeyWord_tr;
  } else {
    if (item.clozeKeyWord_id) return item.clozeKeyWord_id;
  }

  // Fallback to keywords list if defined
  if (Array.isArray(item.keywords) && item.keywords.length > 0) {
    return item.keywords[0];
  }

  return '';
}

/**
 * Renders the reactive continuous exam view.
 *
 * @param {HTMLElement} container - Mount container element
 * @param {import('../state/store.js').AppStore} store - Central application store
 * @returns {Function} Cleanup function on unmount
 */
export function renderExamView(container, store) {
  if (!container || !store) return () => {};

  let state = store.getState();
  let activeBook = state.activeBook || 'quduri';
  let activeLang = state.activeLang || 'tr';
  let examMode = state.examMode || 'oral'; // 'oral' | 'cloze'

  let currentIndex = 0;
  let timer = 30;
  let isOralRevealed = false;
  let isClozeRevealed = false;
  let timerInterval = null;

  function getDict(lang = activeLang) {
    return dictionary[lang] || dictionary.tr;
  }

  function getQuestions() {
    return booksData[activeBook] || [];
  }

  let questions = getQuestions();

  // Scaffold view container
  container.innerHTML = `
    <div class="exam-view flex flex-col gap-6 w-full animate-fade-in pb-24">
      <!-- Exam Header Toolbar -->
      <header class="exam-toolbar neu-card flex flex-wrap items-center justify-between gap-4 p-4">
        <!-- Submode Switch Tabs -->
        <div class="flex items-center gap-2">
          <button id="btn-tab-oral" class="neu-button ${examMode === 'oral' ? 'neu-button-primary active' : ''}" aria-label="Oral Exam">
            ${getIconSvg('timer', 16)}
            <span class="tab-oral-label font-bold text-xs sm:text-sm"></span>
          </button>
          <button id="btn-tab-cloze" class="neu-button ${examMode === 'cloze' ? 'neu-button-primary active' : ''}" aria-label="Cloze Exam">
            ${getIconSvg('pencil', 16)}
            <span class="tab-cloze-label font-bold text-xs sm:text-sm"></span>
          </button>
        </div>

        <!-- Exit Button -->
        <div class="flex items-center gap-2">
          <button id="btn-exit-exam" class="neu-button flex items-center gap-2 text-danger hover:text-danger" aria-label="Exit Exam">
            ${getIconSvg('close', 16)}
            <span class="exit-label text-xs sm:text-sm font-bold"></span>
          </button>
        </div>
      </header>

      <!-- Exam Card Section -->
      <article class="exam-card neu-card flex flex-col gap-6 p-6 md:p-8" id="exam-card">
        <!-- Top Info Row -->
        <div class="flex items-center justify-between gap-2 border-b border-subtle pb-3">
          <div class="flex items-center gap-2">
            <span id="exam-book-badge" class="neu-badge neu-badge-accent text-xs"></span>
            <span id="exam-chapter-badge" class="neu-badge text-xs"></span>
          </div>
          <span id="exam-question-counter" class="neu-badge neu-badge-info text-xs font-bold"></span>
        </div>

        <!-- Question Body -->
        <div class="exam-question-container py-2">
          <div id="exam-question-text" class="leading-relaxed"></div>
        </div>

        <!-- Interactive Testing Format Submode Content -->
        <div id="exam-submode-content" class="flex flex-col gap-5 pt-2">
          <!-- Oral Exam Section -->
          <div id="oral-section" class="flex flex-col gap-5 ${examMode === 'oral' ? '' : 'hidden'}">
            <!-- Timer Banner -->
            <div class="exam-timer-row flex flex-col items-center gap-3">
              <div id="exam-timer" class="exam-timer exam-ring" role="timer" aria-live="off">
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle class="ring-track" cx="50" cy="50" r="44"></circle>
                  <circle class="ring-fill" id="ring-fill" cx="50" cy="50" r="44" stroke-dasharray="${RING_C}" stroke-dashoffset="0"></circle>
                </svg>
                <span class="ring-num"><span id="timer-seconds">${timer}</span><span id="timer-unit-label"></span></span>
              </div>
              <p id="oral-hint-text" class="text-sm text-secondary text-center"></p>
            </div>

            <!-- Check Answer Button -->
            <div class="flex justify-center">
              <button id="btn-check-oral-answer" class="neu-button neu-button-primary flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold w-full sm:w-auto">
                ${getIconSvg('check', 18)}
                <span class="check-oral-label"></span>
              </button>
            </div>

            <!-- Revealed Oral Answer Container -->
            <div id="exam-answer-container" class="neu-card flex flex-col gap-3 p-5 border-t border-subtle ${isOralRevealed ? '' : 'hidden'}">
              <div id="oral-answer-text" class="leading-relaxed"></div>
            </div>
          </div>

          <!-- Cloze Deletion Section -->
          <div id="cloze-section" class="flex flex-col gap-5 ${examMode === 'cloze' ? '' : 'hidden'}">
            <div class="p-4 rounded-xl bg-surface border border-subtle">
              <p id="cloze-hint-text" class="text-xs sm:text-sm text-secondary"></p>
            </div>

            <!-- Answer Container with Cloze Replacement -->
            <div id="cloze-answer-container" class="neu-card p-6 border border-subtle min-h-[100px] flex items-center justify-center">
            </div>

            <!-- Cloze Reveal Trigger Button -->
            <div class="flex justify-center">
              <button id="btn-toggle-cloze" class="neu-button neu-button-primary flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold w-full sm:w-auto">
                ${getIconSvg('eye', 18)}
                <span class="toggle-cloze-label"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Continuous Navigation Button -->
        <div class="flex items-center justify-center pt-4 border-t border-subtle">
          <button id="btn-next-exam-question" class="neu-button neu-button-primary flex items-center justify-center gap-2 py-3.5 px-8 text-sm font-bold shadow-md w-full sm:w-auto">
            <span class="next-exam-label"></span>
            ${getIconSvg('arrowRight', 18)}
          </button>
        </div>
      </article>
    </div>
  `;

  // Element selections
  const btnTabOral = container.querySelector('#btn-tab-oral');
  const btnTabCloze = container.querySelector('#btn-tab-cloze');
  const btnExitExam = container.querySelector('#btn-exit-exam');
  const tabOralLabel = container.querySelector('.tab-oral-label');
  const tabClozeLabel = container.querySelector('.tab-cloze-label');
  const exitLabel = container.querySelector('.exit-label');

  const examBookBadge = container.querySelector('#exam-book-badge');
  const examChapterBadge = container.querySelector('#exam-chapter-badge');
  const examQuestionCounter = container.querySelector('#exam-question-counter');
  const examQuestionText = container.querySelector('#exam-question-text');

  const oralSection = container.querySelector('#oral-section');
  const examTimer = container.querySelector('#exam-timer');
  const timerSecondsEl = container.querySelector('#timer-seconds');
  const timerUnitLabel = container.querySelector('#timer-unit-label');
  const oralHintText = container.querySelector('#oral-hint-text');
  const btnCheckOral = container.querySelector('#btn-check-oral-answer');
  const checkOralLabel = container.querySelector('.check-oral-label');
  const examAnswerContainer = container.querySelector('#exam-answer-container');
  const oralAnswerText = container.querySelector('#oral-answer-text');

  const clozeSection = container.querySelector('#cloze-section');
  const clozeHintText = container.querySelector('#cloze-hint-text');
  const clozeAnswerContainer = container.querySelector('#cloze-answer-container');
  const btnToggleCloze = container.querySelector('#btn-toggle-cloze');
  const toggleClozeLabel = container.querySelector('.toggle-cloze-label');

  const btnNextExam = container.querySelector('#btn-next-exam-question');
  const nextExamLabel = container.querySelector('.next-exam-label');

  // Timer controls
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startTimer() {
    stopTimer();
    if (examMode !== 'oral') return;

    timerInterval = setInterval(() => {
      if (timer > 0) {
        timer -= 1;
        updateTimerDisplay();

        if (timer <= 0) {
          timer = 0;
          stopTimer();
          playPureSfx('timeUp');
          shake(examTimer);
        } else if (timer <= 5) {
          playPureSfx('tickUrgent');
        } else if (timer <= 10) {
          playPureSfx('tick');
        }
      } else {
        stopTimer();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    if (timerSecondsEl) {
      timerSecondsEl.textContent = String(timer);
    }
    const ringFill = container.querySelector('#ring-fill');
    if (ringFill) {
      ringFill.setAttribute('stroke-dashoffset', String(RING_C * (1 - timer / 30)));
    }
    if (examTimer) {
      if (timer <= 5) {
        examTimer.classList.add('timer-warning');
      } else {
        examTimer.classList.remove('timer-warning');
      }
    }
  }

  function updateView() {
    const dict = getDict();
    const isTr = activeLang === 'tr';
    const bookMeta = booksMetadata[activeBook] || {};
    const currentItem = questions[currentIndex];

    // Localized labels
    tabOralLabel.textContent = dict.oralExamTab || (isTr ? 'Sözlü İmtihan (30sn)' : 'Ujian Lisan (30 Detik)');
    tabClozeLabel.textContent = dict.clozeExamTab || (isTr ? 'Boşluk Doldurma' : 'Tebak Kata Kunci');
    exitLabel.textContent = dict.exitExam || (isTr ? 'İmtihandan Çık' : 'Keluar dari Ujian');
    timerUnitLabel.textContent = dict.timerSeconds || (isTr ? 'saniye' : 'detik');
    oralHintText.textContent = dict.examHintOral || '';
    clozeHintText.textContent = dict.examHintCloze || '';
    checkOralLabel.textContent = dict.checkAnswer || (isTr ? 'Cevabı Kontrol Et' : 'Periksa Jawaban');
    toggleClozeLabel.textContent = isClozeRevealed
      ? (dict.hideAnswer || (isTr ? 'Cevabı Gizle' : 'Sembunyikan Jawaban'))
      : (dict.revealWord || (isTr ? 'Eksik Kelimeyi Göster' : 'Buka Kata yang Hilang'));
    nextExamLabel.textContent = dict.nextExamQuestion || (isTr ? 'Sonraki Soru' : 'Soal Selanjutnya');

    // Tab active states
    if (examMode === 'oral') {
      btnTabOral.classList.add('neu-button-primary', 'active');
      btnTabCloze.classList.remove('neu-button-primary', 'active');
      oralSection.classList.remove('hidden');
      clozeSection.classList.add('hidden');
    } else {
      btnTabCloze.classList.add('neu-button-primary', 'active');
      btnTabOral.classList.remove('neu-button-primary', 'active');
      clozeSection.classList.remove('hidden');
      oralSection.classList.add('hidden');
    }

    // Top badges
    examBookBadge.textContent = isTr ? (bookMeta.titleTr || activeBook) : (bookMeta.titleId || activeBook);
    const chapterName = currentItem
      ? (isTr ? currentItem.chapterNameTr : currentItem.chapterNameId) || currentItem.chapterId
      : '';
    examChapterBadge.textContent = chapterName;
    examQuestionCounter.textContent = `${dict.questionNumberPrefix || (isTr ? 'Soru' : 'Nomor')} ${currentIndex + 1} / ${questions.length}`;

    if (!currentItem) {
      examQuestionText.textContent = dict.noQuestionsInScope || 'Soru bulunamadı.';
      return;
    }

    // Question text and typography
    if (isTr) {
      examQuestionText.className = 'font-arabic text-rtl text-xl sm:text-2xl font-bold py-2 leading-relaxed';
      examQuestionText.textContent = currentItem.question_tr || '';
    } else {
      examQuestionText.className = 'font-latin text-ltr text-lg sm:text-xl font-bold py-2 leading-relaxed';
      examQuestionText.textContent = currentItem.question_id || '';
    }

    // Oral section state
    updateTimerDisplay();
    if (isOralRevealed) {
      examAnswerContainer.classList.remove('hidden');
      if (isTr) {
        oralAnswerText.className = 'font-arabic text-rtl text-lg leading-relaxed';
        oralAnswerText.innerHTML = currentItem.answer_tr || '';
      } else {
        oralAnswerText.className = 'font-latin text-ltr text-base leading-relaxed';
        oralAnswerText.innerHTML = currentItem.answer_id || '';
      }
    } else {
      examAnswerContainer.classList.add('hidden');
    }

    // Cloze section state
    const targetKeyword = getClozeKeyword(currentItem, activeLang);
    const answerRaw = isTr ? (currentItem.answer_tr || '') : (currentItem.answer_id || '');
    const clozeHtml = maskClozeAnswer(answerRaw, targetKeyword, isClozeRevealed);

    if (isTr) {
      clozeAnswerContainer.className = 'neu-card p-6 border border-subtle min-h-[100px] font-arabic text-rtl text-xl leading-loose';
    } else {
      clozeAnswerContainer.className = 'neu-card p-6 border border-subtle min-h-[100px] font-latin text-ltr text-base leading-relaxed';
    }
    clozeAnswerContainer.innerHTML = clozeHtml;

    // Optional click on placeholder to reveal
    const placeholderEl = clozeAnswerContainer.querySelector('.cloze-placeholder');
    if (placeholderEl) {
      placeholderEl.addEventListener('click', () => {
        isClozeRevealed = true;
        playPureSfx('reveal');
        updateView();
        pop(clozeAnswerContainer.querySelector('.revealed-highlight'), 0.6);
      });
    }
  }

  // Interactive event listeners
  btnTabOral.addEventListener('click', () => {
    if (examMode !== 'oral') {
      examMode = 'oral';
      store.setState({ examMode: 'oral' });
      timer = 30;
      isOralRevealed = false;
      playPureSfx('toggle');
      updateView();
      startTimer();
    }
  });

  btnTabCloze.addEventListener('click', () => {
    if (examMode !== 'cloze') {
      examMode = 'cloze';
      store.setState({ examMode: 'cloze' });
      stopTimer();
      isClozeRevealed = false;
      playPureSfx('toggle');
      updateView();
    }
  });

  btnCheckOral.addEventListener('click', () => {
    isOralRevealed = true;
    playPureSfx('reveal');
    updateView();
    revealDown(container.querySelector('#exam-answer-container'));
  });

  btnToggleCloze.addEventListener('click', () => {
    isClozeRevealed = !isClozeRevealed;
    playPureSfx(isClozeRevealed ? 'reveal' : 'flip');
    updateView();
    if (isClozeRevealed) pop(clozeAnswerContainer.querySelector('.revealed-highlight'), 0.6);
  });

  btnNextExam.addEventListener('click', () => {
    const nextState = getNextExamState(
      { timer, isClozeRevealed, isOralRevealed, currentIndex },
      questions.length
    );

    currentIndex = nextState.currentIndex;
    timer = nextState.timer;
    isClozeRevealed = nextState.isClozeRevealed;
    isOralRevealed = nextState.isOralRevealed;

    playPureSfx('next');
    updateView();
    slideSwap(container.querySelector('#exam-card'), 1);

    if (examMode === 'oral') {
      startTimer();
    }
  });

  btnExitExam.addEventListener('click', () => {
    stopTimer();
    playPureSfx('click');
    store.setState({ currentView: 'study' });
  });

  // Store subscription
  const unsubscribe = store.subscribe((newState, prevState) => {
    let shouldUpdate = false;

    if (newState.activeLang !== activeLang) {
      activeLang = newState.activeLang || 'tr';
      shouldUpdate = true;
    }

    if (newState.activeBook !== activeBook) {
      activeBook = newState.activeBook || 'quduri';
      questions = getQuestions();
      currentIndex = 0;
      timer = 30;
      isOralRevealed = false;
      isClozeRevealed = false;
      shouldUpdate = true;
      if (examMode === 'oral') {
        startTimer();
      }
    }

    if (newState.examMode && newState.examMode !== examMode) {
      examMode = newState.examMode;
      shouldUpdate = true;
      if (examMode === 'oral') {
        startTimer();
      } else {
        stopTimer();
      }
    }

    if (shouldUpdate) {
      updateView();
    }
  });

  // Initial render & timer start
  updateView();
  if (examMode === 'oral') {
    startTimer();
  }

  // Return cleanup function
  return () => {
    stopTimer();
    unsubscribe();
  };
}
