// The Daily English series look (approved): "Paper-cut". Animated components, reused on every animated day.
// Everything is cut from coloured paper and layered with real depth: a navy paper ground, orange and amber paper waves, words on paper
// tiles (English on amber, Mongolian on cream), a red cut-paper ✗, a green cut-paper ✓, scissors, red paper strips for strikes.
// Motion: tiles drop in with a paper bounce and lift away between scenes; once landed they "boil" (a tiny stop-motion jitter, 8 changes
// a second) so the paper feels handled. Fonts: Montserrat Black and Manrope (both have the Mongolian Ө and Ү).

export const clamp = (x) => Math.max(0, Math.min(1, x));
export const easeOut = (u) => 1 - (1 - clamp(u)) ** 3;
export const easeIn = (u) => clamp(u) ** 3;
export const backOut = (u, k = 1.9) => { u = clamp(u); return 1 + (k + 1) * (u - 1) ** 3 + k * (u - 1) ** 2; };
export const SUB_Y = 1410;

const TEX = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' seed='4'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
export const css = `
:root { --navy: #14295a; --navy-2: #1d3a78; --orange: #ff6a2b; --amber: #ffb02e; --cream: #f6eedc; --red: #e2412f; --green: #2fae66; --ink: #0d1c40; --pink: #ffd2c8; }
.sheet { position: absolute; background-image: ${TEX}; }
.tex-over { background-image: ${TEX}; mix-blend-mode: multiply; opacity: .9; }
.depth { filter: drop-shadow(0 6px 0 rgba(8,16,40,.18)) drop-shadow(0 16px 18px rgba(8,16,40,.35)); }
.tile { position: absolute; display: flex; align-items: center; justify-content: center; box-sizing: border-box; height: 132px; padding: 0 30px 4px; border-radius: 14px;
  background-color: var(--amber); background-image: ${TEX}; color: var(--ink); font: 900 92px/1 Montserrat; letter-spacing: -1px; white-space: nowrap; }
.tile.mn { background-color: var(--cream); font: 800 64px/1 Manrope; letter-spacing: -.5px; height: 112px; }
.tile.bad { background-color: var(--pink); }
.tile.orange { background-color: var(--orange); color: #fff; }
.tag { position: absolute; background-color: var(--orange); background-image: ${TEX}; color: #fff; font: 900 40px Montserrat; letter-spacing: 4px; padding: 14px 30px 16px;
  clip-path: polygon(0 0, 100% 0, 97% 50%, 100% 100%, 0 100%, 3% 50%); white-space: nowrap; }
.sub { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; max-width: 780px; box-sizing: border-box; text-align: center; line-height: 1.2; text-wrap: balance;
  background-color: var(--cream); background-image: ${TEX}; color: var(--navy); font: 800 44px Manrope; padding: 12px 28px 16px; border-radius: 12px; }
.sub b { color: var(--orange); }
`;

// ---------------------------------------------------------------- measuring and laying out tiles
const FONTS = { en: ['900 92px Montserrat', -1, 60], mn: ['800 64px Manrope', -0.5, 60] };
let ctx;
export const measure = (text, kind = 'en', size = null) => {
  ctx = ctx || document.createElement('canvas').getContext('2d');
  const [font, ls, pad] = FONTS[kind]; ctx.font = size ? font.replace(/\d+px/, `${size}px`) : font;
  return ctx.measureText(text).width + ls * (text.length - 1) * (size ? size / parseInt(font.match(/(\d+)px/)[1]) : 1) + pad;
};
// a row of tiles centred on x: returns [{ text, x, w }]
export const layout = (words, { cx = 540, gap = 18, kind = 'en', size = null } = {}) => {
  const ws = words.map((w) => measure(w, kind, size)), total = ws.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
  let x = cx - total / 2;
  return words.map((text, i) => { const o = { text, x, w: ws[i] }; x += ws[i] + gap; return o; });
};

// ---------------------------------------------------------------- the paper set: navy ground, waves, the HML tree in a corner
// the waves boil very slightly (redrawn 8 times a second) like a stop-motion set
export const set = (t = 0) => { const k = Math.floor(t * 8) % 3, dx = [0, 2, -1][k], dy = [0, -1, 1][k];
  return `<div class="layer sheet" style="background-color:var(--navy)"></div>
  <svg class="layer depth" width="1080" height="1920" viewBox="0 0 1080 1920" style="overflow:visible"><defs><filter id="ed" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter></defs>
    <g filter="url(#ed)" transform="translate(${dx} ${dy})">
      <path d="M-60 -60 H1140 V300 C900 360 760 250 560 300 S220 380 -60 320 Z" fill="#1d3a78"/>
      <path d="M-60 -60 H1140 V200 C930 250 780 170 600 215 S250 290 -60 230 Z" fill="#ff6a2b"/>
      <path d="M-60 1980 V1600 C180 1540 330 1640 520 1590 S860 1520 1140 1600 V1980 Z" fill="#ffb02e"/>
      <path d="M-60 1980 V1720 C220 1660 420 1760 640 1700 S940 1660 1140 1720 V1980 Z" fill="#f6eedc"/></g></svg>
  <div class="layer tex-over"></div>
  <div class="abs depth" style="left:830px;top:1560px;width:190px;height:150px;background:url(assets/hml-tree.png) center/contain no-repeat"></div>`; };

// ---------------------------------------------------------------- motion: enter (drop with a paper bounce), exit (lift away), boil
// returns the CSS transform/opacity for an element entering at progress e (0..1) and leaving at progress x (0..1)
export const move = ({ e = 1, x = 0, r = 0, t = 0, seed = 0, from = -240, boil = 1 } = {}) => {
  if (e <= 0 || x >= 1) return 'display:none';
  const k = Math.floor(t * 8 + seed * 3.7), jr = boil * 0.45 * Math.sin(k * 2.3 + seed * 11), jy = boil * 1.2 * Math.sin(k * 1.7 + seed * 5);
  const y = from * (1 - backOut(e)) - 220 * easeIn(x) + (e >= 1 ? jy : 0);
  const rot = r + 10 * (1 - easeOut(e)) * (seed % 2 ? 1 : -1) + (e >= 1 ? jr : 0) - 8 * easeIn(x) * (seed % 2 ? -1 : 1);
  const op = clamp(e * 5) * (1 - easeIn(x));
  return `transform:translateY(${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg);opacity:${op.toFixed(3)}`;
};
// a word tile at (x, y) with width w; cls '' (English, amber), 'mn' (Mongolian, cream), 'bad' (a wrong sentence), 'orange'
export const tile = ({ text, x, y, w, cls = '', r = 0, e = 1, xo = 0, t = 0, seed = 0, extra = '', html = null }) =>
  `<div class="tile depth ${cls}" style="left:${x.toFixed(1)}px;top:${y}px;width:${w.toFixed(1)}px;${move({ e, x: xo, r, t, seed })};${extra}">${html ?? text}</div>`;
// (Day 2 on) a long tag shrinks its type to stay inside max px
const tagSize = (text, max) => { ctx = ctx || document.createElement('canvas').getContext('2d'); ctx.font = '900 40px Montserrat';
  const w = ctx.measureText(text).width + 4 * text.length + 60; return w > max ? Math.floor(40 * max / w) : 40; };
export const tag = ({ text = 'STOP SAYING THIS', y = 520, e = 1, xo = 0, max = 760 } = {}) => e <= 0 || xo >= 1 ? '' :
  `<div class="tag depth" style="font-size:${tagSize(text, max)}px;left:540px;top:${y}px;transform:translateX(${(-50 - 120 * (1 - easeOut(e))).toFixed(1)}%) rotate(-2deg) translateY(${(-200 * easeIn(xo)).toFixed(1)}px);opacity:${(clamp(e * 4) * (1 - easeIn(xo))).toFixed(3)}">${text}</div>`;

// ---------------------------------------------------------------- stamps, strips, scissors, arrows
// a cut-paper ✗ or ✓ that stamps down: big and tilted, then settles
export const stamp = ({ kind = 'x', x, y, s = 1, u = 1, xo = 0 }) => {
  if (u <= 0 || xo >= 1) return '';
  const sc = s * (u < 1 ? 1.6 - 0.6 * backOut(u, 2.6) : 1), rot = (kind === 'x' ? -8 : -6) + 14 * (1 - easeOut(u));
  const path = kind === 'x' ? 'M30 52 L52 30 L100 78 L148 30 L170 52 L122 100 L170 148 L148 170 L100 122 L52 170 L30 148 L78 100 Z' : 'M22 108 L56 74 L84 102 L150 36 L184 70 L84 170 Z';
  return `<svg class="abs depth" style="left:${x}px;top:${y}px;transform:translateY(${(-200 * easeIn(xo)).toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)});opacity:${(clamp(u * 6) * (1 - easeIn(xo))).toFixed(3)}" width="200" height="200" viewBox="0 0 200 200">
    <path d="${path}" fill="${kind === 'x' ? '#e2412f' : '#2fae66'}" stroke="#f6eedc" stroke-width="8" stroke-linejoin="round"/></svg>`;
};
// a red paper strip laid across a wrong sentence, growing from the left
export const strike = ({ x, y, w, u = 1, xo = 0 }) => u <= 0 || xo >= 1 ? '' :
  `<div class="abs depth" style="left:${x}px;top:${y}px;width:${(w * easeOut(u)).toFixed(1)}px;height:16px;background:#e2412f;transform:rotate(-3deg) translateY(${(-220 * easeIn(xo)).toFixed(1)}px);transform-origin:0 50%;opacity:${(1 - easeIn(xo)).toFixed(3)}"></div>`;
// paper scissors: slide in (e), blades close (c 0..1), slide out (xo)
export const scissors = ({ x, y, r = 0, e = 1, c = 0, xo = 0 }) => { if (e <= 0 || xo >= 1) return ''; const open = 16 * (1 - clamp(c));
  return `<svg class="abs depth" style="left:${(x - 260 * (1 - easeOut(e)) - 300 * easeIn(xo)).toFixed(1)}px;top:${y}px;transform:rotate(${r}deg);opacity:${clamp(e * 4) * (1 - easeIn(xo))}" width="190" height="130" viewBox="0 0 190 130">
    <g transform="rotate(${-open} 62 65)"><circle cx="30" cy="34" r="22" fill="none" stroke="#f6eedc" stroke-width="12"/><path d="M48 48 L172 72 L162 82 L46 58Z" fill="#e7ecf5"/></g>
    <g transform="rotate(${open} 62 65)"><circle cx="30" cy="96" r="22" fill="none" stroke="#f6eedc" stroke-width="12"/><path d="M48 82 L172 58 L162 48 L46 72Z" fill="#cfd7e6"/></g>
    <circle cx="62" cy="65" r="6" fill="#14295a"/></svg>`; };
// a cream paper arrow that draws itself along a path
export const arrow = ({ d, head, u = 1, xo = 0, w = 16 }) => u <= 0 || xo >= 1 ? '' :
  `<svg class="layer depth" width="1080" height="1920" style="opacity:${(1 - easeIn(xo)).toFixed(3)}"><path d="${d}" fill="none" stroke="#f6eedc" stroke-width="${w}" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${(1 - easeOut(u)).toFixed(3)}"/>
    ${u >= 0.95 ? `<path d="${head}" fill="none" stroke="#f6eedc" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` : ''}</svg>`;
// an orange paper underline under a word
export const underline = ({ x, y, w, u = 1, xo = 0 }) => u <= 0 || xo >= 1 ? '' :
  `<div class="abs" style="left:${x}px;top:${y}px;width:${(w * easeOut(u)).toFixed(1)}px;height:10px;border-radius:5px;background:#ff6a2b;transform:translateY(${(-220 * easeIn(xo)).toFixed(1)}px);opacity:${(1 - easeIn(xo)).toFixed(3)}"></div>`;

// ---------------------------------------------------------------- the voiceover subtitle: English words in orange
// (Day 2 on) a long line wraps to two lines inside 780 px, clear of the right-hand buttons, and grows upwards from a fixed baseline
export const sub = (text, { e = 1 } = {}) => !text || e <= 0 ? '' :
  `<div class="sub depth" style="bottom:${1920 - SUB_Y - 80}px;transform:translateY(${(20 * (1 - easeOut(e))).toFixed(1)}px);opacity:${clamp(e * 3).toFixed(3)}">${text.replace(/([A-Za-z][A-Za-z’'?.,-]*(?:\s+[A-Za-z][A-Za-z’'?.,-]*)*)/g, '<b>$1</b>')}</div>`;

// ---------------------------------------------------------------- the end card: series name, the logo on a paper card, follow CTA
export const endCard = ({ series = 'STOP SAYING THIS', day = 'Day 1', u = 0, t = 0 } = {}) => {
  const e = (d) => (u - d) / 0.45;
  return `<div class="abs depth" style="left:240px;top:520px;width:600px;height:500px;border-radius:24px;background:#fff url(assets/hml-logo.png) 50% 46%/104% no-repeat;${move({ e: e(0), t, seed: 3, r: -2 })}"></div>
    ${tag({ text: `${series} · ${day}`, y: 1060, e: e(0.25) })}
    ${tile({ text: '@hml_english', x: 540 - measure('@hml_english', 'en', 64) / 2, y: 1170, w: measure('@hml_english', 'en', 64), extra: 'font-size:64px;height:104px', e: e(0.55), t, seed: 5, r: 2 })}`;
};
