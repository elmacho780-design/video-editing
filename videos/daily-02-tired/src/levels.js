// "One Word, Three Levels": the format pieces for this vocabulary series (Days 2, 9, 16, 23), built on the paper-cut look (paper.js).
// - stairs(): a paper staircase of three level bands (cream, amber, orange), each with a cut-out number badge and its word.
//   It opens the video (the word on step 1, "?" on steps 2 and 3) and comes back as the recap, the frame people save.
// - card(): one level's card, which slides in from the right and out to the left like a level-select carousel: a coloured band
//   ("LEVEL 2 · хүчтэй" plus a three-bar level meter), the word on an amber tile, its meaning, an icon and an example.
// - battery(), clipboard(), bookmark(): small cut-paper icons.
import * as P from './paper.js';
const { clamp, easeOut, easeIn, backOut } = P;

export const LV = ['#f6eedc', '#ffb02e', '#ff6a2b'];                    // level colours: cream, amber, orange (warmer as it climbs)
export const css = `
.band { position: absolute; height: 150px; border-radius: 12px; display: flex; align-items: center; box-sizing: border-box; color: #14295a; }
.badge { position: absolute; left: 22px; top: 33px; width: 84px; height: 84px; border-radius: 50%; background: #14295a; color: #f6eedc;
  font: 900 52px/84px Montserrat; text-align: center; }
.bword { position: absolute; left: 130px; font: 900 80px/1 Montserrat; letter-spacing: -1px; white-space: nowrap; }
.blabel { position: absolute; left: 132px; top: 98px; font: 800 34px/1 Manrope; opacity: .75; white-space: nowrap; }
.kw { text-decoration: underline; text-decoration-color: #ff6a2b; text-decoration-thickness: 8px; text-underline-offset: 8px; }
.card { position: absolute; left: 120px; top: 620px; width: 820px; height: 670px; border-radius: 24px; background-color: #1d3a78; }
.cband { position: absolute; left: 120px; top: 620px; width: 820px; height: 86px; border-radius: 24px 24px 6px 6px; color: #14295a;
  display: flex; align-items: center; padding-left: 40px; box-sizing: border-box; white-space: nowrap; }
.cband b { font: 900 44px Montserrat; letter-spacing: 2px; } .cband span { font: 800 38px Manrope; margin-left: 14px; }
.mean { position: absolute; left: 160px; color: #f6eedc; font: 800 56px/1.1 Manrope; white-space: nowrap; }
.note { position: absolute; left: 164px; color: #f6eedc; opacity: .85; font: 700 36px/1 Manrope; white-space: nowrap; }
`;

// horizontal slide: in from the right with a soft paper overshoot (e 0..1), out to the left (x 0..1), plus the stop-motion boil
export const slide = ({ e = 1, x = 0, t = 0, seed = 0, dist = 1100 } = {}) => {
  if (e <= 0 || x >= 1) return 'display:none';
  const k = Math.floor(t * 8 + seed * 3.7), jr = 0.35 * Math.sin(k * 2.3 + seed * 11), jy = Math.sin(k * 1.7 + seed * 5);
  const dx = dist * (1 - backOut(e, 1.2)) - dist * easeIn(x), rot = 3 * (1 - easeOut(e)) - 3 * easeIn(x) + (e >= 1 ? jr : 0);
  return `transform:translate(${dx.toFixed(1)}px,${(e >= 1 ? jy : 0).toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`;
};
const fit = (text, kind, base, maxW) => Math.min(base, Math.floor(base * maxW / P.measure(text, kind, base)));

// ---------------------------------------------------------------- the staircase
// words: three words (or '?'), labels: optional register labels, enter: start times of the three bands, out: exit start,
// hi: optional highlight times (each band bumps), html: optional per-band word html
export const stairs = ({ t, words, labels = null, enter, out = 1e9, hi = null, html = null }) => words.map((w, i) => {
  const x0 = 110 + 135 * i, y = 1030 - 150 * i, bw = 940 - x0, e = (t - enter[i]) / 0.4, xo = (t - out - 0.05 * (2 - i)) / 0.3;
  if (e <= 0 || xo >= 1) return '';
  const u = hi ? (t - hi[i]) / 0.3 : -1, bump = u > 0 && u < 1 ? 1 + 0.07 * Math.sin(Math.PI * u) : 1;
  const q = w === '?', fs = q ? 96 : fit(w, 'en', 80, bw - 170), top = labels ? 22 : Math.round((150 - fs * 0.78) / 2) - 4;
  const wob = q ? 7 * Math.sin(Math.floor(t * 4) * 2.1 + i) : 0;
  return `<div class="band sheet depth" style="left:${x0}px;top:${y}px;width:${bw}px;background-color:${LV[i]};${slide({ e, x: xo, t, seed: 40 + i })} scale(${bump.toFixed(3)});z-index:${i + 1}">
    <div class="badge">${i + 1}</div>
    <div class="bword" style="top:${top}px;font-size:${fs}px;${q ? `transform:rotate(${wob.toFixed(1)}deg);opacity:.85` : ''}">${html?.[i] ?? w}</div>
    ${labels ? `<div class="blabel">${labels[i]}</div>` : ''}</div>`;
}).join('');

// ---------------------------------------------------------------- a level card
// lv 0..2, word (and optional html), label (register, Mongolian), e/x: slide in/out progress; the caller adds the card's contents
export const meter = (lv) => [0, 1, 2].map((i) => `<div class="abs" style="left:${820 + i * 30}px;top:${686 - 22 - i * 12}px;width:20px;height:${22 + i * 12}px;border-radius:4px;background:#14295a;opacity:${i <= lv ? 1 : 0.22}"></div>`).join('');
export const card = ({ lv, label, e, x, t, body }) => {
  if (e <= 0 || x >= 1) return '';
  return `<div class="layer" style="${slide({ e, x, t, seed: 50 + lv })}">
    <div class="card sheet depth"></div>
    <div class="cband sheet" style="background-color:${LV[lv]}"><b>LEVEL ${lv + 1}</b><span>· ${label}</span></div>${meter(lv)}
    ${body}</div>`;
};
// the word on its amber tile inside a card (left side; the icon sits on the right)
export const word = ({ text, html = null, t, e = 1, seed = 0 }) => {
  const fs = fit(text, 'en', 124, 560), w = P.measure(text, 'en', fs);
  return P.tile({ text, html, x: 160, y: 740, w, extra: `font-size:${fs}px;height:${Math.round(fs * 1.3)}px`, r: -1.5, e, t, seed });
};
export const mean = ({ text, y = 960, e, t, seed = 0 }) => {
  const fs = fit(text, 'mn', 56, 740);
  return `<div class="mean" style="top:${y}px;font-size:${fs}px;${P.move({ e, t, seed, from: -120 })}">${text}</div>`;
};
export const note = ({ text, y = 912, e, t }) => `<div class="note" style="top:${y}px;${P.move({ e, t, seed: 9, from: -60, boil: 0 })}">${text}</div>`;
// an example sentence on an amber tile, centred in the card
export const example = ({ text, html = null, y = 1080, cls = '', e, xo = 0, t, seed = 0, r = 1 }) => {
  const fs = fit(text, 'en', 68, 700), w = P.measure(text, 'en', fs);
  return P.tile({ text, html, x: 530 - w / 2, y, w, cls, extra: `font-size:${fs}px;height:${Math.round(fs * 1.55)}px`, r, e, xo, t, seed });
};

// ---------------------------------------------------------------- cut-paper icons
const pop = (u) => u <= 0 ? 'display:none' : `transform:scale(${(u < 1 ? backOut(u, 2.2) : 1).toFixed(3)}) rotate(${(-8 * (1 - easeOut(u))).toFixed(1)}deg);opacity:${clamp(u * 5)}`;
// a battery: fill 0..1 (amber); low = a red sliver that blinks
export const battery = ({ x = 735, y = 760, fill = 0.5, low = false, u = 1, t = 0 }) => {
  const segs = Math.round(fill * 4), on = !low || Math.floor(t * 4) % 2 === 0;
  return `<svg class="abs depth" style="left:${x}px;top:${y}px;transform-origin:50% 50%;${pop(u)}" width="190" height="110" viewBox="0 0 190 110">
    <rect x="8" y="10" width="156" height="90" rx="16" fill="#14295a" stroke="#f6eedc" stroke-width="10"/><rect x="166" y="36" width="16" height="38" rx="5" fill="#f6eedc"/>
    ${[0, 1, 2, 3].map((k) => k < segs ? `<rect x="${24 + k * 35}" y="26" width="28" height="58" rx="5" fill="#ffb02e"/>` : '').join('')}
    ${low && on ? '<rect x="24" y="26" width="12" height="58" rx="4" fill="#e2412f"/>' : ''}</svg>`;
};
// a clipboard with a medical cross: formal, doctors' and reports' language
export const clipboard = ({ x = 765, y = 730, u = 1 }) => `<svg class="abs depth" style="left:${x}px;top:${y}px;transform-origin:50% 50%;${pop(u)}" width="150" height="190" viewBox="0 0 150 190">
  <rect x="8" y="16" width="134" height="168" rx="14" fill="#c98a3a"/><rect x="22" y="34" width="106" height="138" rx="6" fill="#f6eedc"/>
  <rect x="48" y="6" width="54" height="26" rx="8" fill="#14295a"/>
  <path d="M85 50 h16 v14 h14 v16 h-14 v14 h-16 v-14 h-14 v-16 h14z" fill="#e2412f"/>
  <rect x="34" y="112" width="82" height="9" rx="4" fill="#14295a" opacity=".55"/><rect x="34" y="132" width="82" height="9" rx="4" fill="#14295a" opacity=".55"/><rect x="34" y="152" width="56" height="9" rx="4" fill="#14295a" opacity=".55"/></svg>`;
// a paper bookmark with "save" text on a cream tile
export const bookmark = ({ text, x = 130, y = 615, u = 1, t = 0 }) => {
  const w = P.measure(text, 'mn', 46) + 70;
  return `<div class="abs depth" style="left:${x}px;top:${y}px;transform-origin:20% 50%;${pop(u)}">
    <div class="sheet" style="position:relative;display:flex;align-items:center;gap:14px;height:88px;width:${w}px;padding:0 24px 0 18px;box-sizing:border-box;border-radius:14px;background-color:#f6eedc;transform:rotate(-4deg);font:800 46px Manrope;color:#14295a;white-space:nowrap">
      <svg width="40" height="54" viewBox="0 0 40 54"><path d="M4 4 h32 v46 l-16 -12 l-16 12z" fill="#ff6a2b"/></svg>${text}</div></div>`;
};
// little paper "z"s drifting up from a tired word
export const zzz = ({ x, y, t, u = 1, color = '#14295a' }) => u <= 0 ? '' : [0, 1].map((k) => {
  const ph = ((t * 0.9 + k * 0.5) % 1), s = 30 + 14 * k;
  return `<div class="abs" style="left:${(x + 40 * ph + 34 * k).toFixed(1)}px;top:${(y - 60 * ph - 10 * k).toFixed(1)}px;font:900 ${s}px Montserrat;color:${color};z-index:5;opacity:${(Math.sin(Math.PI * ph) * clamp(u * 3)).toFixed(3)};transform:rotate(${-12 + 8 * k}deg)">z</div>`;
}).join('');
