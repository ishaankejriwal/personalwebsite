import { paletteStyle } from "@/components/cabinet";
import { levels, palettes } from "@/lib/cabinets";

export function Intro() {
  return (
    <section
      id="top"
      aria-labelledby="name"
      style={paletteStyle(palettes.intro)}
      className="flex min-h-dvh flex-col justify-between px-5 pb-6 pt-8 sm:px-8 lg:px-12"
    >
      <div className="flex items-center justify-between font-mono text-sm">
        <span>Johns Creek, Georgia</span>
        <a className="lnk" href="mailto:ishaankejriwal1@gmail.com">
          ishaankejriwal1@gmail.com
        </a>
      </div>

      <div className="mx-auto w-full max-w-[1400px] py-16">
        <h1 id="name" className="display-wide text-[4.6rem] sm:text-[8.5rem] lg:text-[11.5rem]">
          Ishaan
          <br />
          Kejriwal
        </h1>
        <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <p className="max-w-md text-xl leading-snug sm:text-2xl">
            Four things I built, turned into toys. Scroll down and play them.
          </p>
          <p className="max-w-md text-base leading-relaxed md:justify-self-end">
            Class of 2027. CTO of NeuroCore, a sensor belt for kids with cerebral palsy. Intern at
            the Coalition for Health AI. Writing a paper on forecasting water from NASA&rsquo;s
            GRACE satellites.{" "}
            <a className="lnk" href="https://github.com/ishaankejriwal" rel="me noreferrer">
              GitHub
            </a>{" "}
            <a className="lnk" href="https://www.linkedin.com/in/ishaankejriwal/" rel="me noreferrer">
              LinkedIn
            </a>
          </p>
        </div>
      </div>

      <nav aria-label="Levels" className="mx-auto w-full max-w-[1400px]">
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {levels.map((level, i) => (
            <li key={level.id}>
              <a
                href={`#${level.id}`}
                style={{ background: level.palette.bg, color: level.palette.ink }}
                className="flex h-16 items-end justify-between px-3 pb-2 font-mono text-sm transition-transform hover:-translate-y-1 sm:h-20"
              >
                <span>{level.label}</span>
                <span className="num">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}
