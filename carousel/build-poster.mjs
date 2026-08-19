// Renders the standalone poster.
//
//   node build-poster.mjs            # both crops
//   node build-poster.mjs portrait   # just the 1080x1350 page

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { openRenderer } from "./lib/render.mjs";
import { renderPoster, POSTER_FORMATS, posterHeight } from "./lib/poster.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "out");
const asked = process.argv.slice(2).filter((f) => POSTER_FORMATS.includes(f));
const formats = asked.length ? asked : POSTER_FORMATS;

await mkdir(OUT, { recursive: true });
const r = await openRenderer();

for (const format of formats) {
  const h = posterHeight(format);
  const svg = renderPoster(format);
  const name = `poster-learning-${format}_1080x${h}`;
  await writeFile(join(OUT, `${name}.svg`), svg);
  await r.shoot(svg, join(OUT, `${name}.png`), 1080, h);
  console.log(`rendered ${name}.png`);
}

await r.close();
