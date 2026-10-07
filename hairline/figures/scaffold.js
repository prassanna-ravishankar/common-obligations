/**
 * Scaffold: a tower going up inside scaffolding, on a slab, with the floor
 * plates still to be lifted stacked beside it. Five storeys, each one level of
 * what a system is allowed to do, read from the host's data-parts. The
 * pointer's height over the tower picks how many storeys stand: they rise or
 * come down in turn from the old top, and each storey brings its own diagonal
 * brace and ledgers, so the evidence grows with the capability. The top
 * standing storey and its brace take the bright stroke. At rest one storey
 * stands with one brace, under the dashed uprights of the full scaffold. With
 * data-ambient on the host, and no pointer, it builds each level in turn. The
 * slider is the storey height.
 *
 * The pattern: one of many, picked from fixed bands on a vertical plane through
 * the tower (rule 01), with tweens staggered from the old top (rules 02, 08).
 */
const { Cam, clamp, facing, fit, prism, proj, reducedMotion, rings, rrect, poly, seg, tween, tset, tval, tdone, mk, pointer, put, register, disposer, solid } = HL;

// The scaffold's corners sit unevenly off the tower, so its near upright never lines up with the tower's corner.
const N = 5, T = 36, X0 = -5, X1 = T + 5, Y0 = -11, Y1 = T + 11, FL = 2.6, PL = 3, LAG = 50, STEP = 2400, IDLE = 2600;
const SX0 = -18, SX1 = T + 48, SY0 = -18, SY1 = T + 16, SLAB = 5, SHMAX = 22;
const NONE = { sil: "", crease: "" };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const items = (stage.dataset.parts || "").split("|").filter(Boolean);
  const label = (k) => items[k] || `storey ${k + 1}`;
  const restLabel = stage.dataset.rest || "rest";

  // Fitted to the tallest scaffold, so the slider never moves the frame.
  const TOP = (sh) => N * sh + 6;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[SX0, SY0, -SLAB], [SX1, SY0, -SLAB], [SX0, SY1, -SLAB], [SX1, SY1, -SLAB], [X0, Y0, TOP(SHMAX)], [X1, Y1, TOP(SHMAX)]], 200, 166);
  const P = proj(C), front = facing(C);
  let SH = value, choice = -1, B = null, over = false, touched = -Infinity, nextAt = 0, drawn = "";

  const g = mk("g", {}, svg);
  const [sr, si] = rings(SX0, SY0, SX1, SY1, 9, 2.2);
  put(solid(g), prism(P, front, sr, si, -SLAB, 0));

  // Behind the tower: the far upright, its dashed rest, and the ledgers along the far faces.
  const farDash = mk("path", { class: "nf dash" }, g), farPole = mk("path", { class: "nf sil" }, g), far = mk("path", { class: "nf" }, g);
  const [slr, sli] = rings(-1.5, -1.5, T + 1.5, T + 1.5, 3, 1), [bdr, bdi] = rings(0, 0, T, T, 2.5, 1.2);
  const storeys = Array.from({ length: N }, () => {
    const sg = mk("g", {}, g);
    return { slab: solid(sg), body: solid(sg), win: mk("path", { class: "nf lo" }, sg) };
  });
  // In front of it: the near uprights and ledgers, and one brace per storey.
  const nearDash = mk("path", { class: "nf dash" }, g), near = mk("path", { class: "nf" }, g), nearPole = mk("path", { class: "nf sil" }, g);
  const braces = storeys.map(() => mk("path", { class: "nf" }, g));

  // The plates still to be lifted, the next storey's on top: plate j belongs to storey N - 1 - j.
  const [pr, pi] = rings(T + 20, 2, T + 40, 20, 2, 0.8), plates = [];
  for (let j = 0; j < N - 1; j++) {
    const z0 = j * (PL + 0.6);
    plates.push({ el: solid(g), paths: prism(P, front, pr, pi, z0, z0 + PL), shown: null });
  }

  const tws = storeys.map((_, i) => tween(i ? 0 : 1));
  const windows = (z0, h) => {
    if (h < 8) return "";
    const v0 = z0 + FL + (h - FL) * 0.3, v1 = z0 + FL + (h - FL) * 0.72;
    return [7, 21].flatMap((u) => {
      const w = rrect(u, v0, u + 8, v1, 1.2, 3);
      return [poly(w.map((q) => P(T, q.u, q.v))), poly(w.map((q) => P(q.u, T, q.v)))];
    }).join("");
  };
  /** Storey i's brace, from the near corner up to a side upright, the faces taken in turn. */
  const brace = (i, z0, h) => seg(P(X1, Y1, z0), i % 2 ? P(X1, Y0, z0 + h) : P(X0, Y1, z0 + h));
  const uprights = (pts, z0, z1) => (z1 - z0 > 0.5 ? pts.map(([x, y]) => seg(P(x, y, z0), P(x, y, z1))).join("") : "");
  const ledgers = (pts, z) => seg(P(...pts[0], z), P(...pts[1], z)) + seg(P(...pts[1], z), P(...pts[2], z));
  const FAR = [[X1, Y0], [X0, Y0], [X0, Y1]], NEAR = [[X1, Y0], [X1, Y1], [X0, Y1]];

  function draw(now) {
    const hs = tws.map((tw) => SH * tval(tw, now)), key = hs.map((h) => h.toFixed(2)).join() + SH;
    if (key === drawn) return;
    drawn = key;
    let z = 0, farD = "", nearD = "";
    storeys.forEach((s, i) => {
      const h = hs[i];
      put(s.slab, h > 0.4 ? prism(P, front, slr, sli, z, z + Math.min(FL, h)) : NONE);
      put(s.body, h > FL + 0.4 ? prism(P, front, bdr, bdi, z + FL, z + h) : NONE);
      s.win.setAttribute("d", windows(z, h));
      braces[i].setAttribute("d", h > 0.4 ? brace(i, z, h) : "");
      z += h;
      if (h > 0.4) { farD += ledgers(FAR, z); nearD += ledgers(NEAR, z); }
    });
    // The scaffold stands a lift ahead of the work, with a guard rail on top; above that it is only planned.
    const top = TOP(SH), lift = Math.min(z + SH * 0.55, top);
    far.setAttribute("d", farD + ledgers(FAR, lift));
    near.setAttribute("d", nearD + ledgers(NEAR, lift));
    farPole.setAttribute("d", uprights([FAR[1]], 0, lift));
    farDash.setAttribute("d", uprights([FAR[1]], lift, top));
    nearPole.setAttribute("d", uprights(NEAR, 0, lift));
    nearDash.setAttribute("d", uprights(NEAR, lift, top));
    plates.forEach((p, j) => {
      const shown = hs[N - 1 - j] < SH * 0.5;
      if (shown !== p.shown) { p.shown = shown; put(p.el, shown ? p.paths : NONE); }
    });
  }

  /** Builds up to storey k (-1 is rest: the first storey alone), in turn from the old top. */
  function choose(k) {
    if (k === choice) return;
    const now = performance.now(), from = Math.max(choice, 0), top = Math.max(k, 0);
    choice = k;
    tws.forEach((tw, i) => i && tset(tw, i <= top ? 1 : 0, now, Math.abs(i - from) * LAG));
    storeys.forEach((s, i) => { s.body.sil.classList.toggle("hi", i === top); braces[i].classList.toggle("hi", i === top); });
    read.textContent = k < 0 ? restLabel : label(k);
    B?.wake();
  }

  /** The tour: each level in turn while nobody is pointing. */
  const touring = () => "ambient" in stage.dataset && !("still" in stage.dataset) && !reducedMotion();
  // register ticks once before it returns, so B is still null on that first call.
  B = register(stage, (_dt, now) => {
    if (B && !over && touring() && now - touched >= IDLE && now >= nextAt) { nextAt = now + STEP; choose((choice + 1) % N); }
    draw(now);
    return tws.some((tw) => !tdone(tw, now)) || touring();
  });
  bag.add(B.unregister);

  // Hit bands: the pointer's height on the vertical plane through the tower's axis, one band per storey of the full tower.
  const ax = P(T / 2, T / 2, 0), dz = ax[1] - P(T / 2, T / 2, 1)[1], half = Math.max(...[FAR[0], FAR[2]].map(([x, y]) => Math.abs(P(x, y, 0)[0] - ax[0]))) + 4;
  bag.add(pointer(stage, {
    move: (p) => {
      const z = (ax[1] - p[1]) / dz;
      over = Math.abs(p[0] - ax[0]) < half && z > -10 && z < N * SH + 8;
      if (over) choose(clamp(Math.floor(z / SH), 0, N - 1));
      else { touched = performance.now(); choose(-1); }
    },
    leave: () => { over = false; touched = performance.now(); choose(-1); },
  }));
  storeys[0].body.sil.classList.add("hi");
  braces[0].classList.add("hi");
  read.textContent = restLabel;
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { SH = v; drawn = ""; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "scaffold",
  means: "A tower inside its scaffold: the higher the pointer, the more storeys stand, and each brings its own brace.",
  rules: [1, 2, 4, 5],
  range: [16, 19, 22],
  mount,
});
