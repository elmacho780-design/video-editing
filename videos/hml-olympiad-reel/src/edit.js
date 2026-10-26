// The edit: ?view=edit. One deterministic render(t) for the whole Reel.
// All choreography is written in SOURCE seconds (the original take, from Whisper word timings) and mapped to output time through the cut list.
import * as U from './ui.js';
const { clamp, backOut, easeOut } = U;

// ---------------------------------------------------------------- cuts: keep these source ranges, pauses between them removed
const KEEP = [[0.0, 9.27], [9.53, 13.55], [13.95, 26.0], [26.3, 28.58], [28.82, 46.0]];
const HOLD = 1.0, LAST = 1379;
let acc = 0;
const SEG = KEEP.map(([a, b], i) => { const s = { a, b, o: acc, i }; acc += b - a; return s; });
export const DUR = +(acc + HOLD).toFixed(3);
export const O = (src) => { for (const s of SEG) if (src <= s.b) return s.o + Math.max(0, src - s.a); const l = SEG.at(-1); return l.o + (src - l.a); };
const S = (t) => { for (const s of SEG) if (t < s.o + (s.b - s.a)) return { src: s.a + (t - s.o), seg: s }; const l = SEG.at(-1); return { src: l.a + (t - l.o), seg: l }; };
const frameUrl = (src) => `frames/${String(Math.min(LAST, Math.max(0, Math.round(src * 30)))).padStart(5, '0')}.jpg`;
const smooth = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
const inOut = (u) => { u = clamp(u); return u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2; };

// ---------------------------------------------------------------- captions (source start, text); each lasts until the next one
const CAPS = [
  [0.95, 'Танай хүүхдийг'], [1.90, '*3–6 сарын*'], [3.12, 'англи хэлийг нь'], [3.94, '*эрчимтэй* бэлдэж'],
  [5.20, 'олон улсын'], [6.14, '*нэг биш*,'], [6.80, 'нэлээд *хэдэн* олимпиадад'], [7.76, { small: 'оролцуулбал', big: 'ямар вэ?', at: 8.78 }],
  [9.53, 'Нэгэнт л *сайн* бэлдэж'], [10.84, 'байгаа юм чинь'], [11.12, 'хэд хэдэн *олимпиадад*'], [12.10, '*сориод үзсэн* нь дээр'], [13.55, null],
  [20.50, 'гэсэн *том том*'], [21.48, 'олимпиадууд байна'], [22.55, null],
  [22.90, 'Манай сургалтын төв нь'], [23.94, 'сурагчдыг'], [24.62, '*олон улсын* олимпиадад'], [25.76, 'бэлтгэхэд'], [26.90, 'илүүтэй *төвлөрч*'], [28.04, 'ажилладаг'],
  [28.82, 'Хэрэв та илүү их'], [29.72, '*мэдээлэл* авахыг хүсвэл'], [30.66, 'манай *доорх*'], [31.38, 'утасны *дугаарт*'], [31.98, 'холбогдож,'],
  [32.62, 'мөн *мессеж* бичиж'], [33.86, 'дэлгэрэнгүй *мэдээлэл* аваарай'], [35.28, null],
  [36.75, 'Аан, *тийм!*'], [37.75, 'манайд бас'], [38.37, '3 дээр нэмэх нь *1*'], [39.57, 'буюу *3 сараар* нь'],
  [40.80, { small: 'бүртгүүлээд', big: '1 сар ҮНЭГҮЙ', at: 41.64 }], [42.62, 'явах *хөтөлбөр*'], [43.28, 'явагдаж байна'], [44.24, null],
  [44.26, { end: 'За, *амжилт хүсье!*' }],
];
const CAP_ORIGIN = [540, U.CAP_Y + 45];

// ---------------------------------------------------------------- key source times
const W1 = 13.95, W2 = 22.50, W3 = 44.24, WD = 0.45;      // bloom wipes: into the olympiad page, back to her, into the end card
const SHOUT0 = 35.28, SHOUT1 = 36.74;
const TILES = [[14.24, 14.74], [15.20, 16.10], [17.28, 18.00], [19.18, 20.00]];   // [name said, tick drawn]
const FLAP0 = 31.38, FLAP_DUR = 1.15;
const COMIC = [[35.34, '3 ДЭЭР', 100], [35.74, 'НЭМЭХ НЬ', 100], [36.22, '1-ЭЭ', 160], [36.44, 'ХЭЛСИЙМ ҮҮ?!', 86]];
const PAGES = [38.37, 38.49, 38.61], PLUS = 39.09, GIFT = 39.49, FREE = 42.14;

// ---------------------------------------------------------------- cards: [source in, source out, origin, html(srcTime), in-animation]
const CARDS = [
  [1.90, 5.20, [530, 405], () => U.timelineCard({ fill: smooth((sNow - 2.0) / 1.2) })],
  [6.14, 9.27, [530, 400], () => U.medalFan({ cross: clamp((sNow - 6.50) / 0.35), pops: [0, 1, 2, 3].map((i) => (O(sNow) - O(7.16 + i * 0.13)) / 0.32) })],
  [11.12, 13.55, [540, 450], () => U.treeDiagram({ p: clamp((sNow - 11.12) / 0.9) })],
  [22.95, 28.58, [540, 300], () => U.ribbon({ shift: (sNow - 22.95) * 140 })],
  [27.74, 28.58, [855, 585], () => U.stamp({ s: 1 + 1.3 * (1 - easeOut((sNow - 27.74) / 0.11)), o: clamp((sNow - 27.74) / 0.05) }), 'none'],
  [30.94, 35.28, [540, 300], () => U.phoneBoard({ flipped: ((sNow - FLAP0) / FLAP_DUR) * 16, y: 128, scale: 0.9 })],
  [32.84, 35.28, [650, 530], () => U.chatSticker()],
  [37.75, 44.24, [540, 365], () => U.offerCard({ pages: PAGES.map((p) => (sNow - p) / 0.22), plus: (sNow - PLUS) / 0.25, gift: (sNow - GIFT) / 0.35, free: (sNow - FREE) / 0.25 }), 'none'],
  [GIFT, 41.2, [540, 600], () => U.confetti(7, 46, sNow - GIFT), 'none'],
];
let sNow = 0;

// ---------------------------------------------------------------- footage framing: alternating punch-ins hide the cuts, slow push inside each piece
function footXf(src, seg, t) {
  const segDur = seg.b - seg.a;
  let s = [1.04, 1.1, 1.0, 1.09, 1.0][seg.i] + 0.035 * clamp((t - seg.o) / segDur), ox = 540, oy = 700, tx = 0, ty = 0, r = 0;
  // the opening: the Essential English banner covers the lens and slides away; push in onto her as it clears,
  // then counter-zoom while she walks up to the lens so her size stays steady
  if (seg.i === 0) s += src < 0.45 ? 0 : src < 0.8 ? 0.30 * smooth((src - 0.45) / 0.35) : 0.30 * (1 - smooth((src - 0.8) / 1.3));
  const bump = (at, amt, len = 1.2) => { if (src >= at && src < at + len) s += amt * easeOut((src - at) / 0.1); };
  bump(3.94, 0.05, 1.2); bump(8.78, 0.06, 0.49); bump(27.74, 0.08, 0.84); bump(36.75, 0.05, 0.9);
  if (src >= SHOUT0 && src < SHOUT1) {                                       // the shout: crash zoom on her face, a short shake
    const u = src - SHOUT0; s = 1.5 + 0.06 * u; oy = 640; r = -3;
    if (u < 0.15) { const k = Math.round(u * 30); tx = [18, -22, 14, -9, 5][k] || 0; ty = [-12, 10, -6, 4, 0][k] || 0; r += [2, -2, 1, 0, 0][k] || 0; }
  }
  return `transform-origin:${ox}px ${oy}px;transform:translate(${tx}px,${ty}px) scale(${s.toFixed(4)}) rotate(${r}deg)`;
}

// ---------------------------------------------------------------- element animation
function animated(origin, html, lt, rem, { anim = 'slap', tilt = 6, out = true } = {}) {
  let sc = 1, rot = 0, op = 1;
  if (anim === 'slap') {                                   // a sticker slapped on: big, rotated, then a little settle bounce
    const u = lt / 0.3;
    sc = u >= 1 ? 1 : u < 0.45 ? 1.3 - 0.37 * easeOut(u / 0.45) : 0.93 + 0.07 * easeOut((u - 0.45) / 0.55);
    rot = tilt * (1 - easeOut(u)); op = clamp(lt / 0.05);
  } else if (anim === 'snap') {                            // caption swap
    const u = lt / 0.16; sc = 1 + 0.14 * (1 - easeOut(u)); rot = tilt * (1 - easeOut(u)); op = clamp(lt / 0.03);
  }
  if (out && rem < 0.14) { const v = 1 - rem / 0.14; sc *= 1 - 0.18 * v; op *= 1 - v; }
  return `<div class="layer" style="transform-origin:${origin[0]}px ${origin[1]}px;transform:scale(${sc.toFixed(3)}) rotate(${rot.toFixed(2)}deg);opacity:${op.toFixed(3)}">${html}</div>`;
}

function captionAt(t) {
  for (let i = CAPS.length - 1; i >= 0; i--) {
    const [s0, c] = CAPS[i]; const t0 = O(s0);
    if (t < t0) continue;
    if (!c) return '';
    const lt = t - t0, tilt = i % 2 ? 1.5 : -1.5;
    const inScene = s0 > W1 && s0 < W2, y = inScene ? 1372 : U.CAP_Y;
    if (typeof c === 'string') return animated([540, y + 45], U.cap(c, { tilt, y }), lt, 9, { anim: 'snap', tilt: -tilt * 2, out: false });
    if (c.end) return animated([540, 1785], U.cap(c.end, { y: 1740, tilt: -2 }), lt, 9, { anim: 'slap', tilt: 5, out: false });
    // two-tier: the small sticker first, the ticket slaps on with its word
    const big = t >= O(c.at) ? animated([540, U.CAP_Y + 90], `<div class="ticket-wrap" style="top:${U.CAP_Y + 36}px;transform:translateX(-50%) rotate(-3deg)"><div class="ticket">${c.big}</div></div>`, t - O(c.at), 9, { anim: 'slap', tilt: -7, out: false }) : '';
    return animated([540, U.CAP_Y - 30], U.cap(c.small, { y: U.CAP_Y - 70, small: true, tilt: 2 }), lt, 9, { anim: 'snap', tilt: -3, out: false }) + big;
  }
  return '';
}

function comicAt(src, t) {
  if (src < SHOUT0 || src >= SHOUT1) return '';
  const flick = Math.round(t * 30) % 2 ? 1.2 : -1.2;
  let html = `<div class="layer" style="transform:rotate(${flick}deg) scale(${1 + 0.4 * (1 - easeOut((src - SHOUT0) / 0.12))});opacity:${clamp((src - SHOUT0) / 0.04)}">${U.speedLines()}</div>`;
  html += `<div class="abs" style="left:0;top:150px;width:1080px;transform:rotate(-5deg)">`;
  COMIC.forEach(([at, txt, size], i) => {
    if (src < at) return;
    const u = (src - at) / 0.16, sc = u >= 1 ? 1 : 1.9 - 0.9 * backOut(u, 3);
    html += `<div class="comic" style="position:relative;left:${[-30, 40, -10, 20][i]}px;margin-top:${i ? -6 : 0}px;font-size:${size}px;transform:rotate(${[-2, 3, -3, 2][i]}deg) scale(${sc.toFixed(3)});opacity:${clamp(u * 5)}">${txt}</div>`;
  });
  html += `</div>`;
  html += animated([230, 1360], `<div class="stk sky" style="left:40px;top:1330px;font-size:34px;transform:rotate(-4deg)">📣 камерын цаанаас</div>`, src - 35.34, 9, { anim: 'slap', tilt: -8, out: false });
  return src >= 35.34 ? html : html.replace(/<div class="stk sky".*$/, '');
}

function sceneAt(src, frame) {
  return U.notebookScene(frame, {
    badge: (src - W1 - 0.15) / 0.3,
    tiles: TILES.map(([a, b]) => ({ ent: (src - a) / 0.3, tick: clamp((src - b) / 0.25) })),
    top: 520, gap: 205,
  });
}

// ---------------------------------------------------------------- sound and music cues (output seconds), exported for the mix
export const EV = (() => {
  const ev = [], add = (src, type, extra = {}) => ev.push({ t: +O(src).toFixed(3), type, ...extra });
  add(0.12, 'whoosh'); [W1, W2, W3].forEach((w) => add(w - 0.05, 'whoosh'));
  CARDS.forEach(([a, , , , anim]) => { if (anim !== 'none') add(a, 'slap'); });
  TILES.forEach(([a, b], i) => { add(a, 'tile', { n: i }); add(b, 'tick'); });
  for (let k = 0; k < 16; k++) add(FLAP0 + (k / 16) * FLAP_DUR, 'flap');
  add(27.74, 'stamp');
  add(SHOUT0, 'musicStop'); add(SHOUT0, 'boing'); COMIC.forEach(([a]) => add(a, 'comic'));
  add(36.75, 'ding'); add(36.75, 'musicGo');
  PAGES.forEach((p) => add(p, 'page')); add(PLUS, 'pop'); add(GIFT, 'tada'); add(FREE, 'pop');
  add(W3 + WD, 'chime'); add(8.78, 'pop'); add(41.64, 'pop');
  return ev.sort((a, b) => a.t - b.t);
})();

// ---------------------------------------------------------------- page
let foot, fimg, under, ov;
export async function init() {
  const st = document.getElementById('stage');
  st.innerHTML = `<div id="under" class="layer"></div>
    <div id="foot" class="layer"><img id="fimg" style="position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;filter:contrast(1.07) saturate(1.06) brightness(1.02)"><div class="grade"></div></div>
    <div id="ov" class="layer"></div>`;
  [foot, fimg, under, ov] = ['foot', 'fimg', 'under', 'ov'].map((id) => document.getElementById(id));
  window.EV = EV;
}

export async function frame(t) {
  t = Math.min(t, DUR - 1 / 60);
  const { src, seg } = S(t), fsrc = Math.min(src, 45.96);
  sNow = src;
  const fu = frameUrl(fsrc);
  if (fimg.getAttribute('src') !== fu) fimg.src = fu;
  fimg.style.cssText += ';' + footXf(fsrc, seg, t);

  const tW1 = O(W1), tW2 = O(W2), tW3 = O(W3);
  let underHtml = '', top = '', lines = '', footClip = 'none', showFoot = true;
  const scene = () => sceneAt(src, fu);
  if (t >= tW1 && t < tW1 + WD) { const b = U.bloomParts(inOut((t - tW1) / WD)); top = `<div class="layer" style="clip-path:path('${b.clip}')">${scene()}</div>`; lines = b.lines; }
  else if (t >= tW1 + WD && t < tW2) { top = scene(); showFoot = false; }
  else if (t >= tW2 && t < tW2 + WD) { const b = U.bloomParts(inOut((t - tW2) / WD)); underHtml = scene(); footClip = `path('${b.clip}')`; lines = b.lines; }
  else if (t >= tW3 && t < tW3 + WD) { const b = U.bloomParts(inOut((t - tW3) / WD)); top = `<div class="layer" style="clip-path:path('${b.clip}')">${endAt(src, fu)}</div>`; lines = b.lines; }
  else if (t >= tW3 + WD) { top = endAt(src, fu); showFoot = false; }
  foot.style.clipPath = footClip; foot.style.visibility = showFoot ? 'visible' : 'hidden';
  under.innerHTML = underHtml;

  let g = top;
  const brandOn = (t >= O(0.6) && t < O(13.95)) || (t >= O(22.95) && t < O(30.94)) || (t >= O(36.75) && t < O(37.75));
  if (brandOn) g += U.brand();
  for (const [a, b, origin, html, anim] of CARDS) {
    const t0 = O(a), t1 = O(b);
    if (t >= t0 && t < t1) g += animated(origin, html(), t - t0, t1 - t, { anim: anim || 'slap', tilt: 6 });
  }
  g += comicAt(src, t);
  if (src >= 36.75 && src < 37.6) g += animated([800, 430], `<div class="abs" style="left:730px;top:340px;font-size:150px;transform:rotate(12deg);filter:drop-shadow(6px 8px 0 #14295a)">💡</div>`, src - 36.75, O(37.6) - t, { anim: 'slap', tilt: 20 });
  g += captionAt(t);
  g += lines;
  ov.innerHTML = g;
  await Promise.all([fimg, ...ov.querySelectorAll('img'), ...under.querySelectorAll('img')].map((i) => (i.complete && i.naturalWidth ? null : i.decode().catch(() => {}))));
}

function endAt(src, fu) {
  const e = (at) => (src - at) / 0.32;
  return U.endCard(fu, { logo: e(W3 + 0.35), board: e(W3 + 0.55), stickers: e(W3 + 0.75), face: e(W3 + 0.9) });
}
