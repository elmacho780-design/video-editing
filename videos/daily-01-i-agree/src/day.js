// Day 1 · Stop Saying This · "I am agree" vs "I agree": ?view=day. One deterministic render(t) in the paper-cut series look.
// PREVIEW TIMING: the scenes follow SCRIPT.md on a 120 BPM grid until Batu records the voiceover; then every cue is re-timed to his words.
import * as P from './paper.js';
const { clamp, easeIn, easeOut } = P;

export const BPM = 120;
// scene starts (s): hook, why, verb, fix, three pairs, recap, end card
const S = { hook: 0, why: 2.5, verb: 6.0, fix: 8.5, p1: 11.5, p2: 14.5, p3: 18.0, recap: 21.0, end: 24.5 };
export const DUR = 27.5;
const E = (t, at, d = 0.42) => (t - at) / d;                         // entry progress
const X = (t, at, d = 0.3) => (t - at) / d;                          // exit progress

// the voiceover subtitles (Claude's Mongolian from SCRIPT.md: Batu to check; his recording decides the final words and timing)
const SUBS = [
  [0.1, 2.45, '“I am agree” гэж битгий хэлээрэй!'], [2.6, 4.3, 'Монголоор “зөвшөөрч байна” гэдэг болохоор'], [4.3, 5.95, '“байна”-г am гэж орчуулчихдаг'],
  [6.05, 7.2, 'Гэхдээ agree бол үйл үг.'], [7.2, 8.45, 'Түүнд am хэрэггүй.'], [8.55, 11.45, 'Зөв нь: I agree.'],
  [11.6, 14.45, 'Үгүйсгэхдээ: I don’t agree.'], [14.6, 17.95, 'Асуухдаа: Do you agree?'], [18.1, 20.95, '“Тэр” гэвэл: She agrees.'],
  [21.1, 22.7, 'Санаж аваарай:'], [22.7, 24.4, 'agree-ийн өмнө am, is, are хэрэггүй.'], [24.6, 27.4, 'Өдөр бүр нэг алдаа засъя. Дагаарай!'],
];
const PAIRS = [[S.p1, 'I am not agree', 'I don’t agree'], [S.p2, 'Are you agree?', 'Do you agree?'], [S.p3, 'She is agree', 'She agrees']];
const AM_CUT = 7.45;

// ---------------------------------------------------------------- scenes
function hook(t) {
  const L = P.layout(['I', 'am', 'agree']), x = X(t, S.why);
  return L.map((o, i) => P.tile({ ...o, y: 760, cls: i === 1 ? 'bad' : '', r: [-2, 3, -1][i], e: E(t, -0.45 + 0.1 * i), xo: x, t, seed: i })).join('')
    + P.stamp({ kind: 'x', x: L[1].x + L[1].w / 2 - 100, y: 725, u: E(t, 1.2, 0.22), xo: x });
}
function why(t) {
  if (t < S.why - 0.1 || t > S.verb + 0.4) return '';
  const M = P.layout(['Би зөвшөөрч', 'байна'], { kind: 'mn' }), x = X(t, S.verb), b = M[1];
  const A = P.layout(['am'], { cx: 470 });
  return M.map((o, i) => P.tile({ ...o, y: 690, cls: 'mn', r: [-1, 2][i], e: E(t, S.why + 0.12 + 0.12 * i), xo: x, t, seed: 4 + i })).join('')
    + P.underline({ x: b.x + 28, y: 690 + 84, w: b.w - 56, u: E(t, 3.45, 0.3), xo: x })
    + P.arrow({ d: `M${b.x + b.w * 0.55} 830 C${b.x + b.w * 0.95} 880 ${b.x + b.w * 0.9} 960 ${A[0].x + A[0].w + 40} 1000`, head: `M${A[0].x + A[0].w + 40} 1000 l20 -38 M${A[0].x + A[0].w + 40} 1000 l42 6`, u: E(t, 4.0, 0.4), xo: x })
    + P.tile({ ...A[0], y: 950, r: 4, e: E(t, 4.45), xo: x, t, seed: 6 })
    + P.tile({ text: '?', x: A[0].x + A[0].w + 90, y: 950, w: 90, cls: 'orange', r: -6, e: E(t, 4.65), xo: x, t, seed: 7 });
}
function verb(t) {           // "I am agree" again; "agree = үйл үг"; scissors snip "am"; the gap closes; it becomes the fix scene
  if (t < S.verb - 0.1 || t > S.p1 + 0.4) return '';
  const L3 = P.layout(['I', 'am', 'agree']), L2 = P.layout(['I', 'agree']), x = X(t, S.p1);
  const close = easeOut((t - AM_CUT - 0.1) / 0.4), lx = (a, b) => a + (b - a) * close;
  const I = { ...L3[0], x: lx(L3[0].x, L2[0].x) }, AG = { ...L3[2], x: lx(L3[2].x, L2[1].x) };
  const bump = t >= S.fix && t < S.fix + 0.25 ? 1 + 0.06 * Math.sin(Math.PI * (t - S.fix) / 0.25) : 1;
  let g = `<div class="layer" style="transform-origin:540px 826px;transform:scale(${bump.toFixed(3)})">`;
  g += P.tile({ ...I, y: 760, r: -2, e: E(t, S.verb + 0.05), xo: x, t, seed: 0 }) + P.tile({ ...AG, y: 760, r: -1, e: E(t, S.verb + 0.21), xo: x, t, seed: 2 });
  // "am": in, shakes before the cut, then falls away
  const am = L3[1], f = (t - AM_CUT) / 0.6;
  if (f < 1) {
    const shake = t > AM_CUT - 0.45 && t < AM_CUT ? 6 * Math.sin((t - AM_CUT) * 70) : 0;
    const fall = f > 0 ? `transform:translate(${(40 * f).toFixed(1)}px,${(420 * easeIn(f)).toFixed(1)}px) rotate(${(50 * f).toFixed(1)}deg);opacity:${(1 - easeIn(f)).toFixed(3)}` : null;
    g += f > 0 ? `<div class="tile depth bad" style="left:${am.x}px;top:760px;width:${am.w}px;${fall}">am</div>`
      : P.tile({ ...am, y: 760, cls: 'bad', r: 3, e: E(t, S.verb + 0.13), t, seed: 1, extra: shake ? `margin-left:${shake.toFixed(1)}px` : '' });
  }
  g += '</div>';
  g += P.scissors({ x: am.x - 60, y: 620, r: 34, e: E(t, AM_CUT - 0.55, 0.35), c: (t - (AM_CUT - 0.12)) / 0.12, xo: X(t, AM_CUT + 0.3, 0.4) });   // from above, closing on "am"
  // the "agree = үйл үг (verb)" chip
  const chipText = 'agree = үйл үг (verb)', cw = P.measure(chipText, 'mn', 52);
  g += P.tile({ text: chipText, html: '<span style="color:#ff6a2b">agree</span>&nbsp;= үйл үг (verb)', x: 540 - cw / 2, y: 960, w: cw, cls: 'mn', extra: 'font-size:52px;height:96px', r: 1.5, e: E(t, 6.55), xo: X(t, S.fix), t, seed: 8 });
  g += P.stamp({ kind: 'tick', x: L2[1].x + L2[1].w - 70, y: 640, s: 1.05, u: E(t, 8.9, 0.22), xo: x });
  return g;
}
function pair(t, [at, wrong, right], k) {
  if (t < at - 0.1 || t > at + 3.5 + 0.4) return '';
  const next = k < 2 ? PAIRS[k + 1][0] : S.recap, x = X(t, next);
  const ww = P.measure(wrong, 'en', 72), wx = 540 - ww / 2;
  let g = P.tile({ text: wrong, x: wx, y: 690, w: ww, cls: 'bad', r: -1, extra: 'font-size:72px;height:112px;color:#6b4040', e: E(t, at + 0.15), xo: x, t, seed: 10 + k });
  g += P.strike({ x: wx + 20, y: 740, w: ww - 40, u: E(t, at + 0.6, 0.25), xo: x });
  g += P.stamp({ kind: 'x', x: wx + ww - 60, y: 640, s: 0.55, u: E(t, at + 0.9, 0.2), xo: x });
  if (right === 'She agrees') {           // the "-s" arrives as its own orange tile
    const L = P.layout(['She agree', 's'], { gap: 8, size: 84 });
    g += P.tile({ ...L[0], y: 880, r: 1, extra: 'font-size:84px', e: E(t, at + 1.3), xo: x, t, seed: 20 })
      + P.tile({ ...L[1], y: 880, cls: 'orange', r: -5, extra: 'font-size:84px', e: E(t, at + 1.9, 0.3), xo: x, t, seed: 21 });
    g += P.stamp({ kind: 'tick', x: L[1].x + L[1].w - 50, y: 820, s: 0.62, u: E(t, at + 1.65, 0.22), xo: x });
  } else {
    const rw = P.measure(right, 'en', 84), rx = 540 - rw / 2;
    g += P.tile({ text: right, x: rx, y: 880, w: rw, r: 1, extra: 'font-size:84px', e: E(t, at + 1.3), xo: x, t, seed: 20 + k });
    g += P.stamp({ kind: 'tick', x: rx + rw - 70, y: 820, s: 0.62, u: E(t, at + 1.65, 0.22), xo: x });
  }
  return g;
}
function recap(t) {
  if (t < S.recap - 0.1 || t > S.end + 0.4) return '';
  const x = X(t, S.end), aw = P.measure('agree', 'en', 120);
  let g = P.tile({ text: 'agree', x: 600 - aw / 2, y: 760, w: aw, extra: 'font-size:120px;height:160px', r: -2, e: E(t, S.recap + 0.15), xo: x, t, seed: 30 });
  ['am', 'is', 'are'].forEach((w, i) => {
    const ww = P.measure(w, 'en', 60), at = S.recap + 0.35 + 0.1 * i, fallAt = 21.9 + 0.5 * i, f = (t - fallAt) / 0.6;
    if (f >= 1) return;
    const base = { text: w, x: 150, y: 690 + i * 96, w: ww, cls: 'bad', extra: 'font-size:60px;height:84px' };
    g += f > 0 ? `<div class="tile depth bad" style="left:150px;top:${690 + i * 96}px;width:${ww}px;font-size:60px;height:84px;transform:translate(${(-30 * f).toFixed(1)}px,${(500 * easeIn(f)).toFixed(1)}px) rotate(${(-40 * f).toFixed(1)}deg);opacity:${(1 - easeIn(f)).toFixed(3)}">${w}</div>`
      : P.tile({ ...base, r: [-6, 4, -3][i], e: E(t, at), t, seed: 31 + i });
  });
  const mt = 'agree ганцаараа ажилладаг', mw = P.measure(mt, 'mn', 56);
  g += P.tile({ text: mt, html: '<span style="color:#ff6a2b">agree</span>&nbsp;ганцаараа ажилладаг', x: 540 - mw / 2, y: 990, w: mw, cls: 'mn', extra: 'font-size:56px;height:100px', r: 1, e: E(t, 23.4), xo: x, t, seed: 35 });
  return g;
}

// ---------------------------------------------------------------- sound cues (s), exported for the score: scene starts and the pops
export const EV = (() => {
  const ev = Object.entries(S).map(([k, t]) => ({ t, type: 'scene', name: k }));
  [[1.2, 'x'], [AM_CUT + 0.05, 'cut'], [8.9, 'tick']].forEach(([t, k]) => ev.push({ t, type: 'pop', kind: k }));
  PAIRS.forEach(([at], i) => { ev.push({ t: at + 1.65, type: 'pop', kind: 'tick' }); if (i === 2) ev.push({ t: at + 1.9, type: 'pop', kind: 's' }); });
  ev.push({ t: 0, type: 'clock', bpm: BPM });
  return ev.sort((a, b) => a.t - b.t);
})();

// ---------------------------------------------------------------- page
let st;
export async function init() {
  document.head.insertAdjacentHTML('beforeend', `<style>${P.css}</style>`);
  st = document.getElementById('stage');
  window.EV = EV;
  // load the paper set's images once, so no frame is captured before they arrive
  await Promise.all(['assets/hml-logo.png', 'assets/hml-tree.png'].map((src) => { const i = new Image(); i.src = src; return i.decode().catch(() => {}); }));
}
export async function frame(t) {
  t = Math.min(t, DUR - 1 / 60);
  const s = SUBS.find(([a, b]) => t >= a && t < b);
  let g = P.set(t) + P.tag({ e: E(t, -0.2, 0.4), xo: X(t, S.end) });
  g += hook(t) + why(t) + verb(t) + PAIRS.map((p, k) => pair(t, p, k)).join('') + recap(t);
  if (t >= S.end) g += P.endCard({ u: t - S.end - 0.05, t });
  g += s ? P.sub(s[2], { e: E(t, s[0], 0.2) }) : '';
  st.innerHTML = g;
  await Promise.all([...st.querySelectorAll('img')].map((i) => i.decode().catch(() => {})));
}
