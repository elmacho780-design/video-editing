// Look 3: "Big bold captions". Montserrat Black (Unbounded has no Mongolian Ү or Ө). The high-energy Reels grammar: huge one-or-two-word captions in strong colour, a punch-in on every
// sentence, a few icon stickers, almost no cards. Fast to make; the words do the work.
import { kw, icon, CAP_Y } from './common.js';

export const name = 'Big bold captions';
export const css = `
:root { --navy: #14295a; --ink: #0b1530; --orange: #ff6a2b; --amber: #ffc23d; }
.b-word { position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap; text-align: center; font: 900 156px/0.95 Montserrat; letter-spacing: -3px; color: #fff;
  -webkit-text-stroke: 14px var(--ink); paint-order: stroke fill; text-shadow: 0 12px 0 var(--ink), 0 18px 30px rgba(0,0,0,.35); }
.b-word.or { color: var(--amber); }
.b-sub { position: absolute; left: 50%; transform: translateX(-50%) rotate(-2deg); white-space: nowrap; background: var(--orange); color: #fff; font: 900 58px/1 Montserrat; padding: 14px 26px 18px;
  border-radius: 12px; box-shadow: 0 10px 0 var(--ink); }
.b-sub .kw { color: var(--ink); }
.b-stk { position: absolute; display: grid; place-items: center; width: 150px; height: 150px; border-radius: 40px; background: #fff; box-shadow: 0 10px 0 var(--ink), 0 18px 30px rgba(0,0,0,.3); }
.b-pill { position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap; background: #fff; color: var(--navy); font: 800 44px Manrope; padding: 12px 30px; border-radius: 60px; box-shadow: 0 10px 0 var(--ink); }
`;
export const cap = (big, small, { y = CAP_Y - 40, orange = false } = {}) => `<div class="b-word ${orange ? 'or' : ''}" style="top:${y}px">${big}</div>${small ? `<div class="b-sub" style="top:${y + 160}px">${kw(small)}</div>` : ''}`;

export const frames = {
  1: () => `<div class="b-stk" style="left:110px;top:420px;transform:rotate(-12deg)">${icon('phone', { s: 100, c: '#14295a', w: 2 })}</div>
    <div class="b-stk" style="left:800px;top:380px;transform:rotate(10deg);background:var(--orange)"><span style="font:900 70px Montserrat;color:#fff">7×</span></div>
    ${cap('УТСАА', '*ширтээд* өдөржингөө?')}`,
  2: () => `<div class="b-pill" style="top:430px">${icon('cal', { s: 40, c: '#ff6a2b', w: 2.6 })} 11 сарын 2–8 · өдөр бүр 15:00</div>
    ${cap('ТҮВШИН', 'ахиулах *анги*', { orange: true })}`,
  3: () => `<div class="b-word or" style="top:420px;font-size:260px;letter-spacing:-8px">+20%</div>
    <div class="b-stk" style="left:110px;top:400px;transform:rotate(-10deg)">${icon('up', { s: 100, c: '#ff6a2b', w: 2.6 })}</div>
    ${cap('ДҮНГЭЭ', '*10, 20* хувиар')}`,
};
