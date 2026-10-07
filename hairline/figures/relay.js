/**
 * Relay: five tagged crates passed along a service counter towards a bell at
 * its end. Each crate's tag is punched once for every hand it has passed
 * through, so the punches keep the chain of custody without a word. The
 * pointer picks a crate: it lifts and squares up, its neighbours part,
 * staggered outwards from it, and it takes the bright stroke with its tag and
 * punches. Each crate is one supplier in the chain, read from the host's
 * data-parts. At rest the crates sit as they were left, a little askew, and the
 * bell at the deployer's end of the counter is the bright mark: whoever handed
 * what along, that is where the answer is rung for. With data-ambient on the
 * host, and no pointer, the counter lifts each crate in turn. The slider is the
 * stagger, in ms.
 *
 * The pattern: one of many, as Riffle, picked by the crates' rest centres
 * (rule 01), with tweens staggered by distance (rule 02) and identity punched
 * as geometry (rule 10).
 */
const { Cam, circ, facing, fillet, fit, hull, open, poly, prism, proj, reducedMotion, ringAt, rings, rrect, tween, tset, tval, tdone, mk, place, pointer, put, register, disposer, solid } = HL;

const N = 5, GX = 40, HW = 13, HD = 17, H = 18, LID = 2.6, OV = 1.6, LIFT = 13, PART = 6, PL = 16, STEP = 2400, IDLE = 2600;
const X0 = -30, X1 = 4 * GX + 74, Y0 = -30, Y1 = 30, BX = 4 * GX + 48, BY = 2;
// Where each crate was left: a little off the line, a little turned.
const REST_Y = [-5, 4, -3, 6, -1], REST_A = [-0.12, 0.07, -0.05, 0.1, -0.03];
// A luggage tag on the crate's front face, in (u along the crate, z): its point towards the start of the chain.
const TAG = fillet([[-12, 8], [-8, 11.5], [10, 11.5], [10, 4.5], [-8, 4.5]], [0.6, 1, 1.2, 1.2, 1]);

/** A ring turned by angle a about the origin and moved to (x, y): positions and normals both turn. */
const turn = (ring, a, x, y) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const items = (stage.dataset.parts || "").split("|").filter(Boolean);
  const label = (k) => items[k] || `crate ${k + 1}`;
  const restLabel = stage.dataset.rest || "rest";
  let stag = value, choice = -1, active = false, touched = -Infinity, nextAt = 0, B = null;

  // Fitted to the counter with a crate lifted, so no pose leaves the frame.
  const C = Cam(45, 0.5, 1.36);
  fit(C, [[X0, Y0, -PL], [X1, Y1, -PL], [X1, Y0, -PL], [X0, Y1, -PL], [0, 0, H + LID + LIFT], [4 * GX, 0, H + LID + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // The counter: a plinth set back under an overhanging top.
  const [pr, pi] = rings(X0 + 6, Y0 + 6, X1 - 6, Y1 - 6, 6, 1.5), [tr, ti] = rings(X0, Y0, X1, Y1, 9, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PL, -6));
  put(solid(g), prism(P, front, tr, ti, -6, 0));
  // The line the crates are passed along, under them.
  mk("path", { d: open([P(-20, 0, 0), P(BX - 13, 0, 0)]), class: "nf dash" }, g);

  // Crates, far to near: body, tag, grip, punches, then the lid over them.
  const body = rings(-HW, -HD, HW, HD, 3, 1.2), lid = rings(-HW - OV, -HD - OV, HW + OV, HD + OV, 3.6, 1.2);
  const crates = [];
  for (let i = 0; i < N; i++) {
    const grp = mk("g", {}, g), b = solid(grp);
    const tag = mk("path", { class: "nf" }, grp), grip = mk("path", { class: "nf lo" }, grp);
    // one punch for each hand the crate has passed through
    const dots = Array.from({ length: i + 1 }, () => mk("circle", { r: 1.1, class: "dot m" }, grp));
    crates.push({ b, tag, grip, dots, l: solid(grp), up: tween(0), dx: tween(0), drawn: "" });
  }

  // The bell at the deployer's end: a base, a dome, a plunger and its cap.
  const bell = mk("g", {}, g), ring = (R) => turn(circ(R, 32), 0, BX, BY);
  put(solid(bell), prism(P, front, ring(11), ring(9.8), 0, 3));
  const dome = solid(bell);
  dome.sil.setAttribute("d", poly(hull([[10, 3], [9.4, 7], [7.6, 10.4], [4.6, 12.6], [0.6, 13.4]].flatMap(([R, z]) => ringAt(P, ring(R), z)))));
  put(solid(bell), prism(P, front, ring(1.1), ring(0.6), 13.2, 16.4));
  put(solid(bell), prism(P, front, ring(2.8), ring(2), 16.4, 18));

  /** Crate i at its tweens' pose: lifted, it squares up and comes back onto the line. */
  function drawCrate(i, now) {
    const c = crates[i], up = tval(c.up, now), x = i * GX + tval(c.dx, now), key = `${x.toFixed(2)},${up.toFixed(4)}`;
    if (key !== c.drawn) {
      c.drawn = key;
      const y = REST_Y[i] * (1 - up), a = REST_A[i] * (1 - up), z = up * LIFT, cs = Math.cos(a), sn = Math.sin(a);
      const w = (u, v, h) => P(x + u * cs - v * sn, y + u * sn + v * cs, z + h);
      put(c.b, prism(P, front, turn(body[0], a, x, y), turn(body[1], a, x, y), z, z + H));
      put(c.l, prism(P, front, turn(lid[0], a, x, y), turn(lid[1], a, x, y), z + H, z + H + LID));
      c.tag.setAttribute("d", poly(TAG.map(([u, h]) => w(u, HD, h))));
      c.grip.setAttribute("d", poly(rrect(-7, 11, 7, 14.5, 1.7, 4).map((q) => w(HW, q.u, q.v))));
      c.dots.forEach((el, j) => place(el, w(-5 + j * 3.4, HD, 8)));
    }
    return !tdone(c.up, now) || !tdone(c.dx, now);
  }

  // Hit test on the rest pose: the crate whose resting centre is nearest the pointer's screen x, inside a band round it.
  const centres = Array.from({ length: N }, (_, i) => P(i * GX, REST_Y[i], H / 2));
  function hit([sx, sy]) {
    let k = 0;
    centres.forEach((c, i) => { if (Math.abs(sx - c[0]) < Math.abs(sx - centres[k][0])) k = i; });
    return Math.abs(sx - centres[k][0]) < 30 && Math.abs(sy - centres[k][1]) < 38 ? k : -1;
  }

  /** Lifts crate k (-1 sets them all down). The stagger spreads out from the crate lifted, or the one let go. */
  function choose(k) {
    if (k === choice) return;
    const now = performance.now(), from = k >= 0 ? k : choice;
    choice = k;
    crates.forEach((c, i) => {
      const delay = Math.abs(i - from) * stag;
      tset(c.up, i === k ? 1 : 0, now, delay);
      tset(c.dx, k < 0 || i === k ? 0 : Math.sign(i - k) * PART, now, delay);
      [c.b.sil, c.l.sil, c.tag].forEach((el) => el.classList.toggle("hi", i === k));
      c.dots.forEach((el) => el.classList.toggle("m", i !== k));
    });
    dome.sil.classList.toggle("hi", k < 0);
    read.textContent = k < 0 ? restLabel : label(k);
    B?.wake();
  }

  /** The tour: each crate in turn while nobody is pointing. */
  const touring = () => "ambient" in stage.dataset && !("still" in stage.dataset) && !reducedMotion();
  // register ticks once before it returns, so B is still null on that first call.
  B = register(stage, (_dt, now) => {
    if (B && !active && touring() && now - touched >= IDLE && now >= nextAt) { nextAt = now + STEP; choose((choice + 1) % N); }
    let m = false;
    for (let i = 0; i < N; i++) if (drawCrate(i, now)) m = true;
    return m || touring();
  });
  bag.add(B.unregister);

  bag.add(pointer(stage, {
    move: (p) => { active = true; choose(hit(p)); },
    leave: () => { active = false; touched = performance.now(); choose(-1); },
  }));
  dome.sil.classList.add("hi");
  read.textContent = restLabel;
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = v; },
    destroy: bag.dispose,
  };
}

hairline({
  name: "relay",
  means: "Crates passed along a counter, each tag punched once per hand: the pointer lifts one, and the bell at the end stays answerable.",
  rules: [1, 2, 4, 10],
  range: [0, 45, 90],
  mount,
});
