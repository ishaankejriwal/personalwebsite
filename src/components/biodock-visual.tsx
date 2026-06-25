"use client";

import { motion, useReducedMotion } from "motion/react";

const pocketPath = "M72 168 C92 94 154 66 222 88 C274 104 306 153 362 96";
const ligandPath = "M122 202 C154 162 184 166 214 142 S276 112 318 152";
const nodes = [
  [122, 202],
  [164, 168],
  [214, 142],
  [264, 128],
  [318, 152],
];

export function BioDockVisual() {
  const reduceMotion = useReducedMotion();
  const lineInitial = reduceMotion ? false : { pathLength: 0, opacity: 0.28 };
  const lineVisible = { pathLength: 1, opacity: 1 };

  return (
    <div
      className="group/biodock relative h-full min-h-64 overflow-hidden rounded-[4px] border border-white/[0.06] bg-[#070b11] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
      role="img"
      aria-label="Abstract molecule docking layers and ligand fit"
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_32%_44%,rgba(110,183,255,0.1),transparent_18rem)]" />
      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
        <span>Docking layer stack</span>
        <span className="text-[color:var(--accent)]">pose 04 / fit 0.82</span>
      </div>

      <svg viewBox="0 0 420 300" className="relative h-full w-full">
        <defs>
          <linearGradient id="bioLigand" x1="118" x2="326" y1="204" y2="122">
            <stop stopColor="rgba(110,183,255,.28)" />
            <stop offset="0.62" stopColor="var(--accent)" />
            <stop offset="1" stopColor="rgba(255,255,255,.8)" />
          </linearGradient>
        </defs>

        {[84, 132, 180, 228].map((y) => (
          <path key={y} d={`M36 ${y} H386`} stroke="rgba(255,255,255,.045)" />
        ))}
        {[92, 164, 236, 308].map((x) => (
          <path key={x} d={`M${x} 54 V248`} stroke="rgba(255,255,255,.045)" />
        ))}

        <motion.path
          d={pocketPath}
          fill="none"
          stroke="rgba(255,255,255,.13)"
          strokeLinecap="round"
          strokeWidth="24"
          initial={lineInitial}
          whileInView={lineVisible}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.78, ease: "easeOut" }}
          className="transition-opacity duration-300 group-hover/biodock:opacity-80 group-focus/biodock:opacity-80"
        />
        <motion.path
          d={pocketPath}
          fill="none"
          stroke="rgba(255,255,255,.24)"
          strokeLinecap="round"
          strokeWidth="1.5"
          strokeDasharray="5 9"
          initial={lineInitial}
          whileInView={lineVisible}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.78, ease: "easeOut", delay: 0.04 }}
        />

        {[0, 1, 2].map((layer) => (
          <motion.path
            key={layer}
            d="M92 220 C142 188 204 190 256 164 S326 122 370 144"
            fill="none"
            stroke={layer === 1 ? "rgba(110,183,255,.34)" : "rgba(255,255,255,.1)"}
            strokeWidth={layer === 1 ? "2" : "1"}
            initial={reduceMotion ? false : { opacity: 0, y: 16 - layer * 8 }}
            whileInView={{ opacity: layer === 1 ? 1 : 0.72, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.52, delay: 0.15 + layer * 0.08, ease: "easeOut" }}
            style={{ transform: `translateY(${-layer * 18}px)` }}
          />
        ))}

        <motion.g
          initial={reduceMotion ? false : { x: -18, y: 16, opacity: 0.54 }}
          whileInView={{ x: 0, y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.72, ease: "easeOut", delay: 0.18 }}
          className="transition-transform duration-300 group-hover/biodock:translate-x-1 group-hover/biodock:-translate-y-1 group-focus/biodock:translate-x-1 group-focus/biodock:-translate-y-1"
        >
          <motion.path
            d={ligandPath}
            fill="none"
            stroke="url(#bioLigand)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            initial={lineInitial}
            whileInView={lineVisible}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.72, ease: "easeOut", delay: 0.24 }}
          />
          {nodes.map(([cx, cy], index) => (
            <motion.circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r={index === 2 ? "8" : "6"}
              fill="#0d141d"
              stroke={index === 2 ? "rgba(255,255,255,.82)" : "var(--accent)"}
              strokeWidth="2"
              initial={reduceMotion ? false : { scale: 0.55, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 0.28, delay: 0.34 + index * 0.06 }}
              className="origin-center transition-transform duration-300 group-hover/biodock:scale-110 group-focus/biodock:scale-110"
            />
          ))}
        </motion.g>

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.42, delay: 0.48, ease: "easeOut" }}
        >
          <path d="M58 246 H334" stroke="rgba(255,255,255,.11)" />
          <path d="M58 246 H252" stroke="var(--accent)" strokeWidth="4" />
          <path d="M252 238 V254" stroke="rgba(255,255,255,.5)" />
        </motion.g>
      </svg>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[color:var(--muted)]">
        {["pose rank", "fit map", "score delta"].map((label, index) => (
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
