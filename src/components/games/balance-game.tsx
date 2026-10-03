"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export type GameColors = { bg: string; ink: string; accent: string; dim: string };

const STEP = 1 / 60; // fixed simulation step (s)
const ROUND_S = 20;
const MAX_ROLL = (25 * Math.PI) / 180; // pointer y maps to +-25 degrees
const ROLL_TOL = (8 * Math.PI) / 180; // roll tolerance shown by the tick marks
const WINDOW = 60; // 1 s error ring buffer
const TRACE = 180; // 3 s sensor traces
// ponytail: calibration knobs. Score = stddev(error window) * SCORE_SCALE, capped at 100.
const SCORE_SCALE = 120;
const CUE_THRESHOLD = 30;
const CUE_HOT_WINDOWS = 3; // consecutive 100 ms windows above threshold
const CUE_COOLDOWN_MS = 1000;
const FOLLOW = 0.6; // per-step lerp of belt toward input (about 50 ms settle)
const KEY_NUDGE = 0.08;
const TILT_RANGE_DEG = 20; // phone tilt delta that maps to full lean / roll

type Phase = "idle" | "play" | "end";
type Hud = { score: number; stable: number; left: number; buzz: boolean; cues: number };

type Sim = {
  phase: Phase;
  t: number; // continuous clock driving the target path
  roundT: number;
  lean: number; // -1..1, drawn as px offset of the belt centre
  roll: number; // radians
  inLean: number;
  inRoll: number;
  stable: number;
  cues: number;
  cueAt: number; // ms timestamp of last cue
  hot: number;
  stepN: number;
  err: Float32Array;
  errN: number;
  traces: [Float32Array, Float32Array, Float32Array];
  traceN: number;
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Target lean on a -1..1 scale; sum of two sines so it never looks looped.
const targetAt = (t: number) =>
  0.55 * Math.sin((2 * Math.PI * t) / 7) + 0.35 * Math.sin((2 * Math.PI * t) / 3.1 + 1);

const BAND = 0.16; // band half-width on the -1..1 lean scale

function newSim(): Sim {
  return {
    phase: "idle",
    t: 0,
    roundT: 0,
    lean: 0,
    roll: 0,
    inLean: 0,
    inRoll: 0,
    stable: 0,
    cues: 0,
    cueAt: -1e9,
    hot: 0,
    stepN: 0,
    err: new Float32Array(WINDOW),
    errN: 0,
    traces: [new Float32Array(TRACE), new Float32Array(TRACE), new Float32Array(TRACE)],
    traceN: 0,
  };
}

function stddev(buf: Float32Array) {
  let m = 0;
  for (let i = 0; i < buf.length; i++) m += buf[i];
  m /= buf.length;
  let v = 0;
  for (let i = 0; i < buf.length; i++) v += (buf[i] - m) ** 2;
  return Math.sqrt(v / buf.length);
}

function scoreOf(s: Sim) {
  return Math.min(100, Math.round(stddev(s.err) * SCORE_SCALE));
}

export function BalanceGame({ colors }: { colors: GameColors }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Sim>(newSim());
  const [phase, setPhase] = useState<Phase>("idle");
  const [hud, setHud] = useState<Hud>({ score: 0, stable: 0, left: ROUND_S, buzz: false, cues: 0 });
  const [tiltOn, setTiltOn] = useState(false);
  // Hydration-safe "does this device have orientation events" (false on the server).
  const hasTilt = useSyncExternalStore(
    () => () => {},
    () =>
      typeof DeviceOrientationEvent !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
    () => false,
  );

  const start = () => {
    const s = simRef.current;
    const keep = s.t;
    Object.assign(s, newSim(), { phase: "play", t: keep, inLean: s.inLean, inRoll: s.inRoll });
    setHud({ score: 0, stable: 0, left: ROUND_S, buzz: false, cues: 0 });
    setPhase("play");
    canvasRef.current?.focus({ preventScroll: true });
  };

  // Phone tilt: lean from gamma, roll from beta, both as deltas from the pose at press time.
  const enableTilt = async () => {
    const D = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof D.requestPermission === "function") {
      try {
        if ((await D.requestPermission()) !== "granted") return;
      } catch {
        return;
      }
    }
    let base: { b: number; g: number } | null = null;
    window.addEventListener("deviceorientation", (e) => {
      if (e.beta == null || e.gamma == null) return;
      if (!base) base = { b: e.beta, g: e.gamma };
      const s = simRef.current;
      s.inLean = clamp((e.gamma - base.g) / TILT_RANGE_DEG, -1, 1);
      s.inRoll = clamp((e.beta - base.b) / TILT_RANGE_DEG, -1, 1) * MAX_ROLL;
    });
    setTiltOn(true);
  };

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let acc = 0;
    let onScreen = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = root.clientWidth;
      h = root.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const fireCue = (s: Sim, now: number) => {
      s.cues++;
      s.cueAt = now;
      s.hot = 0;
      navigator.vibrate?.(40);
    };

    const step = (now: number) => {
      const s = simRef.current;
      const playing = s.phase === "play";
      if (playing || !reduced) s.t += STEP;
      s.lean += (s.inLean - s.lean) * FOLLOW;
      s.roll += (s.inRoll - s.roll) * FOLLOW;
      const tx = s.phase === "idle" && reduced ? 0 : targetAt(s.t);
      // Three IMU-like channels: hips see roll with opposite sign plus lean, back sees lean.
      const r = s.roll / MAX_ROLL;
      s.traces[0][s.traceN] = r * 0.7 + s.lean * 0.3;
      s.traces[1][s.traceN] = -r * 0.7 + s.lean * 0.3;
      s.traces[2][s.traceN] = s.lean * 0.8 + r * 0.1;
      s.traceN = (s.traceN + 1) % TRACE;
      if (!playing) return;
      // Error: distance from band centre and roll error, both normalised to their tolerance.
      const e = Math.hypot((s.lean - tx) / BAND, s.roll / ROLL_TOL);
      s.err[s.errN] = e;
      s.errN = (s.errN + 1) % WINDOW;
      if (Math.abs(s.lean - tx) <= BAND && Math.abs(s.roll) <= ROLL_TOL) s.stable += STEP;
      s.roundT += STEP;
      s.stepN++;
      if (s.stepN % 6 === 0) {
        // 100 ms window: the cue needs sustained instability, then a cooldown.
        const score = scoreOf(s);
        s.hot = score > CUE_THRESHOLD ? s.hot + 1 : 0;
        if (s.hot >= CUE_HOT_WINDOWS && now - s.cueAt >= CUE_COOLDOWN_MS) fireCue(s, now);
        setHud({
          score,
          stable: s.stable,
          left: Math.max(0, ROUND_S - s.roundT),
          buzz: now - s.cueAt < 500,
          cues: s.cues,
        });
      }
      if (s.roundT >= ROUND_S) {
        s.phase = "end";
        setHud({ score: scoreOf(s), stable: s.stable, left: 0, buzz: false, cues: s.cues });
        setPhase("end");
      }
    };

    const line = (x1: number, y1: number, x2: number, y2: number, color: string, lw: number) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const draw = () => {
      const s = simRef.current;
      const now = performance.now();
      ctx.clearRect(0, 0, w, h);
      const m = Math.min(w, h);
      const cx = w / 2;
      const cy = h * 0.42;
      const L = m * 0.2; // belt half-length
      const leanPx = w * 0.25; // px per unit lean
      const gy = cy + m * 0.26; // ground
      const top = cy - m * 0.3;
      const tx = s.phase === "idle" && reduced ? 0 : targetAt(s.t);
      ctx.lineCap = "butt";

      line(w * 0.08, gy, w * 0.92, gy, colors.dim, 2);

      // Target band (x range for the belt centre) and roll tolerance ticks.
      const bx = cx + tx * leanPx;
      const bw = BAND * leanPx;
      line(bx - bw, top, bx - bw, gy, colors.accent, 2);
      line(bx + bw, top, bx + bw, gy, colors.accent, 2);
      line(bx, gy - 6, bx, gy + 6, colors.accent, 2);
      const ty = L * Math.sin(ROLL_TOL);
      for (const sgn of [-1, 1]) {
        const x = bx + sgn * (L + 10);
        line(x, cy - ty, x, cy + ty, colors.accent, 2);
        line(x - 3, cy - ty, x + 3, cy - ty, colors.accent, 2);
        line(x - 3, cy + ty, x + 3, cy + ty, colors.accent, 2);
      }

      // Belt + trunk in the body frame.
      ctx.save();
      ctx.translate(cx + s.lean * leanPx, cy);
      ctx.rotate(s.roll);
      line(0, 0, 0, -L * 1.3, colors.dim, 2); // spine
      line(-L * 0.6, -L * 1.3, L * 0.6, -L * 1.3, colors.dim, 2); // shoulders
      line(-L, 0, L, 0, colors.ink, 3);
      ctx.fillStyle = colors.ink;
      for (const [px, py] of [
        [-L * 0.75, 0],
        [L * 0.75, 0],
        [0, L * 0.3],
      ]) {
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      if (now - s.cueAt < 300) {
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx + s.lean * leanPx, cy, L * 1.25, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Sensor trace strips: last 3 s per channel.
      const pad = w * 0.08;
      const gap = 12;
      const sw = (w - 2 * pad - 2 * gap) / 3;
      const sh = Math.min(44, h * 0.1);
      const sy = h - 34 - sh;
      ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillStyle = colors.dim;
      ctx.textBaseline = "bottom";
      const labels = ["L hip", "R hip", "back"];
      for (let k = 0; k < 3; k++) {
        const x0 = pad + k * (sw + gap);
        const mid = sy + sh / 2;
        line(x0, mid, x0 + sw, mid, colors.dim, 2);
        ctx.fillText(labels[k], x0, sy - 3);
        ctx.strokeStyle = colors.ink;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const buf = s.traces[k];
        for (let i = 0; i < TRACE; i++) {
          const v = buf[(s.traceN + i) % TRACE];
          const x = x0 + (i / (TRACE - 1)) * sw;
          const y = mid - clamp(v, -1, 1) * (sh / 2 - 1);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const frame = (ts: number) => {
      raf = requestAnimationFrame(frame);
      if (!last) last = ts;
      acc = Math.min(acc + (ts - last) / 1000, 0.25);
      last = ts;
      while (acc >= STEP) {
        step(ts);
        acc -= STEP;
      }
      draw();
    };

    const sync = () => {
      const run = onScreen && document.visibilityState === "visible";
      if (run && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    const io = new IntersectionObserver(
      ([en]) => {
        onScreen = en.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    io.observe(root);
    document.addEventListener("visibilitychange", sync);

    // Pointer: position relative to the canvas centre drives lean (x) and roll (y).
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch" && e.buttons === 0) return;
      const r = canvas.getBoundingClientRect();
      const s = simRef.current;
      s.inLean = clamp(((e.clientX - r.left) / r.width - 0.5) / 0.4, -1, 1);
      s.inRoll = clamp(((e.clientY - r.top) / r.height - 0.5) / 0.4, -1, 1) * MAX_ROLL;
    };
    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      onPointer(e);
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onPointer);

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onPointer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [colors]);

  const onKey = (e: React.KeyboardEvent) => {
    const s = simRef.current;
    const nudge: Record<string, () => void> = {
      ArrowLeft: () => (s.inLean = clamp(s.inLean - KEY_NUDGE, -1, 1)),
      ArrowRight: () => (s.inLean = clamp(s.inLean + KEY_NUDGE, -1, 1)),
      ArrowUp: () => (s.inRoll = clamp(s.inRoll - KEY_NUDGE * MAX_ROLL, -MAX_ROLL, MAX_ROLL)),
      ArrowDown: () => (s.inRoll = clamp(s.inRoll + KEY_NUDGE * MAX_ROLL, -MAX_ROLL, MAX_ROLL)),
    };
    if (nudge[e.key]) {
      e.preventDefault();
      nudge[e.key]();
    } else if ((e.key === " " || e.key === "Enter") && phase !== "play") {
      e.preventDefault();
      start();
    }
  };

  const btn =
    "border-2 bg-transparent px-3 py-1.5 font-medium rounded-none font-mono text-xs sm:text-sm " +
    "transition-colors hover:bg-[var(--gi)] hover:text-[var(--gb)]";
  const btnStyle = { borderColor: colors.ink, color: colors.ink, "--gi": colors.ink, "--gb": colors.bg } as React.CSSProperties;
  const mono = "font-mono text-xs sm:text-sm";

  return (
    <div
      ref={rootRef}
      className="relative h-full w-full select-none"
      style={{ background: colors.bg, color: colors.ink }}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full outline-none focus-visible:outline-2"
        style={{ touchAction: phase === "play" ? "none" : "pan-y", outlineColor: colors.accent }}
        tabIndex={0}
        aria-label="Balance game: move the pointer or tilt the phone to keep the belt inside the target band"
        onKeyDown={onKey}
      />

      <div className={`absolute left-3 top-3 ${mono}`} aria-live="polite">
        <div style={{ color: hud.score > CUE_THRESHOLD ? colors.accent : colors.ink }}>
          instability {hud.score}
          {hud.buzz && <span style={{ color: colors.accent }}> buzz</span>}
        </div>
        <div style={{ color: colors.dim }}>stable {hud.stable.toFixed(1)} s</div>
      </div>

      <div className={`absolute right-3 top-3 flex flex-col items-end gap-2 ${mono}`}>
        {phase === "play" && <div>{Math.ceil(hud.left)} s</div>}
        {phase === "idle" && (
          <button type="button" className={btn} style={btnStyle} onClick={start}>
            Play
          </button>
        )}
        {hasTilt && !tiltOn && (
          <button type="button" className={btn} style={btnStyle} onClick={enableTilt}>
            Use phone tilt
          </button>
        )}
        {tiltOn && <div style={{ color: colors.dim }}>tilt on</div>}
      </div>

      {phase !== "play" && (
        <div className={`absolute bottom-3 left-3 ${mono}`} style={{ color: colors.dim }}>
          Keep the belt inside the band.
        </div>
      )}

      {phase === "end" && (
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 px-5 py-4 text-center ${mono}`}
          style={{ background: colors.bg, borderColor: colors.ink }}
        >
          <div>stable {hud.stable.toFixed(1)} of {ROUND_S} s</div>
          <div style={{ color: colors.dim }}>
            {hud.cues} {hud.cues === 1 ? "cue" : "cues"}
          </div>
          <button type="button" className={`${btn} mt-3`} style={btnStyle} onClick={start}>
            Again
          </button>
        </div>
      )}
    </div>
  );
}
