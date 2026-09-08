// Outcomes change immediately. Interruptible motion connects each result to
// its control without putting timers into application state.
export function motionAllowed() {
  return (
    !document.body.classList.contains("reduce-motion") &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
export function transitionContent(selector, direction = 1) {
  if (!motionAllowed()) return;
  document.querySelectorAll(selector).forEach((element) => {
    if (!element.animate) return;
    element.getAnimations().forEach((animation) => animation.cancel());
    element.animate(
      [
        { opacity: 0.45, transform: `translateX(${direction * 10}px)` },
        { opacity: 1, transform: "translateX(0)" },
      ],
      { duration: 260, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
  });
}
export function traceConnection() {
  const line = document.querySelector(".connector i");
  if (!motionAllowed() || !line?.animate) return;
  line.getAnimations().forEach((animation) => animation.cancel());
  line.animate(
    [
      { transform: "scaleX(0)", opacity: 0.3 },
      { transform: "scaleX(1)", opacity: 1 },
    ],
    { duration: 500, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
  );
}
export function initTransitions() {
  document.querySelectorAll("details").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (details.open && motionAllowed()) {
        [...details.children]
          .filter((child) => child.tagName !== "SUMMARY")
          .forEach((child) => {
            child.animate?.([{ opacity: 0.4 }, { opacity: 1 }], {
              duration: 200,
            });
          });
      }
    });
  });
}
