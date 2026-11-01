// The edit: ?view=edit. One deterministic render(t) for the whole Reel, in the approved "Level Up" look (src/game.js).
// One continuous take. The opening "За" and the long pauses come out; each new sentence is placed on the music's eighth-note grid
// (150 BPM) by choosing how much of the pause before it to keep, so the score (audio/score.py) and the picture share one clock.
// All choreography is written in SOURCE seconds (Whisper word timings, edit/align.json) and mapped to output time; game cues snap to the grid.
import { clamp, easeOut } from './common.js';
import * as G from './game.js';

// ---------------------------------------------------------------- the music clock
export const BPM = 150; const BEAT = 60 / BPM, Q = BEAT / 2, BAR = 4 * BEAT;

// ---------------------------------------------------------------- cuts
const START = 1.0, STOP = 34.45, LAST = 1034;
// silences in the take: [start, end, kept length | 'snap', shortest kept]; 'snap' keeps just enough that the next sentence starts on an eighth
const GAPS = [[6.38, 6.86, 'snap', 0.30], [8.16, 8.64, 'snap', 0.25], [9.44, 9.72, 0.12], [12.26, 12.60, 0.12], [14.56, 14.98, 0.15],
  [16.30, 16.96, 'snap', 0.25], [17.90, 18.20, 0.12], [22.94, 23.24, 0.15], [27.12, 27.68, 'snap', 0.25], [28.72, 29.36, 0.15], [33.56, 33.96, 0.32]];
export const KEEP = (() => {
  const keep = []; let cur = START, out = 0;
  for (const [a, b, mode, lo] of GAPS) {
    let L = mode;
    if (mode === 'snap') { const base = out + (a - cur); L = Math.ceil((base + lo) / Q - 1e-9) * Q - base; if (L > b - a) L -= Q; L = Math.max(L, Math.min(lo, b - a)); }
    keep.push([cur, a + L / 2]); out += a + L / 2 - cur; cur = b - L / 2;
  }
  keep.push([cur, STOP]);
  return keep.map(([x, y]) => [+x.toFixed(4), +y.toFixed(4)]);
})();
let acc = 0;
const SEG = KEEP.map(([a, b], i) => { const s = { a, b, o: acc, i }; acc += b - a; return s; });
const TEND = acc;                                                     // the end screen starts here
const END_LEN = Math.ceil((TEND + 2.2) / BAR) * BAR - TEND;           // and lasts until the next bar line after 2.2 s
export const DUR = +(TEND + END_LEN).toFixed(3);
export const O = (src) => { for (const s of SEG) if (src <= s.b) return s.o + Math.max(0, src - s.a); const l = SEG.at(-1); return l.o + (src - l.a); };
const S = (t) => { for (const s of SEG) if (t < s.o + (s.b - s.a)) return { src: s.a + (t - s.o), seg: s }; const l = SEG.at(-1); return { src: Math.min(l.b, l.a + (t - l.o)), seg: l }; };
const Tq = (src) => Math.round(O(src) / Q) * Q;                       // a cue's output time, on the eighth-note grid
const frameUrl = (src) => `frames/${String(Math.min(LAST, Math.max(0, Math.round(src * 30)))).padStart(5, '0')}.jpg`;

// ---------------------------------------------------------------- the game beats (source seconds, from the word timings)
const ROW = [1.84, 2.98, 3.46], HOT = [3.80, 5.0];                    // "долоо хоногоо", "үр дүнгүй", "утсаа" / "ширтээд … өдөржингөө"
const CHOICE = 5.90, PICK = 7.00, ALERT = [7.22, 8.22];               // "байна уу?", "тийм", "наашаа анхаарлаа хандуулаарай"
const QUEST = 8.64, CARD = 9.72, QROW = [9.72, 10.52, 13.24, 14.98], CARD_OUT = 16.30;   // "Манай…", "долоо хоногийн", "сурагчдын амралтанд", "өдөр болгон", "түвшин ахиулах"
const MAP = 16.96, ITEMS = [18.42, 19.32], FILL = [19.88, 20.68];     // "Сургалтан дээрээ", "дүрэм", "үг", "түвшингөө ахиулаад"
const LVLUP = 20.70, BOSS = 21.62, HITS = [23.52, 24.22], WIN = 24.82, BOSS_OUT = 25.80;   // "явцын шалгалт", "10", "20", "сайжруулсан"
const ACH = [25.86, 27.10], CONT = 27.68, NUMS = 31.55, PRESS = 32.62; // "гайхшруулъя", "Хэрвээ тэгэхийг", "доорх дугаараар", "сургалтан дээрээ"
const PIX = [QUEST, MAP, CONT];                                       // pixel-dissolve transitions on these cuts

// ---------------------------------------------------------------- captions (source start, text): every word of the script
const CAPS = [
  [1.08, 'сурагчдын амралтын'], [1.84, 'долоо хоногоо'], [2.42, 'ямар ч *үр дүнгүй*'], [3.46, '*утсаа* ширтээд'], [4.38, 'өдөржингөө'], [4.92, 'өнгөрөөмөөргүй'],
  [5.48, 'байгаа хүмүүс'], [5.90, 'байна уу?'], [6.38, null],
  [6.86, 'Хэрвээ *тийм* бол'], [7.22, 'наашаа'], [7.54, '*анхаарлаа*'], [7.86, 'хандуулаарай.'], [8.22, null],
  [8.64, 'Манай сургалтан дээр'], [9.72, 'долоо хоногийн'], [10.14, 'хугацаатай'], [10.52, 'сурагчдын амралтанд'], [11.58, 'зориулаад'], [12.60, '*эрчимжүүлсэн*'],
  [13.24, 'өдөр болгон'], [13.94, 'хичээллэх'], [14.98, '*түвшин ахиулах*'], [15.50, '*анги*'], [15.64, 'зарлагдаж байна.'], [16.30, null],
  [16.96, 'Сургалтан дээрээ'], [17.46, 'хүрч ирээд'], [18.20, 'шинэ *дүрэм* сураад'], [19.10, 'шинэ *үг* сураад'], [19.88, '*түвшингөө*'], [20.32, 'ахиулаад'], [20.68, null],
  [21.02, 'хичээл эхлэхэд'], [21.62, 'явцын *шалгалт*'], [22.48, 'авахад'], [23.24, 'дүнгээ'], [23.52, '*10,*'], [24.00, '*20* хувиар нь'], [24.82, 'сайжруулсан'],
  [25.24, 'бүгдийг нь'], [25.86, '*гайхшруулъя* л даа,'], [26.64, 'тийм биз дээ?'], [27.12, null],
  [27.68, 'Хэрвээ тэгэхийг'], [28.16, 'хүсэж байгаа,'], [29.36, 'илүү их *мэдээллийг*'], [30.06, 'сонирхож байгаа'], [30.64, 'хүмүүс байвал'], [31.55, 'доорх *дугаараар*'],
  [32.18, 'холбогдоод'], [32.62, 'сургалтан дээрээ'], [33.42, 'ирээрэй.'], [33.96, '*Баярлалаа!*'],
];
function captionAt(t) {
  for (let i = CAPS.length - 1; i >= 0; i--) {
    const [s0, c] = CAPS[i]; const t0 = O(s0);
    if (t < t0) continue;
    if (!c) return '';
    // the dialogue box pops in two steps; text appears at once, like a game box
    const u = (t - t0) / 0.1, sc = u >= 1 ? 1 : u < 0.5 ? 0.9 : 0.97;
    return `<div class="layer" style="transform-origin:540px 1380px;transform:scale(${sc})">${G.cap(c)}</div>`;
  }
  return '';
}

// ---------------------------------------------------------------- footage: a different punch-in per piece hides the jumps; hits shake the picture
function footXf(src, seg, t) {
  let s = [1.0, 1.05, 1.02, 1.06][seg.i % 4] + 0.02 * clamp((t - seg.o) / (seg.b - seg.a)), tx = 0, ty = 0;
  const bump = (at, amt, len) => { if (src >= at && src < at + len) s += amt * easeOut((src - at) / 0.1); };
  bump(LVLUP, 0.05, 0.9); bump(QUEST, 0.04, 0.6);
  for (const h of HITS) { const u = (src - h) * 30; if (u >= 0 && u < 5) { const k = Math.floor(u); tx = [16, -14, 9, -5, 2][k]; ty = [-8, 7, -4, 2, 0][k]; } }
  return `transform-origin:540px 1000px;transform:translate(${tx}px,${ty}px) scale(${s.toFixed(4)})`;
}
const footage = (src, seg, t, pix) => `<div class="layer" style="overflow:hidden">${pix
  ? `<canvas id="pix" width="54" height="96" style="position:absolute;inset:0;width:1080px;height:1920px;image-rendering:pixelated" data-src="${frameUrl(src)}"></canvas>`
  : `<img src="${frameUrl(src)}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;filter:contrast(1.05) saturate(1.06);${footXf(src, seg, t)}">`}<div class="grade"></div></div>`;

// ---------------------------------------------------------------- the game layer at time t
const within = (src, a, b) => src >= a && src < b;
function gameAt(src, t) {
  const T = (s) => Tq(s), u = (s, d) => (t - T(s)) / d;                // progress of a cue in output time, on the grid
  let g = '';
  // HUD: level 1 with XP filling as he learns; level 2 after LEVEL UP
  const xp = t < T(ITEMS[0]) ? 0 : t < T(ITEMS[1]) ? 0.375 : t < T(FILL[0]) ? 0.75 : t < T(LVLUP) ? 0.75 + 0.25 * clamp(u(FILL[0], O(FILL[1]) - O(FILL[0]))) : 1;
  const lvl = t >= T(LVLUP) ? 2 : 1;
  g += G.hud({ lvl, xp: lvl === 2 ? (t >= T(WIN) ? 1 : 0.25) : xp, flash: lvl === 1 && t >= T(FILL[1]) - 0.2 && G.blink(t, 6), label: lvl === 2 ? (t >= T(WIN) ? 'XP MAX' : 'XP 25') : `XP ${Math.round(xp * 100)}`, on: 0.5 + t / 0.25 });
  // 1. stats
  if (t < T(CHOICE)) g += G.stats({ on: 0.5 + t / 0.25, rows: ROW.map((r) => t >= T(r) ? 1 : 0), phoneHot: t >= T(HOT[0]) && t < T(HOT[1]) ? G.blink(t, 3) : t >= T(HOT[1]) });
  // 2. the choice and the alert
  if (t >= T(CHOICE) && t < T(ALERT[0])) g += G.choice({ on: u(CHOICE, 0.2), picked: t >= T(PICK) ? 1 : 0, t });
  if (t >= T(ALERT[0]) && t < T(ALERT[1])) g += G.alert({ on: u(ALERT[0], 0.15) });
  // 3. the quest
  g += G.questBanner({ u: u(QUEST, 1.2) });
  if (t >= T(CARD) && t < T(CARD_OUT)) g += G.questCard({ on: u(CARD, 0.2), rows: QROW.map((r) => t >= T(r) ? 1 : 0) });
  // 4. the map: he walks from day 1 to day 7 as he learns; the items rise from the map
  if (t >= T(MAP) && t < T(LVLUP)) {
    const pos = t < T(ITEMS[0]) ? 0 : t < T(ITEMS[1]) ? 0.33 * clamp(u(ITEMS[0], 0.4)) : t < T(FILL[0]) ? 0.33 + 0.33 * clamp(u(ITEMS[1], 0.4)) : 0.66 + 0.34 * clamp(u(FILL[0], 0.6));
    g += G.levelMap({ on: u(MAP, 0.2), pos, got: [['+ДҮРЭМ', u(ITEMS[0], 1.0)], ['+ҮГ', u(ITEMS[1], 1.0)]] });
  }
  // 5. LEVEL UP!
  g += G.levelUp({ u: u(LVLUP, O(BOSS) - O(LVLUP)), t });
  // 6. the boss, the hits, the scores, the achievement
  if (t >= T(BOSS) && t < T(BOSS_OUT)) {
    const hp = t < T(HITS[0]) ? 1 : t < T(HITS[1]) ? 0.55 : 0.08 * (1 - clamp(u(WIN, 0.3)));
    g += G.boss({ on: u(BOSS, 0.2), hp, hit: Math.max(...HITS.map((h) => clamp(u(h, 0.18)) % 1)), beaten: t >= T(WIN) ? 1 : 0 });
  }
  g += G.scorePop({ u: u(HITS[0], 1.8), text: '+10%', x: 150, y: 650, r: -4 }) + G.scorePop({ u: u(HITS[1], 1.6), text: '+20%', x: 600, y: 630, big: true, r: 5 });
  g += G.achievement({ u: u(ACH[0], O(ACH[1]) - O(ACH[0])) });
  // 7. continue?
  if (t >= T(CONT) && t < TEND) g += G.cont({ on: u(CONT, 0.25), count: Math.max(1, 9 - Math.floor((t - T(CONT)) / (2 * BEAT))), nums: clamp(u(NUMS, 1.0)), start: t >= T(PRESS) ? 1 : 0, t });
  return g;
}

// ---------------------------------------------------------------- sound and music cues (output seconds on the grid), exported for the score
export const EV = (() => {
  const ev = [], add = (src, type, extra = {}) => ev.push({ t: +Tq(src).toFixed(3), type, ...extra });
  ev.push({ t: 0, type: 'boot' });
  ROW.forEach((r, i) => add(r, 'row', { n: i })); add(HOT[0], 'alarm');
  add(CHOICE, 'menu'); add(PICK, 'select'); add(ALERT[0], 'alert');
  add(QUEST, 'quest'); QROW.forEach((r, i) => add(r, 'qrow', { n: i }));
  add(MAP, 'map'); ITEMS.forEach((r, i) => add(r, 'item', { n: i })); add(FILL[0], 'fill', { len: +(Tq(FILL[1]) - Tq(FILL[0])).toFixed(3) });
  add(LVLUP, 'levelup'); add(BOSS, 'boss'); HITS.forEach((h, i) => add(h, 'hit', { n: i })); add(WIN, 'win'); add(ACH[0], 'achievement');
  add(CONT, 'continue'); add(NUMS, 'numbers'); add(PRESS, 'press');
  ev.push({ t: +TEND.toFixed(3), type: 'end' });
  ev.push({ t: 0, type: 'clock', bpm: BPM, bar: BAR });
  ev.push({ t: 0, type: 'keep', keep: KEEP });
  return ev.sort((a, b) => a.t - b.t);
})();

// ---------------------------------------------------------------- page
let ov;
export async function init() {
  document.head.insertAdjacentHTML('beforeend', `<style>${G.css}</style>`);
  document.getElementById('stage').innerHTML = '<div id="ov" class="layer"></div>';
  ov = document.getElementById('ov');
  window.EV = EV;
}

export async function frame(t) {
  t = Math.min(t, DUR - 1 / 60);
  if (t >= TEND) { ov.innerHTML = G.endScreen({ u: (t - TEND) / 1.2, t }); return; }
  const { src, seg } = S(t);
  const pix = PIX.some((p) => Math.abs(t - O(p)) < 0.07) || t >= TEND - 0.1;   // pixel dissolves on the big cuts and into the end screen
  ov.innerHTML = footage(src, seg, t, pix) + gameAt(src, t) + captionAt(t);
  const cv = ov.querySelector('#pix');
  if (cv) { const im = new Image(); im.src = cv.dataset.src; await im.decode().catch(() => {}); const c = cv.getContext('2d'); c.imageSmoothingEnabled = true; c.drawImage(im, 0, 0, 54, 96); }
  await Promise.all([...ov.querySelectorAll('img')].map((i) => (i.complete && i.naturalWidth ? null : i.decode().catch(() => {}))));
}
