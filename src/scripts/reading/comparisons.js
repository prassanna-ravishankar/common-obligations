import { ease } from "./timing.js";

// One semantic set of arguments: attention changes, positions never do.
export function paintComparison(sequence, p) {
  sequence.style.setProperty("--scene-progress", String(p));
  const count = Number(sequence.dataset.count);
  const phase = Math.min(count, (p / 0.8) * count);
  const index = Math.min(count - 1, Math.floor(phase));
  const local = phase - index;
  const together = ease(0.75, 0.84, p);
  sequence.dataset.focused = together === 1 ? "all" : String(index);
  sequence.querySelectorAll("[data-focus]").forEach((el, i) => {
    let attention = i === index ? 1 : 0;
    if (index < count - 1 && local > 0.72) {
      const cross = ease(0.72, 1, local);
      if (i === index) attention = 1 - cross;
      if (i === index + 1) attention = cross;
    }
    el.style.setProperty(
      "--attention",
      String(attention + (1 - attention) * together),
    );
  });
}
