import { createTimeline } from "./reading/timeline.js";
import { clamp } from "./reading/timing.js";
import { createQuestions } from "./reading/questions.js";
import { createStatements } from "./reading/statements.js";
import { createNavigation } from "./reading/navigation.js";

// One scroll/resize scheduler; modules own their elements and state.
export function initRenewal() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  // Reading stages need more room than the decorative timeline. Keep these gates distinct.
  const timelineWide = matchMedia(
    "(min-width: 1001px) and (min-height: 700px)",
  );
  const timeline = createTimeline();
  const wide = matchMedia("(min-width: 1050px) and (min-height: 850px)");
  const questions = createQuestions(document, schedule);
  const statements = createStatements();
  const navigation = createNavigation();
  const thresholds = [...document.querySelectorAll("[data-fresh-threshold]")];
  const motion = [...document.querySelectorAll("[data-motion-toggle]")];
  let paused = false,
    queued = false;
  const enabled = () => !paused && !reduce.matches && wide.matches;
  const progress = new Map();
  function update() {
    queued = false;
    thresholds.forEach((el) => {
      const r = el.getBoundingClientRect();
      const p = enabled()
        ? clamp((innerHeight - r.top) / (innerHeight + r.height)).toFixed(4)
        : "0.5";
      // Offscreen scenes settle at 0 or 1; skip writes that would only recalc style.
      if (progress.get(el) === p) return;
      progress.set(el, p);
      el.style.setProperty("--scene-progress", p);
    });
    timeline.update();
    questions.update();
    statements.update();
    navigation.update();
  }
  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }
  function setup() {
    document.documentElement.classList.toggle("motion-paused", paused);
    document.body.classList.toggle("reading-motion", enabled());
    questions.setup(enabled());
    statements.setup(enabled());
    timeline.setup(!paused && !reduce.matches && timelineWide.matches);
    for (const button of motion) {
      button.hidden = false;
      button.textContent = paused ? "Enable motion" : "Pause motion";
      button.setAttribute("aria-pressed", String(paused));
    }
    schedule();
  }
  motion.forEach((button) =>
    button.addEventListener("click", () => {
      paused = !paused;
      setup();
    }),
  );
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", setup);
  reduce.addEventListener("change", setup);
  document.querySelector(".incident-origin")?.addEventListener("change", setup);
  addEventListener("hashchange", questions.resolveHash);
  document.fonts.ready.then(() => {
    setup();
    questions.resolveHash();
  });
}
