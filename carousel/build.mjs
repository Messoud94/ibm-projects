// Renders every slide to a 1080x1080 PNG (and keeps the raw SVG alongside).
//
//   node fetch-fonts.mjs   # once, pulls Playfair Display + Jost
//   node build.mjs         # writes out/card1..card6_1080x1080.png
//
// Pass slide numbers to re-render a subset, e.g. `node build.mjs 3 4`.

import { chromium } from "playwright-core";
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderSlide, SLIDE_COUNT } from "./lib/slides.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "out");
const FONT_DIR = join(ROOT, "fonts");

const FACE_META = {
  Light: { weight: 300, style: "normal" },
  Regular: { weight: 400, style: "normal" },
  Medium: { weight: 500, style: "normal" },
  SemiBold: { weight: 600, style: "normal" },
  Bold: { weight: 700, style: "normal" },
  Italic: { weight: 500, style: "italic" },
  BoldItalic: { weight: 700, style: "italic" },
};

const FAMILY = { PlayfairDisplay: "Playfair Display", Jost: "Jost" };

async function fontFaceCss() {
  let files;
  try {
    files = (await readdir(FONT_DIR)).filter((f) => f.endsWith(".ttf"));
  } catch {
    files = [];
  }
  if (!files.length) {
    throw new Error("No fonts in ./fonts — run `node fetch-fonts.mjs` first.");
  }
  const faces = await Promise.all(
    files.map(async (f) => {
      const [fam, face] = f.replace(/\.ttf$/, "").split("-");
      const meta = FACE_META[face];
      if (!meta || !FAMILY[fam]) return "";
      const b64 = (await readFile(join(FONT_DIR, f))).toString("base64");
      return `@font-face{font-family:'${FAMILY[fam]}';font-weight:${meta.weight};
        font-style:${meta.style};src:url(data:font/ttf;base64,${b64}) format('truetype');}`;
    }),
  );
  return faces.join("\n");
}

const page = (css, svg) => `<!doctype html><meta charset="utf-8"><style>
  ${css}
  html,body{margin:0;padding:0;background:transparent}
  svg{display:block}
</style>${svg}`;

const wanted = process.argv.slice(2).map(Number).filter((n) => n >= 1 && n <= SLIDE_COUNT);
const slides = wanted.length ? wanted : Array.from({ length: SLIDE_COUNT }, (_, i) => i + 1);

await mkdir(OUT, { recursive: true });
const css = await fontFaceCss();
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
const tab = await ctx.newPage();

for (const n of slides) {
  const svg = renderSlide(n);
  await writeFile(join(OUT, `card${n}_1080x1080.svg`), svg);
  await tab.setContent(page(css, svg), { waitUntil: "load" });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: join(OUT, `card${n}_1080x1080.png`), clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  console.log(`rendered card${n}_1080x1080.png`);
}

// A single sheet showing the swipe order, handy for review.
if (slides.length === SLIDE_COUNT) {
  const grid = Array.from({ length: SLIDE_COUNT }, (_, i) => renderSlide(i + 1))
    .map((svg) => svg.replace('width="1080" height="1080"', 'width="340" height="340"'))
    .join("");
  await tab.setViewportSize({ width: 1104, height: 740 });
  await tab.setContent(
    `<!doctype html><meta charset="utf-8"><style>${css}
      body{margin:0;padding:16px;background:#DCD7CD;display:grid;
        grid-template-columns:repeat(3,340px);gap:16px}
      svg{display:block;border-radius:6px}</style>${grid}`,
    { waitUntil: "load" },
  );
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: join(OUT, "contact-sheet.png"), fullPage: true });
  console.log("rendered contact-sheet.png");
}

await browser.close();
