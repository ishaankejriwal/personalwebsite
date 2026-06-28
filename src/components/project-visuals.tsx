import { AppliedAiVisual } from "@/components/applied-ai-visual";
import { BioDockVisual } from "@/components/biodock-visual";
import { ChaiVisual as ChaiFrameworkVisual } from "@/components/chai-visual";
import { NasaVisual } from "@/components/nasa-visual";
import { NeuroCoreVisual } from "@/components/neurocore-visual";
import { SkillifyVisual } from "@/components/skillify-visual";
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
      return <AppliedAiVisual />;
  }
}

function NeuroVisual() {
  return <NeuroCoreVisual />;
}

function BioVisual() {
  return <BioDockVisual />;
}

function ChaiVisual() {
  return <ChaiFrameworkVisual />;
}
