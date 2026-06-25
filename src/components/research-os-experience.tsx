"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import type { Project, ProjectKind, SiteContent } from "@/lib/site-content";

type Props = {
  content: SiteContent;
};

type FragmentProps = {
  text: string;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
};

const fragmentPositions = [
  { x: "-32vw", y: "-18vh", r: -7 },
  { x: "24vw", y: "-21vh", r: 5 },
  { x: "-18vw", y: "8vh", r: 4 },
  { x: "30vw", y: "9vh", r: -5 },
  { x: "-38vw", y: "25vh", r: 8 },
  { x: "10vw", y: "28vh", r: -3 },
  { x: "38vw", y: "-2vh", r: 6 },
  { x: "-4vw", y: "-31vh", r: -4 },
  { x: "-28vw", y: "-2vh", r: 3 },
  { x: "20vw", y: "22vh", r: 7 },
  { x: "-9vw", y: "20vh", r: -7 },
  { x: "4vw", y: "-8vh", r: 2 },
];

const projectAnchors: Record<ProjectKind, string> = {
  neuro: "01",
  bio: "02",
  chai: "03",
  nasa: "04",
  skillify: "05",
  experiments: "06",
};

export function ResearchOSExperience({ content }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.35 });
  const nameOpacity = useTransform(progress, [0.08, 0.22], [0, 1]);
  const nameY = useTransform(progress, [0.08, 0.24], [24, 0]);
  const dashboardOpacity = useTransform(progress, [0.28, 0.5], [0, 1]);
  const dashboardY = useTransform(progress, [0.28, 0.58], [64, 0]);

  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <div className="fine-grid pointer-events-none fixed inset-0 -z-10 opacity-70" />
      <section
        ref={ref}
        aria-labelledby="intro-title"
        className="relative min-h-[180vh] px-5 sm:px-8 lg:px-12"
      >
        <div className="sticky top-0 mx-auto flex min-h-screen max-w-7xl flex-col justify-center py-16">
          <div className="absolute left-5 top-6 z-20 flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.26em] text-[color:var(--muted)] sm:left-8 lg:left-12">
            <span className="h-px w-10 bg-[color:var(--accent)]" />
            Research Desk OS
          </div>

          <div className="relative min-h-[72vh]">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {content.fragments.map((fragment, index) => (
                <SystemFragment
                  key={fragment}
                  text={fragment}
                  index={index}
                  progress={progress}
                  reduced={Boolean(reduce)}
                />
              ))}
            </div>

            <div className="relative z-10 grid min-h-[72vh] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="max-w-2xl">
                <p className="mb-6 font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
                  {content.introLine}
                </p>
                <motion.h1
                  id="intro-title"
                  style={reduce ? undefined : { opacity: nameOpacity, y: nameY }}
                  className="text-balance text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl"
                >
                  {content.name}
                </motion.h1>
                <motion.p
                  style={reduce ? undefined : { opacity: nameOpacity, y: nameY }}
                  className="mt-7 max-w-xl text-base leading-8 text-[color:var(--muted)] sm:text-lg"
                >
                  {content.position}
                </motion.p>
              </div>

              <motion.div
                style={reduce ? undefined : { opacity: dashboardOpacity, y: dashboardY }}
                className="instrument-panel rounded-[6px] p-3"
                aria-label="Assembled project navigation"
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  {content.projects.map((project) => (
                    <a
                      key={project.name}
                      href={`#${project.kind}`}
                      className="group min-h-40 rounded-[4px] border border-white/[0.07] bg-white/[0.025] p-4 transition duration-200 hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                    >
                      <div className="mb-6 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        <span>{projectAnchors[project.kind]}</span>
                        <span>{project.metric}</span>
                      </div>
                      <h2 className="text-xl font-medium tracking-[-0.03em] text-white">
                        {project.name}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                        {project.artifact}
                      </p>
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="systems"
        aria-labelledby="systems-title"
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12"
      >
        <SectionHeader
          eyebrow="Running systems"
          title="Projects behave like instruments, not cards."
          description="Each module uses the project artifact as its interface: traces, matrices, score layers, orbit paths, and flows."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {content.projects.map((project) => (
            <ProjectModule key={project.name} project={project} />
          ))}
        </div>
      </section>

      <section
        id="notes"
        aria-labelledby="notes-title"
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12"
      >
        <SectionHeader
          eyebrow="Research log"
          title="Short notes from the workbench."
          description="Current thinking, implementation bias, and the small observations that shape larger systems."
        />
        <div className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {content.notes.map((note) => (
            <article
              key={note.title}
              className="grid gap-4 py-7 md:grid-cols-[9rem_1fr_8rem]"
            >
              <time className="font-mono text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                {note.date}
              </time>
              <div>
                <h3 className="text-2xl font-medium tracking-[-0.03em] text-white">
                  {note.title}
                </h3>
                <p className="mt-3 max-w-2xl leading-7 text-[color:var(--muted)]">
                  {note.summary}
                </p>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-[color:var(--accent)]">
                {note.tag}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section
        id="contact"
        aria-labelledby="contact-title"
        className="mx-auto max-w-7xl px-5 pb-28 pt-16 sm:px-8 lg:px-12"
      >
        <div className="instrument-panel grid gap-10 rounded-[6px] p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]">
              Contact
            </p>
            <h2
              id="contact-title"
              className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl"
            >
              Send the artifact, not the pitch.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <MagneticLink href="mailto:hello@example.com">Email</MagneticLink>
            <MagneticLink href="https://www.linkedin.com" external>
              LinkedIn
            </MagneticLink>
            <MagneticLink href="https://github.com" external>
              GitHub
            </MagneticLink>
          </div>
        </div>
      </section>
    </main>
  );
}

function SystemFragment({ text, index, progress, reduced }: FragmentProps) {
  const position = fragmentPositions[index % fragmentPositions.length];
  const x = useTransform(progress, [0, 0.48], [position.x, `${(index % 4) * 8 - 12}vw`]);
  const y = useTransform(progress, [0, 0.48], [position.y, `${Math.floor(index / 4) * 5 - 5}vh`]);
  const rotate = useTransform(progress, [0, 0.48], [position.r, 0]);
  const opacity = useTransform(progress, [0, 0.15, 0.58], [0.58, 0.95, 0.2]);
  const scale = useTransform(progress, [0, 0.48], [1, 0.82]);

  return (
    <motion.div
      aria-hidden="true"
      style={reduced ? undefined : { x, y, rotate, opacity, scale }}
      className="absolute rounded-[4px] border border-white/[0.12] bg-[#0c1118]/80 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-slate-300 shadow-2xl shadow-black/20 backdrop-blur-[2px] sm:text-xs"
    >
      {text}
    </motion.div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]">
        {eyebrow}
      </p>
      <h2
        id={eyebrow === "Running systems" ? "systems-title" : "notes-title"}
        className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-6xl"
      >
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--muted)]">
        {description}
      </p>
    </div>
  );
}

function ProjectModule({ project }: { project: Project }) {
  return (
    <article
      id={project.kind}
      className="instrument-panel group grid min-h-[28rem] overflow-hidden rounded-[6px] lg:grid-cols-[0.94fr_1.06fr]"
    >
      <div className="flex flex-col justify-between p-6 sm:p-8">
        <div>
          <div className="flex items-center justify-between gap-6 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[color:var(--muted)]">
            <span>{project.label}</span>
            <span className="text-[color:var(--accent)]">{projectAnchors[project.kind]}</span>
          </div>
          <h3 className="mt-8 text-4xl font-semibold tracking-[-0.045em] text-white">
            {project.name}
          </h3>
          <p className="mt-5 text-lg leading-8 text-slate-300">{project.summary}</p>
        </div>
        <p className="mt-10 max-w-md leading-7 text-[color:var(--muted)]">{project.detail}</p>
      </div>
      <div className="relative min-h-72 border-t border-white/[0.08] bg-black/10 p-5 lg:border-l lg:border-t-0">
        <ProjectVisual project={project} />
      </div>
    </article>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.kind === "neuro") return <NeuroVisual />;
  if (project.kind === "bio") return <BioVisual />;
  if (project.kind === "chai") return <ChaiVisual />;
  if (project.kind === "nasa") return <NasaVisual />;
  if (project.kind === "skillify") return <SkillifyVisual />;
  return <ExperimentsVisual />;
}

function NeuroVisual() {
  return (
    <svg viewBox="0 0 420 300" className="h-full w-full" role="img" aria-label="IMU signal trace">
      <path d="M52 230 C100 110 132 240 180 120 S270 70 330 170 392 136 402 92" fill="none" stroke="var(--accent)" strokeWidth="3" />
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
      <path d="M86 156 C118 70 206 58 258 108 S332 158 364 84" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="18" strokeLinecap="round" />
      <path d="M116 188 C156 126 236 120 300 176" fill="none" stroke="var(--accent)" strokeWidth="3" />
      {[[128, 182], [166, 145], [214, 139], [258, 158], [302, 176]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="9" fill="rgba(110,183,255,.18)" stroke="var(--accent)" />
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
      <path d="M40 190 C110 104 170 246 246 142 S356 94 392 162" fill="none" stroke="var(--accent)" strokeWidth="3" />
      <path d="M112 180 C132 124 190 118 226 154 S304 194 334 132" fill="none" stroke="rgba(255,255,255,.16)" />
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
          <div key={label} className="relative rounded-[4px] border border-white/[0.1] bg-white/[0.035] p-4 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-300">
            {label}
            {index < 2 ? <span className="absolute -right-5 top-1/2 h-px w-6 bg-[color:var(--accent)]" /> : null}
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
        <div key={item} className="grid grid-cols-[2rem_1fr_4rem] items-center gap-3 rounded-[4px] border border-white/[0.08] bg-white/[0.03] p-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-300">
          <span className="text-[color:var(--accent)]">0{index + 1}</span>
          <span>{item}</span>
          <span className="h-1 rounded-full bg-[color:var(--accent-soft)]" />
        </div>
      ))}
    </div>
  );
}

function MagneticLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      whileHover={{ y: -3 }}
      whileTap={{ y: 0 }}
      className="rounded-full border border-white/[0.12] px-5 py-3 text-sm font-medium text-white transition-colors hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
    >
      {children}
    </motion.a>
  );
}
