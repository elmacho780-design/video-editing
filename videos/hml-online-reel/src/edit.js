// The edit: ?view=edit. One deterministic render(t) for the whole Reel, in look A ("HML notebook, coffee edition").
// All choreography is written in SOURCE seconds (his takes, word times from Whisper, edit/align.json) and mapped to output time through the cut list.
// Where he talks while still walking into frame, a full-screen notebook page covers the picture and his voice carries on.
import { KEEP, END, clamp, backOut, easeOut, CAP_Y } from './common.js';
import * as A from './a.js';

// ---------------------------------------------------------------- cuts
let acc = 0;
const SEG = KEEP.map(([a, b], i) => { const s = { a, b, o: acc, i }; acc += b - a; return s; });
export const DUR = +(acc + END).toFixed(3);
const TEND = acc;                                                 // the end card starts here
export const O = (src) => { for (const s of SEG) if (src <= s.b) return s.o + Math.max(0, src - s.a); const l = SEG.at(-1); return l.o + (src - l.a); };
const S = (t) => { for (const s of SEG) if (t < s.o + (s.b - s.a)) return { src: s.a + (t - s.o), seg: s }; const l = SEG.at(-1); return { src: Math.min(l.b, l.a + (t - l.o)), seg: l }; };
const LAST = 1257;
const frameUrl = (src) => `frames/${String(Math.min(LAST, Math.max(0, Math.round(src * 30)))).padStart(5, '0')}.jpg`;
const inOut = (u) => { u = clamp(u); return u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2; };
const easeIn = (u) => clamp(u) ** 3;
const lin = (src, a, d = 0.3) => (src - a) / d;                   // 0..1 animation progress from a source time

// the round face stickers on the pages play the live footage, cropped to his face (edit/face.json, tools/facetrack.py);
// each pops on the moment he walks into shot
let TRACK = [];
const FACE_IN = { pains: 7.5, week: 24.0, loyal: 30.45 };
const live = (src, from) => { const i = Math.min(LAST, Math.max(0, Math.round(src * 30))), box = TRACK[i];
  return box ? { src: frameUrl(src), box, on: lin(src, from, 0.3) } : null; };
// the end card: his smile after "Баярлалаа" (37.92 to 38.42), played forwards and back like a boomerang
const smile = (t) => { const u = ((t - TEND + 0.25) % 1.0 + 1.0) % 1.0, f = u < 0.5 ? u : 1 - u; return 37.92 + f; };

// ---------------------------------------------------------------- key source times (from the word timings)
const WIPE1 = [5.30, 5.75];          // steam wipe: his question → the "does this happen to you?" page
const FLIP1 = 9.45;                  // the page flips up, he is in place
const WIPE2 = [16.18, 16.63];        // steam wipe into take 3 (hides his walk in; the picture holds on 16.63 until it gets there)
const DROP3 = [22.25, 22.55], FLIP3 = 24.62;   // the planner page drops in, covers take 4's walk in, flips up
const DROP4 = [27.98, 28.25], FLIP4 = 31.62;   // the loyalty page, same
const WIPE5 = [37.95, 38.40];        // steam wipe into the end card
const FLIPD = 0.36;
const ROWS = [7.29, 8.31, 10.53];    // "хүргэж", "хичээлээ", "танхимаар"
const STRIKE = [12.85, 13.02, 13.19], STAMP1 = 13.35;   // "манайх онлайн"
const TAGS = [16.28, 17.89], TICKS = [17.27, 19.39], STAMP2 = 21.19;
const CIRCLES = [25.06, 25.62, 26.02], TIME = 27.48;     // "хоёрдох", "дөрөвдөх", "хагас сайн"; "хичээл маань" → 17:00
const STAMPS = [30.94, 31.06, 31.18], PLUS = 31.30, FREE = 31.50;   // "гурав нэмэх нэг"
const LOYAL_OUT = 33.62, BOARD_IN = 33.88, FLAP0 = 35.64, FLAP_DUR = 1.04;
const CUP = 0.62, EQ = 3.10, BOOK = 3.30, QUESTION = 4.80;

// ---------------------------------------------------------------- captions (source start, text); each lasts until the next one
// Every word of the script, as Batu confirmed he said it (Whisper missed "Таны", "байна", "багтсан", "Энэн")
const CAPS = [
  [0.76, 'Таны өглөө болгон'], [1.64, 'уух *кофены* мөнгөөр'], [2.60, 'хүүхэд чинь'], [3.10, '*англи хэл* сурах'], [3.66, 'боломжтой'],
  [4.14, { small: 'гэвэл ямар', big: '*сонсогдож* байна?', at: QUESTION }], [WIPE1[1], null],
  [9.63, 'эсвэл зүгээр л'], [10.53, '*танхимаар* суух боломжгүй'], [11.99, 'хүүхдүүдэд *зориулаад*'], [12.73, 'манайх *онлайн сургалт*'], [14.05, 'зарлаж байна'], [14.75, null],
  [16.28, '*Олимпиадад* бэлдмээр'], [17.25, 'байна уу, эсвэл'], [17.89, '*түвшингөө* ахиулмаар'], [19.37, 'байна уу,'], [19.61, 'хамаагүй,'],
  [20.09, 'онлайн сургалтанд маань'], [21.19, '*бүгд багтсан*'], [21.75, 'байгаа.'], [DROP3[0], null],
  [23.32, '*Хуваарийн* хувьд'], [23.94, 'гэх юм бол'], [25.06, '*хоёрдох*,'], [25.62, '*дөрөвдөх*,'], [26.02, '*хагас сайн* өдрүүдэд'], [27.24, 'хичээл маань'], [27.72, 'орж байгаа'], [DROP4[0], null],
  [29.48, 'Энэн дээр мөн адил'], [30.30, 'манай *3+1*'], [31.52, '*урамшуулал*'], [32.38, 'хэрэгжиж байгаа бөгөөд'],
  [33.64, 'илүү их *мэдээллийг*'], [34.88, 'та хүсэж байвал'], [35.64, 'доорх *дугаараар*'], [36.68, 'холбогдоорой.'], [37.28, '*Баярлалаа!*'], [WIPE5[0] + 0.2, null],
];

// ---------------------------------------------------------------- footage framing: a different punch-in per take hides the cuts, a slow push inside each
function footXf(src, seg, t) {
  let s = [1.02, 1.07, 1.03, 1.01, 1.07][seg.i] + 0.03 * clamp((t - seg.o) / (seg.b - seg.a));
  const bump = (at, amt, len) => { if (src >= at && src < at + len) s += amt * easeOut((src - at) / 0.1); };
  bump(QUESTION, 0.05, 0.95); bump(STAMP1, 0.06, 1.4); bump(STAMP2, 0.05, 1.36); bump(37.28, 0.04, 0.9);
  return `transform-origin:540px 900px;transform:scale(${s.toFixed(4)})`;
}
const footage = (src, seg, t, hold = null) => {
  const f = hold ?? src;
  return `<div class="layer" style="overflow:hidden"><img src="${frameUrl(f)}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;filter:contrast(1.06) saturate(1.05) brightness(1.02);${footXf(f, seg, t)}"><div class="grade"></div></div>`;
};

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
    if (typeof c === 'string') return animated([540, CAP_Y + 45], A.cap(c, { tilt }), lt, 9, { anim: 'snap', tilt: -tilt * 2, out: false });
    // two-tier: the small sticker first, the ticket slaps on with its word
    const big = t >= O(c.at) ? animated([540, CAP_Y + 60], `<div class="a-ticket-wrap" style="top:${CAP_Y + 20}px;transform:translateX(-50%) rotate(-3deg)"><div class="a-ticket">${c.big.replace(/\*(.+?)\*/g, '<span class="kw">$1</span>')}</div></div>`, t - O(c.at), 9, { anim: 'slap', tilt: -7, out: false }) : '';
    return animated([540, CAP_Y - 40], A.cap(c.small, { y: CAP_Y - 60, small: true, tilt: 2 }), lt, 9, { anim: 'snap', tilt: -3, out: false }) + big;
  }
  return '';
}

// ---------------------------------------------------------------- the cards above his head: [source in, source out, origin, html(src)]
const CARDS = [
  [0.72, WIPE1[1], [540, 470], (s) => A.hookCard({ cup: lin(s, CUP, 0.3), eq: clamp(lin(s, EQ, 0.35)), book: lin(s, BOOK, 0.3) })],
  [FLIP1 + 0.1, 14.75, [540, 480], (s) => A.painsCard({ rows: [1, 1, lin(s, ROWS[2])], strike: STRIKE.map((a) => clamp(lin(s, a, 0.2))), stampOn: lin(s, STAMP1, 0.12) })],
  [WIPE2[0], DROP3[1], [540, 470], (s) => A.tagsCard({ ent: [s < TAGS[0] ? 1 : lin(s, TAGS[0]), lin(s, TAGS[1])], ticks: TICKS.map((a) => clamp(lin(s, a, 0.25))), stampOn: lin(s, STAMP2, 0.12) })],
  [FLIP3 + 0.1, DROP4[1], [540, 470], (s) => A.weekCard({ circles: CIRCLES.map((a) => clamp(lin(s, a, 0.3))), time: lin(s, TIME, 0.3) })],
  [FLIP4 + 0.1, LOYAL_OUT, [540, 478], () => A.loyaltyCard()],
  [BOARD_IN, WIPE5[1], [540, 420], (s) => A.phoneBoard({ flipped: ((s - FLAP0) / FLAP_DUR) * 16 })],
];
const cardsAt = (src, t) => CARDS.map(([a, b, origin, html]) => {
  const t0 = O(a), t1 = O(b);
  // the hook card is on screen from frame one (no slap-in delay); the others slap on
  return t >= t0 && t < t1 ? animated(origin, html(src), a === 0.72 ? 1 : t - t0, t1 - t, { tilt: 6, out: b !== WIPE1[1] && b !== WIPE5[1] }) : '';
}).join('');

// ---------------------------------------------------------------- the full-screen pages
const painsPage = (s) => A.painsPage(live(s, FACE_IN.pains), { rows: [lin(s, ROWS[0]), lin(s, ROWS[1]), 0], head: s < 6.92 ? lin(s, WIPE1[0] + 0.25, 0.3) : 1 });
const weekPage = (s) => A.weekPage(live(s, FACE_IN.week));
const loyalPage = (s) => A.loyaltyPage(live(s, FACE_IN.loyal), { stamps: STAMPS.map((a) => lin(s, a, 0.12)), plus: lin(s, PLUS, 0.25), free: lin(s, FREE, 0.25) });
const endAt = (t) => { const e = (d) => (t - (TEND - 0.24) - d) / 0.32; const f = smile(t), me = live(f, 0); if (me) me.on = e(0.55); return A.endCard(me, { logo: e(0.0), board: e(0.22), stickers: e(0.42) }); };
// a page flips up and away (u 0..1) / drops in from above (u 0..1)
const flipUp = (html, u) => `<div class="layer" style="transform-origin:540px 0;transform:translateY(${(-2000 * easeIn(u)).toFixed(1)}px) rotate(${(-5 * easeIn(u)).toFixed(2)}deg);box-shadow:0 30px 60px rgba(0,0,0,.35)">${html}</div>`;
const dropIn = (html, u) => { const y = u >= 1 ? 0 : -1950 * (1 - backOut(u, 1.2)); return `<div class="layer" style="transform:translateY(${y.toFixed(1)}px) rotate(${(3 * (1 - easeOut(u))).toFixed(2)}deg);box-shadow:0 30px 60px rgba(0,0,0,.35)">${html}</div>`; };

// ---------------------------------------------------------------- sound and music cues (output seconds), exported for the mix
export const EV = (() => {
  const ev = [], add = (src, type, extra = {}) => ev.push({ t: +O(src).toFixed(3), type, ...extra });
  add(CUP, 'clink'); add(EQ, 'draw'); add(BOOK, 'pop'); add(QUESTION, 'ding');
  add(WIPE1[0], 'whoosh'); add(WIPE1[0], 'swell', { len: WIPE1[1] - WIPE1[0] });
  add(ROWS[0], 'slap'); add(ROWS[1], 'slap'); add(FLIP1, 'flip'); add(ROWS[2], 'slap');
  STRIKE.forEach((a) => add(a, 'draw')); add(STAMP1, 'stamp');
  ev.push({ t: +O(WIPE2[0]).toFixed(3), type: 'whoosh' }, { t: +O(WIPE2[0]).toFixed(3), type: 'swell', len: WIPE2[1] - WIPE2[0] });
  add(TAGS[1], 'slap'); TICKS.forEach((a) => add(a, 'tick')); add(STAMP2, 'stamp');
  add(DROP3[0], 'drop'); add(FLIP3, 'flip');
  CIRCLES.forEach((a, i) => { add(a, 'draw'); add(a, 'day', { n: i }); }); add(TIME, 'pop');
  add(DROP4[0], 'drop'); STAMPS.forEach((a, i) => add(a, 'stamp', { soft: 1, n: i })); add(PLUS, 'kaching'); add(FREE, 'pop'); add(FLIP4, 'flip');
  add(LOYAL_OUT, 'whoosh', { soft: 1 }); add(BOARD_IN, 'slap');
  for (let k = 0; k < 16; k++) add(FLAP0 + (k / 16) * FLAP_DUR, 'flap');
  add(WIPE5[0], 'whoosh'); add(WIPE5[0], 'swell', { len: WIPE5[1] - WIPE5[0] });
  ev.push({ t: +TEND.toFixed(3), type: 'end' });
  // section downbeats for the music: the first frame and each moment a new scene lands
  [0, O(WIPE1[1]), O(WIPE2[1]), O(DROP3[1]), O(DROP4[1]), TEND].forEach((t) => ev.push({ t: +t.toFixed(3), type: 'section' }));
  ev.push({ t: 0, type: 'keep', keep: KEEP });             // the cut list, for audio/voice.py
  return ev.sort((a, b) => a.t - b.t);
})();

// ---------------------------------------------------------------- page
let ov;
export async function init() {
  TRACK = (await (await fetch('edit/face.json')).json()).face;
  document.head.insertAdjacentHTML('beforeend', `<style>${A.css}</style>`);
  document.getElementById('stage').innerHTML = '<div id="ov" class="layer"></div>';
  ov = document.getElementById('ov');
  window.EV = EV;
}

export async function frame(t) {
  t = Math.min(t, DUR - 1 / 60);
  const { src, seg } = S(t);
  const base = (hold) => footage(src, seg, t, hold) + A.brand() + cardsAt(src, t);
  const T = (s) => O(s);
  let g;
  if (t >= TEND) g = endAt(t);
  else if (t >= T(WIPE5[0])) { const w = A.steamParts(inOut((t - T(WIPE5[0])) / (T(WIPE5[1]) - T(WIPE5[0])))); g = base() + captionAt(t) + `<div class="layer" style="clip-path:path('${w.clip}')">${endAt(t)}</div>${w.lines}${w.cup}`; }
  else if (t >= T(FLIP4) && t < T(FLIP4) + FLIPD) g = base() + flipUp(loyalPage(src), (t - T(FLIP4)) / FLIPD) + captionAt(t);
  else if (t >= T(DROP4[1]) && t < T(FLIP4)) g = loyalPage(src) + captionAt(t);
  else if (t >= T(DROP4[0]) && t < T(DROP4[1])) g = base() + dropIn(loyalPage(29.4), (t - T(DROP4[0])) / (T(DROP4[1]) - T(DROP4[0])));
  else if (t >= T(FLIP3) && t < T(FLIP3) + FLIPD) g = base() + flipUp(weekPage(src), (t - T(FLIP3)) / FLIPD) + captionAt(t);
  else if (t >= T(DROP3[1]) && t < T(FLIP3)) g = weekPage(src) + captionAt(t);
  else if (t >= T(DROP3[0]) && t < T(DROP3[1])) g = base() + dropIn(weekPage(23.25), (t - T(DROP3[0])) / (T(DROP3[1]) - T(DROP3[0])));
  else if (t >= T(WIPE2[0]) && t < T(WIPE2[1])) {
    // from: the last frame of take 2 with its card; to: take 3, held on the frame where he is in place
    const p = inOut((t - T(WIPE2[0])) / (T(WIPE2[1]) - T(WIPE2[0]))), w = A.steamParts(p);
    const from = footage(14.73, SEG[1], T(14.73), 14.73) + A.brand() + A.painsCard();
    g = from + `<div class="layer" style="clip-path:path('${w.clip}')">${base(WIPE2[1])}</div>${w.lines}${w.cup}` + captionAt(t);
  }
  else if (t >= T(FLIP1) && t < T(FLIP1) + FLIPD) g = base() + flipUp(painsPage(src), (t - T(FLIP1)) / FLIPD) + captionAt(t);
  else if (t >= T(WIPE1[1]) && t < T(FLIP1)) g = painsPage(src);
  else if (t >= T(WIPE1[0]) && t < T(WIPE1[1])) { const w = A.steamParts(inOut((t - T(WIPE1[0])) / (T(WIPE1[1]) - T(WIPE1[0])))); g = base() + captionAt(t) + `<div class="layer" style="clip-path:path('${w.clip}')">${painsPage(src)}</div>${w.lines}${w.cup}`; }
  else g = base() + captionAt(t);
  ov.innerHTML = g;
  await Promise.all([...ov.querySelectorAll('img')].map((i) => (i.complete && i.naturalWidth ? null : i.decode().catch(() => {}))));
}
