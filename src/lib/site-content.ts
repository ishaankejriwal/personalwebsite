export type ProjectKind = "neuro" | "bio" | "chai" | "nasa" | "skillify" | "experiments";

export type Project = {
  kind: ProjectKind;
  name: string;
  label: string;
  summary: string;
  artifact: string;
  detail: string;
  metric: string;
};

export type ResearchNote = {
  date: string;
  title: string;
  summary: string;
  tag: string;
};

export const siteContent = {
  introLine: "Start with the trace.",
  name: "Ishaan Kejriwal",
  position:
    "I build at the messy edge where models meet real evidence: sensor traces, clinical evals, docking runs, climate data, and products people use in practice.",
  fragments: [
    "IMU drift: 2.4 deg",
    "ligand pose / score stack",
    "CHAI eval rubric",
    "GRACE water anomaly",
    "brace orientation trace",
    "application flow",
    "clinical AI failure mode",
    "prototype note 04",
    "calibration window",
    "paper margin: test again",
    "market signal",
    "model comparison grid",
  ],
  projects: [
    {
      kind: "neuro",
      name: "NeuroCore",
      label: "Hardware / rehabilitation",
      summary: "A sensor-backed brace project for reading movement clearly enough to make rehab feedback less vague.",
      artifact: "IMU trace + orientation calibration",
      detail: "Hardware shaped around the signal in front of it, not abstract wellness language.",
      metric: "motion signal",
    },
    {
      kind: "bio",
      name: "BioDock AI",
      label: "Bio AI / docking",
      summary: "A docking workflow for comparing ligand poses, scores, and fit while keeping the judgment visible.",
      artifact: "ligand pose + score layers",
      detail: "Interface patterns for moving from dense scientific output to a decision you can explain without hand-waving.",
      metric: "binding fit",
    },
    {
      kind: "chai",
      name: "CHAI",
      label: "Healthcare AI evaluation",
      summary: "Healthcare AI evaluation work that tracks what models miss, overstate, or cannot justify in clinical documents.",
      artifact: "rubric grid + document stack",
      detail: "A practical way to test whether an AI system belongs in clinical context instead of only checking whether it sounds right.",
      metric: "eval matrix",
    },
    {
      kind: "nasa",
      name: "NASA SEES / GRACE",
      label: "Climate research",
      summary: "Research using satellite observations to study how water mass changes over time.",
      artifact: "orbit path + anomaly field",
      detail: "Remote-sensing work built from evidence, contour, and motion instead of a static result.",
      metric: "water anomaly",
    },
    {
      kind: "skillify",
      name: "Skillify",
      label: "Startup system",
      summary: "A marketplace experiment for helping people find and act on better-fit opportunities.",
      artifact: "pipeline map",
      detail: "A product system built around matching, momentum, and the small decisions that keep the flow from falling apart.",
      metric: "conversion path",
    },
    {
      kind: "experiments",
      name: "Applied AI Projects",
      label: "GTRI / experiments",
      summary: "Applied AI prototypes built to see whether an idea survives messy inputs and real users.",
      artifact: "prototype queue",
      detail: "A working bench for experiments that need to be useful before they look finished.",
      metric: "active tests",
    },
  ] satisfies Project[],
  notes: [
    {
      date: "2026",
      title: "Evaluation before interface polish",
      summary: "AI interfaces should show what got tested, not only the answer that sounded clean.",
      tag: "AI eval",
    },
    {
      date: "2026",
      title: "Hardware needs honest traces",
      summary: "A trace with drift is more useful than a perfect-looking diagram that hides uncertainty.",
      tag: "sensors",
    },
    {
      date: "2025",
      title: "Research artifacts as navigation",
      summary: "Project pages get better when the evidence helps you move through them.",
      tag: "design",
    },
  ] satisfies ResearchNote[],
};

export type SiteContent = typeof siteContent;
