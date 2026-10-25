/**
 * Study View (Main Flashcard Card + Floating Dock + Self-Assessment Buttons)
 * 100% Bebas Emoji: All icons use pure SVG vectors.
 * 100% Bilingual Reactivity: Instant TR (Osmanlıca) <-> ID (Indonesian) switching.
 */

import { booksData } from '../data/books.js';
import { dictionary } from '../data/dictionary.js';
import { getNextQuestion, getNextSequentialQuestion } from '../state/algorithms.js';
import { loadUserProgress, saveUserProgress, recordSelfEvaluation, toggleStarred, saveNote, saveLastSession } from '../state/storage.js';
import { slideSwap, revealDown, pop } from '../services/motion.js';
import { playPureSfx } from '../services/audio.js';
import { getIconSvg } from './icons.js';

/**
 * Returns visibility state for the study flashcard answer and evaluation controls.
 *
 * @param {boolean} isAnswerRevealed - Whether answer has been toggled visible.
 * @returns {{ isAnswerVisible: boolean, showSelfEvalButtons: boolean }}
 */
export function getStudyCardState(isAnswerRevealed) {
  const isVisible = Boolean(isAnswerRevealed);
  return {
    isAnswerVisible: isVisible,
    showSelfEvalButtons: isVisible
  };
}

/**
 * Renders the reactive study flashcard view.
 *
 * @param {HTMLElement} container - DOM mount target (#view-mount)
 * @param {import('../state/store.js').AppStore} store - Reactive application store
 * @returns {Function} Unmount cleanup function
 */
export function renderStudyView(container, store) {
  if (!container || !store) return () => {};

  let state = store.getState();
  let activeBook = state.activeBook || 'quduri';
  let activeChapter = state.activeChapter || 'all';
  let isAnswerRevealed = Boolean(state.isAnswerRevealed);
  let isNoteOpen = false;
  let currentIndex = typeof state.currentQuestionIndex === 'number' ? state.currentQuestionIndex : 0;
  const displayedIndices = [];

  let progress = loadUserProgress(activeBook);

  function getDict(lang = store.getState().activeLang || 'tr') {
    return dictionary[lang] || dictionary.tr;
  }

  function getBookQuestions() {
    return booksData[activeBook] || [];
  }

  function getChapters() {
    const rawQuestions = getBookQuestions();
    const chapterMap = new Map();
    rawQuestions.forEach((q) => {
      if (q.chapterId && !chapterMap.has(q.chapterId)) {
        chapterMap.set(q.chapterId, {
          id: q.chapterId,
          nameTr: q.chapterNameTr || q.chapterId,
          nameId: q.chapterNameId || q.chapterId
        });
      }
    });
    return Array.from(chapterMap.values());
  }

  function getFilteredQuestions() {
    const rawQuestions = getBookQuestions();
    if (activeChapter === 'starred') {
      return rawQuestions.filter((q) => progress.starredIds && progress.starredIds.includes(q.id));
    }
    if (!activeChapter || activeChapter === 'all') {
      return rawQuestions;
    }
    return rawQuestions.filter((q) => q.chapterId === activeChapter);
  }

  let questions = getFilteredQuestions();

  function markCurrentViewed() {
    const currentItem = questions[currentIndex];
    if (!currentItem) return;
    saveLastSession({
      book: activeBook,
      chapter: activeChapter,
      index: currentIndex,
      total: questions.length,
      chapterNameTr: currentItem.chapterNameTr,
      chapterNameId: currentItem.chapterNameId
    });
    if (!progress.viewedIds.includes(currentItem.id)) {
      progress.viewedIds.push(currentItem.id);
      saveUserProgress(activeBook, progress);
      store.setState({ lastProgressUpdate: Date.now() });
    }
  }

  markCurrentViewed();

  // Toast feedback helper
  let toastTimer = null;
  function showToast(message) {
    let toastEl = container.querySelector('.study-toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'study-toast';
      toastEl.setAttribute('role', 'status');
      container.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.remove('hidden');
    pop(toastEl, 0.8);
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl?.classList.add('hidden');
    }, 2200);
  }

  const initialLang = state.activeLang || 'tr';
  const initialIsTr = initialLang === 'tr';
  const initialDict = getDict(initialLang);

  // Initial scaffold DOM structure
  container.innerHTML = `
    <div class="study-view flex flex-col gap-6 w-full animate-fade-in pb-28">
      <!-- Top Controls: Mode Switch, Chapter Filter, Star -->
      <header class="study-toolbar neu-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4">
        <!-- Modes -->
        <div class="mode-group flex items-center gap-2">
          <button id="btn-mode-study" class="neu-button neu-button-primary active" aria-label="${initialDict.studyMode || 'Normal Mütalaa'}">
            ${getIconSvg('book', 16)}
            <span class="mode-study-label">${initialDict.studyMode || 'Normal Mütalaa'}</span>
          </button>
          <button id="btn-mode-exam" class="neu-button" aria-label="${initialDict.examMode || 'İmtihan Modu'}">
            ${getIconSvg('modeExam', 16)}
            <span class="mode-exam-label">${initialDict.examMode || 'İmtihan Modu'}</span>
          </button>
          <button id="btn-mode-reader" class="neu-button" aria-label="${initialDict.readerMode || 'Düz Okuma'}">
            ${getIconSvg('modeReader', 16)}
            <span class="mode-reader-label">${initialDict.readerMode || 'Düz Okuma'}</span>
          </button>
        </div>

        <!-- Chapter Select & Star -->
        <div class="chapter-star-group flex items-center gap-2">
          <select id="chapter-select" class="neu-input text-xs py-2 px-3 rounded-lg bg-surface border border-subtle" aria-label="${initialDict.selectChapter || 'Bölüm Seçiniz'}">
          </select>

          <button id="btn-star" class="neu-button shrink-0" aria-label="${initialDict.starQuestion}" title="${initialDict.starQuestion}">
            <span class="star-icon">${getIconSvg('star', 20)}</span>
          </button>
        </div>
      </header>

      <!-- Main Content Area: Centered Study Card -->
      <div class="study-layout flex flex-col items-center w-full max-w-3xl mx-auto">
        <div class="study-main-col flex flex-col gap-6 w-full">
          <!-- Main Flashcard Card -->
          <article class="study-card neu-card flex flex-col gap-6 p-6 md:p-8" id="study-card">
            <!-- Card Header Info -->
            <div class="flex items-center justify-between gap-2 border-b border-subtle pb-3">
              <div class="flex items-center gap-2">
                <span id="chapter-badge" class="neu-badge neu-badge-accent text-xs"></span>
                <span id="number-badge" class="neu-badge text-xs hidden"></span>
              </div>
              <span id="question-counter" class="neu-badge neu-badge-info text-xs font-bold"></span>
            </div>

            <!-- Empty State Container -->
            <div id="empty-state" class="empty-state flex flex-col items-center justify-center p-8 text-center hidden">
              <p class="text-secondary max-w-md text-sm">
                ${initialDict.noQuestionsInScope || 'Bu seçilen kapsamda herhangi bir soru bulunamadı.'}
              </p>
              <button id="btn-reset-chapter" class="neu-button neu-button-primary mt-4">
                ${initialDict.allChapters || 'Tüm Kitap (Bütün Bölümler)'}
              </button>
            </div>

            <!-- Question Body -->
            <div id="question-container" class="question-container py-2">
              <div id="question-text"></div>
            </div>

            <!-- Answer Box (Hidden until revealed) -->
            <div id="answer-box" class="answer-box flex flex-col gap-5 pt-5 border-t border-subtle hidden">
              <div id="answer-text"></div>

              <!-- Self-Assessment Buttons (Strictly inside revealed answer container) -->
              <div class="self-assessment-row flex flex-wrap items-center justify-between gap-3 pt-2">
                <div class="flex items-center gap-2">
                  <button id="btn-eval-repeat" class="neu-button btn-eval-repeat" aria-label="${initialDict.evalRepeat || 'Tekrar Et'}">
                    ${getIconSvg('cross', 18)}
                    <span class="eval-repeat-label">${initialDict.evalRepeat || 'Tekrar Et'}</span>
                  </button>
                  <button id="btn-eval-remembered" class="neu-button btn-eval-remembered" aria-label="${initialDict.evalRemembered || 'Hatırladım'}">
                    ${getIconSvg('check', 18)}
                    <span class="eval-remembered-label">${initialDict.evalRemembered || 'Hatırladım'}</span>
                  </button>
                </div>

                <!-- Utilities: Copy Q&A + Personal Note -->
                <div class="flex items-center gap-2">
                  <button id="btn-copy-qa" class="neu-button" aria-label="${initialDict.copyText || 'Metni Kopyala'}" title="${initialDict.copyText || 'Metni Kopyala'}">
                    ${getIconSvg('copy', 18)}
                    <span class="copy-qa-label text-xs hidden sm:inline">${initialDict.copyText || 'Metni Kopyala'}</span>
                  </button>
                  <button id="btn-note-toggle" class="neu-button" aria-label="${initialDict.addNote || 'Faide Notu'}" title="${initialDict.addNote || 'Faide Notu'}">
                    ${getIconSvg('pencil', 18)}
                    <span class="note-toggle-label text-xs hidden sm:inline">${initialDict.addNote || 'Faide Notu'}</span>
                  </button>
                </div>
              </div>

              <!-- Private Note Expanding Container -->
              <div id="note-container" class="note-container flex flex-col gap-2 mt-2 p-4 rounded-xl bg-surface border border-subtle hidden">
                <label for="note-textarea" class="note-input-label text-xs font-semibold text-secondary">${initialDict.addNote || 'Faide Notu Ekle'}</label>
                <textarea id="note-textarea" rows="3" class="neu-input w-full p-3 rounded-lg text-sm bg-surface-elevated border border-subtle" placeholder="${initialDict.notePlaceholder || 'Ders notlarınızı buraya kaydedebilirsiniz...'}"></textarea>
                <div class="flex justify-end mt-1">
                  <button id="btn-save-note" class="neu-button neu-button-primary text-xs">
                    ${getIconSvg('check', 14)}
                    <span class="save-note-label">${initialDict.saveNote || 'Notu Kaydet'}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Card Action Dock (Always visible directly below question/answer) -->
            <nav class="floating-dock" aria-label="Flashcard Navigation">
              <button id="btn-prev" class="neu-button neu-button-dock" aria-label="${initialDict.prevQuestion || 'Önceki'}">
                ${getIconSvg('arrowLeft', 20)}
                <span class="prev-label hidden sm:inline text-xs">${initialDict.prevQuestion || 'Önceki'}</span>
              </button>

              <button id="btn-toggle-answer" class="neu-button neu-button-primary neu-button-dock" aria-label="${initialDict.showAnswer || 'Cevabı Gör'}">
                <span class="toggle-icon">${getIconSvg('eye', 20)}</span>
                <span class="toggle-answer-label text-xs font-bold">${initialDict.showAnswer || 'Cevabı Gör'}</span>
              </button>

              <button id="btn-next" class="neu-button neu-button-dock" aria-label="${initialDict.nextQuestion || 'Sonraki'}">
                <span class="next-label hidden sm:inline text-xs">${initialDict.nextQuestion || 'Sonraki'}</span>
                ${getIconSvg('arrowRight', 20)}
              </button>
            </nav>
          </article>
        </div>
      </div>
    </div>
  `;

  // Element handles
  const chapterSelect = container.querySelector('#chapter-select');
  const starBtn = container.querySelector('#btn-star');
  const starIconEl = starBtn.querySelector('.star-icon');
  const chapterBadge = container.querySelector('#chapter-badge');
  const numberBadge = container.querySelector('#number-badge');
  const questionCounter = container.querySelector('#question-counter');
  const emptyStateEl = container.querySelector('#empty-state');
  const questionContainerEl = container.querySelector('#question-container');
  const questionTextEl = container.querySelector('#question-text');
  const answerBox = container.querySelector('#answer-box');
  const answerTextEl = container.querySelector('#answer-text');
  const btnEvalRepeat = container.querySelector('#btn-eval-repeat');
  const btnEvalRemembered = container.querySelector('#btn-eval-remembered');
  const evalRepeatLabel = container.querySelector('.eval-repeat-label');
  const evalRememberedLabel = container.querySelector('.eval-remembered-label');
  const copyQaLabel = container.querySelector('.copy-qa-label');
  const noteToggleLabel = container.querySelector('.note-toggle-label');
  const noteContainer = container.querySelector('#note-container');
  const noteTextarea = container.querySelector('#note-textarea');
  const noteInputLabel = container.querySelector('.note-input-label');
  const saveNoteLabel = container.querySelector('.save-note-label');
  const btnSaveNote = container.querySelector('#btn-save-note');
  const btnPrev = container.querySelector('#btn-prev');
  const prevLabel = container.querySelector('.prev-label');
  const btnToggleAnswer = container.querySelector('#btn-toggle-answer');
  const toggleIconEl = btnToggleAnswer.querySelector('.toggle-icon');
  const toggleAnswerLabel = container.querySelector('.toggle-answer-label');
  const btnNext = container.querySelector('#btn-next');
  const nextLabel = container.querySelector('.next-label');
  const modeStudyLabel = container.querySelector('.mode-study-label');
  const modeExamLabel = container.querySelector('.mode-exam-label');
  const modeReaderLabel = container.querySelector('.mode-reader-label');

  // Repopulate chapter select options
  function updateChapterOptions() {
    const lang = store.getState().activeLang || 'tr';
    const isTr = lang === 'tr';
    const dict = getDict(lang);
    const chapters = getChapters();

    const options = [
      `<option value="all"${activeChapter === 'all' ? ' selected' : ''}>${dict.allChapters || 'Tüm Kitap (Bütün Bölümler)'}</option>`,
      ...(activeChapter === 'starred' ? [`<option value="starred" selected>${dict.filterStarred || (isTr ? 'Yıldızlı Sorular' : 'Soal Berbintang')}</option>`] : []),
      ...chapters.map((ch) => {
        const chName = isTr ? ch.nameTr : ch.nameId;
        return `<option value="${ch.id}"${activeChapter === ch.id ? ' selected' : ''}>${chName}</option>`;
      })
    ].join('');

    chapterSelect.innerHTML = options;
  }

  // Update question and card UI
  function updateCard() {
    const lang = store.getState().activeLang || 'tr';
    const isTr = lang === 'tr';
    const dict = getDict(lang);

    const currentItem = questions[currentIndex] || null;

    if (!currentItem) {
      emptyStateEl.classList.remove('hidden');
      questionContainerEl.classList.add('hidden');
      answerBox.classList.add('hidden');
      chapterBadge.textContent = '';
      numberBadge.classList.add('hidden');
      questionCounter.textContent = '0 / 0';
      return;
    }

    emptyStateEl.classList.add('hidden');
    questionContainerEl.classList.remove('hidden');

    const totalQuestions = questions.length;
    questionCounter.textContent = isTr
      ? `Soru ${currentIndex + 1} / ${totalQuestions}`
      : `Soal ${currentIndex + 1} / ${totalQuestions}`;

    chapterBadge.textContent = isTr
      ? (currentItem.chapterNameTr || '')
      : (currentItem.chapterNameId || '');

    if (currentItem.originalNumber) {
      numberBadge.textContent = `No: ${currentItem.originalNumber}`;
      numberBadge.classList.remove('hidden');
    } else {
      numberBadge.classList.add('hidden');
    }

    // Question Text
    questionTextEl.className = isTr
      ? 'font-arabic text-rtl text-xl md:text-2xl leading-loose font-bold'
      : 'font-latin text-base md:text-lg leading-relaxed font-semibold';
    questionTextEl.innerHTML = isTr ? currentItem.question_tr : currentItem.question_id;

    // Answer Text
    answerTextEl.className = isTr
      ? 'font-arabic text-rtl text-lg md:text-xl leading-loose text-primary bg-surface-elevated p-4 rounded-xl border border-subtle'
      : 'font-latin text-sm md:text-base leading-relaxed text-primary bg-surface-elevated p-4 rounded-xl border border-subtle';
    answerTextEl.innerHTML = isTr ? currentItem.answer_tr : currentItem.answer_id;

    // Star icon
    const isStarred = progress.starredIds.includes(currentItem.id);
    starIconEl.innerHTML = getIconSvg(isStarred ? 'starFilled' : 'star', 20, isStarred ? 'text-amber-500' : '');
    const starAria = isStarred ? dict.unstarQuestion : dict.starQuestion;
    starBtn.setAttribute('aria-label', starAria);
    starBtn.setAttribute('title', starAria);

    // Self-assessment button states
    const isRemembered = progress.rememberedIds.includes(currentItem.id);
    const isRepeat = progress.repeatIds.includes(currentItem.id);
    btnEvalRemembered.classList.toggle('active', isRemembered);
    btnEvalRepeat.classList.toggle('active', isRepeat);

    // Note textarea
    noteTextarea.value = progress.notes[currentItem.id] || '';
    noteContainer.classList.toggle('hidden', !isNoteOpen);

    // Answer visibility
    answerBox.classList.toggle('hidden', !isAnswerRevealed);
    toggleIconEl.innerHTML = getIconSvg(isAnswerRevealed ? 'eyeOff' : 'eye', 20);
    const toggleLabel = isAnswerRevealed ? (dict.hideAnswer || 'Cevabı Gizle') : (dict.showAnswer || 'Cevabı Gör');
    toggleAnswerLabel.textContent = toggleLabel;
    btnToggleAnswer.setAttribute('aria-label', toggleLabel);

    // Dynamic labels
    evalRepeatLabel.textContent = isTr ? 'Tekrar Et' : 'Perlu Diulang';
    evalRememberedLabel.textContent = isTr ? 'Hatırladım' : 'Dihafal';
    btnEvalRepeat.setAttribute('aria-label', evalRepeatLabel.textContent);
    btnEvalRemembered.setAttribute('aria-label', evalRememberedLabel.textContent);

    copyQaLabel.textContent = dict.copyText || 'Metni Kopyala';
    noteToggleLabel.textContent = dict.addNote || 'Faide Notu';
    noteInputLabel.textContent = dict.addNote || 'Faide Notu Ekle';
    noteTextarea.placeholder = dict.notePlaceholder || 'Ders notlarınızı buraya kaydedebilirsiniz...';
    saveNoteLabel.textContent = dict.saveNote || 'Notu Kaydet';
    prevLabel.textContent = dict.prevQuestion || 'Önceki';
    nextLabel.textContent = dict.nextQuestion || 'Sonraki';
    modeStudyLabel.textContent = dict.studyMode || 'Normal Mütalaa';
    modeExamLabel.textContent = dict.examMode || 'İmtihan Modu';
    modeReaderLabel.textContent = dict.readerMode || 'Düz Okuma';
  }

  // Navigation functions
  function goNext() {
    isAnswerRevealed = false;
    isNoteOpen = false;
    store.setState({ isAnswerRevealed: false });
    playPureSfx('next');

    const nextItem = getNextQuestion(
      questions,
      displayedIndices,
      state.activeAlgorithm,
      progress.repeatIds,
      progress.starredIds,
      currentIndex,
      'next'
    );

    if (nextItem) {
      const nextIdx = questions.findIndex((q) => q.id === nextItem.id);
      currentIndex = nextIdx >= 0 ? nextIdx : 0;
    } else {
      currentIndex = (currentIndex + 1) % Math.max(questions.length, 1);
    }

    markCurrentViewed();
    updateCard();
    slideSwap(questionContainerEl, 1);
  }

  function goPrev() {
    isAnswerRevealed = false;
    isNoteOpen = false;
    store.setState({ isAnswerRevealed: false });
    playPureSfx('prev');

    const prevItem = getNextSequentialQuestion(questions, currentIndex, 'prev');
    if (prevItem) {
      const prevIdx = questions.findIndex((q) => q.id === prevItem.id);
      currentIndex = prevIdx >= 0 ? prevIdx : 0;
    } else {
      currentIndex = (currentIndex - 1 + questions.length) % Math.max(questions.length, 1);
    }

    markCurrentViewed();
    updateCard();
    slideSwap(questionContainerEl, -1);
  }

  function toggleAnswer() {
    isAnswerRevealed = !isAnswerRevealed;
    store.setState({ isAnswerRevealed });
    playPureSfx(isAnswerRevealed ? 'reveal' : 'flip');
    updateCard();
    if (isAnswerRevealed) revealDown(answerBox);
  }

  function toggleStar() {
    const currentItem = questions[currentIndex];
    if (!currentItem) return;
    progress = toggleStarred(progress, currentItem.id);
    saveUserProgress(activeBook, progress);
    playPureSfx('toggle');
    updateCard();
    pop(starBtn, 0.7);
    store.setState({ lastProgressUpdate: Date.now() });
  }

  // Bind interactive events once
  chapterSelect.addEventListener('change', () => {
    activeChapter = chapterSelect.value;
    store.setState({ activeChapter });
    questions = getFilteredQuestions();
    currentIndex = 0;
    displayedIndices.length = 0;
    isAnswerRevealed = false;
    isNoteOpen = false;
    markCurrentViewed();
    updateCard();
  });

  container.querySelector('#btn-reset-chapter')?.addEventListener('click', () => {
    activeChapter = 'all';
    store.setState({ activeChapter: 'all' });
    questions = getFilteredQuestions();
    currentIndex = 0;
    updateChapterOptions();
    updateCard();
  });

  starBtn.addEventListener('click', toggleStar);
  btnPrev.addEventListener('click', goPrev);
  btnToggleAnswer.addEventListener('click', toggleAnswer);
  btnNext.addEventListener('click', goNext);

  container.querySelector('#btn-mode-exam')?.addEventListener('click', () => {
    playPureSfx('start');
    store.setState({ currentView: 'exam' });
  });

  container.querySelector('#btn-mode-reader')?.addEventListener('click', () => {
    playPureSfx('toggle');
    store.setState({ currentView: 'reader' });
  });

  btnEvalRemembered.addEventListener('click', () => {
    const currentItem = questions[currentIndex];
    if (!currentItem) return;
    const lang = store.getState().activeLang || 'tr';
    const dict = getDict(lang);

    progress = recordSelfEvaluation(progress, currentItem.id, 'remembered');
    saveUserProgress(activeBook, progress);
    playPureSfx('chime');
    pop(btnEvalRemembered);
    showToast(dict.evalConfirmedRemembered || 'Hafızaya kaydedildi');
    updateCard();
    store.setState({ lastProgressUpdate: Date.now() });
  });

  btnEvalRepeat.addEventListener('click', () => {
    const currentItem = questions[currentIndex];
    if (!currentItem) return;
    const lang = store.getState().activeLang || 'tr';
    const dict = getDict(lang);

    progress = recordSelfEvaluation(progress, currentItem.id, 'repeat');
    saveUserProgress(activeBook, progress);
    playPureSfx('repeat');
    pop(btnEvalRepeat);
    showToast(dict.evalConfirmedRepeat || 'Tekrar listesine eklendi');
    updateCard();
    store.setState({ lastProgressUpdate: Date.now() });
  });

  container.querySelector('#btn-copy-qa')?.addEventListener('click', () => {
    const currentItem = questions[currentIndex];
    if (!currentItem) return;
    const lang = store.getState().activeLang || 'tr';
    const isTr = lang === 'tr';
    const dict = getDict(lang);

    playPureSfx('click');
    const qRaw = isTr ? currentItem.question_tr : currentItem.question_id;
    const aRaw = isTr ? currentItem.answer_tr : currentItem.answer_id;

    const temp = document.createElement('div');
    temp.innerHTML = `${qRaw}\n\n${aRaw}`;
    const copyContent = temp.textContent || temp.innerText || '';

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(copyContent).catch(() => {});
    }
    showToast(dict.textCopied || 'Metin panoya kopyalandı');
  });

  container.querySelector('#btn-note-toggle')?.addEventListener('click', () => {
    isNoteOpen = !isNoteOpen;
    playPureSfx('toggle');
    noteContainer.classList.toggle('hidden', !isNoteOpen);
    if (isNoteOpen) {
      revealDown(noteContainer);
      noteTextarea.focus();
    }
  });

  btnSaveNote.addEventListener('click', () => {
    const currentItem = questions[currentIndex];
    if (!currentItem) return;
    const lang = store.getState().activeLang || 'tr';
    const dict = getDict(lang);

    const noteText = noteTextarea.value.trim();
    progress = saveNote(progress, currentItem.id, noteText);
    saveUserProgress(activeBook, progress);
    playPureSfx('click');
    showToast(dict.noteSaved || 'Not kaydedildi');
  });

  // Touch swipe handling
  const cardEl = container.querySelector('#study-card');
  let touchStartX = 0;
  let touchStartY = 0;

  function onTouchStart(e) {
    if (e.changedTouches && e.changedTouches[0]) {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }
  }

  function onTouchEnd(e) {
    if (e.changedTouches && e.changedTouches[0]) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    }
  }

  cardEl.addEventListener('touchstart', onTouchStart, { passive: true });
  cardEl.addEventListener('touchend', onTouchEnd, { passive: true });

  // Keyboard navigation
  function handleKeyDown(e) {
    const activeTag = document.activeElement?.tagName;
    if (activeTag === 'TEXTAREA' || activeTag === 'INPUT' || activeTag === 'SELECT') {
      return;
    }

    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      toggleAnswer();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      toggleStar();
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }

  // Reactive store subscription
  const unsubscribeStore = store.subscribe((nextState, prevState) => {
    state = nextState;

    if (nextState.activeBook !== prevState?.activeBook) {
      activeBook = nextState.activeBook || 'quduri';
      activeChapter = nextState.activeChapter || 'all';
      progress = loadUserProgress(activeBook);
      questions = getFilteredQuestions();
      currentIndex = typeof nextState.currentQuestionIndex === 'number' ? nextState.currentQuestionIndex : 0;
      displayedIndices.length = 0;
      isAnswerRevealed = false;
      updateChapterOptions();
      markCurrentViewed();
      updateCard();
    } else if (nextState.activeChapter !== prevState?.activeChapter) {
      activeChapter = nextState.activeChapter || 'all';
      questions = getFilteredQuestions();
      currentIndex = typeof nextState.currentQuestionIndex === 'number' ? nextState.currentQuestionIndex : 0;
      displayedIndices.length = 0;
      isAnswerRevealed = false;
      updateChapterOptions();
      chapterSelect.value = activeChapter;
      markCurrentViewed();
      updateCard();
    } else if (nextState.activeLang !== prevState?.activeLang) {
      updateChapterOptions();
      updateCard();
    } else if (typeof nextState.currentQuestionIndex === 'number' && nextState.currentQuestionIndex !== currentIndex) {
      currentIndex = nextState.currentQuestionIndex;
      markCurrentViewed();
      updateCard();
    }
  });

  // Initial load
  updateChapterOptions();
  updateCard();

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyDown);
    }
    cardEl.removeEventListener('touchstart', onTouchStart);
    cardEl.removeEventListener('touchend', onTouchEnd);
    if (typeof unsubscribeStore === 'function') {
      unsubscribeStore();
    }
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
  };
}
