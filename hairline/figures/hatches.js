/**
 * Hatches: a long service counter on a slab, five hatches set along its front,
 * the counter stepping up halfway and a queue rail leading in from the front.
 * Each hatch has a frame, a flap hung from its top edge, a shelf in front and a
 * recess behind, with a slot in its back wall. The pointer picks a hatch: its
 * flap swings up over the shelf and its frame takes the bright stroke; its neighbours lift a
 * little, staggered outwards from it. Each hatch is one remedy, read from the
 * host's data-parts. At rest the third hatch stands part open, its frame
 * bright. With data-ambient on the host, and no pointer, the hatches open in
 * turn. The slider is how far a chosen flap swings up, in degrees.
 *
 * The pattern: one of many, chosen on the counter's front plane at rest (rule
 * 01), with tweens staggered by distance (rule 02) and a reach that falls off.
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, reducedMotion, rings, rrect, seg, tween, tset, tval, tdone, mk, pointer, put, register, disposer, solid } = HL;

const N = 5, PITCH = 32, M = 12, W = 22, Z0 = 12, Z1 = 40, F = 3, DEEP = 3, D = 26, T = 1.4, STAG = 45, STEP = 2400, IDLE = 2600;
const L = 2 * M + N * PITCH, XS = M + 2 * PITCH, TALL = [49, 57], RAIL = XS - 4, MARK = 2;
// The flap hangs from a hinge over the opening. How far each stands open at rest, in degrees,
// and the share of the reach a hatch takes by its distance from the chosen one.
const HINGE = Z1 + 1.5, DROP = Z1 - Z0 + 1.5, REST = [0, 9, 55, 0, 16], FALL = [1, 0.34, 0.12, 0.04, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const items = (stage.dataset.parts || "").split("|").filter(Boolean);
  const label = (k) => items[k] || `hatch ${k + 1}`;
  const restLabel = stage.dataset.rest || "rest";

  const C = Cam(45, 0.5, 1.5);
  fit(C, [[-5, -5, -4], [L + 5, D + 30, -4], [L + 5, -5, -4], [-5, D + 30, -4], [XS, 0, TALL[1]], [L, 0, TALL[1]]], 200, 166);
  const P = proj(C), front = facing(C);
  /** A ring drawn upright on the counter's front, dy in front of it (behind when negative). */
  const face = (ring, dy = 0) => ring.map((q) => P(q.u, D + dy, q.v));
  /** A rounded solid from (x0, y0) to (x1, y1), standing from z0 to z1. */
  const block = (parent, x0, y0, x1, y1, z0, z1, r, b) => {
    const s = solid(parent), [o, i] = rings(x0, y0, x1, y1, r, b);
    put(s, prism(P, front, o, i, z0, z1));
    return s;
  };

  let reach = value, choice = -2, B = null, over = false, touched = -Infinity, nextAt = 0;
  const g = mk("g", {}, svg);
  block(g, -5, -5, L + 5, D + 30, -4, 0, 8, 2);
  // The low half runs on into the tall half, so the step shows no seam.
  block(g, 0, 0, XS + 6, D, 0, TALL[0], 3, 1.2);
  block(g, XS, 0, L, D, 0, TALL[1], 3, 1.2);

  // The queue rail leading in to the appeal hatch: far post, rail, near post. It stands in front of
  // the hatches to its left and behind the flaps to its right, so it is painted between them.
  const post = (y) => block(g, RAIL - 1.6, y - 1.6, RAIL + 1.6, y + 1.6, 0, 17, 1.2, 0.5);
  const rail = () => { post(D + 6); block(g, RAIL - 0.8, D + 6, RAIL + 0.8, D + 26, 14, 16, 0.7, 0.3); post(D + 26); };

  // Hatches left to right: each one's shelf and flap stand in front of the face, and lean away from the next.
  const hatches = [];
  for (let i = 0; i < N; i++) {
    if (i === MARK) rail();
    const x0 = M + (PITCH - W) / 2 + i * PITCH, x1 = x0 + W, grp = mk("g", {}, g);
    // the recess behind the shutter: its back wall, the seam at its sill, and the slot a paper goes through
    mk("path", { d: poly(face(rrect(x0, Z0, x1, Z1, 1.5, 3), -DEEP)) + seg(P(x0, D, Z0), P(x0, D - DEEP, Z0)), class: "nf lo" }, grp);
    mk("path", { d: poly(face(rrect(x0 + 5, Z0 + 4, x1 - 5, Z0 + 6.4, 1, 3), -DEEP)), class: "nf lo" }, grp);
    // the frame: its outer edge and the opening, one path wound both ways so the opening stays open
    const hole = face(rrect(x0, Z0, x1, Z1, 1.5, 3)).reverse();
    const frame = mk("path", { d: poly(face(rrect(x0 - F, Z0 - F, x1 + F, Z1 + F, 2.5, 4))) + poly(hole) }, grp);
    block(grp, x0 - 4, D, x1 + 4, D + 6, Z0 - 3, Z0, 1.4, 0.6);
    // the flap, its face's crease, and the pull along its foot
    const flap = solid(grp), pull = mk("path", { class: "nf" }, grp);
    hatches.push({ x0, x1, flap, pull, frame, tw: tween(REST[i]), drawn: NaN });
  }

  /** Hatch h with its flap swung up by th degrees about the hinge: a point s down the flap and w out from its back. */
  function draw(h, th) {
    if (th === h.drawn) return;
    h.drawn = th;
    const c = Math.cos(rad(th)), sn = Math.sin(rad(th));
    const at = (x, s, w) => P(x, D + s * sn + w * c, HINGE - s * c + w * sn);
    const plate = (w, b) => rrect(h.x0 - 1 + b, b, h.x1 + 1 - b, DROP - b, 1.6 - b, 3).map((q) => at(q.u, q.v, w));
    h.flap.sil.setAttribute("d", poly(hull(plate(0, 0).concat(plate(T, 0)))));
    h.flap.cr.setAttribute("d", poly(plate(T, 1)));
    h.pull.setAttribute("d", seg(at(h.x0 + 6, DROP - 3, T + 0.8), at(h.x1 - 6, DROP - 3, T + 0.8)));
  }

  function choose(k) {
    if (k === choice) return;
    const now = performance.now(), from = k >= 0 ? k : choice >= 0 ? choice : MARK;
    choice = k;
    hatches.forEach((h, i) => {
      tset(h.tw, k < 0 ? REST[i] : reach * FALL[Math.abs(i - k)], now, Math.abs(i - from) * STAG);
      h.frame.classList.toggle("hi", i === (k < 0 ? MARK : k));
    });
    read.textContent = k < 0 ? restLabel : label(k);
    B?.wake();
  }

  // Hit test on the front plane at rest, which never moves: the hatch whose band along the counter holds the point.
  const o = P(0, D, 0), ex = P(1, D, 0), ez = P(0, D, 1);
  const a = [ex[0] - o[0], ex[1] - o[1]], b = [ez[0] - o[0], ez[1] - o[1]], det = a[0] * b[1] - a[1] * b[0];
  function hit([sx, sy]) {
    const qx = sx - o[0], qy = sy - o[1], x = (qx * b[1] - qy * b[0]) / det, z = (a[0] * qy - a[1] * qx) / det;
    if (x < 0 || x > L || z < -6 || z > TALL[1] + 4) return -1;
    return clamp(Math.floor((x - M) / PITCH), 0, N - 1);
  }

  /** The tour: each hatch in turn while nobody is pointing. */
  const touring = () => "ambient" in stage.dataset && !("still" in stage.dataset) && !reducedMotion();
  // register ticks once before it returns, so B is still null on that first call.
  B = register(stage, (_dt, now) => {
    if (B && !over && touring() && now - touched >= IDLE && now >= nextAt) { nextAt = now + STEP; choose((choice + 1) % N); }
    let moving = false;
    for (const h of hatches) { draw(h, tval(h.tw, now)); if (!tdone(h.tw, now)) moving = true; }
    return moving || touring();
  });
  bag.add(B.unregister);

  bag.add(pointer(stage, {
    move: (p) => {
      const k = hit(p);
      over = k >= 0;
      if (!over) touched = performance.now();
      choose(k);
    },
    leave: () => { over = false; touched = performance.now(); choose(-1); },
  }));
  choose(-1);
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { reach = v; const k = choice; choice = -2; choose(k); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "hatches",
  means: "A counter of five service hatches: the pointer opens one, its flap swinging up over the shelf, its neighbours lifting less.",
  rules: [1, 2, 4, 5],
  range: [78, 96, 114],
  mount,
});
