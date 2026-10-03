"use client";

import { useEffect, useRef, useState } from "react";

export type GameColors = { bg: string; ink: string; accent: string; dim: string };

// "Beat the filter": out-forecast a scalar Kalman filter on a noisy series.
// The hidden truth is AR(1) + a slow seasonal sine + occasional shocks; the
// filter only knows the AR(1) model, which is exactly the benchmark setup.
const PHI = 0.92; // AR(1) coefficient
const Q = 6; // process noise variance (cm^2) -> stationary std ~ 6 cm
const R = 4; // observation noise variance (cm^2), sigma 2 cm ~ 0.25 of the swing
const SEASON_AMP = 4; // cm
const SEASON_PERIOD = 12; // steps
const SHOCK_P = 0.06; // chance per step of a step-like shock
const SHOCK = 7; // cm
const VISIBLE = 60; // observations shown left of "now"
const STEPS = 5; // guesses per game
const Y_MAX = 20; // axis runs -Y_MAX..Y_MAX cm
const GRID_CM = [-15, -5, 5, 15];
const NOW_FRAC = 0.72; // x position of the "now" hairline
const KEY_STEP = 0.5; // cm per arrow press
const T_FORECAST = 650; // ms the filter's forecast sits alone before the truth
const T_ERRORS = 1500; // ms the per-step errors stay on screen
const T_SCROLL = 250; // ms for the one-step scroll
const SIM_MS = 1000 / 60;
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

type Phase = "idle" | "aim" | "reveal" | "end";
type Hud = { phase: Phase; you: number; filter: number; step: number };

function gauss() {
  let u = 0;
  while (u === 0) u = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);

export function ForecastGame({ colors }: { colors: GameColors }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef(colors);
  const apiRef = useRef<{ start: () => void; redraw: () => void } | null>(null);
  const [hud, setHud] = useState<Hud>({ phase: "idle", you: 0, filter: 0, step: 0 });

  useEffect(() => {
    colorsRef.current = colors;
    apiRef.current?.redraw();
  }, [colors]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- simulator + filter ---------------------------------------------
    const obs: number[] = [];
    const est: number[] = [];
    let ar = 0; // AR(1) component of the truth
    let t = 0; // step index (drives the seasonal term)
    let truth = 0;
    let fx = 0; // filtered state
    let fp = Q / (1 - PHI * PHI); // filtered variance, starts at stationary

    function advance() {
      ar = PHI * ar + gauss() * Math.sqrt(Q);
      if (Math.random() < SHOCK_P) ar += Math.random() < 0.5 ? -SHOCK : SHOCK;
      t++;
      truth = ar + SEASON_AMP * Math.sin((2 * Math.PI * t) / SEASON_PERIOD);
      const z = truth + gauss() * Math.sqrt(R);
      // Kalman: predict, then update.
      const xp = PHI * fx;
      const pp = PHI * PHI * fp + Q;
      const k = pp / (pp + R);
      fx = xp + k * (z - xp);
      fp = (1 - k) * pp;
      obs.push(z);
      est.push(fx);
      if (obs.length > VISIBLE) {
        obs.shift();
        est.shift();
      }
    }
    for (let i = 0; i < VISIBLE + 40; i++) advance();

    // --- game state -------------------------------------------------------
    let phase: Phase = "idle";
    let guess = 0;
    let forecast = 0;
    let revealMs = 0;
    let scrollMs = T_SCROLL; // >= T_SCROLL means no scroll in progress
    let youErr = 0;
    let filtErr = 0;
    let youTot = 0;
    let filtTot = 0;
    let step = 0;
    let dirty = true;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let last = 0;
    let acc = 0;
    let onScreen = false;
    let pointerDown = false;

    function publish() {
      setHud({ phase, you: youTot, filter: filtTot, step });
    }

    function setPhase(next: Phase) {
      phase = next;
      const active = next === "aim" || next === "reveal";
      canvas!.style.touchAction = active ? "none" : "pan-y";
      canvas!.style.cursor = next === "aim" ? "crosshair" : "default";
      dirty = true;
      publish();
    }

    function start() {
      youTot = filtTot = 0;
      step = 0;
      guess = est[est.length - 1];
      canvas!.focus({ preventScroll: true });
      setPhase("aim");
    }

    function commit() {
      if (phase !== "aim") return;
      forecast = PHI * fx;
      revealMs = 0;
      setPhase("reveal");
    }

    function setGuessFromY(clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      const { plotT, plotB } = layout();
      const v = Y_MAX - ((clientY - rect.top - plotT) / (plotB - plotT)) * 2 * Y_MAX;
      guess = clamp(v, -Y_MAX, Y_MAX);
      dirty = true;
    }

    // One fixed simulation tick; only the reveal timeline is time-based.
    function tick(ms: number) {
      if (scrollMs < T_SCROLL) scrollMs += ms;
      if (phase !== "reveal") return;
      const before = revealMs;
      revealMs += ms;
      if (before < T_FORECAST && revealMs >= T_FORECAST) {
        advance();
        youErr = Math.abs(guess - truth);
        filtErr = Math.abs(forecast - truth);
        youTot += youErr;
        filtTot += filtErr;
        scrollMs = reduceMotion ? T_SCROLL : 0;
        publish();
      }
      if (revealMs >= T_FORECAST + T_ERRORS) {
        step++;
        setPhase(step >= STEPS ? "end" : "aim");
      }
    }

    // --- drawing ----------------------------------------------------------
    function layout() {
      const small = width < 420;
      const font = small ? 9 : 11;
      const plotL = small ? 26 : 36;
      const plotR = width - 6;
      const plotT = small ? 10 : 14;
      const plotB = height - (small ? 10 : 14);
      const nowX = plotL + (plotR - plotL) * NOW_FRAC;
      return {
        small,
        font,
        plotL,
        plotR,
        plotT,
        plotB,
        nowX,
        guessX: nowX + (plotR - nowX) * 0.3,
        dx: (nowX - plotL) / (VISIBLE - 1),
        yOf: (v: number) => plotT + ((Y_MAX - v) / (2 * Y_MAX)) * (plotB - plotT),
      };
    }

    function draw() {
      dirty = false;
      const c = colorsRef.current;
      const { font, plotL, plotR, plotT, plotB, nowX, guessX, dx, yOf } = layout();
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.fillStyle = c.bg;
      ctx!.fillRect(0, 0, width, height);
      ctx!.font = `${font}px ${MONO}`;
      ctx!.lineWidth = 2;

      // grid + axis labels
      ctx!.strokeStyle = c.dim;
      ctx!.fillStyle = c.dim;
      ctx!.textAlign = "right";
      ctx!.textBaseline = "middle";
      for (const v of GRID_CM) {
        const y = Math.round(yOf(v));
        ctx!.beginPath();
        ctx!.moveTo(plotL, y);
        ctx!.lineTo(plotR, y);
        ctx!.stroke();
        ctx!.fillText(`${v > 0 ? "+" : ""}${v}`, plotL - 4, y);
      }
      ctx!.textBaseline = "top";
      ctx!.fillText("cm", plotL - 4, plotT);

      // "now" hairline
      ctx!.beginPath();
      ctx!.moveTo(Math.round(nowX), plotT);
      ctx!.lineTo(Math.round(nowX), plotB);
      ctx!.stroke();

      // series, clipped to the plot; during a scroll everything sits one
      // step to the right and eases left into place
      const shift = (1 - easeOut(scrollMs / T_SCROLL)) * dx;
      const n = obs.length;
      const xAt = (i: number) => nowX - (n - 1 - i) * dx + shift;
      ctx!.save();
      ctx!.beginPath();
      ctx!.rect(plotL, plotT, plotR - plotL, plotB - plotT);
      ctx!.clip();
      ctx!.strokeStyle = c.accent;
      ctx!.beginPath();
      est.forEach((v, i) => (i ? ctx!.lineTo(xAt(i), yOf(v)) : ctx!.moveTo(xAt(i), yOf(v))));
      ctx!.stroke();
      ctx!.fillStyle = c.ink;
      obs.forEach((v, i) => ctx!.fillRect(xAt(i) - 1.5, yOf(v) - 1.5, 3, 3));
      ctx!.restore();

      if (phase !== "aim" && phase !== "reveal") return;

      // the guess column, tinted so it reads as the place to act
      ctx!.save();
      ctx!.globalAlpha = 0.12;
      ctx!.fillStyle = c.ink;
      ctx!.fillRect(nowX, plotT, plotR - nowX, plotB - plotT);
      ctx!.restore();
      ctx!.fillStyle = c.dim;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "top";
      ctx!.fillText(phase === "aim" ? "next month?" : "next month", (nowX + plotR) / 2, plotT + 2);

      // guess column
      const r = font < 10 ? 5 : 6;
      const revealed = phase === "reveal" && revealMs >= T_FORECAST;
      const gy = yOf(guess);
      ctx!.strokeStyle = revealed ? c.ink : c.dim;
      ctx!.beginPath();
      const ly = Math.round(revealed ? yOf(truth) : gy);
      ctx!.moveTo(nowX, ly);
      ctx!.lineTo(plotR, ly);
      ctx!.stroke();

      ctx!.strokeStyle = c.ink;
      ctx!.beginPath();
      ctx!.arc(guessX, gy, r, 0, Math.PI * 2);
      ctx!.stroke();

      if (phase === "reveal") {
        const fy = yOf(forecast);
        ctx!.fillStyle = c.accent;
        ctx!.beginPath();
        ctx!.arc(guessX, fy, r - 1, 0, Math.PI * 2);
        ctx!.fill();
        if (revealed) {
          // per-step errors beside each marker; nudge apart when they collide
          const close = Math.abs(gy - fy) < font + 2;
          const tx = guessX + r + 4;
          ctx!.textAlign = "left";
          ctx!.textBaseline = "middle";
          const wide = plotR - guessX > 110;
          ctx!.fillStyle = c.ink;
          ctx!.fillText(
            (wide ? "you " : "") + youErr.toFixed(1),
            tx,
            close && gy <= fy ? gy - font / 2 - 1 : gy,
          );
          ctx!.fillStyle = c.accent;
          ctx!.fillText(
            (wide ? "filter " : "") + filtErr.toFixed(1),
            tx,
            close && gy <= fy ? fy + font / 2 + 1 : fy,
          );
          ctx!.textAlign = "right";
          ctx!.textBaseline = "bottom";
          ctx!.fillStyle = c.ink;
          ctx!.fillText("actual", plotR - 2, yOf(truth) - 2);
        }
      }
    }

    // --- loop + lifecycle -------------------------------------------------
    function frameFn(now: number) {
      const dt = Math.min(now - last, 100);
      last = now;
      acc += dt;
      while (acc >= SIM_MS) {
        tick(SIM_MS);
        acc -= SIM_MS;
      }
      if (dirty || phase === "reveal" || scrollMs < T_SCROLL) draw();
      frame = requestAnimationFrame(frameFn);
    }

    function syncLoop() {
      const run = onScreen && document.visibilityState === "visible";
      if (run && !frame) {
        last = performance.now();
        acc = 0;
        frame = requestAnimationFrame(frameFn);
      } else if (!run && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }

    function resize() {
      const rect = root!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      draw();
    }

    const onPointerDown = (e: PointerEvent) => {
      if (phase === "idle" || phase === "end") {
        start();
        return;
      }
      if (phase !== "aim") return;
      pointerDown = true;
      setGuessFromY(e.clientY);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (phase === "aim" && (e.pointerType === "mouse" || pointerDown)) setGuessFromY(e.clientY);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!pointerDown) return;
      pointerDown = false;
      setGuessFromY(e.clientY);
      commit();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        if (phase !== "aim") return;
        guess = clamp(guess + (e.key === "ArrowUp" ? KEY_STEP : -KEY_STEP), -Y_MAX, Y_MAX);
        dirty = true;
      } else if (e.key === "Enter") {
        if (phase === "aim") commit();
        else if (phase !== "reveal") start();
      } else if (e.key === " ") {
        if (phase === "idle" || phase === "end") start();
      } else return;
      e.preventDefault();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        syncLoop();
      },
      { threshold: 0.1 },
    );
    io.observe(root);
    document.addEventListener("visibilitychange", syncLoop);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", () => (pointerDown = false));
    canvas.addEventListener("keydown", onKey);
    canvas.style.touchAction = "pan-y";
    apiRef.current = { start, redraw: () => (dirty = true) };
    resize();

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", syncLoop);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("keydown", onKey);
      if (frame) cancelAnimationFrame(frame);
      apiRef.current = null;
    };
  }, []);

  const { phase, you, filter, step } = hud;
  const loser = Math.max(you, filter);
  const pct = loser > 0 ? Math.round((Math.abs(you - filter) / loser) * 100) : 0;
  const verdict =
    you < filter
      ? `You beat the filter by ${pct}%`
      : filter < you
        ? `The filter beat you by ${pct}%`
        : "You tied the filter";
  const button =
    "pointer-events-auto rounded-none border-2 border-[var(--ink)] bg-transparent px-3 py-1.5 font-medium hover:bg-[var(--ink)] hover:text-[var(--bg)]";

  return (
    <div
      ref={rootRef}
      className="relative h-full w-full select-none"
      style={{ background: colors.bg, color: colors.ink, "--ink": colors.ink, "--bg": colors.bg } as React.CSSProperties}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full outline-none focus-visible:outline-2 focus-visible:outline-[var(--ink)]"
        tabIndex={0}
        aria-label="Beat the filter: guess the next value of a noisy series, then compare your error with a Kalman filter"
      />
      <div className="pointer-events-none absolute inset-0 font-mono text-xs sm:text-sm">
        <div className="absolute left-3 top-2 leading-tight">
          <div>you {you.toFixed(1)} cm</div>
          <div style={{ color: colors.accent }}>filter {filter.toFixed(1)} cm</div>
        </div>
        {phase !== "idle" && (
          <div className="absolute right-3 top-2">
            step {Math.min(step + 1, STEPS)} of {STEPS}
          </div>
        )}
        {phase === "idle" && (
          <div className="absolute inset-x-3 bottom-3 flex flex-col items-center gap-2 text-center leading-tight">
            <p className="px-2 py-1" style={{ background: colors.bg }}>
              <span className="block">Can you out-guess a Kalman filter?</span>
              <span className="block">Five rounds. Tap to start.</span>
            </p>
            <button type="button" className={button} onClick={() => apiRef.current?.start()}>
              Play
            </button>
          </div>
        )}
        {phase === "aim" && (
          <p className="absolute inset-x-3 bottom-3 text-center" style={{ color: colors.dim }}>
            Click where the next dot will land
          </p>
        )}
        {phase === "end" && (
          <div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 border-2 px-4 py-3 text-center leading-tight"
            style={{ background: colors.bg, borderColor: colors.ink }}
            role="status"
          >
            <div className="font-medium" style={{ color: colors.accent }}>
              {verdict}
            </div>
            <div>Most published models lose to it too.</div>
            <button type="button" className={button} onClick={() => apiRef.current?.start()}>
              Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
