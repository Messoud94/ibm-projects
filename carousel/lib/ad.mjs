// Single-image Instagram ad: three brains, filled by how much actually sticks.
//
// Original artwork — the brains, type and layout are drawn here in The Study Lab
// system rather than lifted from the reference image.

import { W, M, THEME, shield, headline, copy, label } from "./brand.mjs";
import { brain } from "./brain.mjs";

const t = THEME.green;

const STAGES = [
  { caption: "From theory", level: 0.3, fill: "#B4705C", deep: "#8E5646" },
  { caption: "From practice", level: 0.62, fill: "#6FA394", deep: "#54806F" },
  { caption: "From mistakes", level: 1, fill: "#D2A63C", deep: "#A87F22", gold: true },
];

// Two crops of the same ad. Portrait is the feed size to run; square is the
// same message for grid and story-safe use.
const LAYOUTS = {
  portrait: {
    h: 1350,
    shieldY: 92,
    shieldScale: 0.92,
    wordY: 250,
    eyebrowY: 336,
    headY: 416,
    headSize: 62,
    headLead: 74,
    brainY: 706,
    brainScale: 0.82,
    captionY: 898,
    bodyY: 972,
    bodyLines: [
      "Reading it once fills a little. Doing it fills more.",
      "Getting it wrong in front of a teacher who corrects it",
      "on the spot is where the rest of it goes in.",
    ],
    ctaY: 1104,
    footY: 1288,
  },
  square: {
    h: 1080,
    shieldY: 74,
    shieldScale: 0.78,
    wordY: 208,
    eyebrowY: 282,
    headY: 350,
    headSize: 54,
    headLead: 64,
    brainY: 600,
    brainScale: 0.66,
    captionY: 748,
    bodyY: 806,
    bodyLines: [
      "Reading it once fills a little. Doing it fills more.",
      "Getting it wrong in front of a teacher is the rest.",
    ],
    ctaY: 878,
    footY: 1034,
  },
};

/** Gold pill with the booking call to action. */
function cta(y, { w = 468, h = 78, text = "Book a September place" }) {
  const x = (W - w) / 2;
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${t.gold}"/>
    <text x="${W / 2}" y="${y + h / 2 + 9}" text-anchor="middle" font-family="Jost"
      font-size="26" font-weight="500" letter-spacing="1.2" fill="${t.bg}">${text}</text>`;
}

export function renderAd(format = "portrait") {
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

    ${shield(cx - 46 * L.shieldScale, L.shieldY, t.logo, L.shieldScale)}
    <text x="${cx}" y="${L.wordY}" text-anchor="middle" font-family="Playfair Display"
      font-size="30" letter-spacing="5" fill="${t.logoWord}">THE STUDY LAB</text>

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
      size: format === "portrait" ? 26 : 24,
      lead: format === "portrait" ? 38 : 36,
      fill: t.body,
      anchor: "middle",
    })}

    ${cta(L.ctaY, {})}

    <line x1="${M + 60}" y1="${L.footY - 44}" x2="${W - M - 60}" y2="${L.footY - 44}"
      stroke="${t.footRule}" stroke-width="1.5"/>
    ${label("THESTUDYLAB.AE · YEARS 9 TO 11 · GCSE & IGCSE", {
      x: cx,
      y: L.footY,
      size: 20,
      weight: 400,
      track: 2.6,
      fill: t.muted,
      anchor: "middle",
    })}
  </svg>`;
}

export const AD_FORMATS = Object.keys(LAYOUTS);
export const adHeight = (format) => LAYOUTS[format].h;
