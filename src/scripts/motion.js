import { $ } from "./dom.js";
export function initMotion() {
  // Motion always has a reduced-motion fallback; content is readable without scripting.
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = media.matches;
  function setMotion() {
    document.body.classList.toggle("reduce-motion", paused);
    document.body.classList.toggle("motion-on", !paused);
    $(".motion").textContent = paused ? "Enable motion" : "Pause motion";
    $(".motion").setAttribute(
      "aria-label",
      paused ? "Enable animation" : "Pause animation",
    );
    $(".motion").setAttribute("aria-pressed", String(paused));
    dispatchEvent(new Event("motionchange"));
    if (paused) {
      $(".hero-image img").style.transform = "none";
      document
        .querySelectorAll(".chapter-portal")
        .forEach((portal) => portal.style.removeProperty("--portal-drift"));
      document.getAnimations().forEach((animation) => animation.cancel());
    }
  }
  $(".motion").addEventListener("click", () => {
    paused = !paused;
    setMotion();
  });
  media.addEventListener("change", () => {
    paused = media.matches;
    setMotion();
  });
  document.body.classList.add("js");
  setMotion();
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else
    document
      .querySelectorAll(".reveal")
      .forEach((e) => e.classList.add("visible"));
  let queued = false;
  function scrollUpdate() {
    const max = document.documentElement.scrollHeight - innerHeight;
    $(".progress").style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (!paused) {
      if (innerWidth > 1000 && innerHeight >= 700 && !media.matches) {
        document.querySelectorAll(".chapter-portal").forEach((portal) => {
          const rect = portal
            .querySelector(".chapter-image-frame")
            .getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < innerHeight) {
            portal.style.setProperty(
              "--portal-drift",
              `${Math.max(-55, Math.min(55, (innerHeight / 2 - rect.top - rect.height / 2) * 0.14))}px`,
            );
          }
        });
      }
      const r = $(".hero-image").getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight)
        $(".hero-image img").style.transform =
          `translateY(${Math.max(-45, Math.min(45, (innerHeight / 2 - r.top - r.height / 2) * 0.1))}px)`;
    }
    let active = "";
    for (const id of [
      "surveillance",
      "release",
      "incident",
      "race",
      "obligations",
    ])
      if ($("#" + id).getBoundingClientRect().top < 200) active = id;
    document.querySelectorAll(".chapter-nav a").forEach((a) => {
      const on = a.hash === "#" + active;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
    queued = false;
  }
  addEventListener(
    "scroll",
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(scrollUpdate);
      }
    },
    { passive: true },
  );
  scrollUpdate();
  addEventListener("resize", scrollUpdate);
}
