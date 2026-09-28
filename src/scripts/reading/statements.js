import { clamp, ease, timing } from "./timing.js";

// Scrubbed, never timed: the emphasis settles as the sentence rises into its
// reading position and is complete by the time the sentence is held.
export function createStatements(root = document) {
  const entries = [...root.querySelectorAll("[data-statement]")];
  return {
    setup(enabled) {
      for (const el of entries) {
        el.toggleAttribute("data-statement-staged", enabled);
        if (enabled) continue;
        el.style.removeProperty("--statement-presence");
        el.style.removeProperty("--statement-emphasis");
      }
    },
    update() {
      for (const el of entries) {
        if (!el.hasAttribute("data-statement-staged")) continue;
        const r = el.getBoundingClientRect();
        const p = clamp(
          (timing.rail - r.top) / (el.offsetHeight - innerHeight + timing.rail),
        );
        // The sentence is centred in a sticky stage below the rail.
        const centre =
          (Math.max(r.top, timing.rail) + (innerHeight - timing.rail) / 2) /
          innerHeight;
        el.style.setProperty(
          "--statement-emphasis",
          String(1 - ease(0.6, 0.8, centre)),
        );
        el.style.setProperty(
          "--statement-presence",
          String(1 - ease(0.48, 0.86, p)),
        );
      }
    },
  };
}
