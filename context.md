# Personal Site Context

## Goal

This is Ishaan Kejriwal's personal site. It should feel like a polished interactive research/startup operating system, not a generic portfolio or resume page.

The central interaction is the homepage assembly moment: loose research/project fragments converge into a dashboard of real work.

## What Worked

- Keeping one central "research OS assembling" interaction feels stronger than adding many effects.
- The dark, restrained system UI direction works better than bright gradients, fake terminals, or generic portfolio cards.
- Project visuals based on artifacts are a good fit: IMU traces, docking layers, CHAI eval matrix, orbit/anomaly field, marketplace flow, prototype queue.
- Copy works best when it is concrete and evidence-based: traces, evals, prototypes, clinical docs, climate data, real users.
- Splitting the animated hero into a small client component is important for performance. The rest of the page can stay server-rendered.

## What Did Not Work

- The first homepage version hid Ishaan's name until the user had already scrolled, which made the entry feel broken.
- The fragment animation originally faded away without clearly resolving into the dashboard, so the "wow" interaction felt decorative instead of intentional.
- A full-page client component made the site heavier than needed.
- The fixed background grid can cost paint time on phones, so it should stay disabled on small screens and reduced-motion.
- Overly clever phrases like "portfolio theater" or vague "signal" language felt corny.
- The sticky hero scroll timing can break if `useScroll` measures to `end start`; the sticky moment actually ends around `end end`.

## Current Implementation Notes

- `src/components/research-os-experience.tsx` is the mostly server-rendered page shell.
- `src/components/assembly-hero.tsx` is the only client-heavy motion component.
- `src/lib/site-content.ts` holds the visible project and note copy.
- `src/components/project-visuals.tsx` holds the artifact visuals.
- `src/app/globals.css` defines the dark theme, panels, and reduced-motion rules.

## Current Known Gaps

- Contact links are placeholders: `hello@example.com`, generic LinkedIn, and generic GitHub.
- No real browser screenshot verification was possible in this session because the in-app browser bridge failed. Lint/build and local HTTP checks passed.
- Keep future fixes targeted. Do not rewrite the whole site unless the design direction changes.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run dev`

The sandbox may fail npm commands with `EPERM: operation not permitted, lstat 'C:\Users\ishaa'`. In that case, rerun the same npm command outside the sandbox with approval.
