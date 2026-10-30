// The comparison sheet: the three looks as rows, the same four moments as columns.
// Render: still.mjs <project> 0 --size 2440x2690 --q 'view=board'
import { MOMENTS } from './common.js';

const LOOKS = [
  { o: 'a', name: 'HML notebook, coffee edition', tag: 'Same family as the olympiad Reel',
    about: 'Paper cards, washi tape, stickers, rubber stamps and hard shadows, so the two Reels read as one HML series. New for this one: kraft-paper cups and tape, coffee rings on the cards, and the 3+1 offer as a café loyalty card (three stamps, the fourth free).',
    motion: 'Stickers slap on with a bounce, hand-drawn strikes and circles draw on, the stamp slams down. Signature transition: the coffee steam grows into the HML tree.',
    caps: 'Navy stickers, white border, orange squiggle under the key word.',
    sw: [['#14295a', 'Navy'], ['#ff6a2b', 'HML orange'], ['#c9a173', 'Kraft'], ['#f8f2e4', 'Paper']], type: 'Unbounded + Manrope' },
  { o: 'b', name: 'Online class', tag: 'The cards are the app he is selling',
    about: 'Notification toasts, a calendar widget, a plan card with a switch, a big button that gets clicked. Solid white app cards with soft shadows (no glass). Says "online" the moment you see it, and is the furthest from our other Reels.',
    motion: 'Toasts slide in and get swiped away, the cursor clicks, switches flip on, a typing dot before each bubble. A soft "pop" and click sounds on each.',
    caps: 'Chat bubbles from HML Online, the key word in orange.',
    sw: [['#ffffff', 'App white'], ['#14295a', 'Navy'], ['#ff6a2b', 'HML orange'], ['#eef3fb', 'Soft blue']], type: 'Manrope + Unbounded' },
  { o: 'c', name: '3+1 poster campaign', tag: 'The new A3 poster, in motion',
    about: 'A cream header panel with a diagonal edge, the golden plane and dots, giant orange type, Montserrat Black with an outlined word, the round stamp. Flat colour, no outlines or shadows. Parents who saw the poster at the centre recognise the ad.',
    motion: 'The panel wipes down on the diagonal, giant letters slide in from the frame edges, the stamp thumps on. On the offer, 3, + and 1 land in a Z like the poster.',
    caps: 'Montserrat Black capitals on a cream block, a flat yellow offset.',
    sw: [['#f6f0e4', 'Cream'], ['#ffc23d', 'Sun'], ['#f26a1b', 'Fire'], ['#0a2f52', 'Navy']], type: 'Montserrat Black + Outline' },
];

export async function init() {
  const stage = document.getElementById('stage');
  Object.assign(stage.style, { width: '2440px', height: '2690px', background: '#f6f1ea', color: '#14295a' });
  const sw = ([c, n]) => `<div style="display:flex;align-items:center;gap:10px"><span style="width:40px;height:40px;border-radius:11px;background:${c};box-shadow:0 0 0 2px rgba(20,41,90,.12)"></span><span style="font:700 20px Manrope">${n}</span></div>`;
  const row = (L, k) => `<div style="display:flex;gap:30px;align-items:flex-start;margin-top:${k ? 54 : 0}px">
    <div style="width:560px;flex:none;padding-top:6px">
      <div style="display:flex;align-items:center;gap:18px"><span style="width:86px;height:86px;border-radius:24px;background:#14295a;color:#fff;display:grid;place-items:center;font:900 52px Unbounded">${L.o.toUpperCase()}</span>
        <div><div style="font:900 38px/1.1 Unbounded">${L.name}</div><div style="font:800 24px Manrope;color:#f0561e;margin-top:6px">${L.tag}</div></div></div>
      <div style="margin-top:22px;font:600 23px/1.45 Manrope;color:#33374a">${L.about}</div>
      <div style="margin-top:14px;font:600 23px/1.45 Manrope;color:#33374a"><b style="color:#14295a">Motion</b> ${L.motion}</div>
      <div style="margin-top:14px;font:600 23px/1.45 Manrope;color:#33374a"><b style="color:#14295a">Captions</b> ${L.caps}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px">${L.sw.map(sw).join('')}</div>
      <div style="margin-top:14px;font:800 22px Manrope;color:#8a8378">${L.type}</div></div>
    ${MOMENTS.map((m, i) => `<img src="stills/frames/${L.o}${i + 1}_0.jpg" style="width:400px;height:711px;border-radius:18px;box-shadow:0 12px 28px rgba(20,30,60,.22);display:block">`).join('')}</div>`;
  stage.innerHTML = `<div style="padding:64px 70px">
    <div style="display:flex;align-items:flex-end;gap:26px"><div style="font:900 70px Unbounded;line-height:1">Онлайн сургалт Reel</div>
      <div style="font:800 32px Manrope;color:#f0561e;padding-bottom:6px">three looks to choose from</div>
      <div style="margin-left:auto;font:800 24px Manrope;color:#8a8378;padding-bottom:8px">HML Academy · 9:16 · about 37 s · same four moments, same captions</div></div>
    <div style="display:flex;gap:30px;margin:40px 0 22px"><div style="width:560px;flex:none"></div>
      ${MOMENTS.map((m, i) => `<div style="width:400px;font:800 24px Manrope"><span style="font:900 30px Unbounded;color:#f0561e">${i + 1}</span> ${m.name} <span style="color:#8a8378">${m.src} s</span></div>`).join('')}</div>
    ${LOOKS.map(row).join('')}
    <div style="margin-top:44px;padding:22px 28px;background:#fff;border-radius:18px;font:600 22px/1.5 Manrope;color:#33374a;box-shadow:0 6px 20px rgba(20,30,60,.08)">
      <b style="color:#14295a">Notes.</b> Captions are his own words (timed word by word in the edit). The card text is written by Claude, please check the Mongolian. No prices are shown until you give me the real figure. Cards stay above his head and captions on his T-shirt, clear of the Reels buttons. Music for all three: an original warm "morning café" track that hits on each card.</div>
  </div>`;
  await Promise.all([...stage.querySelectorAll('img')].map((im) => im.decode()));
}
export function frame() {}
