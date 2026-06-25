import { BioDockVisual } from "@/components/biodock-visual";
import { NeuroCoreVisual } from "@/components/neurocore-visual";
import type { ProjectKind } from "@/lib/site-content";

export function ProjectVisual({ kind }: { kind: ProjectKind }) {
  switch (kind) {
    case "neuro":
      return <NeuroVisual />;
    case "bio":
      return <BioVisual />;
    case "chai":
      return <ChaiVisual />;
    case "nasa":
      return <NasaVisual />;
    case "skillify":
      return <SkillifyVisual />;
    case "experiments":
      return <ExperimentsVisual />;
  }
}

function NeuroVisual() {
  return <NeuroCoreVisual />;
}

function BioVisual() {
  return <BioDockVisual />;
}

function ChaiVisual() {
  return (
    <div
      className="grid h-full grid-cols-[1fr_0.78fr] gap-4"
      role="img"
      aria-label="Healthcare AI evaluation matrix"
    >
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
      <div className="relative min-w-0">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="absolute h-[45%] w-[70%] max-w-32 rounded-[4px] border border-white/[0.12] bg-[#141b25]"
            style={{ left: `${item * 13}%`, top: `${item * 18}%` }}
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
    <div
      className="flex h-full items-center justify-center"
      role="img"
      aria-label="Marketplace application flow"
    >
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
    <div
      className="grid h-full content-center gap-3"
      role="img"
      aria-label="Applied AI prototype queue"
    >
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
