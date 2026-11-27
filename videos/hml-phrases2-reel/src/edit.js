// The edit: ?view=edit. The second linking-words Reel, in the approved "ABC blocks" look and the first one's list format, with Batu's
// fix: "the boxes were very close to each other and touching the boxes above; space it out and make it easy to look at".
//  - Each phrase is ONE plank (the English in bold, its Mongolian underneath, as in Batu's reference), with a numbered block on its
//    corner, so a pair can never touch the next pair; planks sit at least 30 px apart (shadows included).
//  - These phrases are long, and the free space above her head is about 560 px, so the list builds in two pages: phrases 1-4, then
//    the first page falls away and phrases 5-7 build up. Big, readable type, one column, nothing near her face.
// This page draws ONLY the graphics on a transparent background (tools/overlay.mjs -> tools/composite.sh: one encode over the
// camera file, which plays uncut). ?view=edit&bg=1 draws the frame underneath, for check stills only.
// All Mongolian is Claude's reading of Batu's transcript, for Batu to check.
export const DUR = 934 / 30;                                          // the take: 934 frames at 30 fps (31.13 s)
const clamp = (x) => Math.max(0, Math.min(1, x));
const easeOut = (u) => 1 - (1 - clamp(u)) ** 3;
const easeIn = (u) => clamp(u) ** 3;
const backOut = (u, k = 1.5) => { u = clamp(u); return 1 + (k + 1) * (u - 1) ** 3 + k * (u - 1) ** 2; };

export const ITEMS = [
  ['Despite the fact that', 'үүнийг үл харгалзан'], ['Ultimately', 'эцэст нь хэлэхэд'], ['From my perspective', 'миний бодлоор'],
  ['As far as I understand', 'миний ойлгож байгаагаар'], ['It is worth mentioning', 'үүнийг дурдах нь зүйтэй'],
  ['It is worth emphasizing', 'үүнийг цохон тэмдэглэх нь зүйтэй'], ['There is no doubt that', 'үүнд эргэлзэх хэрэггүй'],
];
// when she starts each English phrase and its Mongolian: the speech onsets after her pauses (silencedetect -38 dB, checked against the
// level), with Whisper confirming which words each segment holds (tools/segments.py, tools/align.py -> edit/align.json). She runs
// "Ultimately" straight into "эцэст нь хэлэхэд" (4.38). LAST is the start of her final word, "хэрэггүй": the music resolves on it.
export const EN_AT = [0.10, 3.78, 6.36, 10.55, 15.75, 21.39, 26.06];
export const MN_AT = [2.11, 4.38, 8.85, 12.83, 18.12, 23.23, 28.54];
export const LAST = 30.12;
const PAGES = [[0, 1, 2, 3], [4, 5, 6]];
const FLIP = EN_AT[4] - 0.62;                                          // page one slides away just before phrase 5
const LEAD = 0.08;
const TOP = 300, PITCH = 132;                                          // rows: 300, 432, 564, 696 (each plank about 103 px tall: 29 px clear between)

const css = `
.pl-wrap { position: absolute; left: 78px; }
.pl { position: relative; display: inline-block; padding: 10px 30px 13px 58px; border-radius: 18px; color: #fff; white-space: nowrap;
  background: linear-gradient(#ff7a3d, #f2581f); box-shadow: inset 0 5px 0 rgba(255,255,255,.3), 0 8px 0 #b8420f, 0 16px 18px rgba(10,20,50,.4); }
.pl.navy { background: linear-gradient(#1d3a78, #14295a); box-shadow: inset 0 5px 0 rgba(255,255,255,.18), 0 8px 0 #0a1636, 0 16px 18px rgba(10,20,50,.4); }
.pl b { display: block; font: 900 40px/1.08 Montserrat; letter-spacing: -.5px; }
.pl i { display: block; font: 800 28px/1.2 Manrope; font-style: normal; color: #ffe7c2; margin-top: 3px; }
.pl.navy i { color: #ffb02e; }
.pl-num { position: absolute; left: -22px; top: -12px; width: 60px; height: 60px; border-radius: 12px; background: #ffb02e; color: #14295a; font: 900 36px/60px Montserrat;
  text-align: center; box-shadow: inset 0 4px 0 rgba(255,255,255,.45), 0 6px 0 #c47a14; z-index: 2; }
.pl-tag { position: absolute; left: 60px; top: 228px; padding: 10px 22px 12px; border-radius: 12px; background: #14295a; color: #ffb02e; font: 900 36px/1 Montserrat; letter-spacing: 2px;
  white-space: nowrap; box-shadow: 0 8px 0 #0a1636, 0 14px 18px rgba(10,20,50,.4); transform: rotate(-2deg); }
.pl-tag span { font: 800 28px Manrope; letter-spacing: 0; color: #fff; }
`;
const TILT = [-1.2, 1, -0.8, 1.2, -1, 0.8, -1.2];
function plank(t, i, row, outU) {
  const a = t - (EN_AT[i] - LEAD), b = t - (MN_AT[i] - LEAD);
  if (a <= 0 || outU >= 1) return '';
  const ub = a / 0.3, ue = (a - 0.04) / 0.38, um = b / 0.3, [en, mn] = ITEMS[i];
  const out = outU > 0 ? `transform:translateX(${(-1150 * easeIn(outU)).toFixed(1)}px) rotate(${(TILT[i] - 5 * easeIn(outU)).toFixed(2)}deg);opacity:${(1 - easeIn(outU) ** 2).toFixed(3)}`
    : `transform:translateX(${(-300 * (1 - backOut(ue))).toFixed(1)}px) rotate(${TILT[i]}deg);opacity:${clamp(ue * 5).toFixed(3)}`;
  const num = `<div class="pl-num" style="transform:scale(${(0.3 + 0.7 * backOut(ub, 2.4)).toFixed(3)}) rotate(${(-8 + 24 * (1 - easeOut(ub))).toFixed(1)}deg);opacity:${clamp(ub * 6).toFixed(3)}">${i + 1}</div>`;
  const mnLine = `<i style="opacity:${clamp(um * 4).toFixed(3)};transform:translateY(${(10 * (1 - easeOut(um))).toFixed(1)}px)">${mn}</i>`;
  return `<div class="pl-wrap" style="top:${TOP + row * PITCH}px;transform-origin:0 0;${out}"><div class="pl${i % 2 ? ' navy' : ''}">${num}<b>${en}</b>${mnLine}</div></div>`;
}
function head(t) {
  const u = (t + 0.45) / 0.4, page = t < FLIP + 0.3 ? '1/2' : '2/2';
  return `<div style="position:absolute;left:0;top:0;transform:translateY(${(-200 * (1 - backOut(u, 1.8))).toFixed(1)}px);opacity:${clamp(u * 4).toFixed(3)}">
    <div class="pl-tag">LINKING WORDS <span>· холбох үгс · ${page}</span></div></div>`;
}

export const EV = (() => {
  const ev = [{ t: 0, type: 'clock' }, { t: FLIP, type: 'flip' }, { t: LAST, type: 'last' }];
  EN_AT.forEach((t, i) => ev.push({ t, type: 'en', i }));
  MN_AT.forEach((t, i) => ev.push({ t, type: 'mn', i }));
  return ev.sort((a, b) => a.t - b.t);
})();

let st, BG = false;
export async function init(qs) {
  BG = qs.get('bg') === '1';
  document.head.insertAdjacentHTML('beforeend', `<style>${css}${BG ? '' : 'html,body,#stage{background:transparent!important}'}</style>`);
  st = document.getElementById('stage');
  window.EV = EV;
}
export async function frame(t) {
  t = Math.min(t, DUR - 1 / 60);
  let g = BG ? `<img src="frames/${String(Math.min(933, Math.round(t * 30))).padStart(5, '0')}.jpg" style="position:absolute;left:0;top:0;width:1080px;height:1920px">` : '';
  g += head(t);
  PAGES.forEach((pg, p) => pg.forEach((i, row) => {
    const outU = p === 0 ? (t - FLIP - row * 0.05) / 0.35 : 0;       // page one slides off to the left, top row first: rows never cross
    g += plank(t, i, row, outU);
  }));
  st.innerHTML = g;
  await Promise.all([...st.querySelectorAll('img')].map((x) => x.decode().catch(() => {})));
}
