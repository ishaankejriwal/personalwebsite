import { paletteStyle } from "@/components/cabinet";
import { palettes } from "@/lib/cabinets";

const items = [
  {
    title: "Lung nodules in CT video",
    text: "At UMass Chan Medical School I trained a classifier to flag lung nodules in CT scan video. It reached an F1 of 0.81 in testing.",
    href: "https://github.com/ishaankejriwal/ct-ann-normal-classifier-umass",
  },
  {
    title: "Face recognition for restroom access",
    text: "At Georgia Tech Research Institute I led a team building a Raspberry Pi device that lets children with disabilities use the restroom on their own and alerts staff from a dashboard.",
  },
  {
    title: "HB 1009",
    text: "As a Fulton County Youth Commissioner I argued at the Capitol that the school-day phone restriction should cover grades 9 to 12. Governor Kemp signed it into law.",
  },
  {
    title: "Hack Club at Johns Creek",
    text: "Started the chapter, grew it to 70 members, got $1K in grants for student projects.",
  },
  {
    title: "Skillify",
    text: "A job board for a school guidance office. Employers post, students apply. React and SQL.",
    href: "https://github.com/ishaankejriwal/Skillify",
  },
  {
    title: "Two constituent sites",
    text: "Official sites for Georgia Rep. Shea Roberts and a Fulton County commissioner.",
  },
];

export function More() {
  return (
    <section
      id="more"
      aria-labelledby="more-title"
      style={paletteStyle(palettes.intro)}
      className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1400px]">
        <h2 id="more-title" className="display text-5xl sm:text-7xl">
          Bonus levels
        </h2>
        <ul className="mt-10 grid border-t-[3px] border-ink sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.title}
              className="border-b-[3px] border-ink p-5 sm:[&:nth-child(odd)]:border-r-[3px] lg:[&:nth-child(odd)]:border-r-0 lg:[&:not(:nth-child(3n))]:border-r-[3px]"
            >
              <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed">{item.text}</p>
              {item.href ? (
                <p className="mt-3 font-mono text-sm">
                  <a className="lnk" href={item.href} rel="noreferrer">
                    code
                  </a>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
