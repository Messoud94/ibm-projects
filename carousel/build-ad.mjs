// Renders the single-image Instagram ad.
//
//   node build-ad.mjs            # both crops
//   node build-ad.mjs portrait   # just the 1080x1350 feed size

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { openRenderer } from "./lib/render.mjs";
import { renderAd, AD_FORMATS, adHeight } from "./lib/ad.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "out");
const asked = process.argv.slice(2).filter((f) => AD_FORMATS.includes(f));
const formats = asked.length ? asked : AD_FORMATS;

await mkdir(OUT, { recursive: true });
const r = await openRenderer();

for (const format of formats) {
  const h = adHeight(format);
  const svg = renderAd(format);
  const name = `ad-learning-${format}_1080x${h}`;
  await writeFile(join(OUT, `${name}.svg`), svg);
  await r.shoot(svg, join(OUT, `${name}.png`), 1080, h);
  console.log(`rendered ${name}.png`);
}

await r.close();
