import { clamp } from "./timing.js";

// Decoration only: all reading content stays in normal flow in every mode.
export function createTimeline() {
  const section = document.querySelector("[data-timeline]");
  let enabled = false;
  return {
    setup(value) {
      enabled = value;
      section?.classList.toggle("timeline-motion", enabled);
      if (!enabled) section?.style.removeProperty("--timeline-progress");
    },
    update() {
      if (!section || !enabled) return;
      const { top, height } = section.getBoundingClientRect();
      section.style.setProperty(
        "--timeline-progress",
        String(clamp((innerHeight - top) / (height + innerHeight))),
      );
    },
  };
}
