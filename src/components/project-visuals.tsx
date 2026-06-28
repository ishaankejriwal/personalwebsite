"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import type { ProjectKind } from "@/lib/site-content";

const visualComponents = {
  neuro: dynamic(() => import("@/components/neurocore-visual").then((mod) => mod.NeuroCoreVisual), {
    loading: VisualPlaceholder,
  }),
  bio: dynamic(() => import("@/components/biodock-visual").then((mod) => mod.BioDockVisual), {
    loading: VisualPlaceholder,
  }),
  chai: dynamic(() => import("@/components/chai-visual").then((mod) => mod.ChaiVisual), {
    loading: VisualPlaceholder,
  }),
  nasa: dynamic(() => import("@/components/nasa-visual").then((mod) => mod.NasaVisual), {
    loading: VisualPlaceholder,
  }),
  skillify: dynamic(() => import("@/components/skillify-visual").then((mod) => mod.SkillifyVisual), {
    loading: VisualPlaceholder,
  }),
  experiments: dynamic(
    () => import("@/components/applied-ai-visual").then((mod) => mod.AppliedAiVisual),
    {
      loading: VisualPlaceholder,
    },
  ),
} satisfies Record<ProjectKind, ComponentType>;

export function ProjectVisual({ kind }: { kind: ProjectKind }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      const timeout = setTimeout(() => setShouldLoad(true), 0);
      return () => clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "360px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const VisualComponent = visualComponents[kind];

  return (
    <div ref={containerRef} className="h-full min-h-64">
      {shouldLoad ? <VisualComponent /> : <VisualPlaceholder />}
    </div>
  );
}

function VisualPlaceholder() {
  return (
    <div
      className="relative h-full min-h-64 overflow-hidden rounded-[4px] border border-white/[0.06] bg-[#070b11]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(170,190,215,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(170,190,215,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
        <span className="h-2 w-24 rounded-full bg-white/[0.08]" />
        <span className="h-2 w-16 rounded-full bg-[color:var(--accent-soft)]" />
      </div>
      <div className="absolute inset-x-8 top-1/2 grid -translate-y-1/2 gap-3">
        <span className="h-2 rounded-full bg-white/[0.08]" />
        <span className="h-2 w-3/4 rounded-full bg-white/[0.05]" />
        <span className="h-2 w-1/2 rounded-full bg-white/[0.05]" />
      </div>
    </div>
  );
}
