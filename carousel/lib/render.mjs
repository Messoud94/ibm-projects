// Shared rendering plumbing: embeds the local fonts and screenshots SVG through
// headless Chromium. Used by both build.mjs (carousel) and build-ad.mjs (ad).

import { chromium } from "playwright-core";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "node:fs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
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

export async function fontFaceCss() {
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

/** The pre-installed browser; falls back to whatever playwright resolves itself. */
function chromePath() {
  return globSync("/opt/pw-browsers/chromium-*/chrome-linux/chrome")[0];
}

export async function openRenderer() {
  const css = await fontFaceCss();
  const browser = await chromium.launch({ executablePath: chromePath() });
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1080 } });
  const tab = await ctx.newPage();

  const shell = (body, extraCss = "") =>
    `<!doctype html><meta charset="utf-8"><style>${css}
      html,body{margin:0;padding:0;background:transparent}svg{display:block}
      ${extraCss}</style>${body}`;

  return {
    css,
    /** Screenshot one SVG string at its natural size. */
    async shoot(svg, path, width = 1080, height = 1080) {
      await tab.setViewportSize({ width, height });
      await tab.setContent(shell(svg), { waitUntil: "load" });
      await tab.evaluate(() => document.fonts.ready);
      await tab.screenshot({ path, clip: { x: 0, y: 0, width, height } });
    },
    /** Screenshot arbitrary markup (used for the contact sheet grid). */
    async shootHtml(body, extraCss, path, width, height) {
      await tab.setViewportSize({ width, height });
      await tab.setContent(shell(body, extraCss), { waitUntil: "load" });
      await tab.evaluate(() => document.fonts.ready);
      await tab.screenshot({ path, fullPage: true });
    },
    close: () => browser.close(),
  };
}
