# AGENTS.md

## Project

This is a personal website for Ishaan Kejriwal.

The goal is not to build a generic portfolio. The goal is to build a memorable interactive personal website with a real wow factor while staying tasteful, fast, and usable.

The site should feel like a polished interactive research/startup operating system, not a resume page.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion for UI motion
- Three.js / React Three Fiber only if it meaningfully improves the central interaction
- Avoid unnecessary dependencies

## Commands

- Run development server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

Always run `npm run lint` and `npm run build` before calling the work done.

## Design Taste

Prioritize:
- memorable interaction design
- cinematic scrolling
- restrained dark-first visual system
- editorial typography
- fast hover states
- smooth transitions
- strong project storytelling

Avoid:
- skill bars
- generic project cards
- “Hi, I’m...” hero
- fake terminal clichés
- random particles
- excessive glassmorphism
- rainbow gradients
- floating icons everywhere
- gimmicky 3D that hurts usability
- AI-generated looking illustrations

## Core Interaction Rule

The website should have one central wow interaction.

Do not add many random effects.

Every animation should support the central concept.

The central interaction should feel original, polished, and connected to the idea that Ishaan builds AI, hardware, research, and startup systems.

## Content Priorities

Main sections:
- Hero / entry moment
- Current work
- Projects
- Research
- Writing / notes
- Contact

Important projects:
- NeuroCore
- BioDock AI
- CHAI healthcare AI evaluation work
- NASA SEES / GRACE research
- Skillify
- GTRI / applied AI projects

Do not over-explain awards. Embed them naturally inside project stories.

## Engineering Rules

- Keep components small.
- Use semantic HTML.
- Make mobile responsive.
- Respect prefers-reduced-motion.
- Keep animations GPU-friendly.
- Do not break accessibility.
- Do not add dependencies without explaining why.
- Use realistic placeholder content when final copy is unknown.

## Definition of Done

A task is only done when:
- the site runs locally
- lint passes
- build passes
- the interaction feels intentional
- the UI does not look like a template
- mobile layout is acceptable