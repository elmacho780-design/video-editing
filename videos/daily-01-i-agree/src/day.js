// Day 1 · Stop Saying This · "I am agree" vs "I agree": ?view=day. One deterministic render(t) in the paper-cut series look.
// PACING (after feedback that the first preview was too slow): about 17 s, a new beat roughly every 2 s, each example on screen
// at least 2 s (the series minimum), no scene that only holds. All timing is in one table (T), on a 128 BPM grid. When Batu records the
// voiceover, the table is re-timed to his words and everything follows.
import * as P from './paper.js';
const { easeIn, easeOut } = P;

export const BPM = 128;
const b = (beats) => +(beats * 60 / BPM).toFixed(3);                  // beats to seconds
// ---------------------------------------------------------------- the timing table (seconds)
const T = {
  hook: 0, cross: b(1.25),
  why: b(3.5), underline: b(5), arrow: b(6), am: b(7), q: b(7.5),
  verb: b(9), chip: b(9.75), cut: b(10.75), fix: b(12),
  p1: b(14), p2: b(18.75), p3: b(23),                                 // each pair about 2.1 s; every ✓ lands on an off-beat, clear of the downbeats
  recap: b(27.5), falls: [b(28.5), b(29), b(29.5)], alone: b(30.5),
  end: b(32), dur: b(37),
};
export const DUR = T.dur;
// inside each pair (s after its start): wrong sentence, strike, ✗, right sentence, ✓; in "She agrees" the "-s" slaps on first, then the ✓
const PT = { wrong: 0.04, strike: 0.28, cross: 0.42, right: 0.58, tick: 0.82, s: b(1.75), sTick: b(2.5) };
const E = (t, at, d = 0.3) => (t - at) / d;                          // entry progress
const X = (t, at, d = 0.22) => (t - at) / d;                         // exit progress

// the voiceover subtitles: Claude's shorter Mongolian lines (Batu to check); his recording decides the final words and timing
const SUBS = [
  [0.03, T.why - 0.05, '“I am agree” гэж битгий хэлээрэй!'],
  [T.why + 0.05, T.verb - 0.05, '“Зөвшөөрч байна” гэдгээс болж am нэмдэг.'],
  [T.verb + 0.05, T.fix - 0.05, 'Гэхдээ agree бол үйл үг, am хэрэггүй.'],
  [T.fix, T.p1 - 0.05, 'Зөв нь: I agree.'],
  [T.p1 + 0.05, T.p2 - 0.05, 'I don’t agree.'], [T.p2 + 0.05, T.p3 - 0.05, 'Do you agree?'], [T.p3 + 0.05, T.recap - 0.05, 'She agrees.'],
  [T.recap + 0.05, T.end - 0.05, 'agree-д am, is, are хэрэггүй!'],
  [T.end + 0.05, T.dur, 'Дагаад, өдөр бүр нэг алдаа засаарай!'],
];
const PAIRS = [[T.p1, 'I am not agree', 'I don’t agree'], [T.p2, 'Are you agree?', 'Do you agree?'], [T.p3, 'She is agree', 'She agrees']];

// ---------------------------------------------------------------- scenes
function hook(t) {          // the tiles slam in on frame one; the ✗ lands at 0.6 s
  if (t > T.why + 0.3) return '';
  const L = P.layout(['I', 'am', 'agree']), x = X(t, T.why);
  return L.map((o, i) => P.tile({ ...o, y: 760, cls: i === 1 ? 'bad' : '', r: [-2, 3, -1][i], e: E(t, -0.36 + 0.08 * i), xo: x, t, seed: i })).join('')
    + P.stamp({ kind: 'x', x: L[1].x + L[1].w / 2 - 100, y: 725, u: E(t, T.cross, 0.18), xo: x });
}
function why(t) {
  if (t < T.why - 0.1 || t > T.verb + 0.3) return '';
  const M = P.layout(['Би зөвшөөрч', 'байна'], { kind: 'mn' }), x = X(t, T.verb), bn = M[1];
  const A = P.layout(['am'], { cx: 470 });
  return M.map((o, i) => P.tile({ ...o, y: 690, cls: 'mn', r: [-1, 2][i], e: E(t, T.why + 0.04 + 0.08 * i), xo: x, t, seed: 4 + i })).join('')
    + P.underline({ x: bn.x + 28, y: 690 + 84, w: bn.w - 56, u: E(t, T.underline, 0.22), xo: x })
    + P.arrow({ d: `M${bn.x + bn.w * 0.55} 830 C${bn.x + bn.w * 0.95} 880 ${bn.x + bn.w * 0.9} 960 ${A[0].x + A[0].w + 40} 1000`, head: `M${A[0].x + A[0].w + 40} 1000 l20 -38 M${A[0].x + A[0].w + 40} 1000 l42 6`, u: E(t, T.arrow, 0.3), xo: x })
    + P.tile({ ...A[0], y: 950, r: 4, e: E(t, T.am), xo: x, t, seed: 6 })
    + P.tile({ text: '?', x: A[0].x + A[0].w + 90, y: 950, w: 90, cls: 'orange', r: -6, e: E(t, T.q), xo: x, t, seed: 7 });
}
function verb(t) {           // "I am agree" again, "agree = үйл үг", the scissors snip "am", the gap closes, "I agree ✓"
  if (t < T.verb - 0.1 || t > T.p1 + 0.3) return '';
  const L3 = P.layout(['I', 'am', 'agree']), L2 = P.layout(['I', 'agree']), x = X(t, T.p1);
  const close = easeOut((t - T.cut - 0.06) / 0.3), lx = (a, c) => a + (c - a) * close;
  const I = { ...L3[0], x: lx(L3[0].x, L2[0].x) }, AG = { ...L3[2], x: lx(L3[2].x, L2[1].x) };
  const bump = t >= T.fix && t < T.fix + 0.22 ? 1 + 0.07 * Math.sin(Math.PI * (t - T.fix) / 0.22) : 1;
  let g = `<div class="layer" style="transform-origin:540px 826px;transform:scale(${bump.toFixed(3)})">`;
  g += P.tile({ ...I, y: 760, r: -2, e: E(t, T.verb), xo: x, t, seed: 0 }) + P.tile({ ...AG, y: 760, r: -1, e: E(t, T.verb + 0.12), xo: x, t, seed: 2 });
  const am = L3[1], f = (t - T.cut) / 0.45;                          // "am": in, shakes before the cut, then falls away
  if (f < 1) {
    const shake = t > T.cut - 0.3 && t < T.cut ? 6 * Math.sin((t - T.cut) * 80) : 0;
    g += f > 0 ? `<div class="tile depth bad" style="left:${am.x}px;top:760px;width:${am.w}px;transform:translate(${(40 * f).toFixed(1)}px,${(440 * easeIn(f)).toFixed(1)}px) rotate(${(50 * f).toFixed(1)}deg);opacity:${(1 - easeIn(f)).toFixed(3)}">am</div>`
      : P.tile({ ...am, y: 760, cls: 'bad', r: 3, e: E(t, T.verb + 0.06), t, seed: 1, extra: shake ? `margin-left:${shake.toFixed(1)}px` : '' });
  }
  g += '</div>';
  g += P.scissors({ x: am.x - 60, y: 620, r: 34, e: E(t, T.cut - 0.4, 0.25), c: (t - (T.cut - 0.1)) / 0.1, xo: X(t, T.cut + 0.2, 0.3) });   // from above, closing on "am"
  const chipText = 'agree = үйл үг (verb)', cw = P.measure(chipText, 'mn', 52);
  g += P.tile({ text: chipText, html: '<span style="color:#ff6a2b">agree</span>&nbsp;= үйл үг (verb)', x: 540 - cw / 2, y: 960, w: cw, cls: 'mn', extra: 'font-size:52px;height:96px', r: 1.5, e: E(t, T.chip), xo: x, t, seed: 8 });
  g += P.stamp({ kind: 'tick', x: L2[1].x + L2[1].w - 70, y: 640, s: 1.05, u: E(t, T.fix, 0.18), xo: x });
  return g;
}
function pair(t, [at, wrong, right], k) {   // the wrong one arrives and is struck at once; the right one follows straight away
  const next = k < 2 ? PAIRS[k + 1][0] : T.recap;
  if (t < at - 0.1 || t > next + 0.3) return '';
  const x = X(t, next), ww = P.measure(wrong, 'en', 72), wx = 540 - ww / 2;
  let g = P.tile({ text: wrong, x: wx, y: 690, w: ww, cls: 'bad', r: -1, extra: 'font-size:72px;height:112px;color:#6b4040', e: E(t, at + PT.wrong), xo: x, t, seed: 10 + k });
  g += P.strike({ x: wx + 20, y: 740, w: ww - 40, u: E(t, at + PT.strike, 0.18), xo: x });
  g += P.stamp({ kind: 'x', x: wx + ww - 60, y: 640, s: 0.55, u: E(t, at + PT.cross, 0.16), xo: x });
  if (right === 'She agrees') {           // the "-s" arrives as its own orange tile
    const L = P.layout(['She agree', 's'], { gap: 8, size: 84 });
    g += P.tile({ ...L[0], y: 880, r: 1, extra: 'font-size:84px', e: E(t, at + PT.right), xo: x, t, seed: 20 })
      + P.tile({ ...L[1], y: 880, cls: 'orange', r: -5, extra: 'font-size:84px', e: E(t, at + PT.s, 0.24), xo: x, t, seed: 21 });
    g += P.stamp({ kind: 'tick', x: L[1].x + L[1].w - 50, y: 820, s: 0.62, u: E(t, at + PT.sTick, 0.18), xo: x });
  } else {
    const rw = P.measure(right, 'en', 84), rx = 540 - rw / 2;
    g += P.tile({ text: right, x: rx, y: 880, w: rw, r: 1, extra: 'font-size:84px', e: E(t, at + PT.right), xo: x, t, seed: 20 + k });
    g += P.stamp({ kind: 'tick', x: rx + rw - 70, y: 820, s: 0.62, u: E(t, at + PT.tick, 0.18), xo: x });
  }
  return g;
}
function recap(t) {
  if (t < T.recap - 0.1 || t > T.end + 0.3) return '';
  const x = X(t, T.end), aw = P.measure('agree', 'en', 120);
  let g = P.tile({ text: 'agree', x: 600 - aw / 2, y: 760, w: aw, extra: 'font-size:120px;height:160px', r: -2, e: E(t, T.recap + 0.05), xo: x, t, seed: 30 });
  ['am', 'is', 'are'].forEach((w, i) => {
    const ww = P.measure(w, 'en', 60), f = (t - T.falls[i]) / 0.45;
    if (f >= 1) return;
    g += f > 0 ? `<div class="tile depth bad" style="left:150px;top:${690 + i * 96}px;width:${ww}px;font-size:60px;height:84px;transform:translate(${(-30 * f).toFixed(1)}px,${(500 * easeIn(f)).toFixed(1)}px) rotate(${(-40 * f).toFixed(1)}deg);opacity:${(1 - easeIn(f)).toFixed(3)}">${w}</div>`
      : P.tile({ text: w, x: 150, y: 690 + i * 96, w: ww, cls: 'bad', extra: 'font-size:60px;height:84px', r: [-6, 4, -3][i], e: E(t, T.recap + 0.12 + 0.06 * i), t, seed: 31 + i });
  });
  const mt = 'agree ганцаараа ажилладаг', mw = P.measure(mt, 'mn', 56);
  g += P.tile({ text: mt, html: '<span style="color:#ff6a2b">agree</span>&nbsp;ганцаараа ажилладаг', x: 540 - mw / 2, y: 990, w: mw, cls: 'mn', extra: 'font-size:56px;height:100px', r: 1, e: E(t, T.alone), xo: x, t, seed: 35 });
  return g;
}

// ---------------------------------------------------------------- sound cues (s), exported for the score: scene starts and the pops
export const EV = (() => {
  const ev = [['hook', T.hook], ['why', T.why], ['verb', T.verb], ['p1', T.p1], ['p2', T.p2], ['p3', T.p3], ['recap', T.recap], ['end', T.end]].map(([name, t]) => ({ t, type: 'scene', name }));
  [[T.cross, 'x'], [T.cut + 0.03, 'cut'], [T.fix, 'tick']].forEach(([t, kind]) => ev.push({ t, type: 'pop', kind }));
  PAIRS.forEach(([at], i) => { ev.push({ t: +(at + (i === 2 ? PT.sTick : PT.tick)).toFixed(3), type: 'pop', kind: 'tick' }); if (i === 2) ev.push({ t: +(at + PT.s).toFixed(3), type: 'pop', kind: 's' }); });
  ev.push({ t: 0, type: 'clock', bpm: BPM });
  return ev.sort((a, c) => a.t - c.t);
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
  const s = SUBS.find(([a, c]) => t >= a && t < c);
  let g = P.set(t) + P.tag({ e: E(t, -0.3, 0.3), xo: X(t, T.end) });
  g += hook(t) + why(t) + verb(t) + PAIRS.map((p, k) => pair(t, p, k)).join('') + recap(t);
  if (t >= T.end) g += P.endCard({ u: (t - T.end - 0.03) * 1.4, t });
  g += s ? P.sub(s[2], { e: E(t, s[0], 0.15) }) : '';
  st.innerHTML = g;
  await Promise.all([...st.querySelectorAll('img')].map((i) => i.decode().catch(() => {})));
}
