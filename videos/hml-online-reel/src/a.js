// Look A: "HML notebook, coffee edition". The olympiad Reel's paper, stickers and hard shadows (one series), with a café twist:
// kraft-paper tape and cups, coffee rings on the cards, a receipt-style card, and the 3+1 offer as a café loyalty card.
import { cup, coffeeRing, icon, kw, DAYS, ON, PAINS, CAP_Y } from './common.js';

export const name = 'A · HML notebook, coffee edition';
export const css = `
:root { --navy: #14295a; --ink: #0d1c40; --paper: #f8f2e4; --orange: #ff6a2b; --kraft: #c9a173; --kraft-2: #a97c4f; --sky-soft: rgba(78,163,255,.26);
  --lift: 0 18px 34px rgba(8,16,40,.28); }
.uni { font-family: Unbounded, sans-serif; }
.a-cap { position: absolute; left: 50%; white-space: nowrap; background: var(--navy); color: #fff; border: 6px solid #fff; border-radius: 20px;
  padding: 14px 30px 18px; font: 800 54px/1.1 Manrope, sans-serif; letter-spacing: -0.5px; box-shadow: 9px 10px 0 var(--orange), var(--lift); }
.a-cap .kw { position: relative; color: #ff9a5c; }
.a-cap .kw::after { content: ''; position: absolute; left: -4px; right: -4px; bottom: -14px; height: 18px;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 18' preserveAspectRatio='none'><path d='M2 11 Q12 3 22 10 T42 10 T62 10 T82 10 T102 10 T118 8' fill='none' stroke='%23ff6a2b' stroke-width='5' stroke-linecap='round'/></svg>") 0 0/100% 100% no-repeat; }
.a-paper { position: absolute; background: var(--paper); border: 5px solid var(--navy); border-radius: 22px; box-shadow: 10px 12px 0 var(--navy), var(--lift);
  background-image: repeating-linear-gradient(180deg, transparent 0 46px, var(--sky-soft) 46px 48px); background-position: 0 30px; }
.a-paper .margin { position: absolute; left: 70px; top: 0; bottom: 0; width: 3px; background: rgba(255,106,43,.55); }
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
`;

const tape = (x, y, r = -6, cls = '') => `<div class="a-tape ${cls}" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)"></div>`;
const brand = () => `<div class="bookmark"><span class="coin"></span><span class="t">HML</span></div>`;
export const cap = (text, { y = CAP_Y, tilt = -1.5 } = {}) =>
  `<div class="a-cap" style="top:${y}px;transform:translateX(-50%) rotate(${tilt}deg)">${kw(text)}</div>`;
// a hand-drawn line: an orange marker stroke, slightly wobbly
const marker = (d, { w = 9, c = '#ff6a2b' } = {}) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
// a rough rubber stamp in HML orange
const stamp = (big, small, { x, y, r = -9, s = 1 }) => `
  <svg class="abs" style="left:${x}px;top:${y}px;transform:rotate(${r}deg) scale(${s});filter:drop-shadow(0 6px 10px rgba(0,0,0,.2))" width="560" height="220" viewBox="0 0 560 220">
    <defs><filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.25 1.95"/><feComposite in="SourceGraphic" operator="in"/></filter></defs>
    <g filter="url(#rough)" fill="#ff5a1a" stroke="#ff5a1a" opacity=".94">
      <rect x="8" y="8" width="544" height="204" rx="22" fill="none" stroke-width="10"/><rect x="26" y="26" width="508" height="168" rx="12" fill="none" stroke-width="4"/>
      <text x="280" y="122" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="80" stroke="none" textLength="470" lengthAdjust="spacingAndGlyphs">${big}</text>
      <text x="280" y="170" text-anchor="middle" font-family="Unbounded" font-weight="800" font-size="30" stroke="none" textLength="300" lengthAdjust="spacing">${small}</text></g></svg>`;
// the English notebook sticker that the coffee turns into
const notebook = (w = 190) => `<svg width="${w}" height="${w * 1.15}" viewBox="0 0 190 218">
  <rect x="14" y="10" width="166" height="200" rx="14" fill="#fff" stroke="#14295a" stroke-width="6"/>
  <rect x="14" y="10" width="34" height="200" rx="10" fill="#ff6a2b" stroke="#14295a" stroke-width="6"/>
  ${[40, 80, 120, 160].map((y) => `<rect x="4" y="${y}" width="22" height="10" rx="5" fill="#14295a"/>`).join('')}
  <text x="114" y="96" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="46" fill="#14295a">ABC</text>
  <path d="M70 118h88M70 138h70M70 158h80" stroke="#4ea3ff" stroke-width="5" stroke-linecap="round"/>
  <image href="assets/hml-tree.png" x="122" y="164" width="44" height="34"/></svg>`;

export const frames = {
  // 1. the hook: one cup of coffee = English. A café receipt card, the kraft cup, a hand-drawn "=", the English notebook
  1: (m) => `${brand()}
    <div class="a-paper" style="left:70px;top:262px;width:940px;height:430px;transform:rotate(-1.5deg)"><div class="margin"></div>
      ${tape(380, -26, -4)}
      ${coffeeRing({ x: 830, y: 90, r: 64, o: 0.28 })}
      <div class="abs die" style="left:96px;top:34px;transform:rotate(-6deg)">${cup({ w: 196 })}</div>
      <div class="a-stk kr" style="left:96px;top:318px;font-size:30px;transform:rotate(-3deg)">1 аяга кофе</div>
      <svg class="abs" style="left:358px;top:120px" width="170" height="140">${marker('M18 52 C50 44 96 48 150 40', { w: 14 })}${marker('M22 100 C60 92 104 96 146 88', { w: 14 })}</svg>
      <div class="abs die" style="left:592px;top:52px;transform:rotate(5deg)">${notebook(196)}</div>
      <div class="a-stk or" style="left:600px;top:318px;font-size:30px;transform:rotate(3deg)">англи хэл</div>
    </div>${cap(m.cap)}`,

  // 2. why online: the three reasons on ruled paper, each struck through by hand, then the ОНЛАЙН stamp slams on
  2: (m) => `${brand()}
    <div class="a-paper" style="left:70px;top:258px;width:940px;height:440px;transform:rotate(1deg)"><div class="margin"></div>
      ${tape(640, -24, 5, 'or')}
      ${PAINS.map(([ic, t], i) => `<div class="abs" style="left:100px;top:${46 + i * 120}px;display:flex;align-items:center;gap:24px">
        <span style="width:84px;height:84px;border-radius:50%;background:var(--navy);display:grid;place-items:center;box-shadow:5px 6px 0 var(--orange)">${icon(ic, { s: 46, c: '#fff' })}</span>
        <span style="font:800 40px Manrope;color:var(--navy);letter-spacing:-.5px">${t}</span></div>`).join('')}
      <svg class="abs" style="left:190px;top:0" width="720" height="440">${[0, 1, 2].map((i) => marker(`M10 ${90 + i * 120} C160 ${84 + i * 120 + (i % 2) * 8} 330 ${94 + i * 120} ${[468, 390, 470][i]} ${86 + i * 120}`, { w: 8 })).join('')}</svg>
      ${stamp('ОНЛАЙН', 'СУРГАЛТ', { x: 470, y: 268, r: -10, s: 0.82 })}
    </div>${cap(m.cap, { tilt: 1.5 })}`,

  // 3. schedule: the week on paper, Tuesday, Thursday and Saturday circled in orange marker
  3: (m) => `${brand()}
    <div class="a-paper" style="left:70px;top:270px;width:940px;height:400px;transform:rotate(-1deg)"><div class="margin"></div>
      ${tape(110, -24, -7)}${tape(690, -22, 6, 'or')}
      ${coffeeRing({ x: 860, y: 330, r: 58, o: 0.26, seed: 5 })}
      <div class="abs" style="left:100px;top:34px;display:flex;align-items:center;gap:16px"><span style="color:var(--orange)">${icon('cal', { s: 52, w: 2.6 })}</span>
        <span class="uni" style="font:900 46px Unbounded;color:var(--navy)">Хуваарь</span><span class="a-stk kr" style="position:relative;font-size:26px;padding:6px 16px;transform:rotate(3deg);margin-left:10px">онлайн</span></div>
      <div class="abs" style="left:96px;top:150px;display:flex;gap:14px">${DAYS.map((d, i) => {
        const on = ON.includes(i);
        return `<div style="position:relative;box-sizing:border-box;width:100px;height:150px;border-radius:16px;background:${on ? 'var(--navy)' : '#fff'};border:4px solid var(--navy);box-shadow:${on ? '6px 7px 0 var(--orange)' : 'none'};
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;transform:rotate(${on ? [-4, 3, -3][ON.indexOf(i)] : 0}deg)">
          <span class="uni" style="font:900 40px Unbounded;color:${on ? '#fff' : 'var(--navy)'}">${d}</span>
          ${on ? `<span style="font:800 20px Manrope;color:#ffb27f">хичээл</span>` : '<span style="height:24px"></span>'}</div>`;
      }).join('')}</div>
      <svg class="abs" style="left:0;top:0" width="940" height="400">${ON.map((i) => { const cx = 96 + i * 114 + 50;
        return marker(`M${cx - 6} ${132} C${cx + 74} ${126} ${cx + 82} ${318} ${cx - 2} ${322} C${cx - 82} ${326} ${cx - 86} ${140} ${cx + 10} ${128}`, { w: 7 }); }).join('')}</svg>
    </div>${cap(m.cap)}`,

  // 4. the 3+1 offer as a café loyalty card: three months stamped, the fourth free
  4: (m) => `${brand()}
    <div class="abs" style="left:70px;top:268px;width:940px;height:420px;transform:rotate(-2deg);background:#d8b88c;border:5px solid var(--navy);border-radius:26px;
      box-shadow:10px 12px 0 var(--navy),var(--lift);background-image:radial-gradient(rgba(122,74,38,.16) 1.4px,transparent 1.6px);background-size:14px 14px">
      ${tape(40, -24, -9, 'or')}
      <div class="abs" style="left:20px;top:20px;right:20px;bottom:20px;border:3px dashed rgba(20,41,90,.55);border-radius:18px"></div>
      <div class="abs" style="left:50px;top:42px;display:flex;align-items:center;gap:16px">
        <span style="width:64px;height:64px;border-radius:50%;background:#fff url(assets/hml-tree.png) center/78% no-repeat;border:4px solid var(--navy)"></span>
        <span class="uni" style="font:900 40px Unbounded;color:var(--navy)">3+1 карт</span></div>
      <div class="abs" style="right:52px;top:52px;font:800 28px Manrope;color:var(--navy)">3 сараар бүртгүүлээд</div>
      ${[0, 1, 2].map((i) => `<div class="abs" style="left:${56 + i * 196}px;top:150px;width:170px;height:170px;border-radius:50%;background:#f8f2e4;border:4px solid var(--navy);display:grid;place-items:center">
        <svg width="150" height="150" viewBox="0 0 150 150" style="transform:rotate(${[-14, 8, -6][i]}deg)"><defs><filter id="rs${i}"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${i + 2}"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.9"/><feComposite in="SourceGraphic" operator="in"/></filter></defs>
          <g filter="url(#rs${i})" fill="#ff5a1a" stroke="#ff5a1a"><circle cx="75" cy="75" r="64" fill="none" stroke-width="7"/>
          <text x="75" y="88" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="44" stroke="none">${i + 1}</text>
          <text x="75" y="118" text-anchor="middle" font-family="Unbounded" font-weight="800" font-size="18" stroke="none">САР</text></g></svg></div>`).join('')}
      <div class="abs" style="left:640px;top:126px;width:230px;height:230px;border-radius:50%;background:var(--orange);border:5px solid var(--navy);box-shadow:7px 8px 0 var(--navy);display:grid;place-items:center;transform:rotate(6deg)">
        <div style="text-align:center;color:#fff"><div class="uni" style="font:900 74px/1 Unbounded">+1</div><div style="font:800 30px Manrope">сар</div></div></div>
      <div class="a-stk" style="left:668px;top:330px;font:900 34px Unbounded;transform:rotate(-7deg)">ҮНЭГҮЙ</div>
    </div>${cap(m.cap, { tilt: 1.5 })}`,
};
