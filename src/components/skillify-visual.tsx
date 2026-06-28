"use client";

import { motion, useReducedMotion } from "motion/react";

const profileSignals = ["skills", "proof", "availability"];
const matchRows = ["constraint", "fit", "readiness"];
const applyRows = ["draft", "review", "queue"];

export function SkillifyVisual() {
  const reduceMotion = useReducedMotion();
  const connectorMotion = reduceMotion ? "" : "group-hover/skillify:opacity-100 group-focus/skillify:opacity-100";
  const railMotion = reduceMotion ? "" : "group-hover/skillify:w-[76%] group-focus/skillify:w-[76%]";

  return (
    <div
      className="group/skillify relative h-full min-h-64 overflow-hidden rounded-[4px] border border-white/[0.06] bg-[#070b11] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
      role="img"
      aria-label="Startup marketplace operating flow normalizing profile signals, matching opportunities, and routing applications"
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(170,190,215,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(170,190,215,0.045)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="pointer-events-none absolute inset-x-3 top-4 flex items-center justify-between gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[color:var(--muted)] sm:inset-x-4">
        <span>Marketplace flow</span>
        <span className="shrink-0 text-[color:var(--accent)]">fit 0.76</span>
      </div>

      <div className="relative grid h-full min-h-[36rem] auto-rows-fr grid-cols-1 gap-2 p-3 pt-14 min-[520px]:min-h-64 min-[520px]:grid-cols-3 min-[520px]:gap-3 min-[520px]:p-4 min-[520px]:pt-14">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 420 300" aria-hidden="true">
          <path
            d="M118 116 C156 104 172 104 208 112"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.4"
            className={`opacity-20 transition-opacity duration-300 ${connectorMotion}`}
          />
          <path
            d="M118 166 C162 168 174 156 208 150"
            fill="none"
            stroke="rgba(255,255,255,.34)"
            strokeWidth="1.2"
            className={`opacity-10 transition-opacity delay-75 duration-300 ${connectorMotion}`}
          />
          <path
            d="M280 150 C318 152 332 166 366 180"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.4"
            className={`opacity-20 transition-opacity delay-100 duration-300 ${connectorMotion}`}
          />
        </svg>

        <motion.div
          className="relative z-10 min-w-0 rounded-[4px] border border-white/[0.08] bg-white/[0.025] p-3"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.36, ease: "easeOut" }}
        >
          <PanelTitle label="profile" />
          <div className="space-y-3">
            {profileSignals.map((signal, index) => (
              <SignalRow key={signal} label={signal} active={index === 1} width={58 + index * 12} />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative z-10 min-w-0 rounded-[4px] border border-white/[0.1] bg-[#101722] p-3 shadow-2xl shadow-black/20"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.36, delay: 0.1, ease: "easeOut" }}
        >
          <PanelTitle label="match" />
          <div className="space-y-3">
            {matchRows.map((row, index) => (
              <SignalRow key={row} label={row} active={index === 1} width={index === 1 ? 76 : 48 + index * 10} checked={index > 0} />
            ))}
          </div>
          <div className="mt-5">
            <div className="mb-1 flex justify-between font-mono text-[0.52rem] uppercase tracking-[0.12em] text-[color:var(--muted)]">
              <span>fit score</span>
              <span>76</span>
            </div>
            <span className="block h-1 rounded-full bg-white/[0.08]">
              <span className={`block h-1 w-[44%] rounded-full bg-[color:var(--accent)] transition-[width] duration-300 ${railMotion}`} />
            </span>
          </div>
        </motion.div>

        <motion.div
          className="relative z-10 min-w-0 rounded-[4px] border border-white/[0.08] bg-white/[0.025] p-3"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.36, delay: 0.2, ease: "easeOut" }}
        >
          <PanelTitle label="apply" />
          <div className="space-y-3">
            {applyRows.map((row, index) => (
              <SignalRow key={row} label={row} active={index === 2} width={50 + index * 11} checked={index < 2} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PanelTitle({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center justify-between font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[color:var(--muted)]">
      <span>{label}</span>
      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
    </div>
  );
}

function SignalRow({
  label,
  active,
  width,
  checked = false,
}: {
  label: string;
  active: boolean;
  width: number;
  checked?: boolean;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 font-mono text-[0.55rem] uppercase tracking-[0.08em] text-slate-300">
        <span className={`min-w-0 truncate ${active ? "text-[color:var(--accent)]" : ""}`}>{label}</span>
        <span className={`shrink-0 tabular-nums ${checked ? "text-[color:var(--accent)]" : "text-white/30"}`}>{checked ? "ok" : "--"}</span>
      </div>
      <span className="block h-1 rounded-full bg-white/[0.08]">
        <span className="block h-1 rounded-full bg-white/25" style={{ width: `${width}%` }} />
      </span>
    </div>
  );
}
