// Look 4: "Doodles". Hand-drawn marker scribbles animate over the footage: a doodled phone scribbled out, arrows, circles, stars,
// a hand-drawn week and a graph going up. White marker with HML orange and amber, a slight wobble on every line, Caveat handwriting.
import { kw, DAYS, CAP_Y } from './common.js';

export const name = 'Doodles';
export const css = `
:root { --navy: #14295a; --orange: #ff6a2b; --amber: #ffc23d; }
.hand { font-family: Caveat, cursive; font-weight: 700; color: #fff; text-shadow: 0 3px 0 rgba(10,20,50,.55), 0 0 18px rgba(10,20,50,.35); }
.d-cap { position: absolute; left: 50%; transform: translateX(-50%) rotate(-2deg); white-space: nowrap; font: 700 92px/1 Caveat; color: #fff; padding: 6px 30px 14px;
  background: rgba(20,41,90,.86); border-radius: 18px 26px 14px 30px; box-shadow: 0 8px 0 rgba(255,106,43,.9); }
.d-cap .kw { color: var(--amber); }
`;
// every doodle is drawn through a wobble filter so it looks hand-made; a white marker line with a soft dark edge so it reads on any background
const ink = (paths, { w = 13, c = '#fff' } = {}) => `<g filter="url(#wob)">${paths.map((d) => `<path d="${d}" fill="none" stroke="rgba(10,20,50,.5)" stroke-width="${w + 8}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</g>`;
const svg = (inner) => `<svg class="layer" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter></defs>${inner}</svg>`;
const star = (x, y, r) => { const p = [...Array(10)].map((_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; return `${(x + Math.cos(a) * rr).toFixed(0)} ${(y + Math.sin(a) * rr).toFixed(0)}`; });
  return `M${p.join(' L')}Z`; };
export const cap = (text, { y = CAP_Y } = {}) => `<div class="d-cap" style="top:${y}px">${kw(text)}</div>`;

export const frames = {
  // 1. the hook: a doodled phone with "zzz", scribbled out; an arrow to him: "7 хоног?!"
  1: (m) => svg(`${ink(['M150 330 h170 a24 24 0 0 1 24 24 v300 a24 24 0 0 1 -24 24 h-170 a24 24 0 0 1 -24 -24 v-300 a24 24 0 0 1 24 -24Z', 'M210 640 h50'])}
      ${ink(['M120 360 L370 660', 'M370 360 L120 660'], { w: 20, c: '#ff6a2b' })}
      ${ink(['M640 560 C720 520 800 560 820 640 C830 700 790 760 740 780', 'M740 780 l40 -6 M740 780 l18 -34'], { w: 13 })}`) +
    `<div class="hand abs" style="left:190px;top:390px;font-size:100px;transform:rotate(-8deg)">zzz</div>
     <div class="hand abs" style="left:500px;top:330px;font-size:150px;transform:rotate(-6deg)">7 хоног?!</div>${cap(m.cap)}`,
  // 2. the offer: a hand-drawn week, every day ticked, "15:00!" circled
  2: (m) => svg(`${ink(['M100 470 H980 M100 470 V700 H980 V470', ...[1, 2, 3, 4, 5, 6].map((i) => `M${100 + i * 125.7} 470 V700`)], { w: 10 })}
      ${DAYS.map((_, i) => ink([`M${130 + i * 125.7} 610 l24 26 l50 -64`], { w: 15, c: '#ffc23d' })).join('')}
      ${ink(['M700 300 C860 280 990 320 960 380 C930 430 720 440 690 390 C670 350 720 320 790 312'], { w: 8, c: '#ff6a2b' })}
      ${ink([star(140, 330, 34), star(560, 300, 22)], { w: 6, c: '#ffc23d' })}`) +
    `<div class="hand abs" style="left:190px;top:270px;font-size:112px;transform:rotate(-3deg)">11/2 – 11/8</div>
     <div class="hand abs" style="left:730px;top:300px;font-size:100px;color:#ffc23d">15:00!</div>
     ${DAYS.map(([d], i) => `<div class="hand abs" style="left:${116 + i * 125.7}px;top:480px;font-size:66px">${d}</div>`).join('')}${cap(m.cap)}`,
  // 3. the result: a hand-drawn graph going up, "+10%" and "+20%", stars and a crown
  3: (m) => svg(`${ink(['M130 300 V760 H960'], { w: 8 })}
      ${ink(['M150 720 C300 700 380 640 480 600 S700 460 900 340', 'M900 340 l-58 4 M900 340 l-22 52'], { w: 18, c: '#ff6a2b' })}
      ${ink(['M840 250 l20 -60 l40 40 l40 -50 l20 70 Z'], { w: 8, c: '#ffc23d' })}
      ${ink([star(250, 380, 30), star(980, 520, 22)], { w: 6, c: '#ffc23d' })}`) +
    `<div class="hand abs" style="left:380px;top:600px;font-size:130px;transform:rotate(-8deg)">+10%</div>
     <div class="hand abs" style="left:600px;top:380px;font-size:180px;color:#ffc23d;transform:rotate(-12deg)">+20%</div>${cap(m.cap)}`,
};
