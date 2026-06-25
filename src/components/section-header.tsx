type SectionHeaderProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeader({ id, eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-6xl"
      >
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--muted)]">
        {description}
      </p>
    </div>
  );
}
