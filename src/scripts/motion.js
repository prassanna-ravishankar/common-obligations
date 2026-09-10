import { scenarios } from "../data/scenarios.js";
export function initMotion() {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const wide = matchMedia("(min-width: 1001px) and (min-height: 700px)");
  const button = document.querySelector(".motion");
  const scenes = [...document.querySelectorAll("[data-motion-scene]")];
  let paused = media.matches,
    queued = false;
  function update() {
    queued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    document.querySelector(".progress").style.transform =
      `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (!paused && wide.matches && !media.matches)
      for (const scene of scenes) {
        const r = scene.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const p = Math.max(
          0,
          Math.min(1, (innerHeight - r.top) / (innerHeight + r.height)),
        );
        const art = scene.querySelector(".art-scene");
        art?.style.setProperty("--scene-progress", String(p));
        art?.style.setProperty("--scene-shift", `${(p - 0.5) * 120}px`);
      }
    let active = "";
    for (const { id } of scenarios)
      if (document.getElementById(id)?.getBoundingClientRect().top < 180)
        active = id;
    if (
      document.getElementById("obligations")?.getBoundingClientRect().top < 180
    )
      active = "obligations";
    document.querySelectorAll(".chapter-nav a").forEach((a) => {
      if (a.hash === "#" + active) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
    const label = document.querySelector("[data-current-chapter]");
    if (label)
      label.textContent =
        scenarios.find((s) => s.id === active)?.title ||
        (active === "obligations" ? "Common ground" : "Six scenarios");
  }
  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }
  function setMotion() {
    document.body.classList.toggle("reduce-motion", paused);
    document.body.classList.toggle("motion-on", !paused);
    button.textContent = paused ? "Enable motion" : "Pause motion";
    button.setAttribute(
      "aria-label",
      paused ? "Enable animation" : "Pause animation",
    );
    button.setAttribute("aria-pressed", String(paused));
    if (paused)
      document.querySelectorAll(".art-scene").forEach((s) => {
        s.style.removeProperty("--scene-shift");
        s.style.removeProperty("--scene-progress");
      });
    schedule();
  }
  button.addEventListener("click", () => {
    paused = !paused;
    setMotion();
  });
  media.addEventListener("change", () => {
    paused = media.matches;
    setMotion();
  });
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  setMotion();
}
