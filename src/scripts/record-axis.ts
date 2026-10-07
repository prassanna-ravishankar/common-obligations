// Draws the record's axis in beats while it crosses the reader's gaze: from three
// quarters of the way down the viewport to the upper quarter. Scrubbed by scroll,
// one passive listener and one frame at a time; reduced motion shows it drawn.
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const section = document.querySelector<HTMLElement>("[data-record]");
const axis = section?.querySelector<HTMLElement>("[data-timeline-axis]");
if (section && axis) {
  const gate = matchMedia("(min-width: 1001px) and (min-height: 700px)");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let queued = false;
  let last = "";
  const enabled = () =>
    gate.matches &&
    !reduce.matches &&
    !document.documentElement.hasAttribute("data-still");
  const update = () => {
    queued = false;
    const on = enabled();
    section.classList.toggle("axis-motion", on);
    if (!on) {
      section.style.removeProperty("--timeline-progress");
      last = "";
      return;
    }
    const top = axis.getBoundingClientRect().top;
    const p = clamp((innerHeight * 0.75 - top) / (innerHeight * 0.5)).toFixed(
      4,
    );
    if (p === last) return;
    last = p;
    section.style.setProperty("--timeline-progress", p);
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  gate.addEventListener("change", schedule);
  reduce.addEventListener("change", schedule);
  new MutationObserver(schedule).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-still"],
  });
  schedule();
}
