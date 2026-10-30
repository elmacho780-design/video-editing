// Look C: "3+1 poster". The campaign look of the A3 poster in motion: a cream header panel with a diagonal edge, the golden plane and dots,
// giant cropped orange type, Montserrat Black with an outlined word, the round stamp. Flat colour only: no outlines, no shadows, no paper.
import { cup, kw, DAYS, ON, PAINS, CAP_Y } from './common.js';

export const name = 'C · 3+1 poster campaign';
export const css = `
:root { --cream: #f6f0e4; --sun: #ffc23d; --fire: #f26a1b; --orange: #fda00a; --navy: #0a2f52; }
.c-panel { position: absolute; left: 0; top: 0; width: 1080px; background: var(--cream); overflow: hidden; font-family: Montserrat, sans-serif; color: var(--navy);
  filter: drop-shadow(0 14px 24px rgba(5,20,40,.28)); }
.c-in { position: absolute; inset: 0; }
.c-in > * { position: absolute; }
.c-dot { border-radius: 50%; }
.c-type { font-weight: 900; line-height: .86; letter-spacing: .005em; white-space: nowrap; }
.c-out { font-family: 'Montserrat Outline', Montserrat, sans-serif; color: transparent; -webkit-text-stroke: 4px var(--navy); }
.c-giant { font-weight: 900; line-height: .8; color: var(--fire); letter-spacing: -.04em; white-space: nowrap; }
.c-cap { position: absolute; left: 50%; white-space: nowrap; background: var(--cream); color: var(--navy); font: 900 52px/1.1 Montserrat, sans-serif; text-transform: uppercase; letter-spacing: .01em;
  padding: 14px 28px 16px; border-radius: 6px; box-shadow: 10px 10px 0 var(--sun); }
.c-cap .kw { color: var(--fire); }
`;

// the panel: cream with a diagonal lower edge (h at the left, h - drop at the right)
const panel = (h, inner, drop = 70) => `<div class="c-panel" style="height:${h}px"><div class="c-in" style="clip-path:polygon(0 0,100% 0,100% ${h - drop}px,0 100%);background:var(--cream)">${inner}</div></div>`;
const dot = (x, y, d, c) => `<div class="c-dot abs" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px;background:var(--${c})"></div>`;
const plane = (pts) => `<div class="abs" style="inset:0;background:var(--sun);clip-path:polygon(${pts})"></div>`;
export const cap = (text, { y = CAP_Y } = {}) => `<div class="c-cap" style="top:${y}px;transform:translateX(-50%)">${kw(text)}</div>`;
// the poster's round stamp: ring text around the HML brain-tree
const stamp = (text, { x, y, d = 240, r = -12 }) => `
  <svg class="abs" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)" width="${d}" height="${d}" viewBox="0 0 200 200">
    <defs><path id="ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs>
    <circle cx="100" cy="100" r="96" fill="var(--cream)" stroke="#0a2f52" stroke-width="2.6"/><circle cx="100" cy="100" r="61" fill="none" stroke="#0a2f52" stroke-width="1.6"/>
    <text font-family="Montserrat" font-weight="800" font-size="15.2" letter-spacing="2.4" fill="#0a2f52"><textPath href="#ring" textLength="489" lengthAdjust="spacing">${text}</textPath></text>
    <image href="assets/hml-brain.png" x="62" y="70" width="76" height="59"/></svg>`;

export const frames = {
  // 1. the hook: a giant flat coffee cup cropped by the edge; "1 АЯГА КОФЕ = АНГЛИ ХЭЛ" stacked with the outlined word
  1: (m) => `${panel(740, `
      ${dot(-150, 330, 470, 'sun')}${dot(372, 262, 40, 'fire')}${dot(930, 640, 22, 'navy')}${dot(980, 262, 54, 'sun')}
      <div style="left:-40px;top:210px;transform:rotate(-9deg)">${cup({ w: 400, body: '#f26a1b', lid: '#0a2f52', sleeve: '#ffc23d', steam: '#0a2f52', sw: 0, coin: false })}</div>
      <div class="c-type" style="left:412px;top:282px;font-size:84px">1 АЯГА</div>
      <div class="c-type c-out" style="left:406px;top:372px;font-size:158px">КОФЕ</div>
      <div class="c-type" style="left:412px;top:532px;font-size:66px;color:var(--fire)">= АНГЛИ ХЭЛ</div>`)}
    ${cap(m.cap)}`,

  // 2. why online: the three reasons struck through, then ОНЛАЙН / СУРГАЛТ stacked and the round stamp
  2: (m) => `${panel(720, `
      ${plane('70% 0,100% 0,100% 100%,60% 100%')}${dot(860, 560, 30, 'navy')}${dot(30, 236, 18, 'fire')}
      ${PAINS.map(([, t], i) => `<div class="c-type" style="left:64px;top:${258 + i * 58}px;font:800 34px/1 Montserrat;letter-spacing:.04em;text-transform:uppercase;opacity:.75">${t}
        <span style="position:absolute;left:-6px;right:-6px;top:15px;height:6px;background:var(--fire)"></span></div>`).join('')}
      <div class="c-type c-out" style="left:56px;top:450px;font-size:130px">ОНЛАЙН</div>
      <div class="c-type" style="left:56px;top:566px;font-size:130px;color:var(--fire)">СУРГАЛТ</div>
      ${stamp('HML ONLINE • ОНЛАЙН СУРГАЛТ •', { x: 790, y: 250, d: 232 })}`)}
    ${cap(m.cap)}`,

  // 3. schedule: "ДОЛОО ХОНОГТ 3 УДАА" with a giant 3, the week as a row of the poster's dots
  3: (m) => `${panel(770, `
      ${plane('80% 0,100% 0,100% 100%,72% 100%')}${dot(900, 300, 120, 'fire')}${dot(860, 520, 26, 'navy')}
      <div class="c-type" style="left:64px;top:250px;font:800 30px Montserrat;letter-spacing:.24em;color:var(--fire)">ХУВААРЬ</div>
      <div class="c-type" style="left:60px;top:300px;font-size:76px">ДОЛОО ХОНОГТ</div>
      <div class="c-giant" style="left:44px;top:388px;font-size:250px">3</div>
      <div class="c-type c-out" style="left:250px;top:430px;font-size:150px">УДАА</div>
      <div style="left:60px;top:618px;display:flex;gap:20px">${DAYS.map((d, i) => { const on = ON.includes(i);
        return `<span style="width:92px;height:92px;border-radius:50%;display:grid;place-items:center;font:900 32px Montserrat;box-sizing:border-box;${on ? 'background:var(--fire);color:var(--cream)' : 'border:4px solid var(--navy);color:var(--navy)'}">${d}</span>`; }).join('')}</div>`)}
    ${cap(m.cap)}`,

  // 4. the 3+1 offer: the poster itself in motion. Giant 3 and + in the panel, the 1 runs down the right edge, the stamp, the offer line
  4: (m) => `${panel(712, `
      ${plane('66% 10%,100% 6%,100% 100%,50% 100%')}${dot(470, 250, 44, 'sun')}${dot(470, 470, 24, 'navy')}
      <div class="c-giant" style="left:-36px;top:36px;font-size:560px">3</div>
      <div class="c-giant" style="left:330px;top:250px;font-size:300px">+</div>
      ${stamp('1 САР ҮНЭГҮЙ • 3+1 ХӨТӨЛБӨР •', { x: 560, y: 250, d: 210, r: 10 })}
      <div class="c-type" style="left:64px;top:520px;font:800 34px Montserrat;letter-spacing:.05em">3 САРААР БҮРТГҮҮЛЭЭД</div>
      <div class="c-type" style="left:60px;top:568px;font-size:76px;color:var(--fire)">1 САР ҮНЭГҮЙ</div>`)}
    <div class="c-giant abs" style="left:796px;top:150px;font-size:880px;filter:drop-shadow(0 14px 24px rgba(5,20,40,.3))">1</div>
    ${cap(m.cap)}`,
};
