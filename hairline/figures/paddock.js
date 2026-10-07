/**
 * Paddock: a rover in a fenced pen on a slab. The pointer is projected onto the
 * ground and the rover drives towards it on two springs, turning to face its
 * way; past the fence it stops at the fence, and that side's rail takes the
 * bright stroke. Each side stands for one limit enforced outside the rover, read
 * from the host's data-parts; the read-out names the one that held. At rest the
 * rover, on two tracks, is parked off-centre and its sensor head is the bright
 * mark. With data-ambient on the host, and no pointer, it tours: it drives into
 * each fence in turn and comes back, so the limits show themselves. The slider
 * is the size of the pen.
 *
 * The pattern: a continuous position, clamped (rule 03), on the ground plane
 * (rule 01), with the answer said by which part of the object holds.
 */
const { Cam, clamp, facing, fit, prism, proj, reducedMotion, rings, unproj, spring, stepS, mk, pointer, put, register, disposer, solid } = HL;

// MARGIN covers the rover's turned corner (half-length 21, track edge 17: about 27), so it never crosses the fence.
const SLAB = 9, POST = 5, POST_H = 13, RAIL = 3, GAP = 24, MARGIN = 28, MAX = 112, K = 1.3, STEP = 2200, IDLE = 2600;

/** A ring turned by angle a about the origin, then moved to (x, y): positions and normals both turn. */
const turn = (ring, a, x, y) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

/** The rover's parts in its own frame, x forward: [x, y, length, width, radius, crease, z0, z1]: two tracks, body, cabin, mast, sensor head. */
const ROVER = [
  [0, -10.5, 32, 5.6, 2.8, 0.8, 0, 7.5], [0, 10.5, 32, 5.6, 2.8, 0.8, 0, 7.5],
  [0, 0, 27, 15, 4, 1.4, 4.5, 11], [3.5, 0, 13, 11, 3.2, 1.1, 11, 17.5],
  [-5, 0, 2.4, 2.4, 1.1, 0.4, 17.5, 27], [-5, 0, 9, 7, 2.2, 0.8, 27, 29.5],
].map(([x, y, l, w, r, b, z0, z1]) => [x * K, y * K, l * K, w * K, r * K, b, z0 * K, z1 * K]);
const HEAD = ROVER.length - 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const items = (stage.dataset.parts || "").split("|").filter(Boolean);
  const label = (k) => items[k] || `limit ${k + 1}`;
  const restLabel = stage.dataset.rest || "rest";

  // Fitted to the largest pen, so the slider never moves the frame.
  const C = Cam(45, 0.5, 1.82);
  fit(C, [[-SLAB, -SLAB, -5], [MAX + SLAB, MAX + SLAB, -5], [MAX + SLAB, -SLAB, -5], [-SLAB, MAX + SLAB, -5], [0, 0, POST_H], [MAX, MAX, POST_H]], 200, 166);
  const P = proj(C), front = facing(C);
  const parts = ROVER.map(([x, y, l, w, r, b]) => ({ x, y, ring: rings(-l / 2, -w / 2, l / 2, w / 2, r, b) }));

  let pen = value, over = null, held = -1, built = null, touched = -Infinity, step = -1, nextAt = 0, B = null;
  const rx = spring(0), ry = spring(0), hd = spring(-0.5);
  const home = () => [pen * 0.36, pen * 0.6];

  function build() {
    svg.replaceChildren();
    const g = mk("g", {}, svg);
    const [sr, si] = rings(-SLAB, -SLAB, pen + SLAB, pen + SLAB, 8, 2);
    put(solid(g), prism(P, front, sr, si, -5, 0));
    // Sides, numbered round the pen: 0 along y = 0, 1 along x = pen, 2 along y = pen, 3 along x = 0.
    const n = Math.max(2, Math.round(pen / GAP)), gap = pen / n;
    const side = (k) => {
      const grp = mk("g", {}, g), along = (t) => [[t, 0], [pen, t], [t, pen], [0, t]][k], [a0, a1] = [along(0), along(pen)];
      const [rr, ri] = rings(Math.min(a0[0], a1[0]) - RAIL / 2, Math.min(a0[1], a1[1]) - RAIL / 2, Math.max(a0[0], a1[0]) + RAIL / 2, Math.max(a0[1], a1[1]) + RAIL / 2, 1.2, 0.5);
      const rail = solid(grp);
      put(rail, prism(P, front, rr, ri, POST_H - 4, POST_H - 1.4));
      for (let i = 0; i <= n; i++) {
        const [x, y] = along(i * gap), [pr, pi] = rings(x - POST / 2, y - POST / 2, x + POST / 2, y + POST / 2, 1.4, 0.6);
        put(solid(grp), prism(P, front, pr, pi, 0, POST_H));
      }
      return rail;
    };
    // Far sides, then the rover, then near sides: painting back to front.
    const rails = [];
    rails[3] = side(3); rails[0] = side(0);
    const rover = mk("g", {}, g), els = ROVER.map(() => solid(rover));
    rails[1] = side(1); rails[2] = side(2);
    built = { rails, rover, els, drawn: "" };
  }
  build();
  [rx.x, ry.x] = [rx.t, ry.t] = home();

  /** The rover's parts at its springs' pose, painted far to near by their centres' x + y. */
  function drawRover() {
    const key = `${rx.x.toFixed(2)},${ry.x.toFixed(2)},${hd.x.toFixed(3)}`;
    if (key === built.drawn) return;
    built.drawn = key;
    const c = Math.cos(hd.x), s = Math.sin(hd.x);
    const order = parts.map((p, i) => ({ i, x: rx.x + p.x * c - p.y * s, y: ry.x + p.x * s + p.y * c })).sort((a, b) => a.x + a.y - (b.x + b.y));
    for (const o of order) {
      const [ring, inner] = parts[o.i].ring, el = built.els[o.i];
      put(el, prism(P, front, turn(ring, hd.x, o.x, o.y), turn(inner, hd.x, o.x, o.y), ROVER[o.i][6], ROVER[o.i][7]));
      built.rover.append(el.g);
    }
  }

  /** Aims the rover at a ground point: inside the pen it goes there; outside, it stops at the fence that holds it. */
  function aim(target) {
    held = -1;
    const lo = MARGIN, hi = pen - MARGIN, [x, y] = target ?? home();
    if (target) {
      const out = [lo - y, x - hi, y - hi, lo - x], most = out.reduce((a, d, k) => (d > out[a] ? k : a), 0);
      if (out[most] > 0) held = most;
    }
    rx.t = clamp(x, lo, hi); ry.t = clamp(y, lo, hi);
    const dx = rx.t - rx.x, dy = ry.t - ry.x;
    if (Math.hypot(dx, dy) > 3) {
      const d = Math.atan2(dy, dx) - hd.x;
      hd.t = hd.x + Math.atan2(Math.sin(d), Math.cos(d));
    }
    built.rails.forEach((r, k) => r.sil.classList.toggle("hi", k === held));
    built.els[HEAD].sil.classList.toggle("hi", held < 0);
    read.textContent = held >= 0 ? label(held) : restLabel;
    B?.wake();
  }

  /** The tour: into each fence in turn, back home between them, while nobody is pointing. */
  const touring = () => "ambient" in stage.dataset && !("still" in stage.dataset) && !reducedMotion();
  const beyond = (k) => [[pen / 2, -40], [pen + 40, pen / 2], [pen / 2, pen + 40], [-40, pen / 2]][k];
  function tour(now) {
    if (over || !touring() || now - touched < IDLE || now < nextAt) return;
    step = (step + 1) % 8;
    nextAt = now + STEP;
    aim(step % 2 ? null : beyond(step / 2));
  }

  // register ticks once before it returns, so B is still null on that first call.
  B = register(stage, (dt, now) => {
    if (B) tour(now);
    const m = [stepS(rx, dt), stepS(ry, dt), stepS(hd, dt)].some(Boolean);
    drawRover();
    return m || touring();
  });
  bag.add(B.unregister);

  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], 0); aim(over); },
    leave: () => { over = null; touched = performance.now(); aim(null); },
  }));
  aim(null);
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { pen = v; build(); rx.x = clamp(rx.x, MARGIN, pen - MARGIN); ry.x = clamp(ry.x, MARGIN, pen - MARGIN); aim(over); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "paddock",
  means: "A rover in a fenced pen: it follows the pointer, and stops at the fence that holds it.",
  rules: [1, 3, 4, 5],
  range: [84, 98, 112],
  mount,
});
