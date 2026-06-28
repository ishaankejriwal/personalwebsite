"use client";

import { motion, useReducedMotion } from "motion/react";

const columns = ["input", "model", "eval", "ship"];
const lanes = [
  ["messy csv", "rerank", "bias", "note"],
  ["support log", "extract", "ground", "ready"],
  ["sensor dump", "forecast", "drift", "patch"],
];

export function AppliedAiVisual() {
  const reduceMotion = useReducedMotion();
  const activeMotion = reduceMotion
    ? ""
    : "group-hover/applied:border-[color:var(--accent)] group-hover/applied:bg-[color:var(--accent-soft)] group-focus/applied:border-[color:var(--accent)] group-focus/applied:bg-[color:var(--accent-soft)]";
  const checkMotion = reduceMotion
    ? ""
    : "group-hover/applied:bg-[color:var(--accent)] group-focus/applied:bg-[color:var(--accent)]";

  return (
    <div
      className="group/applied relative h-full min-h-64 overflow-hidden rounded-[4px] border border-white/[0.06] bg-[#070b11] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
      role="img"
      aria-label="Applied AI workbench where messy inputs, model constraints, evaluation checks, and shipping notes form a tested prototype grid"
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(170,190,215,0.048)_1px,transparent_1px),linear-gradient(90deg,rgba(170,190,215,0.048)_1px,transparent_1px)] bg-[size:30px_30px]" />
      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
        <span>AI workbench</span>
        <span className="text-[color:var(--accent)]">checks on</span>
      </div>

      <div className="relative grid h-full min-h-64 content-center gap-2 p-4 pb-20 pt-14">
        <motion.div
          className="grid grid-cols-4 gap-2 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[color:var(--muted)]"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {columns.map((column) => (
            <span key={column} className="px-2">
              {column}
            </span>
          ))}
        </motion.div>

        {lanes.map((lane, laneIndex) => (
          <motion.div
            key={lane.join("-")}
            className={`grid grid-cols-4 gap-2 rounded-[4px] border border-white/[0.08] bg-white/[0.025] p-2 transition-colors duration-300 ${
              laneIndex === 1 ? activeMotion : ""
            }`}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.34, delay: 0.08 + laneIndex * 0.08, ease: "easeOut" }}
          >
            {lane.map((cell, cellIndex) => (
              <div
                key={cell}
                className="min-w-0 rounded-[3px] border border-white/[0.07] bg-black/20 px-2 py-2"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-[0.55rem] uppercase tracking-[0.09em] text-slate-300">
                    {cell}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      laneIndex === 1 && cellIndex > 0 ? checkMotion : "bg-white/20"
                    } transition-colors duration-300`}
                  />
                </div>
                <span className="block h-1 rounded-full bg-white/[0.08]">
                  <span
                    className={`block h-1 rounded-full ${
                      laneIndex === 1 && cellIndex > 0 ? "bg-[color:var(--accent)]" : "bg-white/25"
                    }`}
                    style={{ width: `${42 + cellIndex * 12 + laneIndex * 4}%` }}
                  />
                </span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-[color:var(--muted)] sm:text-[0.58rem]"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{ duration: 0.34, delay: 0.34, ease: "easeOut" }}
      >
        {["schema", "eval ok", "ship note"].map((label, index) => (
          <span
            key={label}
            className={`rounded-[3px] border border-white/[0.08] bg-black/20 px-2 py-1.5 transition-colors duration-300 ${
              index === 1 ? "group-hover/applied:border-[color:var(--accent)] group-focus/applied:border-[color:var(--accent)]" : ""
            }`}
          >
            <span className={index === 1 ? "text-[color:var(--accent)]" : ""}>{label}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
