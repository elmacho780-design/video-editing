// The edit: ?view=edit. Look A, "ABC blocks" (approved). This page draws ONLY the graphics, on a transparent background.
// The footage never passes through the browser: tools/overlay.mjs renders this page losslessly with alpha, and tools/composite.sh
// lays it over the original camera file (flipped, as filmed, frame for frame) in a single high-quality encode.
// For check stills only, ?view=edit&bg=1 draws the (flipped) frame underneath.
// No cuts: the take plays exactly as filmed (output time = source time), so there are no jump cuts and no frame mapping.
// The one camera change (12.93 s) is covered by a full-screen wall of blocks. The end card follows her last word.
// Graphic cues sit on the music's eighth-note grid (120 BPM, 0.25 s), next to the word they illustrate (edit/align.json).
// All Mongolian on screen is Claude's, for Batu to check.
import * as A from './blocks.js';
const { clamp, easeIn, easeOut } = A;

export const BPM = 120; const Q = 0.25;
const SRC_END = 979 / 30;                                             // the take: 979 frames at 30 fps (32.63 s)
const END = 32.5;                                                     // the end card, after "За, амжилт хүсье" (speech ends 32.40)
export const DUR = 35.0;
const q = (t) => Math.round(t / Q) * Q;                               // onto the eighth-note grid
const U = (t, at, d = 0.4) => (t - at) / d;                           // entry progress
const O = (t, at, d = 0.35) => (t - at) / d;                          // exit progress

// ---------------------------------------------------------------- cues (seconds; the word each one sits on)
const C = {
  hook: [-0.36, -0.3, -0.24], hookP1: 0.0, hookP2: 0.25, hookOut: 3.75,    // the promise is in place on frame one and complete by 0.5 s
  b1: 4.0, b1j: q(5.32), b1arr: 6.5, b1s: q(6.80), b1tick: q(7.68), b1Out: 8.0,      // "олон улсын…", "1 жил", "1 сарын", "үзээд"
  b2: 8.0, b2p: q(9.94), b2tick: q(11.36), b2q: 12.0, b2Out: 12.45,    // "2 дахь сард", "-р ангийн", "дуусгана", "ямар … байна?"
  wall: 12.45, wallText: 12.75, wallOut: 13.3,                          // the camera change at 12.93 is covered; she faces the camera again by 13.4
  enrol: 13.5, rest: q(13.6), abc: q(14.74), lvl: q(16.54), topOut: 26.0,     // "Амралтын өдрүүдээр", "ABC", "түвшин ахиулах"
  dTag: q(19.68), d14: q(20.46), d15: q(21.08), tTag: q(22.56), t1130: q(23.65), t1300: q(24.65), midOut: 26.0,
  reg: 26.25, n1: q(28.72), n2: q(29.02), nPulse: q(30.64),
  endWall: 32.25, end: END,
};
export const CUES = C;

// ---------------------------------------------------------------- captions: every word she says, phrase by phrase (zone: top while she holds the books)
const CAPS = [
  [0.00, '*2-3* сарын дотор'], [1.66, 'таны хүүхдийг'], [2.42, '*англиар уншиж* сургаад,'],
  [3.94, 'олон улсын хөтөлбөрийн', 1], [5.32, '*1 жил* үздэг номыг', 1], [6.80, '*1 сарын* дотор үзээд,', 1],
  [8.00, '*2 дахь* сард нь', 1], [9.24, '*2-р ангийн* хөтөлбөрийг', 1], [11.02, 'үзээд *дуусгана*', 1], [11.62, 'гэвэл ямар сонсогдож байна?', 1], [12.45, null],
  [13.60, 'Амралтын өдрүүдээр явагдах'], [14.74, '*ABC* болон'], [15.76, 'англи хэлний *түвшин ахиулах*'], [17.36, 'ангидаа *шинээр элсэлт* авч байна.'], [18.85, null],
  [19.29, 'Хичээл нь'], [19.68, '*11 сарын 14, 15*-нд'], [21.76, 'эхэлнэ.'], [22.25, null],
  [22.56, 'Хичээлийн хуваарийн хувьд бол'], [23.65, '*11:30*, *1 цаг*'], [25.59, 'гэсэн ангиуд байгаа.'],
  [26.20, 'Хэрвээ та илүү их мэдээлэл'], [28.06, 'авахыг хүсвэл'], [28.72, 'доорх *утасны дугаараар*'], [29.76, 'холбогдоод *бүртгүүлээрэй.*'],
  [31.25, 'За, амжилт хүсье!'], [END, null],
];
function caption(t) {
  for (let i = CAPS.length - 1; i >= 0; i--) {
    const [at, text, top] = CAPS[i];
    if (t < at) continue;
    return text ? A.cap({ text, y: top ? 468 : 1290, u: (t - at) / 0.18, fs: text.replace(/\*/g, '').length > 24 ? 48 : 54 }) : '';
  }
  return '';
}

// ---------------------------------------------------------------- the beats
function hook(t) {          // "2 - 3 САРЫН ДОТОР / АНГЛИАР УНШИНА" is in place within half a second
  if (t > C.hookOut + 0.5) return '';
  const o = O(t, C.hookOut);
  return A.block({ ch: '2', x: 120, y: 250, s: 150, pal: 'amber', r: -6, fs: 100, u: U(t, C.hook[0]), out: o })
    + A.block({ ch: '-', x: 262, y: 290, s: 92, pal: 'cream', r: 4, fs: 70, u: U(t, C.hook[1]), out: o - 0.05 })
    + A.block({ ch: '3', x: 350, y: 250, s: 150, pal: 'orange', r: 5, fs: 100, u: U(t, C.hook[2]), out: o - 0.1 })
    + A.plank({ text: 'САРЫН<br>ДОТОР', x: 520, y: 262, fs: 56, r: -2, dir: 1, u: U(t, C.hookP1, 0.35), out: o - 0.12 })
    + A.plank({ text: 'АНГЛИАР УНШИНА', x: 150, y: 448, cls: 'navy', r: 1.5, u: U(t, C.hookP2, 0.35), out: o - 0.18 });
}
function books1(t) {        // a year's book in one month: [1][ЖИЛ] → [1][САР] ✓
  if (t < C.b1 - 0.1 || t > C.b1Out + 0.6) return '';
  const o = O(t, C.b1Out);
  return A.tag({ text: 'ОЛОН УЛСЫН ХӨТӨЛБӨР', y: 230, u: U(t, C.b1, 0.25), out: o })
    + A.block({ ch: '1', x: 120, y: 304, s: 128, pal: 'amber', r: -5, fs: 86, u: U(t, C.b1j), out: o })
    + A.plank({ text: 'ЖИЛ', x: 262, y: 322, fs: 52, r: 1, u: U(t, C.b1j + 0.12, 0.35), out: o - 0.05 })
    + (t >= C.b1arr && o < 1 ? `<div class="abs" style="left:440px;top:318px;font:900 80px/1 Montserrat;color:#fff;text-shadow:0 6px 0 #0a1636;opacity:${(clamp(U(t, C.b1arr, 0.2)) * (1 - easeIn(o))).toFixed(3)};transform:translate(${(-40 * (1 - easeOut(U(t, C.b1arr, 0.25)))).toFixed(1)}px,${(-900 * easeIn(o)).toFixed(1)}px)">→</div>` : '')
    + A.block({ ch: '1', x: 530, y: 304, s: 128, pal: 'orange', r: 6, fs: 86, u: U(t, C.b1s), out: o - 0.08 })
    + A.plank({ text: 'САР', x: 672, y: 322, fs: 52, cls: 'navy', r: -1.5, u: U(t, C.b1s + 0.12, 0.35), out: o - 0.1 })
    + A.tick({ x: 832, y: 316, s: 104, u: U(t, C.b1tick, 0.35), out: o - 0.15 });
}
function books2(t) {        // in month two, the grade 2 programme ✓ ... "how does that sound?"
  if (t < C.b2 - 0.1 || t > C.b2Out + 0.6) return '';
  const o = O(t, C.b2Out);
  return A.tag({ text: '2 ДАХЬ САРД', y: 230, u: U(t, C.b2 + 0.15, 0.25), out: o })
    + A.plank({ text: '2-Р АНГИЙН ХӨТӨЛБӨР', x: 120, y: 306, fs: 50, u: U(t, C.b2p, 0.35), out: o - 0.05 })
    + A.tick({ x: 820, y: 300, s: 110, u: U(t, C.b2tick, 0.35), out: o - 0.1 })
    + A.block({ ch: '?', x: 790, y: 1100, s: 140, pal: 'orange', r: -6, fs: 96, u: U(t, C.b2q), out: o });
}
// a full-screen wall of blocks: falls in row by row from the bottom, holds, falls away (covers the camera change)
const LET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function wall(t, at, outAt, text = null) {
  const span = outAt + 0.6; if (t < at || t > span) return '';
  const pals = ['amber', 'orange', 'cream', 'navy'];
  const back = clamp((t - at - 0.17) / 0.12) * (1 - clamp((t - outAt) / 0.1));
  let g = back > 0 ? `<div class="layer" style="background:#14295a;opacity:${back.toFixed(3)}"></div>` : '';
  for (let r = 0; r < 10; r++) for (let c = 0; c < 6; c++) {
    const k = r * 6 + c, t0 = at + (9 - r) * 0.016 + c * 0.006, t1 = outAt + r * 0.012 + c * 0.004;
    const u = (t - t0) / 0.2, x = (t - t1) / 0.24;
    if (u <= 0 || x >= 1) continue;
    const y = r * 192 - 1200 * (1 - A.bounce(u)) + 2000 * clamp(x) ** 2;
    const pal = pals[(r * 7 + c * 3) % 4], [bg, sd] = A.PAL[pal];
    g += `<div class="blk${pal === 'navy' ? ' navy' : ''}" style="left:${c * 180 + 4}px;top:${(y + 4).toFixed(1)}px;width:172px;height:176px;background:${bg};--side:${sd};font-size:84px;transform:rotate(${(((k * 37) % 9) - 4) * (1 - clamp(u)) * 2}deg)">${LET[(k * 5) % 26]}</div>`;
  }
  if (text) g += A.plank({ text, x: 190, y: 860, fs: 76, cls: 'navy', u: U(t, at + 0.3, 0.3), out: O(t, outAt - 0.05, 0.3), extra: 'z-index:5' });
  return g;
}
function enrol(t) {         // the weekend classes: ABC and level-up
  if (t < C.enrol - 0.1 || t > C.topOut + 0.6) return '';
  const o = O(t, C.topOut);
  return A.tag({ text: 'ШИНЭЭР ЭЛСЭЛТ', y: 230, u: U(t, C.enrol, 0.25), out: o })
    + A.plank({ text: 'АМРАЛТЫН ӨДРҮҮДЭД', x: 120, y: 300, fs: 50, cls: 'cream', u: U(t, C.rest, 0.35), out: o })
    + A.plank({ text: 'ABC анги', x: 120, y: 424, fs: 50, u: U(t, C.abc, 0.35), out: o - 0.05 })
    + A.plank({ text: 'Түвшин ахиулах', x: 462, y: 424, fs: 50, cls: 'navy', dir: 1, u: U(t, C.lvl, 0.35), out: o - 0.1 });
}
function dates(t) {         // the start days and the class times, as a row of blocks over her sweater
  if (t < C.dTag - 0.1 || t > C.midOut + 0.6) return '';
  const o = O(t, C.midOut), d = (a, b) => `<span style="font-size:46px;line-height:1.05">${a}<br><span style="font-size:32px">${b}</span></span>`;
  return A.tag({ text: 'ЭХЛЭХ ӨДӨР', x: 120, y: 986, u: U(t, C.dTag, 0.25), out: o })
    + A.block({ ch: d('11/14', 'Бямба'), x: 120, y: 1058, s: 186, pal: 'amber', r: -5, u: U(t, C.d14), out: o })
    + A.block({ ch: d('11/15', 'Ням'), x: 318, y: 1072, s: 186, pal: 'cream', r: 4, u: U(t, C.d15), out: o - 0.05 })
    + A.tag({ text: 'ЦАГ', x: 560, y: 986, r: 2, u: U(t, C.tTag, 0.25), out: o })
    + A.block({ ch: '<span style="font-size:48px">11:30</span>', x: 560, y: 1058, s: 176, pal: 'orange', r: 3, u: U(t, C.t1130), out: o - 0.1 })
    + A.block({ ch: '<span style="font-size:48px">13:00</span>', x: 750, y: 1072, s: 176, pal: 'amber', r: -4, u: U(t, C.t1300), out: o - 0.15 });
}
function contact(t) {       // register: the two numbers, from "доорх утасны дугаараар" to the end card
  if (t < C.reg - 0.1 || t > END + 0.4) return '';
  const o = O(t, END - 0.1, 0.3), p = (t - C.nPulse) / 0.3, pulse = p > 0 && p < 1 ? 1 + 0.06 * Math.sin(Math.PI * p) : 1;
  return A.tag({ text: 'БҮРТГҮҮЛЭЭРЭЙ', y: 230, u: U(t, C.reg, 0.25), out: o })
    + `<div class="layer" style="transform-origin:120px 400px;transform:scale(${pulse.toFixed(3)})">`
    + A.plank({ text: '9930 4451', x: 120, y: 300, fs: 72, u: U(t, C.n1, 0.35), out: o })
    + A.plank({ text: '8888 3351', x: 200, y: 432, fs: 72, cls: 'navy', dir: 1, u: U(t, C.n2, 0.35), out: o - 0.05 }) + '</div>';
}
function endCard(t) {       // the logo, what and when, both numbers, @hml_english (the wall of blocks brings it in)
  if (t < C.endWall) return '';
  let g = wall(t, C.endWall, C.end + 0.35);
  const u = (d) => U(t, C.end + d, 0.35);
  if (t >= C.end + 0.2) {
    g += `<div class="layer" style="background:#14295a;opacity:${clamp((t - C.end - 0.2) / 0.15).toFixed(3)}"></div>`;
    const lg = clamp(u(0.25));
    g += `<div class="abs" style="left:250px;top:300px;width:580px;height:470px;border-radius:28px;background:#fff url(assets/hml-logo.png) 50% 46%/104% no-repeat;box-shadow:0 12px 0 #cdbb94,0 24px 30px rgba(0,0,0,.4);transform:translateY(${(-300 * (1 - A.bounce(lg))).toFixed(1)}px) rotate(${(-2 + 8 * (1 - easeOut(lg))).toFixed(2)}deg);opacity:${clamp(lg * 6).toFixed(3)}"></div>`;
    g += A.plank({ text: 'ШИНЭЭР ЭЛСЭЛТ', x: 230, y: 820, fs: 60, u: u(0.45) });
    g += A.block({ ch: '<span style="font-size:36px;line-height:1.05">11/14<br>11/15</span>', x: 150, y: 970, s: 170, pal: 'amber', r: -4, u: u(0.6) })
      + A.block({ ch: '<span style="font-size:40px">11:30</span>', x: 345, y: 980, s: 170, pal: 'cream', r: 3, u: u(0.68) })
      + A.block({ ch: '<span style="font-size:40px">13:00</span>', x: 540, y: 970, s: 170, pal: 'orange', r: -3, u: u(0.76) })
      + A.block({ ch: '<span style="font-size:52px">ABC</span>', x: 735, y: 980, s: 170, pal: 'navy', r: 4, u: u(0.84) });
    g += A.plank({ text: '9930 4451', x: 150, y: 1190, fs: 66, cls: 'cream', u: u(0.95) })
      + A.plank({ text: '8888 3351', x: 150, y: 1314, fs: 66, cls: 'cream', u: u(1.05) })
      + A.tag({ text: '@hml_english', x: 640, y: 1268, r: -3, u: U(t, C.end + 1.2, 0.25) });
  }
  return g;
}

// ---------------------------------------------------------------- sound cues (s), exported for the score
export const EV = (() => {
  const ev = [];
  const hit = (t, kind, extra = {}) => ev.push({ t: +t.toFixed(3), type: 'hit', kind, ...extra });
  hit(0, 'start'); hit(C.hookP2, 'plank');
  hit(C.b1, 'tag'); hit(C.b1j, 'block', { n: 1 }); hit(C.b1s, 'block', { n: 2 }); hit(C.b1tick, 'tick');
  hit(C.b2, 'tag'); hit(C.b2p, 'plank'); hit(C.b2tick, 'tick'); hit(C.b2q, 'question');
  hit(C.wall, 'wall'); hit(C.wallOut, 'wallOut');
  hit(C.rest, 'plank'); hit(C.abc, 'block', { n: 1 }); hit(C.lvl, 'block', { n: 2 });
  hit(C.d14, 'block', { n: 1 }); hit(C.d15, 'block', { n: 2 }); hit(C.t1130, 'block', { n: 3 }); hit(C.t1300, 'block', { n: 4 });
  hit(C.n1, 'plank'); hit(C.n2, 'plank'); hit(C.endWall, 'wall'); hit(C.end, 'end');
  ev.push({ t: 0, type: 'clock', bpm: BPM }, { t: 0, type: 'speech', spans: [[0.0, 12.72], [13.6, 18.8], [19.29, 22.15], [22.56, 26.25], [26.2, 32.4]] });
  return ev.sort((a, b) => a.t - b.t);
})();

// ---------------------------------------------------------------- page
let st, BG = false;
export async function init(qs) {
  BG = qs.get('bg') === '1';
  document.head.insertAdjacentHTML('beforeend', `<style>${A.css}${BG ? '' : 'html,body,#stage{background:transparent!important}'}</style>`);
  st = document.getElementById('stage');
  window.EV = EV;
  await Promise.all(['assets/hml-logo.png'].map((src) => { const i = new Image(); i.src = src; return i.decode().catch(() => {}); }));
}
export async function frame(t) {
  t = Math.min(t, DUR - 1 / 60);
  let g = BG ? `<img src="frames/${String(Math.min(978, Math.round(t * 30))).padStart(5, '0')}.jpg" style="position:absolute;left:0;top:0;width:1080px;height:1920px">` : '';
  g += hook(t) + books1(t) + books2(t) + enrol(t) + dates(t) + contact(t) + caption(t) + wall(t, C.wall, C.wallOut, 'ШИНЭЭР ЭЛСЭЛТ') + endCard(t);
  st.innerHTML = g;
  await Promise.all([...st.querySelectorAll('img')].map((x) => x.decode().catch(() => {})));
}
