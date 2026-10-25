// Small SVG helpers shared by the 2D samples.
const f = (n) => (Math.round(n * 100) / 100).toString();

// Catmull-Rom through points; [x, y, 1] marks a corner
export function sp(pts, closed = false, k = 1 / 6) {
  const n = pts.length;
  const P = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}

export function attrs(a) {
  return Object.entries(a).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => `${k}="${v}"`).join(' ');
}
export const el = (tag, a = {}, inner = '') => `<${tag} ${attrs(a)}>${inner}</${tag}>`;
export const P = (d, a = {}) => `<path d="${d}" ${attrs(a)}/>`;
export const G = (a, inner) => el('g', a, inner);
export const rect = (x, y, w, h, a = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${attrs(a)}/>`;
export const circle = (cx, cy, r, a = {}) => `<circle cx="${cx}" cy="${cy}" r="${r}" ${attrs(a)}/>`;
export const ellipse = (cx, cy, rx, ry, a = {}) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${attrs(a)}/>`;
export const text = (x, y, s, a = {}) => `<text x="${x}" y="${y}" ${attrs(a)}>${s}</text>`;

export function mulberry(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// HML palette: brand navy, the logo's orange-to-yellow, plus supporting tones
export const C = {
  navy: '#1e4c8f', navyDeep: '#163463', navyNight: '#13294f', sky: '#2a5ba0',
  orange: '#f0561e', amber: '#f7931e', yellow: '#ffc93c', cream: '#fff7ec', snow: '#fbfaf7',
  coral: '#f2876b', pink: '#f59bb5', maroon: '#7a1f2b', ice: '#bfe3ff',
  grey0: '#ecebe8', grey1: '#d9d6d1', grey2: '#bdb9b2', grey3: '#8f8a84', grey4: '#5f5a55',
  skin: '#f3cdb0', skinShade: '#e5b597', hair: '#1c1818', ink: '#1c1818',
};
