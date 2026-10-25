// Option 1, "Words build the world": flat vector, typography is the hero.
// The turn: a grey wall of memorised words on the left; words fly out and become a snowy Ulaanbaatar evening.
import { sp, P, G, rect, circle, ellipse, text, el, mulberry, C } from './lib2d.js';

const W = 1080, H = 1920;
const NUN = 'Nunito, sans-serif';

const DRAWER_WORDS = [
  ['run', 'cold', 'snow'], ['early', 'wait', 'late'], ['friend', 'coat', 'home'], ['school', 'warm', 'street'],
  ['happy', 'bus', 'window'], ['catch', 'city', 'because'], ['morning', 'quickly', 'winter'], ['missed', 'go', 'sorry'],
];
const OPEN = { '0,2': 'snowing', '1,2': 'late', '4,1': 'bus', '5,2': 'because' };
const dx = (c) => 72 + c * 106, dy = (r) => 500 + r * 100;

export function cabinet() {
  let s = '';
  s += rect(46, 452, 368, 868, { rx: 18, fill: C.grey2 });
  s += rect(34, 436, 392, 34, { rx: 10, fill: C.grey3 });               // cornice
  s += rect(58, 1316, 344, 22, { rx: 6, fill: C.grey3 });                // plinth
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 3; c++) {
      const x = dx(c), y = dy(r), key = `${r},${c}`;
      if (OPEN[key]) {
        // the drawer slides out towards us: dark hole, side wall, empty label
        s += rect(x, y, 98, 92, { rx: 6, fill: C.grey4 });
        s += P(`M${x + 98} ${y + 4}L${x + 112} ${y + 26}L${x + 112} ${y + 112}L${x + 98} ${y + 92}Z`, { fill: C.grey3 });
        s += rect(x + 12, y + 24, 100, 90, { rx: 6, fill: C.grey1, stroke: C.grey3, 'stroke-width': 2 });
        s += rect(x + 31, y + 40, 62, 26, { rx: 4, fill: '#f4f2ee', stroke: C.grey2, 'stroke-width': 1.5 });
        s += circle(x + 62, y + 88, 6, { fill: C.grey3 });
      } else {
        s += rect(x, y, 98, 92, { rx: 6, fill: C.grey1, stroke: C.grey3, 'stroke-width': 2 });
        s += rect(x + 13, y + 16, 72, 30, { rx: 4, fill: '#f4f2ee', stroke: C.grey2, 'stroke-width': 1.5 });
        s += text(x + 49, y + 37, DRAWER_WORDS[r][c], { 'font-family': NUN, 'font-weight': 800, 'font-size': 18, fill: C.grey3, 'text-anchor': 'middle' });
        s += circle(x + 49, y + 68, 6, { fill: C.grey3 });
      }
    }
  }
  return s;
}

const SKY = sp([[430, 0, 1], [1080, 0, 1], [1080, 1192, 1], [486, 1192, 1], [452, 1060], [540, 880], [528, 690], [470, 470], [410, 240], [430, 0, 1]], true);

function sky() {
  let s = el('defs', {},
    el('linearGradient', { id: 'skyg', x1: 0, y1: 0, x2: 0, y2: 1 },
      '<stop offset="0" stop-color="#112449"/><stop offset=".55" stop-color="#1e4c8f"/><stop offset=".86" stop-color="#3a6fb5"/><stop offset=".95" stop-color="#f7931e"/><stop offset="1" stop-color="#ffc93c"/>') +
    el('linearGradient', { id: 'busg', x1: 0, y1: 0, x2: 0, y2: 1 }, '<stop offset="0" stop-color="#ffd35a"/><stop offset="1" stop-color="#f7931e"/>') +
    el('clipPath', { id: 'skyclip' }, P(SKY)));
  s += P(SKY, { fill: 'url(#skyg)' });
  let c = '';
  // hills with gers at the edge of the city
  c += P(sp([[440, 1200, 1], [470, 1120], [560, 1094], [650, 1124], [700, 1200, 1]], true), { fill: '#2c5fa6' });
  [[520, 1112, 1], [586, 1104, 0.85], [636, 1124, 0.7]].forEach(([x, y, k]) => {
    c += P(`M${x - 30 * k} ${y + 18 * k}L${x - 30 * k} ${y + 4 * k}Q${x} ${y - 22 * k} ${x + 30 * k} ${y + 4 * k}L${x + 30 * k} ${y + 18 * k}Z`, { fill: C.snow });
    c += rect(x - 6 * k, y + 4 * k, 12 * k, 14 * k, { fill: C.orange });
  });
  // apartment blocks with lit windows, and the Blue Sky tower's glass sail
  const rnd = mulberry(7);
  [[690, 900, 120], [800, 960, 90], [1000, 860, 100], [600, 1000, 90]].forEach(([x, y, w]) => {
    c += rect(x, y, w, 1200 - y, { fill: '#173a73' });
    for (let yy = y + 18; yy < 1180; yy += 30) for (let xx = x + 12; xx < x + w - 14; xx += 24) {
      if (rnd() < 0.55) c += rect(xx, yy, 12, 14, { rx: 2, fill: rnd() < 0.7 ? C.yellow : C.amber, opacity: 0.95 });
    }
  });
  c += P(`M884 1200L884 700C936 722 984 820 996 1200Z`, { fill: '#7fb4e4' });
  for (let i = 0; i < 9; i++) c += P(`M884 ${730 + i * 52}L${930 + i * 6} ${742 + i * 52}`, { stroke: '#bfe0ff', 'stroke-width': 3, opacity: 0.8 });
  // falling snow written as words
  const r2 = mulberry(11);
  const busy = [[650, 330, 220, 70], [612, 612, 120, 60], [820, 560, 130, 130], [540, 236, 520, 70]];
  let placed = 0;
  for (let i = 0; i < 80 && placed < 16; i++) {
    const x = 500 + r2() * 560, y = 320 + r2() * 560, sz = 15 + r2() * 9, rot = (r2() - 0.5) * 50, op = 0.35 + r2() * 0.3;
    if (busy.some(([bx, by, rx, ry]) => Math.abs(x - bx) < rx && Math.abs(y - by) < ry)) continue;
    placed++;
    c += text(x, y, 'snow', { 'font-family': NUN, 'font-weight': 800, 'font-size': sz, fill: '#fff', opacity: op, transform: `rotate(${rot} ${x} ${y})` });
  }
  s += G({ 'clip-path': 'url(#skyclip)' }, c);
  return s;
}

export function alarmClock(x, y, r) {
  let s = '';
  s += ellipse(x - r * 0.62, y - r * 0.92, r * 0.34, r * 0.24, { fill: C.yellow, transform: `rotate(-30 ${x - r * 0.62} ${y - r * 0.92})` });
  s += ellipse(x + r * 0.62, y - r * 0.92, r * 0.34, r * 0.24, { fill: C.yellow, transform: `rotate(30 ${x + r * 0.62} ${y - r * 0.92})` });
  s += P(`M${x - r * 0.6} ${y + r * 0.8}L${x - r * 0.8} ${y + r * 1.12}M${x + r * 0.6} ${y + r * 0.8}L${x + r * 0.8} ${y + r * 1.12}`, { stroke: C.amber, 'stroke-width': 10, 'stroke-linecap': 'round' });
  s += circle(x, y, r, { fill: C.orange });
  s += circle(x, y, r * 0.82, { fill: C.cream });
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    s += P(`M${x + Math.cos(a) * r * 0.7} ${y + Math.sin(a) * r * 0.7}L${x + Math.cos(a) * r * 0.62} ${y + Math.sin(a) * r * 0.62}`, { stroke: C.navy, 'stroke-width': 4, 'stroke-linecap': 'round' });
  }
  s += P(`M${x} ${y}L${x + r * 0.08} ${y - r * 0.55}`, { stroke: C.navy, 'stroke-width': 7, 'stroke-linecap': 'round' });
  s += P(`M${x} ${y}L${x - r * 0.4} ${y + r * 0.2}`, { stroke: C.navy, 'stroke-width': 7, 'stroke-linecap': 'round' });
  s += circle(x, y, 7, { fill: C.navy });
  s += text(x, y + r * 0.5, 'late', { 'font-family': NUN, 'font-weight': 900, 'font-size': r * 0.42, fill: C.orange, 'text-anchor': 'middle' });
  return s;
}

export function bus(x, y) {
  // faces right; its three side windows spell the word
  let s = '';
  s += rect(x, y, 380, 150, { rx: 30, fill: 'url(#busg)' });
  s += P(`M${x + 14} ${y + 6}Q${x + 190} ${y - 26} ${x + 366} ${y + 6}L${x + 366} ${y + 14}L${x + 14} ${y + 14}Z`, { fill: C.snow });   // snow on the roof
  s += rect(x, y + 112, 380, 22, { fill: C.navy });
  ['B', 'U', 'S'].forEach((ch, i) => {
    const wx = x + 26 + i * 92;
    s += rect(wx, y + 26, 78, 72, { rx: 12, fill: C.navyDeep });
    s += text(wx + 39, y + 86, ch, { 'font-family': NUN, 'font-weight': 900, 'font-size': 66, fill: C.yellow, 'text-anchor': 'middle' });
  });
  s += rect(x + 304, y + 26, 60, 84, { rx: 12, fill: '#9fd0ff' });     // windscreen
  s += circle(x + 372, y + 124, 9, { fill: '#fff6c8' });
  [x + 80, x + 300].forEach((wx) => { s += circle(wx, y + 150, 30, { fill: C.navyNight }); s += circle(wx, y + 150, 12, { fill: C.grey2 }); });
  return s;
}

// a word in flight: faded ghosts along its path, the word itself leading
function flying(word, pts, at, size, color, rot = 0) {
  const d = sp(pts);
  let s = P(d, { fill: 'none', stroke: color, 'stroke-width': 3, 'stroke-dasharray': '2 14', 'stroke-linecap': 'round', opacity: 0.7 });
  const [x, y] = at;
  const w = word.length * size * 0.3;
  [-0.25, 0.05, 0.3].forEach((k, i) => {
    const yy = y - size * 0.35 + k * size;
    s += P(`M${x - w - 30 - i * 14} ${yy}L${x - w - 110 + i * 10} ${yy + 10}`, { stroke: color, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.55, transform: `rotate(${rot} ${x} ${y})` });
  });
  s += text(x, y, word, { 'font-family': NUN, 'font-weight': 900, 'font-size': size, fill: color, 'text-anchor': 'middle', stroke: C.navyNight, 'stroke-width': 8, 'paint-order': 'stroke', 'stroke-linejoin': 'round', transform: `rotate(${rot} ${x} ${y})` });
  // sparkles
  [[x + size * 1.4, y - size * 0.6, 9], [x - size * 1.2, y - size * 0.9, 6], [x + size * 0.6, y + size * 0.5, 5]].forEach(([sx, sy, r]) => {
    s += P(`M${sx} ${sy - r}Q${sx} ${sy} ${sx + r} ${sy}Q${sx} ${sy} ${sx} ${sy + r}Q${sx} ${sy} ${sx - r} ${sy}Q${sx} ${sy} ${sx} ${sy - r}Z`, { fill: C.yellow });
  });
  return s;
}

export function girl(x, y) {
  // flat, friendly, no outlines: a schoolgirl looking up and right at the words
  let s = '';
  const L = (d, fill, a = {}) => P(d, { fill, ...a });
  s += ellipse(x, y + 4, 90, 14, { fill: '#000', opacity: 0.08 });
  s += ellipse(x - 22, y - 8, 22, 11, { fill: '#2b2b33' }); s += ellipse(x + 26, y - 8, 22, 11, { fill: '#2b2b33' });
  s += rect(x - 32, y - 126, 20, 118, { rx: 8, fill: '#2a2f45' }); s += rect(x + 12, y - 126, 20, 118, { rx: 8, fill: '#2a2f45' });
  s += L(`M${x - 56} ${y - 200}L${x + 56} ${y - 200}L${x + 76} ${y - 116}L${x - 76} ${y - 116}Z`, C.maroon);                  // skirt
  for (let i = -2; i <= 2; i++) s += P(`M${x + i * 18} ${y - 196}L${x + i * 26} ${y - 120}`, { stroke: '#5c1620', 'stroke-width': 3 });
  s += L(sp([[x - 34, y - 300], [x - 62, y - 284], [x - 66, y - 196, 1], [x + 66, y - 196, 1], [x + 62, y - 284], [x + 34, y - 300]], true), C.navy);   // blazer
  s += L(`M${x - 18} ${y - 298}L${x} ${y - 252}L${x + 18} ${y - 298}Z`, C.snow);                                            // shirt
  s += L(`M${x - 34} ${y - 300}L${x - 4} ${y - 246}L${x - 22} ${y - 230}L${x - 40} ${y - 262}Z`, C.navyDeep);
  s += L(`M${x + 34} ${y - 300}L${x + 4} ${y - 246}L${x + 22} ${y - 230}L${x + 40} ${y - 262}Z`, C.navyDeep);
  s += L(`M${x + 24} ${y - 246}l20 0l0 18l-10 7l-10 -7Z`, C.amber);                                                         // HML crest
  s += L(sp([[x - 58, y - 282], [x - 74, y - 236], [x - 70, y - 186], [x - 54, y - 188], [x - 56, y - 236], [x - 44, y - 272]], true), C.navyDeep); // back arm
  s += circle(x - 62, y - 180, 13, { fill: C.skin });
  // front arm raised to the ribbon
  s += P(sp([[x + 46, y - 284], [x + 92, y - 304], [x + 122, y - 352]]), { fill: 'none', stroke: C.navy, 'stroke-width': 30, 'stroke-linecap': 'round' });
  s += circle(x + 126, y - 362, 15, { fill: C.skin });
  // neck, scarf
  s += rect(x - 10, y - 322, 24, 30, { fill: C.skinShade });
  s += P(sp([[x - 38, y - 306], [x, y - 296], [x + 40, y - 308], [x + 42, y - 290], [x, y - 276], [x - 40, y - 288]], true), { fill: C.coral });
  // head, tilted up toward the words
  let h = '';
  const hx = x + 6, hy = y - 368;
  h += P(sp([[hx - 78, hy + 40], [hx - 84, hy - 30], [hx - 50, hy - 86], [hx + 6, hy - 98], [hx + 62, hy - 74], [hx + 82, hy - 18], [hx + 74, hy + 40]], true), { fill: C.hair });   // hair behind
  h += P(sp([[hx - 62, hy - 4], [hx - 54, hy - 56], [hx, hy - 76], [hx + 56, hy - 56], [hx + 66, hy - 4], [hx + 54, hy + 44], [hx + 8, hy + 66], [hx - 44, hy + 46]], true), { fill: C.skin });
  h += P(sp([[hx - 70, hy + 6, 1], [hx - 64, hy - 52], [hx - 20, hy - 86], [hx + 30, hy - 84], [hx + 70, hy - 50], [hx + 72, hy - 2, 1], [hx + 50, hy - 26], [hx + 34, hy - 36, 1], [hx + 18, hy - 24], [hx - 2, hy - 38, 1], [hx - 22, hy - 24], [hx - 40, hy - 36, 1], [hx - 52, hy - 14]], true), { fill: C.hair });   // fringe
  h += circle(hx - 4, hy - 104, 28, { fill: C.hair });                                                                          // bun
  h += P(sp([[hx - 30, hy - 84], [hx - 4, hy - 76], [hx + 22, hy - 84]]), { fill: 'none', stroke: C.coral, 'stroke-width': 9, 'stroke-linecap': 'round' });  // hair tie
  h += ellipse(hx - 18, hy + 4, 9, 12.5, { fill: C.ink }); h += ellipse(hx + 26, hy + 2, 9, 12.5, { fill: C.ink });
  h += circle(hx - 21, hy - 1, 3.4, { fill: '#fff' }); h += circle(hx + 23, hy - 3, 3.4, { fill: '#fff' });
  h += ellipse(hx - 34, hy + 26, 12, 6.5, { fill: C.pink, opacity: 0.85 }); h += ellipse(hx + 44, hy + 24, 12, 6.5, { fill: C.pink, opacity: 0.85 });
  h += P(`M${hx - 6} ${hy + 30}Q${hx + 4} ${hy + 46} ${hx + 14} ${hy + 30}Z`, { fill: '#8a2b3a' });
  s += G({ transform: `rotate(-8 ${x + 6} ${y - 320})` }, h);
  return s;
}

function ribbon(from, to) {
  // the scarf's loose end becomes a ribbon that ties her sentence to the bus, "because" printed along it
  const pts = [from, [from[0] - 40, from[1] - 70], [from[0] - 70, from[1] - 140], [to[0] - 40, to[1] + 30], to];
  const d = sp(pts);
  let s = P(d, { fill: 'none', stroke: C.coral, 'stroke-width': 46, 'stroke-linecap': 'round' });
  s += P(d, { id: 'ribbonpath', fill: 'none', stroke: 'none' });
  s += `<text font-family="${NUN}" font-weight="900" font-size="30" fill="#fff" letter-spacing="1"><textPath href="#ribbonpath" startOffset="14%">because</textPath></text>`;
  return s;
}

function subtitle() {
  // Mongolian line, placed high and clear of Instagram's interface (wording to be checked by Batu)
  return text(540, 236, 'Үгийг цээжлэх биш, ойлгох.', {
    'font-family': NUN, 'font-weight': 900, 'font-size': 62, fill: '#fff', 'text-anchor': 'middle',
    stroke: C.navyDeep, 'stroke-width': 16, 'paint-order': 'stroke', 'stroke-linejoin': 'round',
  });
}

export function frame(t, q, stage) {
  let s = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  s += rect(0, 0, W, H, { fill: C.grey0 });
  s += sky();
  // snowy ground across the whole frame, the road and its tyre tracks
  s += P(sp([[0, 1250, 1], [300, 1214], [700, 1196], [1080, 1192, 1], [1080, 1920, 1], [0, 1920, 1]], true), { fill: C.snow });
  s += P(sp([[460, 1236, 1], [1080, 1222, 1], [1080, 1290, 1], [520, 1300, 1]], true), { fill: '#e3ecf6' });
  s += cabinet();
  s += alarmClock(820, 560, 92);
  s += bus(620, 1050);
  s += flying('snowing', [[124, 600], [220, 330], [520, 250], [740, 340]], [650, 330], 76, '#ffffff', -6);
  s += flying('late', [[338, 700], [520, 640], [690, 600]], [612, 612], 64, C.amber, 4);
  s += flying('bus', [[232, 900], [400, 860], [560, 960], [700, 1010]], [520, 900], 64, C.yellow, 8);
  s += girl(560, 1640);
  s += flying('because', [[340, 1046], [400, 1300], [560, 1470], [760, 1440], [860, 1360]], [880, 1352], 58, C.coral, -4);
  s += `<defs><filter id="sticker" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="9" result="d"/><feFlood flood-color="#ffffff"/><feComposite in2="d" operator="in" result="w"/><feGaussianBlur in="d" stdDeviation="10" result="b"/><feFlood flood-color="#13294f" flood-opacity=".25"/><feComposite in2="b" operator="in" result="sh"/><feOffset in="sh" dx="6" dy="10" result="sh2"/><feMerge><feMergeNode in="sh2"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
  s += `<image href="assets/beagle.png" x="40" y="1230" width="330" height="426" preserveAspectRatio="xMidYMid meet" filter="url(#sticker)"/>`;
  s += subtitle();
  s += '</svg>';
  stage.innerHTML = s;
}
