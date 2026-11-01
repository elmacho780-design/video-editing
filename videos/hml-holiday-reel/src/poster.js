// Look 5: "Poster campaign". The A3 3+1 poster's look in motion, so the Reel and the print read as one HML campaign:
// a cream header panel with a diagonal edge, the golden plane and dots, giant cropped orange type, Montserrat Black with an outlined word,
// the round stamp. Flat colour only.
import { kw, CAP_Y } from './common.js';

export const name = 'Poster campaign';
export const css = `
:root { --cream: #f6f0e4; --sun: #ffc23d; --fire: #f26a1b; --navy: #0a2f52; }
.c-panel { position: absolute; left: 0; top: 0; width: 1080px; overflow: hidden; font-family: Montserrat, sans-serif; color: var(--navy); filter: drop-shadow(0 14px 24px rgba(5,20,40,.28)); }
.c-in { position: absolute; inset: 0; background: var(--cream); }
.c-in > * { position: absolute; }
.c-dot { border-radius: 50%; }
.c-type { font-weight: 900; line-height: .86; white-space: nowrap; }
.c-out { font-family: 'Montserrat Outline', Montserrat, sans-serif; color: transparent; -webkit-text-stroke: 4px var(--navy); }
.c-giant { font-weight: 900; line-height: .8; color: var(--fire); letter-spacing: -.04em; white-space: nowrap; }
.c-cap { position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap; background: var(--cream); color: var(--navy); font: 900 52px/1.1 Montserrat; text-transform: uppercase;
  padding: 14px 28px 16px; border-radius: 6px; box-shadow: 10px 10px 0 var(--sun); }
.c-cap .kw { color: var(--fire); }
`;
const panel = (h, inner, drop = 70) => `<div class="c-panel" style="height:${h}px"><div class="c-in" style="clip-path:polygon(0 0,100% 0,100% ${h - drop}px,0 100%)">${inner}</div></div>`;
const dot = (x, y, d, c) => `<div class="c-dot" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px;background:var(--${c})"></div>`;
const plane = (pts) => `<div style="inset:0;background:var(--sun);clip-path:polygon(${pts})"></div>`;
const stamp = (text, { x, y, d = 230, r = -12 }) => `
  <svg style="left:${x}px;top:${y}px;transform:rotate(${r}deg)" width="${d}" height="${d}" viewBox="0 0 200 200">
    <defs><path id="ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs>
    <circle cx="100" cy="100" r="96" fill="#f6f0e4" stroke="#0a2f52" stroke-width="2.6"/><circle cx="100" cy="100" r="61" fill="none" stroke="#0a2f52" stroke-width="1.6"/>
    <text font-family="Montserrat" font-weight="800" font-size="15.2" letter-spacing="2.4" fill="#0a2f52"><textPath href="#ring" textLength="489" lengthAdjust="spacing">${text}</textPath></text>
    <image href="assets/hml-brain.png" x="62" y="70" width="76" height="59"/></svg>`;
export const cap = (text, { y = CAP_Y } = {}) => `<div class="c-cap" style="top:${y}px">${kw(text)}</div>`;

export const frames = {
  // 1. the hook: "АМРАЛТАА / УТСАНД / ҮРЭХ ҮҮ?" (waste the holiday on the phone?) beside a giant 7 cropped by the edge
  1: (m) => `${panel(780, `${plane('72% 0,100% 0,100% 100%,62% 100%')}${dot(-120, 520, 300, 'sun')}${dot(640, 640, 26, 'navy')}
      <div class="c-giant" style="left:640px;top:150px;font-size:700px">7</div>
      <div class="c-type" style="left:64px;top:270px;font-size:116px">АМРАЛТАА</div>
      <div class="c-type c-out" style="left:58px;top:394px;font-size:130px">УТСАНД</div>
      <div class="c-type" style="left:64px;top:530px;font-size:104px;color:var(--navy)">ҮРЭХ ҮҮ?</div>`)}${cap(m.cap)}`,
  // 2. the offer: "АМРАЛТЫН / АНГИ" with the dates and the stamp
  2: (m) => `${panel(780, `${plane('68% 0,100% 0,100% 100%,56% 100%')}${dot(470, 250, 44, 'fire')}${dot(30, 700, 22, 'navy')}
      <div class="c-type" style="left:64px;top:262px;font:800 34px Montserrat;letter-spacing:.2em;color:var(--fire)">HML ACADEMY</div>
      <div class="c-type" style="left:58px;top:316px;font-size:108px">АМРАЛТЫН</div>
      <div class="c-type c-out" style="left:54px;top:430px;font-size:160px">АНГИ</div>
      <div class="c-type" style="left:64px;top:610px;font-size:62px;color:var(--fire)">11 САРЫН 2–8</div>
      ${stamp('ӨДӨР БҮР 15:00 • АМРАЛТЫН АНГИ •', { x: 780, y: 300, d: 240 })}`)}${cap(m.cap)}`,
  // 3. the result: a giant "+20%" cropped by the edge, "ДҮН" outlined
  3: (m) => `${panel(780, `${plane('64% 8%,100% 4%,100% 100%,48% 100%')}${dot(560, 230, 40, 'navy')}
      <div class="c-giant" style="left:-30px;top:200px;font-size:420px">+20%</div>
      <div class="c-type" style="left:64px;top:560px;font-size:72px">+10%</div>
      <div class="c-type c-out" style="left:330px;top:560px;font-size:90px">ДҮН ӨСНӨ</div>`)}${cap(m.cap)}`,
};
