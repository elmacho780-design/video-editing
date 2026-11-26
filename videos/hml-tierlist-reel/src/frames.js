// Style frames: ?view=frames&look=a|b|c, t = 0..3: the hook, a method's big card, its verdict, and the finished board.
// The footage window is a straight 1080x960 crop of the landscape take (stills in stills/src/, never scaled).
import { LOOKS } from './looks.js';
import { ITEMS, SLOT, TRAY_Y, icon } from './tier.js';
export const DUR = 4;
const by = (id) => ITEMS.find((i) => i.id === id);
const TITLE = 'ХИЧЭЭЛЭЭС ГАДУУР · TIER LIST';
const MOMENTS = [
  { still: 'hook', placed: [], ban: ['Аль нь *үр дүнтэй*,<br>аль нь *цагийн гарз* вэ?', 676], cap: 'Хичээлээс гадуур *англи хэл*' },
  { still: 'card', placed: ['duo'], big: 'game', cap: 'За, *видео тоглоом*' },
  { still: 'verdict', placed: ['duo', 'game'], stamp: 'S', cap: 'Видео тоглоом: *S tier!*' },
  { still: 'end', placed: ITEMS.map((i) => i.id), ban: ['Хагас сайн, бүтэн сайнд<br>*ЭЛСЭЛТ* · 9930 4451', 660], cap: 'доорх *утасны дугаараар*' },
];
let st, L;
export async function init(q) {
  L = LOOKS[q.get('look') || 'a'];
  document.head.insertAdjacentHTML('beforeend', `<style>${L.css}</style>`);
  st = document.getElementById('stage');
}
export async function frame(t) {
  const m = MOMENTS[Math.max(0, Math.min(3, Math.floor(t + 1e-6)))];
  let g = `<img src="stills/src/${m.still}.jpg" style="position:absolute;left:0;top:0;width:1080px;height:960px">` + L.board(TITLE);
  for (const id of m.placed) { const s = SLOT[id]; g += L.item(by(id), s.x, s.y, id === 'hml' ? 'outline:6px solid #ffb02e;outline-offset:3px' : ''); }
  const tray = ITEMS.filter((i) => !m.placed.includes(i.id) && i.id !== m.big);
  tray.forEach((it, k) => { g += `<div style="position:absolute;left:${540 - tray.length * 55 + k * 110 + 10}px;top:${TRAY_Y}px;width:90px;height:90px;border-radius:18px;background:rgba(255,255,255,.12);padding:10px;box-sizing:border-box;opacity:.85">${icon(it.icon, 70)}</div>`; });
  if (m.big) g += L.big(by(m.big));
  if (m.stamp) g += L.stamp(m.stamp, 780, 330);
  if (m.ban) g += L.banner(m.ban[0], m.ban[1]);
  if (m.cap) g += L.cap(m.cap);
  st.innerHTML = g;
  await Promise.all([...st.querySelectorAll('img')].map((x) => x.decode().catch(() => {})));
}
