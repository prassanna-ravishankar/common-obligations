/**
 * Beacons: a ridge of five signal towers on a long rocky plinth, receding from
 * the nearest. Each tower tapers to a gallery, a lantern and a roof, and a mast
 * carries a semaphore arm. The pointer picks a tower: its arm goes up and the
 * towers beyond it along the line raise theirs in turn, staggered by distance,
 * each a little lower than the last, so the warning visibly travels; the
 * chosen tower takes the bright stroke. Each tower names who is told, read
 * from the host's data-parts. At rest the nearest tower, the operator's, holds
 * its arm half raised and is bright. With data-ambient on the host, and no
 * pointer, the line raises from each tower in turn. The slider is the stagger.
 *
 * The pattern: one of many, picked by the nearest rest centre on screen
 * (rule 01), tweens staggered by distance (rule 02), the answer carried by
 * geometry and one bright stroke (rule 04).
 */
const { Cam, facing, fillet, fit, hull, open, poly, prism, proj, rad, reducedMotion, ringAt, rings, rrect, run, tween, tset, tval, tdone, mk, pointer, put, register, disposer, solid } = HL;

const N = 5, IDLE = 2600, STEP = 2400, LOW = -80, HALF = 30, UP = 72, FALL = 9, MAST = 46, PIVOT = 44, ARM_L = 30;
/** Towers from the nearest (the operator's) to the farthest: [x, y, rock height, body height]. */
const TOWERS = [[150, 2, 6, 52], [111, -3, 13, 44], [73, 4, 8, 47], [37, -2, 16, 37], [0, 3, 11, 41]];
/** A semaphore arm in its own plane, u out from the pivot, v across: a bar, then a blade to one side. */
const ARM = fillet([[-2.4, -1.8], [ARM_L, -1.8], [ARM_L, 7.5], [13, 7.5], [13, 1.8], [-2.4, 1.8]], [1.1, 0.8, 1.6, 1.2, 0.6, 1.1]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const items = (stage.dataset.parts || "").split("|").filter(Boolean);
  const label = (k) => items[k] || `tower ${k + 1}`;
  const restLabel = stage.dataset.rest || "rest";

  const C = Cam(45, 0.5, 1.42);
  const towers = TOWERS.map(([x, y, rock, body]) => ({ x, y, rock, z: rock + body }));
  // Fitted to the plinth and every arm at both ends of its swing, so nothing leaves the frame.
  const reach = (t, th) => [t.x - ARM_L * Math.cos(rad(th)), t.y, t.z + PIVOT + ARM_L * Math.sin(rad(th))];
  fit(C, [[-14, -14, -6], [164, 14, -6], [-14, 14, -6], [164, -14, -6], ...towers.flatMap((t) => [reach(t, UP), reach(t, LOW), [t.x, t.y, t.z + MAST]])], 200, 166);
  const P = proj(C), front = facing(C);
  let stag = value, choice = -2, inside = false, touched = -Infinity, nextAt = 0, B = null;

  /** A solid whose top is smaller than its foot: half-widths fh and th, radii fr and tr, from z0 to z1. */
  const taper = (x, y, fh, fr, th, tr, z0, z1) => ({
    sil: poly(hull(ringAt(P, rrect(x - fh, y - fh, x + fh, y + fh, fr, 4), z0).concat(ringAt(P, rrect(x - th, y - th, x + th, y + th, tr, 4), z1)))),
    crease: open(ringAt(P, run(rrect(x - th + 0.8, y - th + 0.8, x + th - 0.8, y + th - 0.8, Math.max(0.2, tr - 0.8), 4), front), z1)),
  });
  const block = (g, x0, y0, x1, y1, r, b, z0, z1) => { const [ring, inner] = rings(x0, y0, x1, y1, r, b); const s = solid(g); put(s, prism(P, front, ring, inner, z0, z1)); return s; };

  const g = mk("g", {}, svg);
  block(g, -14, -14, 164, 14, 9, 2, -6, 0);
  // Far to near by x + y, so each tower and its arm cover the ones behind.
  [...towers].sort((a, b) => a.x + a.y - (b.x + b.y)).forEach((t) => {
    const { x, y, z } = t;
    block(g, x - 12, y - 10, x + 11, y + 11, 5, 1.6, 0, t.rock);
    t.el = solid(g);
    put(t.el, taper(x, y, 7, 2.6, 4.4, 1.6, t.rock, z));
    block(g, x - 6.5, y - 6.5, x + 6.5, y + 6.5, 2, 0.8, z, z + 1.6);
    block(g, x - 3.6, y - 3.6, x + 3.6, y + 3.6, 1.2, 0.6, z + 1.6, z + 8);
    put(solid(g), taper(x, y, 5.4, 1.8, 1.4, 1, z + 8, z + 12));
    block(g, x - 0.8, y - 0.8, x + 0.8, y + 0.8, 0.4, 0.2, z + 12, z + MAST);
    t.back = mk("path", { class: "lo" }, g);
    t.face = mk("path", { class: "sil" }, g);
    t.a = tween(LOW);
    t.drawn = NaN;
  });

  /** Tower t's arm at th degrees above level, pointing up the line: a face and, just behind it, its thickness. */
  function drawArm(t, th) {
    if (th === t.drawn) return;
    t.drawn = th;
    const c = Math.cos(rad(th)), s = Math.sin(rad(th)), pz = t.z + PIVOT;
    const at = (dy) => poly(ARM.map(([u, v]) => P(t.x - u * c + v * s, t.y + dy, pz + u * s + v * c)));
    t.back.setAttribute("d", at(-0.6));
    t.face.setAttribute("d", at(1.6));
  }

  /** Raises the warning from tower k outward along the line; -1 is rest, the operator's arm half up. */
  function choose(k) {
    if (k === choice) return;
    const now = performance.now(), from = k >= 0 ? k : Math.max(choice, 0), lit = Math.max(k, 0);
    choice = k;
    towers.forEach((t, j) => {
      const th = k < 0 ? (j === 0 ? HALF : LOW) : j < k ? LOW : UP - FALL * (j - k);
      tset(t.a, th, now, Math.abs(j - from) * stag);
      t.el.sil.classList.toggle("hi", j === lit);
      t.face.classList.toggle("hi", j === lit);
    });
    read.textContent = k < 0 ? restLabel : label(k);
    B?.wake();
  }

  const touring = () => "ambient" in stage.dataset && !("still" in stage.dataset) && !reducedMotion();
  // register ticks once before it returns, so B is still null on that first call.
  B = register(stage, (_dt, now) => {
    if (B && !inside && touring() && now - touched >= IDLE && now >= nextAt) { nextAt = now + STEP; choose((choice + 1) % N); }
    let moving = false;
    for (const t of towers) { drawArm(t, tval(t.a, now)); if (!tdone(t.a, now)) moving = true; }
    return moving || touring();
  });
  bag.add(B.unregister);

  // Hit bands from the rest pose: each tower's screen x, and its span from plinth to mast top. Nothing in them moves.
  const bands = towers.map((t) => ({ sx: P(t.x, t.y, t.z / 2)[0], top: P(t.x, t.y, t.z + MAST + 8)[1], bot: P(t.x, t.y, -6)[1] + 12 }));
  function hit([x, y]) {
    const k = bands.reduce((a, b, i) => (Math.abs(x - b.sx) < Math.abs(x - bands[a].sx) ? i : a), 0), b = bands[k];
    return Math.abs(x - b.sx) < 30 && y > b.top && y < b.bot ? k : -1;
  }
  bag.add(pointer(stage, {
    move: (p) => { inside = true; choose(hit(p)); },
    leave: () => { inside = false; touched = performance.now(); choose(-1); },
  }));
  choose(-1);
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = v; },
    destroy: bag.dispose,
  };
}

hairline({
  name: "beacons",
  means: "A line of signal towers: the pointer raises one tower's arm, and the towers beyond it answer in turn.",
  rules: [1, 2, 4, 5],
  range: [0, 60, 120],
  mount,
});
