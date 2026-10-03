import { paletteStyle } from "@/components/cabinet";
import { palettes } from "@/lib/cabinets";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      style={paletteStyle(palettes.contact)}
      className="flex min-h-[70dvh] flex-col justify-between px-5 py-14 sm:px-8 lg:px-12"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <h2 id="contact-title" className="display text-5xl sm:text-7xl lg:text-8xl">
          That&rsquo;s the tour.
        </h2>
        <p className="mt-6 max-w-md text-lg">
          If something here is useful to you, email me. I read everything.
        </p>
        <p className="mt-10">
          <a
            className="lnk display inline-block text-[1.6rem] sm:text-4xl lg:text-6xl"
            href="mailto:ishaankejriwal1@gmail.com"
          >
            ishaankejriwal1@gmail.com
          </a>
        </p>
      </div>
      <footer className="mx-auto mt-20 flex w-full max-w-[1400px] flex-wrap justify-between gap-3 font-mono text-sm">
        <span>Ishaan Kejriwal, Johns Creek, Georgia</span>
        <span className="flex gap-5">
          <a className="lnk" href="https://github.com/ishaankejriwal" rel="me noreferrer">
            GitHub
          </a>
          <a className="lnk" href="https://www.linkedin.com/in/ishaankejriwal/" rel="me noreferrer">
            LinkedIn
          </a>
        </span>
      </footer>
    </section>
  );
}
