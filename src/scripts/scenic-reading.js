export function initScenicReading() {
  const chapter = document.querySelector("main");
  if (!chapter) return;
  const wide = matchMedia("(min-width: 1001px) and (min-height: 800px)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const tracks = [...chapter.querySelectorAll("[data-scroll-comparison]")];
  const threshold = chapter.querySelector("[data-prototype-threshold]");
  const labels = {
    left: "Operator discretion",
    right: "Independent check",
    both: "Two perspectives, read together",
  };
  let queued = false;
  function reveal(track, view, left = 1, right = 1, third = 1) {
    track.dataset.view = view;
    track.querySelector("[data-perspective-label]").textContent =
      view === "both"
        ? "Read the perspectives together"
        : track.querySelectorAll("[data-name]")[
            view === "left" ? 0 : view === "right" ? 1 : 2
          ]?.dataset.name || labels[view];
    track.querySelectorAll("[data-perspective]").forEach((el, i) => {
      const hidden = (i === 2 ? third : i ? right : left) < 0.02;
      el.inert = hidden;
      if (hidden) el.setAttribute("aria-hidden", "true");
      else el.removeAttribute("aria-hidden");
    });
    track.style.setProperty("--left-presence", String(left));
    track.style.setProperty("--right-presence", String(right));
    track.style.setProperty("--third-presence", String(third));
  }
  function easeBetween(start, end, p) {
    const t = Math.max(0, Math.min(1, (p - start) / (end - start)));
    return t * t * (3 - 2 * t);
  }
  function setup() {
    const enabled =
      wide.matches &&
      !reduced.matches &&
      !document.body.classList.contains("reduce-motion");
    tracks.forEach((track) => {
      const scene = track.querySelector(".comparison-scene");
      const candidate = enabled && !track.dataset.readTogether;
      track.toggleAttribute("data-enhanced", candidate);
      const contentHeight = Math.max(
        ...[...scene.querySelectorAll("[data-perspective]")].map(
          (el) => el.offsetHeight,
        ),
      );
      const active = candidate && contentHeight + 210 <= innerHeight - 90;
      track.toggleAttribute("data-enhanced", active);
      track.style.setProperty("--focus-height", `${contentHeight}px`);
      track.style.setProperty("--scene-height", `${innerHeight - 90}px`);
      track.querySelector("button").hidden = !active;
      if (!active) reveal(track, "both");
    });
    schedule();
  }
  function update() {
    queued = false;
    const enabled =
      wide.matches &&
      !reduced.matches &&
      !document.body.classList.contains("reduce-motion");
    if (enabled && threshold) {
      const rect = threshold.getBoundingClientRect();
      threshold.style.setProperty(
        "--crossing",
        String(
          Math.max(
            0,
            Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)),
          ),
        ),
      );
    } else threshold?.style.setProperty("--crossing", "0");
    tracks.forEach((track) => {
      if (!track.hasAttribute("data-enhanced")) return;
      const rect = track.getBoundingClientRect();
      const travel =
        rect.height - track.querySelector(".comparison-scene").offsetHeight;
      const p = Math.max(0, Math.min(1, (90 - rect.top) / travel));
      track.style.setProperty("--read-progress", String(p));
      if (track.dataset.count === "3") {
        const left = 1 - easeBetween(0.16, 0.29, p);
        const right =
          easeBetween(0.26, 0.38, p) * (1 - easeBetween(0.49, 0.62, p));
        const third = easeBetween(0.59, 0.72, p);
        const crossing = easeBetween(0.18, 0.4, p);
        const opening = easeBetween(0.53, 0.78, p);
        track.style.setProperty("--art-crossing", String(crossing));
        track.style.setProperty("--scene-opening", String(opening));
        reveal(
          track,
          p < 0.28 ? "left" : p < 0.61 ? "right" : "third",
          left,
          right,
          third,
        );
      } else {
        const left = 1 - easeBetween(0.2, 0.4, p) + easeBetween(0.8, 0.94, p);
        const right = easeBetween(0.46, 0.64, p);
        track.style.setProperty(
          "--art-crossing",
          String(easeBetween(0.22, 0.6, p)),
        );
        track.style.setProperty(
          "--scene-opening",
          String(easeBetween(0.7, 0.94, p)),
        );
        reveal(
          track,
          p < 0.4 ? "left" : p < 0.8 ? "right" : "both",
          left,
          right,
        );
      }
    });
  }
  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }
  tracks.forEach((track) =>
    track.querySelector("button").addEventListener("click", () => {
      const top = track
        .querySelector(".comparison-scene")
        .getBoundingClientRect().top;
      track.dataset.readTogether = "true";
      setup();
      if (track.dataset.count === "3") {
        document
          .getElementById(track.dataset.scrollComparison + "-together")
          .scrollIntoView({ behavior: "instant" });
        return;
      }
      window.scrollBy(0, track.getBoundingClientRect().top - top);
    }),
  );
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", setup);
  document.querySelector(".incident-origin")?.addEventListener("change", setup);
  reduced.addEventListener("change", setup);
  new MutationObserver(setup).observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
  document.fonts.ready.then(setup);
}
