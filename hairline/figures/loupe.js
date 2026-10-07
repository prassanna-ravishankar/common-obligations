/**
 * Loupe: six face-down tiles on a desk mat, three by two, each one claim a
 * builder makes, read from the host's data-parts. The pointer picks the tile
 * under it on the ground: that tile tips up on its back edge to show the
 * punches on its underside, its neighbours lift a little, less the farther
 * they are, staggered outwards, and an inspector's loupe comes over and holds
 * its lens square to the punches. At rest the loupe lies on the mat beside the
 * board and one tile, the safety case, sits with its front edge barely raised,
 * bright: not yet examined. With data-ambient on the host, and no pointer, the
 * loupe examines each tile in turn. The slider is the angle the tile stands.
 *
 * The pattern: one of many, chosen on the ground plane (rule 01), with tweens
 * staggered by distance (rule 02) and a falloff that reaches a floor (rule 03).
 */
const { Cam, circ, clamp, fit, hull, poly, proj, rad, reducedMotion, ringAt, rrect, unproj, tween, tset, tval, tdone, mk, place, pointer, put, register, disposer, solid } = HL;

const COLS = 3, ROWS = 2, N = COLS * ROWS, TW = 30, TD = 30, GAP = 7, PITCH = TW + GAP, T = 3, REST = 9, STEP = 2400, IDLE = 2600;
const BX = COLS * PITCH - GAP, BY = ROWS * PITCH - GAP, X0 = -9, Y0 = -9, X1 = BX + 50, Y1 = BY + 9;
const RL = 12.5, HANDLE = 20, STAND = 10, PARK = [BX + 16, BY - 14, 2.2], DV = TD - 11;
// Punch positions on a tile's underside, near its front edge: tile k has the first k + 1 punched.
const PU = [0, 1, 2, 3, 4, 5].map((i) => [TW / 2 + ((i % 3) - 1) * 5.5, DV + (Math.floor(i / 3) - 0.5) * 5.5]);

/** Twice the signed area of a screen polygon: its sign says which way round it runs. */
const area = (pts) => pts.reduce((a, p, i) => { const q = pts[(i + 1) % pts.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0);
/** A plane through o, tipped th degrees about the x axis: the world point of u along x, v across it, w out of it. */
const plane = (o, th) => {
  const s = Math.sin(rad(th)), c = Math.cos(rad(th));
  return (u, v, w) => [o[0] + u, o[1] + v * c - w * s, o[2] + v * s + w * c];
};
/** Where tile k's plane sits when it stands th degrees on its back edge. */
const tileAt = (k, th) => plane([(k % COLS) * PITCH, Math.floor(k / COLS) * PITCH, (th / 90) * 4], th);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const items = (stage.dataset.parts || "").split("|").filter(Boolean);
  const label = (k) => items[k] || `tile ${k + 1}`;
  const restLabel = stage.dataset.rest || "rest";

  // Fitted to the mat and to the highest pose: a back tile stood straight up.
  const C = Cam(45, 0.5, 1.78);
  fit(C, [[X0, Y0, -5], [X1, Y1, -5], [X1, Y0, -5], [X0, Y1, -5], [0, 0, 36], [BX, 0, 36]], 200, 166);
  const P = proj(C), at = (f) => (u, v, w) => P(...f(u, v, w));
  // A ring that runs the same way as its plane's axes shows its w side when its screen points run this way.
  const sq = [P(0, 0, 0), P(1, 0, 0), P(1, 1, 0), P(0, 1, 0)], sigma = Math.sign(area(sq));
  let thMax = value, choice = -1, B = null, over = false, touched = -Infinity, nextAt = 0;

  /** A plate of outline `ring` in screen map f, from w0 to w1: its silhouette, the crease on the side that shows, and that side. */
  function slab(f, ring, inner, w0, w1) {
    const bot = ring.map((q) => f(q.u, q.v, w0)), top = ring.map((q) => f(q.u, q.v, w1));
    const up = Math.sign(area(top)) === Math.sign(area(ring.map((q) => [q.u, q.v]))) * sigma, w = up ? w1 : w0;
    return { hp: hull(bot.concat(top)), crease: poly(inner.map((q) => f(q.u, q.v, w))), w };
  }

  const g = mk("g", {}, svg), mat = solid(g), flat = at(plane([0, 0, 0], 0));
  const m = slab(flat, rrect(X0, Y0, X1, Y1, 9), rrect(X0 + 2.2, Y0 + 2.2, X1 - 2.2, Y1 - 2.2, 6.8), -5, 0);
  put(mat, { sil: poly(m.hp), crease: m.crease });
  mk("path", { d: poly(ringAt(P, rrect(-4, -4, BX + 4, BY + 4, 6), 0)), class: "nf lo" }, g);

  // Tiles diagonal by diagonal from the back corner, each over its well on the mat.
  const RING = rrect(0, 0, TW, TD, 3.5), INNER = rrect(1.2, 1.2, TW - 1.2, TD - 1.2, 2.3);
  const order = [...Array(N).keys()].sort((a, b) => (a % COLS) + Math.floor(a / COLS) - (b % COLS) - Math.floor(b / COLS));
  const tiles = [];
  for (const k of order) {
    const f = at(tileAt(k, 0));
    mk("path", { d: poly(RING.map((q) => f(q.u, q.v, 0))), class: "nf lo" }, g);
    const tg = mk("g", {}, g), el = solid(tg), dg = mk("g", {}, tg);
    const dots = PU.map(() => mk("circle", { r: 1.25, class: "dot off" }, dg));
    tiles[k] = { k, tg, el, dg, dots, a: tween(k === N - 1 ? REST : 0), drawn: NaN };
  }

  // The loupe, last: a lens in an open rim, a collar and a handle, all in one plane that tips to face a tile.
  const lg = mk("g", {}, g), lens = solid(lg), handle = solid(lg), collar = solid(lg);
  const LO = circ(RL, 48), LI = circ(RL - 1, 48), LH = circ(RL - 3, 48);
  const HR = rrect(RL - 1, -2.4, RL + HANDLE, 2.4, 2.4), HI = rrect(RL, -1.6, RL + HANDLE - 1, 1.6, 1.6);
  const CR = rrect(RL - 2, -3.4, RL + 3.5, 3.4, 2.6), CI = rrect(RL - 1.4, -2.8, RL + 2.9, 2.8, 2);
  const lx = tween(PARK[0]), ly = tween(PARK[1]), lz = tween(PARK[2]), lt = tween(0);
  let loupeDrawn = "";

  function drawTile(t, th) {
    if (th === t.drawn) return;
    t.drawn = th;
    const f = at(tileAt(t.k, th)), s = slab(f, RING, INNER, 0, T);
    put(t.el, { sil: poly(s.hp), crease: s.crease });
    t.dots.forEach((el, i) => place(el, f(PU[i][0], PU[i][1], 0)));
    // The punches are on the underside: in front of the plate when it shows, behind it when it does not.
    if (s.w === 0) t.tg.append(t.dg); else t.tg.prepend(t.dg);
  }

  function drawLoupe(x, y, z, th) {
    const key = [x, y, z, th].map((n) => n.toFixed(2)).join();
    if (key === loupeDrawn) return;
    loupeDrawn = key;
    const f = at(plane([x, y, z], th)), r = slab(f, LO, LI, -1.2, 1.2);
    // The lens is open: the hole runs against the rim, so the rim's fill leaves it clear.
    let hole = LH.map((q) => f(q.u, q.v, r.w));
    if (Math.sign(area(hole)) === Math.sign(area(r.hp))) hole = hole.reverse();
    put(lens, { sil: poly(r.hp) + poly(hole), crease: r.crease });
    const h = slab(f, HR, HI, -1.6, 1.6), c = slab(f, CR, CI, -2.2, 2.2);
    put(handle, { sil: poly(h.hp), crease: h.crease });
    put(collar, { sil: poly(c.hp), crease: c.crease });
  }

  /** Where the lens hangs to examine tile k: square to its punches, STAND out from them on the line of sight. */
  function examine(k) {
    const D = tileAt(k, thMax)(TW / 2, DV, 0), [sx, sy] = P(...D), s = Math.sin(rad(thMax)), c = Math.cos(rad(thMax));
    // w, out of the tile's face, along the sight line through the punches, as the line climbs by dz
    const w = (dz) => { const [x, y] = unproj(C, sx, sy, D[2] + dz); return -s * (y - D[1]) + c * dz; };
    const dz = -STAND / w(1), [x, y] = unproj(C, sx, sy, D[2] + dz);
    return [x, y, D[2] + dz, thMax];
  }

  function choose(k) {
    if (k === choice) return;
    const now = performance.now(), from = k >= 0 ? k : Math.max(choice, 0), bright = k < 0 ? N - 1 : k;
    choice = k;
    for (const t of tiles) {
      const d = Math.hypot((t.k % COLS) - (from % COLS), Math.floor(t.k / COLS) - Math.floor(from / COLS));
      const th = k < 0 ? (t.k === N - 1 ? REST : 0) : t.k === k ? thMax : Math.max(0, 16 - 8 * d);
      tset(t.a, th, now, d * 45);
      t.el.sil.classList.toggle("hi", t.k === bright);
      t.dots.forEach((el, i) => el.setAttribute("class", i > t.k ? "dot off" : t.k === k ? "dot" : "dot m"));
    }
    const pose = k < 0 ? [...PARK, 0] : examine(k);
    [lx, ly, lz, lt].forEach((tw, i) => tset(tw, pose[i], now, 0));
    read.textContent = k < 0 ? restLabel : label(k);
    B?.wake();
  }

  /** The tour: each tile in turn while nobody is pointing at the board. */
  const touring = () => "ambient" in stage.dataset && !("still" in stage.dataset) && !reducedMotion();
  // register ticks once before it returns, so B is still null on that first call.
  B = register(stage, (_dt, now) => {
    if (B && !over && touring() && now - touched >= IDLE && now >= nextAt) { nextAt = now + STEP; choose((choice + 1) % N); }
    let moving = false;
    for (const t of tiles) { drawTile(t, tval(t.a, now)); if (!tdone(t.a, now)) moving = true; }
    drawLoupe(tval(lx, now), tval(ly, now), tval(lz, now), tval(lt, now));
    return moving || !tdone(lx, now) || !tdone(lt, now) || touring();
  });
  bag.add(B.unregister);

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      touched = performance.now();
      over = x > -GAP && x < BX + GAP && y > -GAP && y < BY + GAP;
      choose(over ? clamp(Math.floor((y + GAP / 2) / PITCH), 0, ROWS - 1) * COLS + clamp(Math.floor((x + GAP / 2) / PITCH), 0, COLS - 1) : -1);
    },
    leave: () => { over = false; touched = performance.now(); choose(-1); },
  }));
  tiles[N - 1].el.sil.classList.add("hi");
  tiles[N - 1].dots.forEach((el) => el.setAttribute("class", "dot m"));
  read.textContent = restLabel;
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { thMax = v; const k = choice; choice = -2; choose(k); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "loupe",
  means: "Six face-down tiles: the one under the pointer tips up to show its underside, and a loupe comes over to read it.",
  rules: [1, 2, 3, 4],
  range: [55, 70, 85],
  mount,
});
