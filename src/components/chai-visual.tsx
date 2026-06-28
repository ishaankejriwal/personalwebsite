"use client";

import { motion, useReducedMotion } from "motion/react";

const metricRows = [
  ["ground", "92"],
  ["uncert.", "81"],
  ["handoff", "74"],
  ["evid.", "88"],
];

export function ChaiVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="group/chai relative h-full min-h-64 overflow-hidden rounded-[4px] border border-white/[0.06] bg-[#070b11] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
      role="img"
      aria-label="Healthcare AI evaluation framework grid and notebook layers"
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(170,190,215,0.048)_1px,transparent_1px),linear-gradient(90deg,rgba(170,190,215,0.048)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
        <span>Eval framework</span>
        <span className="text-[color:var(--accent)]">RAI metrics</span>
      </div>

      <div className="relative grid h-full min-h-64 grid-cols-[1.05fr_0.95fr] gap-4 p-5 pb-20 pt-14">
        <div className="grid grid-cols-4 grid-rows-5 gap-2">
          {Array.from({ length: 20 }).map((_, index) => {
            const highlighted = [2, 5, 6, 11, 13, 18].includes(index);

            return (
              <motion.span
                key={index}
                className={`rounded-[3px] border ${
                  highlighted
                    ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]"
                    : "border-white/[0.08] bg-white/[0.03]"
                }`}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{ duration: 0.28, delay: index * 0.018 }}
              >
                <span className="sr-only">
                  {highlighted ? "Selected evaluation metric" : "Evaluation grid cell"}
                </span>
              </motion.span>
            );
          })}
        </div>

        <div className="relative min-w-0">
          {[0, 1, 2].map((layer) => (
            <motion.div
              key={layer}
              className="absolute right-0 w-[88%] rounded-[4px] border border-white/[0.1] bg-[#101722] p-3 shadow-2xl shadow-black/20"
              style={{ top: `${layer * 15}%`, height: "48%" }}
              initial={reduceMotion ? false : { opacity: 0, x: 18, y: 8 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 0.4, delay: 0.12 + layer * 0.08, ease: "easeOut" }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                <span className="h-px w-12 bg-white/[0.12]" />
              </div>
              <div className="space-y-2">
                {[0, 1, 2].map((line) => (
                  <span
                    key={line}
                    className="block h-1 rounded-full bg-white/[0.12]"
                    style={{ width: `${82 - line * 18}%` }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-[color:var(--muted)] sm:text-[0.58rem] sm:tracking-[0.13em]"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{ duration: 0.36, delay: 0.36 }}
      >
        {metricRows.map(([label, score], index) => (
          <div
            key={label}
            className="rounded-[3px] border border-white/[0.08] bg-black/20 px-2 py-1.5 transition-colors duration-300 group-hover/chai:border-white/[0.16] group-focus/chai:border-white/[0.16]"
          >
            <span className={index === 1 ? "text-[color:var(--accent)]" : ""}>{label}</span>
            <span className="mt-1 block text-white/75">{score}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
