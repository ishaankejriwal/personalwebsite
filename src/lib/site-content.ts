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
  introLine: "Raw evidence. Built systems.",
  name: "Ishaan Kejriwal",
  position:
    "I build where models meet the physical world: sensor traces, healthcare evals, docking workflows, climate data, and products people can actually use.",
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
      summary: "A sensor-backed brace project for measuring motion clearly enough to guide rehabilitation feedback.",
      artifact: "IMU trace + orientation calibration",
      detail: "A hardware system shaped around measured movement, not abstract wellness claims.",
      metric: "motion signal",
    },
    {
      kind: "bio",
      name: "BioDock AI",
      label: "Bio AI / docking",
      summary: "A docking workflow for comparing ligand poses, scores, and fit without burying the decision in model output.",
      artifact: "ligand pose + score layers",
      detail: "Scientific interface patterns for turning dense model output into decisions.",
      metric: "binding fit",
    },
    {
      kind: "chai",
      name: "CHAI",
      label: "Healthcare AI evaluation",
      summary: "Healthcare AI evaluation work focused on what models miss, overstate, or fail to justify in clinical documents.",
      artifact: "rubric grid + document stack",
      detail: "A practical lens on whether AI systems behave reliably in clinical contexts.",
      metric: "eval matrix",
    },
    {
      kind: "nasa",
      name: "NASA SEES / GRACE",
      label: "Climate research",
      summary: "Research using satellite observations to reason about water-mass change.",
      artifact: "orbit path + anomaly field",
      detail: "Remote-sensing work presented as evidence, contour, and movement over time.",
      metric: "water anomaly",
    },
    {
      kind: "skillify",
      name: "Skillify",
      label: "Startup system",
      summary: "A marketplace experiment around helping people find, compare, and apply to better-fit opportunities.",
      artifact: "pipeline map",
      detail: "A product system framed around flow, matching, and practical user outcomes.",
      metric: "conversion path",
    },
    {
      kind: "experiments",
      name: "Applied AI Projects",
      label: "GTRI / experiments",
      summary: "Applied AI prototypes built to test whether an idea survives messy inputs, narrow time, and real users.",
      artifact: "prototype queue",
      detail: "The working bench for experiments that are useful before they are polished.",
      metric: "active tests",
    },
  ] satisfies Project[],
  notes: [
    {
      date: "2026",
      title: "Evaluation before interface polish",
      summary: "Interfaces for AI systems should expose what was tested, not just what looks fluent.",
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
      summary: "The best project pages can let evidence become the wayfinding system.",
      tag: "design",
    },
  ] satisfies ResearchNote[],
};

export type SiteContent = typeof siteContent;
