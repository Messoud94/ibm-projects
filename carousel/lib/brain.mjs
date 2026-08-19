// Hand-drawn style brain, viewed from above, with a fill level.
//
// Drawn from scratch as two mirrored hemispheres so it can be filled to any
// height: the colour is clipped to the silhouette and capped with a darker
// "surface" ellipse, the way a part-filled vessel reads.
//
// Local space: ~300 wide, ~320 tall, centred on (0, 0).

const TOP = -170;
const BOTTOM = 148;

/** Negates the x of every "x y" pair, so a right-hand path becomes its mirror. */
const mirrorPath = (d) =>
  d.replace(/(-?[\d.]+)(\s+)(-?[\d.]+)/g, (_, x, sp, y) => `${-Number(x)}${sp}${y}`);

// Right hemisphere: lobed outer edge, closed straight back up the midline.
const HALF_R = `M 0 -170
  C 26 -176 52 -170 66 -152
  C 84 -160 104 -148 106 -128
  C 128 -128 142 -110 138 -90
  C 152 -80 154 -56 142 -42
  C 152 -28 150 -6 136 6
  C 146 22 142 46 126 56
  C 132 76 122 98 104 104
  C 104 124 86 142 64 144
  C 52 158 30 164 12 158
  C 6 156 2 152 0 148 Z`;

const HALF_L = mirrorPath(HALF_R);

/** Gyri for the right hemisphere; the left side is the same set, mirrored. */
const GYRI_R = [
  "M 22 -138 C 44 -142 58 -128 52 -112 C 46 -98 26 -98 22 -110",
  "M 62 -130 C 78 -120 82 -104 74 -96",
  "M 96 -112 C 108 -102 110 -88 102 -82",
  "M 18 -88 C 40 -80 62 -84 78 -96",
  "M 92 -66 C 104 -60 108 -50 104 -42",
  "M 24 -56 C 46 -48 68 -52 84 -62",
  "M 22 -26 C 44 -16 70 -20 92 -30",
  "M 108 -20 C 116 -12 116 0 110 8",
  "M 26 6 C 48 16 72 12 90 2",
  "M 30 36 C 52 46 76 42 94 32",
  "M 100 46 C 108 54 106 66 98 72",
  "M 36 68 C 56 78 76 74 90 66",
  "M 30 100 C 48 112 68 110 82 100",
  "M 60 -72 C 64 -62 62 -52 56 -46",
  "M 46 116 C 52 126 52 134 48 140",
];

const GYRI_L = GYRI_R.map(mirrorPath);

/**
 * @param {object} o
 * @param {number} o.level  0 = empty, 1 = full
 * @param {string} o.fill   colour of the filled part
 * @param {string} o.deep   darker shade for the exposed surface at the fill line
 * @param {string} o.stroke line work colour
 * @param {string} o.id     unique suffix for this brain's clipPath
 */
export function brain({
  x = 0,
  y = 0,
  s = 1,
  level = 0.33,
  fill = "#D2A63C",
  deep = "#A87F22",
  stroke = "#F4EFE6",
  lineWidth = 5,
  id = Math.random().toString(36).slice(2, 8),
}) {
  const surface = BOTTOM - level * (BOTTOM - TOP); // y of the fill line
  // Rough half-width of the silhouette at a given y — the clip does the real
  // work, this just keeps the surface ellipse from bulging at the extremes.
  const halfWidth = (yy) => 152 * Math.sqrt(Math.max(0, 1 - (yy / 196) ** 2));
  const clipId = `brain-clip-${id}`;

  const line = (d, w) =>
    `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}"
      stroke-linecap="round" stroke-linejoin="round"/>`;

  return `<g transform="translate(${x} ${y}) scale(${s})">
    <defs><clipPath id="${clipId}">
      <path d="${HALF_R}"/><path d="${HALF_L}"/>
    </clipPath></defs>

    <g clip-path="url(#${clipId})">
      <rect x="-170" y="${surface}" width="340" height="${BOTTOM - surface + 30}" fill="${fill}"/>
      <ellipse cx="0" cy="${surface}" rx="${halfWidth(surface).toFixed(1)}" ry="13" fill="${deep}"/>
    </g>

    ${line(HALF_R, lineWidth)}${line(HALF_L, lineWidth)}
    ${[...GYRI_R, ...GYRI_L].map((d) => line(d, lineWidth - 1.4)).join("")}
  </g>`;
}
