/**
 * Motion helpers (GSAP) for the "Taman Ilmu" theme.
 * Every helper is a safe no-op when the element is missing, when the user
 * prefers reduced motion, or when running outside a browser (tests).
 */

import { gsap } from 'gsap';

function canAnimate(target) {
  if (!target || (target.length !== undefined && target.length === 0)) return false;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  if (typeof window.requestAnimationFrame !== 'function') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function run(target, fn) {
  if (!canAnimate(target)) return;
  try {
    fn();
  } catch {
    // Animation is decoration; never break the UI over it
  }
}

/** Staggered entrance for a list of cards or rows. */
export function staggerIn(targets, { y = 18, stagger = 0.06, delay = 0 } = {}) {
  run(targets, () => {
    gsap.fromTo(targets,
      { autoAlpha: 0, y },
      { autoAlpha: 1, y: 0, duration: 0.5, stagger, delay, ease: 'back.out(1.6)', clearProps: 'transform,opacity,visibility' });
  });
}

/** Content revealed below a trigger (answer box, note, oral answer). */
export function revealDown(el) {
  run(el, () => {
    gsap.fromTo(el,
      { autoAlpha: 0, y: -10, scale: 0.98 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: 'back.out(1.8)', clearProps: 'transform,opacity,visibility' });
  });
}

/** Card content slides in from the side it was navigated toward. */
export function slideSwap(el, direction = 1) {
  run(el, () => {
    gsap.fromTo(el,
      { autoAlpha: 0, x: 28 * direction },
      { autoAlpha: 1, x: 0, duration: 0.38, ease: 'power3.out', clearProps: 'transform,opacity,visibility' });
  });
}

/** Springy press confirmation for buttons and badges. */
export function pop(el, scale = 0.9) {
  run(el, () => {
    gsap.fromTo(el, { scale }, { scale: 1, duration: 0.5, ease: 'back.out(3)', clearProps: 'transform' });
  });
}

/** Short horizontal shake, used when time runs out. */
export function shake(el) {
  run(el, () => {
    gsap.fromTo(el, { x: 0 }, { x: 0, duration: 0.5, ease: 'none', keyframes: { x: [0, -7, 7, -5, 5, -2, 0] }, clearProps: 'transform' });
  });
}

/** Modal dialog entrance. */
export function dialogIn(backdrop, dialog) {
  run(dialog, () => {
    gsap.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'power1.out', clearProps: 'opacity,visibility' });
    gsap.fromTo(dialog,
      { autoAlpha: 0, y: 24, scale: 0.96 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.6)', clearProps: 'transform,opacity,visibility' });
  });
}
