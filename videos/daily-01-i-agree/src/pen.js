// Look 2: "Red pen". The teacher marking the page, in the HML notebook family: ruled paper with a margin line, the English sentence
// typed in navy on an amber highlighter (English stands out from the Mongolian), the teacher's red pen circling, striking and ticking,
// Mongolian notes handwritten in pencil grey (Caveat), a red "STOP SAYING THIS" rubber stamp. Montserrat, Manrope and Caveat.
import { SUB_Y, SERIES } from './common.js';

export const name = 'Red pen';
export const css = `
:root { --navy: #14295a; --ink: #1f2a44; --orange: #ff6a2b; --amber: #ffc23d; --paper: #fbf6ea; --line: rgba(78,163,255,.28); --red: #d9362b; --pencil: #3c4250; }
.page { position: absolute; inset: 0; background: var(--paper); background-image: repeating-linear-gradient(180deg, transparent 0 70px, var(--line) 70px 73px); background-position: 0 30px; }
.en { position: relative; display: inline-block; font: 900 104px/1.1 Montserrat; color: var(--navy); letter-spacing: -2px; white-space: nowrap; }
.hl { background: linear-gradient(transparent 52%, rgba(255,194,61,.85) 52%, rgba(255,194,61,.85) 92%, transparent 92%); padding: 0 8px; }
.hand { position: absolute; font: 700 70px/1.05 Caveat; color: var(--pencil); white-space: nowrap; }
.red { color: var(--red); }
.sub { position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap; background: var(--navy); color: #fff; font: 800 44px Manrope; padding: 12px 28px 16px; border-radius: 14px;
  box-shadow: 6px 7px 0 var(--orange); }
.sub b { color: var(--amber); }
`;
const rough = `<defs><filter id="pen"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="6"/></filter></defs>`;
const pen = (d, w = 11, c = '#d9362b') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" filter="url(#pen)" opacity=".92"/>`;
const svg = (inner) => `<svg class="layer" width="1080" height="1920" viewBox="0 0 1080 1920">${rough}${inner}</svg>`;
const page = () => `<div class="page"></div><div class="abs" style="left:110px;top:0;bottom:0;width:4px;background:rgba(217,54,43,.45)"></div>
  <div class="abs" style="left:140px;top:262px;width:120px;height:92px;background:url(assets/hml-tree.png) center/contain no-repeat;opacity:.9"></div>`;
// the rubber stamp
const stamp = (y = 470) => `<svg class="abs" style="left:300px;top:${y}px;transform:rotate(-5deg)" width="560" height="120" viewBox="0 0 560 120">
  <defs><filter id="st"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="2"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.9"/><feComposite in="SourceGraphic" operator="in"/></filter></defs>
  <g filter="url(#st)" fill="#d9362b" stroke="#d9362b"><rect x="6" y="6" width="548" height="108" rx="14" fill="none" stroke-width="8"/>
  <text x="280" y="78" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="46" letter-spacing="5" stroke="none">${SERIES}</text></g></svg>`;
const sub = (text) => `<div class="sub" style="top:${SUB_Y}px">${text.replace(/(I am agree|I agree|Do you agree\?|am)/g, '<b>$1</b>')}</div>`;

export const frames = {
  // the wrong sentence, "am" circled and a big red cross
  1: (m) => `${page()}${stamp()}
    <div class="abs" style="left:50%;top:780px;transform:translateX(-50%)"><span class="en"><span class="hl">I am agree</span></span></div>
    ${svg(pen('M455 770 C520 730 610 742 616 800 C622 862 520 880 462 856 C420 836 424 786 470 766', 10) + pen('M450 838 L612 826', 12))}
    <div class="hand red" style="left:600px;top:930px;transform:rotate(-4deg)">буруу!</div>${sub(m.sub)}`,
  // why: the Mongolian sentence in pencil, "байна" underlined, an arrow to "am?"
  2: (m) => `${page()}${stamp()}
    <div class="hand" style="left:170px;top:700px;font-size:92px">Би зөвшөөрч байна.</div>
    ${svg(pen('M600 815 C680 805 760 812 820 808', 9) + pen('M720 840 C760 900 740 960 660 1000', 9) + pen('M660 1000 l40 -8 M660 1000 l12 -38', 9))}
    <div class="abs" style="left:430px;top:960px"><span class="en" style="font-size:110px"><span class="hl">am</span></span><span class="hand red" style="position:relative;font-size:120px;margin-left:16px">?</span></div>
    ${sub(m.sub)}`,
  // the fix: "I agree" with the teacher's tick; "am" struck out above it
  3: (m) => `${page()}${stamp()}
    <div class="abs" style="left:50%;top:700px;transform:translateX(-50%);opacity:.55"><span class="en" style="font-size:72px">I am agree</span></div>
    ${svg(pen('M432 742 L640 736', 9))}
    <div class="abs" style="left:50%;top:860px;transform:translateX(-50%)"><span class="en"><span class="hl">I agree</span></span></div>
    ${svg(pen('M760 900 L810 960 L940 790', 18, '#2a9d5c'))}
    <div class="hand red" style="left:180px;top:1040px;transform:rotate(-3deg)">am хэрэггүй!</div>${sub(m.sub)}`,
  // an example pair: the wrong one struck, the right one ticked
  4: (m) => `${page()}${stamp()}
    <div class="abs" style="left:170px;top:690px"><span class="en" style="font-size:84px;color:#8a8f9c">Are you agree?</span></div>
    ${svg(pen('M160 748 L860 736', 10) + pen('M890 690 L960 770 M960 690 L890 770', 10))}
    <div class="abs" style="left:170px;top:880px"><span class="en" style="font-size:90px"><span class="hl">Do you agree?</span></span></div>
    ${svg(pen('M880 930 L915 972 L990 870', 14, '#2a9d5c'))}${sub(m.sub)}`,
};
