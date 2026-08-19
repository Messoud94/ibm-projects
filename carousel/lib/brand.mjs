// The Study Lab — brand kit for the 1080x1080 carousel slides.
// Everything is drawn as SVG so the layout is deterministic and re-renderable.

export const W = 1080;
export const H = 1080;
export const M = 84; // page margin used by every element

export const THEME = {
  green: {
    bg: "#0A3A2B",
    panel: "rgba(245, 240, 232, 0.045)",
    head: "#F4EFE6", // headline
    body: "#DCE4DC",
    muted: "#9FB0A6",
    gold: "#D2A63C",
    rule: "rgba(210, 166, 60, 0.30)",
    footRule: "rgba(159, 176, 166, 0.28)",
    ground: "rgba(245, 240, 232, 0.18)",
    shadow: "rgba(0, 0, 0, 0.22)",
    logo: "#D2A63C",
    logoWord: "#F4EFE6",
  },
  cream: {
    bg: "#F5F0E8",
    panel: "rgba(10, 58, 43, 0.035)",
    head: "#14140F",
    body: "#4A4A45",
    muted: "#7A776E",
    gold: "#B08A22",
    rule: "rgba(176, 138, 34, 0.35)",
    footRule: "rgba(122, 119, 110, 0.30)",
    ground: "rgba(20, 20, 15, 0.14)",
    shadow: "rgba(20, 20, 15, 0.08)",
    logo: "#B08A22",
    logoWord: "#3B3226",
  },
};

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const SERIF = "Playfair Display";
const SANS = "Jost";

/** A letterspaced sans label (eyebrows, months, footers). */
export function label(text, { x, y, size = 22, fill, weight = 500, track = 4.5, anchor = "start" }) {
  return `<text x="${x}" y="${y}" font-family="${SANS}" font-size="${size}" font-weight="${weight}"
    letter-spacing="${track}" fill="${fill}" text-anchor="${anchor}">${esc(text)}</text>`;
}

/** Body copy: array of pre-broken lines. */
export function copy(lines, { x, y, size = 27, lead = 41, fill, weight = 300, anchor = "start" }) {
  return lines
    .map(
      (l, i) =>
        `<text x="${x}" y="${y + i * lead}" font-family="${SANS}" font-size="${size}"
          font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(l)}</text>`,
    )
    .join("\n");
}

/**
 * Serif headline. Each line is a string or an array of runs:
 * ["One is ", {t:"choosing", italic:true, gold:true}, " Higher."]
 */
export function headline(lines, { x, y, size = 58, lead = 68, fill, gold, anchor = "start" }) {
  return lines
    .map((line, i) => {
      const runs = Array.isArray(line) ? line : [line];
      const spans = runs
        .map((r) => {
          if (typeof r === "string") return esc(r);
          const style = r.italic ? ` font-style="italic"` : "";
          const paint = r.gold ? ` fill="${gold}"` : "";
          return `<tspan${style}${paint}>${esc(r.t)}</tspan>`;
        })
        .join("");
      return `<text x="${x}" y="${y + i * lead}" font-family="${SERIF}" font-size="${size}"
        font-weight="400" fill="${fill}" text-anchor="${anchor}">${spans}</text>`;
    })
    .join("\n");
}

/** Shield + TS monogram, drawn at 1:1 inside a 92x108 box with its top-left at (x,y). */
export function shield(x, y, color, scale = 1) {
  const g = `
    <path d="M 4 4 H 88 V 62 C 88 88 68 100 46 106 C 24 100 4 88 4 62 Z"
      fill="none" stroke="${color}" stroke-width="4"/>
    <path d="M 13 13 H 79 V 61 C 79 82 63 92 46 97 C 29 92 13 82 13 61 Z"
      fill="none" stroke="${color}" stroke-width="2" opacity="0.75"/>
    <path d="M 26 34 H 66" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <path d="M 46 30 V 82" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <path d="M 62 42 C 62 33 52 31 45 35 C 37 39 37 50 46 54 C 56 58 57 69 48 73
             C 41 76 32 74 31 66"
      fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${scale})">${g}</g>`;
}

/** Header lockup. Green slides use the horizontal lockup, cream slides the stacked one. */
export function header(t, { index, total = 6, stacked = false }) {
  const idx = label(`${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, {
    x: W - M,
    y: 104,
    size: 22,
    fill: t.muted,
    weight: 400,
    track: 5,
    anchor: "end",
  });

  if (stacked) {
    return `
      ${shield(M + 50, 88, t.logo, 0.78)}
      <text x="${M}" y="205" font-family="${SERIF}" font-size="27" font-weight="400"
        letter-spacing="2.5" fill="${t.logoWord}">THE STUDY LAB</text>
      ${idx}`;
  }
  return `
    ${shield(M, 88, t.logo, 0.9)}
    <text x="${M + 106}" y="152" font-family="${SERIF}" font-size="34" font-weight="400"
      letter-spacing="6" fill="${t.logoWord}">THE STUDY LAB</text>
    ${idx}`;
}

const STOPS = [
  { key: "SEP", dot: 156, label: M, anchor: "start" },
  { key: "NOV", dot: 430, label: 353, anchor: "start" },
  { key: "SPRING", dot: 704, label: 630, anchor: "start" },
  { key: "MAY", dot: 960, label: W - M, anchor: "end" },
];

/**
 * The progress rail. `active` is the index of the filled dot (0-3, -1 for none);
 * every stop before it is drawn hollow, exactly like the source cards.
 */
export function timeline(t, { y = 852, active = 0, all = false }) {
  const line = `<line x1="${M}" y1="${y}" x2="${W - M}" y2="${y}" stroke="${t.gold}"
    stroke-width="2" opacity="${all ? 0.9 : 0.55}"/>`;

  const dots = STOPS.map((s, i) => {
    const on = all || i === active;
    const shown = all || i <= active;
    if (!shown) return "";
    const r = on ? 15 : 12;
    return `<circle cx="${s.dot}" cy="${y}" r="${r}" fill="${on ? t.gold : t.bg}"
      stroke="${t.gold}" stroke-width="${on ? 0 : 2.5}"/>`;
  }).join("\n");

  const labels = STOPS.map((s) =>
    label(s.key, {
      x: s.label,
      y: y + 50,
      size: 21,
      fill: t.muted,
      weight: 500,
      track: 4.5,
      anchor: s.anchor,
    }),
  ).join("\n");

  return line + dots + labels;
}

export function footer(t, { left, right = "THESTUDYLAB.AE" }) {
  return `
    <line x1="${M}" y1="944" x2="${W - M}" y2="944" stroke="${t.footRule}" stroke-width="1.5"/>
    ${left ? label(left, { x: M, y: 998, size: 24, fill: t.muted, weight: 300, track: 0.4 }) : ""}
    ${label(right, { x: W - M, y: 998, size: 24, fill: t.head, weight: 500, track: 2.4, anchor: "end" })}`;
}

/** Soft rounded panel that the illustration sits on, so the figures read on both themes. */
export function panel(t, { x = M, y, w = W - M * 2, h, r = 28 }) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${t.panel}"/>`;
}
