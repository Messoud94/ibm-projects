// Flat-vector cartoon cast for the carousel.
//
// Two students carry the whole story, so they are drawn from one rig and keep the
// same palette on every slide — only pose, expression and props change.
//
// Local coordinate space: feet sit on y = 0, the figure stands ~320 units tall.
//   hip y = -118 · shoulder y = -196 · head centre y = -262 (r 46)

export const SKIN = { a: "#F2C69C", b: "#D9A273" };
export const HAIR = { a: "#2B211B", b: "#1F1915" };

export const CAST = {
  // "Started in September" — gold jumper, always the one who is ahead.
  a: {
    skin: SKIN.a,
    hair: HAIR.a,
    jumper: "#D6A73C",
    jumperDark: "#B2872A",
    trousers: "#2F5A4D",
    trousersDark: "#274C41",
    hairStyle: "bun",
  },
  // "Started later" — sage jumper, always a step behind.
  b: {
    skin: SKIN.b,
    hair: HAIR.b,
    jumper: "#93A79B",
    jumperDark: "#7A8E82",
    trousers: "#2F5A4D",
    trousersDark: "#274C41",
    hairStyle: "short",
  },
};

const SHOE = "#1B322B";
const INK = "#22312C";

// Joint offsets from the shoulder: [elbow, hand]. Written for the right side;
// the left side mirrors x automatically.
const ARM = {
  down: [[8, 36], [12, 72]],
  swingFwd: [[14, 32], [30, 62]],
  swingBack: [[-10, 34], [-24, 64]],
  hold: [[10, 32], [44, 30]], // forearm out front, e.g. carrying books
  carry: [[9, 34], [13, 68]], // straight down, a folder tucked at the side
  holdHigh: [[8, 22], [40, 6]],
  up: [[20, -26], [30, -100]], // arms thrown up, clear of the head
  reach: [[16, -14], [30, -62]],
  outUp: [[34, 14], [56, -12]], // shrug / palms up
  write: [[16, 30], [52, 46]],
  point: [[18, 8], [58, -6]],
  hip: [[26, 22], [16, 46]],
  head: [[16, -14], [4, -44]], // hand to the head
};

// Note: the left side mirrors x, so a walk is `strideFwd` on BOTH legs — the mirror
// puts the left leg behind the body and the right leg out in front.
const LEG = {
  stand: [[2, 58], [3, 112]],
  strideFwd: [[18, 52], [34, 110]],
  strideBack: [[-16, 54], [-32, 108]],
  apart: [[10, 56], [18, 112]],
  sit: [[54, 2], [56, 50]], // used together with lift:-60 (hip drops onto a chair)
  sitBack: [[48, 4], [50, 52]],
  kneel: [[30, 30], [8, 60]],
};

const pathFrom = (sx, sy, joints, side) => {
  let d = `M ${sx} ${sy}`;
  let hand = [sx, sy];
  for (const [dx, dy] of joints) {
    hand = [sx + dx * side, sy + dy];
    d += ` L ${hand[0]} ${hand[1]}`;
  }
  return { d, hand };
};

function faceMarks(face) {
  const eye = (cx) => `<circle cx="${cx}" cy="-268" r="4.6" fill="${INK}"/>`;
  const eyes = { open: eye(-15) + eye(15) };
  let extra = "";
  let mouth = "";

  switch (face) {
    case "happy":
      mouth = `<path d="M -12 -250 Q 0 -238 12 -250" fill="none" stroke="${INK}"
        stroke-width="3.4" stroke-linecap="round"/>`;
      break;
    case "calm":
      mouth = `<path d="M -9 -248 Q 0 -242 9 -248" fill="none" stroke="${INK}"
        stroke-width="3.2" stroke-linecap="round"/>`;
      break;
    case "focused":
      mouth = `<path d="M -8 -246 H 8" fill="none" stroke="${INK}"
        stroke-width="3.2" stroke-linecap="round"/>`;
      extra = `<path d="M -24 -284 L -8 -280 M 24 -284 L 8 -280" stroke="${INK}"
        stroke-width="3" stroke-linecap="round" opacity="0.8"/>`;
      break;
    case "worried":
      mouth = `<path d="M -10 -242 Q 0 -251 10 -242" fill="none" stroke="${INK}"
        stroke-width="3.2" stroke-linecap="round"/>`;
      extra = `<path d="M -26 -286 L -9 -279 M 26 -286 L 9 -279" stroke="${INK}"
        stroke-width="3" stroke-linecap="round" opacity="0.85"/>`;
      break;
    case "tired":
      mouth = `<path d="M -9 -243 Q 0 -248 9 -243" fill="none" stroke="${INK}"
        stroke-width="3.2" stroke-linecap="round"/>`;
      extra = `<path d="M -22 -276 L -8 -276 M 22 -276 L 8 -276" stroke="${INK}"
        stroke-width="3" stroke-linecap="round" opacity="0.8"/>`;
      break;
    default:
      mouth = `<path d="M -9 -248 Q 0 -242 9 -248" fill="none" stroke="${INK}"
        stroke-width="3.2" stroke-linecap="round"/>`;
  }
  return eyes.open + mouth + extra;
}

function hairShape(style, hair) {
  const back = `<circle cx="0" cy="-266" r="48.5" fill="${hair}"/>`;
  if (style === "bun") {
    return {
      back: `<circle cx="0" cy="-306" r="21" fill="${hair}"/>${back}`,
      front: `<path d="M -47 -268 A 47 47 0 0 1 46 -272 C 30 -296 -14 -292 -47 -268 Z" fill="${hair}"/>
              <path d="M -46 -272 C -50 -246 -46 -230 -40 -222 C -52 -228 -58 -250 -56 -272 Z" fill="${hair}"/>`,
    };
  }
  // short, side-parted
  return {
    back,
    front: `<path d="M -47 -266 A 47 47 0 0 1 47 -270 C 30 -292 -8 -286 -26 -272 C -34 -266 -42 -264 -47 -266 Z"
              fill="${hair}"/>`,
  };
}

/**
 * Draw a student.
 * @param {object} o - cast entry fields plus pose/props overrides.
 */
export function figure(o) {
  const {
    x = 0,
    y = 0,
    s = 1,
    flip = false,
    cast = "a",
    face = "calm",
    armL = "down",
    armR = "down",
    legL = "stand",
    legR = "stand",
    lift = 0, // raise the whole body (used when seated)
    shadow = "rgba(0,0,0,0.2)",
    shadowScale = 1,
    behind = "",
    front = "",
    tilt = 0,
    lean = 0, // whole-body rotation about the feet, for walking figures
  } = o;

  const c = { ...CAST[cast], ...o };
  const armW = 21;
  const legW = 25;

  const arm = (side, key, color) => {
    const { d, hand } = pathFrom(40 * side, -196 - lift, ARM[key] ?? ARM.down, side);
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${armW}"
        stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${hand[0]}" cy="${hand[1]}" r="11" fill="${c.skin}"/>`;
  };

  const leg = (side, key, color) => {
    const { d, hand } = pathFrom(20 * side, -118 - lift, LEG[key] ?? LEG.stand, side);
    const footDir = (LEG[key] ?? LEG.stand).at(-1)[0] >= 0 ? 1 : -1;
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${legW}"
        stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="${hand[0] + 7 * side * footDir}" cy="${hand[1] + 6}" rx="18" ry="9" fill="${SHOE}"/>`;
  };

  const hair = hairShape(c.hairStyle, c.hair);

  const body = `
    ${behind}
    ${leg(-1, legL, c.trousersDark)}
    ${arm(-1, armL, c.jumperDark)}
    ${leg(1, legR, c.trousers)}
    <rect x="-40" y="${-224 - lift}" width="80" height="${106}" rx="34" fill="${c.jumper}"/>
    <path d="M -22 ${-224 - lift} Q 0 ${-206 - lift} 22 ${-224 - lift}" fill="${c.jumperDark}" opacity="0.55"/>
    <rect x="-13" y="${-238 - lift}" width="26" height="26" rx="8" fill="${c.skin}"/>
    ${arm(1, armR, c.jumper)}
    <g transform="translate(0 ${-lift}) rotate(${tilt} 0 -240)">
      ${hair.back}
      <circle cx="0" cy="-262" r="46" fill="${c.skin}"/>
      ${hair.front}
      ${faceMarks(face)}
    </g>
    ${front}`;

  return `<g transform="translate(${x} ${y}) scale(${s * (flip ? -1 : 1)} ${s})">
      <ellipse cx="0" cy="6" rx="${56 * shadowScale}" ry="11" fill="${shadow}"/>
      <g transform="rotate(${lean})">${body}</g>
    </g>`;
}

/* ------------------------------------------------------------------ props */

export const props = {
  /** A held book / folder, centred on (x,y). */
  book({ x, y, w = 74, h = 56, rot = 0, fill = "#E8E1D2", spine = "#B2872A" }) {
    return `<g transform="translate(${x} ${y}) rotate(${rot})">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="6" fill="${fill}"/>
      <rect x="${-w / 2}" y="${-h / 2}" width="12" height="${h}" rx="4" fill="${spine}"/>
      <path d="M ${-w / 2 + 24} ${-h / 2 + 16} H ${w / 2 - 12} M ${-w / 2 + 24} ${-h / 2 + 30} H ${w / 2 - 20}"
        stroke="#B9AF9A" stroke-width="3" stroke-linecap="round"/>
    </g>`;
  },

  /** Neat stack of books sitting on (x,y) as its base. */
  bookStack({ x, y, colors = ["#D6A73C", "#E8E1D2", "#93A79B"], w = 96, h = 17 }) {
    return colors
      .map((fill, i) => {
        const ww = w - i * 8;
        return `<g transform="translate(${x} ${y - i * (h + 4)})">
          <rect x="${-ww / 2}" y="${-h}" width="${ww}" height="${h}" rx="5" fill="${fill}"/>
          <rect x="${-ww / 2}" y="${-h}" width="${ww}" height="5" rx="2.5" fill="rgba(255,255,255,0.25)"/>
        </g>`;
      })
      .join("");
  },

  /** A single sheet of paper. */
  sheet({ x, y, rot = 0, w = 46, h = 60, fill = "#E7DFCD", line = "#B3A88F" }) {
    return `<g transform="translate(${x} ${y}) rotate(${rot})">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4" fill="${fill}"
        stroke="rgba(20,20,15,0.10)" stroke-width="1.5"/>
      ${[0, 1, 2]
        .map(
          (i) =>
            `<path d="M ${-w / 2 + 9} ${-h / 2 + 16 + i * 12} H ${w / 2 - 9 - i * 4}"
              stroke="${line}" stroke-width="3" stroke-linecap="round"/>`,
        )
        .join("")}
    </g>`;
  },

  /** Papers strewn around a point — the "whatever came home that week" pile. */
  scatter({ x, y, spread = 130 }) {
    const items = [
      [-1.0, 0.1, -24],
      [-0.45, -0.28, 14],
      [0.15, 0.16, -8],
      [0.72, -0.1, 26],
      [1.05, 0.24, -16],
    ];
    return items
      .map(([dx, dy, rot]) =>
        props.sheet({ x: x + dx * spread, y: y + dy * spread * 0.5, rot, w: 42, h: 54 }),
      )
      .join("");
  },

  /** Tier card, e.g. HIGHER / FOUNDATION. */
  tierCard({ x, y, text, rot = 0, fill = "#D6A73C", ink = "#0A3A2B", w = 168, h = 84, dashed = false }) {
    return `<g transform="translate(${x} ${y}) rotate(${rot})">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="12" fill="${fill}"
        ${dashed ? `stroke="${ink}" stroke-width="2.5" stroke-dasharray="8 7" opacity="0.9"` : ""}/>
      <text x="0" y="8" text-anchor="middle" font-family="Jost" font-size="24" font-weight="600"
        letter-spacing="4" fill="${ink}">${text}</text>
    </g>`;
  },

  /** Bouncing question marks for the student who is still catching up. */
  questions({ x, y, color = "#93A79B" }) {
    const marks = [
      [0, 0, 40, 0.95, -12],
      [44, -34, 30, 0.7, 10],
      [78, -4, 22, 0.5, -6],
    ];
    return marks
      .map(
        ([dx, dy, size, op, rot]) =>
          `<text x="${x + dx}" y="${y + dy}" font-family="Playfair Display" font-size="${size}"
            font-weight="700" fill="${color}" opacity="${op}"
            transform="rotate(${rot} ${x + dx} ${y + dy})">?</text>`,
      )
      .join("");
  },

  /** Simple clock face — time passing. */
  clock({ x, y, r = 30, color = "#93A79B", hands = "#0A3A2B" }) {
    return `<g transform="translate(${x} ${y})">
      <circle r="${r}" fill="${color}"/>
      <circle r="${r - 7}" fill="rgba(255,255,255,0.55)"/>
      <path d="M 0 0 V ${-(r - 15)} M 0 0 L ${r - 13} 6" stroke="${hands}" stroke-width="4"
        stroke-linecap="round"/>
    </g>`;
  },

  /**
   * Desk standing on the ground line at `y`; `h` is the height of the top surface
   * above that line, so the seated figure's forearm lands on it.
   */
  desk({ x, y, w = 250, h = 96, top = "#C9A97E", leg = "#A98A61" }) {
    return `<g transform="translate(${x} ${y})">
      <rect x="${-w / 2}" y="${-h}" width="${w}" height="15" rx="6" fill="${top}"/>
      <rect x="${-w / 2 + 18}" y="${-h + 15}" width="13" height="${h - 15}" rx="5" fill="${leg}"/>
      <rect x="${w / 2 - 31}" y="${-h + 15}" width="13" height="${h - 15}" rx="5" fill="${leg}"/>
    </g>`;
  },

  /** Chair for a seated figure, drawn behind them (hips land on the seat). */
  chair({ x = 0, y = 0, fill = "#274C41" }) {
    return `<g transform="translate(${x} ${y})">
      <rect x="-64" y="-46" width="96" height="14" rx="6" fill="${fill}"/>
      <rect x="-64" y="-150" width="16" height="106" rx="7" fill="${fill}"/>
      <rect x="-58" y="-32" width="11" height="32" rx="5" fill="${fill}"/>
      <rect x="14" y="-32" width="11" height="32" rx="5" fill="${fill}"/>
    </g>`;
  },

  /** Checklist card with ticked rows — revision, in order. */
  checklist({ x, y, rot = -6, rows = 4, w = 104, fill = "#EFE9DC", tick = "#B08A22" }) {
    const h = 26 + rows * 22;
    return `<g transform="translate(${x} ${y}) rotate(${rot})">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="8" fill="${fill}"/>
      ${Array.from({ length: rows })
        .map((_, i) => {
          const yy = -h / 2 + 26 + i * 22;
          return `<path d="M ${-w / 2 + 14} ${yy - 3} l 6 7 l 11 -14" fill="none" stroke="${tick}"
              stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M ${-w / 2 + 40} ${yy} H ${w / 2 - 12}" stroke="#BDB3A0" stroke-width="4"
              stroke-linecap="round"/>`;
        })
        .join("")}
    </g>`;
  },

  /** Exam paper being written on. */
  paperOnDesk({ x, y, rot = -4, fill = "#EFE9DC" }) {
    return `<g transform="translate(${x} ${y}) rotate(${rot})">
      <rect x="-52" y="-34" width="104" height="68" rx="5" fill="${fill}"/>
      ${[0, 1, 2, 3]
        .map((i) => `<path d="M -38 ${-16 + i * 14} H ${34 - (i % 2) * 14}" stroke="#BDB3A0"
          stroke-width="3.5" stroke-linecap="round"/>`)
        .join("")}
    </g>`;
  },

  /** The ground / progress track the students walk along. */
  track({ x1, x2, y, color, dash = false, width = 3 }) {
    return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}"
      stroke-width="${width}" stroke-linecap="round"
      ${dash ? 'stroke-dasharray="2 14"' : ""}/>`;
  },

  /** Dashed start gate / finish ribbon. */
  gate({ x, y, h = 250, color, ribbon = false, flagFill = "#D6A73C" }) {
    return `<g>
      <line x1="${x}" y1="${y}" x2="${x}" y2="${y - h}" stroke="${color}" stroke-width="3"
        stroke-dasharray="10 10" opacity="0.75"/>
      ${
        ribbon
          ? `<path d="M ${x} ${y - h} h 62 l -14 20 l 14 20 h -62 z" fill="${flagFill}"/>`
          : ""
      }
    </g>`;
  },

  /** Small upward arrow — chose it. */
  arrowUp({ x, y, len = 74, color = "#D6A73C" }) {
    return `<g stroke="${color}" stroke-width="5" stroke-linecap="round" fill="none">
      <path d="M ${x} ${y} V ${y - len}"/>
      <path d="M ${x - 14} ${y - len + 16} L ${x} ${y - len} L ${x + 14} ${y - len + 16}"/>
    </g>`;
  },

  /** Small downward arrow — placed there. */
  arrowDown({ x, y, len = 74, color = "#93A79B", dashed = true }) {
    return `<g stroke="${color}" stroke-width="5" stroke-linecap="round" fill="none">
      <path d="M ${x} ${y - len} V ${y}" ${dashed ? 'stroke-dasharray="9 9"' : ""}/>
      <path d="M ${x - 14} ${y - 16} L ${x} ${y} L ${x + 14} ${y - 16}"/>
    </g>`;
  },

  /** Sideways arrow — the tier handed to you rather than chosen. */
  arrowRight({ x, y, len = 74, color = "#8A9C91", dashed = true }) {
    return `<g stroke="${color}" stroke-width="5" stroke-linecap="round" fill="none">
      <path d="M ${x} ${y} H ${x + len}" ${dashed ? 'stroke-dasharray="9 9"' : ""}/>
      <path d="M ${x + len - 16} ${y - 14} L ${x + len} ${y} L ${x + len - 16} ${y + 14}"/>
    </g>`;
  },

  /** Motion ticks behind a walking figure. */
  speed({ x, y, color, count = 3 }) {
    return Array.from({ length: count })
      .map(
        (_, i) =>
          `<path d="M ${x - i * 26} ${y - i * 16} h ${34 - i * 6}" stroke="${color}"
            stroke-width="4" stroke-linecap="round" opacity="${0.5 - i * 0.13}"/>`,
      )
      .join("");
  },
};
