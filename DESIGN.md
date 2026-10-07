# Design: Six objects

The site reads like a careful technical document. Each obligation is an object you can handle: a Hairline figure, an isometric line drawing that answers the pointer. The figures are the only images.

## Tokens

`src/styles/tokens.css` is the only file with raw colours, fonts and scales.

- **Ground and ink** follow the Hairline palette so figures sit on the page itself: plate `#ffffff` / `#08090a`, ink `#232327` / `#d0d6e0`, muted `#5f5f66` / `#9a9ea8`, edge, mid and lo greys for strokes and rules. Light and dark follow the system through `light-dark()`; there is no toggle and no pre-paint script.
- **One accent.** Rust, `#9f3e26` light and `#d9774f` dark (6.6:1 and 6.4:1 on the ground), used for links, the figure's single bright stroke, numbers and the inference rule. Nothing else is coloured.
- **Type.** Geist for everything readable; Geist Mono for facts: dates, numbers, sources, register labels and read-outs. Self-hosted variable woff2 with versioned names.
- **Scale.** Fluid type steps at a ratio near 1.25, a 4px-based spacing scale, a 76rem page with a 66ch measure for reading.

## Layout

Fine rules and space separate things; there are no cards, shadows or rounded containers. Each section type keeps one layout: a split hero, ledger rows for events (dates left, text right), figure rows for the six, claim and answer pairs for objections, side by side options for a decision (stacked below 860px), a single column for the essay. Every multi-column layout collapses to one column on phones.

## Figures

Figures are Hairline figures (`hairline/kit`, MIT, vendored unchanged). Each is one object, one gesture and one variable, at most 200 lines, in `hairline/figures/`.

- **Read-outs say something useful.** Every choosable part of a figure is a real item from the argument; the read-out, in the corner outside the drawing, names that item. Labels come from the obligation's `parts` in content, passed to the figure through `data-parts` and `data-rest`. The accessible label is the obligation's short form, never a description of the drawing.
- **Rest pose without JavaScript.** `scripts/hairline/snapshot.mjs` renders each figure's rest pose to `src/hairline/snapshots/` and the kernel's CSS to `src/styles/hairline.css`; `src/hairline/mount.ts` swaps in the live figure when the page is idle.
- **Developing a figure.** Run the kit's loop until it passes, then look at the sheet: `node hairline/kit/look.mjs hairline/figures/<name>.js --answer x,y,z --edge x,y,z`. Then `npm run figures` to refresh snapshots and `node scripts/og.mjs` to refresh cards.

## Motion

Three kinds, and nothing else:

1. **Figures.** They answer the pointer (a tap on touch). When idle they tour on their own, so the answer shows without a cursor: this needs `data-ambient` on the host, stops under reduced motion, and the header's Pause figures control stops it everywhere for the session. Motion runs in the kernel's single loop, which sleeps offscreen.
2. **Page transitions.** Cross-document view transitions: an obligation's figure on the home page grows into the large figure on its page (`view-transition-name: fig-<name>`). No script; browsers without support simply navigate; reduced motion is a short crossfade.
3. **The record's axis.** It draws in beats, scrubbed by scroll, while it crosses the reader's gaze (its top from 75% to 25% of the viewport): the line wipes, each mark lands as the line reaches it, then the arcs sweep from occurrence to disclosure. Only at 1001 by 700 and up; otherwise it is drawn.

No text ever fades, slides or waits on a timer. No section is pinned, no scroll is captured, no panel scrolls on its own.

## Social cards

`node scripts/og.mjs` renders 1200 by 630 cards from the figures' snapshots and Geist into `public/og/<slug>-v1.png`. Bump the version when a card changes.
