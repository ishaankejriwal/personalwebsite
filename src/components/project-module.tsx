import { ProjectVisual } from "@/components/project-visuals";
import type { Project, ProjectKind } from "@/lib/site-content";

export const projectNumbers: Record<ProjectKind, string> = {
  neuro: "01",
  bio: "02",
  chai: "03",
  nasa: "04",
  skillify: "05",
  experiments: "06",
};

export function ProjectModule({ project }: { project: Project }) {
  return (
    <article
      id={project.kind}
      className="instrument-panel grid min-h-[28rem] overflow-hidden rounded-[6px] lg:grid-cols-[0.94fr_1.06fr]"
    >
      <div className="flex flex-col justify-between p-6 sm:p-8">
        <div>
          <div className="flex items-center justify-between gap-6 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[color:var(--muted)]">
            <span>{project.label}</span>
            <span className="text-[color:var(--accent)]">{projectNumbers[project.kind]}</span>
          </div>
          <h3 className="mt-8 text-4xl font-semibold tracking-[-0.045em] text-white">
            {project.name}
          </h3>
          <p className="mt-5 text-lg leading-8 text-slate-300">{project.summary}</p>
        </div>
        <p className="mt-10 max-w-md leading-7 text-[color:var(--muted)]">{project.detail}</p>
      </div>
      <div className="relative min-h-72 border-t border-white/[0.08] bg-black/10 p-5 lg:border-l lg:border-t-0">
        <ProjectVisual kind={project.kind} />
      </div>
    </article>
  );
}
