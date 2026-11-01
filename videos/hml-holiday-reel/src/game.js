// The "Level Up" look (approved): a video-game screen over the footage. Components return HTML strings on the 1080x1920 stage;
// their 0..1 parameters drive the animation. Pixel type is Press Start 2P (it has the Mongolian Ү and Ө); boxes have pixel-stepped
// borders made from box-shadows; motion is stepped (a few "frames" per move) like an old console, not smooth.
import { clamp, kw, icon, DAYS, CAP_Y } from './common.js';

export const css = `
:root { --navy: #14295a; --ink: #0b1530; --deep: #1b2f63; --orange: #ff6a2b; --amber: #ffb02e; --sky: #4ea3ff; --red: #ff4d4d; --green: #3fd17a; }
.px, .px * { font-family: 'Press Start 2P', monospace; }
.pxbox { position: absolute; background: var(--ink); color: #fff;
  box-shadow: 0 -6px 0 0 #fff, 0 6px 0 0 #fff, -6px 0 0 0 #fff, 6px 0 0 0 #fff, 0 -12px 0 0 var(--ink), 0 12px 0 0 var(--ink), -12px 0 0 0 var(--ink), 12px 0 0 0 var(--ink), 10px 22px 0 0 rgba(0,0,0,.35); }
.cap { left: 50%; transform: translateX(-50%); white-space: nowrap; padding: 26px 44px 30px 40px; font: 400 40px/1.3 'Press Start 2P'; }
.cap .kw { color: var(--amber); }
.cap .tri { position: absolute; right: 12px; bottom: 6px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 14px solid var(--amber); }
.who { position: absolute; left: 22px; top: -40px; background: var(--orange); color: #fff; font: 400 20px 'Press Start 2P'; padding: 8px 14px; box-shadow: 0 -4px 0 0 #fff, 0 4px 0 0 #fff, -4px 0 0 0 #fff, 4px 0 0 0 #fff; }
.seg { display: inline-block; width: 40px; height: 34px; margin-right: 5px; background: #2a3a66; }
.seg.on { background: var(--amber); box-shadow: inset 0 -8px 0 rgba(0,0,0,.18), inset 0 6px 0 rgba(255,255,255,.35); }
.seg.hot { background: #fff; }
.chip { display: inline-block; padding: 8px 12px; box-shadow: 0 -4px 0 0 #fff, 0 4px 0 0 #fff, -4px 0 0 0 #fff, 4px 0 0 0 #fff; }
.big { position: absolute; font: 400 92px/1 'Press Start 2P'; color: var(--amber); text-shadow: 8px 8px 0 var(--orange), 16px 16px 0 var(--ink); white-space: nowrap; }
`;

// stepped animation: u (0..1) in n steps, so things snap like sprites rather than glide
export const step = (u, n = 4) => Math.floor(clamp(u) * n) / n;
// a box that opens in steps: scaleY from a thin bar to full
const open = (u, origin = '50% 50%') => { const v = step(u, 4); return v <= 0 ? 'display:none' : `transform-origin:${origin};transform:scale(${(0.35 + 0.65 * v).toFixed(3)},${Math.max(0.08, v).toFixed(3)})`; };
export const blink = (t, hz = 3) => Math.floor(t * hz * 2) % 2 === 0;

// ---------------------------------------------------------------- HUD: level badge, XP bar (xp 0..1, 8 blocks), coin, a label under the bar
export const hud = ({ lvl = 1, xp = 0, label = '', flash = false, on = 1 } = {}) => on <= 0 ? '' : `<div class="layer px" style="${open(on, '50% 0')}">
  <div class="pxbox" style="left:70px;top:246px;width:610px;height:96px;display:flex;align-items:center;gap:18px;padding:0 22px;box-sizing:border-box">
    <span style="font-size:28px;color:var(--amber);white-space:nowrap">LVL ${lvl}</span>
    <span style="display:flex">${[...Array(8)].map((_, i) => `<span class="seg ${i < Math.round(xp * 8) ? (flash ? 'hot' : 'on') : ''}"></span>`).join('')}</span></div>
  ${label ? `<div style="position:absolute;left:84px;top:352px;font-size:20px;color:#fff;text-shadow:3px 3px 0 var(--ink)">${label}</div>` : ''}
  <div class="pxbox" style="left:760px;top:246px;width:180px;height:96px;display:flex;align-items:center;justify-content:center;gap:12px;font-size:26px">
    <span style="width:44px;height:44px;border-radius:50%;background:#fff url(assets/hml-tree.png) center/80% no-repeat;box-shadow:0 0 0 4px var(--amber)"></span>HML</div></div>`;

// the RPG dialogue box caption
export const cap = (text, { y = CAP_Y, who = 'HML' } = {}) => `<div class="pxbox cap px" style="top:${y}px"><span class="who">${who}</span>${kw(text)}<span class="tri"></span></div>`;

export const pixelStar = (x, y, s = 1, c = '#ffb02e') => `<svg class="abs" style="left:${x}px;top:${y}px" width="${48 * s}" height="${48 * s}" viewBox="0 0 12 12" shape-rendering="crispEdges">
  <path fill="${c}" d="M5 0h2v3h2v1h3v2h-2v1h-1v2h1v3h-2v-1h-1v-1H5v1H4v1H2V9h1V7H2V6H0V4h3V3h2z"/></svg>`;

// ---------------------------------------------------------------- 1. the stats screen: rows appear as he names them; the phone row flashes red
export const stats = ({ on = 1, rows = [1, 1, 1], phoneHot = false } = {}) => {
  const R = [['clock', 'Амралт', '7 өдөр', '#fff'], ['star', 'Шинэ үг', '0', 'var(--red)'], ['phone', 'Утас', 'өдөрт 6 цаг', phoneHot ? 'var(--red)' : '#fff']];
  return `<div class="pxbox px" style="left:110px;top:440px;width:860px;height:300px;padding:30px 40px;box-sizing:border-box;${open(on)}">
    <div style="font-size:34px;color:var(--amber);margin-bottom:26px">СТАТУС</div>
    ${R.map(([ic, a, b, c], i) => rows[i] <= 0 ? '<div style="height:52px"></div>' : `<div style="display:flex;align-items:center;gap:18px;font-size:30px;margin-top:${i ? 22 : 0}px;color:${i === 2 && phoneHot ? 'var(--red)' : '#fff'}">
      ${icon(ic, { s: 40, c: i === 2 && phoneHot ? '#ff4d4d' : '#fff', w: 2.4 })}<span style="width:280px">${a}</span><span style="color:${c}">${b}</span></div>`).join('')}</div>`;
};

// ---------------------------------------------------------------- 2. the choice: ▶ ТИЙМ / ҮГҮЙ, the cursor confirms ТИЙМ
export const choice = ({ on = 1, picked = 0, t = 0 } = {}) => `<div class="pxbox px" style="left:250px;top:500px;width:580px;height:220px;padding:34px 44px;box-sizing:border-box;${open(on)}">
    <div style="display:flex;justify-content:space-between;align-items:center;font-size:44px;height:150px">
      <span style="color:${picked > 0 && blink(t, 6) ? 'var(--amber)' : '#fff'}">${picked > 0 || blink(t, 2) ? '▶' : '&nbsp;'} ТИЙМ</span><span style="color:#8d99b8">ҮГҮЙ</span></div></div>`;
// the NPC alert above his head: a big pixel "!"
export const alert = ({ on = 1 } = {}) => on <= 0 ? '' : `<div class="px" style="position:absolute;left:470px;top:${(560 - 30 * step(on, 3)).toFixed(0)}px;width:140px;height:170px;background:var(--amber);color:var(--ink);font-size:110px;line-height:170px;text-align:center;
    box-shadow:0 -8px 0 0 #fff,0 8px 0 0 #fff,-8px 0 0 0 #fff,8px 0 0 0 #fff,12px 20px 0 0 rgba(0,0,0,.35)">!</div>`;

// ---------------------------------------------------------------- 3. NEW QUEST: a banner sweeps across, then the quest card fills in row by row
export const questBanner = ({ u = 0 } = {}) => { if (u <= 0 || u >= 1) return ''; const x = u < 0.2 ? -1100 + 1100 * step(u / 0.2, 4) : u > 0.85 ? 1100 * step((u - 0.85) / 0.15, 3) : 0;
  return `<div class="px" style="position:absolute;left:${x}px;top:560px;width:1080px;height:170px;background:var(--orange);display:flex;align-items:center;justify-content:center;gap:30px;
    box-shadow:0 -8px 0 0 #fff,0 8px 0 0 #fff,0 16px 0 0 var(--ink)"><span style="font-size:76px;color:#fff;text-shadow:6px 6px 0 var(--ink)">NEW QUEST!</span></div>`; };
export const questCard = ({ on = 1, rows = [1, 1, 1, 1] } = {}) => {
  const R = [['clock', '7 өдөр · эрчимжүүлсэн'], ['cal', '11 сарын 2–8'], ['clock', 'Өдөр бүр 15:00'], ['star', 'Түвшин ахиулах']];
  return `<div class="pxbox px" style="left:110px;top:410px;width:860px;height:390px;padding:30px 40px;box-sizing:border-box;background:var(--deep);${open(on)}">
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px"><span class="chip" style="background:var(--orange);font-size:20px">QUEST</span><span style="font-size:34px;color:var(--amber)">АМРАЛТЫН АНГИ</span></div>
    ${R.map(([ic, a], i) => rows[i] <= 0 ? '<div style="height:56px"></div>' : `<div style="display:flex;align-items:center;gap:18px;font-size:28px;height:56px;color:${i === 2 ? 'var(--amber)' : '#fff'}">
      <span style="color:var(--amber)">▸</span>${icon(ic, { s: 36, c: '#fff', w: 2.4 })}${a}</div>`).join('')}</div>`;
};

// ---------------------------------------------------------------- 4. the level map: 7 days as nodes, the player walks along, items pop up
const NODE = DAYS.map((_, i) => [70 + i * 120, i % 2 ? 170 : 250]);
export const levelMap = ({ on = 1, pos = 0, got = [] } = {}) => {
  const p = clamp(pos) * 6, k = Math.floor(p), f = p - k, a = NODE[Math.min(6, k)], b = NODE[Math.min(6, k + 1)];
  const px = a[0] + (b[0] - a[0]) * step(f, 3), py = a[1] + (b[1] - a[1]) * step(f, 3);
  return `<div class="pxbox px" style="left:110px;top:430px;width:860px;height:350px;box-sizing:border-box;background:var(--deep);${open(on)}">
    <div style="position:absolute;left:30px;top:24px;font-size:24px;line-height:1.5;color:var(--amber)">11 сарын 2–8 <span style="color:#fff">· 15:00</span></div>
    <svg class="abs" style="left:0;top:20px" width="860" height="330" shape-rendering="crispEdges">
      <path d="M70 250 H190 V170 H310 V250 H430 V170 H550 V250 H670 V170 H790" fill="none" stroke="#ffffff" stroke-width="10" stroke-dasharray="20 14"/></svg>
    ${DAYS.map(([d, n], i) => { const [x, y] = NODE[i], done = i < k || (i === k && f > 0.9);
      return `<div style="position:absolute;left:${x - 42}px;top:${y - 22}px;width:84px;height:84px;background:${done ? 'var(--amber)' : '#3a4c80'};color:${done ? 'var(--ink)' : '#fff'};display:flex;flex-direction:column;align-items:center;justify-content:center;
        font-size:28px;line-height:1.1;box-shadow:0 -5px 0 0 #fff,0 5px 0 0 #fff,-5px 0 0 0 #fff,5px 0 0 0 #fff">${n}<span style="font-size:14px;margin-top:6px">${d}</span></div>`; }).join('')}
    <div style="position:absolute;left:${px - 26}px;top:${py - 92}px;width:52px;height:60px;background:var(--orange);box-shadow:0 -4px 0 0 #fff,0 4px 0 0 #fff,-4px 0 0 0 #fff,4px 0 0 0 #fff;
      display:grid;place-items:center"><span style="width:30px;height:30px;border-radius:50%;background:#fff url(assets/hml-tree.png) center/80% no-repeat"></span></div>
    ${got.map(([label, u], i) => u <= 0 || u >= 1 ? '' : `<div style="position:absolute;left:${300 + i * 260}px;top:${110 - 80 * step(u, 6)}px;font-size:34px;color:var(--amber);text-shadow:4px 4px 0 var(--ink);opacity:${u > 0.75 ? 0 : 1}">${label}</div>`).join('')}</div>`;
};

// ---------------------------------------------------------------- 5. LEVEL UP!: a light burst, the big word, LVL 2
export const levelUp = ({ u = 0, t = 0 } = {}) => { if (u <= 0 || u >= 1) return ''; const s = u < 0.12 ? step(u / 0.12, 3) : 1, out = u > 0.88;
  return `${out ? '' : `<svg class="layer" width="1080" height="1920" style="-webkit-mask:radial-gradient(circle at 540px 600px,#000 120px,transparent 640px);transform-origin:540px 600px;transform:rotate(${(t * 40) % 360}deg)">${[...Array(16)].map((_, i) => { const a = (i / 16) * Math.PI * 2;
      return `<path d="M540 600 L${540 + Math.cos(a - 0.07) * 900} ${600 + Math.sin(a - 0.07) * 900} L${540 + Math.cos(a + 0.07) * 900} ${600 + Math.sin(a + 0.07) * 900}Z" fill="${i % 2 ? 'rgba(255,176,46,.55)' : 'rgba(255,255,255,.3)'}"/>`; }).join('')}</svg>`}
    <div class="big px" style="left:110px;top:540px;transform-origin:430px 50px;transform:scale(${s})">LEVEL UP!</div>
    ${u > 0.3 ? `<div class="pxbox px" style="left:390px;top:700px;padding:16px 24px;font-size:40px;color:var(--amber)">LVL 2</div>` : ''}
    ${pixelStar(110, 470, 1.4)}${pixelStar(910, 430, 1.1, '#ff6a2b')}${u > 0.4 ? pixelStar(860, 760, 0.9, '#fff') : ''}`; };

// ---------------------------------------------------------------- 6. the boss: the progress test, with an HP bar that drops on "10" and "20"
export const boss = ({ on = 1, hp = 1, hit = 0, beaten = 0 } = {}) => on <= 0 ? '' : `<div class="pxbox px" style="left:110px;top:420px;width:860px;height:170px;padding:24px 34px;box-sizing:border-box;background:#3a1020;${open(on)};${hit > 0 && hit < 1 ? `margin-left:${[14, -12, 8, -4, 0][Math.floor(hit * 5)]}px` : ''}">
    <div style="display:flex;align-items:center;gap:16px;font-size:26px"><span class="chip" style="background:var(--red);font-size:20px">BOSS</span><span style="color:#ffd0d0">ЯВЦЫН ШАЛГАЛТ</span>
      ${beaten > 0 ? `<span style="margin-left:auto;color:var(--green)">WIN!</span>` : ''}</div>
    <div style="margin-top:26px;height:40px;background:#1a0710;box-shadow:0 0 0 4px #fff"><div style="height:100%;width:${(100 * clamp(hp)).toFixed(1)}%;background:${hp > 0.5 ? 'var(--red)' : hp > 0.2 ? 'var(--amber)' : 'var(--green)'}"></div></div></div>`;
// a score pop: rises in steps, holds, blinks out
export const scorePop = ({ u = 0, text = '+10%', x = 160, y = 640, big = false, r = -4 } = {}) => { if (u <= 0 || u >= 1) return '';
  return `<div class="pxbox px" style="left:${x}px;top:${y - 30 * step(Math.min(1, u / 0.2), 3)}px;padding:18px 26px;font-size:${big ? 72 : 56}px;color:${big ? 'var(--orange)' : 'var(--amber)'};background:${big ? '#fff' : 'var(--ink)'};transform:rotate(${r}deg);${u > 0.9 && !blink(u * 10, 2) ? 'opacity:0' : ''}">${text}</div>`; };
// the achievement toast
export const achievement = ({ u = 0 } = {}) => { if (u <= 0 || u >= 1) return ''; const y = u < 0.12 ? 1920 - (1920 - 790) * step(u / 0.12, 4) : u > 0.9 ? 790 - 60 * step((u - 0.9) / 0.1, 3) : 790;
  return `<div class="pxbox px" style="left:130px;top:${y}px;width:820px;height:150px;display:flex;align-items:center;gap:24px;padding:0 30px;box-sizing:border-box;background:var(--deep);${u > 0.9 ? `opacity:${1 - step((u - 0.9) / 0.1, 3)}` : ''}">
    <span style="flex:none;width:96px;height:96px;background:var(--amber);display:grid;place-items:center;box-shadow:0 0 0 4px #fff">${icon('star', { s: 64, c: '#0b1530', w: 2.6, fill: '#ffffff' })}</span>
    <div><div style="font-size:20px;color:var(--amber)">ACHIEVEMENT UNLOCKED</div><div style="font-size:30px;margin-top:14px">Бүгдийг гайхшруулъя!</div></div></div>`; };

// ---------------------------------------------------------------- 7. CONTINUE?: a countdown, both numbers flip in, PRESS START
export const cont = ({ on = 1, count = 9, nums = 0, start = 0, t = 0 } = {}) => {
  // the 16 digits flip in one after another (spaces don't count)
  const digits = (s, k0) => { let k = k0; return [...s].map((c) => { if (c === ' ') return '<span style="display:inline-block;width:26px"></span>';
    const on = nums * 16 > k++; return `<span style="display:inline-block;width:52px;text-align:center;color:${on ? '#fff' : '#3a4c80'}">${on ? c : '_'}</span>`; }).join(''); };
  return `<div class="pxbox px" style="left:110px;top:400px;width:860px;height:420px;padding:30px 40px;box-sizing:border-box;${open(on)}">
    <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:48px;color:var(--amber)">CONTINUE?</span><span style="font-size:72px;color:#fff">${count}</span></div>
    <div style="margin-top:34px;display:flex;align-items:center;gap:20px;font-size:44px">${icon('phoneCall', { s: 48, c: '#ffb02e', w: 2.4 })}${digits('9930 4451', 0)}</div>
    <div style="margin-top:22px;display:flex;align-items:center;gap:20px;font-size:44px">${icon('phoneCall', { s: 48, c: '#ffb02e', w: 2.4 })}${digits('8888 3351', 8)}</div>
    ${start > 0 ? `<div style="margin-top:34px;font-size:30px;color:${blink(t, 2) ? 'var(--amber)' : '#fff'}">▶ PRESS START · 11/2 15:00</div>` : ''}</div>`;
};

// ---------------------------------------------------------------- 8. the end screen
export const endScreen = ({ u = 1, t = 0 } = {}) => `<div class="layer" style="background:var(--ink)"></div>
  <div class="layer" style="background-image:linear-gradient(rgba(78,163,255,.12) 2px,transparent 2px),linear-gradient(90deg,rgba(78,163,255,.12) 2px,transparent 2px);background-size:60px 60px"></div>
  <div class="px" style="position:absolute;inset:0;${u <= 0 ? 'display:none' : ''}">
    <div class="pxbox" style="left:190px;top:300px;width:700px;height:560px;background:#fff url(assets/hml-logo.png) 50% 46%/104% no-repeat;${open(u * 3)}"></div>
    ${u > 0.25 ? `<div style="position:absolute;left:0;width:1080px;top:930px;text-align:center;font-size:44px;color:var(--amber);text-shadow:5px 5px 0 var(--orange)">АМРАЛТЫН АНГИ</div>
      <div style="position:absolute;left:0;width:1080px;top:1010px;text-align:center;font-size:30px;color:#fff">11 сарын 2–8 · өдөр бүр 15:00</div>` : ''}
    ${u > 0.45 ? `<div style="position:absolute;left:0;width:1080px;top:1100px;text-align:center;font-size:40px;color:#fff;line-height:1.6">9930 4451<br>8888 3351</div>` : ''}
    ${u > 0.6 ? `<div style="position:absolute;left:0;width:1080px;top:1290px;text-align:center;font-size:30px;color:${blink(t, 2) ? 'var(--amber)' : 'var(--sky)'}">▶ PRESS START</div>
      <div style="position:absolute;left:0;width:1080px;top:1360px;text-align:center;font-size:24px;color:#8d99b8">@hml_english</div>` : ''}
    ${pixelStar(120, 330, 1.2)}${pixelStar(900, 820, 1, '#ff6a2b')}</div>`;
