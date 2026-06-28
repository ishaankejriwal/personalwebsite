import type { ReactNode } from "react";
import { AssemblyHero } from "@/components/assembly-hero";
import { CommandPalette } from "@/components/command-palette";
import { ProjectModule } from "@/components/project-module";
import { SectionHeader } from "@/components/section-header";
import type { SiteContent } from "@/lib/site-content";

type Props = {
  content: SiteContent;
};

export function ResearchOSExperience({ content }: Props) {
  return (
    <main className="relative isolate min-h-screen overflow-x-clip">
      <div className="fine-grid pointer-events-none fixed inset-0 -z-10 opacity-70" />
      <CommandPalette />
      <AssemblyHero content={content} />
      <RunningSystems content={content} />
      <ResearchLog content={content} />
      <ContactPanel />
    </main>
  );
}

function RunningSystems({ content }: Props) {
  return (
    <section
      id="projects"
      aria-labelledby="systems-title"
      className="mx-auto max-w-7xl scroll-mt-8 px-5 py-24 sm:px-8 lg:px-12"
    >
      <SectionHeader
        id="systems-title"
        eyebrow="Running systems"
        title="Projects with receipts."
        description="Work across health, biology, climate, hardware, and applied AI, shown through the artifacts each project leaves behind."
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
      id="research"
      aria-labelledby="notes-title"
      className="relative mx-auto max-w-7xl scroll-mt-8 px-5 py-24 sm:px-8 lg:px-12"
    >
      <span id="writing" className="absolute top-0" aria-hidden="true" />
      <SectionHeader
        id="notes-title"
        eyebrow="Research log"
        title="Notes from the workbench."
        description="Short observations on evaluation, sensors, interfaces, and the details that decide whether a project holds up."
      />
      <div className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {content.notes.map((note) => (
          <article key={note.title} className="grid gap-4 py-7 md:grid-cols-[9rem_1fr_8rem]">
            <time
              dateTime={note.date}
              className="font-mono text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]"
            >
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
            Send the concrete version. I read careful notes.
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <ContactLink href="mailto:ishaankejriwal1@gmail.com">Email</ContactLink>
          <ContactLink href="https://www.linkedin.com/in/ishaankejriwal/" external>
            LinkedIn
          </ContactLink>
          <ContactLink href="https://github.com/ishaankejriwal" external>
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
