# DESIGN.md

## Idea

Four things Ishaan built, turned into toys. The visitor plays each one for twenty seconds and comes away knowing what the project does better than a paragraph could tell them.

## Structure

1. Intro on paper: giant name, two lines, a strip of four coloured level tiles that doubles as navigation.
2. Cabinet 01, NeuroCore, teal. "Hold still." Balance a belt with three sensors inside a drifting target band. Sway too much and it buzzes, like the real device.
3. Cabinet 02, GRACE, navy. "Beat the filter." Guess the next point of a noisy series, then see what a Kalman filter guessed. Five rounds, running error for both.
4. Cabinet 03, CHAI, cream. "Test it first." No game; a four-cell grid of real numbers, one cell in red.
5. Cabinet 04, BioDock, black. "Find the fit." Drag and rotate one of three ligands into a protein pocket until it docks.
6. Bonus levels on paper: six short entries in a ruled grid.
7. Contact on near-black: "That's the tour." and the email address, huge.

Each cabinet: left column has a mono kicker, the headline, one sentence, and a `<details>` fold-out labelled "The longer version". Right column is the stage, 4:3 on desktop and square on phones, inside a 3px border.

## Palettes

| Cabinet | bg | ink | accent |
|---|---|---|---|
| intro, bonus | #f6f4ee | #0e0e0e | #ff6a45 |
| NeuroCore | #16c99a | #07201a | #ffd836 |
| GRACE | #0d2c70 | #eef3ff | #ff6a45 |
| CHAI | #f3ede2 | #141210 | #d8261f |
| BioDock | #0f0f0f | #f2f2f2 | #c9ff3d |
| contact | #0e0e0e | #f6f4ee | #ff6a45 |

Flat fills only. The `dim` colour in each palette is the ink at about 30% for grids and secondary marks.

## Type

Bricolage Grotesque, weight 800 for display with `wdth` 88 and leading 0.9; the name uses `wdth` 100. Body at 17px. JetBrains Mono for kickers, HUDs, and the footer.

## Motion

Only what the games need. No scroll-driven reveals (they can leave content invisible on very tall viewports). Hover on links fills the text with ink. Level tiles lift 4px on hover.

## Avoid

Eyebrow labels, cards with shadows, gradients, glass, particles, 3D, mono-caps labels on every section, fake dashboards, long paragraphs above the fold, and any sentence Ishaan would not say out loud.
