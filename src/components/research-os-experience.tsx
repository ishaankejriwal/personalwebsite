"use client";

import { useRef } from "react";
import type { RefObject, ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { ProjectModule, projectNumbers } from "@/components/project-module";
import { SectionHeader } from "@/components/section-header";
import type { SiteContent } from "@/lib/site-content";

type Props = {
  content: SiteContent;
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

export function ResearchOSExperience({ content }: Props) {
  const assemblyRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: assemblyRef,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.35 });
  const nameOpacity = useTransform(progress, [0, 0.12], [0.86, 1]);
  const nameY = useTransform(progress, [0, 0.16], [8, 0]);
  const dashboardOpacity = useTransform(progress, [0.08, 0.28], [0.18, 1]);
  const dashboardY = useTransform(progress, [0.08, 0.34], [28, 0]);
  const revealStyle = reduceMotion ? undefined : { opacity: nameOpacity, y: nameY };
  const dashboardStyle = reduceMotion ? undefined : { opacity: dashboardOpacity, y: dashboardY };

  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <div className="fine-grid pointer-events-none fixed inset-0 -z-10 opacity-70" />
      <AssemblyHero
        content={content}
        progress={progress}
        reduceMotion={Boolean(reduceMotion)}
        revealStyle={revealStyle}
        dashboardStyle={dashboardStyle}
        assemblyRef={assemblyRef}
      />
      <RunningSystems content={content} />
      <ResearchLog content={content} />
      <ContactPanel />
    </main>
  );
}

function AssemblyHero({
  content,
  progress,
  reduceMotion,
  revealStyle,
  dashboardStyle,
  assemblyRef,
}: Props & {
  progress: MotionValue<number>;
  reduceMotion: boolean;
  revealStyle?: { opacity: MotionValue<number>; y: MotionValue<number> };
  dashboardStyle?: { opacity: MotionValue<number>; y: MotionValue<number> };
  assemblyRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section
      ref={assemblyRef}
      aria-labelledby="intro-title"
      className="relative min-h-[145vh] px-5 sm:min-h-[165vh] sm:px-8 lg:px-12"
    >
      <div className="sticky top-0 mx-auto flex min-h-screen max-w-7xl flex-col justify-center py-14 sm:py-16">
        <div className="absolute left-5 top-6 z-20 flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.26em] text-[color:var(--muted)] sm:left-8 lg:left-12">
          <span className="h-px w-10 bg-[color:var(--accent)]" />
          Research Desk OS
        </div>

        <div className="relative min-h-[76vh] sm:min-h-[72vh]">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {content.fragments.map((fragment, index) => (
              <SystemFragment
                key={fragment}
                text={fragment}
                index={index}
                progress={progress}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>

          <div className="relative z-10 grid min-h-[76vh] items-center gap-8 sm:min-h-[72vh] lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            <div className="max-w-2xl">
              <p className="mb-6 font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
                {content.introLine}
              </p>
              <motion.h1
                id="intro-title"
                style={revealStyle}
                className="text-balance text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl"
              >
                {content.name}
              </motion.h1>
              <motion.p
                style={revealStyle}
                className="mt-7 max-w-xl text-base leading-8 text-[color:var(--muted)] sm:text-lg"
              >
                {content.position}
              </motion.p>
            </div>

              <motion.nav
              style={dashboardStyle}
              className="instrument-panel rounded-[6px] p-3"
              aria-label="Assembled project navigation"
            >
              <div className="grid grid-cols-2 gap-2">
                {content.projects.map((project) => (
                  <a
                    key={project.name}
                    href={`#${project.kind}`}
                    className="min-h-28 rounded-[4px] border border-white/[0.07] bg-white/[0.025] p-3 transition duration-200 hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] sm:min-h-36 sm:p-4"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[color:var(--muted)] sm:mb-6 sm:text-[0.68rem] sm:tracking-[0.2em]">
                      <span>{projectNumbers[project.kind]}</span>
                      <span className="hidden sm:inline">{project.metric}</span>
                    </div>
                    <h2 className="text-base font-medium tracking-[-0.03em] text-white sm:text-xl">
                      {project.name}
                    </h2>
                    <p className="mt-2 text-xs leading-5 text-[color:var(--muted)] sm:mt-3 sm:text-sm sm:leading-6">
                      {project.artifact}
                    </p>
                  </a>
                ))}
              </div>
            </motion.nav>
          </div>
        </div>
      </div>
    </section>
  );
}

function SystemFragment({
  text,
  index,
  progress,
  reduceMotion,
}: {
  text: string;
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const position = fragmentPositions[index % fragmentPositions.length];
  const x = useTransform(progress, [0, 0.48], [position.x, `${(index % 4) * 8 - 12}vw`]);
  const y = useTransform(progress, [0, 0.48], [position.y, `${Math.floor(index / 4) * 5 - 5}vh`]);
  const rotate = useTransform(progress, [0, 0.48], [position.r, 0]);
  const opacity = useTransform(progress, [0, 0.15, 0.58], [0.44, 0.8, 0.16]);
  const scale = useTransform(progress, [0, 0.48], [1, 0.82]);

  return (
    <motion.div
      aria-hidden="true"
      style={reduceMotion ? undefined : { x, y, rotate, opacity, scale }}
      className={`absolute rounded-[4px] border border-white/[0.12] bg-[#0c1118]/90 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-slate-300 shadow-lg shadow-black/20 sm:text-xs ${
        index > 3 ? "hidden sm:block" : ""
      }`}
    >
      {text}
    </motion.div>
  );
}

function RunningSystems({ content }: Props) {
  return (
    <section
      id="systems"
      aria-labelledby="systems-title"
      className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12"
    >
      <SectionHeader
        id="systems-title"
        eyebrow="Running systems"
        title="Projects as working instruments."
        description="Each module uses the project artifact as its interface: traces, matrices, score layers, orbit paths, and flows."
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {content.projects.map((project) => (
          <ProjectModule key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}

function ResearchLog({ content }: Props) {
  return (
    <section
      id="notes"
      aria-labelledby="notes-title"
      className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12"
    >
      <SectionHeader
        id="notes-title"
        eyebrow="Research log"
        title="Short notes from the workbench."
        description="Current thinking, implementation bias, and the small observations that shape larger systems."
      />
      <div className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {content.notes.map((note) => (
          <article key={note.title} className="grid gap-4 py-7 md:grid-cols-[9rem_1fr_8rem]">
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
  );
}

function ContactPanel() {
  return (
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
            Send a signal worth building around.
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <ContactLink href="mailto:hello@example.com">Email</ContactLink>
          <ContactLink href="https://www.linkedin.com" external>
            LinkedIn
          </ContactLink>
          <ContactLink href="https://github.com" external>
            GitHub
          </ContactLink>
        </div>
      </div>
    </section>
  );
}

function ContactLink({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="rounded-full border border-white/[0.12] px-5 py-3 text-sm font-medium text-white transition-colors hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
    >
      {children}
    </a>
  );
}
