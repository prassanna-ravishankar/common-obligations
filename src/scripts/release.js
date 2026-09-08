import { $, setPressed } from "./dom.js";
import { releases } from "../data/release.js";
import { transitionContent, traceConnection } from "./transitions.js";
export function initRelease() {
  document.querySelectorAll("[data-release]").forEach((b) =>
    b.addEventListener("click", () => {
      const n = Number(b.dataset.release),
        r = releases[n];
      setPressed("[data-release]", "release", n);
      for (const k of ["label", "title", "for", "against", "assumption"])
        $("#release-" + k).textContent = r[k];
      transitionContent(".release-result > div");
      traceConnection();
    }),
  );
}
