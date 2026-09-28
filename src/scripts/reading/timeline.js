import { clamp } from "./timing.js";

// Decoration only: all reading content stays in normal flow in every mode.
// The axis draws while it travels from the lower edge to the middle of the viewport.
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
      const p = clamp((innerHeight * 0.95 - top) / (innerHeight * 0.45));
      if (p === last) return;
      last = p;
      section.style.setProperty("--timeline-progress", p.toFixed(4));
    },
  };
}
