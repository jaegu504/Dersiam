/**
 * Pure Web Audio API Sound Synthesizer
 * Generates synthetic audio in real time: instant, offline, zero bandwidth.
 * Zero external audio files.
 */

let audioCtx = null;
let lastAudioContextClass = null;
let muted = false;

/**
 * Returns or initializes the shared AudioContext instance.
 * @returns {AudioContext|null}
 */
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    audioCtx = null;
    lastAudioContextClass = null;
    return null;
  }

  if (AudioContextClass !== lastAudioContextClass) {
    audioCtx = null;
    lastAudioContextClass = AudioContextClass;
  }

  try {
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Checks if audio playback is currently muted.
 * @returns {boolean}
 */
export function isAudioMuted() {
  return muted;
}

/**
 * Sets the audio mute status.
 * @param {boolean} value
 * @returns {boolean} New mute status
 */
export function setAudioMute(value) {
  muted = Boolean(value);
  return muted;
}

/**
 * Toggles the audio mute status.
 * @returns {boolean} New mute status
 */
export function toggleAudioMute() {
  muted = !muted;
  return muted;
}

/**
 * Schedules one enveloped oscillator note.
 * @param {AudioContext} ctx
 * @param {{ f: number, to?: number, d: number, g: number, type?: OscillatorType, at?: number }} note
 */
function tone(ctx, { f, to, d, g, type = 'sine', at = 0 }) {
  const t = (ctx.currentTime || 0) + at;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + d);
  // 5ms attack avoids clicks, exponential tail keeps it soft
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(g, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + d);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + d + 0.02);
}

/**
 * Sound recipes. Gains stay low: these play dozens of times per session.
 */
const SFX = {
  // Soft tactile tick
  click: [{ f: 680, to: 420, d: 0.04, g: 0.12 }],
  // Card flip sweep
  flip: [{ f: 360, to: 160, d: 0.08, g: 0.15 }],
  // Gentle C-major bell for "remembered"
  chime: [523.25, 659.25, 783.99].map((f, i) => ({ f, d: 0.45, g: 0.08, at: i * 0.03 })),
  // Rising arpeggio when a study or exam session starts
  start: [392, 523.25, 659.25].map((f, i) => ({ f, d: 0.18, g: 0.09, type: 'triangle', at: i * 0.07 })),
  // Light swish forward / backward
  next: [{ f: 520, to: 780, d: 0.07, g: 0.07 }],
  prev: [{ f: 780, to: 520, d: 0.07, g: 0.07 }],
  // Sparkle when an answer or hidden word is revealed
  reveal: [{ f: 1318.5, d: 0.12, g: 0.06, type: 'triangle' }, { f: 1975.5, d: 0.2, g: 0.05, type: 'triangle', at: 0.06 }],
  // Low soft bump for "needs repeat"
  repeat: [{ f: 300, to: 210, d: 0.14, g: 0.12, type: 'triangle' }],
  // Exam clock
  tick: [{ f: 1200, d: 0.018, g: 0.04 }],
  tickUrgent: [{ f: 1560, d: 0.03, g: 0.08, type: 'triangle' }],
  timeUp: [{ f: 523.25, d: 0.22, g: 0.1, type: 'triangle' }, { f: 392, d: 0.38, g: 0.1, type: 'triangle', at: 0.18 }],
  // Bubble pop for search results appearing
  pop: [{ f: 420, to: 900, d: 0.07, g: 0.07 }],
  // Modal / panel opening
  open: [{ f: 440, d: 0.09, g: 0.06 }, { f: 659.25, d: 0.14, g: 0.06, at: 0.05 }],
  // Switches and option changes
  toggle: [{ f: 600, to: 900, d: 0.035, g: 0.08 }]
};

/**
 * Synthesizes a short sound effect in real time.
 * @param {keyof typeof SFX} type - Sound effect name
 */
export function playPureSfx(type) {
  if (muted) return;

  const ctx = getAudioContext();
  if (!ctx || typeof ctx.createOscillator !== 'function' || typeof ctx.createGain !== 'function') {
    return;
  }

  const notes = SFX[type];
  if (!notes) return;

  try {
    notes.forEach((note) => tone(ctx, note));
  } catch {
    // Graceful no-op on sound synthesis failures
  }
}
