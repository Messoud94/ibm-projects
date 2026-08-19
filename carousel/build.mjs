// Renders every carousel slide to a 1080x1080 PNG (and keeps the raw SVG alongside).
//
//   node fetch-fonts.mjs   # once, pulls Playfair Display + Jost
//   node build.mjs         # writes out/card1..card6_1080x1080.png
//
// Pass slide numbers to re-render a subset, e.g. `node build.mjs 3 4`.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { openRenderer } from "./lib/render.mjs";
import { renderSlide, SLIDE_COUNT } from "./lib/slides.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "out");

const wanted = process.argv.slice(2).map(Number).filter((n) => n >= 1 && n <= SLIDE_COUNT);
const slides = wanted.length ? wanted : Array.from({ length: SLIDE_COUNT }, (_, i) => i + 1);

await mkdir(OUT, { recursive: true });
const r = await openRenderer();

for (const n of slides) {
  const svg = renderSlide(n);
  await writeFile(join(OUT, `card${n}_1080x1080.svg`), svg);
  await r.shoot(svg, join(OUT, `card${n}_1080x1080.png`));
  console.log(`rendered card${n}_1080x1080.png`);
}

// A single sheet showing the swipe order, handy for review.
if (slides.length === SLIDE_COUNT) {
  const grid = Array.from({ length: SLIDE_COUNT }, (_, i) => renderSlide(i + 1))
    .map((svg) => svg.replace('width="1080" height="1080"', 'width="340" height="340"'))
    .join("");
  await r.shootHtml(
    grid,
    `body{padding:16px;background:#DCD7CD;display:grid;
      grid-template-columns:repeat(3,340px);gap:16px}
     svg{border-radius:6px}`,
    join(OUT, "contact-sheet.png"),
    1104,
    740,
  );
  console.log("rendered contact-sheet.png");
}

await r.close();
