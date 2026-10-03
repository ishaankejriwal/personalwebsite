# AGENTS.md

## Project

Personal website for Ishaan Kejriwal (Johns Creek High School, Class of 2027). The audience is recruiters, admissions readers, and founders who give it ten seconds, then maybe two minutes.

The concept: four things he built, turned into small playable toys. Each project is a full-screen "cabinet" with its own flat colour, one headline, one sentence, a fold-out with the longer story, and a stage that holds a game built from the real work. Visitors do things instead of reading.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS v4
- Two webfonts via `next/font`: Bricolage Grotesque (display and body) and JetBrains Mono (HUD and small labels)
- No animation or UI libraries. Games are vanilla canvas in client components, lazy-loaded when their cabinet is near the viewport.
- Do not add dependencies without a reason written down.

## Commands

- `npm run dev`
- `npm run build`
- `npm run lint`

Run lint and build before calling anything done. Never add Co-Authored-By or "generated with" lines to commits.

## Where things live

- `src/app/page.tsx` orders the cabinets.
- `src/lib/cabinets.ts` holds the palettes and the level list used by the intro strip.
- `src/components/cabinet.tsx` is the shared cabinet layout; `stories.tsx` holds the fold-out copy.
- `src/components/games/*.tsx` are the three games. They share one contract: `({ colors }) => JSX`, root fills its container, canvas plus a small DOM HUD, `ResizeObserver` sizing, `requestAnimationFrame` only while on screen and the tab is visible, `touch-action: none` only during a round, reduced motion means no idle animation.
- `src/components/game-slot.tsx` lazy-loads a game with an `IntersectionObserver`.

## Voice

Copy is first person, plain, short, and specific. Every number is checkable against Ishaan's resumes, Common App drafts, and paper draft.

Never write em or en dashes, "not X but Y" contrasts, uppercase tracked eyebrow labels, filler words like signal, journey, landscape, or invented metrics. Headlines are short imperatives ("Hold still.", "Beat the filter."). HUD strings stay under 40 characters.

## Design

- One flat colour per cabinet, no gradients, no glows, no shadows, 3px ink borders. Intro and bonus section on paper, contact on near-black.
- Display type is Bricolage at weight 800, slightly narrow, tight leading. Sentence case.
- Each game is a sharp instrument, not a casual game: 2px lines, accent colour for the one thing that matters.
- Mobile: single column, square stage, 20px gutters, nothing wider than the viewport. Games must not block page scrolling outside a round.
- Respect `prefers-reduced-motion`.

## Definition of done

- runs locally, lint and build pass
- checked at 1440 and 390 widths (Playwright: `npx playwright screenshot --channel=chrome --full-page --viewport-size=1440,900 --wait-for-timeout=6000 http://localhost:3000 out.png`; use an anchor like `/#grace` to load a specific game)
- every visible string re-read for the voice rules above
