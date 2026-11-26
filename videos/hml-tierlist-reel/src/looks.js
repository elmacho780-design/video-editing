// Three skins for the tier board and its cards (style frames for Batu to choose from). Same layout and timing in each.
import { TIERS, ROW_Y, ROW_H, icon } from './tier.js';
const TEX = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' seed='4'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const TIER_C = { S: ['#ff6a2b', '#b8420f', '#fff'], A: ['#ffb02e', '#c47a14', '#14295a'], B: ['#f6eedc', '#cdbb94', '#14295a'], C: ['#4ea3ff', '#2a6bb8', '#fff'] };
const kw = (s) => s.replace(/\*([^*]+)\*/g, '<b>$1</b>');

// ---------------------------------------------------------------- A · ABC blocks
const A = {
  name: 'A · ABC blocks', from: 'the weekend-classes and linking-words Reels',
  css: `
  .A-board { position: absolute; left: 0; top: 960px; width: 1080px; height: 960px; background: linear-gradient(#18306a, #14295a 30%); }
  .A-track { position: absolute; left: 166px; width: 790px; height: ${ROW_H}px; border-radius: 18px; background: rgba(255,255,255,.07); box-shadow: inset 0 4px 10px rgba(0,0,0,.25); }
  .A-lbl { position: absolute; left: 40px; width: ${ROW_H}px; height: ${ROW_H}px; border-radius: 18px; font: 900 64px/${ROW_H}px Montserrat; text-align: center;
    box-shadow: inset 0 6px 0 rgba(255,255,255,.4), inset 0 -8px 0 rgba(0,0,0,.12), 0 10px 0 var(--sd), 0 18px 20px rgba(0,0,0,.4); }
  .A-item { position: absolute; width: 170px; height: 111px; border-radius: 16px; background: linear-gradient(#fffaf0, #f6eedc); color: #14295a; text-align: center;
    box-shadow: inset 0 5px 0 rgba(255,255,255,.6), 0 8px 0 #cdbb94, 0 14px 16px rgba(0,0,0,.4); font: 800 25px/1 Manrope; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; }
  .A-big { position: absolute; left: 150px; top: 240px; width: 780px; height: 560px; border-radius: 34px; background: linear-gradient(#fffaf0, #f6eedc); color: #14295a; text-align: center;
    box-shadow: inset 0 8px 0 rgba(255,255,255,.6), 0 16px 0 #cdbb94, 0 30px 40px rgba(0,0,0,.45); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; font: 900 72px/1 Montserrat; }
  .A-big small { font: 800 34px Manrope; color: #f2581f; letter-spacing: 2px; }
  .A-title { position: absolute; left: 40px; top: 975px; padding: 10px 22px 12px; border-radius: 12px; background: #ff6a2b; color: #fff; font: 900 36px/1 Montserrat; letter-spacing: 1px;
    box-shadow: inset 0 5px 0 rgba(255,255,255,.3), 0 8px 0 #b8420f; white-space: nowrap; }
  .A-ban { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; padding: 16px 30px 20px; border-radius: 18px; text-align: center; color: #fff; font: 900 54px/1.1 Montserrat;
    background: linear-gradient(#1d3a78, #14295a); box-shadow: inset 0 5px 0 rgba(255,255,255,.18), 0 10px 0 #0a1636, 0 20px 24px rgba(0,0,0,.45); }
  .A-ban b { color: #ffb02e; }
  .A-cap { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; max-width: 840px; padding: 12px 26px 16px; border-radius: 14px; text-align: center;
    background: #fff8e8; color: #14295a; font: 800 44px/1.15 Manrope; box-shadow: 0 7px 0 #e5d3ad, 0 14px 18px rgba(0,0,0,.4); }
  .A-cap b { color: #f2581f; }`,
  board: (title) => `<div class="A-board"></div><div class="A-title">${title}</div>` + TIERS.map((t, i) => `<div class="A-track" style="top:${ROW_Y[i]}px"></div>
    <div class="A-lbl" style="top:${ROW_Y[i]}px;background:${TIER_C[t][0]};--sd:${TIER_C[t][1]};color:${TIER_C[t][2]}">${t}</div>`).join(''),
  item: (it, x, y, st = '') => `<div class="A-item" style="left:${x}px;top:${y}px;${st}">${icon(it.icon, 60)}${it.mn}</div>`,
  big: (it, st = '') => `<div class="A-big" style="${st}">${icon(it.icon, 250)}${it.name}<small>ЯМАР TIER ВЭ?</small></div>`,
  stamp: (t, x, y, st = '') => `<div class="A-lbl" style="left:${x}px;top:${y}px;width:150px;height:150px;font-size:100px;line-height:150px;background:${TIER_C[t][0]};--sd:${TIER_C[t][1]};color:${TIER_C[t][2]};${st}">${t}</div>`,
  banner: (html, y, st = '') => `<div class="A-ban" style="top:${y}px;${st}">${kw(html)}</div>`,
  cap: (s, y = 860) => `<div class="A-cap" style="top:${y}px">${kw(s)}</div>`,
};

// ---------------------------------------------------------------- B · Paper-cut
const B = {
  name: 'B · Paper-cut', from: 'the Daily English series look',
  css: `
  .B-depth { filter: drop-shadow(0 6px 0 rgba(8,16,40,.18)) drop-shadow(0 14px 16px rgba(8,16,40,.38)); }
  .B-board { position: absolute; left: 0; top: 960px; width: 1080px; height: 960px; background-color: #14295a; background-image: ${TEX}; }
  .B-track { position: absolute; left: 166px; width: 790px; height: ${ROW_H}px; background-color: #1d3a78; background-image: ${TEX};
    clip-path: polygon(0 4%, 6% 0, 30% 5%, 55% 0, 80% 4%, 100% 0, 99% 50%, 100% 100%, 70% 95%, 40% 100%, 12% 96%, 0 100%, 1% 50%); }
  .B-lbl { position: absolute; left: 40px; width: ${ROW_H}px; height: ${ROW_H}px; border-radius: 12px; font: 900 64px/${ROW_H}px Montserrat; text-align: center; background-image: ${TEX}; }
  .B-item { position: absolute; width: 170px; height: 111px; border-radius: 12px; background-color: #ffb02e; background-image: ${TEX}; color: #0d1c40; text-align: center;
    font: 800 25px/1 Manrope; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; }
  .B-big { position: absolute; left: 150px; top: 240px; width: 780px; height: 560px; border-radius: 24px; background-color: #f6eedc; background-image: ${TEX}; color: #14295a; text-align: center;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; font: 900 72px/1 Montserrat; }
  .B-big small { font: 800 34px Manrope; color: #ff6a2b; letter-spacing: 2px; }
  .B-title { position: absolute; left: 40px; top: 975px; padding: 12px 30px 14px; background-color: #ff6a2b; background-image: ${TEX}; color: #fff; font: 900 36px/1 Montserrat; letter-spacing: 1px;
    clip-path: polygon(0 0, 100% 0, 97% 50%, 100% 100%, 0 100%, 3% 50%); white-space: nowrap; }
  .B-ban { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; padding: 16px 30px 20px; text-align: center; color: #fff; font: 900 54px/1.1 Montserrat;
    background-color: #ff6a2b; background-image: ${TEX}; clip-path: polygon(0 0, 100% 0, 98% 50%, 100% 100%, 0 100%, 2% 50%); }
  .B-ban b { color: #14295a; }
  .B-cap { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; max-width: 840px; padding: 12px 26px 16px; border-radius: 12px; text-align: center;
    background-color: #f6eedc; background-image: ${TEX}; color: #14295a; font: 800 44px/1.15 Manrope; }
  .B-cap b { color: #ff6a2b; }`,
  board: (title) => `<div class="B-board"></div><div class="B-title B-depth">${title}</div>` + TIERS.map((t, i) => `<div class="B-track B-depth" style="top:${ROW_Y[i]}px"></div>
    <div class="B-lbl B-depth" style="top:${ROW_Y[i]}px;background-color:${TIER_C[t][0]};color:${TIER_C[t][2]};transform:rotate(${[-3, 2, -2, 3][i]}deg)">${t}</div>`).join(''),
  item: (it, x, y, st = '') => `<div class="B-item B-depth" style="left:${x}px;top:${y}px;transform:rotate(${(x % 7) - 3}deg);${st}">${icon(it.icon, 60)}${it.mn}</div>`,
  big: (it, st = '') => `<div class="B-big B-depth" style="transform:rotate(-1.5deg);${st}">${icon(it.icon, 250)}${it.name}<small>ЯМАР TIER ВЭ?</small></div>`,
  stamp: (t, x, y, st = '') => `<div class="B-lbl B-depth" style="left:${x}px;top:${y}px;width:150px;height:150px;font-size:100px;line-height:150px;background-color:${TIER_C[t][0]};color:${TIER_C[t][2]};transform:rotate(-8deg);${st}">${t}</div>`,
  banner: (html, y, st = '') => `<div class="B-ban B-depth" style="top:${y}px;${st}">${kw(html)}</div>`,
  cap: (s, y = 860) => `<div class="B-cap B-depth" style="top:${y}px">${kw(s)}</div>`,
};

// ---------------------------------------------------------------- C · Notebook stickers
const C = {
  name: 'C · Notebook stickers', from: 'the olympiad and online-course ads',
  css: `
  .C-board { position: absolute; left: 0; top: 960px; width: 1080px; height: 960px; background: #f8f2e4;
    background-image: repeating-linear-gradient(180deg, transparent 0 58px, rgba(78,163,255,.28) 58px 60px); border-top: 6px solid #14295a; }
  .C-margin { position: absolute; left: 150px; top: 960px; width: 4px; height: 960px; background: rgba(255,106,43,.55); }
  .C-track { position: absolute; left: 172px; width: 778px; height: ${ROW_H}px; border-radius: 14px; border: 4px dashed rgba(20,41,90,.25); box-sizing: border-box; }
  .C-lbl { position: absolute; left: 36px; width: ${ROW_H}px; height: ${ROW_H}px; border-radius: 18px; border: 5px solid #fff; box-sizing: border-box; font: 900 60px/${ROW_H - 10}px Montserrat; text-align: center;
    box-shadow: 6px 7px 0 #14295a, 0 12px 20px rgba(8,16,40,.25); }
  .C-item { position: absolute; width: 170px; height: 111px; border-radius: 16px; background: #14295a; color: #fff; border: 5px solid #fff; box-sizing: border-box; text-align: center;
    box-shadow: 5px 6px 0 #ff6a2b, 0 12px 20px rgba(8,16,40,.3); font: 800 25px/1 Manrope; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; }
  .C-item svg [fill="#14295a"] { fill: #fff; }
  .C-big { position: absolute; left: 150px; top: 240px; width: 780px; height: 560px; border-radius: 28px; background: #fff; border: 8px solid #14295a; box-sizing: border-box; color: #14295a; text-align: center;
    box-shadow: 14px 16px 0 #ff6a2b, 0 30px 40px rgba(0,0,0,.35); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; font: 900 72px/1 Montserrat; }
  .C-big small { font: 800 34px Manrope; color: #ff6a2b; letter-spacing: 2px; }
  .C-title { position: absolute; left: 36px; top: 978px; padding: 10px 22px 12px; border-radius: 14px; background: #14295a; color: #fff; border: 5px solid #fff; font: 900 34px/1 Montserrat;
    box-shadow: 6px 7px 0 #ff6a2b; white-space: nowrap; }
  .C-ban { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; padding: 16px 30px 20px; border-radius: 20px; text-align: center; color: #fff; font: 900 54px/1.1 Montserrat;
    background: #ff6a2b; border: 6px solid #fff; box-shadow: 9px 10px 0 #14295a, 0 18px 30px rgba(0,0,0,.3); }
  .C-ban b { color: #14295a; }
  .C-cap { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; max-width: 840px; padding: 12px 26px 16px; border-radius: 18px; text-align: center;
    background: #14295a; color: #fff; border: 5px solid #fff; font: 800 44px/1.15 Manrope; box-shadow: 6px 7px 0 #ff6a2b; }
  .C-cap b { color: #ffb02e; }`,
  board: (title) => `<div class="C-board"></div><div class="C-margin"></div><div class="C-title">${title}</div>` + TIERS.map((t, i) => `<div class="C-track" style="top:${ROW_Y[i]}px"></div>
    <div class="C-lbl" style="top:${ROW_Y[i]}px;background:${TIER_C[t][0]};color:${TIER_C[t][2]};transform:rotate(${[-3, 2, -2, 3][i]}deg)">${t}</div>`).join(''),
  item: (it, x, y, st = '') => `<div class="C-item" style="left:${x}px;top:${y}px;transform:rotate(${(x % 5) - 2}deg);${st}">${icon(it.icon, 60)}${it.mn}</div>`,
  big: (it, st = '') => `<div class="C-big" style="transform:rotate(-1.5deg);${st}">${icon(it.icon, 250)}${it.name}<small>ЯМАР TIER ВЭ?</small></div>`,
  stamp: (t, x, y, st = '') => `<div class="C-lbl" style="left:${x}px;top:${y}px;width:150px;height:150px;font-size:96px;line-height:138px;background:${TIER_C[t][0]};color:${TIER_C[t][2]};transform:rotate(-8deg);${st}">${t}</div>`,
  banner: (html, y, st = '') => `<div class="C-ban" style="top:${y}px;${st}">${kw(html)}</div>`,
  cap: (s, y = 860) => `<div class="C-cap" style="top:${y}px">${kw(s)}</div>`,
};
export const LOOKS = { a: A, b: B, c: C };
