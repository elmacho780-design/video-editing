// Look 2: "Screen time". His first line is about a holiday spent staring at the phone, so the Reel opens on a phone screen-time report
// and the rest is told with clean app cards: a calendar widget for the week, a grades chart going up. Captions are chat bubbles.
// Solid white UI cards with soft shadows (no glass), HML navy and orange.
import { kw, icon, DAYS, CAP_Y } from './common.js';

export const name = 'Screen time';
export const css = `
:root { --navy: #14295a; --ink: #0d1c40; --orange: #ff6a2b; --amber: #ffb02e; --muted: #5d6c8c; --soft: #eef3fb; }
.uni { font-family: Unbounded, Montserrat, sans-serif; }
.p-card { position: absolute; background: #fff; border-radius: 44px; box-shadow: 0 24px 50px rgba(8,16,40,.36); color: var(--navy); box-sizing: border-box; }
.p-say { position: absolute; left: 50%; transform: translateX(-50%); display: flex; align-items: flex-end; gap: 14px; white-space: nowrap; }
.p-say .av { width: 72px; height: 72px; border-radius: 50%; background: #fff url(assets/hml-tree.png) center/74% no-repeat; border: 4px solid var(--orange); box-shadow: 0 10px 22px rgba(8,16,40,.35); flex: none; }
.p-bubble { background: #fff; color: var(--navy); font: 800 56px/1.1 Manrope; letter-spacing: -.5px; padding: 18px 34px 22px; border-radius: 46px 46px 46px 12px; box-shadow: 0 18px 40px rgba(8,16,40,.35); }
.p-bubble .kw { color: var(--orange); }
.chip { display: inline-flex; align-items: center; gap: 8px; font: 800 26px Manrope; padding: 8px 18px; border-radius: 30px; }
`;
export const cap = (text, { y = CAP_Y } = {}) => `<div class="p-say" style="top:${y}px"><span class="av"></span><span class="p-bubble">${kw(text)}</span></div>`;

export const frames = {
  // 1. the hook: the phone's screen-time report for the holiday week, every day full
  1: (m) => `<div class="p-card" style="left:90px;top:250px;width:900px;height:560px;padding:40px 46px">
      <div style="display:flex;align-items:center;gap:16px;color:var(--muted);font:800 30px Manrope">${icon('phone', { s: 38, w: 2.4 })}Дэлгэцийн цаг · амралтын 7 хоног</div>
      <div style="display:flex;align-items:baseline;gap:14px;margin-top:20px"><span class="uni" style="font:900 120px/1 Unbounded, Montserrat;color:var(--navy)">6ц 40м</span><span style="font:800 32px Manrope;color:var(--muted)">өдөрт</span></div>
      <div style="display:flex;align-items:flex-end;gap:26px;height:200px;margin-top:30px">${DAYS.map(([d], i) => `<div style="display:flex;flex-direction:column;align-items:center;gap:10px">
        <span style="width:84px;height:${[150, 170, 160, 182, 175, 196, 188][i]}px;border-radius:16px;background:linear-gradient(180deg,#ff8a50,#ff5f1f)"></span><span style="font:800 24px Manrope;color:var(--muted)">${d}</span></div>`).join('')}</div>
      </div>
    ${cap(m.cap)}`,

  // 2. the offer: a calendar widget, all seven days on, 15:00
  2: (m) => `<div class="p-card" style="left:90px;top:270px;width:900px;height:470px;padding:38px 42px">
      <div style="display:flex;align-items:center;gap:16px"><span style="color:var(--orange)">${icon('cal', { s: 52, w: 2.6 })}</span>
        <span class="uni" style="font:900 44px Unbounded, Montserrat">Амралтын анги</span></div>
      <div style="font:800 30px Manrope;color:var(--muted);margin-top:6px">11 сарын 2–8 · өдөр бүр</div>
      <div style="display:flex;justify-content:space-between;margin-top:34px">${DAYS.map(([d, n]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:12px">
        <span style="font:800 24px Manrope;color:var(--muted)">${d}</span>
        <span style="width:104px;height:104px;border-radius:50%;display:grid;place-items:center;font:900 40px Unbounded, Montserrat;background:var(--orange);color:#fff;box-shadow:0 10px 20px rgba(255,106,43,.45)">${n}</span>
        <span class="chip" style="background:var(--navy);color:#fff;font-size:20px;padding:4px 12px">15:00</span></div>`).join('')}</div></div>
    ${cap(m.cap)}`,

  // 3. the result: the grades chart going up, +10% and +20%
  3: (m) => `<div class="p-card" style="left:90px;top:250px;width:900px;height:560px;padding:40px 46px">
      <div style="display:flex;align-items:center;gap:16px;color:var(--muted);font:800 30px Manrope">${icon('book', { s: 38, w: 2.4 })}Явцын шалгалт</div>
      <svg class="abs" style="left:46px;top:150px" width="808" height="330" viewBox="0 0 808 330">
        <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6a2b" stop-opacity=".35"/><stop offset="1" stop-color="#ff6a2b" stop-opacity="0"/></linearGradient></defs>
        ${[80, 160, 240].map((y) => `<path d="M0 ${y}H808" stroke="#e5ebf5" stroke-width="3"/>`).join('')}
        <path d="M0 270 C140 262 220 250 320 200 S520 120 620 90 S760 40 808 30 V330 H0Z" fill="url(#g)"/>
        <path d="M0 270 C140 262 220 250 320 200 S520 120 620 90 S760 40 808 30" fill="none" stroke="#ff6a2b" stroke-width="10" stroke-linecap="round"/>
        <circle cx="320" cy="200" r="16" fill="#fff" stroke="#14295a" stroke-width="7"/><circle cx="808" cy="30" r="18" fill="#fff" stroke="#14295a" stroke-width="7"/></svg>
      <div class="chip" style="position:absolute;left:330px;top:250px;background:var(--navy);color:#fff;font:900 40px Unbounded, Montserrat;padding:10px 22px">+10%</div>
      <div class="chip" style="position:absolute;right:60px;top:110px;background:var(--orange);color:#fff;font:900 52px Unbounded, Montserrat;padding:12px 26px">+20%</div></div>
    ${cap(m.cap)}`,
};
