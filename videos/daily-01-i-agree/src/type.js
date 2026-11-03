// Look 3: "Bold type". Flat, fast kinetic typography in the 3+1 poster's palette: big Montserrat Black words on solid colour fields,
// the English in amber and the Mongolian in white (or navy on cream), the wrong word in an outline with a red slash, the fix on a
// sun-yellow block with a round check badge. No texture, no shadows: pure type and colour.
import { SUB_Y, SERIES } from './common.js';

export const name = 'Bold type';
export const css = `
:root { --navy: #0a2f52; --deep: #072240; --cream: #f6f0e4; --sun: #ffc23d; --fire: #f26a1b; --red: #e5382a; --green: #23a861; }
.bg { position: absolute; inset: 0; background: var(--navy); }
.w { position: absolute; white-space: nowrap; font: 900 170px/0.86 Montserrat; letter-spacing: -4px; color: var(--sun); }
.out { font-family: 'Montserrat Outline', Montserrat; color: transparent; -webkit-text-stroke: 5px var(--sun); }
.mn { font: 900 80px/1 Montserrat; color: #fff; letter-spacing: -1px; }
.lab { position: absolute; font: 800 34px Montserrat; letter-spacing: 6px; color: var(--fire); }
.sub { position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap; background: var(--cream); color: var(--navy); font: 800 44px Manrope; padding: 12px 28px 16px; border-radius: 6px;
  box-shadow: 8px 8px 0 var(--sun); }
.sub b { color: var(--fire); }
`;
const sub = (text) => `<div class="sub" style="top:${SUB_Y}px">${text.replace(/(I am agree|I agree|Do you agree\?|am)/g, '<b>$1</b>')}</div>`;
const label = (y = 560) => `<div class="lab" style="left:90px;top:${y}px">${SERIES}</div>`;
const badge = (x, y, ok = true, d = 150) => `<div class="abs" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;background:${ok ? 'var(--green)' : 'var(--red)'};display:grid;place-items:center">
  <svg width="${d * 0.6}" height="${d * 0.6}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">${ok ? '<path d="M5 12.5l4.5 4.5L19 7.5"/>' : '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'}</svg></div>`;
const corner = () => `<div class="abs" style="right:-140px;top:1540px;width:420px;height:420px;border-radius:50%;background:var(--fire)"></div>
  <div class="abs" style="left:-80px;top:240px;width:200px;height:200px;border-radius:50%;background:var(--sun)"></div>`;

export const frames = {
  // I / AM (outlined, slashed) / AGREE stacked big
  1: (m) => `<div class="bg"></div>${corner()}${label()}
    <div class="w" style="left:90px;top:620px">I</div>
    <div class="w out" style="left:90px;top:760px">AM</div>
    <div class="abs" style="left:70px;top:820px;width:420px;height:22px;background:var(--red);transform:rotate(-12deg)"></div>
    <div class="w" style="left:90px;top:900px">AGREE</div>${badge(820, 640, false)}${sub(m.sub)}`,
  // БАЙНА (white) → AM? (amber outline)
  2: (m) => `<div class="bg"></div>${corner()}${label()}
    <div class="abs mn" style="left:90px;top:640px;opacity:.75">Би зөвшөөрч</div>
    <div class="w" style="left:90px;top:740px;color:#fff;font-size:150px">БАЙНА</div>
    <div class="abs" style="left:110px;top:910px;font:900 120px Montserrat;color:var(--fire)">↓</div>
    <div class="w out" style="left:230px;top:920px">AM?</div>${sub(m.sub)}`,
  // I AGREE on a sun block, the check badge; AM falling away
  3: (m) => `<div class="bg"></div>${corner()}${label()}
    <div class="abs" style="left:60px;top:700px;width:860px;height:330px;background:var(--sun)"></div>
    <div class="w" style="left:100px;top:740px;color:var(--navy)">I</div>
    <div class="w" style="left:100px;top:880px;color:var(--navy);font-size:150px">AGREE</div>${badge(760, 620, true, 170)}
    <div class="w out" style="left:640px;top:1110px;font-size:110px;transform:rotate(18deg);opacity:.5">AM</div>${sub(m.sub)}`,
  // the pair: ARE YOU AGREE? slashed, DO YOU AGREE? on the sun block
  4: (m) => `<div class="bg"></div>${corner()}${label()}
    <div class="w out" style="left:90px;top:660px;font-size:80px;-webkit-text-stroke:4px #c9d3e0">ARE YOU AGREE?</div>
    <div class="abs" style="left:80px;top:690px;width:740px;height:14px;background:var(--red);transform:rotate(-3deg)"></div>
    <div class="abs" style="left:60px;top:830px;width:900px;height:170px;background:var(--sun)"></div>
    <div class="w" style="left:90px;top:870px;font-size:88px;color:var(--navy)">DO YOU AGREE?</div>${badge(820, 770, true, 110)}${sub(m.sub)}`,
};
