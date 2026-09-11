import { clamp } from "./reading/timing.js";
import { createQuestions } from "./reading/questions.js";
import { createStatements } from "./reading/statements.js";
import { createNavigation } from "./reading/navigation.js";

// One scroll/resize scheduler; modules own their elements and state.
export function initRenewal() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const wide = matchMedia("(min-width: 1050px) and (min-height: 850px)");
  const questions = createQuestions();
  const statements = createStatements();
  const navigation = createNavigation();
  const thresholds = [...document.querySelectorAll("[data-fresh-threshold]")];
  const motion = document.querySelector("[data-motion-toggle]");
  let paused = false,
    queued = false;
  const enabled = () => !paused && !reduce.matches && wide.matches;
  function update() {
    queued = false;
    thresholds.forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty(
        "--scene-progress",
        String(
          enabled()
            ? clamp((innerHeight - r.top) / (innerHeight + r.height))
            : 0.5,
        ),
      );
    });
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
    document.body.classList.toggle("reading-motion", enabled());
    questions.setup(enabled());
    statements.setup(enabled());
    if (motion) {
      motion.textContent = paused ? "Enable motion" : "Pause motion";
      motion.setAttribute("aria-pressed", String(paused));
    }
    schedule();
  }
  motion?.addEventListener("click", () => {
    paused = !paused;
    setup();
  });
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
