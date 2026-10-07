/**
 * Switchyard: a ladder yard on a bed. An entry line runs into a diagonal ladder
 * of five switches, and six sidings leave it, each ending at a buffer stop. The
 * pointer picks the siding nearest it on the ground: the switch levers along
 * the ladder throw in turn, outwards from it, that route's rails take the
 * bright stroke, and a wagon rolls there, backing to the junction first when it
 * stands on another siding. Each siding names one decision, read from the
 * host's data-parts. At rest the wagon waits on the entry line, its roof bright.
 * With data-ambient on the host, and no pointer, the yard routes the wagon to
 * each siding in turn. The slider is the gap between sidings.
 *
 * The pattern: one of many, chosen on the ground plane (rule 01), with tweens
 * staggered by distance (rule 02) and the choice carried as a route.
 */
const { Cam, clamp, facing, fillet, fit, prism, proj, reducedMotion, rings, unproj, open, seg, tween, tset, tval, tdone, mk, pointer, put, register, disposer, solid } = HL;

const N = 6, GX = 34, ENTRY = 30, BED = 9, RAIL = 2.2, LIFT = 2, STEP = 2600, IDLE = 2600;

/** A ring turned by angle a about the origin and moved to (x, y): positions and normals both turn. */
const turn = (ring, a, x, y) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
/** A convex polygon, filleted, as a ring of samples with outward normals, and its crease inset by b. */
function shape(pts, r, b) {
  const p = fillet(pts, pts.map(() => r)), n = p.length;
  const cx = p.reduce((a, q) => a + q[0], 0) / n, cy = p.reduce((a, q) => a + q[1], 0) / n;
  const ring = p.map((q, i) => {
    const a = p[(i + n - 1) % n], c = p[(i + 1) % n], tx = c[0] - a[0], ty = c[1] - a[1], L = Math.hypot(tx, ty) || 1;
    const out = ty * (q[0] - cx) - tx * (q[1] - cy) < 0 ? -1 : 1;
    return { u: q[0], v: q[1], nu: (out * ty) / L, nv: (-out * tx) / L };
  });
  return [ring, ring.map((q) => ({ ...q, u: q.u - q.nu * b, v: q.v - q.nv * b }))];
}
/** A track from a to b, as its bed's ring pair, centred on the segment. */
function bed(a, b) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const [r, i] = rings(-BED / 2, -BED / 2, L + BED / 2, BED / 2, 2.6, 0.9);
  return [turn(r, ang, a[0], a[1]), turn(i, ang, a[0], a[1])];
}
/** The point at arc length s along a polyline, with its segment's heading. */
function along(route, s) {
  for (let i = 1; i < route.length; i++) {
    const [a, b] = [route[i - 1], route[i]], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (s <= L || i === route.length - 1) {
      const t = clamp(s / L, 0, 1);
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.atan2(b[1] - a[1], b[0] - a[0])];
    }
    s -= L;
  }
}
const length = (route) => route.slice(1).reduce((n, b, i) => n + Math.hypot(b[0] - route[i][0], b[1] - route[i][1]), 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const items = (stage.dataset.parts || "").split("|").filter(Boolean);
  const label = (k) => items[k] || `siding ${k + 1}`;
  const restLabel = stage.dataset.rest || "rest";

  const END = (N - 1) * GX + 56, GMAX = 19, C = Cam(45, 0.5, 1.36);
  const outline = (g) => [[-ENTRY - 6, -10], [END + 10, -10], [END + 10, (N - 1) * g + 10], [(N - 1) * GX - 12, (N - 1) * g + 10], [-ENTRY - 6, 10]];
  fit(C, [...outline(GMAX).map(([x, y]) => [x, y, -4]), [-ENTRY, 0, 14]], 200, 166);
  const P = proj(C), front = facing(C);
  let G = value, choice = -1, built, B = null, over = false, touched = -Infinity, nextAt = 0;
  const wagon = { s: tween(ENTRY - 16), route: -1, next: -1 };

  const junction = (k) => [k * GX, k * G];
  /** Route k: the entry line, up the ladder to switch k, then out along siding k. */
  const route = (k) => (k < 0 ? [[-ENTRY, 0], [0, 0]] : [[-ENTRY, 0], [0, 0], ...(k ? [junction(k)] : []), [END, k * G]]);
  /** The tracks route k lights: the entry, the ladder's segments up to switch k, its siding. */
  const lit = (k) => (k < 0 ? [] : [0, ...Array.from({ length: k }, (_, j) => 1 + j), N + k]);

  function build() {
    svg.replaceChildren();
    const g = mk("g", {}, svg);
    const [sr, si] = shape(outline(G), 8, 2);
    put(solid(g), prism(P, front, sr, si, -4, 0));
    // Track 0 is the entry, 1 to 5 the ladder's segments between switches, 6 to 11 the sidings.
    const tracks = [[[-ENTRY, 0], [0, 0]]];
    for (let k = 1; k < N; k++) tracks.push([junction(k - 1), junction(k)]);
    for (let k = 0; k < N; k++) tracks.push([junction(k), [END, k * G]]);
    // Beds first: they are one height, so the marks on top can follow in any order.
    for (const [a, b] of tracks) { const [r, i] = bed(a, b); put(solid(g), prism(P, front, r, i, 0, LIFT)); }
    // Rails and sleepers, marks a bed really has: one rail pair per track, so a route lights its own.
    const rails = tracks.map(([a, b]) => {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
      let sl = "";
      for (let d = 4; d < L; d += 9) sl += seg(P(a[0] + ux * d - uy * 3.6, a[1] + uy * d + ux * 3.6, LIFT), P(a[0] + ux * d + uy * 3.6, a[1] + uy * d - ux * 3.6, LIFT));
      mk("path", { d: sl, class: "nf lo" }, g);
      const side = (o) => open([P(a[0] - uy * o, a[1] + ux * o, LIFT), P(b[0] - uy * o, b[1] + ux * o, LIFT)]);
      return mk("path", { d: side(RAIL) + side(-RAIL), class: "nf" }, g);
    });
    // Tall things, sorted far to near: switch stands beside the ladder and buffer stops at the sidings' ends.
    const tall = [], stands = [];
    for (let k = 0; k < N - 1; k++) {
      const [x, y] = junction(k), [pr, pi] = rings(x + 5, y - 9, x + 9, y - 5, 1.2, 0.5), grp = mk("g", {}, g), lever = solid(grp);
      put(solid(grp), prism(P, front, pr, pi, 0, 9));
      grp.append(lever.g);
      stands.push({ x: x + 7, y: y - 7, lever, a: tween(0) });
      tall.push({ key: x + y - 2, grp });
    }
    for (let k = 0; k < N; k++) {
      const [br, bi] = rings(END + 2, k * G - 4, END + 7, k * G + 4, 1.6, 0.6), grp = mk("g", {}, g);
      put(solid(grp), prism(P, front, br, bi, 0, 7));
      tall.push({ key: END + k * G, grp });
    }
    tall.sort((a, b) => a.key - b.key).forEach((t) => g.append(t.grp));
    const wg = mk("g", {}, g);
    built = { rails, stands, tall, wg, car: solid(wg), drawn: "" };
  }
  build();

  function drawStands(now) {
    let m = false;
    const [lr, li] = rings(-0.9, -4.5, 0.9, 4.5, 0.9, 0.3);
    for (const st of built.stands) {
      const a = tval(st.a, now);
      put(st.lever, prism(P, front, turn(lr, a, st.x, st.y), turn(li, a, st.x, st.y), 9, 10.4));
      if (!tdone(st.a, now)) m = true;
    }
    return m;
  }
  function drawWagon(now) {
    const [x, y, h] = along(route(wagon.route), tval(wagon.s, now)), key = `${x.toFixed(2)},${y.toFixed(2)},${h.toFixed(3)}`;
    if (key !== built.drawn) {
      built.drawn = key;
      const [cr, ci] = rings(-13, -4.6, 13, 4.6, 2.4, 1);
      put(built.car, prism(P, front, turn(cr, h, x, y), turn(ci, h, x, y), LIFT + 1, 12));
      // Among the tall things by depth, so stands in front still cover it.
      const after = built.tall.filter((t) => t.key < x + y).at(-1);
      (after ? after.grp : built.rails.at(-1)).after(built.wg);
    }
    // Back at the junction on the old route: take the new one and roll on.
    if (wagon.next !== -1 && tdone(wagon.s, now)) {
      wagon.route = wagon.next; wagon.next = -1;
      tset(wagon.s, length(route(wagon.route)) - 14, now, 0);
    }
    return !tdone(wagon.s, now) || wagon.next !== -1;
  }

  function choose(k) {
    if (k === choice) return;
    const now = performance.now();
    choice = k;
    built.rails.forEach((el, t) => el.classList.toggle("hi", lit(k).includes(t)));
    built.car.sil.classList.toggle("hi", k < 0);
    built.stands.forEach((st, j) => tset(st.a, k > j ? 1.1 : 0, now, Math.abs(j - Math.max(k, 0)) * 45));
    // Track shared with the new route: the entry, and the ladder up to the lower junction.
    const shared = (a, b) => ENTRY + Math.hypot(GX, G) * Math.min(Math.max(a, 0), Math.max(b, 0));
    const s = tval(wagon.s, now), from = wagon.next !== -1 ? wagon.next : wagon.route;
    if (k < 0) {
      wagon.next = -1;
      tset(wagon.s, ENTRY - 16, now, 0);
    } else if (from < 0 || s <= shared(from, k) + 1) {
      wagon.route = k; wagon.next = -1;
      tset(wagon.s, length(route(k)) - 14, now, 0);
    } else {
      wagon.route = from; wagon.next = k;
      tset(wagon.s, shared(from, k), now, 0);
    }
    read.textContent = k < 0 ? restLabel : label(k);
    B?.wake();
  }

  /** The tour: each siding in turn while nobody is pointing. */
  const touring = () => "ambient" in stage.dataset && !("still" in stage.dataset) && !reducedMotion();
  // register ticks once before it returns, so B is still null on that first call.
  B = register(stage, (_dt, now) => {
    if (B && !over && touring() && now - touched >= IDLE && now >= nextAt) { nextAt = now + STEP; choose((choice + 1) % N); }
    return drawStands(now) | drawWagon(now) || touring();
  });
  bag.add(B.unregister);

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = x > -ENTRY - 6 && x < END + 10 && y > -10 && y < (N - 1) * G + 10;
      if (over) choose(clamp(Math.round(y / G), 0, N - 1));
    },
    leave: () => { over = false; touched = performance.now(); choose(-1); },
  }));
  built.car.sil.classList.add("hi");
  read.textContent = restLabel;
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { G = v; const k = choice; choice = -2; build(); wagon.route = -1; wagon.next = -1; tset(wagon.s, ENTRY - 16, -1e9, 0); choose(k); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "switchyard",
  means: "A rail yard: the pointer picks a siding, its switches throw in turn and a wagon rolls down that route.",
  rules: [1, 2, 4, 8],
  range: [13, 16, 19],
  mount,
});
