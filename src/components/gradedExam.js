/**
 * Graded exam ("Puanlı İmtihan" / "Ujian Bernilai").
 * A teacher examines a student orally: 10 random questions from one chapter or
 * the whole book, each marked 10 / 5 / 0 points, with a final score out of 100.
 */

import { dictionary } from '../data/dictionary.js';
import { booksMetadata } from '../data/books.js';
import { playPureSfx } from '../services/audio.js';
import { revealDown, slideSwap, pop, staggerIn } from '../services/motion.js';
import { getIconSvg } from './icons.js';

export const EXAM_SIZE = 10;
export const MARKS = { correct: 10, half: 5, wrong: 0 };

/**
 * Picks up to `count` distinct questions at random (Fisher-Yates) from a chapter or the whole book.
 * @param {object[]} questions
 * @param {string} chapterId - 'all' for the whole book
 * @param {number} [count]
 * @param {() => number} [random]
 * @returns {object[]}
 */
export function pickExamQuestions(questions, chapterId, count = EXAM_SIZE, random = Math.random) {
  const pool = chapterId && chapterId !== 'all' ? questions.filter((q) => q.chapterId === chapterId) : [...questions];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/**
 * Sums the points of graded questions; ungraded ones count as nothing.
 * @param {Array<number|null|undefined>} marks
 * @returns {number}
 */
export function scoreExam(marks) {
  return marks.reduce((sum, m) => sum + (typeof m === 'number' ? m : 0), 0);
}

const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const plain = (html) => String(html ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Mounts the graded exam into its section of the exam view.
 * @param {HTMLElement} section
 * @param {{ store: object, getQuestions: () => object[], getBook: () => string }} deps
 * @returns {{ refresh: Function }}
 */
export function mountGradedExam(section, { store, getQuestions, getBook }) {
  let phase = 'setup'; // 'setup' | 'question' | 'result'
  let scope = 'all';
  let student = '';
  let picked = [];
  let marks = [];
  let index = 0;
  let revealed = false;

  const lang = () => (store.getState().activeLang === 'id' ? 'id' : 'tr');
  const dict = () => dictionary[lang()] || dictionary.tr;
  const isTr = () => lang() === 'tr';

  function chapters() {
    const map = new Map();
    for (const q of getQuestions()) {
      if (q.chapterId && !map.has(q.chapterId)) map.set(q.chapterId, { id: q.chapterId, nameTr: q.chapterNameTr, nameId: q.chapterNameId, count: 0 });
      if (q.chapterId) map.get(q.chapterId).count += 1;
    }
    return [...map.values()];
  }

  function chapterName(id) {
    if (id === 'all') return dict().gradedWholeBook;
    const ch = chapters().find((c) => c.id === id);
    return ch ? (isTr() ? ch.nameTr : ch.nameId) || id : id;
  }

  function textClass(tr) {
    return tr ? 'font-arabic text-rtl' : 'font-latin text-ltr';
  }

  function renderSetup() {
    const d = dict();
    const total = getQuestions().length;
    const options = [
      `<option value="all"${scope === 'all' ? ' selected' : ''}>${escapeHtml(d.gradedWholeBook)} (${total})</option>`,
      ...chapters().map((c) => `<option value="${escapeHtml(c.id)}"${scope === c.id ? ' selected' : ''}>${escapeHtml(isTr() ? c.nameTr || c.id : c.nameId || c.id)} (${c.count})</option>`)
    ].join('');
    section.innerHTML = `
      <div class="graded-card neu-card flex flex-col gap-5">
        <div class="flex flex-col gap-1">
          <h2 class="graded-title">${escapeHtml(d.gradedTitle)}</h2>
          <p class="text-secondary text-sm">${escapeHtml(d.gradedIntro)}</p>
        </div>
        <label class="graded-field">
          <span>${escapeHtml(d.gradedScope)}</span>
          <select id="graded-scope" class="neu-input">${options}</select>
        </label>
        <label class="graded-field">
          <span>${escapeHtml(d.gradedStudent)}</span>
          <input id="graded-student" class="neu-input" type="text" autocomplete="off" maxlength="60" value="${escapeHtml(student)}" placeholder="${escapeHtml(d.gradedStudentPlaceholder)}" />
        </label>
        <div class="graded-rules">
          <span class="graded-rule is-correct">${escapeHtml(d.gradedCorrect)} +${MARKS.correct}</span>
          <span class="graded-rule is-half">${escapeHtml(d.gradedHalf)} +${MARKS.half}</span>
          <span class="graded-rule is-wrong">${escapeHtml(d.gradedWrong)} ${MARKS.wrong}</span>
        </div>
        <button id="btn-graded-start" class="neu-button neu-button-primary w-full" type="button">
          ${getIconSvg('modeExam', 18)}<span>${escapeHtml(d.gradedStart)}</span>
        </button>
      </div>`;
    section.querySelector('#graded-scope').addEventListener('change', (e) => { scope = e.target.value; });
    section.querySelector('#graded-student').addEventListener('input', (e) => { student = e.target.value; });
    section.querySelector('#btn-graded-start').addEventListener('click', start);
  }

  function start() {
    picked = pickExamQuestions(getQuestions(), scope);
    marks = new Array(picked.length).fill(null);
    index = 0;
    revealed = false;
    phase = picked.length ? 'question' : 'setup';
    playPureSfx('start');
    render();
  }

  function renderQuestion() {
    const d = dict();
    const item = picked[index];
    const tr = isTr();
    const dots = picked.map((_, i) => {
      const m = marks[i];
      const cls = m === MARKS.correct ? 'is-correct' : m === MARKS.half ? 'is-half' : m === MARKS.wrong ? 'is-wrong' : i === index ? 'is-current' : '';
      return `<i class="graded-dot ${cls}"></i>`;
    }).join('');
    section.innerHTML = `
      <div class="graded-card neu-card flex flex-col gap-4">
        <div class="flex items-center justify-between gap-2">
          <span id="graded-counter" class="neu-badge neu-badge-info">${escapeHtml(d.questionNumberPrefix)} ${index + 1} / ${picked.length}</span>
          <span class="graded-score-live">${escapeHtml(d.gradedScoreLabel)}: <b>${scoreExam(marks)}</b></span>
        </div>
        <div class="graded-dots" aria-hidden="true">${dots}</div>
        <span class="neu-badge neu-badge-accent graded-chapter">${escapeHtml(tr ? item.chapterNameTr : item.chapterNameId)}</span>
        <div id="graded-question" data-id="${escapeHtml(item.id)}" class="graded-question ${textClass(tr)}">${escapeHtml(plain(tr ? item.question_tr : item.question_id))}</div>
        <button id="btn-graded-reveal" class="neu-button w-full" type="button" aria-expanded="${revealed}">
          ${getIconSvg(revealed ? 'eyeOff' : 'eye', 18)}<span>${escapeHtml(revealed ? d.hideAnswer : d.showAnswer)}</span>
        </button>
        <div id="graded-answer" class="graded-answer ${textClass(tr)}${revealed ? '' : ' hidden'}">${tr ? item.answer_tr : item.answer_id}</div>
        <div class="graded-marks" role="group" aria-label="${escapeHtml(d.gradedScoreLabel)}">
          <button type="button" class="neu-button graded-mark is-wrong" data-mark="wrong">${escapeHtml(d.gradedWrong)}<small>${MARKS.wrong}</small></button>
          <button type="button" class="neu-button graded-mark is-half" data-mark="half">${escapeHtml(d.gradedHalf)}<small>+${MARKS.half}</small></button>
          <button type="button" class="neu-button graded-mark is-correct" data-mark="correct">${escapeHtml(d.gradedCorrect)}<small>+${MARKS.correct}</small></button>
        </div>
      </div>`;

    section.querySelector('#btn-graded-reveal').addEventListener('click', () => {
      revealed = !revealed;
      playPureSfx(revealed ? 'reveal' : 'flip');
      renderQuestion();
      if (revealed) revealDown(section.querySelector('#graded-answer'));
    });
    section.querySelectorAll('.graded-mark').forEach((btn) => btn.addEventListener('click', () => grade(btn.dataset.mark)));
  }

  function grade(mark) {
    marks[index] = MARKS[mark];
    playPureSfx(mark === 'correct' ? 'chime' : mark === 'half' ? 'toggle' : 'repeat');
    if (index + 1 < picked.length) {
      index += 1;
      revealed = false;
      renderQuestion();
      slideSwap(section.querySelector('.graded-card'), 1);
    } else {
      phase = 'result';
      playPureSfx('start');
      render();
    }
  }

  function renderResult() {
    const d = dict();
    const tr = isTr();
    const total = scoreExam(marks);
    const max = picked.length * MARKS.correct;
    const book = booksMetadata[getBook()] || {};
    const count = (v) => marks.filter((m) => m === v).length;
    const rows = picked.map((q, i) => {
      const m = marks[i];
      const cls = m === MARKS.correct ? 'is-correct' : m === MARKS.half ? 'is-half' : 'is-wrong';
      return `
        <li class="graded-result-row">
          <span class="graded-result-num">${i + 1}</span>
          <span class="graded-result-q ${textClass(tr)}">${escapeHtml(plain(tr ? q.question_tr : q.question_id))}</span>
          <span class="graded-result-mark ${cls}">${m}</span>
        </li>`;
    }).join('');
    section.innerHTML = `
      <div class="graded-card neu-card flex flex-col gap-5">
        <div class="graded-result-head">
          <span class="text-secondary text-sm">${escapeHtml(tr ? book.titleTr : book.titleId)} · ${escapeHtml(chapterName(scope))}</span>
          ${student.trim() ? `<span class="graded-student-name">${escapeHtml(student.trim())}</span>` : ''}
          <div id="graded-total" class="graded-total"><b>${total}</b><span>/ ${max}</span></div>
          <div class="graded-tally">
            <span class="is-correct">${escapeHtml(d.gradedCorrect)} ${count(MARKS.correct)}</span>
            <span class="is-half">${escapeHtml(d.gradedHalf)} ${count(MARKS.half)}</span>
            <span class="is-wrong">${escapeHtml(d.gradedWrong)} ${count(MARKS.wrong)}</span>
          </div>
        </div>
        <ol class="graded-result-list">${rows}</ol>
        <div class="flex flex-col gap-2">
          <button id="btn-graded-again" class="neu-button neu-button-primary w-full" type="button">${getIconSvg('refresh', 18)}<span>${escapeHtml(d.gradedAgain)}</span></button>
          <button id="btn-graded-setup" class="neu-button w-full" type="button"><span>${escapeHtml(d.gradedChangeSettings)}</span></button>
        </div>
      </div>`;
    section.querySelector('#btn-graded-again').addEventListener('click', start);
    section.querySelector('#btn-graded-setup').addEventListener('click', () => {
      playPureSfx('toggle');
      phase = 'setup';
      render();
    });
    pop(section.querySelector('#graded-total'), 0.6);
    staggerIn(section.querySelectorAll('.graded-result-row'), { y: 8, stagger: 0.04 });
  }

  function render() {
    if (phase === 'question' && picked.length) renderQuestion();
    else if (phase === 'result') renderResult();
    else renderSetup();
  }

  /** Re-render for a language change; a new book or source starts over. */
  function refresh({ reset = false } = {}) {
    if (reset) {
      phase = 'setup';
      scope = 'all';
      picked = [];
      marks = [];
    }
    render();
  }

  render();
  return { refresh };
}
