import { scenarios } from "../../data/scenarios.js";

export function createNavigation() {
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
  return {
    update() {
      let active = "decisions";
      for (const s of scenarios)
        if (document.getElementById(s.id)?.getBoundingClientRect().top < 190)
          active = s.id;
      for (const id of ["obligations", "reading"])
        if (document.getElementById(id)?.getBoundingClientRect().top < 190)
          active = id;
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
    },
  };
}
