// Look 1: "Level Up". A video-game screen over the footage, because the class is literally "түвшин ахиулах" (levelling up):
// an XP bar and level badge, captions as an RPG dialogue box, the 7 days as a level map, "+10%" "+20%" as score pops, LEVEL UP!
// Pixel type (Press Start 2P, which draws Mongolian Ү and Ө correctly) with HML navy, orange and amber; pixel-stepped borders made from box-shadows.
import { kw, icon, DAYS, CAP_Y } from './common.js';

export const name = 'Level Up';
export const css = `
:root { --navy: #14295a; --ink: #0b1530; --orange: #ff6a2b; --amber: #ffb02e; --sky: #4ea3ff; --cream: #fff6e0; }
.px { font-family: 'Press Start 2P', monospace; }
/* pixel-stepped border: a box with its corners notched */
.pxbox { position: absolute; background: var(--ink); color: #fff;
  box-shadow: 0 -6px 0 0 #fff, 0 6px 0 0 #fff, -6px 0 0 0 #fff, 6px 0 0 0 #fff, 0 -12px 0 0 var(--ink), 0 12px 0 0 var(--ink), -12px 0 0 0 var(--ink), 12px 0 0 0 var(--ink), 10px 22px 0 0 rgba(0,0,0,.35); }
.l-cap { left: 50%; transform: translateX(-50%); white-space: nowrap; padding: 26px 46px 30px 40px; font: 400 42px/1.3 'Press Start 2P'; }
.l-cap .kw { color: var(--amber); }
.l-cap .tri { position: absolute; right: 12px; bottom: 6px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 14px solid var(--amber); }
.l-who { position: absolute; left: 22px; top: -40px; background: var(--orange); color: #fff; font: 400 20px 'Press Start 2P'; padding: 8px 14px 8px;
  box-shadow: 0 -4px 0 0 #fff, 0 4px 0 0 #fff, -4px 0 0 0 #fff, 4px 0 0 0 #fff; }
.seg { display: inline-block; width: 46px; height: 34px; margin-right: 6px; background: #2a3a66; }
.seg.on { background: var(--amber); box-shadow: inset 0 -8px 0 rgba(0,0,0,.18), inset 0 6px 0 rgba(255,255,255,.35); }
.l-big { position: absolute; font: 400 92px/1 'Press Start 2P'; color: var(--amber); text-shadow: 8px 8px 0 var(--orange), 16px 16px 0 var(--ink); white-space: nowrap; }
`;

// the HUD: level badge and XP bar (xp 0..1), a coin counter
const hud = ({ lvl = 1, xp = 0, label = 'XP' } = {}) => `
  <div class="pxbox px" style="left:70px;top:246px;width:610px;height:96px;display:flex;align-items:center;gap:18px;padding:0 22px;box-sizing:border-box">
    <span style="font:400 28px 'Press Start 2P';color:var(--amber)">LVL ${lvl}</span>
    <span style="display:flex">${[...Array(8)].map((_, i) => `<span class="seg ${i < Math.round(xp * 8) ? 'on' : ''}"></span>`).join('')}</span></div>
  <div class="px" style="position:absolute;left:84px;top:350px;font:400 20px 'Press Start 2P';color:#fff;text-shadow:3px 3px 0 var(--ink)">${label}</div>
  <div class="pxbox px" style="left:760px;top:246px;width:180px;height:96px;display:flex;align-items:center;justify-content:center;gap:12px;font:400 26px 'Press Start 2P'">
    <span style="width:44px;height:44px;border-radius:50%;background:#fff url(assets/hml-tree.png) center/80% no-repeat;box-shadow:0 0 0 4px var(--amber)"></span>HML</div>`;
export const cap = (text, { y = CAP_Y, who = 'HML' } = {}) => `<div class="pxbox l-cap" style="top:${y}px"><span class="l-who">${who}</span>${kw(text)}<span class="tri"></span></div>`;
const pixelStar = (x, y, s = 1, c = '#ffb02e') => `<svg class="abs" style="left:${x}px;top:${y}px" width="${48 * s}" height="${48 * s}" viewBox="0 0 12 12" shape-rendering="crispEdges">
  <path fill="${c}" d="M5 0h2v3h2v1h3v2h-2v1h-1v2h1v3h-2v-1h-1v-1H5v1H4v1H2V9h1V7H2V6H0V4h3V3h2z"/></svg>`;

export const frames = {
  // 1. the hook: a stats screen. Holiday 7 days, phone 6 hours a day, XP 0
  1: (m) => `${hud({ xp: 0, label: 'XP 0 / 100' })}
    <div class="pxbox px" style="left:110px;top:440px;width:860px;height:300px;padding:30px 40px;box-sizing:border-box">
      <div style="font:400 34px 'Press Start 2P';color:var(--amber);margin-bottom:26px">СТАТУС</div>
      ${[['phone', 'Утас', 'өдөрт 6 цаг'], ['clock', 'Амралт', '7 өдөр'], ['star', 'Шинэ үг', '0']].map(([ic, a, b], i) => `
        <div style="display:flex;align-items:center;gap:18px;font:400 30px 'Press Start 2P';margin-top:${i ? 22 : 0}px">${icon(ic, { s: 40, c: '#fff', w: 2.4 })}<span style="width:280px">${a}</span>
          <span style="color:${i === 2 ? '#ff5a4a' : '#fff'}">${b}</span></div>`).join('')}</div>
    ${cap(m.cap)}`,

  // 2. the offer: the 7 days as a level map, 2 to 8 November, every day 15:00
  2: (m) => `${hud({ xp: 0.25, label: 'АМРАЛТЫН АНГИ' })}
    <div class="pxbox px" style="left:110px;top:440px;width:860px;height:330px;box-sizing:border-box;background:#1b2f63">
      <div style="position:absolute;left:30px;top:26px;font:400 26px/1.5 'Press Start 2P';color:var(--amber)">11 сарын 2-8<br><span style="color:#fff">өдөр бүр 15:00</span></div>
      <svg class="abs" style="left:0;top:0" width="860" height="330" shape-rendering="crispEdges">
        <path d="M70 250 H190 V170 H310 V250 H430 V170 H550 V250 H670 V170 H790" fill="none" stroke="#ffffff" stroke-width="10" stroke-dasharray="20 14"/></svg>
      ${DAYS.map(([d, n], i) => { const x = 70 + i * 120 - 42, y = (i % 2 ? 170 : 250) - 42;
        return `<div style="position:absolute;left:${x}px;top:${y}px;width:84px;height:84px;background:${i === 0 ? 'var(--orange)' : 'var(--amber)'};color:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;
          font:400 28px/1.1 'Press Start 2P';box-shadow:0 -5px 0 0 #fff,0 5px 0 0 #fff,-5px 0 0 0 #fff,5px 0 0 0 #fff">${n}<span style="font-size:14px;margin-top:6px">${d}</span></div>`; }).join('')}
      <div style="position:absolute;left:20px;top:150px;font:400 18px 'Press Start 2P';color:#fff;background:var(--orange);padding:6px 10px">START</div>
      ${pixelStar(790, 70, 1.2)}</div>
    ${cap(m.cap)}`,

  // 3. the result: LEVEL UP! with the score pops
  3: (m) => `${hud({ lvl: 2, xp: 1, label: 'XP 100 / 100' })}
    <svg class="layer" width="1080" height="1920" style="-webkit-mask:radial-gradient(circle at 540px 600px,#000 120px,transparent 620px)">${[...Array(16)].map((_, i) => { const a = (i / 16) * Math.PI * 2;
      return `<path d="M540 600 L${540 + Math.cos(a - 0.07) * 900} ${600 + Math.sin(a - 0.07) * 900} L${540 + Math.cos(a + 0.07) * 900} ${600 + Math.sin(a + 0.07) * 900}Z" fill="${i % 2 ? 'rgba(255,176,46,.55)' : 'rgba(255,255,255,.3)'}"/>`; }).join('')}</svg>
    <div class="l-big" style="left:110px;top:500px">LEVEL UP!</div>
    <div class="pxbox px" style="left:150px;top:670px;padding:18px 26px;font:400 52px 'Press Start 2P';color:var(--amber);transform:rotate(-4deg)">+10%</div>
    <div class="pxbox px" style="left:640px;top:640px;padding:18px 26px;font:400 66px 'Press Start 2P';color:var(--orange);background:#fff;transform:rotate(5deg)">+20%</div>
    ${pixelStar(90, 470, 1.4)}${pixelStar(930, 430, 1.1, '#ff6a2b')}${pixelStar(860, 760, 0.9, '#fff')}
    ${cap(m.cap)}`,
};
