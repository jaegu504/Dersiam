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
 * Synthesizes a haptic sound effect in real time.
 * @param {'click' | 'flip' | 'chime'} type - Type of sound effect
 */
export function playPureSfx(type) {
  if (muted) return;

  const ctx = getAudioContext();
  if (!ctx || typeof ctx.createOscillator !== 'function' || typeof ctx.createGain !== 'function') {
    return;
  }

  try {
    const now = ctx.currentTime || 0;

    if (type === 'click') {
      // Soft tactile tick: 680Hz -> 420Hz over 40ms
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'flip') {
      // Card flip sweep: 360Hz -> 160Hz over 80ms
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'chime') {
      // Gentle harmonic bell (C5=523Hz, E5=659Hz, G5=784Hz)
      const frequencies = [523.25, 659.25, 783.99];
      const duration = 0.45;

      frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const startTime = now + index * 0.03;
        const endTime = startTime + duration;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(endTime);
      });
    }
  } catch {
    // Graceful no-op on sound synthesis failures
  }
}
