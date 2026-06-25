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
  introLine: "Loose signals. Working systems.",
  name: "Ishaan Kejriwal",
  position:
    "I build AI, hardware, research, and startup systems around measurable artifacts: traces, evals, prototypes, and field data.",
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
      summary: "Sensor-backed brace work for posture, motion, and feedback loops.",
      artifact: "IMU trace + orientation calibration",
      detail: "A hardware system shaped around measured movement, not abstract wellness claims.",
      metric: "motion signal",
    },
    {
      kind: "bio",
      name: "BioDock AI",
      label: "Bio AI / docking",
      summary: "A workflow for molecular docking exploration and ranked fit inspection.",
      artifact: "ligand pose + score layers",
      detail: "Scientific interface patterns for turning dense model output into decisions.",
      metric: "binding fit",
    },
    {
      kind: "chai",
      name: "CHAI",
      label: "Healthcare AI evaluation",
      summary: "Evaluation work around healthcare AI behavior, documents, and failure modes.",
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
      summary: "Marketplace and application-flow thinking for matching people to opportunity.",
      artifact: "pipeline map",
      detail: "A product system framed around flow, matching, and practical user outcomes.",
      metric: "conversion path",
    },
    {
      kind: "experiments",
      name: "Applied AI Projects",
      label: "GTRI / experiments",
      summary: "Small applied systems for testing AI against real constraints.",
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
