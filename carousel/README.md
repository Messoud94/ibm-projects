# The Study Lab — September carousel

Six 1080×1080 slides telling one story: two students of the same ability, one of
whom started in September. The same two cartoon characters appear on every slide,
so the reader follows *them* across the swipe rather than reading a new chart each
time — the gold student started in September, the sage one started later.

| # | Beat | Illustration |
|---|------|--------------|
| 1 | Two students, same ability | Both identical, side by side, an `=` between them |
| 2 | September — level on day one | Both on the same solid ground, the year ahead dashed |
| 3 | By November — one is ahead | Gold striding on; sage stood in scattered papers |
| 4 | By Spring — choosing vs being placed | Gold reaches for the HIGHER card; sage is handed one |
| 5 | By May — revising vs still learning | Gold holds a ticked checklist; sage a stack and question marks |
| 6 | Results day — the gap was time | Gold through the finish ribbon; sage still walking |

Slides 1, 2, 5 and 6 are deep green; 3 and 4 are cream, matching the source cards.
Slide 6 did not exist in the source set and was written to close the story with the
September call to action.

## Rendering

```bash
npm install          # playwright-core (Chromium is already on the box)
node fetch-fonts.mjs # Playfair Display + Jost from Google Fonts, into ./fonts
node build.mjs       # all six slides + a contact sheet, into ./out
node build.mjs 3 4   # re-render a subset while iterating
```

Output lands in `out/` as `cardN_1080x1080.png` (the deliverable), the matching
`.svg` source, and `contact-sheet.png` for reviewing the swipe order.

## Layout

Everything is SVG on a shared grid, so slides stay aligned with each other:

```
88–205   header lockup (horizontal on green, stacked on cream) + NN / 06
238/256  gold letterspaced eyebrow
…        Playfair headline, then Jost body copy
500/566  illustration panel → 818, students standing on y = 766
802      figure captions — the cast doubles as the chart legend
852      progress rail (SEP · NOV · SPRING · MAY), month labels at +50
944      footer rule, footer text at 998
```

## Files

- `lib/brand.mjs` — palette, type helpers, shield logo, header, progress rail, footer
- `lib/characters.mjs` — the two-student rig (poses, expressions) and the props
  (books, papers, tier cards, clock, ribbon)
- `lib/slides.mjs` — copy and composition for each of the six slides
- `build.mjs` — renders SVG → PNG through headless Chromium
- `fetch-fonts.mjs` — downloads the two typefaces (not committed)

## Editing

Copy lines are hand-broken in `lib/slides.mjs` — each headline and body line is its
own array entry, so re-wording means editing the lines, not fighting a text engine.
Poses come from the named `ARM` / `LEG` presets in `lib/characters.mjs`; note that
the left side mirrors x, which is why a walk is `strideFwd` on both legs.
