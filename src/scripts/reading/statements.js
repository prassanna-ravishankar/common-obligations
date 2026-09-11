import { clamp, ease, timing } from "./timing.js";

export function createStatements(root = document) {
  const entries = [...root.querySelectorAll("[data-statement]")].map((el) => ({
    el,
    timer: null,
  }));
  return {
    setup(enabled) {
      for (const entry of entries) {
        clearTimeout(entry.timer);
        entry.timer = null;
        entry.el.toggleAttribute("data-statement-staged", enabled);
        if (!enabled) entry.el.style.removeProperty("--statement-presence");
      }
    },
    update() {
      for (const entry of entries) {
        const { el } = entry;
        if (!el.hasAttribute("data-statement-staged")) continue;
        const r = el.getBoundingClientRect();
        const p = clamp(
          (timing.rail - r.top) / (el.offsetHeight - innerHeight + timing.rail),
        );
        const inPlace =
          r.top < innerHeight * 0.2 && r.bottom > innerHeight * 0.65;
        if (inPlace && !el.hasAttribute("data-revealed") && !entry.timer) {
          entry.timer = setTimeout(() => {
            el.setAttribute("data-revealed", "");
            entry.timer = null;
          }, timing.statementDwellMs);
        } else if (!inPlace && entry.timer) {
          clearTimeout(entry.timer);
          entry.timer = null;
        }
        // Quick scrolling still reveals the complete sentence before the handoff.
        if (p > 0.25) el.setAttribute("data-revealed", "");
        el.style.setProperty(
          "--statement-presence",
          String(1 - ease(0.48, 0.86, p)),
        );
      }
    },
  };
}
