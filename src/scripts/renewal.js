import { scenarios } from "../data/scenarios.js";
const clamp = (x) => Math.min(1, Math.max(0, x));
const ease = (a, b, p) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export function initRenewal() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const wide = matchMedia("(min-width: 1050px) and (min-height: 850px)");
  const sequences = [...document.querySelectorAll("[data-reading-sequence]")];
  const thresholds = [...document.querySelectorAll("[data-fresh-threshold]")];
  const motion = document.querySelector("[data-motion-toggle]");
  let paused = false,
    queued = false;
  const enabled = () => !paused && !reduce.matches && wide.matches;
  function setup() {
    document.body.classList.toggle("reading-motion", enabled());
    sequences.forEach((sequence) => {
      sequence.toggleAttribute("data-staged", enabled());
      const max = Math.max(
        ...[...sequence.querySelectorAll("[data-focus]")].map(
          (e) => e.offsetHeight,
        ),
      );
      const fits = enabled() && max + 160 < innerHeight - 64;
      sequence.toggleAttribute("data-staged", fits);
      sequence.querySelector(".reading-bypass").hidden = !fits;
      sequence.style.setProperty(
        "--reading-travel",
        `${Number(sequence.dataset.count) * 160}svh`,
      );
    });
    if (motion) {
      motion.textContent = paused ? "Enable motion" : "Pause motion";
      motion.setAttribute("aria-pressed", String(paused));
    }
    schedule();
  }
  function update() {
    queued = false;
    thresholds.forEach((el) => {
      const r = el.getBoundingClientRect();
      const p = enabled()
        ? clamp((innerHeight - r.top) / (innerHeight + r.height))
        : 0.5;
      el.style.setProperty("--scene-progress", String(p));
    });
    sequences.forEach((sequence) => {
      if (!sequence.hasAttribute("data-staged")) return;
      const r = sequence.getBoundingClientRect();
      const p = clamp(
        (64 - r.top) / (sequence.offsetHeight - (innerHeight - 64)),
      );
      sequence.style.setProperty("--scene-progress", String(p));
      const count = Number(sequence.dataset.count);
      const index = Math.min(count - 1, Math.floor(p * count));
      const local = p * count - index;
      sequence.dataset.focused = String(index);
      sequence.querySelectorAll("[data-focus]").forEach((el, i) => {
        // A long stationary reading hold; exits clear before the next argument arrives.
        const presence =
          i === index
            ? (index === 0 ? 1 : ease(0, 0.13, local)) *
              (index === count - 1 ? 1 : 1 - ease(0.83, 1, local))
            : 0;
        el.style.opacity = String(presence);
      });
      sequence.querySelector(".reading-position").textContent =
        `${index + 1} / ${count} perspectives`;
    });
    let active = "decisions";
    for (const s of scenarios)
      if (document.getElementById(s.id)?.getBoundingClientRect().top < 190)
        active = s.id;
    if (
      document.getElementById("obligations")?.getBoundingClientRect().top < 190
    )
      active = "obligations";
    if (document.getElementById("reading")?.getBoundingClientRect().top < 190)
      active = "reading";
    const label = document.querySelector("[data-current-chapter]");
    if (label)
      label.textContent =
        scenarios.find((s) => s.id === active)?.title ||
        (active === "obligations"
          ? "Common obligations"
          : active === "reading"
            ? "The full essay"
            : "Six scenarios");
    document.querySelectorAll(".chapter-chooser a").forEach((a) => {
      if (a.hash === "#" + active) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }
  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }
  sequences.forEach((sequence) =>
    sequence.querySelector(".reading-bypass").addEventListener("click", () => {
      const target = document.getElementById(
        sequence.dataset.readingSequence + "-all",
      );
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }),
  );
  motion?.addEventListener("click", () => {
    paused = !paused;
    setup();
  });
  document
    .querySelectorAll(".chapter-chooser a")
    .forEach((a) =>
      a.addEventListener("click", () =>
        a.closest("details").removeAttribute("open"),
      ),
    );
  addEventListener("keydown", (e) => {
    if (e.key === "Escape")
      document.querySelector(".chapter-chooser")?.removeAttribute("open");
  });
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", setup);
  reduce.addEventListener("change", setup);
  document.querySelector(".incident-origin")?.addEventListener("change", setup);
  document.fonts.ready.then(setup);
}
