// Poster: three brains, filled by how much of a lesson actually stays.
//
// Original artwork — the brains, type and layout are drawn here rather than
// lifted from any reference image. No mark, no call to action: just the idea,
// with a small credit line at the foot of the page.

import { W, THEME, headline, copy, label } from "./brand.mjs";
import { brain } from "./brain.mjs";

const t = THEME.green;
const CREDIT = "THE STUDY LAB";

const STAGES = [
  { caption: "From theory", level: 0.3, fill: "#B4705C", deep: "#8E5646" },
  { caption: "From practice", level: 0.62, fill: "#6FA394", deep: "#54806F" },
  { caption: "From mistakes", level: 1, fill: "#D2A63C", deep: "#A87F22", gold: true },
];

// Two crops of the same poster: portrait for print and feed, square for the grid.
const LAYOUTS = {
  portrait: {
    h: 1350,
    eyebrowY: 302,
    headY: 392,
    headSize: 62,
    headLead: 74,
    brainY: 736,
    brainScale: 0.85,
    captionY: 936,
    bodyY: 1016,
    bodySize: 26,
    bodyLead: 38,
    bodyLines: [
      "Reading it once fills a little. Doing it fills more.",
      "Getting it wrong in front of someone who corrects it",
      "on the spot is where the rest of it goes in.",
    ],
    creditY: 1268,
  },
  square: {
    h: 1080,
    eyebrowY: 214,
    headY: 292,
    headSize: 54,
    headLead: 64,
    brainY: 592,
    brainScale: 0.68,
    captionY: 768,
    bodyY: 838,
    bodySize: 24,
    bodyLead: 36,
    bodyLines: [
      "Reading it once fills a little. Doing it fills more.",
      "Getting it wrong in front of someone is the rest.",
    ],
    creditY: 1008,
  },
};

export function renderPoster(format = "portrait") {
  const L = LAYOUTS[format];
  const cx = W / 2;

  const brains = STAGES.map((s, i) => {
    const x = 240 + i * 300;
    return `
      ${brain({
        x,
        y: L.brainY,
        s: L.brainScale,
        level: s.level,
        fill: s.fill,
        deep: s.deep,
        stroke: t.head,
        id: `${format}-${i}`,
      })}
      ${label(s.caption, {
        x,
        y: L.captionY,
        size: format === "portrait" ? 27 : 24,
        weight: 400,
        track: 0.6,
        fill: s.gold ? t.gold : t.body,
        anchor: "middle",
      })}`;
  }).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${L.h}"
      viewBox="0 0 ${W} ${L.h}">
    <rect width="${W}" height="${L.h}" fill="${t.bg}"/>

    ${label("HOW MUCH ACTUALLY STICKS", {
      x: cx,
      y: L.eyebrowY,
      size: 21,
      fill: t.gold,
      anchor: "middle",
    })}
    ${headline(
      ["Nobody learns it", ["by ", { t: "reading", italic: true, gold: true }, " it once."]],
      {
        x: cx,
        y: L.headY,
        size: L.headSize,
        lead: L.headLead,
        fill: t.head,
        gold: t.gold,
        anchor: "middle",
      },
    )}

    ${brains}

    ${copy(L.bodyLines, {
      x: cx,
      y: L.bodyY,
      size: L.bodySize,
      lead: L.bodyLead,
      fill: t.body,
      anchor: "middle",
    })}

    <text x="${cx}" y="${L.creditY}" text-anchor="middle" font-family="Playfair Display"
      font-size="21" letter-spacing="4.5" fill="${t.muted}">${CREDIT}</text>
  </svg>`;
}

export const POSTER_FORMATS = Object.keys(LAYOUTS);
export const posterHeight = (format) => LAYOUTS[format].h;
