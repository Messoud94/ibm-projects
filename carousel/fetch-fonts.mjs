// Downloads the two brand typefaces (Playfair Display + Jost) from Google Fonts
// into ./fonts as .ttf files. The renderer embeds them as base64 so the slides
// stay pixel-identical regardless of what is installed on the machine.
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const FONT_DIR = join(ROOT, "fonts");

// Each entry: output filename -> Google Fonts css2 query for that single face.
const FACES = {
  "PlayfairDisplay-Regular.ttf": "family=Playfair+Display:wght@400",
  "PlayfairDisplay-Medium.ttf": "family=Playfair+Display:wght@500",
  "PlayfairDisplay-Bold.ttf": "family=Playfair+Display:wght@700",
  "PlayfairDisplay-Italic.ttf": "family=Playfair+Display:ital,wght@1,500",
  "PlayfairDisplay-BoldItalic.ttf": "family=Playfair+Display:ital,wght@1,700",
  "Jost-Light.ttf": "family=Jost:wght@300",
  "Jost-Regular.ttf": "family=Jost:wght@400",
  "Jost-Medium.ttf": "family=Jost:wght@500",
  "Jost-SemiBold.ttf": "family=Jost:wght@600",
};

// A bare UA makes Google serve the plain .ttf sources rather than woff2.
const UA = "Mozilla/5.0";

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function fetchFace(file, query) {
  const out = join(FONT_DIR, file);
  if (await exists(out)) return `cached  ${file}`;

  const cssRes = await fetch(`https://fonts.googleapis.com/css2?${query}&display=swap`, {
    headers: { "User-Agent": UA },
  });
  if (!cssRes.ok) throw new Error(`css ${cssRes.status} for ${file}`);
  const css = await cssRes.text();
  const url = css.match(/url\((https:[^)]+\.(?:ttf|woff2?))\)/)?.[1];
  if (!url) throw new Error(`no ttf url in css for ${file}`);

  const ttf = await fetch(url, { headers: { "User-Agent": UA } });
  if (!ttf.ok) throw new Error(`ttf ${ttf.status} for ${file}`);
  await writeFile(out, Buffer.from(await ttf.arrayBuffer()));
  return `fetched ${file}`;
}

await mkdir(FONT_DIR, { recursive: true });
for (const [file, query] of Object.entries(FACES)) {
  console.log(await fetchFace(file, query));
}
