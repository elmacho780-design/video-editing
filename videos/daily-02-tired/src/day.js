// Day 2 · One Word, Three Levels · tired, exhausted, fatigued: ?view=day. One deterministic render(t) in the paper-cut series look.
// Paced like Day 1 version 2: about 17 s, the hook on screen from frame one, something new roughly every 2 s, each example on screen
// at least 2 s. All timing is in one table (T) on a 128 BPM grid; when Batu records the voiceover it is re-timed to his words.
import * as P from './paper.js';
import * as L from './levels.js';

export const BPM = 128;
const b = (beats) => +(beats * 60 / BPM).toFixed(3);                  // beats to seconds
// ---------------------------------------------------------------- the timing table (seconds)
const T = {
  hook: 0, arrow: b(2.5),
  l1: b(5), l1icon: b(6), l1mn: b(6.5), l1ex: b(7),
  l2: b(11), l2icon: b(12), l2mn: b(12.5), tip: b(14), tipX: b(14.75), tipR: b(15.5), tipTick: b(16),           // the ✓ is the downbeat of bar 4 (the band leaves it free)
  l3: b(20), l3icon: b(21), l3mn: b(21.5), l3ex: b(22),
  recap: b(27), hi: [b(27.5), b(28.5), b(29.5)], save: b(30.5),
  end: b(32), dur: b(37),
};
export const DUR = T.dur;                                             // 17.34 s; the end card lands at 15.0 s (bar 8 at 128 BPM)
const E = (t, at, d = 0.3) => (t - at) / d;                          // entry progress
const X = (t, at, d = 0.25) => (t - at) / d;                         // exit progress
const LVLS = [T.l1, T.l2, T.l3];

// the voiceover subtitles: Claude's Mongolian (Batu to check); his recording decides the final words and timing
const SUBS = [
  [0.03, T.l1 - 0.05, 'Зөвхөн “tired” гэдэг үү?'],
  [T.l1 + 0.05, T.l2 - 0.05, 'Level 1: tired, энгийн ядарсан.'],
  [T.l2 + 0.05, T.tip - 0.05, 'Level 2: exhausted, туйлдсан.'],
  [T.tip, T.l3 - 0.05, 'Very биш, absolutely exhausted!'],
  [T.l3 + 0.05, T.l3ex + 0.6, 'Level 3: fatigued, албан ёсны үг.'],
  [T.l3ex + 0.6, T.recap - 0.05, 'Эмч нар ингэж хэлдэг.'],
  [T.recap + 0.05, T.save - 0.05, 'Tired, exhausted, fatigued!'],
  [T.save, T.end - 0.05, 'Хадгалаад аваарай!'],
  [T.end + 0.05, T.dur, 'Өдөр бүр шинэ үг. Дагаарай!'],
];
const WORDS = ['tired', 'exhausted', 'fatigued'], REG = ['энгийн', 'хүчтэй', 'албан ёсны'];
// the silent h, faded out of the paper
const EXH = 'ex<span style="opacity:.3">h</span>austed';

// ---------------------------------------------------------------- scenes
function hook(t) {          // the staircase is there on frame one: "tired" on step 1, "?" on steps 2 and 3; an arrow climbs the stairs
  if (t > T.l1 + 0.6) return '';
  let g = L.stairs({ t, words: ['tired', '?', '?'], enter: [-0.42, -0.34, -0.26], out: T.l1 });
  g += L.zzz({ x: 470, y: 1110, t, u: 1 - X(t, T.l1, 0.15) });
  g += P.arrow({ d: 'M170 995 C160 890 220 805 330 768', head: 'M330 768 l-44 -8 M330 768 l-22 38', u: E(t, T.arrow, 0.35), xo: X(t, T.l1, 0.2) });
  return g;
}
function lvl1(t) {
  if (t < T.l1 - 0.05 || t > T.l2 + 0.4) return '';
  const body = L.word({ text: 'tired', t, seed: 1 })
    + L.battery({ fill: 0.5, u: E(t, T.l1icon, 0.3) })
    + L.mean({ text: 'ядарсан', e: E(t, T.l1mn), t, seed: 2 })
    + L.example({ text: 'I’m tired.', html: 'I’m&nbsp;<span class="kw">tired</span>.', e: E(t, T.l1ex), t, seed: 3 });
  return L.card({ lv: 0, label: REG[0], e: E(t, T.l1, 0.42), x: X(t, T.l2), t, body });
}
function lvl2(t) {           // "exhausted" (the h is silent), the flat battery, then the level-up tip: not "very exhausted" but "absolutely exhausted"
  if (t < T.l2 - 0.05 || t > T.l3 + 0.4) return '';
  let body = L.word({ text: 'exhausted', html: EXH, t, seed: 4 })
    + L.battery({ fill: 0, low: true, u: E(t, T.l2icon, 0.3), t })
    + L.note({ text: 'h-г дуудахгүй', e: E(t, T.l2icon + 0.1), t })
    + L.mean({ text: 'туйлдсан, хүч барагдсан', e: E(t, T.l2mn), t, seed: 5 });
  const ww = P.measure('very exhausted', 'en', 68), wx = 530 - ww / 2;
  body += L.example({ text: 'very exhausted', cls: 'bad', y: 1068, e: E(t, T.tip), t, seed: 6, r: -1 })
    + P.strike({ x: wx + 20, y: 1108, w: ww - 40, u: E(t, T.tip + 0.25, 0.18) })
    + P.stamp({ kind: 'x', x: wx + ww - 70, y: 1008, s: 0.5, u: E(t, T.tipX, 0.16) })
    + L.example({ text: 'absolutely exhausted', html: '<span class="kw">absolutely</span>&nbsp;exhausted', y: 1178, e: E(t, T.tipR), t, seed: 7 });
  const rw = P.measure('absolutely exhausted', 'en', Math.min(68, Math.floor(68 * 700 / P.measure('absolutely exhausted', 'en', 68))));
  body += P.stamp({ kind: 'tick', x: 530 + rw / 2 - 70, y: 1113, s: 0.55, u: E(t, T.tipTick, 0.18) });
  return L.card({ lv: 1, label: REG[1], e: E(t, T.l2, 0.42), x: X(t, T.l3), t, body });
}
function lvl3(t) {           // "fatigued": formal, the word doctors and reports use
  if (t < T.l3 - 0.05 || t > T.recap + 0.4) return '';
  const body = L.word({ text: 'fatigued', t, seed: 8 })
    + L.clipboard({ u: E(t, T.l3icon, 0.3) })
    + L.mean({ text: 'ядарсан, сульдсан', e: E(t, T.l3mn), t, seed: 9 })
    + L.example({ text: 'The patient is fatigued.', html: 'The patient is&nbsp;<span class="kw">fatigued</span>.', e: E(t, T.l3ex), t, seed: 10 });
  return L.card({ lv: 2, label: REG[2], e: E(t, T.l3, 0.42), x: X(t, T.recap), t, body });
}
function recap(t) {          // the staircase again, complete; each step bumps as it is named; "save this"
  if (t < T.recap - 0.05 || t > T.end + 0.6) return '';
  return L.stairs({ t, words: WORDS, html: ['tired', EXH, 'fatigued'], labels: REG, enter: [T.recap, T.recap + 0.06, T.recap + 0.12], out: T.end, hi: T.hi })
    + (t < T.end + 0.3 ? L.bookmark({ text: 'Хадгалаарай!', u: E(t, T.save, 0.3) * (t < T.end ? 1 : 1 - E(t, T.end, 0.2)), t }) : '');
}

// ---------------------------------------------------------------- sound cues (s), exported for the score: scene starts, the pops, the recap steps
export const EV = (() => {
  const ev = [['hook', T.hook], ['l1', T.l1], ['l2', T.l2], ['l3', T.l3], ['recap', T.recap], ['end', T.end]].map(([name, t]) => ({ t, type: 'scene', name }));
  LVLS.forEach((at, i) => ev.push({ t: +(at + b(0.5)).toFixed(3), type: 'pop', kind: 'lvl', lv: i }));   // each level's word lands: a pop a step higher
  [[T.tipX, 'x'], [T.tipTick, 'tick']].forEach(([t, kind]) => ev.push({ t, type: 'pop', kind }));
  T.hi.forEach((t, i) => ev.push({ t, type: 'step', lv: i }));       // the recap: the music plays the three level notes
  ev.push({ t: 0, type: 'clock', bpm: BPM });
  return ev.sort((a, c) => a.t - c.t);
})();

// ---------------------------------------------------------------- page
let st;
export async function init() {
  document.head.insertAdjacentHTML('beforeend', `<style>${P.css}${L.css}</style>`);
  st = document.getElementById('stage');
  window.EV = EV;
  await Promise.all(['assets/hml-logo.png', 'assets/hml-tree.png'].map((src) => { const i = new Image(); i.src = src; return i.decode().catch(() => {}); }));
}
export async function frame(t) {
  t = Math.min(t, DUR - 1 / 60);
  const s = SUBS.find(([a, c]) => t >= a && t < c);
  let g = P.set(t) + P.tag({ text: 'ONE WORD, THREE LEVELS', e: E(t, -0.3, 0.3), xo: X(t, T.end, 0.22) });
  g += hook(t) + lvl1(t) + lvl2(t) + lvl3(t) + recap(t);
  if (t >= T.end) g += P.endCard({ series: 'ONE WORD, THREE LEVELS', day: 'Day 2', u: (t - T.end - 0.03) * 1.4, t });
  g += s ? P.sub(s[2], { e: E(t, s[0], 0.15) }) : '';
  st.innerHTML = g;
  await Promise.all([...st.querySelectorAll('img')].map((i) => i.decode().catch(() => {})));
}
