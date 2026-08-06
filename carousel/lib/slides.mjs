// The six slides. Each entry returns a full 1080x1080 SVG string.
//
// Shared vertical grid
//   header 88-205 · eyebrow 238/256 · headline · body copy
//   illustration panel 500 (green) / 566 (cream) → 818, students standing on y=766
//   figure captions 802 · timeline 852 (+50 for month labels) · footer rule 944

import { W, M, THEME, header, headline, copy, label, timeline, footer, panel } from "./brand.mjs";
import { figure, props, CAST } from "./characters.mjs";

const FEET = 766;
const CAP = 802;

/** Caption under a figure — the cast doubles as the chart legend. */
function tag(t, { x, y = CAP, text, gold = false }) {
  return label(text, {
    x,
    y,
    size: 18,
    weight: 500,
    track: 2.6,
    fill: gold ? t.gold : t.muted,
    anchor: "middle",
  });
}

/* ---------------------------------------------------------------- slide 1 */
function slide1() {
  const t = THEME.green;
  const feet = 828;
  const s = 0.76;
  return `
    ${header(t, { index: 1 })}
    ${label("THE SAME YEAR, TWICE", { x: M, y: 238, fill: t.gold })}
    ${headline(["Two students. The", ["same ", { t: "ability", italic: true, gold: true }, "."]], {
      x: M,
      y: 316,
      size: 62,
      lead: 74,
      fill: t.head,
      gold: t.gold,
    })}
    ${copy(["One of them started in September."], { x: M, y: 448, fill: t.body })}

    ${panel(t, { y: 500, h: 392 })}
    ${props.track({ x1: M + 60, x2: W - M - 60, y: feet + 6, color: t.ground })}

    ${figure({
      ...CAST.a,
      cast: "a",
      x: 396,
      y: feet,
      s,
      face: "happy",
      armL: "carry",
      armR: "down",
      shadow: t.shadow,
      front: props.book({ x: -82, y: -112, rot: 8 }),
    })}
    ${figure({
      ...CAST.b,
      cast: "b",
      x: 684,
      y: feet,
      s,
      flip: true,
      face: "happy",
      armL: "carry",
      armR: "down",
      shadow: t.shadow,
      front: props.book({ x: -82, y: -112, rot: 8, spine: "#7A8E82" }),
    })}
    <path d="M 516 668 H 564 M 516 692 H 564" stroke="${t.gold}" stroke-width="5"
      stroke-linecap="round" opacity="0.9"/>
    ${tag(t, { x: 540, y: 858, text: "SAME SET · SAME TEACHERS · SAME PAPER", gold: true })}

    ${label("SWIPE — HERE IS WHERE THEY FINISH  →", {
      x: M,
      y: 998,
      size: 23,
      fill: t.gold,
      weight: 500,
      track: 4,
    })}`;
}

/* ---------------------------------------------------------------- slide 2 */
function slide2() {
  const t = THEME.green;
  const s = 0.66;
  return `
    ${header(t, { index: 2 })}
    ${label("SEPTEMBER", { x: M, y: 238, fill: t.gold })}
    ${headline(["Level, on day one."], { x: M, y: 310, size: 60, fill: t.head, gold: t.gold })}
    ${copy(
      [
        "Same set, same teachers, the same specification",
        "ahead of them. Everything that separates them",
        "from here is time.",
      ],
      { x: M, y: 374, fill: t.body },
    )}

    ${panel(t, { y: 500, h: 318 })}
    ${props.track({ x1: 168, x2: 712, y: FEET + 6, color: t.ground })}
    ${props.track({ x1: 712, x2: W - M - 40, y: FEET + 6, color: t.ground, dash: true, width: 5 })}
    ${props.gate({ x: 252, y: FEET + 6, h: 214, color: t.gold })}
    ${label("START", {
      x: 252,
      y: FEET - 226,
      size: 18,
      fill: t.gold,
      weight: 500,
      track: 4,
      anchor: "middle",
    })}

    ${figure({
      ...CAST.a,
      cast: "a",
      x: 348,
      y: FEET,
      s,
      face: "calm",
      armL: "carry",
      armR: "down",
      shadow: t.shadow,
      front: props.book({ x: -82, y: -112, rot: 8 }),
    })}
    ${figure({
      ...CAST.b,
      cast: "b",
      x: 636,
      y: FEET,
      s,
      face: "calm",
      armL: "carry",
      armR: "down",
      shadow: t.shadow,
      front: props.book({ x: -82, y: -112, rot: 8, spine: "#7A8E82" }),
    })}
    ${tag(t, { x: 348, text: "STARTED IN SEPTEMBER", gold: true })}
    ${tag(t, { x: 636, text: "STARTED LATER" })}

    ${timeline(t, { active: 0 })}
    ${footer(t, { left: "Years 9 to 11 · GCSE & IGCSE" })}`;
}

/* ---------------------------------------------------------------- slide 3 */
function slide3() {
  const t = THEME.cream;
  const s = 0.58;
  return `
    ${header(t, { index: 3, stacked: true })}
    ${label("BY NOVEMBER", { x: M, y: 256, fill: t.gold })}
    ${headline(["One is ahead of the", "specification. One is where", "the term left them."], {
      x: M,
      y: 326,
      size: 50,
      lead: 60,
      fill: t.head,
      gold: t.gold,
    })}
    ${copy(
      [
        "Eight weeks of teaching in a planned order, against",
        "eight weeks of whatever came home that week.",
      ],
      { x: M, y: 502, size: 25, lead: 36, fill: t.body },
    )}

    ${panel(t, { y: 566, h: 252 })}
    ${props.track({ x1: M + 40, x2: W - M - 40, y: FEET + 6, color: t.ground })}

    ${props.scatter({ x: 300, y: FEET - 26, spread: 112 })}
    ${figure({
      ...CAST.b,
      cast: "b",
      x: 300,
      y: FEET,
      s,
      face: "worried",
      armL: "head",
      armR: "outUp",
      legL: "apart",
      legR: "stand",
      shadow: t.shadow,
    })}

    ${props.speed({ x: 700, y: FEET - 118, color: t.gold })}
    ${figure({
      ...CAST.a,
      cast: "a",
      x: 762,
      y: FEET,
      s,
      lean: 2,
      face: "focused",
      armL: "swingFwd",
      armR: "carry",
      legL: "strideFwd",
      legR: "strideFwd",
      shadow: t.shadow,
      front: props.book({ x: 82, y: -112, rot: -8 }),
    })}
    ${tag(t, { x: 300, text: "STARTED LATER" })}
    ${tag(t, { x: 762, text: "STARTED IN SEPTEMBER", gold: true })}

    ${timeline(t, { active: 1 })}
    ${footer(t, { left: "Mapped to the exam board specification" })}`;
}

/* ---------------------------------------------------------------- slide 4 */
function slide4() {
  const t = THEME.cream;
  const s = 0.58;
  return `
    ${header(t, { index: 4, stacked: true })}
    ${label("BY SPRING", { x: M, y: 256, fill: t.gold })}
    ${headline(
      [["One is ", { t: "choosing", italic: true, gold: true }, " Higher."], "One is being placed."],
      { x: M, y: 330, size: 52, lead: 62, fill: t.head, gold: t.gold },
    )}
    ${copy(
      [
        "Schools decide tier entry on the evidence in front of",
        "them. By then one of these students has built a case,",
        "and the other has a set of autumn marks.",
      ],
      { x: M, y: 458, size: 25, lead: 36, fill: t.body },
    )}

    ${panel(t, { y: 566, h: 252 })}
    ${props.track({ x1: M + 40, x2: W - M - 40, y: FEET + 6, color: t.ground })}

    ${props.tierCard({ x: 400, y: 620, text: "HIGHER", rot: -4, w: 156, h: 74 })}
    ${figure({
      ...CAST.a,
      cast: "a",
      x: 262,
      y: FEET,
      s,
      face: "happy",
      armL: "hip",
      armR: "reach",
      legL: "stand",
      legR: "apart",
      shadow: t.shadow,
    })}

    ${props.tierCard({
      x: 668,
      y: 626,
      text: "PLACED",
      rot: 3,
      w: 156,
      h: 74,
      fill: "rgba(147,167,155,0.30)",
      ink: "#547365",
      dashed: true,
    })}
    ${props.arrowRight({ x: 752, y: 640, len: 54, color: "#93A79B" })}
    ${figure({
      ...CAST.b,
      cast: "b",
      x: 862,
      y: FEET,
      s,
      flip: true,
      face: "worried",
      armL: "outUp",
      armR: "outUp",
      legL: "stand",
      legR: "apart",
      shadow: t.shadow,
    })}
    ${tag(t, { x: 274, text: "BUILT THE CASE", gold: true })}
    ${tag(t, { x: 850, text: "GIVEN THE TIER" })}

    ${timeline(t, { active: 2 })}
    ${footer(t, { left: "In Maths and the Sciences" })}`;
}

/* ---------------------------------------------------------------- slide 5 */
function slide5() {
  const t = THEME.green;
  const s = 0.66;
  return `
    ${header(t, { index: 5 })}
    ${label("BY MAY", { x: M, y: 238, fill: t.gold })}
    ${headline(
      ["One is revising. The", ["other is still ", { t: "learning", italic: true, gold: true }, "."]],
      { x: M, y: 310, size: 58, lead: 68, fill: t.head, gold: t.gold },
    )}
    ${copy(["Same paper, same morning. One of them has met", "every question type before."], {
      x: M,
      y: 424,
      fill: t.body,
    })}

    ${panel(t, { y: 500, h: 318 })}
    ${props.track({ x1: M + 40, x2: W - M - 40, y: FEET + 6, color: t.ground })}

    ${figure({
      ...CAST.a,
      cast: "a",
      x: 312,
      y: FEET,
      s,
      face: "focused",
      armL: "hold",
      armR: "hold",
      legL: "stand",
      legR: "apart",
      shadow: t.shadow,
      front: props.checklist({ x: 0, y: -168, rot: -3, rows: 3, w: 136 }),
    })}
    ${props.clock({ x: 612, y: 584, r: 26 })}
    ${props.questions({ x: 858, y: 616, color: "#93A79B" })}
    ${figure({
      ...CAST.b,
      cast: "b",
      x: 762,
      y: FEET,
      s,
      face: "tired",
      armL: "hold",
      armR: "hold",
      legL: "stand",
      legR: "apart",
      shadow: t.shadow,
      front: props.bookStack({
        x: 0,
        y: -140,
        w: 128,
        h: 19,
        colors: ["#E8E1D2", "#CFC6B2", "#E8E1D2"],
      }),
    })}
    ${tag(t, { x: 312, text: "REVISING", gold: true })}
    ${tag(t, { x: 762, text: "STILL LEARNING IT" })}

    ${timeline(t, { active: 3 })}
    ${footer(t, { left: "The Summer series — the sitting that counts" })}`;
}

/* ---------------------------------------------------------------- slide 6 */
function slide6() {
  const t = THEME.green;
  const s = 0.66;
  return `
    ${header(t, { index: 6 })}
    ${label("RESULTS DAY", { x: M, y: 238, fill: t.gold })}
    ${headline(["The gap was never", ["about ", { t: "ability", italic: true, gold: true }, "."]], {
      x: M,
      y: 310,
      size: 58,
      lead: 68,
      fill: t.head,
      gold: t.gold,
    })}
    ${copy(
      [
        "It was eight months of teaching, taken in order.",
        "September is the part you can still choose.",
      ],
      { x: M, y: 424, fill: t.body },
    )}

    ${panel(t, { y: 500, h: 318 })}
    ${props.track({ x1: M + 40, x2: 900, y: FEET + 6, color: t.ground })}

    ${props.speed({ x: 234, y: FEET - 140, color: "rgba(147,167,155,0.65)", count: 2 })}
    ${figure({
      ...CAST.b,
      cast: "b",
      x: 330,
      y: FEET,
      s,
      lean: 2,
      face: "tired",
      armL: "swingFwd",
      armR: "carry",
      legL: "strideFwd",
      legR: "strideFwd",
      shadow: t.shadow,
      front: props.book({ x: 82, y: -112, rot: -8, spine: "#7A8E82" }),
    })}
    ${props.gate({ x: 726, y: FEET + 6, h: 246, color: t.gold, ribbon: true })}
    ${figure({
      ...CAST.a,
      cast: "a",
      x: 800,
      y: FEET,
      s,
      face: "happy",
      armL: "up",
      armR: "up",
      legL: "apart",
      legR: "stand",
      shadow: t.shadow,
    })}
    ${tag(t, { x: 330, text: "STARTED LATER" })}
    ${tag(t, { x: 800, text: "STARTED IN SEPTEMBER", gold: true })}

    ${timeline(t, { all: true })}
    ${footer(t, { left: "Places for September — book a consultation" })}`;
}

const SLIDES = [slide1, slide2, slide3, slide4, slide5, slide6];

export function renderSlide(n) {
  const fn = SLIDES[n - 1];
  const t = n === 3 || n === 4 ? THEME.cream : THEME.green;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="1080" viewBox="0 0 ${W} 1080">
    <rect width="${W}" height="1080" fill="${t.bg}"/>
    ${fn()}
  </svg>`;
}

export const SLIDE_COUNT = SLIDES.length;
