// HML olympiad Reel: graphic components as HTML strings, shared by the style frames and the edit.
// The "HML notebook" look: notebook paper, stickers, washi tape, rubber stamps and hard shadows. Coordinates are page pixels on the 1080x1920 stage.

export const clamp = (x) => Math.max(0, Math.min(1, x));
export const backOut = (u, k = 2.2) => { u = clamp(u); return 1 + (k + 1) * (u - 1) ** 3 + k * (u - 1) ** 2; };
export const easeOut = (u) => 1 - (1 - clamp(u)) ** 3;
const pop = (u) => `transform:scale(${backOut(u).toFixed(3)});opacity:${clamp(u * 4).toFixed(2)}`;
export const CAP_Y = 1232;          // captions sit on the sweater just under her chin, above the Reels caption area

export const footage = (src, { s = 1, x = 0, y = 0, r = 0, blur = 0 } = {}) =>
  `<div class="footage" style="background-image:url(${src});transform:translate(${x}px,${y}px) scale(${s}) rotate(${r}deg);${blur ? `filter:blur(${blur}px) contrast(1.07) saturate(1.06);` : ''}"></div><div class="grade"></div>`;

export const brand = () => `<div class="bookmark"><span class="coin"></span><span class="t">HML</span></div>`;

// a sticker caption: words with *key* marked in asterisks get the orange squiggle; captions alternate a slight tilt
const kw = (t) => t.replace(/\*(.+?)\*/g, '<span class="kw">$1</span>');
export const cap = (text, { y = CAP_Y, small = false, tilt = -1.5 } = {}) =>
  `<div class="cap ${small ? 'cap-small' : ''}" style="top:${y}px;transform:translateX(-50%) rotate(${tilt}deg)">${kw(text)}</div>`;
export const twoTier = (small, big, { y = CAP_Y - 50 } = {}) =>
  `${cap(small, { y, small: true, tilt: 2 })}<div class="ticket-wrap" style="top:${y + 86}px;transform:translateX(-50%) rotate(-3deg)"><div class="ticket">${big}</div></div>`;

// ---------------------------------------------------------------- icons
const medalSvg = (n = '', { size = 150 } = {}) => `
<svg width="${size}" height="${size * 1.25}" viewBox="0 0 120 150">
  <path d="M30 0h22l14 52H44z" fill="#14295a"/><path d="M68 0h22L76 52H54z" fill="#4ea3ff"/>
  <circle cx="60" cy="96" r="44" fill="#ffb02e" stroke="#14295a" stroke-width="5"/>
  <circle cx="60" cy="96" r="32" fill="#ff8c3a" stroke="#14295a" stroke-width="3"/>
  <text x="60" y="110" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="36" fill="#fff" stroke="#14295a" stroke-width="2" paint-order="stroke">${n}</text>
</svg>`;
export const medal = medalSvg;
const phoneIcon = (c = '#fff', s = 46) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path fill="${c}" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>`;
const sendIcon = `<svg width="40" height="40" viewBox="0 0 24 24"><path fill="#fff" d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2z"/></svg>`;
// a hand-drawn orange check mark, drawn on with p 0..1
const handCheck = (p = 1, s = 84) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40"><path d="M6 21 C10 24 13 28 16 33 C21 22 27 13 36 5" fill="none" stroke="#ff6a2b" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - p}"/></svg>`;
const tape = (x, y, r = -6, cls = '') => `<div class="tape ${cls}" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)"></div>`;

// ---------------------------------------------------------------- cards on notebook paper
// "today to olympiad": a dashed hand-drawn route, month stamps filling orange
export const timelineCard = ({ fill = 0.66, y = 260 } = {}) => {
  const pts = [[200, 170], [400, 150], [600, 165], [800, 140]], marks = [[1, '1'], [2, '3'], [3, '6']];
  return `<div class="paper" style="left:80px;top:${y}px;width:900px;height:290px;transform:rotate(-1.5deg)"><div class="margin"></div>
    ${tape(360, -26, -4)}
    <div class="abs label" style="left:96px;top:24px;font-size:30px">Бэлтгэлийн хугацаа</div>
    <svg class="abs" style="left:0;top:0" width="900" height="290"><path d="M150 175 C300 120 380 200 520 160 S720 120 760 150" fill="none" stroke="#14295a" stroke-width="5" stroke-dasharray="14 12" stroke-linecap="round"/>
      <path d="M150 175 C300 120 380 200 520 160 S720 120 760 150" fill="none" stroke="#ff6a2b" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - fill}"/></svg>
    <div class="stk" style="left:84px;top:196px;font-size:28px;transform:rotate(-3deg)">Өнөөдөр</div>
    <div class="stk or" style="left:700px;top:178px;font-size:30px;transform:rotate(4deg)">Олимпиад 🏅</div>
    ${marks.map(([i, m], k) => { const x = [258, 448, 638][k], on = (k + 1) / 3 <= fill + 0.01;
      return `<div class="abs uni" style="left:${x}px;top:${[106, 112, 82][k]}px;width:96px;height:96px;border-radius:50%;display:grid;place-items:center;font-size:26px;font-weight:800;line-height:1.05;text-align:center;
        border:5px solid var(--navy);background:${on ? 'var(--orange)' : 'var(--paper)'};color:${on ? '#fff' : 'var(--navy)'};transform:rotate(${[-8, 6, -4][k]}deg)">${m}<br><span style="font:800 18px Manrope">сар</span></div>`; }).join('')}
  </div>`;
};

// one medal crossed out by hand (cross 0..1), then four medals popping on (pops: four 0..1 values)
export const medalFan = ({ y = 250, cross = 1, pops = [1, 1, 1, 1] } = {}) => `
  <div class="paper" style="left:80px;top:${y}px;width:900px;height:300px;transform:rotate(1deg)"><div class="margin"></div>
    ${tape(620, -24, 5, 'orange')}
    <div class="abs" style="left:96px;top:56px;opacity:${1 - 0.45 * cross}">${medalSvg('1', { size: 120 })}</div>
    <svg class="abs" style="left:80px;top:70px" width="160" height="160"><path d="M20 20 L140 140" stroke="#ff6a2b" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - clamp(cross * 2)}"/>
      <path d="M140 20 L20 140" stroke="#ff6a2b" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - clamp(cross * 2 - 1)}"/></svg>
    <div class="abs uni" style="left:250px;top:96px;font-size:70px;font-weight:900;opacity:${clamp(pops[0] * 3)}">→</div>
    ${[0, 1, 2, 3].map((i) => `<div class="abs" style="left:${355 + i * 132}px;top:${40 + Math.abs(i - 1.5) * 16}px;transform:rotate(${(i - 1.5) * 9}deg)"><div style="${pop(pops[i])};transform-origin:50% 70%">${medalSvg(String(i + 1), { size: 116 })}</div></div>`).join('')}
  </div>`;

// one preparation, four olympiads: the HML tree drawn on paper; p 0..1 draws the branches, then the medals pop
export const treeDiagram = ({ y = 240, p = 1 } = {}) => {
  const tips = [[180, 120], [400, 60], [620, 60], [840, 120]], d = clamp(p * 1.6);
  return `<div class="paper" style="left:60px;top:${y}px;width:960px;height:520px;transform:scale(.82) rotate(-1deg);transform-origin:50% 0"><div class="margin"></div>
    ${tape(395, -26, -3)}
    <svg class="abs" style="left:0;top:0" width="960" height="520" viewBox="0 0 960 520">
      ${tips.map(([x, yy]) => `<path d="M480 420 C480 330 ${x} ${yy + 200} ${x} ${yy + 100}" fill="none" stroke="#14295a" stroke-width="16" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - d}"/><path d="M480 420 C480 330 ${x} ${yy + 200} ${x} ${yy + 100}" fill="none" stroke="#ff8c3a" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - d}"/>`).join('')}
      ${[[330, 300], [630, 300], [480, 330]].map(([x, yy], k) => `<g transform="translate(${x} ${yy}) scale(${backOut(p * 2.2 - 0.8 - k * 0.1).toFixed(3)})">${[0, 1, 2, 3, 4].map((j) => `<circle cx="${Math.cos(j * 1.2566) * 13}" cy="${Math.sin(j * 1.2566) * 13}" r="11" fill="#4ea3ff" stroke="#14295a" stroke-width="3"/>`).join('')}<circle r="8" fill="#ffb02e" stroke="#14295a" stroke-width="3"/></g>`).join('')}
    </svg>
    ${tips.map(([x, yy], i) => `<div class="abs" style="left:${x - 52}px;top:${yy - 10}px"><div style="${pop(p * 3 - 1.6 - i * 0.18)};transform-origin:50% 70%">${medalSvg(String(i + 1), { size: 104 })}</div></div>`).join('')}
    <div class="stk or" style="left:330px;top:410px;font-size:36px;transform:rotate(-2deg)">1 бэлтгэл</div>
    <div class="abs label" style="right:40px;top:440px;font-size:30px;opacity:${clamp(p * 3 - 2)}">= 4 олимпиад</div>
  </div>`;
};

// full-screen notebook page: graph paper, her face as a taped round photo, the olympiads as a hand-ticked list
// tiles: four {ent, tick} values 0..1 (ent 0 = not on the page yet)
const photo = (src, { x, y, d, r = 4, shadow = 'var(--orange)' }) => `
  <div class="abs" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;border:9px solid #fff;box-shadow:10px 12px 0 ${shadow},var(--lift);overflow:hidden;transform:rotate(${r}deg)">
    <img src="${src}" style="position:absolute;left:50%;top:0;height:${Math.round(d * 2.3)}px;transform:translate(-50%,${-Math.round(d * 0.62)}px)"></div>`;
export const notebookScene = (src, { tiles = [{ ent: 1, tick: 1 }, { ent: 1, tick: 1 }, { ent: 1, tick: 1 }, { ent: 0.5, tick: 0 }], top = 520, gap = 210, badge = 1 } = {}) => {
  const names = ['SOF', 'SILVERZONE', 'HIPPO', 'USA Olympiad'];
  return `<div class="layer" style="background:#f8f2e4;background-image:linear-gradient(var(--sky-soft) 2px,transparent 2px),linear-gradient(90deg,var(--sky-soft) 2px,transparent 2px);background-size:54px 54px;background-position:-2px 18px"></div>
  <div class="abs" style="left:110px;top:0;bottom:0;width:4px;background:rgba(255,106,43,.5)"></div>
  <div class="abs" style="left:560px;top:1300px;width:620px;height:660px;background:url(assets/hml-tree.png) center/contain no-repeat;opacity:.09"></div>
  <div style="${pop(badge)};transform-origin:830px 320px;position:absolute;inset:0">${photo(src, { x: 690, y: 170, d: 290 })}${tape(760, 150, 12)}</div>
  <div class="stk" style="left:150px;top:230px;font:900 50px/1.15 Unbounded;padding:16px 28px 20px;transform:rotate(-3deg)">Олон улсын<br>олимпиадууд</div>
  ${names.map((n, i) => {
    const { ent, tick } = tiles[i];
    if (ent <= 0) return '';
    const sc = backOut(ent), r = (i % 2 ? 1.2 : -1.2) + (1 - clamp(ent)) * 10;
    return `<div class="abs" style="left:150px;top:${top + i * gap}px;width:860px;height:180px;display:flex;align-items:center;gap:30px;transform-origin:430px 90px;
      transform:rotate(${r.toFixed(2)}deg) scale(${(0.6 + 0.4 * sc).toFixed(3)});opacity:${clamp(ent * 4).toFixed(2)}">
      <div style="flex:none;width:96px;height:96px;border-radius:50%;background:var(--navy);color:#fff;display:grid;place-items:center;font:900 44px Unbounded;box-shadow:6px 7px 0 var(--orange)">${i + 1}</div>
      <div style="flex:1;position:relative;background:#fff;border:5px solid var(--navy);border-radius:20px;padding:22px 30px;box-shadow:8px 9px 0 var(--navy)">
        <span class="uni" style="font-size:${n.length > 10 ? 50 : 60}px;font-weight:900;letter-spacing:-1px">${n}</span>
        <span class="abs" style="right:14px;top:6px">${tick > 0 ? handCheck(tick, 96) : ''}</span></div></div>`;
  }).join('')}`;
};

// emphasis: a scrolling ribbon band across the top and an HML rubber stamp slammed onto the corner
export const ribbon = ({ y = 250, shift = 0 } = {}) => {
  const t = 'ОЛИМПИАДЫН БЭЛТГЭЛ ✦ HML ACADEMY ✦ ';
  return `<div class="abs" style="left:-200px;top:${y}px;width:1500px;height:96px;background:var(--navy);transform:rotate(-7deg);box-shadow:0 10px 0 var(--orange),var(--lift);overflow:hidden;border-top:4px solid #fff;border-bottom:4px solid #fff">
    <div style="white-space:nowrap;font:900 44px/88px Unbounded;color:#fff;transform:translateX(${-shift}px)">${t.repeat(4).replace(/✦/g, '<span style="color:#ff8c3a">✦</span>')}</div></div>`;
};
export const stamp = ({ x = 690, y = 420, s = 1, o = 1 } = {}) => `
  <svg class="abs" style="left:${x}px;top:${y}px;opacity:${o};transform:rotate(-14deg) scale(${s});filter:drop-shadow(0 6px 10px rgba(0,0,0,.25))" width="330" height="330" viewBox="0 0 330 330">
    <defs><filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.9"/><feComposite in="SourceGraphic" operator="in"/></filter>
      <path id="ring" d="M165 165 m-122 0 a122 122 0 1 1 244 0 a122 122 0 1 1 -244 0"/></defs>
    <g filter="url(#rough)" fill="#ff5a1a" stroke="#ff5a1a" opacity=".92">
      <circle cx="165" cy="165" r="156" fill="none" stroke-width="10"/><circle cx="165" cy="165" r="98" fill="none" stroke-width="6"/>
      <text font-family="Unbounded" font-weight="900" font-size="30" letter-spacing="3" stroke="none"><textPath href="#ring">HML ACADEMY ✦ OLYMPIAD PREP ✦</textPath></text>
      <text x="165" y="182" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="58" stroke="none">HML</text>
    </g></svg>`;

// split-flap phone numbers; flipped = how many digits have landed (fractions show the digit mid-flip)
export const phoneBoard = ({ flipped = 99, y = 200, left = 70, scale = 1 } = {}) => {
  const nums = ['9930 4451', '8888 3351']; let k = 0;
  const row = (n) => [...n].map((c) => {
    if (c === ' ') return '<span class="flap gap"></span>';
    const f = clamp(flipped - k++);
    return f >= 1 ? `<span class="flap">${c}</span>` : f <= 0 ? '<span class="flap" style="background:#2a3f72;color:transparent"></span>'
      : `<span class="flap" style="background:#1d3366"><span style="display:block;transform:scaleY(${Math.abs(Math.cos(f * Math.PI)).toFixed(3)})">${f > 0.5 ? c : String((c.charCodeAt(0) + 3) % 10)}</span></span>`;
  }).join('');
  return `<div class="paper" style="left:${left}px;top:${y}px;width:940px;height:380px;transform:rotate(-1deg) scale(${scale});transform-origin:50% 0"><div class="margin"></div>
    ${tape(70, -24, -8, 'orange')}${tape(720, -22, 6)}
    <div class="abs" style="left:96px;top:26px;display:flex;align-items:center;gap:14px"><span style="width:64px;height:64px;border-radius:50%;background:var(--orange);border:4px solid var(--navy);display:grid;place-items:center">${phoneIcon('#fff', 34)}</span><span class="label">Утасны дугаар</span></div>
    <div class="stk or" style="right:26px;top:24px;font-size:30px;transform:rotate(6deg)">доор ↓</div>
    <div class="abs" style="left:96px;top:116px">${row(nums[0])}</div>
    <div class="abs" style="left:96px;top:240px">${row(nums[1])}</div>
  </div>`;
};
// the message sticker tucks under the board's lower edge, above her eyes
export const chatSticker = ({ y = 478 } = {}) => `
  <div class="abs" style="left:330px;top:${y}px;transform:rotate(2deg)">
    <div class="stk sky" style="position:relative;display:flex;align-items:center;gap:20px;font:900 46px Unbounded;padding:18px 20px 18px 34px;border-radius:40px 40px 40px 10px">💬 Мессеж бичих
      <span style="width:76px;height:76px;border-radius:50%;background:var(--navy);display:grid;place-items:center">${sendIcon}</span></div></div>`;

// the 3 + 1 offer: tear-off calendar pages, then the orange gift page
const calPage = (x, top, label, sub, r, orange = false) => `
  <div class="abs" style="left:${x}px;top:${top}px;width:190px;height:230px;background:${orange ? 'var(--orange)' : 'var(--paper)'};border:5px solid var(--navy);border-radius:18px;box-shadow:8px 9px 0 ${orange ? 'var(--navy)' : 'var(--orange)'};transform:rotate(${r}deg);overflow:hidden">
    <div style="height:54px;background:var(--navy);display:flex;justify-content:space-around;align-items:center"><span style="width:16px;height:16px;border-radius:50%;background:var(--paper)"></span><span style="width:16px;height:16px;border-radius:50%;background:var(--paper)"></span></div>
    <div style="text-align:center;color:${orange ? '#fff' : 'var(--navy)'}"><div class="uni" style="font-size:${orange ? 72 : 80}px;font-weight:900;line-height:1.15">${label}</div><div style="font:800 28px Manrope">${sub}</div></div></div>`;
// pages: three 0..1 drop values; plus, gift, free: 0..1
export const offerCard = ({ y = 200, pages = [1, 1, 1], plus = 1, gift = 1, free = 1 } = {}) => {
  const drop = (u, x, top, html) => u <= 0 ? '' : `<div class="abs" style="left:0;top:0;transform:translateY(${((1 - easeOut(u)) * -260).toFixed(1)}px);opacity:${clamp(u * 5)}">${html}</div>`;
  return `<div class="abs" style="left:0;top:${y}px;width:1080px;height:330px">
    ${drop(pages[0], 0, 0, calPage(40, 50, '1', 'сар', -5))}${drop(pages[1], 0, 0, calPage(240, 30, '2', 'сар', 3))}${drop(pages[2], 0, 0, calPage(440, 54, '3', 'сар', -2))}
    <div class="abs uni" style="left:650px;top:120px;font-size:84px;font-weight:900;color:#fff;-webkit-text-stroke:12px var(--ink);paint-order:stroke fill;${pop(plus)};transform-origin:50% 50%">+</div>
    ${gift > 0 ? `<div class="abs" style="left:730px;top:0;transform:rotate(${(7 + (1 - clamp(gift)) * 25).toFixed(1)}deg) scale(${backOut(gift).toFixed(3)});transform-origin:95px 115px;opacity:${clamp(gift * 4)}">${calPage(0, 0, '+1', 'сар', 0, true)}
      ${free > 0 ? `<div class="stk" style="left:-26px;top:236px;font:900 34px Unbounded;transform:rotate(-8deg) scale(${backOut(free).toFixed(3)});opacity:${clamp(free * 4)}">ҮНЭГҮЙ</div>` : ''}</div>` : ''}
  </div>`;
};

export const endCard = (src, { logo = 1, board = 1, stickers = 1, face = 1 } = {}) => `
  <div class="layer" style="background:#f8f2e4;background-image:linear-gradient(var(--sky-soft) 2px,transparent 2px),linear-gradient(90deg,var(--sky-soft) 2px,transparent 2px);background-size:54px 54px"></div>
  <div style="position:absolute;inset:0;transform-origin:540px 520px;${pop(logo)}">
    <div class="abs" style="left:190px;top:200px;width:700px;height:640px;background:#fff url(assets/hml-logo.png) 50% 46%/104% no-repeat;border:6px solid var(--navy);border-radius:26px;box-shadow:12px 14px 0 var(--orange),var(--lift);transform:rotate(-2deg)"></div>
    ${tape(250, 176, -10)}${tape(680, 180, 9, 'orange')}</div>
  <div style="position:absolute;inset:0;transform-origin:540px 1120px;${pop(board)}">${phoneBoard({ y: 930, left: 70 })}</div>
  <div class="abs" style="left:110px;top:1360px;display:flex;gap:26px;align-items:center;transform-origin:200px 40px;${pop(stickers)}">
    <div class="stk sky" style="position:relative;font:900 38px Unbounded;padding:14px 28px;transform:rotate(-3deg)">@hml_english</div>
    <div class="stk or" style="position:relative;font:900 38px Unbounded;padding:14px 28px;transform:rotate(3deg)">3+1</div></div>
  <div style="position:absolute;inset:0;transform-origin:885px 1545px;${pop(face)}">${photo(src, { x: 770, y: 1430, d: 230, r: -5 })}</div>`;

// the HML tree's branches, grown from the lower corners: three limbs, two forks each, a flower at every tip
function branches() {
  const out = [], rnd = ((s) => () => (s = (s * 16807) % 2147483647) / 2147483647)(11);
  const grow = (x, y, a, len, w, depth) => {
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len, mx = x + Math.cos(a + 0.3) * len * 0.55, my = y + Math.sin(a + 0.3) * len * 0.55;
    out.push({ x, y, mx, my, x2, y2, w, depth });
    if (depth < 2) [-0.5, 0.42].forEach((da) => grow(x2, y2, a + da + (rnd() - 0.5) * 0.3, len * (0.66 + rnd() * 0.12), w * 0.66, depth + 1));
  };
  grow(-60, 2000, -1.0, 760, 54, 0); grow(560, 2040, -1.62, 700, 50, 0); grow(1140, 1960, -2.25, 740, 52, 0);
  return out;
}
const BR = branches();
const qpt = (b, t) => [(1 - t) ** 2 * b.x + 2 * (1 - t) * t * b.mx + t * t * b.x2, (1 - t) ** 2 * b.y + 2 * (1 - t) * t * b.my + t * t * b.y2];
const circ = (cx, cy, r) => r <= 0.5 ? '' : `M${(cx - r).toFixed(1)} ${cy.toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2 * r).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2 * r).toFixed(1)} 0Z`;
// p 0..1: branches draw on, flowers pop at the tips and bloom open, the next scene shows through the blooms
export const bloomParts = (p) => {
  const vis = (b) => Math.max(0, Math.min(1, p * 3.2 - b.depth * 0.7));
  const bloom = (b) => Math.max(0, vis(b) - 0.85) / 0.15;
  let clip = '';
  BR.forEach((b) => { const v = vis(b); if (v <= 0.02) return; for (let t = 0; t <= v; t += 0.04) { const [cx, cy] = qpt(b, t); clip += circ(cx, cy, b.w * 0.8 + 420 * Math.max(0, p - 0.25)); } });
  BR.filter((b) => b.depth === 2).forEach((b) => { clip += circ(b.x2, b.y2, bloom(b) * 120 + 900 * Math.max(0, p - 0.55)); });
  clip += circ(540, 1200, 2400 * Math.max(0, (p - 0.75) / 0.25) ** 1.5);
  const fade = p < 0.8 ? 1 : Math.max(0, (1 - p) / 0.2);
  const lines = `<svg class="layer" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><linearGradient id="bw" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#f0561e"/><stop offset="1" stop-color="#ffc93c"/></linearGradient>
    <filter id="sh"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0b1633" flood-opacity=".45"/></filter></defs><g opacity="${fade}" filter="url(#sh)">${
    BR.map((b) => `<path d="M${b.x} ${b.y} Q${b.mx} ${b.my} ${b.x2} ${b.y2}" fill="none" stroke="url(#bw)" stroke-width="${b.w * 0.5}" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - vis(b)}"/>`).join('')}${
    BR.filter((b) => b.depth >= 1 && vis(b) > 0.85).map((b) => { const s = Math.min(1, bloom(b) * 1.4) * (b.depth === 2 ? 46 : 32);
      return `<g transform="translate(${b.x2.toFixed(0)} ${b.y2.toFixed(0)}) rotate(${b.depth * 20})">${[0, 1, 2, 3, 4].map((k) => `<ellipse cx="${(Math.cos(k * 1.2566) * s * 0.85).toFixed(1)}" cy="${(Math.sin(k * 1.2566) * s * 0.85).toFixed(1)}" rx="${(s * 0.62).toFixed(1)}" ry="${(s * 0.5).toFixed(1)}" transform="rotate(${k * 72} ${(Math.cos(k * 1.2566) * s * 0.85).toFixed(1)} ${(Math.sin(k * 1.2566) * s * 0.85).toFixed(1)})" fill="#ffc93c"/>`).join('')}<circle r="${(s * 0.42).toFixed(1)}" fill="#f0561e"/></g>`; }).join('')}</g></svg>`;
  return { clip: clip || 'M0 0Z', lines };
};
export const bloomWipe = (fromHtml, toHtml, p) => {
  const { clip, lines } = bloomParts(p);
  return `<div class="layer">${fromHtml}</div><div class="layer" style="clip-path:path('${clip}')">${toHtml}</div>${lines}`;
};


// the comic shout from behind the camera
export const speedLines = () => `<svg class="layer" viewBox="0 0 1080 1920">${[...Array(64)].map((_, i) => {
  const a = (i / 64) * Math.PI * 2, r0 = 520 + (i % 3) * 60, r1 = 1500, cx = 540, cy = 760, w = 0.012 + (i % 4) * 0.006;
  return `<path d="M${cx + Math.cos(a - w) * r1} ${cy + Math.sin(a - w) * r1} L${cx + Math.cos(a) * r0} ${cy + Math.sin(a) * r0} L${cx + Math.cos(a + w) * r1} ${cy + Math.sin(a + w) * r1}Z" fill="${i % 2 ? 'rgba(255,255,255,.55)' : 'rgba(15,33,71,.35)'}"/>`;
}).join('')}</svg>`;
export const shout = (lines, { y = 150 } = {}) => `
  <div class="abs" style="left:0;top:${y}px;width:1080px;transform:rotate(-5deg)">
    ${lines.map((l, i) => `<div class="comic" style="position:relative;left:${[-30, 40, -10, 20][i % 4]}px;margin-top:${i ? -6 : 0}px;font-size:${l.size || 96}px;transform:rotate(${[-2, 3, -3, 2][i % 4]}deg)">${l.t}</div>`).join('')}
  </div>
  <div class="stk sky" style="right:30px;top:${y - 80}px;font-size:30px;transform:rotate(4deg)">📣 камерын цаанаас →</div>`;


export const confetti = (seed = 3, n = 40, u = 1) => {
  let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return [...Array(n)].map(() => {
    const x0 = 540 + (r() - 0.5) * 300, vx = (r() - 0.5) * 1500, vy = -600 - r() * 900, spin = (r() - 0.5) * 900, w = 10 + r() * 16, h = 6 + r() * 10, c = ['#ff6a2b', '#14295a', '#4ea3ff', '#fff', '#ffb02e'][Math.floor(r() * 5)];
    const x = x0 + vx * u * (1 - u * 0.25), y = 420 + vy * u + 1100 * u * u;
    return y > 1900 ? '' : `<div class="abs" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${w}px;height:${h}px;border-radius:3px;background:${c};transform:rotate(${(spin * u).toFixed(0)}deg) scaleX(${Math.cos(u * 9 + w).toFixed(2)});box-shadow:0 0 0 1.5px rgba(20,41,90,.25)"></div>`;
  }).join('');
};
