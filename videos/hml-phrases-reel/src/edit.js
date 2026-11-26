// The edit: ?view=edit. Look C, "ABC blocks" (approved), in the reference video's list format. This page draws ONLY the graphics, on a
// transparent background: tools/overlay.mjs renders it losslessly with alpha and tools/composite.sh lays it over the original camera
// file in one encode. The take plays exactly as filmed (no cuts, no zoom). ?view=edit&bg=1 draws the frame underneath, for checks only.
// Each phrase: its number block pops in and the English plank slides in as she starts the English (edit/align.json); the Mongolian plank
// slides in under it as she starts the Mongolian. Every pair stays on, so the list builds up above her head.
import { LOOKS, ITEMS, SLOT, HEAD } from './looks.js';
const L = LOOKS.c;
export const DUR = 651 / 30;                                          // the take: 651 frames at 30 fps (21.7 s)
const clamp = (x) => Math.max(0, Math.min(1, x));
const easeOut = (u) => 1 - (1 - clamp(u)) ** 3;
const backOut = (u, k = 1.5) => { u = clamp(u); return 1 + (k + 1) * (u - 1) ** 3 + k * (u - 1) ** 2; };
const bounce = (u) => { u = clamp(u); if (u < 0.55) return (u / 0.55) ** 2; const v = (u - 0.55) / 0.45; return 1 - 0.12 * Math.sin(Math.PI * v) * (1 - v); };

// when she starts each English phrase and each Mongolian meaning (speech onsets between the take's pauses; Whisper confirms the words)
export const EN_AT = [0.49, 3.57, 6.75, 9.79, 12.56, 15.73, 18.70];
export const MN_AT = [2.00, 4.77, 7.90, 11.18, 13.99, 16.61, 20.02];
const LEAD = 0.08;                                                    // graphics land a hair before the word

const TILT = [-1.5, 1.2, -1, 1.5, -1.2, 1, -0.6];
function item(t, i) {
  const s = SLOT(i), [en, mn] = ITEMS[i], a = t - (EN_AT[i] - LEAD), b = t - (MN_AT[i] - LEAD);
  if (a <= 0) return '';
  const ub = a / 0.3, ue = (a - 0.04) / 0.38, um = b / 0.34;   // the number pops in place (it never crosses the title)
  const num = `<div class="bk-num" style="transform:scale(${(0.3 + 0.7 * backOut(ub, 2.4)).toFixed(3)}) rotate(${(-8 + 24 * (1 - easeOut(ub))).toFixed(1)}deg);opacity:${clamp(ub * 6).toFixed(3)}">${i + 1}</div>`;
  const enP = ue > 0 ? `<div class="bk-en${i % 2 ? ' navy' : ''}" style="transform:translateX(${(-260 * (1 - backOut(ue))).toFixed(1)}px);opacity:${clamp(ue * 5).toFixed(3)}">${en}</div>` : '';
  const mnP = um > 0 ? `<div class="bk-mn" style="transform:translateX(${(-200 * (1 - backOut(um))).toFixed(1)}px);opacity:${clamp(um * 5).toFixed(3)}">${mn}</div>` : '';
  return `<div class="bk-wrap" style="left:${s.x + 16}px;top:${s.y + 8}px;transform:rotate(${TILT[i]}deg);transform-origin:0 0">${num}${enP}<br>${mnP || '<div class="bk-mn" style="visibility:hidden">&nbsp;</div>'}</div>`;
}
function head(t) {
  const u = (t + 0.45) / 0.4;                                           // in place on frame one
  return `<div style="position:absolute;left:0;top:0;transform:translateY(${(-200 * (1 - backOut(u, 1.8))).toFixed(1)}px);opacity:${clamp(u * 4).toFixed(3)}">${L.head()}</div>`;
}

export const EV = (() => {
  const ev = [{ t: 0, type: 'clock' }];
  EN_AT.forEach((t, i) => ev.push({ t, type: 'en', i }));
  MN_AT.forEach((t, i) => ev.push({ t, type: 'mn', i }));
  return ev.sort((a, b) => a.t - b.t);
})();

let st, BG = false;
export async function init(qs) {
  BG = qs.get('bg') === '1';
  document.head.insertAdjacentHTML('beforeend', `<style>${L.css}${BG ? '' : 'html,body,#stage{background:transparent!important}'}</style>`);
  st = document.getElementById('stage');
  window.EV = EV;
}
export async function frame(t) {
  t = Math.min(t, DUR - 1 / 60);
  let g = BG ? `<img src="frames/${String(Math.min(650, Math.round(t * 30))).padStart(5, '0')}.jpg" style="position:absolute;left:0;top:0;width:1080px;height:1920px">` : '';
  g += head(t);
  for (let i = 0; i < ITEMS.length; i++) g += item(t, i);
  st.innerHTML = g;
  await Promise.all([...st.querySelectorAll('img')].map((x) => x.decode().catch(() => {})));
}
