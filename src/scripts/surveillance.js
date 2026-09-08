import { $, setPressed } from "./dom.js";
import { stages } from "../data/surveillance.js";
import { motionAllowed, transitionContent } from "./transitions.js";

export function initSurveillance() {
  const story = $("[data-story]");
  const beats = [...story.querySelectorAll("[data-beat]")];
  const wide = matchMedia("(min-width: 1001px) and (min-height: 700px)");
  let stage = 0,
    choice = 0,
    comparing = false,
    queued = false;
  function selectStage(index, animate = false) {
    if (index === stage) return;
    stage = index;
    const scene = stages[stage];
    $(".scene").dataset.scene = stage;
    $("#scene-step").textContent = `0${stage + 1} / ${scene.name}`;
    $("#scene-kicker").textContent = scene.kicker;
    $("#scene-title").innerHTML = scene.title;
    $("#scene-description").textContent = scene.description;
    setPressed("[data-stage]", "stage", stage);
    if (animate) transitionContent(".scene-text");
  }
  function syncScroll() {
    queued = false;
    if (!wide.matches || !motionAllowed()) {
      story.style.removeProperty("--scene-depth");
      return;
    }
    const rect = story.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const threshold = $(".story-controls").getBoundingClientRect().bottom + 100;
    let index = 0;
    beats.forEach((beat, n) => {
      if (beat.getBoundingClientRect().top <= threshold) index = n;
    });
    selectStage(index);
    const progress = Math.max(
      0,
      Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)),
    );
    story.style.setProperty("--scene-depth", String(progress));
  }
  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(syncScroll);
    }
  }
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  addEventListener("motionchange", schedule);
  if ("ResizeObserver" in window)
    new ResizeObserver(schedule).observe($("#story-beats"));
  wide.addEventListener("change", () => {
    if (!wide.matches) selectStage(0);
    schedule();
  });
  story.querySelectorAll("[data-stage]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.stage);
      selectStage(index, true);
      const top =
        beats[index].getBoundingClientRect().top +
        scrollY -
        $(".story-controls").offsetHeight -
        88;
      window.scrollTo({ top, behavior: "instant" });
    });
  });
  function renderConditions() {
    story.classList.toggle("is-comparing", comparing);
    story.querySelectorAll("[data-condition]").forEach((result) => {
      result.hidden = !comparing && Number(result.dataset.condition) !== choice;
    });
    setPressed("[data-choice]", "choice", choice);
    $("#story-status").textContent = comparing
      ? "Both conditions shown at every stage."
      : `${choice ? "Independent check" : "Operator discretion"} shown at every stage.`;
    schedule();
  }
  story.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      choice = Number(button.dataset.choice);
      renderConditions();
      transitionContent(`[data-beat="${stage}"] .stage-result:not([hidden])`);
    });
  });
  $("#compare").addEventListener("click", () => {
    comparing = !comparing;
    $("#compare").setAttribute("aria-expanded", String(comparing));
    $("#compare").textContent = comparing
      ? "Show one condition"
      : "See both conditions together ↗";
    renderConditions();
  });
  schedule();
}
