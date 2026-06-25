"use client";

import { useRef } from "react";
import type { RefObject } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { MotionStyle, MotionValue } from "motion/react";
import { projectNumbers } from "@/components/project-module";
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

const dockPositions = [
  { x: "20vw", y: "-24vh" },
  { x: "34vw", y: "-24vh" },
  { x: "20vw", y: "-7vh" },
  { x: "34vw", y: "-7vh" },
  { x: "20vw", y: "10vh" },
  { x: "34vw", y: "10vh" },
  { x: "16vw", y: "-15vh" },
  { x: "38vw", y: "-15vh" },
  { x: "16vw", y: "2vh" },
  { x: "38vw", y: "2vh" },
  { x: "16vw", y: "19vh" },
  { x: "38vw", y: "19vh" },
];

export function AssemblyHero({ content }: Props) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <StaticAssemblyHero content={content} />;
  }

  return <AnimatedAssemblyHero content={content} />;
}

function AnimatedAssemblyHero({ content }: Props) {
  const assemblyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: assemblyRef,
    offset: ["start start", "end start"],
  });
  const fragmentProgress = useSpring(scrollYProgress, { stiffness: 88, damping: 25, mass: 0.35 });
  const panelProgress = useSpring(scrollYProgress, { stiffness: 150, damping: 28, mass: 0.24 });
  const titleOpacity = useTransform(panelProgress, [0, 0.08], [0.94, 1]);
  const titleY = useTransform(panelProgress, [0, 0.14], [6, 0]);
  const dashboardOpacity = useTransform(panelProgress, [0.12, 0.34], [0.04, 1]);
  const dashboardY = useTransform(panelProgress, [0.12, 0.36], [34, 0]);
  const scanlineOpacity = useTransform(panelProgress, [0.2, 0.42, 0.56], [0, 0.42, 0]);
  const scanlineY = useTransform(panelProgress, [0.2, 0.56], ["0%", "100%"]);

  return (
    <HeroShell assemblyRef={assemblyRef}>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {content.fragments.map((fragment, index) => (
          <SystemFragment
            key={fragment}
            text={fragment}
            index={index}
            progress={fragmentProgress}
          />
        ))}
      </div>

      <HeroContent
        content={content}
        titleStyle={{ opacity: titleOpacity, y: titleY }}
        dashboardStyle={{ opacity: dashboardOpacity, y: dashboardY }}
        scanlineStyle={{ opacity: scanlineOpacity, y: scanlineY }}
      />
    </HeroShell>
  );
}

function StaticAssemblyHero({ content }: Props) {
  const assemblyRef = useRef<HTMLDivElement>(null);

  return (
    <HeroShell assemblyRef={assemblyRef}>
      <div className="pointer-events-none absolute inset-0 hidden items-center justify-center sm:flex">
        {content.fragments.slice(0, 6).map((fragment, index) => (
          <div
            key={fragment}
            aria-hidden="true"
            className="absolute rounded-[4px] border border-white/[0.1] bg-[#0c1118]/80 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-slate-300"
            style={{
              transform: `translate(${dockPositions[index].x}, ${dockPositions[index].y})`,
            }}
          >
            {fragment}
          </div>
        ))}
      </div>
      <HeroContent content={content} />
    </HeroShell>
  );
}

function HeroShell({
  children,
  assemblyRef,
}: {
  children: React.ReactNode;
  assemblyRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section
      ref={assemblyRef}
      aria-labelledby="intro-title"
      className="relative min-h-[145vh] overflow-hidden px-5 sm:min-h-[165vh] sm:px-8 lg:px-12"
    >
      <div className="sticky top-0 mx-auto flex min-h-screen max-w-7xl flex-col justify-center py-14 sm:py-16">
        <div className="absolute left-5 top-6 z-20 flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.26em] text-[color:var(--muted)] sm:left-8 lg:left-12">
          <span className="h-px w-10 bg-[color:var(--accent)]" />
          Ishaan Kejriwal / Field Notes
        </div>

        <div className="relative min-h-[76vh] sm:min-h-[72vh]">{children}</div>
      </div>
    </section>
  );
}

function HeroContent({
  content,
  titleStyle,
  dashboardStyle,
  scanlineStyle,
}: Props & {
  titleStyle?: MotionStyle;
  dashboardStyle?: MotionStyle;
  scanlineStyle?: MotionStyle;
}) {
  return (
    <div className="relative z-10 grid min-h-[76vh] items-center gap-8 sm:min-h-[72vh] lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
      <div className="max-w-2xl">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
          {content.introLine}
        </p>
        <motion.h1
          id="intro-title"
          style={titleStyle}
          className="text-balance text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl"
        >
          {content.name}
        </motion.h1>
        <motion.p
          style={titleStyle}
          className="mt-7 max-w-xl text-base leading-8 text-[color:var(--muted)] sm:text-lg"
        >
          {content.position}
        </motion.p>
      </div>

      <motion.nav
        style={dashboardStyle}
        className="instrument-panel relative overflow-hidden rounded-[6px] p-3"
        aria-label="Assembled project navigation"
      >
        {scanlineStyle ? (
          <motion.span
            aria-hidden="true"
            style={scanlineStyle}
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[rgba(110,183,255,0.2)] to-transparent"
          />
        ) : null}
        <div className="grid grid-cols-2 gap-2">
          {content.projects.map((project) => (
            <motion.a
              key={project.name}
              href={`#${project.kind}`}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="group min-h-28 rounded-[4px] border border-white/[0.07] bg-white/[0.025] p-3 transition-colors duration-200 hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] sm:min-h-36 sm:p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[color:var(--muted)] sm:mb-6 sm:text-[0.68rem] sm:tracking-[0.2em]">
                <span>{projectNumbers[project.kind]}</span>
                <span className="hidden text-[color:var(--accent)] opacity-70 transition-opacity group-hover:opacity-100 sm:inline">
                  {project.metric}
                </span>
              </div>
              <h2 className="text-base font-medium tracking-[-0.03em] text-white sm:text-xl">
                {project.name}
              </h2>
              <p className="mt-2 text-xs leading-5 text-[color:var(--muted)] sm:mt-3 sm:text-sm sm:leading-6">
                {project.artifact}
              </p>
            </motion.a>
          ))}
        </div>
      </motion.nav>
    </div>
  );
}

function SystemFragment({
  text,
  index,
  progress,
}: {
  text: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const position = fragmentPositions[index % fragmentPositions.length];
  const dock = dockPositions[index % dockPositions.length];
  const x = useTransform(progress, [0, 0.5], [position.x, dock.x]);
  const y = useTransform(progress, [0, 0.5], [position.y, dock.y]);
  const rotate = useTransform(progress, [0, 0.5], [position.r, 0]);
  const opacity = useTransform(progress, [0, 0.16, 0.5, 0.7], [0.42, 0.82, 0.34, 0.08]);
  const scale = useTransform(progress, [0, 0.5], [1, 0.74]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y, rotate, opacity, scale }}
      className={`absolute rounded-[4px] border border-white/[0.12] bg-[#0c1118]/90 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-slate-300 shadow-lg shadow-black/20 sm:text-xs ${
        index > 3 ? "hidden sm:block" : ""
      }`}
    >
      {text}
    </motion.div>
  );
}
