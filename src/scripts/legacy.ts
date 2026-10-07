// An old single-page link (/#obligation-4) lands here: send it to the new page.
import { resolve } from "../lib/legacy-anchors";
const go = () => {
  const to = resolve(location.hash);
  if (to && to !== location.pathname + location.hash) location.replace(to);
};
go();
addEventListener("hashchange", go);
