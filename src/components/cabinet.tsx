import type { CSSProperties, ReactNode } from "react";
import type { Palette } from "@/lib/cabinets";

type Props = {
  id: string;
  palette: Palette;
  title: string;
  kicker: string;
  line: string;
  story: ReactNode;
  stage: ReactNode;
};

export function paletteStyle(p: Palette): CSSProperties {
  return {
    "--bg": p.bg,
    "--ink": p.ink,
    "--accent": p.accent,
    "--dim": p.dim,
    background: p.bg,
    color: p.ink,
  } as CSSProperties;
}

export function Cabinet({ id, palette, title, kicker, line, story, stage }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      style={paletteStyle(palette)}
      className="scroll-mt-0 px-5 py-14 sm:px-8 lg:min-h-dvh lg:px-12 lg:py-16"
    >
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-14">
        <div>
          <p className="font-mono text-sm">{kicker}</p>
          <h2 id={`${id}-title`} className="display mt-5 text-[3.4rem] sm:text-7xl lg:text-8xl">
            {title}
          </h2>
          <p className="mt-6 max-w-md text-lg leading-snug sm:text-xl">{line}</p>
          <details className="story mt-8 max-w-md">
            <summary className="lnk text-base font-medium">The longer version</summary>
            <div className="story-body mt-5 text-[0.97rem] leading-relaxed">{story}</div>
          </details>
        </div>
        <div>
          <div className="aspect-square w-full border-[3px] border-ink sm:aspect-[4/3]">
            {stage}
          </div>
        </div>
      </div>
    </section>
  );
}
