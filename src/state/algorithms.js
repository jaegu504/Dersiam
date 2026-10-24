/**
 * Shuffle and Navigation Algorithms for 6-Kitab Madrasah Q&A Portal.
 * Supports:
 * 1. Original Random (preserves legacy repo behavior using cycle tracking).
 * 2. Sequential Navigation (forward/backward wrapping).
 * 3. Spaced Repetition (3x weight for repeated or starred items).
 * 4. Dispatcher.
 */

/**
 * Returns the next random question, ensuring no repetition until all questions
 * in the active scope have been displayed.
 *
 * @param {Array} questions - Array of question items.
 * @param {Array<number>} displayedIndices - Array tracking indices of displayed questions in current cycle.
 * @returns {object|null} Selected question item or null if questions array is empty.
 */
export function getNextOriginalRandomQuestion(questions, displayedIndices = []) {
  if (!questions || questions.length === 0) {
    return null;
  }

  if (displayedIndices.length >= questions.length) {
    displayedIndices.length = 0;
  }

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * questions.length);
  } while (displayedIndices.includes(randomIndex) && displayedIndices.length < questions.length);

  displayedIndices.push(randomIndex);
  return questions[randomIndex];
}

/**
 * Returns the next or previous sequential question in the list, wrapping around
 * at the start and end of the question list.
 *
 * @param {Array} questions - Array of question items.
 * @param {number} currentIndex - Index of current question in questions array.
 * @param {'next'|'prev'} direction - Navigation direction ('next' or 'prev').
 * @returns {object|null} Next question item or null if questions array is empty.
 */
export function getNextSequentialQuestion(questions, currentIndex, direction = 'next') {
  if (!questions || questions.length === 0) {
    return null;
  }

  let nextIndex;
  if (direction === 'prev') {
    if (currentIndex === null || currentIndex === undefined || currentIndex <= 0 || currentIndex >= questions.length) {
      nextIndex = questions.length - 1;
    } else {
      nextIndex = currentIndex - 1;
    }
  } else {
    if (currentIndex === null || currentIndex === undefined || currentIndex < 0 || currentIndex >= questions.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex = currentIndex + 1;
    }
  }

  return questions[nextIndex];
}

/**
 * Returns the next question using spaced repetition logic.
 * Questions in repeatIds or starredIds receive 3x probability weight.
 * Maintains non-repetition cycle tracking via displayedIndices.
 *
 * @param {Array} questions - Array of question items.
 * @param {Array<string>} repeatIds - Array of question IDs marked for repetition.
 * @param {Array<string>} starredIds - Array of question IDs marked as starred.
 * @param {Array<number>} displayedIndices - Array tracking displayed question indices.
 * @returns {object|null} Selected question item or null if questions array is empty.
 */
export function getNextSpacedRepetitionQuestion(questions, repeatIds = [], starredIds = [], displayedIndices = []) {
  if (!questions || questions.length === 0) {
    return null;
  }

  if (displayedIndices.length >= questions.length) {
    displayedIndices.length = 0;
  }

  const availableIndices = [];
  for (let i = 0; i < questions.length; i++) {
    if (!displayedIndices.includes(i)) {
      availableIndices.push(i);
    }
  }

  if (availableIndices.length === 0) {
    displayedIndices.length = 0;
    for (let i = 0; i < questions.length; i++) {
      availableIndices.push(i);
    }
  }

  const weights = availableIndices.map(index => {
    const q = questions[index];
    const isPriority = (repeatIds && repeatIds.includes(q.id)) || (starredIds && starredIds.includes(q.id));
    return isPriority ? 3 : 1;
  });

  const totalWeight = weights.reduce((acc, w) => acc + w, 0);
  let randomWeight = Math.random() * totalWeight;
  let selectedIndex = availableIndices[0];

  for (let i = 0; i < availableIndices.length; i++) {
    randomWeight -= weights[i];
    if (randomWeight <= 0) {
      selectedIndex = availableIndices[i];
      break;
    }
  }

  displayedIndices.push(selectedIndex);
  return questions[selectedIndex];
}

/**
 * Universal question dispatcher based on the chosen algorithm.
 *
 * @param {Array} questions - Array of question items.
 * @param {Array<number>} displayedIndices - Tracking array for random/spaced cycles.
 * @param {'random'|'original'|'sequential'|'spaced'} algorithm - Algorithm selection.
 * @param {Array<string>} repeatIds - Questions marked for repetition.
 * @param {Array<string>} starredIds - Questions marked as starred.
 * @param {number} currentIndex - Current question index for sequential mode.
 * @param {'next'|'prev'} direction - Navigation direction for sequential mode.
 * @returns {object|null} Next question item.
 */
export function getNextQuestion(
  questions,
  displayedIndices = [],
  algorithm = 'random',
  repeatIds = [],
  starredIds = [],
  currentIndex = -1,
  direction = 'next'
) {
  if (algorithm === 'sequential') {
    return getNextSequentialQuestion(questions, currentIndex, direction);
  }

  if (algorithm === 'spaced') {
    return getNextSpacedRepetitionQuestion(questions, repeatIds, starredIds, displayedIndices);
  }

  return getNextOriginalRandomQuestion(questions, displayedIndices);
}
