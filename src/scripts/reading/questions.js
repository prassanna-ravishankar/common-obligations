import { clamp, ease, timing, trackProgress, seek } from "./timing.js";
import { paintComparison } from "./comparisons.js";

export function createQuestions(root = document) {
  const decks = [...root.querySelectorAll("[data-question-sequence]")].map(
    (el) => ({
      el,
      panes: [...el.querySelectorAll("[data-question]")],
    }),
  );
  function jump(deck, index, together = false) {
    const local = together ? 0.78 : 0.08;
    seek(deck.el, (index + local) / deck.panes.length);
  }
  for (const deck of decks) {
    deck.el.querySelectorAll("[data-question-jump]").forEach((button) => {
      button.hidden = deck.panes.length < 2;
      button.addEventListener("click", () => {
        const current = Number(deck.el.dataset.questionIndex || 0);
        jump(
          deck,
          Math.max(
            0,
            Math.min(
              deck.panes.length - 1,
              current + Number(button.dataset.questionJump),
            ),
          ),
        );
      });
    });
    deck.panes.forEach((pane, i) => {
      const link = pane.querySelector(".reading-bypass");
      link.addEventListener("click", (event) => {
        if (!deck.el.hasAttribute("data-question-staged")) return;
        event.preventDefault();
        jump(deck, i, true);
        const target = pane.querySelector("[data-reading-all]");
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
        history.replaceState(null, "", "#" + target.id);
      });
    });
  }
  return {
    setup(enabled) {
      for (const { el, panes } of decks) {
        el.toggleAttribute("data-question-staged", enabled);
        panes.forEach((pane) => {
          pane.inert = false;
          pane.removeAttribute("aria-hidden");
          pane
            .querySelector("[data-reading-sequence]")
            .toggleAttribute("data-staged", enabled);
        });
        const contentHeight = Math.max(...panes.map((p) => p.scrollHeight));
        const fits = enabled && contentHeight + 40 < innerHeight - timing.rail;
        el.style.setProperty("--art-clearance", `${contentHeight + 50}px`);
        el.toggleAttribute("data-question-staged", fits);
        const travel = panes.reduce(
          (sum, p) =>
            sum +
            Number(p.querySelector("[data-count]").dataset.count) *
              timing.perspectiveSvh +
            timing.togetherSvh +
            timing.questionSvh,
          0,
        );
        el.style.setProperty("--question-travel", `${travel}svh`);
        panes.forEach((pane) => {
          pane.style.removeProperty("opacity");
          pane
            .querySelector("[data-reading-sequence]")
            .toggleAttribute("data-staged", fits);
          pane.querySelector(".reading-bypass").hidden = !fits;
          if (!fits)
            paintComparison(pane.querySelector("[data-reading-sequence]"), 1);
        });
      }
    },
    update() {
      for (const deck of decks) {
        const { el, panes } = deck;
        if (!el.hasAttribute("data-question-staged")) continue;
        const p = trackProgress(el);
        const phase = p * panes.length;
        const index = Math.min(panes.length - 1, Math.floor(phase));
        el.dataset.questionIndex = String(index);
        el.querySelectorAll("[data-question-jump]").forEach((button) => {
          button.disabled =
            Number(button.dataset.questionJump) < 0
              ? index === 0
              : index === panes.length - 1;
        });
        el.style.setProperty("--scene-progress", String(p));
        panes.forEach((pane, i) => {
          const local = clamp(phase - i);
          const active = i === index;
          const presence = active
            ? (i ? ease(0, 0.07, local) : 1) *
              (i < panes.length - 1
                ? 1 - ease(timing.questionExit, 1, local)
                : 1)
            : 0;
          pane.style.opacity = String(presence);
          pane.inert = !active;
          pane.setAttribute("aria-hidden", String(!active));
          const comparison = pane.querySelector("[data-reading-sequence]");
          comparison.style.setProperty(
            "--question-arrival",
            String(ease(0.04, timing.questionIntro, local)),
          );
          paintComparison(
            comparison,
            clamp(
              (local - timing.questionIntro) /
                (timing.questionReadingEnd - timing.questionIntro),
            ),
          );
        });
      }
    },
    resolveHash() {
      const target = document.getElementById(location.hash.slice(1));
      if (!target) return;
      for (const deck of decks) {
        if (!deck.el.hasAttribute("data-question-staged")) continue;
        const index = deck.panes.findIndex(
          (p) => p === target || p.contains(target),
        );
        if (index >= 0) jump(deck, index, target.matches("[data-reading-all]"));
      }
    },
  };
}
