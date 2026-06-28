"use client";

import { motion, useReducedMotion } from "motion/react";

const passPath = "M36 210 C92 138 142 132 192 166 S280 222 384 86";
const contourLayers = [
  "M96 172 C112 134 156 114 198 128 C244 144 264 188 238 216 C208 248 148 236 112 210 C96 198 90 186 96 172Z",
  "M126 176 C138 150 166 140 196 148 C226 157 244 184 228 204 C210 226 166 224 140 206 C128 198 122 186 126 176Z",
  "M158 180 C166 166 184 162 202 168 C218 174 228 190 218 202 C206 216 180 214 164 202 C156 196 152 188 158 180Z",
];
const samplePoints = [
  [112, 194, "s01"],
  [182, 154, "s02"],
  [238, 190, "s03"],
  [322, 124, "s04"],
];

export function NasaVisual() {
  const reduceMotion = useReducedMotion();
  const drawInitial = reduceMotion ? false : { pathLength: 0, opacity: 0.24 };
  const markerMotion = reduceMotion
    ? ""
    : "group-hover/nasa:translate-x-8 group-focus/nasa:translate-x-8";

  return (
    <div
      className="group/nasa relative h-full min-h-64 overflow-hidden rounded-[4px] border border-white/[0.06] bg-[#070b11] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
      role="img"
      aria-label="Remote sensing evidence panel with a GRACE satellite pass, mass anomaly contours, and time indexed climate data bands"
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(170,190,215,0.052)_1px,transparent_1px),linear-gradient(90deg,rgba(170,190,215,0.052)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
        <span>GRACE panel</span>
        <span className="text-[color:var(--accent)]">t+04 / anomaly</span>
      </div>

      <svg viewBox="0 0 420 300" className="relative h-full w-full">
        <defs>
          <linearGradient id="nasaPass" x1="36" x2="384" y1="210" y2="86">
            <stop stopColor="rgba(110,183,255,.2)" />
            <stop offset="0.52" stopColor="var(--accent)" />
            <stop offset="1" stopColor="rgba(255,255,255,.82)" />
          </linearGradient>
        </defs>

        {[74, 118, 162, 206, 250].map((y, index) => (
          <g key={y}>
            <path d={`M34 ${y} H390`} stroke="rgba(255,255,255,.055)" />
            <text x="24" y={y + 3} fill="rgba(255,255,255,.28)" fontSize="8" fontFamily="monospace">
              {index + 1}0
            </text>
          </g>
        ))}
        {[72, 132, 192, 252, 312, 372].map((x) => (
          <path key={x} d={`M${x} 58 V254`} stroke="rgba(255,255,255,.045)" />
        ))}

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
        >
          {[0, 1, 2, 3].map((band) => (
            <path
              key={band}
              d={`M62 ${92 + band * 34} C124 ${70 + band * 22} 196 ${118 + band * 9} 262 ${
                92 + band * 34
              } S344 ${78 + band * 38} 392 ${104 + band * 28}`}
              fill="none"
              stroke={band === 2 ? "rgba(110,183,255,.22)" : "rgba(255,255,255,.09)"}
              strokeDasharray={band === 2 ? "3 8" : "2 10"}
            />
          ))}
        </motion.g>

        {contourLayers.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill={index === 0 ? "rgba(110,183,255,.08)" : "none"}
            stroke={index === 1 ? "rgba(110,183,255,.56)" : "rgba(255,255,255,.18)"}
            strokeWidth={index === 1 ? "1.6" : "1"}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: index === 1 ? 1 : 0.72, scale: 1 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.46, delay: 0.14 + index * 0.09, ease: "easeOut" }}
            style={{ transformOrigin: "184px 184px" }}
          />
        ))}

        <motion.path
          d={passPath}
          fill="none"
          stroke="rgba(110,183,255,.14)"
          strokeLinecap="round"
          strokeWidth="14"
          initial={drawInitial}
          whileInView={{ pathLength: 1, opacity: 0.72 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.78, ease: "easeOut", delay: 0.08 }}
          className="transition-opacity duration-300 group-hover/nasa:opacity-100 group-focus/nasa:opacity-100"
        />
        <motion.path
          d={passPath}
          fill="none"
          stroke="url(#nasaPass)"
          strokeLinecap="round"
          strokeWidth="2.5"
          initial={drawInitial}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.86, ease: "easeOut", delay: 0.12 }}
          className="[stroke-width:2.5px] transition-[stroke-width,filter] duration-300 group-hover/nasa:[stroke-width:4px] group-hover/nasa:drop-shadow-[0_0_10px_rgba(110,183,255,0.32)] group-focus/nasa:[stroke-width:4px] group-focus/nasa:drop-shadow-[0_0_10px_rgba(110,183,255,0.32)]"
        />

        <g className="opacity-0 transition-opacity duration-300 group-hover/nasa:opacity-100 group-focus/nasa:opacity-100">
          {samplePoints.map(([cx, cy, label]) => (
            <g key={label}>
              <circle cx={cx} cy={cy} r="3.5" fill="var(--accent)" />
              <text x={Number(cx) + 7} y={Number(cy) + 3} fill="rgba(255,255,255,.58)" fontSize="8" fontFamily="monospace">
                {label}
              </text>
            </g>
          ))}
        </g>

        <g className={`transition-transform duration-300 ${markerMotion}`}>
          <path d="M248 70 V244" stroke="rgba(255,255,255,.4)" strokeDasharray="4 7" />
          <rect x="222" y="60" width="52" height="18" rx="3" fill="#101722" stroke="rgba(255,255,255,.12)" />
          <text x="235" y="72" fill="var(--accent)" fontSize="9" fontFamily="monospace">
            t+04
          </text>
        </g>
      </svg>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-[color:var(--muted)] sm:text-[0.58rem] sm:tracking-[0.12em]">
        {["GRACE", "anomaly", "pass 17"].map((label, index) => (
          <span key={label} className="rounded-[3px] border border-white/[0.08] bg-white/[0.025] px-2 py-1.5">
            <span className={index === 1 ? "text-[color:var(--accent)]" : ""}>{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
