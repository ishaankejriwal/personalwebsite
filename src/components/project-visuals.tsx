import type { ReactNode } from "react";
import type { ProjectKind } from "@/lib/site-content";

export function ProjectVisual({ kind }: { kind: ProjectKind }) {
  const visuals: Record<ProjectKind, ReactNode> = {
    neuro: <NeuroVisual />,
    bio: <BioVisual />,
    chai: <ChaiVisual />,
    nasa: <NasaVisual />,
    skillify: <SkillifyVisual />,
    experiments: <ExperimentsVisual />,
  };

  return visuals[kind];
}

function NeuroVisual() {
  return (
    <svg viewBox="0 0 420 300" className="h-full w-full" role="img" aria-label="IMU signal trace">
      <path
        d="M52 230 C100 110 132 240 180 120 S270 70 330 170 392 136 402 92"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
      />
      <path d="M72 70 h110 v110 h-110z" fill="none" stroke="rgba(255,255,255,.24)" />
      <path d="M238 86 l72 34 -34 72 -72 -34z" fill="none" stroke="rgba(255,255,255,.34)" />
      {[70, 120, 170, 220, 270, 320].map((x) => (
        <path key={x} d={`M${x} 42 V258`} stroke="rgba(255,255,255,.07)" />
      ))}
    </svg>
  );
}

function BioVisual() {
  return (
    <svg viewBox="0 0 420 300" className="h-full w-full" role="img" aria-label="Molecular docking layers">
      <path
        d="M86 156 C118 70 206 58 258 108 S332 158 364 84"
        fill="none"
        stroke="rgba(255,255,255,.22)"
        strokeLinecap="round"
        strokeWidth="18"
      />
      <path
        d="M116 188 C156 126 236 120 300 176"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
      />
      {[
        [128, 182],
        [166, 145],
        [214, 139],
        [258, 158],
        [302, 176],
      ].map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="9"
          fill="rgba(110,183,255,.18)"
          stroke="var(--accent)"
        />
      ))}
      <path d="M54 238 h300" stroke="rgba(255,255,255,.12)" />
      <path d="M54 238 h210" stroke="var(--accent)" strokeWidth="5" />
    </svg>
  );
}

function ChaiVisual() {
  return (
    <div className="grid h-full grid-cols-[1fr_0.78fr] gap-4" aria-label="Healthcare AI evaluation matrix">
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="rounded-[3px] border border-white/[0.08]"
            style={{
              background: index % 5 === 0 ? "var(--accent-soft)" : "rgba(255,255,255,.035)",
            }}
          />
        ))}
      </div>
      <div className="relative">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="absolute h-40 w-32 rounded-[4px] border border-white/[0.12] bg-[#141b25]"
            style={{ left: item * 24, top: item * 34 }}
          />
        ))}
      </div>
    </div>
  );
}

function NasaVisual() {
  return (
    <svg viewBox="0 0 420 300" className="h-full w-full" role="img" aria-label="Orbit path and water anomaly field">
      <ellipse cx="210" cy="150" rx="138" ry="74" fill="none" stroke="rgba(255,255,255,.18)" />
      <path
        d="M40 190 C110 104 170 246 246 142 S356 94 392 162"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
      />
      <path
        d="M112 180 C132 124 190 118 226 154 S304 194 334 132"
        fill="none"
        stroke="rgba(255,255,255,.16)"
      />
      <path d="M142 206 C172 170 230 184 258 218" fill="none" stroke="rgba(255,255,255,.12)" />
      <circle cx="286" cy="125" r="8" fill="var(--accent)" />
    </svg>
  );
}

function SkillifyVisual() {
  return (
    <div className="flex h-full items-center justify-center" aria-label="Marketplace application flow">
      <div className="grid w-full max-w-md grid-cols-3 items-center gap-4">
        {["profile", "match", "apply"].map((label, index) => (
          <div
            key={label}
            className="relative rounded-[4px] border border-white/[0.1] bg-white/[0.035] p-4 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-300"
          >
            {label}
            {index < 2 ? (
              <span className="absolute -right-5 top-1/2 h-px w-6 bg-[color:var(--accent)]" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperimentsVisual() {
  return (
    <div className="grid h-full content-center gap-3" aria-label="Applied AI prototype queue">
      {["input audit", "model pass", "constraint test", "ship note"].map((item, index) => (
        <div
          key={item}
          className="grid grid-cols-[2rem_1fr_4rem] items-center gap-3 rounded-[4px] border border-white/[0.08] bg-white/[0.03] p-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-300"
        >
          <span className="text-[color:var(--accent)]">0{index + 1}</span>
          <span>{item}</span>
          <span className="h-1 rounded-full bg-[color:var(--accent-soft)]" />
        </div>
      ))}
    </div>
  );
}
