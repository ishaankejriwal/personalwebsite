# DESIGN.md

## Concept

The website is an interactive “Research OS.”

It should feel like entering a live system where projects, experiments, research, and ideas are running in parallel.

The central wow moment:

The homepage begins as a minimal dark interface with scattered system fragments: project names, research logs, sensor traces, molecule/docking visuals, notebook snippets, and small glowing nodes.

As the user scrolls, these fragments assemble into a clean operating system dashboard. The hero becomes the navigation. Projects appear as living modules instead of static cards.

The effect should be:
“Wait, this is not a template.”

## Mood

Dark.
Precise.
Futuristic but not cyberpunk.
Confident but not arrogant.
Technical but human.
Minimal but not boring.

## Visual System

Background:
- near-black
- subtle radial gradients
- no pure black flat emptiness

Text:
- soft white
- muted gray for secondary text
- one accent color only

Accent:
- electric blue or cool violet
- use sparingly

Typography:
- large editorial hero type
- clean sans-serif for body
- no more than two fonts

## Motion

Motion should feel physical and expensive.

Use:
- blur reveals
- mask reveals
- smooth transforms
- scroll-linked assembly
- subtle parallax
- magnetic hover states
- project modules unfolding

Avoid:
- typing effects
- bouncing
- random particles
- spinning icons
- scroll hijacking
- annoying cursor trails

## Homepage Structure

1. Cold open
   - no “Hi, I’m”
   - short mysterious line
   - scattered fragments begin assembling

2. Identity reveal
   - name appears after initial interaction
   - concise one-sentence positioning

3. Running systems
   - NeuroCore
   - BioDock AI
   - CHAI
   - NASA SEES
   - Skillify
   - Experiments

4. Featured project deep dives
   - each project has a unique interaction

5. Research log
   - notebook-like layout
   - short entries
   - feels current, not archived

6. Contact
   - minimal
   - no giant social icon section

## Project Presentation

Do not use identical cards.

Each project should behave differently:
- NeuroCore: IMU trace / brace orientation visual
- BioDock AI: molecule/docking style reveal
- CHAI: evaluation framework grid / document layers
- NASA SEES: satellite/orbit/water-mass style visual
- Skillify: marketplace/application flow visual

## Components

Needed:
- AnimatedHero
- SystemFragments
- ProjectModule
- ResearchLog
- CommandPalette
- MagneticLink
- SectionReveal
- ProjectDeepDive
- ContactPanel

## Anti-Patterns

Never include:
- generic portfolio cards
- skill bars
- huge profile headshot
- fake terminal as main idea
- “passionate about technology”
- tech stack badge soup
- cliché particle background
- excessive glass panels