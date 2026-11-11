// Fig: inner mitochondrial membrane as a pressure machine.
// The lid is a patch of crista membrane (inner membrane). Above it is the matrix,
// the tank under it is the intermembrane space. Complexes I, III and IV pump
// protons down into the tank; ATP synthase lets them back up, the c-ring turns,
// and every third of a turn one beta subunit releases an ATP.
//
// node build.mjs           -> mitochondria.html
// node build.mjs --light   -> mitochondria-light.html
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../.claude/skills/anatomy/kit/iso-kit.mjs";
import * as G from "../../.claude/skills/anatomy/kit/lathe.mjs";
import { kitScript } from "../../.claude/skills/anatomy/scripts/inline-kit.mjs";
import { MODEL } from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";

const WIDTH = 640;
const HEIGHT = 420;

// ---------- world plan ----------
const PLATE = { x: -140, y: -56, w: 290, d: 112, r: 8 };
const PLATE_Z = -36, PLATE_H = 10, FOOT_H = 5;
const TANK = { x: -130, y: -46, w: 270, d: 92, r: 6 };
const TANK_Z = -26, TANK_H = 24; // intermembrane space
const LID_Z = -2, LID_H = 10; // inner membrane (bilayer)
const TOP = LID_Z + LID_H; // matrix face, z = 8
const FRONT = TANK.y + TANK.d; // y = 52, the visible long face

// Complex I (L shape)
const C1_ARM = { x: -118, y: -16, w: 46, d: 20, r: 3 };
const C1_ARM_H = 7;
const C1_COL = { x: -116, y: -14, w: 15, d: 16, r: 3 };
const C1_COL_TOP = 58;
const C1_CUP = [-108.5, -6];
const C1_BORES = [-113, -103, -93, -83].map((x) => [x, 10]);

// ubiquinone rail between I and III
const Q_RAIL = { from: -64, to: -52, y: -4 };
const Q_R = 4;

// Complex III dimer
const C3 = [
  { x: -44, y: -16, w: 14, d: 26, r: 3 },
  { x: -28, y: -16, w: 14, d: 26, r: 3 },
];
const C3_H = 22;
const C3_BORES = [[-37, 16], [-21, 16]];

// cytochrome c rail between III and IV
const CC_RAIL = { from: -8, to: 14, y: 2 };
const CC_R = 3;

// Complex IV
const C4 = { x: 20, y: -14, w: 26, d: 24, r: 4 };
const C4_H = 18;
const C4_BORES = [[33, 16]];

// ATP synthase
const AS = [92, 0];
const RING_R = 16, RING_Z0 = TOP, RING_Z1 = TOP + 4; // c-ring, 8 subunits
const C_SUBUNITS = MODEL.cRing;
const GAMMA_R = 3.2, GAMMA_Z1 = 40;
const EPS_Z = 22; // the foot disc on the stalk, carries the lit pointer
const F1_Z = 52, F1_RING = 12, F1_BALL = 11;
const STATOR = [111, -19]; // a-subunit and peripheral stalk
const A_SUB = { x: 106, y: -24, w: 10, d: 10, r: 2 };
const A_TOP = TOP + 12;
const B_R = 2.2, B_TOP = 72;
const DELTA_Z = 64, DELTA_H = 4;

// proton-motive gauge
const GAUGE = [58, 27];
const GAUGE_R = 11, GAUGE_Z = TOP, GAUGE_H = 6;
const GAUGE_TOP = GAUGE_Z + GAUGE_H;
const GAUGE_SPAN = (270 * Math.PI) / 180, GAUGE_FROM = -GAUGE_SPAN / 2;

// sight glass on the tank front: protons in the intermembrane space
const GLASS = { x0: -112, x1: -50, z0: TANK_Z + 5, z1: LID_Z - 5 };

const P = k.fitProjection(
  [...k.boxCorners(PLATE, PLATE_Z - FOOT_H, TOP), [C1_COL.x, C1_COL.y, C1_COL_TOP + 4], [AS[0], AS[1], B_TOP + 4], [STATOR[0], STATOR[1], B_TOP + 2]],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 60, elevation: 34 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const depth2 = ([x, y]) => k.depthOf([x, y, 0], P);
const byDepth = (points) => [...points].sort((a, b) => depth2(a) - depth2(b));
const screws = (list, z, size = 0.45, tone = "mid") => D(list.map(([x, y]) => at([x, y, z])), { size, tone });

// ---------- base and tank ----------
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, PLATE_Z - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 20))) {
    out.push(S(k.cylinder(x, y, 7, PLATE_Z - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, PLATE_Z - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, PLATE_Z, PLATE_H, P, 8, 1.4), { tone: "lo" }));
  const plateTop = PLATE_Z + PLATE_H;
  const corner = k.corners(PLATE, 6);
  out.push(L(corner.map(([x, y]) => k.ring(x, y, 2, plateTop, P, 16)).join(""), { tone: "lo" }));
  out.push(screws(corner, plateTop, 0.45));
  // ruler strip on the front margin
  const strip = { x: -128, y: FRONT + 3, w: 256, d: 6, r: 1 };
  out.push(S(k.slabOf(strip, plateTop, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 5, 5, strip.y + 0.6, plateTop + 0.6, [1.8, 3.4], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  return out.join("");
}

function tank() {
  const out = [];
  const seam = L(k.sideSeam(TANK, TANK_Z + 5, P, 6), { tone: "faint" });
  out.push(S(k.slabOf(TANK, TANK_Z, TANK_H, P, 6, 0), { tone: "mid", inner: seam }));
  // vertical frame ribs on the front face, edge to edge
  for (const x of [-30, 50]) out.push(L(k.segment([x, FRONT, TANK_Z], [x, FRONT, LID_Z], P), { tone: "faint" }));
  // ribs on the right face
  for (const y of [-18, 18]) out.push(L(k.segment([TANK.x + TANK.w, y, TANK_Z], [TANK.x + TANK.w, y, LID_Z], P), { tone: "faint" }));
  // bolt dots along the bottom flange seam
  const bolts = [];
  for (let x = -118; x <= 126; x += 16) bolts.push([x, FRONT, TANK_Z + 2.5]);
  for (let y = -36; y <= 36; y += 12) bolts.push([TANK.x + TANK.w, y, TANK_Z + 2.5]);
  out.push(D(bolts.map(at), { size: 0.4, tone: "lo" }));
  out.push(sightGlass());
  out.push(drainValve());
  return out.join("");
}

// face-plane helpers (front face y = FRONT)
const onFront = (pts) => k.pathOf(pts.map(([x, z]) => at([x, FRONT + 0.05, z])), true);

function sightGlass() {
  const g = GLASS;
  const out = [];
  // bezel plate standing 1.2 proud of the face
  const bezel = { x: g.x0 - 4, y: FRONT, w: g.x1 - g.x0 + 8, d: 1.2, r: 0.6 };
  // drawn as an extrusion of its face outline toward +y: approximate with a thin slab rotated into the face
  const ringPts = [
    [bezel.x, FRONT], [bezel.x + bezel.w, FRONT], [bezel.x + bezel.w, FRONT + 1.2], [bezel.x, FRONT + 1.2],
  ];
  out.push(S(k.extrude(ringPts, g.z0 - 4, g.z1 - g.z0 + 8, P), { tone: "mid", crease: "lo" }));
  const face = FRONT + 1.25;
  const fp = (pts) => k.pathOf(pts.map(([x, z]) => at([x, face, z])), true);
  // window: paper fill, then a darker inner well
  out.push(`<path class="iso-fill" d="${fp([[g.x0, g.z0], [g.x1, g.z0], [g.x1, g.z1], [g.x0, g.z1]])}"/>`);
  out.push(L(fp([[g.x0, g.z0], [g.x1, g.z0], [g.x1, g.z1], [g.x0, g.z1]]), { tone: "lo" }));
  // graduation strip on the right edge of the window, ticks hang from the window edge
  const marks = [];
  for (let i = 1; i < 10; i++) {
    const z = g.z0 + ((g.z1 - g.z0) * i) / 10;
    const len = i % 5 === 0 ? 4 : 2;
    marks.push(k.segment([g.x1, face, z], [g.x1 - len, face, z], P));
  }
  out.push(L(marks.join(""), { tone: "lo", free: "end" }));
  // the proton field: a grid of dots, shown up to the level by the live code
  const dots = [];
  const cols = 14, rows = 5;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = g.x0 + 5 + c * ((g.x1 - g.x0 - 14) / (cols - 1)) + (r % 2 ? 1.6 : 0);
      const z = g.z0 + 2.4 + r * ((g.z1 - g.z0 - 4.8) / (rows - 1));
      const [sx, sy] = at([x, face, z]);
      dots.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="0.75" data-row="${r}"/>`);
    }
  }
  out.push(`<g class="iso-dots" data-tone="hi" data-part="tank-protons">${dots.join("")}</g>`);
  // level line (live)
  out.push(`<path data-part="level" class="iso-line" data-tone="hi" d=""/>`);
  // four bezel screws
  out.push(D([[g.x0 - 2, g.z0 - 2], [g.x1 + 2, g.z0 - 2], [g.x0 - 2, g.z1 + 2], [g.x1 + 2, g.z1 + 2]].map(([x, z]) => at([x, face, z])), { size: 0.45, tone: "mid" }));
  return out.join("");
}

function drainValve() {
  // a small valve boss on the front face, right of centre: a short pipe stub along +y with a handwheel
  const F = G.frameAlong([80, FRONT, TANK_Z + 12], [0, 1, 0]);
  const out = [];
  out.push(S(G.disc(0, 1.2, 6.5, F, P), { tone: "mid" }));
  out.push(S(G.disc(1.2, 6, 3.2, F, P), { tone: "mid" }));
  out.push(S(G.disc(6, 7.4, 5.2, F, P), { tone: "mid" }));
  out.push(D(G.dotsOf(F, 0.6, 5, 6, P, { all: true }), { size: 0.4, tone: "lo" }));
  return out.join("");
}

// ---------- membrane lid ----------
function lid() {
  const out = [];
  const mid = L(k.sideSeam(TANK, LID_Z + LID_H / 2, P, 6), { tone: "lo" });
  out.push(S(k.slabOf(TANK, LID_Z, LID_H, P, 6, 1.2), { tone: "mid", crease: "lo", inner: mid }));
  // phospholipid heads: two rows of beads along each leaflet on the visible faces
  const heads = [];
  for (let x = TANK.x + 6; x <= TANK.x + TANK.w - 6; x += 3) {
    heads.push(at([x, FRONT, LID_Z + 1.4]), at([x, FRONT, TOP - 1.4]));
  }
  for (let y = TANK.y + 6; y <= FRONT - 6; y += 3) {
    heads.push(at([TANK.x + TANK.w, y, LID_Z + 1.4]), at([TANK.x + TANK.w, y, TOP - 1.4]));
  }
  out.push(D(heads, { size: 0.45, tone: "lo" }));
  // groove inset on the matrix face and lid screws
  out.push(L(k.planOutline(k.insetPlan(TANK, 4), TOP, P, 6), { tone: "faint" }));
  const c = k.corners(TANK, 9);
  out.push(L(c.map(([x, y]) => k.ring(x, y, 2, TOP, P, 16)).join(""), { tone: "lo" }));
  out.push(screws(c, TOP, 0.45));
  return out.join("");
}

function labelPlate() {
  const plan = { x: -104, y: 26, w: 34, d: 14, r: 1.2 };
  const out = [S(k.slabOf(plan, TOP, 0.8, P, 4), { tone: "lo", crease: "none" })];
  out.push(L(k.planOutline(k.insetPlan(plan, 1.6), TOP + 0.8, P, 4), { tone: "faint" }));
  out.push(L(k.lineOnTop([plan.x + 4, plan.y + 4.5], [plan.x + 26, plan.y + 4.5], TOP + 0.8, P), { tone: "lo", free: true }));
  out.push(L(k.lineOnTop([plan.x + 4, plan.y + 7.5], [plan.x + 20, plan.y + 7.5], TOP + 0.8, P), { tone: "lo", free: true }));
  out.push(L(k.lineOnTop([plan.x + 4, plan.y + 10.5], [plan.x + 24, plan.y + 10.5], TOP + 0.8, P), { tone: "lo", free: true }));
  out.push(screws([[plan.x + 2.2, plan.y + 7], [plan.x + plan.w - 2.2, plan.y + 7]], TOP + 0.8, 0.4));
  out.push(k.faceTextSvg(k.topMatrix([plan.x + plan.w - 3, plan.y + 11.2], TOP + 0.8, P, "x"), "IMM", { size: 2.2, tone: "lo", anchor: "end" }));
  return out.join("");
}

// a proton bore through the membrane: collar, bore ring
function bore([x, y]) {
  return [
    S(k.cylinder(x, y, 3.8, TOP, 2.4, P, 24, 0.4), { tone: "mid" }),
    L(k.ring(x, y, 2, TOP + 2.4, P, 20), { tone: "lo" }),
  ].join("");
}

// ---------- the complexes ----------
function complexI() {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(C1_ARM, 1), TOP, 0.1, P)}" style="filter:blur(3px)"/>`);
  out.push(S(k.slabOf(C1_ARM, TOP, C1_ARM_H, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(C1_ARM, TOP + 3.5, P, 4), { tone: "faint" }) }));
  // subunit joints across the membrane arm top, edge to edge
  for (const x of [C1_ARM.x + 22, C1_ARM.x + 34]) out.push(L(k.lineOnTop([x, C1_ARM.y], [x, C1_ARM.y + C1_ARM.d], TOP + C1_ARM_H, P), { tone: "faint" }));
  // peripheral arm in three stacked segments (the NADH dehydrogenase module)
  const z0 = TOP + C1_ARM_H;
  const segs = [[z0, 14], [z0 + 14, 15], [z0 + 29, C1_COL_TOP - z0 - 29]];
  segs.forEach(([z, h], i) => {
    const plan = k.insetPlan(C1_COL, i === 1 ? -1 : 0);
    out.push(S(k.slabOf(plan, z, h, P, 4, 0.5), { tone: "mid" }));
  });
  // NADH dock: a cup on top with a bore
  out.push(S(k.cylinder(C1_CUP[0], C1_CUP[1], 5.4, C1_COL_TOP, 3, P, 28, 0.4), { tone: "mid" }));
  out.push(L(k.ring(C1_CUP[0], C1_CUP[1], 3, C1_COL_TOP + 3, P, 24), { tone: "lo" }));
  out.push(D([at([C1_CUP[0], C1_CUP[1], C1_COL_TOP + 3])], { size: 0.6, tone: "hi" }));
  // FMN / Fe-S chain: screw dots down the front of the column
  const chain = [];
  for (let z = z0 + 4; z < C1_COL_TOP - 3; z += 6) chain.push(at([C1_COL.x + C1_COL.w, C1_COL.y + C1_COL.d / 2, z]));
  out.push(D(chain, { size: 0.5, tone: "hi" }));
  return out.join("");
}

function qRail() {
  const out = [];
  const rail = { x: Q_RAIL.from - 4, y: Q_RAIL.y - 2, w: Q_RAIL.to - Q_RAIL.from + 8, d: 4, r: 1 };
  out.push(S(k.slabOf(rail, TOP, 1.6, P, 3, 0.3), { tone: "lo" }));
  for (const x of [rail.x - 3, rail.x + rail.w]) {
    out.push(S(k.slabOf({ x, y: rail.y - 2, w: 3, d: 8, r: 0.8 }, TOP, 4, P, 3, 0.3), { tone: "mid" }));
    out.push(D([at([x + 1.5, rail.y + 2, TOP + 4])], { size: 0.4 }));
  }
  return out.join("");
}

function qPuck() {
  // built at x = 0, moved along the rail
  return [
    S(k.cylinder(0, Q_RAIL.y, Q_R, TOP + 1.6, 3.4, P, 24, 0.4), { tone: "hi" }),
    L(k.ring(0, Q_RAIL.y, 1.6, TOP + 5, P, 16), { tone: "lo" }),
  ].join("");
}

function ccRail() {
  const out = [];
  const rail = { x: CC_RAIL.from - 3, y: CC_RAIL.y - 1.6, w: CC_RAIL.to - CC_RAIL.from + 6, d: 3.2, r: 0.8 };
  out.push(S(k.slabOf(rail, TOP, 1.2, P, 3, 0.3), { tone: "lo" }));
  for (const x of [rail.x - 2.4, rail.x + rail.w]) out.push(S(k.slabOf({ x, y: rail.y - 1.4, w: 2.4, d: 6, r: 0.6 }, TOP, 3.4, P, 3), { tone: "mid" }));
  return out.join("");
}

function ccBead() {
  return S(G.sphereOf([0, CC_RAIL.y, TOP + 1.2 + CC_R], CC_R, P, { steps: 32 }), { tone: "hi" });
}

function complexIII() {
  const out = [];
  for (const plan of C3) {
    out.push(S(k.slabOf(plan, TOP, C3_H, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(plan, TOP + 8, P, 4), { tone: "faint" }) }));
  }
  // Rieske heads on top of each monomer
  for (const plan of C3) {
    const cx = plan.x + plan.w / 2, cy = plan.y + 7;
    out.push(S(k.cylinder(cx, cy, 4.4, TOP + C3_H, 3.4, P, 24, 0.4), { tone: "mid" }));
    out.push(L(k.knurl(cx, cy, 4.4, TOP + C3_H, TOP + C3_H + 3.4, 20, P), { tone: "lo" }));
  }
  // bridge between the monomers
  out.push(S(k.slabOf({ x: -30.5, y: -10, w: 3, d: 14, r: 0.8 }, TOP + C3_H - 5, 5, P, 2), { tone: "mid", crease: "none" }));
  // haem dots down the front faces
  const hd = [];
  for (const plan of C3) for (const z of [TOP + 13, TOP + 17]) hd.push(at([plan.x + plan.w / 2, plan.y + plan.d, z]));
  out.push(D(hd, { size: 0.5, tone: "hi" }));
  return out.join("");
}

function complexIV() {
  const out = [];
  out.push(S(k.slabOf(C4, TOP, C4_H, P, 5, 0.6), { tone: "mid", inner: L(k.sideSeam(C4, TOP + 6, P, 5), { tone: "faint" }) }));
  const cup = [C4.x + 14, C4.y + 10];
  out.push(S(k.cylinder(cup[0], cup[1], 5, TOP + C4_H, 2.6, P, 24, 0.4), { tone: "mid" }));
  out.push(L(k.ring(cup[0], cup[1], 2.8, TOP + C4_H + 2.6, P, 20), { tone: "lo" }));
  // copper and haem centres
  out.push(D([at([C4.x + 7, C4.y + C4.d, TOP + 11]), at([C4.x + 13, C4.y + C4.d, TOP + 11]), at([C4.x + 19, C4.y + C4.d, TOP + 11])], { size: 0.5, tone: "hi" }));
  out.push(L(k.planOutline(k.insetPlan(C4, 3), TOP + C4_H, P, 5), { tone: "faint" }));
  return out.join("");
}

// ---------- ATP synthase ----------
const BALLS = Array.from({ length: 6 }, (_, i) => {
  const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
  return { i, beta: i % 2 === 1, c: [AS[0] + Math.cos(a) * F1_RING, AS[1] + Math.sin(a) * F1_RING, F1_Z] };
});

function synthaseBack() {
  const out = [];
  // recess in the lid around the c-ring
  out.push(`<path class="iso-fill" d="${k.ring(AS[0], AS[1], RING_R + 1.4, TOP, P, 64)}"/>`);
  out.push(L(k.ring(AS[0], AS[1], RING_R + 1.4, TOP, P, 64), { tone: "lo" }));
  // a-subunit (stator) beside the ring
  out.push(S(k.slabOf(A_SUB, TOP, A_TOP - TOP, P, 3, 0.5), { tone: "mid" }));
  out.push(L(k.ring(A_SUB.x + 3.4, A_SUB.y + A_SUB.d - 3, 1.4, A_TOP, P, 12), { tone: "lo" }));
  // peripheral stalk (b subunit)
  out.push(S(k.cylinder(STATOR[0], STATOR[1], B_R, A_TOP, B_TOP - A_TOP, P, 16), { tone: "mid", crease: "none" }));
  out.push(L([34, 50].map((z) => k.sideArc(STATOR[0], STATOR[1], B_R, z, P, 10)).join(""), { tone: "faint" }));
  return out.join("");
}

function ring(phi) {
  // the c-ring rotor; the ribs are rebuilt as it turns
  return S(k.cylinder(AS[0], AS[1], RING_R, RING_Z0, RING_Z1 - RING_Z0, P, 64, 0.6), { tone: "hi", lit: true });
}

function ribsAt(phi) {
  const [vx, vy] = k.towardViewer(P);
  const parts = [];
  const tops = [];
  for (let i = 0; i < C_SUBUNITS; i++) {
    const a = phi + (i / C_SUBUNITS) * Math.PI * 2;
    const nx = Math.cos(a), ny = Math.sin(a);
    const x = AS[0] + RING_R * nx, y = AS[1] + RING_R * ny;
    tops.push(k.lineOnTop([AS[0] + (RING_R - 3.2) * nx, AS[1] + (RING_R - 3.2) * ny], [x, y], RING_Z1, P));
    if (nx * vx + ny * vy < 0.12) continue;
    parts.push(k.segment([x, y, TOP + 0.2], [x, y, RING_Z1], P));
  }
  return parts.join("") + tops.join("");
}

function gammaStalk() {
  const out = [];
  out.push(S(k.cylinder(AS[0], AS[1], 6.5, RING_Z1, 1.6, P, 32), { tone: "hi" }));
  out.push(S(k.cylinder(AS[0], AS[1], GAMMA_R, RING_Z1 + 1.6, EPS_Z - RING_Z1 - 1.6, P, 20), { tone: "hi", crease: "none" }));
  out.push(S(k.cylinder(AS[0], AS[1], 6.2, EPS_Z, 2, P, 28, 0.3), { tone: "hi" }));
  out.push(S(k.cylinder(AS[0], AS[1], GAMMA_R, EPS_Z + 2, GAMMA_Z1 - EPS_Z - 2, P, 20), { tone: "hi", crease: "none" }));
  return out.join("");
}

const pointerAt = (phi) =>
  k.lineOnTop([AS[0] + Math.cos(phi) * (GAMMA_R + 0.2), AS[1] + Math.sin(phi) * (GAMMA_R + 0.2)], [AS[0] + Math.cos(phi) * 5.8, AS[1] + Math.sin(phi) * 5.8], EPS_Z + 2.01, P);

function f1Head() {
  const out = [];
  const sorted = [...BALLS].sort((a, b) => k.depthOf(a.c, P) - k.depthOf(b.c, P));
  for (const ball of sorted) {
    const paths = G.sphereOf(ball.c, F1_BALL, P, { steps: 48 });
    if (ball.beta) {
      out.push(`<g data-beta="${(ball.i - 1) / 2}"><g data-state="rest">${S(paths, { tone: "hi" })}</g><g data-state="make" style="opacity:0">${S(paths, { tone: "hi", lit: true })}</g></g>`);
    } else {
      out.push(S(paths, { tone: "mid" }));
    }
  }
  return out.join("");
}

function synthaseTop() {
  const out = [];
  // delta cap on top of the head
  out.push(S(k.cylinder(AS[0], AS[1], 6.8, DELTA_Z, DELTA_H, P, 28, 0.4), { tone: "mid" }));
  out.push(S(k.cylinder(STATOR[0], STATOR[1], B_R + 0.8, B_TOP - 1, 3, P, 16), { tone: "mid" }));
  // the arm from the stalk to the cap, a rotated bar
  const dx = AS[0] - STATOR[0], dy = AS[1] - STATOR[1];
  const len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, px = -uy * 1.6, py = ux * 1.6;
  const ringPts = [
    [STATOR[0] + px, STATOR[1] + py], [AS[0] + px, AS[1] + py], [AS[0] - px, AS[1] - py], [STATOR[0] - px, STATOR[1] - py],
  ];
  out.push(S(k.extrude(ringPts, DELTA_Z + 1, 2.4, P), { tone: "mid" }));
  out.push(D([at([AS[0], AS[1], DELTA_Z + DELTA_H]), at([STATOR[0], STATOR[1], B_TOP + 2])], { size: 0.5, tone: "mid" }));
  return out.join("");
}

// ---------- gauge ----------
function gauge() {
  const [x, y] = GAUGE;
  const out = [];
  out.push(S(k.cylinder(x, y, GAUGE_R + 1.6, GAUGE_Z, 1.4, P, 48), { tone: "lo" }));
  out.push(S(k.cylinder(x, y, GAUGE_R, GAUGE_Z + 1.4, GAUGE_H - 1.4, P, 56, 0.6), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, y, GAUGE_R, GAUGE_TOP - 2.2, GAUGE_TOP, 60, P, 0.3), { tone: "lo" }));
  out.push(L(k.ring(x, y, GAUGE_R - 1.6, GAUGE_TOP, P, 56), { tone: "lo" }));
  const ticks = k.radialTicks(x, y, GAUGE_R - 1.8, 25, 5, GAUGE_TOP, [1, 2.2], P, GAUGE_FROM, GAUGE_SPAN);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.ring(x, y, 1.2, GAUGE_TOP, P, 12), { tone: "mid" }));
  out.push(k.faceTextSvg(k.topMatrix([x, y + 5.4], GAUGE_TOP, P, "x"), "mV", { size: 2, tone: "lo", anchor: "middle" }));
  return out.join("");
}

const needleAt = (mv) => {
  const t = Math.max(0, Math.min(1, mv / MODEL.gaugeMax));
  const a = GAUGE_FROM + t * GAUGE_SPAN;
  const [x, y] = GAUGE;
  return k.lineOnTop([x - Math.sin(a) * 2.4, y + Math.cos(a) * 2.4], [x + Math.sin(a) * (GAUGE_R - 3), y - Math.cos(a) * (GAUGE_R - 3)], GAUGE_TOP + 0.1, P);
};

// ---------- assemble in depth order ----------
const items = [
  { at: [C1_ARM.x + 10, C1_ARM.y + 6], svg: complexI() },
  ...C1_BORES.map((b) => ({ at: b, svg: bore(b) })),
  { at: [Q_RAIL.from, Q_RAIL.y - 4], svg: qRail() },
  { at: [Q_RAIL.from, Q_RAIL.y + 0.1], svg: `<g data-part="q">${qPuck()}</g>` },
  { at: [-36, -4], svg: complexIII() },
  ...C3_BORES.map((b) => ({ at: b, svg: bore(b) })),
  { at: [CC_RAIL.from, CC_RAIL.y - 3], svg: ccRail() },
  { at: [CC_RAIL.from, CC_RAIL.y + 0.1], svg: `<g data-part="cc">${ccBead()}</g>` },
  { at: [C4.x + 13, C4.y + 12], svg: complexIV() },
  ...C4_BORES.map((b) => ({ at: b, svg: bore(b) })),
  { at: [-87, 33], svg: labelPlate() },
  {
    at: [AS[0], AS[1]],
    svg: [
      synthaseBack(),
      ring(0),
      `<path data-part="ribs" class="iso-line" data-tone="mid" d="${ribsAt(0)}"/>`,
      gammaStalk(),
      `<path data-part="pointer" class="iso-line" data-tone="lit" data-free="end" d="${pointerAt(0)}" style="stroke-width:1"/>`,
      f1Head(),
      synthaseTop(),
    ].join(""),
  },
  { at: GAUGE, svg: gauge() + `<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" d="${needleAt(MODEL.start.dp)}" style="stroke-width:1"/>` },
];
items.sort((a, b) => depth2(a.at) - depth2(b.at));

// particles live in their own layer on top: protons as small dots, ATP as lit dots
const particles = `<g data-part="protons" class="iso-dots" data-tone="hi"></g><g data-part="atp" class="iso-dots" data-tone="hi"></g>`;

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A patch of the inner mitochondrial membrane built as a pressure machine: the lid is the membrane, the matrix is above it and the intermembrane space is the tank below. Complexes I, III and IV pump protons down into the tank; a sight glass and a gauge show the proton-motive force. ATP synthase lets the protons flow back up, its c-ring of eight subunits turns the central stalk, and each third of a turn a beta subunit in the head releases one ATP.",
  body: [base(), tank(), lid(), ...items.map((it) => it.svg), particles],
});

// ---------- live ----------
const live = `
const P = ${JSON.stringify(P)};
const MODEL = ${JSON.stringify(MODEL)};
const AS = ${JSON.stringify(AS)}, RING_R = ${RING_R}, RING_Z1 = ${RING_Z1}, TOP = ${TOP}, C_SUBUNITS = ${C_SUBUNITS};
const GAMMA_R = ${GAMMA_R}, EPS_Z = ${EPS_Z};
const GAUGE = ${JSON.stringify(GAUGE)}, GAUGE_R = ${GAUGE_R}, GAUGE_TOP = ${GAUGE_TOP}, GAUGE_SPAN = ${GAUGE_SPAN}, GAUGE_FROM = ${GAUGE_FROM};
const GLASS = ${JSON.stringify(GLASS)}, FACE = ${FRONT + 1.25};
const Q_RAIL = ${JSON.stringify(Q_RAIL)}, CC_RAIL = ${JSON.stringify(CC_RAIL)};
const BORES = { c1: ${JSON.stringify(C1_BORES)}, c3: ${JSON.stringify(C3_BORES)}, c4: ${JSON.stringify(C4_BORES)} };
const C1_CUP = ${JSON.stringify(C1_CUP)}, C1_TOP = ${C1_COL_TOP + 3};
const A_PORT = ${JSON.stringify([A_SUB.x + 3.4, A_SUB.y + A_SUB.d - 3, A_TOP])};
const F1_TOP = ${JSON.stringify([AS[0], AS[1], DELTA_Z + DELTA_H])};
const ribsAt = ${ribsAt.toString().replace(/k\./g, "")};
const pointerAt = ${pointerAt.toString().replace(/k\./g, "")};
const needleAt = ${needleAt.toString().replace(/k\./g, "")};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const $ = (name) => svg.querySelector('[data-part="' + name + '"]');
const ribs = $("ribs"), pointer = $("pointer"), needle = $("needle"), level = $("level");
const q = $("q"), cc = $("cc"), protonLayer = $("protons"), atpLayer = $("atp");
const tankDots = [...$("tank-protons").children];
const rows = 5;
const betas = [0, 1, 2].map((i) => svg.querySelector('[data-beta="' + i + '"] [data-state="make"]'));
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const NS = "http://www.w3.org/2000/svg";

// pools of particles
function pool(layer, n, r) {
  return Array.from({ length: n }, () => {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("r", r); c.setAttribute("fill-opacity", "0");
    layer.appendChild(c);
    return { el: c, life: 0, dur: 1, from: [0, 0, 0], to: [0, 0, 0] };
  });
}
const protons = pool(protonLayer, 64, 1.1);
const atps = pool(atpLayer, 10, 1.3);
atpLayer.querySelectorAll("circle").forEach((c) => c.style.fill = "var(--anatomy-lit)");
function emit(list, from, to, dur) {
  const p = list.find((it) => it.life <= 0) || list[0];
  p.from = from; p.to = to; p.dur = dur; p.life = dur;
}
function stepParticles(list, dt, fadeIn) {
  for (const p of list) {
    if (p.life <= 0) continue;
    p.life -= dt;
    const t = clamp(1 - p.life / p.dur, 0, 1);
    const e = t * t * (3 - 2 * t);
    const pt = [0, 1, 2].map((i) => p.from[i] + (p.to[i] - p.from[i]) * e);
    const [sx, sy] = iso(pt, P);
    p.el.setAttribute("cx", sx.toFixed(1)); p.el.setAttribute("cy", sy.toFixed(1));
    const alpha = Math.min(1, t / fadeIn) * Math.min(1, (1 - t) / 0.3);
    p.el.setAttribute("fill-opacity", p.life <= 0 ? "0" : alpha.toFixed(2));
  }
}

// model state
const s = { dp: MODEL.start.dp, feed: MODEL.start.feed, target: MODEL.start.feed, phi: 0, atp: 0, pumped: 0, through: 0, nadh: 0 };
let carry = { c1: 0, c3: 0, c4: 0, a: 0 }, betaGlow = [0, 0, 0], lastThird = 0;
let qPos = 0, qDir = 1, ccPos = 0, ccDir = 1;
let frame = 0, last = 0, visible = false, touring = !still.matches, clock = 0, idle = 0;
const tour = [0.25, 1, 1, 0.55, 0.1, 0.1];
const tourAt = (t) => tour[Math.floor(t / 4) % tour.length];

function rates(dp, feed) {
  const nadh = MODEL.nadhMax * feed * Math.max(0, 1 - dp / MODEL.dpStall);         // NADH oxidised per s
  const rev = MODEL.revMax * Math.max(0, (dp - MODEL.dpThreshold) / MODEL.dpSpan); // c-ring turns per s
  return { nadh, rev };
}

function step(dt, calm) {
  s.feed = calm ? s.target : s.feed + (s.target - s.feed) * (1 - Math.exp(-dt / 0.5));
  const { nadh, rev } = rates(s.dp, s.feed);
  const pumpedIn = nadh * MODEL.hPerNadh;                      // 10 H+ per NADH
  const backOut = rev * (C_SUBUNITS + MODEL.atpPerRev * MODEL.hTransportPerAtp); // 8 through the ring + 1 per ATP for the phosphate carrier
  s.dp = clamp(s.dp + MODEL.mvPerH * (pumpedIn - backOut) * dt, 0, MODEL.gaugeMax);
  s.phi += rev * Math.PI * 2 * dt;
  s.nadh += nadh * dt;
  s.pumped += pumpedIn * dt;
  s.through += rev * C_SUBUNITS * dt;
  // ATP: one per third of a turn
  const thirds = Math.floor(s.phi / (Math.PI * 2 / 3));
  while (lastThird < thirds) {
    lastThird++;
    s.atp++;
    const b = lastThird % 3;
    betaGlow[b] = 1;
    if (!calm) emit(atps, [F1_TOP[0] + 3, F1_TOP[1] + 3, F1_TOP[2]], [F1_TOP[0] + 8, F1_TOP[1] + 14, F1_TOP[2] + 26], 2.2);
  }
  if (calm) return { nadh, rev };
  // protons: share pumped protons among the bores (4 : 4 : 2)
  carry.c1 += nadh * 4 * dt; carry.c3 += nadh * 4 * dt; carry.c4 += nadh * 2 * dt; carry.a += rev * C_SUBUNITS * dt;
  const drop = (key, list) => {
    while (carry[key] >= 1) {
      carry[key] -= 1;
      const b = list[Math.floor(Math.random() * list.length)];
      emit(protons, [b[0], b[1], TOP + 26], [b[0], b[1], TOP + 2.6], 1.4);
    }
  };
  drop("c1", BORES.c1); drop("c3", BORES.c3); drop("c4", BORES.c4);
  while (carry.a >= 1) {
    carry.a -= 1;
    emit(protons, [A_PORT[0], A_PORT[1], A_PORT[2]], [A_PORT[0] + 2, A_PORT[1] + 6, A_PORT[2] + 18], 1.2);
  }
  // electron carriers shuttle at the rate electrons flow
  const speed = nadh * 1.6;
  qPos += qDir * speed * dt; if (qPos > 1) { qPos = 1; qDir = -1; } if (qPos < 0) { qPos = 0; qDir = 1; }
  ccPos += ccDir * speed * 2 * dt; if (ccPos > 1) { ccPos = 1; ccDir = -1; } if (ccPos < 0) { ccPos = 0; ccDir = 1; }
  for (let i = 0; i < 3; i++) betaGlow[i] = Math.max(0, betaGlow[i] - dt / 0.9);
  return { nadh, rev };
}

const fmt = (v, d = 0) => v.toFixed(d);
let lastText = "";
function draw(r) {
  ribs.setAttribute("d", ribsAt(s.phi % (Math.PI * 2 / C_SUBUNITS)));
  pointer.setAttribute("d", pointerAt(s.phi));
  needle.setAttribute("d", needleAt(s.dp));
  q.setAttribute("transform", translateAlong(P, [Q_RAIL.from + (Q_RAIL.to - Q_RAIL.from) * qPos, 0, 0]));
  cc.setAttribute("transform", translateAlong(P, [CC_RAIL.from + (CC_RAIL.to - CC_RAIL.from) * ccPos, 0, 0]));
  betas.forEach((g, i) => g.style.opacity = betaGlow[i].toFixed(2));
  // sight glass: protons fill to a level set by the proton-motive force
  const fill = clamp(s.dp / MODEL.gaugeMax, 0, 1);
  const shown = fill * rows;
  tankDots.forEach((c) => { const row = +c.dataset.row; c.setAttribute("fill-opacity", clamp(shown - row, 0, 1).toFixed(2)); });
  const z = GLASS.z0 + (GLASS.z1 - GLASS.z0) * fill;
  const a = iso([GLASS.x0, FACE, z], P), b = iso([GLASS.x1, FACE, z], P);
  level.setAttribute("d", "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + "L" + b[0].toFixed(1) + " " + b[1].toFixed(1));
  const text = "Δp " + fmt(s.dp) + " mV · " + fmt(r.rev * 60) + " סיבובים/דקה · ATP " + s.atp;
  if (text !== lastText) { readout.textContent = text; lastText = text; }
}

function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring) { clock += dt; s.target = tourAt(clock); }
  const r = step(dt, calm);
  stepParticles(protons, dt, 0.25);
  stepParticles(atps, dt, 0.15);
  draw(r);
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const describe = () => {
  const t = "אספקת NADH " + Math.round(s.target * 100) + "%";
  stage.setAttribute("aria-valuenow", String(Math.round(s.target * 100)));
  stage.setAttribute("aria-valuetext", t);
};
const steer = (v) => {
  touring = false; s.target = clamp(v, 0, 1); describe();
  clearTimeout(idle); idle = setTimeout(() => { touring = !still.matches; clock = 0; run(); }, 3600);
  if (still.matches) { // reduced motion: jump to the steady state
    for (let i = 0; i < 600; i++) step(1 / 30, true);
    draw(rates(s.dp, s.feed));
  }
  run();
};
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("pointermove", (e) => {
  const box = svg.getBoundingClientRect();
  steer(clamp(((e.clientX - box.left) / box.width - 0.1) / 0.8, 0, 1));
});
stage.addEventListener("pointerdown", (e) => {
  const box = svg.getBoundingClientRect();
  steer(clamp(((e.clientX - box.left) / box.width - 0.1) / 0.8, 0, 1));
});
stage.addEventListener("keydown", (e) => {
  const big = e.shiftKey ? 0.25 : 0.1;
  let v = null;
  if (e.key === "ArrowRight" || e.key === "ArrowUp") v = s.target + big;
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") v = s.target - big;
  if (e.key === "Home") v = 0;
  if (e.key === "End") v = 1;
  if (v === null) return;
  e.preventDefault(); steer(v);
});
if (still.matches) { for (let i = 0; i < 600; i++) step(1 / 30, true); }
describe();
draw(rates(s.dp, s.feed));
`;

const body = k.plateHtml({
  fig: "Fig 1",
  title: "מיטוכונדריה · זרחון חמצוני",
  hint: "גרור/רחף ימינה = יותר NADH",
  readout: `Δp ${MODEL.start.dp} mV`,
  keys: [
    { mark: "lit", label: "טבעת c, הציר המרכזי ותת־יחידת β שמייצרת ATP ברגע זה: החלקים שמסתובבים" },
    { mark: "raised", label: "משמאל לימין: קומפלקס I (‏L), יוביקינון על מסילה, קומפלקס III (דימר), ציטוכרום c, קומפלקס IV, ATP סינתאז" },
    { mark: "flat", label: "המכסה = הממברנה הפנימית (שתי שכבות שומנים); מעליה המטריקס, והמיכל מתחת = המרווח הבין־ממברנלי" },
  ],
  caption:
    "על כל NADH שמתחמצן, קומפלקסים I, III ו־IV שואבים 10 פרוטונים (4+4+2) מהמטריקס אל המרווח הבין־ממברנלי, ובונים כוח פרוטון־מניע (Δp) של כ־150–200 mV, שמוצג בשעון ובחלון הזכוכית. הפרוטונים חוזרים דרך ATP סינתאז: כל 8 פרוטונים מסובבים את טבעת ה־c סיבוב שלם, והציר המרכזי מסובב את ראש ה־F1 כך שכל אחת משלוש תת־יחידות β משחררת ATP בכל שליש סיבוב. עם עוד פרוטון אחד לכל ATP להובלת הפוספט, יוצא בערך 2.7 ATP לכל NADH. התנועה מואטת מאוד: האנזים האמיתי מסתובב כ־100 פעמים בשנייה.",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="ממברנה פנימית של מיטוכונדריה: חיצים ימינה ושמאלה משנים את אספקת ה-NADH" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(MODEL.start.feed * 100)}" style="touch-action:pan-y">${svg}</div>`,
});

const page = k
  .pageHtml({ title: "מיטוכונדריה", theme, body, script: kitScript() + live, width: 720 })
  .replace('<html lang="en">', '<html lang="he" dir="rtl">')
  .replace("</style>", '.iso-plate-corner{direction:rtl;unicode-bidi:plaintext}.iso-plate .iso-svg{direction:ltr}.iso-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:6px}</style>');

const name = theme === "light" ? "mitochondria-light.html" : "mitochondria.html";
writeFileSync(join(HERE, name), page);
console.log("wrote", name);
