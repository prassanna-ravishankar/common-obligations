import { $, setPressed } from "./dom.js";
import { stages } from "../data/surveillance.js";
import { transitionContent } from "./transitions.js";
export function initSurveillance() {
  let stage = 0,
    choice = 0;
  function renderComparison() {
    const s = stages[stage];
    $("#comparison").innerHTML = s.conditions
      .map(
        (c, i) =>
          `<div><span class="result-label">${i ? "INDEPENDENT CHECK" : "OPERATOR DISCRETION"}</span><h3>${c.title}</h3><h4>What it enables</h4><p>${c.benefit}</p><h4>What it asks us to accept</h4><p>${c.cost}</p><h4>Who feels the difference</h4><p>${c.people}</p></div>`,
      )
      .join("");
  }
  function renderScene() {
    const s = stages[stage],
      c = s.conditions[choice];
    $(".scene").dataset.scene = stage;
    $("#scene-step").textContent = `0${stage + 1} / ${s.name}`;
    $("#scene-kicker").textContent = s.kicker;
    $("#scene-title").innerHTML = s.title;
    $("#scene-description").textContent = s.description;
    $("#decision-question").textContent = s.question;
    $("#result-title").textContent = c.title;
    $("#result-benefit").textContent = c.benefit;
    $("#result-cost").textContent = c.cost;
    $("#result-people").textContent = c.people;
    setPressed("[data-stage]", "stage", stage);
    setPressed("[data-choice]", "choice", choice);
    renderComparison();
  }
  document.querySelectorAll("[data-stage]").forEach((b) =>
    b.addEventListener("click", () => {
      const direction = Number(b.dataset.stage) >= stage ? 1 : -1;
      stage = Number(b.dataset.stage);
      renderScene();
      transitionContent(".scene-text, #consequence", direction);
    }),
  );
  document.querySelectorAll("[data-choice]").forEach((b) =>
    b.addEventListener("click", () => {
      choice = Number(b.dataset.choice);
      renderScene();
      transitionContent("#consequence", choice ? 1 : -1);
    }),
  );
  $("#compare").addEventListener("click", () => {
    const expanded = $("#compare").getAttribute("aria-expanded") !== "true";
    $("#compare").setAttribute("aria-expanded", String(expanded));
    $("#comparison").hidden = !expanded;
    $("#compare").innerHTML = expanded
      ? "Close side-by-side comparison <span>−</span>"
      : "See both conditions together <span>↗</span>";
    renderComparison();
    if (expanded) transitionContent("#comparison > div");
  });
}
