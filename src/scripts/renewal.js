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
      const fits = enabled() && max + 120 < innerHeight - 64;
      sequence.toggleAttribute("data-staged", fits);
      sequence.querySelector(".reading-bypass").hidden = !fits;
      sequence.style.setProperty(
        "--reading-travel",
        `${Number(sequence.dataset.count) * 140 + 100}svh`,
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
      if (!sequence.hasAttribute("data-staged")) {
        sequence
          .querySelectorAll("[data-focus]")
          .forEach((el) => el.style.removeProperty("--attention"));
        return;
      }
      const r = sequence.getBoundingClientRect();
      const p = clamp(
        (64 - r.top) / (sequence.offsetHeight - (innerHeight - 64)),
      );
      sequence.style.setProperty("--scene-progress", String(p));
      const count = Number(sequence.dataset.count);
      // The last fifth holds the whole composition, before the same DOM unpins.
      const phase = Math.min(count, (p / 0.8) * count);
      const index = Math.min(count - 1, Math.floor(phase));
      const local = phase - index;
      const together = ease(0.75, 0.84, p);
      sequence.dataset.focused = together === 1 ? "all" : String(index);
      sequence.querySelectorAll("[data-focus]").forEach((el, i) => {
        // Regions never move or disappear. Attention gently crosses between them.
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
  function revealTogether(sequence) {
    scrollTo(
      0,
      sequence.getBoundingClientRect().top +
        scrollY -
        64 +
        (sequence.offsetHeight - (innerHeight - 64)) * 0.88,
    );
  }
  function resolveComparisonHash() {
    const target = document.getElementById(location.hash.slice(1));
    const sequence = target?.matches("[data-reading-all]")
      ? target.closest("[data-staged]")
      : null;
    if (sequence) revealTogether(sequence);
  }
  sequences.forEach((sequence) =>
    sequence
      .querySelector(".reading-bypass")
      .addEventListener("click", (event) => {
        const target = document.getElementById(
          sequence.dataset.readingSequence + "-all",
        );
        target.setAttribute("tabindex", "-1");
        if (sequence.hasAttribute("data-staged")) {
          event.preventDefault();
          revealTogether(sequence);
          history.replaceState(null, "", "#" + target.id);
        }
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
  addEventListener("hashchange", resolveComparisonHash);
  document.fonts.ready.then(() => {
    setup();
    resolveComparisonHash();
  });
}
