// Shared geometry and editorial pacing. Values are scroll fractions, except svh/ms.
export const timing = {
  rail: 64,
  perspectiveSvh: 140,
  togetherSvh: 100,
  questionSvh: 100,
  questionIntro: 0.16,
  questionReadingEnd: 0.84,
  questionExit: 0.9,
  statementDwellMs: 700,
};
export const clamp = (x) => Math.min(1, Math.max(0, x));
export const ease = (a, b, p) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const trackProgress = (el) =>
  clamp(
    (timing.rail - el.getBoundingClientRect().top) /
      (el.offsetHeight - (innerHeight - timing.rail)),
  );
export function seek(el, p) {
  scrollTo(
    0,
    el.getBoundingClientRect().top +
      scrollY -
      timing.rail +
      (el.offsetHeight - (innerHeight - timing.rail)) * p,
  );
}
