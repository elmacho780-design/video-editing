// Look A (approved): "HML notebook, coffee edition". The olympiad Reel's paper, stickers and hard shadows (one series), with a café twist:
// kraft-paper tape and cups, coffee rings on the cards, and the 3+1 offer as a café loyalty card.
// Components return HTML strings on the 1080x1920 stage; their 0..1 parameters drive the animation.
import { cup, coffeeRing, icon, kw, clamp, backOut, easeOut, DAYS, ON, PAINS, CAP_Y } from './common.js';

export const name = 'A · HML notebook, coffee edition';
export const css = `
:root { --navy: #14295a; --ink: #0d1c40; --paper: #f8f2e4; --orange: #ff6a2b; --kraft: #c9a173; --kraft-2: #a97c4f; --sky-soft: rgba(78,163,255,.26);
  --lift: 0 18px 34px rgba(8,16,40,.28); }
.uni { font-family: Unbounded, sans-serif; }
.a-cap { position: absolute; left: 50%; white-space: nowrap; background: var(--navy); color: #fff; border: 6px solid #fff; border-radius: 20px;
  padding: 14px 30px 18px; font: 800 54px/1.1 Manrope, sans-serif; letter-spacing: -0.5px; box-shadow: 9px 10px 0 var(--orange), var(--lift); }
.a-cap.small { font-size: 38px; padding: 10px 22px 13px; border-width: 5px; box-shadow: 6px 7px 0 var(--orange), var(--lift); }
.a-cap .kw { position: relative; color: #ff9a5c; }
.a-cap .kw::after { content: ''; position: absolute; left: -4px; right: -4px; bottom: -14px; height: 18px;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 18' preserveAspectRatio='none'><path d='M2 11 Q12 3 22 10 T42 10 T62 10 T82 10 T102 10 T118 8' fill='none' stroke='%23ff6a2b' stroke-width='5' stroke-linecap='round'/></svg>") 0 0/100% 100% no-repeat; }
.a-ticket { position: relative; white-space: nowrap; background: var(--paper); color: var(--navy); padding: 18px 54px 24px; font: 900 70px/1.05 Unbounded, sans-serif; letter-spacing: -2px;
  -webkit-mask: radial-gradient(circle 18px at 0 50%, transparent 98%, #000) left/51% 100% no-repeat, radial-gradient(circle 18px at 100% 50%, transparent 98%, #000) right/51% 100% no-repeat; }
.a-ticket .kw { color: var(--orange); }
.a-ticket-wrap { position: absolute; left: 50%; filter: drop-shadow(9px 10px 0 var(--orange)) drop-shadow(0 16px 26px rgba(8,16,40,.3)); }
.a-paper { position: absolute; background: var(--paper); border: 5px solid var(--navy); border-radius: 22px; box-shadow: 10px 12px 0 var(--navy), var(--lift);
  background-image: repeating-linear-gradient(180deg, transparent 0 46px, var(--sky-soft) 46px 48px); background-position: 0 30px; }
.a-paper .margin { position: absolute; left: 70px; top: 0; bottom: 0; width: 3px; background: rgba(255,106,43,.55); }
.a-page { position: absolute; inset: 0; background: var(--paper); background-image: repeating-linear-gradient(180deg, transparent 0 58px, var(--sky-soft) 58px 61px); background-position: 0 40px; }
.a-tape { position: absolute; width: 180px; height: 48px; background: rgba(201,161,115,.82); box-shadow: 0 2px 4px rgba(0,0,0,.12);
  background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 3px, transparent 3px 9px);
  clip-path: polygon(0 8%, 4% 0, 8% 10%, 12% 0, 16% 8%, 20% 0, 80% 0, 84% 9%, 88% 0, 92% 8%, 96% 0, 100% 10%, 100% 92%, 96% 100%, 92% 90%, 88% 100%, 84% 91%, 80% 100%, 20% 100%, 16% 92%, 12% 100%, 8% 90%, 4% 100%, 0 92%); }
.a-tape.or { background: rgba(255,140,58,.66); }
.a-stk { position: absolute; background: var(--navy); color: #fff; border: 5px solid #fff; border-radius: 18px; box-shadow: 6px 7px 0 var(--orange), var(--lift); font: 800 32px Manrope; padding: 10px 22px; white-space: nowrap; }
.a-stk.or { background: var(--orange); box-shadow: 6px 7px 0 var(--navy), var(--lift); }
.a-stk.kr { background: var(--kraft); color: var(--ink); box-shadow: 6px 7px 0 var(--navy), var(--lift); }
.die { filter: drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(9px 10px 0 var(--orange)) drop-shadow(0 14px 18px rgba(8,16,40,.3)); }
.bookmark { position: absolute; left: 70px; top: 0; width: 120px; height: 236px; background: var(--navy);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 84%, 0 100%); display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 54px; box-sizing: border-box; }
.bookmark .coin { width: 84px; height: 84px; border-radius: 50%; background: #fff url(assets/hml-tree.png) center/76% no-repeat; border: 4px solid var(--orange); box-sizing: border-box; }
.bookmark .t { color: #fff; font: 900 19px Unbounded; margin-top: 8px; letter-spacing: 1px; }
.flap { position: relative; display: inline-block; width: 66px; height: 100px; margin-right: 6px; border-radius: 10px; background: var(--navy);
  color: #fff; font: 800 70px/100px Unbounded; text-align: center; box-shadow: inset 0 -3px 0 rgba(0,0,0,.3); overflow: hidden; }
.flap::after { content: ''; position: absolute; left: 0; right: 0; top: 49px; height: 3px; background: rgba(0,0,0,.55); }
.flap.gap { width: 26px; background: none; box-shadow: none; }
.flap.gap::after { display: none; }
`;

const pop = (u) => `transform:scale(${backOut(u).toFixed(3)});opacity:${clamp(u * 4).toFixed(2)}`;
export const tape = (x, y, r = -6, cls = '') => `<div class="a-tape ${cls}" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)"></div>`;
export const brand = () => `<div class="bookmark"><span class="coin"></span><span class="t">HML</span></div>`;
export const cap = (text, { y = CAP_Y, tilt = -1.5, small = false } = {}) =>
  `<div class="a-cap ${small ? 'small' : ''}" style="top:${y}px;transform:translateX(-50%) rotate(${tilt}deg)">${kw(text)}</div>`;
// a question: a small sticker above a big paper ticket
export const ticket = (small, big, { y = CAP_Y - 60 } = {}) =>
  `${cap(small, { y, small: true, tilt: 2 })}<div class="a-ticket-wrap" style="top:${y + 80}px;transform:translateX(-50%) rotate(-3deg)"><div class="a-ticket">${kw(big)}</div></div>`;
// a hand-drawn orange marker line; p 0..1 draws it on
const marker = (d, { w = 9, c = '#ff6a2b', p = 1 } = {}) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${(1 - clamp(p)).toFixed(3)}"/>`;
const handCheck = (p = 1, s = 84) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40">${marker('M6 21 C10 24 13 28 16 33 C21 22 27 13 36 5', { w: 5.5, p })}</svg>`;
// a rough rubber stamp in HML orange
let stampN = 0;
export const stamp = (big, small, { x, y, r = -9, s = 1, o = 1 }) => { const id = `rough${stampN++}`; return `
  <svg class="abs" style="left:${x}px;top:${y}px;transform:rotate(${r}deg) scale(${s});opacity:${o};filter:drop-shadow(0 6px 10px rgba(0,0,0,.2))" width="560" height="220" viewBox="0 0 560 220">
    <defs><filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.25 1.95"/><feComposite in="SourceGraphic" operator="in"/></filter></defs>
    <g filter="url(#${id})" fill="#ff5a1a" stroke="#ff5a1a" opacity=".94">
      <rect x="8" y="8" width="544" height="204" rx="22" fill="none" stroke-width="10"/><rect x="26" y="26" width="508" height="168" rx="12" fill="none" stroke-width="4"/>
      <text x="280" y="122" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="80" stroke="none" textLength="470" lengthAdjust="spacingAndGlyphs">${big}</text>
      <text x="280" y="170" text-anchor="middle" font-family="Unbounded" font-weight="800" font-size="30" stroke="none" textLength="300" lengthAdjust="spacing">${small}</text></g></svg>`; };
// the English notebook sticker that the coffee turns into
const notebook = (w = 190) => `<svg width="${w}" height="${w * 1.15}" viewBox="0 0 190 218">
  <rect x="14" y="10" width="166" height="200" rx="14" fill="#fff" stroke="#14295a" stroke-width="6"/>
  <rect x="14" y="10" width="34" height="200" rx="10" fill="#ff6a2b" stroke="#14295a" stroke-width="6"/>
  ${[40, 80, 120, 160].map((y) => `<rect x="4" y="${y}" width="22" height="10" rx="5" fill="#14295a"/>`).join('')}
  <text x="114" y="96" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="46" fill="#14295a">ABC</text>
  <path d="M70 118h88M70 138h70M70 158h80" stroke="#4ea3ff" stroke-width="5" stroke-linecap="round"/>
  <image href="assets/hml-tree.png" x="122" y="164" width="44" height="34"/></svg>`;
// his face as a round photo sticker taped to the page. `me` is a still's path, or { src, box, on }: box = [cx, cy, w] from
// edit/face.json, so the live frame is cropped to keep his face filling the circle as he talks and walks in; on (0..1) pops it on
export const photo = (me, { x, y, d = 280, r = 4 }) => {
  const m = typeof me === 'string' ? { src: me, on: 1 } : me;
  if (!m || !(m.on > 0)) return '';
  let img;
  if (m.box) {
    const [cx, cy, w] = m.box, k = (0.56 * d) / w;
    img = `<img src="${m.src}" style="position:absolute;max-width:none;left:${(d / 2 - cx * k).toFixed(1)}px;top:${(d / 2 - (cy + 0.05 * w) * k).toFixed(1)}px;width:${(1080 * k).toFixed(1)}px;height:${(1920 * k).toFixed(1)}px">`;
  } else img = `<img src="${m.src}" style="position:absolute;left:50%;top:0;height:${Math.round(d * 2.3)}px;transform:translate(-50%,${-Math.round(d * 0.66)}px)">`;
  return `<div class="layer" style="transform-origin:${x + d / 2}px ${y + d / 2}px;${pop(m.on)}">
    <div class="abs" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;border:9px solid #fff;box-shadow:10px 12px 0 var(--orange),var(--lift);overflow:hidden;transform:rotate(${r}deg);background:#ddd">${img}</div>${tape(x + d / 2 - 90, y - 22, 10)}</div>`;
};
// a full-screen notebook page: ruled paper, the margin line, a faint HML tree and a coffee ring
export const page = (inner, { ring = [880, 1420] } = {}) => `<div class="a-page"></div>
  <div class="abs" style="left:110px;top:0;bottom:0;width:4px;background:rgba(255,106,43,.5)"></div>
  <div class="abs" style="left:560px;top:1330px;width:600px;height:620px;background:url(assets/hml-tree.png) center/contain no-repeat;opacity:.08"></div>
  ${ring ? coffeeRing({ x: ring[0], y: ring[1], r: 96, o: 0.22, seed: 9 }) : ''}${inner}`;

// ---------------------------------------------------------------- 1. the hook: one cup of coffee = English
// cup, eq, book: 0..1 (the cup slaps on, the "=" draws on, the notebook pops on "англи хэл")
export const hookCard = ({ cup: c = 1, eq = 1, book = 1, y = 262 } = {}) => `
  <div class="a-paper" style="left:70px;top:${y}px;width:940px;height:430px;transform:rotate(-1.5deg)"><div class="margin"></div>
    ${tape(380, -26, -4)}${coffeeRing({ x: 830, y: 90, r: 64, o: 0.28 })}
    <div class="abs" style="left:96px;top:34px;transform-origin:100px 200px;${pop(c)}"><div class="die" style="transform:rotate(-6deg)">${cup({ w: 196 })}</div></div>
    <div class="a-stk kr" style="left:96px;top:318px;font-size:30px;transform:rotate(-3deg);opacity:${clamp(c * 3)}">1 аяга кофе</div>
    <svg class="abs" style="left:358px;top:120px" width="170" height="140">${marker('M18 52 C50 44 96 48 150 40', { w: 14, p: eq * 2 })}${marker('M22 100 C60 92 104 96 146 88', { w: 14, p: eq * 2 - 1 })}</svg>
    <div class="abs" style="left:592px;top:52px;transform-origin:100px 200px;${pop(book)}"><div class="die" style="transform:rotate(5deg)">${notebook(196)}</div></div>
    <div class="a-stk or" style="left:600px;top:318px;font-size:30px;transform:rotate(3deg);opacity:${clamp(book * 3)}">англи хэл</div>
  </div>`;

// ---------------------------------------------------------------- 2. why online
// the three reasons as big rows on a full-screen page (it covers his walk into frame), his face as a photo sticker
export const painsPage = (face, { rows = [1, 1, 1], head = 1 } = {}) => page(`${brand()}
  ${photo(face, { x: 770, y: 236, d: 236 })}
  <div class="layer" style="transform-origin:330px 380px;${pop(head)}"><div class="a-stk" style="left:150px;top:310px;font:900 48px/1.15 Unbounded;padding:16px 28px 20px;transform:rotate(-3deg)">Танд<br>тохиолддог уу?</div></div>
  ${PAINS.map(([ic, t], i) => rows[i] <= 0 ? '' : `<div class="abs" style="left:150px;top:${620 + i * 230}px;width:860px;display:flex;align-items:center;gap:30px;transform-origin:430px 90px;
    transform:rotate(${(i % 2 ? 1.2 : -1.2) + (1 - clamp(rows[i])) * 10}deg) scale(${(0.6 + 0.4 * backOut(rows[i])).toFixed(3)});opacity:${clamp(rows[i] * 4)}">
    <span style="flex:none;width:130px;height:130px;border-radius:50%;background:var(--navy);display:grid;place-items:center;box-shadow:7px 8px 0 var(--orange)">${icon(ic, { s: 70, c: '#fff' })}</span>
    <span style="flex:1;background:#fff;border:5px solid var(--navy);border-radius:22px;padding:24px 30px;box-shadow:8px 9px 0 var(--navy);font:800 46px/1.15 Manrope;color:var(--navy);letter-spacing:-.5px">${t}</span></div>`).join('')}`);
// the same reasons as the card above his head; strike: three 0..1 strokes, then the stamp (0..1) slams on
export const painsCard = ({ rows = [1, 1, 1], strike = [1, 1, 1], stampOn = 1, y = 258 } = {}) => `
  <div class="a-paper" style="left:70px;top:${y}px;width:940px;height:440px;transform:rotate(1deg)"><div class="margin"></div>
    ${tape(640, -24, 5, 'or')}
    ${PAINS.map(([ic, t], i) => rows[i] <= 0 ? '' : `<div class="abs" style="left:100px;top:${46 + i * 120}px;display:flex;align-items:center;gap:24px;transform-origin:40px 42px;${pop(rows[i])}">
      <span style="width:84px;height:84px;border-radius:50%;background:var(--navy);display:grid;place-items:center;box-shadow:5px 6px 0 var(--orange)">${icon(ic, { s: 46, c: '#fff' })}</span>
      <span style="font:800 38px Manrope;color:var(--navy);letter-spacing:-.5px">${t}</span></div>`).join('')}
    <svg class="abs" style="left:190px;top:0" width="720" height="440">${[0, 1, 2].map((i) => marker(`M10 ${90 + i * 120} C160 ${84 + i * 120 + (i % 2) * 8} 330 ${94 + i * 120} ${[668, 470, 556][i]} ${86 + i * 120}`, { w: 8, p: strike[i] })).join('')}</svg>
    ${stampOn > 0 ? stamp('ОНЛАЙН', 'СУРГАЛТ', { x: 470, y: 268, r: -10, s: 0.82 * (1 + 0.6 * (1 - easeOut(stampOn))), o: clamp(stampOn * 3) }) : ''}
  </div>`;

// ---------------------------------------------------------------- 3. olympiad or level up: both ticked, "БҮГД БАГТСАН" stamped
const tag = (t, x, y, r, tick) => `<div class="abs" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)">
  <div style="position:relative;display:flex;align-items:center;gap:18px;background:var(--kraft);color:var(--ink);border:5px solid var(--navy);border-radius:16px 40px 40px 16px;padding:22px 34px 22px 64px;
    box-shadow:7px 8px 0 var(--navy);font:900 36px Unbounded;white-space:nowrap">
    <span style="position:absolute;left:20px;top:50%;width:22px;height:22px;margin-top:-11px;border-radius:50%;background:var(--paper);border:4px solid var(--navy)"></span>${t}</div>
  <div class="abs" style="right:-46px;top:-40px">${tick > 0 ? handCheck(tick, 104) : ''}</div></div>`;
export const tagsCard = ({ ent = [1, 1], ticks = [1, 1], stampOn = 1, y = 262 } = {}) => `
  <div class="a-paper" style="left:70px;top:${y}px;width:940px;height:420px;transform:rotate(-1deg)"><div class="margin"></div>
    ${tape(120, -24, -7, 'or')}${tape(680, -22, 5)}
    ${ent[0] > 0 ? `<div class="layer" style="transform-origin:300px 100px;${pop(ent[0])}">${tag('Олимпиадын бэлтгэл', 100, 50, -3, ticks[0])}</div>` : ''}${ent[1] > 0 ? `<div class="layer" style="transform-origin:360px 246px;${pop(ent[1])}">${tag('Түвшин ахиулах', 150, 196, 2, ticks[1])}</div>` : ''}
    ${stampOn > 0 ? stamp('БҮГД', 'БАГТСАН', { x: 520, y: 262, r: 6, s: 0.56 * (1 + 0.6 * (1 - easeOut(stampOn))), o: clamp(stampOn * 3) }) : ''}
  </div>`;

// ---------------------------------------------------------------- 4. schedule
// circles: three 0..1 marker circles drawn round Tuesday, Thursday, Saturday as he says each
const weekRow = (circles, { x = 96, y = 150, w = 100, gap = 14, h = 150, fs = 40, top = false } = {}) => {
  const pitch = w + gap;
  return `<div class="abs" style="left:${x}px;top:${y}px;display:flex;gap:${gap}px">${DAYS.map((d, i) => {
    const k = ON.indexOf(i), on = k >= 0 && circles[k] > 0.5;
    return `<div style="position:relative;box-sizing:border-box;width:${w}px;height:${h}px;border-radius:16px;background:${on ? 'var(--navy)' : '#fff'};border:4px solid var(--navy);box-shadow:${on ? '6px 7px 0 var(--orange)' : 'none'};
      display:flex;flex-direction:column;align-items:center;justify-content:${top ? 'flex-start;padding-top:26px;background-image:repeating-linear-gradient(180deg,transparent 0 56px,rgba(78,163,255,.22) 56px 58px);background-position:0 80px' : 'center'};gap:6px;transform:rotate(${on ? [-4, 3, -3][k] : 0}deg)">
      <span class="uni" style="font:900 ${fs}px Unbounded;color:${on ? '#fff' : 'var(--navy)'}">${d}</span>
      ${on ? `<span style="font:800 ${Math.round(fs * 0.55)}px Manrope;color:#ffb27f">17:00</span>` : `<span style="height:${Math.round(fs * 0.6)}px"></span>`}</div>`; }).join('')}</div>
    <svg class="abs" style="left:0;top:0;overflow:visible" width="10" height="10">${ON.map((i, k) => { const cx = x + i * pitch + w / 2, t = y - 18, b = y + h + 22, rx = w * 0.82;
      return marker(`M${cx - 6} ${t} C${cx + rx} ${t - 6} ${cx + rx} ${b - 4} ${cx - 2} ${b} C${cx - rx} ${b + 4} ${cx - rx} ${t + 8} ${cx + 10} ${t - 4}`, { w: 7, p: circles[k] }); }).join('')}</svg>`;
};
export const weekCard = ({ circles = [1, 1, 1], time = 1, y = 270 } = {}) => `
  <div class="a-paper" style="left:70px;top:${y}px;width:940px;height:400px;transform:rotate(-1deg)"><div class="margin"></div>
    ${tape(110, -24, -7)}${tape(690, -22, 6, 'or')}${coffeeRing({ x: 860, y: 330, r: 58, o: 0.26, seed: 5 })}
    <div class="abs" style="left:100px;top:34px;display:flex;align-items:center;gap:16px"><span style="color:var(--orange)">${icon('cal', { s: 52, w: 2.6 })}</span>
      <span class="uni" style="font:900 46px Unbounded;color:var(--navy)">Хуваарь</span><span class="a-stk kr" style="position:relative;font-size:26px;padding:6px 16px;transform:rotate(3deg);margin-left:10px">онлайн</span>
      ${time > 0 ? `<span class="a-stk or" style="position:relative;display:flex;align-items:center;gap:8px;font:900 34px Unbounded;padding:6px 18px 8px 12px;margin-left:12px;transform:rotate(-4deg) scale(${backOut(time).toFixed(3)});opacity:${clamp(time * 4)}">${icon('clock', { s: 34, c: '#fff', w: 2.6 })}17:00</span>` : ''}</div>
    ${weekRow(circles)}
  </div>`;
// the full-screen planner page that covers his walk into frame ("Хуваарийн хувьд гэх юм бол")
export const weekPage = (face) => page(`${brand()}
  ${photo(face, { x: 780, y: 236, d: 220, r: -4 })}
  <div class="abs" style="left:150px;top:330px;display:flex;align-items:center;gap:20px"><span style="color:var(--orange)">${icon('cal', { s: 84, w: 2.4 })}</span>
    <span class="uni" style="font:900 84px Unbounded;color:var(--navy);letter-spacing:-2px">Хуваарь</span></div>
  <div class="a-stk kr" style="left:160px;top:470px;font-size:34px;transform:rotate(-3deg)">долоо хоног бүр · онлайн</div>
  <div class="a-stk or" style="left:640px;top:456px;display:flex;align-items:center;gap:10px;font:900 44px Unbounded;padding:8px 22px 10px 14px;transform:rotate(4deg)">${icon('clock', { s: 44, c: '#fff', w: 2.6 })}17:00</div>
  <div class="a-paper" style="left:120px;top:620px;width:860px;height:600px;transform:rotate(1deg);background-image:none;background:#fff">
    ${tape(330, -24, -3, 'or')}
    ${weekRow([0, 0, 0], { x: 30, y: 90, w: 104, gap: 12, h: 430, fs: 42, top: true })}</div>`, { ring: [900, 1500] });

// ---------------------------------------------------------------- 5. the 3+1 offer as a café loyalty card
// stamps: three 0..1 (each month stamped), plus and free: 0..1
export const loyaltyCard = ({ stamps = [1, 1, 1], plus = 1, free = 1, x = 70, y = 268, s = 1, r = -2 } = {}) => `
  <div class="abs" style="left:${x}px;top:${y}px;width:940px;height:420px;transform:rotate(${r}deg) scale(${s});transform-origin:470px 210px;background:#d8b88c;border:5px solid var(--navy);border-radius:26px;
    box-shadow:10px 12px 0 var(--navy),var(--lift);background-image:radial-gradient(rgba(122,74,38,.16) 1.4px,transparent 1.6px);background-size:14px 14px">
    ${tape(40, -24, -9, 'or')}
    <div class="abs" style="left:20px;top:20px;right:20px;bottom:20px;border:3px dashed rgba(20,41,90,.55);border-radius:18px"></div>
    <div class="abs" style="left:50px;top:42px;display:flex;align-items:center;gap:16px">
      <span style="width:64px;height:64px;border-radius:50%;background:#fff url(assets/hml-tree.png) center/78% no-repeat;border:4px solid var(--navy)"></span>
      <span class="uni" style="font:900 40px Unbounded;color:var(--navy)">3+1 карт</span></div>
    <div class="abs" style="right:52px;top:52px;font:800 28px Manrope;color:var(--navy)">3 сараар бүртгүүлээд</div>
    ${[0, 1, 2].map((i) => `<div class="abs" style="left:${56 + i * 196}px;top:150px;width:170px;height:170px;border-radius:50%;background:#f8f2e4;border:4px solid var(--navy);display:grid;place-items:center">
      ${stamps[i] > 0 ? `<svg width="150" height="150" viewBox="0 0 150 150" style="transform:rotate(${[-14, 8, -6][i]}deg) scale(${(1 + 0.7 * (1 - easeOut(stamps[i]))).toFixed(3)});opacity:${clamp(stamps[i] * 3)}"><defs><filter id="rs${i}"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${i + 2}"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.9"/><feComposite in="SourceGraphic" operator="in"/></filter></defs>
        <g filter="url(#rs${i})" fill="#ff5a1a" stroke="#ff5a1a"><circle cx="75" cy="75" r="64" fill="none" stroke-width="7"/>
        <text x="75" y="88" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="44" stroke="none">${i + 1}</text>
        <text x="75" y="118" text-anchor="middle" font-family="Unbounded" font-weight="800" font-size="18" stroke="none">САР</text></g></svg>` : ''}</div>`).join('')}
    ${plus > 0 ? `<div class="abs" style="left:640px;top:126px;width:230px;height:230px;border-radius:50%;background:var(--orange);border:5px solid var(--navy);box-shadow:7px 8px 0 var(--navy);display:grid;place-items:center;transform:rotate(6deg) scale(${backOut(plus).toFixed(3)})">
      <div style="text-align:center;color:#fff"><div class="uni" style="font:900 74px/1 Unbounded">+1</div><div style="font:800 30px Manrope">сар</div></div></div>` : ''}
    ${free > 0 ? `<div class="a-stk" style="left:668px;top:330px;font:900 34px Unbounded;transform:rotate(-7deg) scale(${backOut(free).toFixed(3)})">ҮНЭГҮЙ</div>` : ''}
  </div>`;
// full-screen: the card on the page, big, while he walks into frame ("Энэ дээр мөн адил манай 3+1")
export const loyaltyPage = (face, { head = 1, ...opts } = {}) => page(`${brand()}
  ${photo(face, { x: 700, y: 236, d: 260 })}
  <div class="layer" style="transform-origin:340px 380px;${pop(head)}"><div class="a-stk or" style="left:150px;top:330px;font:900 54px Unbounded;padding:14px 30px 18px;transform:rotate(-4deg)">Урамшуулал</div></div>
  ${loyaltyCard({ x: 70, y: 700, s: 1.04, r: -3, ...opts })}`);

// ---------------------------------------------------------------- 6. contact: split-flap numbers on a paper card
export const phoneBoard = ({ flipped = 99, y = 230, left = 70, scale = 0.92 } = {}) => {
  const nums = ['9930 4451', '8888 3351']; let k = 0;
  const row = (n) => [...n].map((c) => {
    if (c === ' ') return '<span class="flap gap"></span>';
    const f = clamp(flipped - k++);
    return f >= 1 ? `<span class="flap">${c}</span>` : f <= 0 ? '<span class="flap" style="background:#2a3f72;color:transparent"></span>'
      : `<span class="flap" style="background:#1d3366"><span style="display:block;transform:scaleY(${Math.abs(Math.cos(f * Math.PI)).toFixed(3)})">${f > 0.5 ? c : String((c.charCodeAt(0) + 3) % 10)}</span></span>`;
  }).join('');
  return `<div class="a-paper" style="left:${left}px;top:${y}px;width:940px;height:380px;transform:rotate(-1deg) scale(${scale});transform-origin:50% 0"><div class="margin"></div>
    ${tape(70, -24, -8, 'or')}${tape(720, -22, 6)}
    <div class="abs" style="left:96px;top:26px;display:flex;align-items:center;gap:14px"><span style="width:64px;height:64px;border-radius:50%;background:var(--orange);border:4px solid var(--navy);display:grid;place-items:center">${icon('phone', { s: 34, c: '#fff', w: 2.4 })}</span>
      <span style="font:800 32px Manrope;color:var(--navy)">Утасны дугаар</span></div>
    <div class="a-stk kr" style="right:26px;top:24px;font-size:30px;transform:rotate(6deg)">доор ↓</div>
    <div class="abs" style="left:96px;top:116px">${row(nums[0])}</div>
    <div class="abs" style="left:96px;top:240px">${row(nums[1])}</div>
  </div>`;
};

// ---------------------------------------------------------------- 7. end card
export const endCard = (face, { logo = 1, board = 1, stickers = 1, me = 1, flipped = 99 } = {}) => page(`
  <div class="layer" style="transform-origin:540px 536px;${pop(logo)}">
  <div class="abs" style="left:190px;top:236px;width:700px;height:600px;background:#fff url(assets/hml-logo.png) 50% 46%/104% no-repeat;border:6px solid var(--navy);border-radius:26px;box-shadow:12px 14px 0 var(--orange),var(--lift);transform:rotate(-2deg)"></div>
  ${tape(250, 212, -10)}${tape(680, 216, 9, 'or')}</div>
  <div class="layer" style="transform-origin:140px 800px;${pop(logo * 1.3 - 0.3)}"><div class="abs die" style="left:60px;top:700px;transform:rotate(-10deg)">${cup({ w: 150 })}</div></div>
  <div class="layer" style="transform-origin:540px 1090px;${pop(board)}">${phoneBoard({ y: 900, left: 70, scale: 1, flipped })}</div>
  <div class="abs" style="left:110px;top:1336px;display:flex;gap:24px;align-items:center;transform-origin:200px 40px;${pop(stickers)}">
    <div class="a-stk" style="position:relative;font:900 36px Unbounded;padding:14px 26px;transform:rotate(-3deg);background:#4ea3ff;box-shadow:6px 7px 0 var(--navy),var(--lift)">@hml_english</div>
    <div class="a-stk or" style="position:relative;font:900 36px Unbounded;padding:14px 26px;transform:rotate(3deg)">3+1</div></div>
  ${photo(typeof face === 'string' ? { src: face, on: me } : face, { x: 760, y: 1250, d: 230, r: -5 })}`, { ring: [930, 820] });

// ---------------------------------------------------------------- the signature transition: the coffee steam grows into the HML tree
// three limbs rise from the cup's steam, fork twice, flowers open at the tips; the next scene shows through the blooms
function branches() {
  const out = [], rnd = ((s) => () => (s = (s * 16807) % 2147483647) / 2147483647)(5);
  const grow = (x, y, a, len, w, depth) => {
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len, mx = x + Math.cos(a + 0.35 * (depth % 2 ? -1 : 1)) * len * 0.55, my = y + Math.sin(a + 0.35) * len * 0.55;
    out.push({ x, y, mx, my, x2, y2, w, depth });
    if (depth < 2) [-0.5, 0.42].forEach((da) => grow(x2, y2, a + da + (rnd() - 0.5) * 0.3, len * (0.68 + rnd() * 0.12), w * 0.66, depth + 1));
  };
  grow(500, 1420, -1.95, 560, 46, 0); grow(540, 1400, -1.57, 640, 50, 0); grow(580, 1420, -1.19, 560, 46, 0);
  return out;
}
const BR = branches();
const qpt = (b, t) => [(1 - t) ** 2 * b.x + 2 * (1 - t) * t * b.mx + t * t * b.x2, (1 - t) ** 2 * b.y + 2 * (1 - t) * t * b.my + t * t * b.y2];
const circ = (cx, cy, r) => r <= 0.5 ? '' : `M${(cx - r).toFixed(1)} ${cy.toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2 * r).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2 * r).toFixed(1)} 0Z`;
export const steamParts = (p) => {
  const vis = (b) => clamp(p * 3.2 - b.depth * 0.7), bloom = (b) => Math.max(0, vis(b) - 0.85) / 0.15;
  let clip = '';
  BR.forEach((b) => { const v = vis(b); if (v <= 0.02) return; for (let t = 0; t <= v; t += 0.04) { const [cx, cy] = qpt(b, t); clip += circ(cx, cy, b.w * 0.8 + 380 * Math.max(0, p - 0.3)); } });
  BR.filter((b) => b.depth === 2).forEach((b) => { clip += circ(b.x2, b.y2, bloom(b) * 120 + 900 * Math.max(0, p - 0.55)); });
  clip += circ(540, 1000, 2400 * Math.max(0, (p - 0.75) / 0.25) ** 1.5);
  const fade = p < 0.8 ? 1 : Math.max(0, (1 - p) / 0.2), cupIn = clamp(p * 5);
  const lines = `<svg class="layer" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><linearGradient id="bw" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f0561e"/><stop offset="1" stop-color="#ffc93c"/></linearGradient>
    <filter id="sh"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0b1633" flood-opacity=".45"/></filter></defs><g opacity="${fade}" filter="url(#sh)">${
    BR.map((b) => `<path d="M${b.x} ${b.y} Q${b.mx.toFixed(0)} ${b.my.toFixed(0)} ${b.x2.toFixed(0)} ${b.y2.toFixed(0)}" fill="none" stroke="url(#bw)" stroke-width="${b.w * 0.5}" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${(1 - vis(b)).toFixed(3)}"/>`).join('')}${
    BR.filter((b) => b.depth >= 1 && vis(b) > 0.85).map((b) => { const s = Math.min(1, bloom(b) * 1.4) * (b.depth === 2 ? 46 : 32);
      return `<g transform="translate(${b.x2.toFixed(0)} ${b.y2.toFixed(0)}) rotate(${b.depth * 20})">${[0, 1, 2, 3, 4].map((k) => `<ellipse cx="${(Math.cos(k * 1.2566) * s * 0.85).toFixed(1)}" cy="${(Math.sin(k * 1.2566) * s * 0.85).toFixed(1)}" rx="${(s * 0.62).toFixed(1)}" ry="${(s * 0.5).toFixed(1)}" transform="rotate(${k * 72} ${(Math.cos(k * 1.2566) * s * 0.85).toFixed(1)} ${(Math.sin(k * 1.2566) * s * 0.85).toFixed(1)})" fill="#ffc93c"/>`).join('')}<circle r="${(s * 0.42).toFixed(1)}" fill="#f0561e"/></g>`; }).join('')}</g></svg>`;
  const cupHtml = `<div class="abs" style="left:380px;top:1380px;opacity:${fade};transform-origin:160px 420px;${pop(cupIn)}"><div class="die">${cup({ w: 320, steamOn: 0 })}</div></div>`;
  return { clip: clip || 'M0 0Z', lines, cup: cupHtml };
};
export const steamWipe = (fromHtml, toHtml, p) => {
  const w = steamParts(p);
  return `<div class="layer">${fromHtml}</div><div class="layer" style="clip-path:path('${w.clip}')">${toHtml}</div>${w.lines}${w.cup}`;
};

// ---------------------------------------------------------------- the style frames (?view=frames&o=a&f=1..4)
export const frames = {
  1: (m) => `${brand()}${hookCard()}${cap(m.cap)}`,
  2: (m) => `${brand()}${painsCard()}${cap(m.cap, { tilt: 1.5 })}`,
  3: (m) => `${brand()}${weekCard()}${cap(m.cap)}`,
  4: (m) => `${brand()}${loyaltyCard()}${cap(m.cap, { tilt: 1.5 })}`,
};
