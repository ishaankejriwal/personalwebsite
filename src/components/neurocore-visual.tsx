"use client";

import { motion, useReducedMotion } from "motion/react";

const tracePath =
  "M28 213 C52 186 72 187 94 206 S132 231 156 196 191 127 221 146 244 185 276 159 299 126 326 146 350 170 374 113 398 90";

const quietLine = "rgba(255,255,255,.12)";

export function NeuroCoreVisual() {
  const reduceMotion = useReducedMotion();
  const drawInitial = reduceMotion ? false : { pathLength: 0, opacity: 0.26 };
  const drawVisible = { pathLength: 1, opacity: 1 };

  return (
    <div
      className="group/neuro-visual relative h-full min-h-64 overflow-hidden rounded-[4px] border border-white/[0.06] bg-[#070b11] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
      role="img"
      aria-label="IMU posture trace and abstract brace orientation"
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(170,190,215,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(170,190,215,0.055)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
        <span>IMU posture trace</span>
        <span className="text-[color:var(--accent)]">orientation 12.4 deg</span>
      </div>

      <svg viewBox="0 0 420 300" className="relative h-full w-full">
        <defs>
          <linearGradient id="neuroTrace" x1="24" x2="400" y1="220" y2="82">
            <stop stopColor="rgba(110,183,255,.38)" />
            <stop offset="0.58" stopColor="var(--accent)" />
            <stop offset="1" stopColor="rgba(255,255,255,.82)" />
          </linearGradient>
        </defs>

        {[62, 112, 162, 212, 262].map((y) => (
          <path key={y} d={`M24 ${y} H402`} stroke="rgba(255,255,255,.055)" />
        ))}
        {[70, 126, 182, 238, 294, 350].map((x) => (
          <path key={x} d={`M${x} 44 V254`} stroke="rgba(255,255,255,.052)" />
        ))}

        <motion.path
          d={tracePath}
          fill="none"
          stroke="rgba(110,183,255,.16)"
          strokeLinecap="round"
          strokeWidth="18"
          initial={drawInitial}
          whileInView={drawVisible}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="opacity-40 transition-opacity duration-300 group-hover/neuro-visual:opacity-80 group-focus/neuro-visual:opacity-80"
        />
        <motion.path
          d={tracePath}
          fill="none"
          stroke="url(#neuroTrace)"
          strokeLinecap="round"
          strokeWidth="3"
          initial={drawInitial}
          whileInView={drawVisible}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.08 }}
          className="[stroke-width:3px] drop-shadow-[0_0_12px_rgba(110,183,255,0.22)] transition-[stroke-width,filter] duration-300 group-hover/neuro-visual:[stroke-width:4.5px] group-focus/neuro-visual:[stroke-width:4.5px]"
        />

        {[
          [94, 206],
          [191, 127],
          [276, 159],
          [374, 113],
        ].map(([cx, cy], index) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="4"
            fill="var(--accent)"
            initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.28, delay: 0.32 + index * 0.08 }}
            className="origin-center transition-transform duration-300 group-hover/neuro-visual:scale-125 group-focus/neuro-visual:scale-125"
          />
        ))}

        <g transform="translate(256 48)">
          <motion.g
            initial={reduceMotion ? false : { rotate: -10, opacity: 0.58 }}
            whileInView={{ rotate: 0, opacity: 1 }}
            whileHover={reduceMotion ? undefined : { rotate: 7 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ transformOrigin: "54px 72px" }}
          >
            <path
              d="M44 18 C72 25 92 48 94 78 C95 103 82 126 58 139"
              fill="none"
              stroke={quietLine}
              strokeLinecap="round"
              strokeWidth="14"
            />
            <path
              d="M44 18 C72 25 92 48 94 78 C95 103 82 126 58 139"
              fill="none"
              stroke="rgba(110,183,255,.56)"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path d="M29 58 h56" stroke="rgba(255,255,255,.34)" strokeLinecap="round" />
            <path d="M24 93 h68" stroke="rgba(255,255,255,.24)" strokeLinecap="round" />
            <rect
              x="38"
              y="66"
              width="31"
              height="25"
              rx="4"
              fill="#0d141d"
              stroke="rgba(255,255,255,.28)"
            />
            <path d="M45 78 h17" stroke="var(--accent)" strokeLinecap="round" />
          </motion.g>
          <path d="M0 164 H126" stroke="rgba(255,255,255,.08)" />
          <path d="M28 164 A34 34 0 0 1 92 164" fill="none" stroke="rgba(110,183,255,.42)" />
          <motion.path
            d="M60 164 L84 137"
            stroke="var(--accent)"
            strokeLinecap="round"
            strokeWidth="3"
            initial={reduceMotion ? false : { rotate: -15 }}
            whileInView={{ rotate: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.12 }}
            style={{ transformOrigin: "60px 164px" }}
            className="transition-transform duration-300 group-hover/neuro-visual:rotate-[9deg] group-focus/neuro-visual:rotate-[9deg]"
          />
        </g>
      </svg>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-[color:var(--muted)] sm:text-[0.58rem] sm:tracking-[0.14em]">
        {["pitch ok", "roll drift", "calib ok"].map((label, index) => (
          <span
            key={label}
            className="rounded-[3px] border border-white/[0.08] bg-white/[0.025] px-2 py-1.5"
          >
            <span className={index === 1 ? "text-[color:var(--accent)]" : ""}>{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
