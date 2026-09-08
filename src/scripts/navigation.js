import { $ } from "./dom.js";
export function initNavigation() {
  // Direct links to an obligation open the relevant explanation.
  function revealAnchor() {
    const hash = location.hash;
    if (/^#obligation-[1-6]$/.test(hash)) $(hash).open = true;
    if (hash === "#reading") $(".full-essay").open = true;
  }
  addEventListener("hashchange", revealAnchor);
  revealAnchor();
}
