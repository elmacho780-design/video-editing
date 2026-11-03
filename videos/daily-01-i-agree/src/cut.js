// Look 1: "Paper-cut". Every element is cut from coloured paper and layered with real depth: a navy paper ground, orange and amber
// paper waves, words on paper tiles (English tiles amber, Mongolian on cream), a red cut-paper ✗, a green cut-paper ✓, scissors snipping
// "am" out of the sentence. Soft shadows between layers, a fibre texture on every sheet. Montserrat Black and Manrope.
import { SUB_Y, SERIES, DAY } from './common.js';

export const name = 'Paper-cut';
const TEX = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' seed='4'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
export const css = `
:root { --navy: #14295a; --navy-2: #1d3a78; --orange: #ff6a2b; --amber: #ffb02e; --cream: #f6eedc; --red: #e2412f; --green: #2fae66; --ink: #0d1c40; }
.sheet { position: absolute; background-image: ${TEX}; }
.depth { filter: drop-shadow(0 6px 0 rgba(8,16,40,.18)) drop-shadow(0 16px 18px rgba(8,16,40,.35)); }
.tile { position: relative; display: inline-flex; align-items: center; padding: 18px 30px 22px; border-radius: 14px; background-color: var(--amber); background-image: ${TEX};
  color: var(--ink); font: 900 92px/1 Montserrat; letter-spacing: -1px; }
.tile.mn { background-color: var(--cream); font: 800 64px/1.1 Manrope; letter-spacing: -.5px; }
.tile.bad { background-color: #ffd2c8; }
.tag { position: absolute; left: 50%; transform: translateX(-50%) rotate(-2deg); background-color: var(--orange); background-image: ${TEX}; color: #fff; font: 900 40px Montserrat; letter-spacing: 4px;
  padding: 14px 30px 16px; clip-path: polygon(0 0, 100% 0, 97% 50%, 100% 100%, 0 100%, 3% 50%); white-space: nowrap; }
.sub { position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap; background-color: var(--cream); background-image: ${TEX}; color: var(--navy); font: 800 44px Manrope;
  padding: 12px 28px 16px; border-radius: 12px; }
.sub b { color: var(--orange); }
.tex-over { background-image: ${TEX}; mix-blend-mode: multiply; opacity: .9; }
`;
// the paper set: navy ground, an orange wave across the top, amber and cream hills along the bottom, the HML tree cut out in a corner
const set = () => `<div class="layer sheet" style="background-color:var(--navy)"></div>
  <svg class="layer depth" width="1080" height="1920" viewBox="0 0 1080 1920" style="overflow:visible"><defs><filter id="ed" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter></defs>
    <g filter="url(#ed)">
      <path d="M-60 -60 H1140 V300 C900 360 760 250 560 300 S220 380 -60 320 Z" fill="#1d3a78"/>
      <path d="M-60 -60 H1140 V200 C930 250 780 170 600 215 S250 290 -60 230 Z" fill="#ff6a2b"/>
      <path d="M-60 1980 V1600 C180 1540 330 1640 520 1590 S860 1520 1140 1600 V1980 Z" fill="#ffb02e"/>
      <path d="M-60 1980 V1720 C220 1660 420 1760 640 1700 S940 1660 1140 1720 V1980 Z" fill="#f6eedc"/></g></svg>
  <div class="layer tex-over"></div>
  <div class="abs depth" style="left:830px;top:1560px;width:190px;height:150px;background:url(assets/hml-tree.png) center/contain no-repeat"></div>`;
const tag = () => `<div class="tag depth" style="top:520px">${SERIES}</div>`;
const sub = (text) => `<div class="sub depth" style="top:${SUB_Y}px">${text.replace(/(I am agree|I agree|Do you agree\?|am)/g, '<b>$1</b>')}</div>`;
const row = (tiles, y, { gap = 18, x = 540 } = {}) => `<div class="abs" style="left:${x}px;top:${y}px;transform:translateX(-50%);display:flex;gap:${gap}px;align-items:center;white-space:nowrap">${tiles}</div>`;
const tile = (w, cls = '', r = 0, extra = '') => `<span class="tile depth ${cls}" style="transform:rotate(${r}deg);${extra}">${w}</span>`;
// a cut-paper ✗ and ✓
const cross = (x, y, s = 1) => `<svg class="abs depth" style="left:${x}px;top:${y}px;transform:rotate(-8deg) scale(${s})" width="200" height="200" viewBox="0 0 200 200">
  <path d="M30 52 L52 30 L100 78 L148 30 L170 52 L122 100 L170 148 L148 170 L100 122 L52 170 L30 148 L78 100 Z" fill="#e2412f" stroke="#f6eedc" stroke-width="8" stroke-linejoin="round"/></svg>`;
const tick = (x, y, s = 1) => `<svg class="abs depth" style="left:${x}px;top:${y}px;transform:rotate(-6deg) scale(${s})" width="200" height="200" viewBox="0 0 200 200">
  <path d="M22 108 L56 74 L84 102 L150 36 L184 70 L84 170 Z" fill="#2fae66" stroke="#f6eedc" stroke-width="8" stroke-linejoin="round"/></svg>`;
const scissors = (x, y, r = 0) => `<svg class="abs depth" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)" width="170" height="120" viewBox="0 0 170 120">
  <circle cx="30" cy="30" r="22" fill="none" stroke="#f6eedc" stroke-width="12"/><circle cx="30" cy="90" r="22" fill="none" stroke="#f6eedc" stroke-width="12"/>
  <path d="M48 42 L160 78 L150 86 L46 52Z" fill="#cfd7e6"/><path d="M48 78 L160 42 L150 34 L46 68Z" fill="#e7ecf5"/><circle cx="62" cy="60" r="6" fill="#14295a"/></svg>`;

export const frames = {
  1: (m) => `${set()}${tag()}
    ${row(`${tile('I', '', -2)}${tile('am', 'bad', 3)}${tile('agree', '', -1)}`, 760)}
    ${cross(300, 725, 1.0)}${sub(m.sub)}`,
  2: (m) => `${set()}${tag()}
    ${row(`${tile('Би зөвшөөрч', 'mn', -1)}${tile('<span style="border-bottom:8px solid #ff6a2b;line-height:1.05">байна</span>', 'mn', 2)}`, 700)}
    <svg class="abs depth" style="left:560px;top:820px" width="260" height="200" viewBox="0 0 260 200"><path d="M160 12 C230 50 230 120 150 160" fill="none" stroke="#f6eedc" stroke-width="16" stroke-linecap="round"/>
      <path d="M150 160 l12 -42 M150 160 l42 -2" stroke="#f6eedc" stroke-width="16" stroke-linecap="round"/></svg>
    ${row(`${tile('am', '', 4)}<span style="font:900 110px Montserrat;color:#ffb02e;margin-left:6px">?</span>`, 960, { x: 520 })}${sub(m.sub)}`,
  3: (m) => `${set()}${tag()}
    ${row(`${tile('I', '', -2)}${tile('agree', '', -1)}`, 760)}
    ${tick(700, 640, 1.1)}
    <div class="abs" style="left:430px;top:1000px;transform:rotate(24deg);opacity:.92">${tile('am', 'bad', 0)}</div>${scissors(250, 940, -20)}
    ${sub(m.sub)}`,
  4: (m) => `${set()}${tag()}
    ${row(`${tile('Are you agree?', 'bad', -1, 'font-size:72px;text-decoration:line-through;text-decoration-color:#e2412f;text-decoration-thickness:8px')}`, 700)}${cross(800, 660, 0.55)}
    ${row(`${tile('Do you agree?', '', 1, 'font-size:84px')}`, 900)}${tick(800, 860, 0.62)}
    ${sub(m.sub)}`,
};
