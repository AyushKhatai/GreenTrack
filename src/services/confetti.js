import confetti from 'canvas-confetti';

/**
 * GreenTrack canonical confetti — Block 4 / P3 consolidation.
 *
 * Two configurations:
 *   small  — quick, restrained feedback for routine interactions
 *            (water a tree, switch a guild).
 *   major  — celebratory burst for milestone moments
 *            (register a sapling, complete a quest, etc).
 *
 * Both honor `prefers-reduced-motion: reduce` and skip silently
 * when the API is unavailable. No callers should bypass this
 * module — keep the trigger surface consolidated.
 */

const PALETTE_GREEN = ['#22c55e', '#16a34a', '#10b981', '#6ee7b7'];
const PALETTE_MIXED = ['#22c55e', '#16a34a', '#10b981', '#6ee7b7', '#eab308'];

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function fire(options) {
  if (prefersReducedMotion()) return;
  try {
    confetti(options);
  } catch (e) {
    /* noop — canvas-confetti can throw in test environments */
  }
}

/** Quick restrained burst — water, switch guild, small interactions. */
export function confettiSmall(origin = { y: 0.7 }) {
  fire({
    particleCount: 25,
    spread: 40,
    startVelocity: 24,
    origin,
    colors: PALETTE_GREEN,
    disableForReducedMotion: true,
    scalar: 0.85,
  });
}

/** Major celebration — register tree, complete quest, milestone. */
export function confettiMajor(origin = { y: 0.6 }) {
  fire({
    particleCount: 80,
    spread: 70,
    startVelocity: 32,
    origin,
    colors: PALETTE_MIXED,
    disableForReducedMotion: true,
    scalar: 1,
  });
}

/** Re-export the raw module so legacy callers can still import from one place. */
export default confetti;