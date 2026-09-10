export function initNavigation() {
  function revealAnchor() {
    const hash = location.hash;
    if (/^#obligation-[1-6]$/.test(hash)) {
      const el = document.querySelector(hash);
      if (el) el.open = true;
    }
    if (hash === "#reading") document.querySelector(".full-essay").open = true;
  }
  document.querySelectorAll(".chapter-nav a").forEach((a) =>
    a.addEventListener("click", () => {
      a.closest("details").open = false;
    }),
  );
  addEventListener("hashchange", revealAnchor);
  revealAnchor();
}
