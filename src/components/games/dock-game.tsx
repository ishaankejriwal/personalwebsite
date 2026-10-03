"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GameColors = { bg: string; ink: string; accent: string; dim: string };

const TAU = Math.PI * 2;
const STEP = 1 / 60;
const DOCK_FIT = 0.9;
const CLASH_PENALTY = 1.5;
const SAMPLES = 200;
const ROT_STEP = Math.PI / 12; // 15 degrees
const HUD_TOP = 52;
const HUD_BOTTOM = 52;
const BLOB_N = 64;
const POCKET_R = 0.34; // relative to protein radius
const LIGAND_SCALE = 0.9;
const PULSE_S = 0.6;
const IDLE_SPIN = 0.25; // rad/s
const LETTERS = ["A", "B", "C"];
const PLAY_HINT = ["Find the ligand that fits.", "Drag it in, rotate to match."];
const IDLE_HINT = ["Fit the ligand into the pocket."];
const CENTER = "pointer-events-none absolute inset-0 flex items-center justify-center";
const BTN =
  "pointer-events-auto rounded-none border-2 border-[var(--ink)] bg-transparent px-3 py-1.5 font-mono text-xs font-medium text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] sm:text-sm";

type Pt = { x: number; y: number };
type Phase = "idle" | "play" | "done";
// Normalized puzzle: protein radius 1 centred at the origin; pocket and ligands are local to the pocket centre.
type Shape = { blob: Pt[]; pocketC: Pt; pocket: Pt[]; ligs: Pt[][]; samples: Pt[][] };
type Ligand = { poly: Pt[]; path: Path2D; atoms: Path2D; samples: Pt[]; hitR: number; pos: Pt; rot: number; best: number; docked: boolean };
type Scene = { shape: Shape; w: number; h: number; blob: Pt[]; pocket: Pt[]; pocketC: Pt; ligands: Ligand[] };

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Even-odd ray casting.
function inPoly(x: number, y: number, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

function area(poly: Pt[]): number {
  let s = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) s += (poly[j].x + poly[i].x) * (poly[j].y - poly[i].y);
  return Math.abs(s) / 2;
}

const scalePoly = (poly: Pt[], k: number): Pt[] => poly.map((p) => ({ x: p.x * k, y: p.y * k }));

function pathOf(poly: Pt[]): Path2D {
  const p = new Path2D();
  poly.forEach((v, i) => (i ? p.lineTo(v.x, v.y) : p.moveTo(v.x, v.y)));
  p.closePath();
  return p;
}


function samplePoly(poly: Pt[], rnd: () => number, n: number): Pt[] {
  const xs = poly.map((p) => p.x), ys = poly.map((p) => p.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const out: Pt[] = [];
  while (out.length < n) {
    const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0);
    if (inPoly(x, y, poly)) out.push({ x, y });
  }
  return out;
}

// fit = share of samples inside the pocket minus a penalty for samples clashing with the protein body.
function fitOf(samples: Pt[], pos: Pt, rot: number, pocket: Pt[], blob: Pt[] | null): number {
  const c = Math.cos(rot), s = Math.sin(rot);
  let inP = 0, clash = 0;
  for (const p of samples) {
    const x = pos.x + p.x * c - p.y * s, y = pos.y + p.x * s + p.y * c;
    if (inPoly(x, y, pocket)) inP++;
    else if (blob && inPoly(x, y, blob)) clash++;
  }
  return Math.min(1, Math.max(0, (inP - CLASH_PENALTY * clash) / samples.length));
}

function makeShape(seed: number): Shape {
  const rnd = mulberry32(seed);
  const amp = [0.08 + rnd() * 0.06, 0.04 + rnd() * 0.04, 0.02 + rnd() * 0.03];
  const ph = [rnd() * TAU, rnd() * TAU, rnd() * TAU];
  const radius = (t: number) =>
    1 + amp[0] * Math.sin(2 * t + ph[0]) + amp[1] * Math.sin(3 * t + ph[1]) + amp[2] * Math.sin(5 * t + ph[2]);
  const blob: Pt[] = [];
  for (let i = 0; i < BLOB_N; i++) {
    const t = (i / BLOB_N) * TAU;
    blob.push({ x: radius(t) * Math.cos(t), y: radius(t) * Math.sin(t) });
  }
  // Pocket sits on the rim; its outward-facing vertices reach past the outline and form the mouth.
  const alpha = rnd() * TAU, d = radius(alpha) - 0.2;
  const pocketC = { x: d * Math.cos(alpha), y: d * Math.sin(alpha) };
  const n = 8 + Math.floor(rnd() * 5);
  const pocket: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const t = alpha + ((i + (rnd() - 0.5) * 0.5) / n) * TAU;
    const f = i === 0 ? 1 : i === 1 || i === n - 1 ? 0.85 + rnd() * 0.15 : 0.55 + rnd() * 0.45;
    pocket.push({ x: POCKET_R * f * Math.cos(t), y: POCKET_R * f * Math.sin(t) });
  }
  const ligA = scalePoly(pocket, LIGAND_SCALE);
  const pocketAbs = pocket.map((p) => ({ x: p.x + pocketC.x, y: p.y + pocketC.y }));
  // A decoy passes when no pose on a coarse grid around the pocket gets near the dock threshold.
  const cannotFit = (samples: Pt[]) => {
    for (let r = 0; r < 24; r++)
      for (let ox = -2; ox <= 2; ox++)
        for (let oy = -2; oy <= 2; oy++) {
          const pos = { x: pocketC.x + ox * 0.05, y: pocketC.y + oy * 0.05 };
          if (fitOf(samples, pos, (r * TAU) / 24, pocketAbs, blob) >= 0.75) return false;
        }
    return true;
  };
  // Decoys: pocket shape with radially perturbed vertices, area = pocket area (grows a little per failed attempt).
  const decoy = (): [Pt[], Pt[]] => {
    let poly = ligA, samples: Pt[] = [];
    for (let attempt = 0; attempt < 40; attempt++) {
      poly = pocket.map((p) => scalePoly([p], 0.6 + rnd() * 0.9)[0]);
      poly = scalePoly(poly, Math.sqrt((area(pocket) * (1 + attempt / 20)) / area(poly)));
      samples = samplePoly(poly, rnd, SAMPLES);
      if (cannotFit(samples.slice(0, 60))) break;
    }
    return [poly, samples];
  };
  const [[ligB, sB], [ligC, sC]] = [decoy(), decoy()];
  return { blob, pocketC, pocket, ligs: [ligA, ligB, ligC], samples: [samplePoly(ligA, rnd, SAMPLES), sB, sC] };
}

// Pixel scene for a canvas size; ligand positions carry over from `prev`, scaled proportionally.
function buildScene(shape: Shape, w: number, h: number, prev: Scene | null): Scene {
  const usable = h - HUD_TOP - HUD_BOTTOM;
  const wide = w / usable > 1.25;
  const areaW = wide ? w * 0.7 : w, areaH = wide ? usable : usable * 0.68;
  const R = 0.4 * Math.min(areaW, areaH);
  const cx = areaW / 2, cy = HUD_TOP + areaH / 2;
  const parkX = areaW + (w - areaW) / 2, parkY = HUD_TOP + areaH + (usable - areaH) / 2;
  const homes = [1, 2, 3].map((i) => (wide ? { x: parkX, y: HUD_TOP + (usable * i) / 4 } : { x: (w * i) / 4, y: parkY }));
  const toPx = (p: Pt): Pt => ({ x: cx + p.x * R, y: cy + p.y * R });
  const pocketC = toPx(shape.pocketC);
  const ligands = shape.ligs.map((lig, i) => {
    const poly = scalePoly(lig, R), old = prev?.ligands[i];
    const pos =
      prev && old ? (old.docked ? pocketC : { x: (old.pos.x * w) / prev.w, y: (old.pos.y * h) / prev.h }) : homes[i];
    const hitR = Math.max(...poly.map((p) => Math.hypot(p.x, p.y))) + 14;
    const atoms = new Path2D();
    for (const v of poly) {
      atoms.moveTo(v.x + 3, v.y);
      atoms.arc(v.x, v.y, 3, 0, TAU);
    }
    return { poly, path: pathOf(poly), atoms, samples: scalePoly(shape.samples[i], R), hitR, pos, rot: old?.rot ?? 0, best: old?.best ?? 0, docked: old?.docked ?? false };
  });
  const pocket = shape.pocket.map((p) => ({ x: pocketC.x + p.x * R, y: pocketC.y + p.y * R }));
  return { shape, w, h, blob: shape.blob.map(toPx), pocket, pocketC, ligands };
}

function newRound(prev: Scene): Scene {
  const next = buildScene(makeShape(Date.now()), prev.w, prev.h, null);
  for (const l of next.ligands) l.rot = (1 + Math.floor(Math.random() * 23)) * ROT_STEP;
  return next;
}

function rotateLigand(scene: Scene | null, i: number, delta: number) {
  const l = scene?.ligands[i];
  if (l && !l.docked) l.rot += delta;
}

function moveLigand(scene: Scene, i: number, pos: Pt) {
  scene.ligands[i].pos = pos;
}

// Topmost undocked ligand under the pointer (generous radius for touch), or -1.
function grabAt(scene: Scene, p: Pt): number {
  for (let i = 2; i >= 0; i--) {
    const l = scene.ligands[i];
    if (!l.docked && Math.hypot(p.x - l.pos.x, p.y - l.pos.y) <= l.hitR) return i;
  }
  return -1;
}

// Returns the fit at release; snaps the ligand into the pocket when it docks.
function release(scene: Scene, i: number): number {
  const l = scene.ligands[i];
  const f = fitOf(l.samples, l.pos, l.rot, scene.pocket, scene.blob);
  l.best = Math.max(l.best, f);
  if (f >= DOCK_FIT) {
    l.pos = scene.pocketC;
    if (i === 0) l.rot = 0;
    l.docked = true;
  } else l.pos = { x: Math.max(0, Math.min(scene.w, l.pos.x)), y: Math.max(0, Math.min(scene.h, l.pos.y)) };
  return f;
}

// The protein body never moves, so it is rendered once per size/state into an
// offscreen layer and blitted each frame. The dotted fill is a repeating 8px tile.
type Layer = { canvas: HTMLCanvasElement; key: string };

function dotTile(c: GameColors, dpr: number): HTMLCanvasElement {
  const t = document.createElement("canvas");
  t.width = t.height = Math.round(8 * dpr);
  const g = t.getContext("2d");
  if (g) {
    g.fillStyle = c.dim;
    g.fillRect(0, 0, Math.round(2 * dpr), Math.round(2 * dpr));
  }
  return t;
}

function renderStatic(layer: Layer, scene: Scene, c: GameColors, done: boolean, pulse: number, dpr: number) {
  const { w, h } = scene;
  const key = `${w}x${h}|${dpr}|${done}|${pulse.toFixed(2)}|${c.bg}|${scene.pocketC.x}`;
  if (layer.key === key) return;
  layer.key = key;
  const cv = layer.canvas;
  if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
  }
  const ctx = cv.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, w, h);
  const blobPath = pathOf(scene.blob), pocketPath = pathOf(scene.pocket);
  ctx.save();
  ctx.clip(blobPath);
  const pattern = ctx.createPattern(dotTile(c, dpr), "repeat");
  if (pattern) {
    const m = new DOMMatrix();
    m.a = 1 / dpr;
    m.d = 1 / dpr;
    pattern.setTransform(m);
    ctx.fillStyle = pattern;
    ctx.fillRect(0, HUD_TOP, w, h - HUD_TOP);
  }
  ctx.fillStyle = c.bg;
  ctx.fill(pocketPath);
  ctx.lineJoin = "miter";
  ctx.lineWidth = 3 + 3 * pulse;
  ctx.strokeStyle = done ? c.accent : c.ink;
  ctx.stroke(pocketPath);
  ctx.restore();
  ctx.save();
  const outside = new Path2D();
  outside.rect(0, 0, w, h);
  outside.addPath(pocketPath);
  ctx.clip(outside, "evenodd");
  ctx.lineJoin = "round";
  ctx.lineWidth = 3;
  ctx.strokeStyle = c.ink;
  ctx.stroke(blobPath);
  ctx.restore();
}

function drawScene(ctx: CanvasRenderingContext2D, layer: Layer, scene: Scene, c: GameColors, held: number) {
  const { w, h } = scene;
  ctx.drawImage(layer.canvas, 0, 0, w, h);
  const order = scene.ligands.map((_, i) => i).sort((a, b) => (a === held ? 1 : b === held ? -1 : 0));
  ctx.font = "bold 11px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const i of order) {
    const l = scene.ligands[i], col = i === held ? c.accent : c.ink;
    ctx.save();
    ctx.translate(l.pos.x, l.pos.y);
    ctx.rotate(l.rot);
    ctx.lineJoin = "miter";
    ctx.lineWidth = 2;
    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    ctx.stroke(l.path);
    ctx.fill(l.atoms);
    ctx.restore();
    ctx.fillStyle = i === held ? c.accent : c.dim;
    ctx.fillText(LETTERS[i], l.pos.x, l.pos.y);
  }
}

export function DockGame({ colors }: { colors: GameColors }): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef(colors);
  const sceneRef = useRef<Scene | null>(null);
  const phaseRef = useRef<Phase>("idle");
  const heldRef = useRef(-1);
  const curRef = useRef(0);
  const grabRef = useRef<Pt>({ x: 0, y: 0 });
  const pulseRef = useRef(0);
  const reducedRef = useRef(false);
  const rafRef = useRef(0);
  const activeRef = useRef({ onScreen: false, visible: true });
  const layerRef = useRef<Layer | null>(null);
  const dprRef = useRef(1);
  const dirtyRef = useRef(true);
  const hudRef = useRef({ fit: "", rank: "" });

  const [phase, setPhaseState] = useState<Phase>("idle");
  const [fitText, setFitText] = useState("fit 0.00");
  const [rankText, setRankText] = useState("A 0.00  B 0.00  C 0.00");
  const [endFit, setEndFit] = useState("0.00");

  useEffect(() => { colorsRef.current = colors; }, [colors]);

  const setPhase = (p: Phase) => { phaseRef.current = p; setPhaseState(p); };

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d"), scene = sceneRef.current;
    if (!ctx || !scene) return;
    dirtyRef.current = false;
    if (!layerRef.current) layerRef.current = { canvas: document.createElement("canvas"), key: "" };
    const pulse = reducedRef.current || pulseRef.current > PULSE_S ? 0 : Math.sin((Math.PI * pulseRef.current) / PULSE_S);
    renderStatic(layerRef.current, scene, colorsRef.current, phaseRef.current === "done", pulse, dprRef.current);
    drawScene(ctx, layerRef.current, scene, colorsRef.current, heldRef.current);
    const cur = scene.ligands[curRef.current];
    const f = cur.docked ? cur.best : fitOf(cur.samples, cur.pos, cur.rot, scene.pocket, scene.blob);
    const fit = `fit ${f.toFixed(2)}`;
    const ranked = scene.ligands.map((l, i) => ({ l, i })).sort((a, b) => b.l.best - a.l.best);
    const rank = ranked.map(({ l, i }) => `${LETTERS[i]} ${l.best.toFixed(2)}`).join("  ");
    // Only touch React state when the HUD text actually changes.
    if (fit !== hudRef.current.fit) {
      hudRef.current.fit = fit;
      setFitText(fit);
    }
    if (rank !== hudRef.current.rank) {
      hudRef.current.rank = rank;
      setRankText(rank);
    }
  }, []);
  const invalidate = useCallback(() => {
    dirtyRef.current = true;
  }, []);

  // Canvas sizing, intersection + visibility gating, fixed-step loop, wheel rotation.
  useEffect(() => {
    const root = rootRef.current, canvas = canvasRef.current;
    if (!root || !canvas) return;
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const idleShape = makeShape(7);

    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      const prev = sceneRef.current;
      sceneRef.current = buildScene(prev?.shape ?? idleShape, w, h, prev);
      draw();
    });
    ro.observe(root);

    let acc = 0, last = 0;
    const frame = (now: number) => {
      acc += Math.min(0.1, (now - (last || now)) / 1000);
      last = now;
      while (acc >= STEP) {
        acc -= STEP;
        if (phaseRef.current === "idle" && !reducedRef.current) {
          for (const l of sceneRef.current?.ligands ?? []) l.rot += IDLE_SPIN * STEP;
          dirtyRef.current = true;
        }
        if (phaseRef.current === "done" && pulseRef.current <= PULSE_S) {
          pulseRef.current += STEP;
          dirtyRef.current = true;
        }
      }
      if (dirtyRef.current) draw();
      rafRef.current = requestAnimationFrame(frame);
    };
    const sync = () => {
      const on = activeRef.current.onScreen && activeRef.current.visible;
      if (on === Boolean(rafRef.current)) return;
      cancelAnimationFrame(rafRef.current);
      last = 0;
      rafRef.current = on ? requestAnimationFrame(frame) : 0;
    };
    const io = new IntersectionObserver(([e]) => { activeRef.current.onScreen = e.isIntersecting; sync(); }, { threshold: 0.1 });
    io.observe(root);
    const onVis = () => { activeRef.current.visible = document.visibilityState === "visible"; sync(); };
    document.addEventListener("visibilitychange", onVis);
    // Wheel rotates the current ligand during a round only; otherwise the page scrolls as usual.
    const onWheel = (e: WheelEvent) => {
      if (phaseRef.current !== "play") return;
      e.preventDefault();
      const d = Math.max(-60, Math.min(60, e.deltaY * (e.deltaMode ? 16 : 1)));
      rotateLigand(sceneRef.current, curRef.current, (d / 60) * ROT_STEP);
      dirtyRef.current = true;
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [draw]);

  const rotateCur = (d: number) => {
    if (phaseRef.current !== "play") return;
    rotateLigand(sceneRef.current, curRef.current, d);
    invalidate();
  };

  const start = () => {
    if (sceneRef.current) sceneRef.current = newRound(sceneRef.current);
    heldRef.current = -1;
    curRef.current = 0;
    pulseRef.current = 0;
    setPhase("play");
    canvasRef.current?.focus({ preventScroll: true });
    draw();
  };

  const toLocal = (e: React.PointerEvent<HTMLCanvasElement>): Pt => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const scene = sceneRef.current;
    if (phaseRef.current !== "play" || !scene) return;
    const p = toLocal(e), i = grabAt(scene, p);
    if (i < 0) return;
    heldRef.current = i;
    curRef.current = i;
    grabRef.current = { x: scene.ligands[i].pos.x - p.x, y: scene.ligands[i].pos.y - p.y };
    invalidate();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus({ preventScroll: true });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const scene = sceneRef.current;
    if (!scene || heldRef.current < 0) return;
    const p = toLocal(e);
    moveLigand(scene, heldRef.current, { x: p.x + grabRef.current.x, y: p.y + grabRef.current.y });
    invalidate();
  };

  const onPointerUp = () => {
    const scene = sceneRef.current, i = heldRef.current;
    heldRef.current = -1;
    invalidate();
    if (!scene || i < 0) return;
    const f = release(scene, i);
    if (scene.ligands[i].docked) {
      pulseRef.current = 0;
      setEndFit(f.toFixed(2));
      setPhase("done");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    const k = e.key, playing = phaseRef.current === "play";
    const dir = k === "q" || k === "Q" || k === "ArrowLeft" ? -1 : k === "e" || k === "E" || k === "ArrowRight" ? 1 : 0;
    if ((k === "Enter" || k === " ") && !playing) {
      e.preventDefault();
      start();
    } else if (playing && dir) {
      e.preventDefault();
      rotateCur(dir * ROT_STEP);
    }
  };

  const vars = { background: colors.bg, color: colors.ink, "--ink": colors.ink, "--bg": colors.bg } as React.CSSProperties;

  return (
    <div ref={rootRef} className="relative h-full w-full select-none" style={vars}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        tabIndex={0}
        aria-label="Docking puzzle: drag and rotate a ligand into the protein pocket"
        style={{ touchAction: phase === "play" ? "none" : "pan-y", outline: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      />
      <div className="pointer-events-none absolute left-3 top-3 font-mono text-xs sm:text-sm" aria-live="polite">
        <div style={{ color: colors.accent }}>{fitText}</div>
        <div style={{ color: colors.dim }}>{rankText}</div>
      </div>
      {phase === "play" && (
        <button type="button" className={`${BTN} absolute right-3 top-3`} aria-label="Rotate ligand 15 degrees" onClick={() => rotateCur(ROT_STEP)}>Rotate</button>
      )}
      <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-xs sm:text-sm" style={{ color: colors.dim }}>
        {(phase === "play" ? PLAY_HINT : IDLE_HINT).map((t) => <div key={t}>{t}</div>)}
      </div>
      {phase === "idle" && (
        <div className={CENTER}><button type="button" className={BTN} onClick={start}>Play</button></div>
      )}
      {phase === "done" && (
        <div className={CENTER}>
          <div className="border-2 px-4 py-3 text-center font-mono text-xs sm:text-sm" style={{ borderColor: colors.ink, background: colors.bg }}>
            <div style={{ color: colors.accent }}>Docked. Fit {endFit}</div>
            <div className="mt-1" style={{ color: colors.dim }}>The real app ranks poses</div>
            <div style={{ color: colors.dim }}>the same way, in 3D.</div>
            <button type="button" className={`${BTN} mt-3`} onClick={start}>Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
