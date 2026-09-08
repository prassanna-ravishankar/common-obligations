import { $, setPressed } from "./dom.js";
import { pacts } from "../data/coordination.js";
import { transitionContent } from "./transitions.js";
export function initCoordination() {
  document.querySelectorAll("[data-pact]").forEach((b) =>
    b.addEventListener("click", () => {
      const n = Number(b.dataset.pact),
        p = pacts[n];
      setPressed("[data-pact]", "pact", n);
      $(".coordination").classList.toggle("verified", n === 1);
      for (const k of ["title", "copy", "limit", "symbol"])
        $("#pact-" + k).textContent = p[k];
      transitionContent("#pact-title, #pact-copy, #pact-limit");
    }),
  );
}
