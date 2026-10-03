# Context

## What this is

Ishaan Kejriwal's personal site. Rebuilt in October 2026 around playable toys of his real projects, after two earlier versions (a dark "research OS" and a text-heavy editorial page) both read as AI-made.

## Why the toys

Ishaan's feedback on the editorial version: too much text, a traditional layout, nothing novel. The sites people remember are the ones where you do something. So each project became a small game built from its actual mechanics: the NeuroCore instability score and haptic cue, the Kalman filter from the GRACE paper, the docking pose ranking from BioDock.

## Facts behind the copy

All numbers come from Ishaan's own files in his Downloads folder: Common App activity and honors drafts, the GRACE project notes and `main.tex`, the recommendation brag sheets for Dr. Anderson (CHAI) and Dr. Goldberg (CREATE-X), and the NeuroCore deck. Nothing on the page is invented.

## Things to verify with Ishaan

- GRACE: "The work is going to the AGU Fall Meeting." Confirm it is accepted and which year.
- GRACE: the paper is "being prepared for" HESS. Update when submitted or accepted.
- GRACE: "Most published models lose to it too" is his preferred phrasing; the paper itself compares against one published forecast (GRACE-FCast) at one month and notes that none of ten studies reports the baseline.
- NeuroCore: five pilot clinics, $160K in funding and services, 30+ interviews, all from the October 2026 deck and honors list.
- Game thresholds: the balance game's instability scale and cue threshold are constants at the top of `balance-game.tsx` and were tuned by feel, not against the real device.

## Known gaps

- No Open Graph image yet. A 1200x630 image of the intro would make shared links look right.
- The balance game's phone-tilt mode has only been tested in a desktop browser; try it on an iPhone (it needs the permission prompt) and an Android phone.
- Headless Chrome's `--screenshot` paints black when given an anchor URL on this page; use Playwright for captures (see AGENTS.md).
