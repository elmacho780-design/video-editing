// Day 3 · Say It Like a Local · ordering coffee: ?view=day. One deterministic render(t) in the paper-cut series look.
// Paced like Days 1 and 2: about 17 s, the hook on screen from frame one, something new roughly every 2 s, each exchange on screen
// at least 2 s. A paper café: the barista's bubbles on the left, yours on the right, and an HML cup that builds with the order.
// All timing is in one table (T) on a 128 BPM grid; when Batu records the voiceover it is re-timed to his words.
import * as P from './paper.js';
import * as C from './local.js';
const { clamp, easeOut } = P;

export const BPM = 128;
const b = (beats) => +(beats * 60 / BPM).toFixed(3);                  // beats to seconds
// ---------------------------------------------------------------- the timing table (seconds)
const T = {
  hook: 0, strike: b(0.75), cross: b(1.25), dots: b(2.25),
  ex: [[5, 6.5], [11, 12.5], [16, 17.5], [21.5, 23]].map(([q, a]) => ({ q: b(q), a: b(a), tick: b(a + 1) })),   // barista asks, you answer, ✓
  recap: b(26.5), lines: [b(27), b(27.5), b(28), b(28.5)], stamp: b(30),
  end: b(32), dur: b(37),
};
export const DUR = T.dur;                                             // 17.34 s; the end card lands at 15.0 s (bar 8 at 128 BPM)
const E = (t, at, d = 0.3) => (t - at) / d;
const X = (t, at, d = 0.22) => (t - at) / d;

// the voiceover subtitles: Claude's Mongolian (Batu to check); his recording decides the final words and timing
const [e1, e2, e3, e4] = T.ex;
const SUBS = [
  [0.03, e1.q - 0.05, '“I want coffee” гэвэл эелдэг биш!'],
  [e1.q + 0.05, e2.q - 0.05, 'Ингэж хэлнэ: Can I have a latte, please?'],
  [e2.q + 0.05, e3.q - 0.05, 'Хэмжээ асуувал: Medium, please.'],
  [e3.q + 0.05, e4.q - 0.05, 'Энд уух уу, авч явах уу? To go, please.'],
  [e4.q + 0.05, T.recap - 0.05, 'Өөр юм уу? That’s all, thanks.'],
  [T.recap + 0.05, T.end - 0.05, 'Хадгалаад, кофе шопод туршаарай!'],
  [T.end + 0.05, T.dur, 'Өдөр бүр шинэ хэллэг. Дагаарай!'],
];
// the four exchanges: the barista's question, your answer (the key words underlined)
const EX = [
  ['What can I get you?', 'Can I have a latte, please?', '<span class="kw">Can I have</span> a latte, please?'],
  ['What size?', 'Medium, please.', '<span class="kw">Medium</span>, please.'],
  ['For here or to go?', 'To go, please.', '<span class="kw">To go</span>, please.'],
  ['Anything else?', 'That’s all, thanks.', '<span class="kw">That’s all</span>, thanks.'],
];
const BY = 980, YY = 1120;                                            // the barista's bubble and yours
const WHO = ['Бариста', 'Та'];

// ---------------------------------------------------------------- scenes
function hook(t) {           // "I want coffee." is there on frame one, struck and crossed; the barista just stares: "..."
  if (t > e1.q + 0.3) return '';
  const xo = X(t, e1.q);
  const dots = [0, 1, 2].map((i) => `<span style="display:inline-block;transform:translateY(${(-10 * Math.max(0, Math.sin((t * 6 - i * 0.9)))).toFixed(1)}px)">.</span>`).join('');
  return C.bubble({ side: 'r', who: WHO[1], text: 'I want coffee.', cls: 'bad', y: YY, e: E(t, -0.3), xo, t, seed: 1, strike: E(t, T.strike, 0.18), cross: E(t, T.cross, 0.16) })
    + C.bubble({ side: 'l', who: WHO[0], html: `<span style="font-size:72px;letter-spacing:4px">${dots}</span>`, y: BY, e: E(t, T.dots, 0.25), xo, t, seed: 2 });
}
function exchange(t, k) {
  const ex = T.ex[k], next = k < 3 ? T.ex[k + 1].q : T.recap;
  if (t < ex.q - 0.05 || t > next + 0.3) return '';
  const xo = X(t, next), [q, a, ah] = EX[k];
  const uk = k === 2 && t > ex.tick + 0.15 ? `<div style="position:absolute;right:8px;bottom:-54px;font:700 34px/1 Manrope;color:#f6eedc;white-space:nowrap;opacity:${clamp((t - ex.tick - 0.15) * 5).toFixed(2)}">UK: <span style="color:#ffb02e">take away</span></div>` : '';
  return C.bubble({ side: 'l', who: WHO[0], text: q, y: BY, e: E(t, ex.q, 0.25), xo, t, seed: 10 + k })
    + C.bubble({ side: 'r', who: WHO[1], text: a, html: ah, y: YY, e: E(t, ex.a, 0.25), xo, t, seed: 20 + k, tick: E(t, ex.tick, 0.18), extra: uk });
}
function cupScene(t) {       // the cup builds with the order; in the recap it moves aside and sits on the receipt
  if (t > T.end + 0.4) return '';
  const m = easeOut((t - T.recap) / 0.45), out = clamp((t - T.end) / 0.25);
  const g = C.cup({ cx: 215 + 615 * m, bottom: 895 - 55 * m - 400 * out ** 2, s: 1.15 - 0.53 * m, t,
    fill: (t - e1.tick) / 0.6, grow: (t - e2.tick) / 0.35, lid: (t - e3.tick) / 0.35, sleeve: (t - e3.tick - 0.12) / 0.3, steam: (t - e4.tick) / 0.7 });
  return out > 0 ? `<div class="layer" style="opacity:${(1 - out).toFixed(3)}">${g}</div>` : g;
}
const menu = (t) => C.menu({ items: ['latte', 'cappuccino', 'americano'], pick: 0, pickU: (t - e1.tick) / 0.35, sizeU: (t - e2.tick) / 0.3, e: E(t, -0.4, 0.35), xo: X(t, T.recap, 0.25), t });
function recap(t) {          // the receipt prints your four lines; the ink stamp says "save this"
  if (t < T.recap - 0.05 || t > T.end + 0.4) return '';
  return C.receipt({ head: 'HML CAFÉ', sub: 'ORDER #003', lines: EX.map(([, a]) => ['1×', a]), lineT: T.lines, t, e: E(t, T.recap + 0.16, 0.35), xo: X(t, T.end, 0.25),
    stamp: 'ХАДГАЛААРАЙ!', stampU: E(t, T.stamp, 0.2) });
}

// ---------------------------------------------------------------- sound cues (s), exported for the score
export const EV = (() => {
  const ev = [['hook', T.hook], ...T.ex.map((x, i) => [`ex${i + 1}`, x.q]), ['recap', T.recap], ['end', T.end]].map(([name, t]) => ({ t, type: 'scene', name }));
  ev.push({ t: T.cross, type: 'pop', kind: 'x' });
  T.ex.forEach((x) => { ev.push({ t: x.q, type: 'say', who: 'them' }, { t: x.a, type: 'say', who: 'you' }, { t: x.tick, type: 'pop', kind: 'tick' }); });
  ev.push({ t: T.dots, type: 'dots' });                              // the awkward pause: the band stops for a beat
  T.lines.forEach((t, i) => ev.push({ t, type: 'line', i }));         // the receipt prints: one note a line
  ev.push({ t: T.stamp, type: 'stamp' });
  ev.push({ t: 0, type: 'clock', bpm: BPM });
  return ev.sort((a, c) => a.t - c.t);
})();

// ---------------------------------------------------------------- page
let st;
export async function init() {
  document.head.insertAdjacentHTML('beforeend', `<style>${P.css}${C.css}</style>`);
  st = document.getElementById('stage');
  window.EV = EV;
  await Promise.all(['assets/hml-logo.png', 'assets/hml-tree.png'].map((src) => { const i = new Image(); i.src = src; return i.decode().catch(() => {}); }));
}
export async function frame(t) {
  t = Math.min(t, DUR - 1 / 60);
  const s = SUBS.find(([a, c]) => t >= a && t < c);
  let g = P.set(t) + P.tag({ text: 'SAY IT LIKE A LOCAL', e: E(t, -0.3, 0.3), xo: X(t, T.end, 0.22) });
  g += menu(t) + hook(t) + T.ex.map((_, k) => exchange(t, k)).join('') + recap(t) + cupScene(t);   // the receipt drops in over the leaving bubbles; the cup sits on top
  if (t >= T.end) g += P.endCard({ series: 'SAY IT LIKE A LOCAL', day: 'Day 3', u: (t - T.end - 0.03) * 1.4, t });
  g += s ? P.sub(s[2], { e: E(t, s[0], 0.15) }) : '';
  st.innerHTML = g;
  await Promise.all([...st.querySelectorAll('img')].map((i) => i.decode().catch(() => {})));
}
