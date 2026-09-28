import { clamp } from "./timing.js";

// Decoration only: all reading content stays in normal flow in every mode.
// The axis draws while it crosses the reader's gaze: from three quarters of the
// way down the viewport to the upper quarter, where a reader's eye rests.
export function createTimeline() {
  const section = document.querySelector("[data-timeline]");
  const axis = section?.querySelector("[data-timeline-axis]");
  let enabled = false,
    last;
  return {
    setup(value) {
      enabled = value;
      last = undefined;
      section?.classList.toggle("timeline-motion", enabled);
      if (!enabled) section?.style.removeProperty("--timeline-progress");
    },
    update() {
      if (!axis || !enabled) return;
      const { top } = axis.getBoundingClientRect();
      const p = clamp((innerHeight * 0.75 - top) / (innerHeight * 0.5));
      if (p === last) return;
      last = p;
      section.style.setProperty("--timeline-progress", p.toFixed(4));
    },
  };
}
