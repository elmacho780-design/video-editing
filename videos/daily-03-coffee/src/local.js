// "Say It Like a Local": the format pieces for this phrases series (Days 3, 10, 17, 24), built on the paper-cut look (paper.js).
// - bubble(): a cut-paper speech bubble that pops out from its tail. The other person is on the left (cream), you are on the right
//   (amber, like every English tile in the series); a wrong line is pink and gets a red strip and ✗.
// - cup(): Day 3's paper cup, which builds with the order: latte art, the size, the lid and sleeve, steam.
// - receipt(): the recap, a paper receipt that prints the phrases line by line, and a red "save this" ink stamp.
import * as P from './paper.js';
const { clamp, easeOut, easeIn, backOut } = P;

export const css = `
.bub { position: absolute; max-width: 720px; box-sizing: border-box; padding: 22px 34px 26px; border-radius: 34px; color: #14295a;
  font: 800 58px/1.14 Montserrat; letter-spacing: -.5px; background-color: #f6eedc; }
.bub.l { left: 140px; border-bottom-left-radius: 8px; transform-origin: 0 100%; }
.bub.r { right: 140px; border-bottom-right-radius: 8px; transform-origin: 100% 100%; background-color: #ffb02e; }
.bub.bad { background-color: #ffd2c8; color: #6b4040; }
.bub::after { content: ''; position: absolute; bottom: 0; width: 34px; height: 34px; background: inherit; }
.bub.l::after { left: -20px; clip-path: polygon(100% 0, 100% 100%, 0 100%); }
.bub.r::after { right: -20px; clip-path: polygon(0 0, 100% 100%, 0 100%); }
.who { position: absolute; top: -46px; font: 700 34px/1 Manrope; color: #f6eedc; opacity: .8; white-space: nowrap; }
.bub.l .who { left: 8px; } .bub.r .who { right: 8px; }
.kw { color: #ff6a2b; }
.bub.r .kw { color: #14295a; text-decoration: underline; text-decoration-color: #ff6a2b; text-decoration-thickness: 7px; text-underline-offset: 7px; }
.receipt { position: absolute; background-color: #fffaf0; color: #14295a; box-sizing: border-box; }
.rline { position: absolute; left: 40px; white-space: nowrap; font: 800 38px/1 Montserrat; letter-spacing: -.3px; }
.menu { position: absolute; background-color: #f6eedc; color: #14295a; border-radius: 14px; box-sizing: border-box; }
.mi { position: absolute; left: 36px; font: 800 46px/1 Montserrat; white-space: nowrap; }
.rline b { color: #ff6a2b; margin-right: 14px; }
.dash { position: absolute; left: 36px; right: 36px; height: 0; border-top: 4px dashed #14295a; opacity: .35; }
.inkstamp { position: absolute; border: 7px solid #e2412f; border-radius: 16px; color: #e2412f; font: 900 50px/1 Montserrat; letter-spacing: 1px;
  padding: 14px 24px 16px; white-space: nowrap; mix-blend-mode: multiply; }
`;

// ---------------------------------------------------------------- speech bubbles
// side 'l' (them) or 'r' (you); e: pop in, xo: lift away; strike / cross / tick: progress of the red strip, ✗ and ✓; extra: html inside
export const bubble = ({ side = 'r', who = '', text, html = null, cls = '', y, e = 1, xo = 0, t = 0, seed = 0, strike = -1, cross = -1, tick = -1, extra = '' }) => {
  if (e <= 0 || xo >= 1) return '';
  const k = Math.floor(t * 8 + seed * 3.7), jr = e >= 1 ? 0.4 * Math.sin(k * 2.3 + seed * 11) : 0;
  const sc = 0.3 + 0.7 * backOut(e, 2.0), rot = (side === 'l' ? -1 : 1) * (1.2 + 6 * (1 - easeOut(e))) + jr;
  const st = `top:${y}px;transform:translateY(${(-180 * easeIn(xo)).toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)});opacity:${(clamp(e * 4) * (1 - easeIn(xo))).toFixed(3)}`;
  const strip = strike > 0 ? `<div style="position:absolute;left:24px;right:24px;top:46%;height:14px;background:#e2412f;transform:rotate(-3deg) scaleX(${easeOut(strike).toFixed(3)});transform-origin:0 50%"></div>` : '';
  const mark = (kind, u) => u > 0 ? `<div style="position:absolute;right:-34px;top:-78px;width:200px;height:200px;transform:scale(.55);transform-origin:100% 0">${P.stamp({ kind, x: 0, y: 0, u })}</div>` : '';
  return `<div class="bub sheet depth ${side} ${cls}" style="${st}">${who ? `<div class="who">${who}</div>` : ''}${html ?? text}${strip}${mark('x', cross)}${mark('tick', tick)}${extra}</div>`;
};

// ---------------------------------------------------------------- the cup
// cx, bottom: where it stands; s: overall scale; fill 0..1 (latte art), grow 0..1 (small to medium), lid, sleeve, steam 0..1
export const cup = ({ cx = 540, bottom = 880, s = 1, fill = 0, grow = 0, lid = 0, sleeve = 0, steam = 0, t = 0 }) => {
  const g = (0.8 + 0.2 * backOut(clamp(grow), 2.2)) * s, W = 260, H = 380;   // viewBox 0 -80 260 380; the cup stands on y 290 (370 px down)
  const empty = [207, 214, 227], latte = [190, 132, 82], f = easeOut(fill), col = empty.map((c, i) => Math.round(c + (latte[i] - c) * f));
  const lidY = -260 * (1 - backOut(clamp(lid), 1.6)), k = Math.floor(t * 8) % 3;
  const steamPaths = ['M100 20 C84 -8 110 -26 88 -58', 'M130 14 C114 -18 140 -38 116 -76', 'M160 20 C144 -8 170 -26 148 -58'];
  return `<svg class="abs depth" style="left:${(cx - W / 2).toFixed(1)}px;top:${(bottom - 370).toFixed(1)}px;overflow:visible;transform-origin:50% 97.4%;transform:scale(${g.toFixed(3)}) rotate(${[0, 0.6, -0.4][k]}deg)" width="${W}" height="${H}" viewBox="0 -80 ${W} ${H}">
    <path d="M20 60 L50 290 L210 290 L240 60 Z" fill="#f6eedc"/><path d="M130 60 L130 290 L210 290 L240 60 Z" fill="#e7dcc4"/>
    ${sleeve > 0 ? `<g style="transform:scaleY(${backOut(clamp(sleeve), 2).toFixed(3)});transform-origin:130px 180px"><path d="M33.6 145 L44.4 225 L215.6 225 L226.4 145 Z" fill="#ff6a2b"/>
      <text x="130" y="200" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="44" fill="#14295a" letter-spacing="2">HML</text></g>` : ''}
    <ellipse cx="130" cy="60" rx="112" ry="22" fill="#fffaf0"/><ellipse cx="130" cy="61" rx="100" ry="16" fill="rgb(${col.join(',')})"/>
    ${f > 0.4 ? `<path d="M130 74 C104 58 112 46 124 52 C128 54 130 57 130 57 C130 57 132 54 136 52 C148 46 156 58 130 74 Z" fill="#fff4e2" opacity="${clamp((f - 0.4) * 3).toFixed(2)}"/>` : ''}
    ${lid > 0 ? `<g transform="translate(0 ${lidY.toFixed(1)})"><path d="M14 64 L246 64 L240 46 L20 46 Z" fill="#fffaf0"/><path d="M34 46 C40 18 220 18 226 46 Z" fill="#f6eedc"/>
      <path d="M130 46 L226 46 C222 26 180 22 130 22 Z" fill="#e7dcc4"/><ellipse cx="166" cy="32" rx="16" ry="5" fill="#14295a"/></g>` : ''}
    ${steam > 0 ? steamPaths.map((d, i) => `<path d="${d}" transform="translate(${(4 * Math.sin(t * 5 + i * 2)).toFixed(1)} ${(lid > 0 ? -6 : 10)})" fill="none" stroke="#f6eedc" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${(1 - easeOut(clamp(steam - i * 0.15))).toFixed(3)}" opacity=".9"/>`).join('') : ''}
  </svg>`;
};
// the three sizes under the cup: S M L, one highlighted
export const sizes = ({ cx = 540, y = 888, e = 1, xo = 0, pick = -1, t = 0 }) => ['S', 'M', 'L'].map((s, i) => {
  const on = pick >= 0 && i === 1, u = on ? clamp(pick * 3) : 0, bump = on && pick < 1 ? 1 + 0.25 * Math.sin(Math.PI * clamp(pick)) : 1;
  return `<div class="abs" style="left:${cx - 120 + i * 90}px;top:${y}px;width:60px;height:60px;border-radius:50%;text-align:center;font:900 34px/60px Montserrat;
    background:${u > 0.5 ? '#ffb02e' : '#1d3a78'};color:${u > 0.5 ? '#14295a' : '#f6eedc'};${P.move({ e: e - i * 0.15, x: xo, t, seed: 60 + i, from: -80 })};scale:${bump.toFixed(3)}">${s}</div>`;
}).join('');

// ---------------------------------------------------------------- the receipt
const zig = (w, h, n = 22, d = 14) => { const pts = []; for (let i = 0; i <= n; i++) pts.push(`${(i * w / n).toFixed(1)}px ${i % 2 ? d : 0}px`);
  for (let i = n; i >= 0; i--) pts.push(`${(i * w / n).toFixed(1)}px ${h - (i % 2 ? d : 0)}px`); return `polygon(${pts.join(',')})`; };
// lines: [[qty, text]], lineT: when each prints; head: the shop name; stampU: the ink stamp's progress
export const receipt = ({ x = 140, y = 690, w = 780, h = 610, head = 'HML CAFÉ', sub = '', lines, lineT, t, e = 1, xo = 0, stamp = '', stampU = 0 }) => {
  if (e <= 0 || xo >= 1) return '';
  const fs = Math.min(38, ...lines.map(([q, s]) => Math.floor(38 * (w - 110) / (P.measure(`${q} ${s}`, 'en', 38) + 10))));
  let g = `<div class="receipt sheet depth" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;clip-path:${zig(w, h)};${P.move({ e, x: xo, t, seed: 70, r: -1.5, from: -300 })}">
    <div style="position:absolute;left:40px;top:44px;font:900 48px/1 Montserrat;letter-spacing:1px">${head}</div>
    <div style="position:absolute;left:42px;top:102px;font:700 28px/1 Manrope;opacity:.65">${sub}</div><div class="dash" style="top:150px"></div>`;
  lines.forEach(([q, s], i) => { const u = clamp((t - lineT[i]) / 0.18);
    if (u > 0) g += `<div class="rline" style="top:${180 + i * 72}px;font-size:${fs}px;opacity:${u.toFixed(3)};transform:translateX(${(-24 * (1 - easeOut(u))).toFixed(1)}px)"><b>${q}</b>${s}</div>`; });
  g += `<div class="dash" style="top:${180 + lines.length * 72 + 10}px"></div>`;
  if (stampU > 0) { const sc = stampU < 1 ? 1.7 - 0.7 * backOut(stampU, 2.4) : 1;
    g += `<div class="inkstamp" style="right:44px;bottom:34px;transform:rotate(-9deg) scale(${sc.toFixed(3)});opacity:${(clamp(stampU * 5) * 0.92).toFixed(3)}">${stamp}</div>`; }
  return g + '</div>';
};

// ---------------------------------------------------------------- the café menu card (sets the scene; what you order gets circled)
// items: [text]; circles: [[itemIndex or 'M', progress]]
const ring = (x, y, w, h, u) => u <= 0 ? '' : `<svg class="abs" style="left:${x - 14}px;top:${y - 14}px;overflow:visible" width="${w + 28}" height="${h + 28}">
  <ellipse cx="${(w + 28) / 2}" cy="${(h + 28) / 2}" rx="${(w + 16) / 2}" ry="${(h + 10) / 2}" fill="none" stroke="#ff6a2b" stroke-width="7" stroke-linecap="round"
    pathLength="1" stroke-dasharray="1" stroke-dashoffset="${(1 - easeOut(clamp(u))).toFixed(3)}" transform="rotate(-4 ${(w + 28) / 2} ${(h + 28) / 2})"/></svg>`;
export const menu = ({ x = 470, y = 600, w = 460, items, pick = -1, pickU = 0, sizeU = 0, e = 1, xo = 0, t = 0 }) => {
  if (e <= 0 || xo >= 1) return '';
  let g = `<div class="menu sheet depth" style="left:${x}px;top:${y}px;width:${w}px;height:340px;${P.move({ e, x: xo, t, seed: 80, r: 2, from: -200 })}">
    <div style="position:absolute;left:36px;top:28px;font:900 42px/1 Montserrat;letter-spacing:4px;color:#ff6a2b">MENU</div>`;
  items.forEach((it, i) => { g += `<div class="mi" style="top:${96 + i * 60}px">${it}</div>`;
    if (i === pick) g += ring(32, 92 + i * 60, P.measure(it, 'en', 46) - 58, 50, pickU); });
  g += ['S', 'M', 'L'].map((s, i) => `<div class="mi" style="top:282px;left:${38 + i * 74}px;font-size:40px">${s}</div>`).join('') + ring(106, 276, 38, 48, sizeU);
  return g + '</div>';
};
