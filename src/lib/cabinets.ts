export type Palette = { bg: string; ink: string; accent: string; dim: string };

export const palettes = {
  intro: { bg: "#f6f4ee", ink: "#0e0e0e", accent: "#ff6a45", dim: "rgba(14,14,14,0.3)" },
  neuro: { bg: "#16c99a", ink: "#07201a", accent: "#ffd836", dim: "rgba(7,32,26,0.3)" },
  grace: { bg: "#0d2c70", ink: "#eef3ff", accent: "#ff6a45", dim: "rgba(238,243,255,0.28)" },
  bio: { bg: "#0f0f0f", ink: "#f2f2f2", accent: "#c9ff3d", dim: "rgba(242,242,242,0.25)" },
  chai: { bg: "#f3ede2", ink: "#141210", accent: "#d8261f", dim: "rgba(20,18,16,0.3)" },
  contact: { bg: "#0e0e0e", ink: "#f6f4ee", accent: "#ff6a45", dim: "rgba(246,244,238,0.3)" },
} satisfies Record<string, Palette>;

export const levels = [
  { id: "neurocore", label: "NeuroCore", palette: palettes.neuro },
  { id: "grace", label: "GRACE", palette: palettes.grace },
  { id: "chai", label: "CHAI", palette: palettes.chai },
  { id: "biodock", label: "BioDock", palette: palettes.bio },
];
