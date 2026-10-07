// Hydrates every figure host on the page. Hosts arrive with a static rest-pose
// snapshot (readable without JS); this swaps in the live figure once idle.
import HL from "virtual:hairline/kernel";

type Figure = {
  range: [number, number, number];
  mount: (
    ctx: {
      stage: HTMLElement;
      svg: SVGSVGElement;
      read: { textContent: string };
    },
    value: number,
  ) => { set(v: number): void; destroy(): void };
};
const figures: Record<string, () => Promise<{ default: Figure }>> = {
  switchyard: () => import("virtual:hairline/figure/switchyard"),
  relay: () => import("virtual:hairline/figure/relay"),
  scaffold: () => import("virtual:hairline/figure/scaffold"),
  loupe: () => import("virtual:hairline/figure/loupe"),
  paddock: () => import("virtual:hairline/figure/paddock"),
  beacons: () => import("virtual:hairline/figure/beacons"),
  hatches: () => import("virtual:hairline/figure/hatches"),
};

const live = new Map<HTMLElement, { destroy(): void }>();

async function hydrate(host: HTMLElement) {
  const load = figures[host.dataset.hairline ?? ""];
  if (!load || live.has(host)) return;
  const figure = (await load()).default;
  HL.inject(document);
  // The read-out sits beside the host (outside the drawing), inside the same .figure wrapper.
  const out = (host.parentElement ?? host).querySelector<HTMLElement>(
    "[data-readout]",
  );
  const read = {
    set textContent(text: string) {
      if (out) out.textContent = text;
    },
    get textContent() {
      return out?.textContent ?? "";
    },
  };
  host.querySelector(":scope > svg")?.remove();
  const svg = HL.mk(
    "svg",
    { viewBox: "0 0 400 320", "aria-hidden": "true" },
    host,
  );
  host.prepend(svg);
  live.set(host, figure.mount({ stage: host, svg, read }, figure.range[1]));
  host.dataset.hydrated = "";
}

const idle = (fn: () => void) =>
  "requestIdleCallback" in window
    ? requestIdleCallback(fn, { timeout: 1500 })
    : setTimeout(fn, 200);

// Figures tour on their own when idle. Hydration is staggered so neighbours
// do not move in lockstep, and one control pauses them all (WCAG 2.2.2).
const hosts = () => [
  ...document.querySelectorAll<HTMLElement>("[data-hairline]"),
];
const hydrateAll = () =>
  hosts().forEach((h, i) => setTimeout(() => hydrate(h), i * 700));

const KEY = "figures-paused";
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
function setPaused(paused: boolean) {
  hosts().forEach((h) => h.toggleAttribute("data-still", paused));
  document.documentElement.toggleAttribute("data-still", paused);
  for (const b of document.querySelectorAll<HTMLButtonElement>(
    "[data-pause]",
  )) {
    b.hidden = reduce.matches;
    b.setAttribute("aria-pressed", String(paused));
    b.textContent = paused ? "Play figures" : "Pause figures";
  }
  try {
    sessionStorage.setItem(KEY, paused ? "1" : "");
  } catch {}
}
let stored = false;
try {
  stored = sessionStorage.getItem(KEY) === "1";
} catch {}
setPaused(stored);
reduce.addEventListener("change", () =>
  setPaused(hosts()[0]?.hasAttribute("data-still") ?? false),
);
document.addEventListener("click", (e) => {
  const b = (e.target as Element).closest?.("[data-pause]");
  if (b) setPaused(b.getAttribute("aria-pressed") !== "true");
});
idle(hydrateAll);
addEventListener("pagehide", () => {
  live.forEach((h) => h.destroy());
  live.clear();
});
// Restored from the back-forward cache: the figures were torn down on pagehide.
addEventListener("pageshow", (e) => e.persisted && hydrateAll());
