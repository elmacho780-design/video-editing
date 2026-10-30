// Look B: "Online class". The cards are app screens: notification toasts, a calendar widget, a plan card, a big button that gets clicked.
// Solid white UI cards with soft shadows (no glass), HML navy and orange, captions as chat bubbles from "HML Online".
import { cup, icon, kw, DAYS, ON, PAINS, CAP_Y } from './common.js';

export const name = 'B · Online class';
export const css = `
:root { --navy: #14295a; --ink: #0d1c40; --orange: #ff6a2b; --sky: #4ea3ff; --muted: #5d6c8c; --soft: #eef3fb; }
.uni { font-family: Unbounded, sans-serif; }
.b-say { position: absolute; left: 50%; transform: translateX(-50%); display: flex; align-items: flex-end; gap: 14px; white-space: nowrap; }
.b-say .av { width: 72px; height: 72px; border-radius: 50%; background: #fff url(assets/hml-tree.png) center/74% no-repeat; border: 4px solid var(--orange); box-shadow: 0 10px 22px rgba(8,16,40,.35); flex: none; }
.b-bubble { background: #fff; color: var(--navy); font: 800 54px/1.1 Manrope, sans-serif; letter-spacing: -.5px; padding: 18px 34px 22px; border-radius: 44px 44px 44px 12px;
  box-shadow: 0 18px 40px rgba(8,16,40,.35); }
.b-bubble .kw { color: var(--orange); }
.b-toast { position: absolute; left: 70px; width: 940px; box-sizing: border-box; background: #fff; border-radius: 34px; padding: 22px 28px; display: flex; align-items: center; gap: 24px;
  box-shadow: 0 18px 38px rgba(8,16,40,.32); color: var(--navy); }
.b-toast .ico { width: 88px; height: 88px; border-radius: 24px; flex: none; display: grid; place-items: center; }
.b-toast .ttl { font: 800 32px Manrope; display: flex; align-items: center; gap: 12px; }
.b-toast .msg { font: 700 30px Manrope; color: var(--muted); margin-top: 4px; }
.b-toast .time { position: absolute; right: 30px; top: 22px; font: 700 24px Manrope; color: var(--muted); }
.b-card { position: absolute; background: #fff; border-radius: 40px; box-shadow: 0 22px 46px rgba(8,16,40,.34); color: var(--navy); box-sizing: border-box; }
.b-live { position: absolute; left: 60px; top: 238px; display: flex; align-items: center; gap: 12px; background: var(--navy); color: #fff; font: 800 26px Manrope; padding: 10px 22px 10px 16px; border-radius: 40px;
  box-shadow: 0 8px 18px rgba(8,16,40,.3); }
.b-live i { width: 16px; height: 16px; border-radius: 50%; background: #ff3b30; box-shadow: 0 0 0 5px rgba(255,59,48,.3); }
.b-chip { display: inline-flex; align-items: center; gap: 8px; font: 800 24px Manrope; padding: 6px 16px; border-radius: 30px; }
.b-btn { position: absolute; display: flex; align-items: center; gap: 22px; background: linear-gradient(180deg, #ff7d43, #ff5f1f); color: #fff; font: 900 50px Unbounded; letter-spacing: -1px;
  padding: 26px 50px 30px 34px; border-radius: 70px; box-shadow: 0 16px 34px rgba(255,106,43,.5), inset 0 -7px 0 rgba(0,0,0,.14); white-space: nowrap; }
.b-btn .pl { width: 74px; height: 74px; border-radius: 50%; background: #fff; display: grid; place-items: center; color: var(--orange); }
.toggle { width: 96px; height: 56px; border-radius: 30px; background: var(--orange); position: relative; flex: none; }
.toggle::after { content: ''; position: absolute; right: 6px; top: 6px; width: 44px; height: 44px; border-radius: 50%; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,.25); }
`;

const live = () => `<div class="b-live"><i></i>LIVE · HML Online</div>`;
export const cap = (text, { y = CAP_Y } = {}) => `<div class="b-say" style="top:${y}px"><span class="av"></span><span class="b-bubble">${kw(text)}</span></div>`;
const cursor = (x, y, s = 1) => `<svg class="abs" style="left:${x}px;top:${y}px;transform:scale(${s});filter:drop-shadow(0 6px 8px rgba(0,0,0,.35))" width="74" height="88" viewBox="0 0 24 28">
  <path d="M3 2v20.5l5.4-4.9 3.7 8.2 3.6-1.6-3.6-8.1H19z" fill="#fff" stroke="#0d1c40" stroke-width="1.7" stroke-linejoin="round"/></svg>`;
const ripple = (x, y) => `<svg class="abs" style="left:${x - 90}px;top:${y - 90}px" width="180" height="180"><circle cx="90" cy="90" r="40" fill="none" stroke="#fff" stroke-width="6" opacity=".9"/>
  <circle cx="90" cy="90" r="72" fill="none" stroke="#fff" stroke-width="4" opacity=".45"/></svg>`;
const hmlIco = (bg = 'var(--navy)') => `<span class="ico" style="background:${bg}"><span style="width:64px;height:64px;border-radius:50%;background:#fff url(assets/hml-tree.png) center/78% no-repeat"></span></span>`;
const confetti = (seed, n, box) => { let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return [...Array(n)].map(() => `<div class="abs" style="left:${(box[0] + r() * box[2]).toFixed(0)}px;top:${(box[1] + r() * box[3]).toFixed(0)}px;width:${12 + r() * 14}px;height:${8 + r() * 8}px;border-radius:3px;
    background:${['#ff6a2b', '#14295a', '#4ea3ff', '#ffb02e'][Math.floor(r() * 4)]};transform:rotate(${(r() * 180).toFixed(0)}deg)"></div>`).join(''); };

export const frames = {
  // 1. the hook: the daily coffee notification gets swiped away, the HML class notification lands
  1: (m) => `${live()}
    <div class="b-toast" style="top:300px;transform:translateX(-46px) rotate(-1.5deg);opacity:.62">
      <span class="ico" style="background:#c9a173">${cup({ w: 60, sleeve: '#14295a', coin: false, sw: 8 })}</span>
      <div><div class="ttl">Өглөөний кофе</div><div class="msg">Өдөр бүр, нэг аяга</div></div><span class="time">08:10</span></div>
    <div class="abs" style="left:486px;top:414px;width:96px;height:96px;border-radius:50%;background:var(--orange);display:grid;place-items:center;box-shadow:0 10px 22px rgba(255,106,43,.5);z-index:2">
      <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v16M3.5 16.5 7 20l3.5-3.5M17 20V4M13.5 7.5 17 4l3.5 3.5"/></svg></div>
    <div class="b-toast" style="top:478px;box-shadow:0 22px 44px rgba(8,16,40,.36),0 0 0 5px var(--orange)">
      ${hmlIco()}
      <div><div class="ttl">HML Online <span class="b-chip" style="background:#ffe6db;color:var(--orange)">LIVE</span></div><div class="msg">Англи хэлний хичээл эхэллээ</div></div><span class="time">одоо</span></div>
    ${cap(m.cap)}`,

  // 2. why online: the three reasons as notifications, each closed with an ✕, then the ОНЛАЙН СУРГАЛТ button gets clicked
  2: (m) => `${live()}
    ${PAINS.map(([ic, t], i) => `<div class="b-toast" style="top:${292 + i * 102}px;padding:14px 24px;width:900px;left:${90 - i * 8}px;transform:rotate(${[-1, 0.8, -0.6][i]}deg)">
      <span class="ico" style="width:70px;height:70px;border-radius:50%;background:var(--soft);color:var(--navy)">${icon(ic, { s: 40 })}</span>
      <div class="ttl" style="font-size:34px;color:#8a97b2;text-decoration:line-through;text-decoration-color:var(--orange);text-decoration-thickness:5px">${t}</div>
      <span style="margin-left:auto;width:54px;height:54px;border-radius:50%;background:var(--orange);display:grid;place-items:center">${icon('x', { s: 30, c: '#fff', w: 3.4 })}</span></div>`).join('')}
    <div class="b-btn" style="left:150px;top:606px;transform:rotate(-2deg);font-size:46px;padding:20px 46px 24px 26px"><span class="pl">${icon('play', { s: 40, c: '#ff6a2b', w: 2 }).replace('fill="none"', 'fill="#ff6a2b"')}</span>ОНЛАЙН СУРГАЛТ</div>
    ${ripple(216, 664)}${cursor(210, 662)}
    ${cap(m.cap)}`,

  // 3. schedule: a calendar widget, Tuesday, Thursday and Saturday on, the reminder switched on
  3: (m) => `${live()}
    <div class="b-card" style="left:70px;top:306px;width:940px;height:330px;padding:34px 40px">
      <div style="display:flex;align-items:center;gap:16px"><span style="color:var(--orange)">${icon('cal', { s: 50, w: 2.6 })}</span>
        <span class="uni" style="font:900 44px Unbounded">Хуваарь</span>
        <span class="b-chip" style="margin-left:auto;background:var(--soft);color:var(--navy)">${icon('bell', { s: 26, w: 2.6 })} Сануулга</span><span class="toggle" style="transform:scale(.8)"></span></div>
      <div style="display:flex;justify-content:space-between;margin-top:36px">${DAYS.map((d, i) => { const on = ON.includes(i);
        return `<div style="display:flex;flex-direction:column;align-items:center;gap:14px">
          <span style="width:104px;height:104px;border-radius:50%;display:grid;place-items:center;font:900 36px Unbounded;${on ? 'background:var(--orange);color:#fff;box-shadow:0 10px 20px rgba(255,106,43,.45)' : 'background:var(--soft);color:#8a97b2'}">${d}</span>
          ${on ? `<span class="b-chip" style="background:var(--navy);color:#fff;font-size:20px;padding:4px 12px"><i style="width:10px;height:10px;border-radius:50%;background:#ff3b30"></i>LIVE</span>` : '<span style="height:32px"></span>'}</div>`; }).join('')}</div>
    </div>
    ${cap(m.cap)}`,

  // 4. the 3+1 offer as a plan card: three months, plus one month free switched on, the button clicked
  4: (m) => `${live()}
    ${confetti(7, 30, [40, 240, 1000, 500])}
    <div class="b-card" style="left:70px;top:300px;width:940px;height:370px;padding:32px 40px">
      <div style="display:flex;align-items:center;gap:16px"><span style="width:64px;height:64px;border-radius:20px;background:#ffe6db;color:var(--orange);display:grid;place-items:center">${icon('gift', { s: 42, w: 2.4 })}</span>
        <span class="uni" style="font:900 42px Unbounded">3+1 урамшуулал</span></div>
      <div style="display:flex;align-items:center;gap:20px;margin-top:30px;padding:18px 24px;background:var(--soft);border-radius:26px">
        <span style="width:56px;height:56px;border-radius:50%;background:var(--navy);display:grid;place-items:center">${icon('check', { s: 34, c: '#fff', w: 3.2 })}</span>
        <span style="font:800 36px Manrope">3 сараар бүртгүүлэх</span></div>
      <div style="display:flex;align-items:center;gap:20px;margin-top:16px;padding:18px 24px;background:#fff3ec;border-radius:26px;box-shadow:0 0 0 4px var(--orange) inset">
        <span style="width:56px;height:56px;border-radius:50%;background:var(--orange);display:grid;place-items:center">${icon('gift', { s: 32, c: '#fff', w: 2.6 })}</span>
        <span style="font:800 36px Manrope">+1 сар</span><span class="b-chip" style="background:var(--orange);color:#fff;font:900 26px Unbounded;padding:8px 18px">ҮНЭГҮЙ</span>
        <span class="toggle" style="margin-left:auto"></span></div>
    </div>
    ${confetti(9, 14, [60, 640, 940, 60])}${cursor(880, 600)}
    ${cap(m.cap)}`,
};
