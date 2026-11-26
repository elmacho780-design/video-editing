// The edit: ?view=edit. Look A, "ABC blocks" (approved), in the reference video's split-screen tier-list grammar.
// This page draws ONLY the graphics (the board, cards, captions) on a transparent background. tools/composite.sh puts the teacher's
// landscape take on top as a straight 1080x960 window of the original pixels (never scaled) and lays this layer over it in one encode.
// The take plays uncut (output time = source time). ?view=edit&bg=1 draws a footage frame underneath, for check stills only.
// Each method: its big card (Batu's image) appears as she names it, flies down into its row as she gives the tier, and the tier letter
// pops. Captions carry every word (Batu's transcript, Whisper's timing: tools/caps.py -> edit/caps.json).
// All Mongolian on screen is Claude's reading of Batu's words, for Batu to check.
import { LOOKS } from './looks.js';
import { TIERS, ROW_Y, ITEMS, SLOT, TRAY_Y } from './tier.js';
const L = LOOKS.a;
export const DUR = 3011 / 30;                                         // the take: 3011 frames at 30 fps (100.37 s)
const clamp = (x) => Math.max(0, Math.min(1, x));
const easeOut = (u) => 1 - (1 - clamp(u)) ** 3;
const easeInOut = (u) => { u = clamp(u); return u < 0.5 ? 4 * u ** 3 : 1 - (-2 * u + 2) ** 3 / 2; };
const backOut = (u, k = 1.6) => { u = clamp(u); return 1 + (k + 1) * (u - 1) ** 3 + k * (u - 1) ** 2; };
const kw = (s) => s.replace(/\*([^*]+)\*/g, '<b>$1</b>');

export const TITLE = 'АНГЛИ ХЭЛ СУРАХ ХИЧЭЭЛЭЭС ГАДНАХ АРГУУД · TIER LIST';                  // Batu's title
const TITLE_HTML = 'АНГЛИ ХЭЛ СУРАХ ХИЧЭЭЛЭЭС<br>ГАДНАХ АРГУУД · <i>TIER LIST</i>';
// the pictures: Batu's images (assets/ext/, not in git), our own drawing for memorising words, our logo for the class
const PIC = {
  duo: ['assets/ext/duo.webp', 'contain', '#fff'], game: ['assets/ext/game.jpg', 'cover', '#000'], song: ['assets/ext/song.jpg', 'cover 38% 50%', '#000'],
  gt: ['assets/ext/gt.png', 'cover', '#abd0fc'], toon: ['assets/ext/toon.webp', 'cover', '#000'], words: [null, 'contain', '#dff0ff'], hml: ['assets/hml-logo.png', 'contain', '#fff'],
};
const BIGNAME = { duo: 'Duolingo', game: 'Видео тоглоом', song: 'Дуу сонсох', gt: 'Google Translate', toon: 'Хүүхэлдэйн кино', words: 'Үг цээжлэх', hml: 'Зөв чиглүүлэгтэй анги' };
const SHORT = { duo: 'Duolingo', game: 'Тоглоом', song: 'Дуу', gt: 'Translate', toon: 'Кино', words: 'Үг цээжлэх', hml: 'HML анги' };
// our own picture for memorising words: a fan of flashcards
const WORDS_ART = `<svg viewBox="0 0 780 430" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="780" height="430" fill="#dff0ff"/>
  ${[['apple', '#ffb02e', -18, 250], ['because', '#ff7a3d', -6, 330], ['weather', '#f6eedc', 6, 410], ['beautiful', '#fff', 18, 490]].map(([w, c, r, x]) =>
    `<g transform="rotate(${r} ${x} 300)"><rect x="${x - 120}" y="120" width="240" height="160" rx="16" fill="${c}" stroke="#14295a" stroke-width="6"/>
     <text x="${x}" y="215" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="38" fill="#14295a">${w}</text></g>`).join('')}
  <g transform="rotate(30 640 120)"><rect x="560" y="100" width="200" height="34" rx="6" fill="#ffb02e"/><rect x="740" y="100" width="34" height="34" fill="#f6a0a0"/><path d="M560 100 l-34 17 l34 17z" fill="#f6eedc"/><path d="M536 112 l-10 5 l10 5z" fill="#14295a"/></g></svg>`;
const pic = (id) => { const [src, fit, bg] = PIC[id]; if (!src) return WORDS_ART;
  const [mode, ...pos] = fit.split(' ');
  return `<div style="width:100%;height:100%;background:${bg} url(${src}) ${pos.length ? pos.join(' ') : 'center'}/${mode} no-repeat"></div>`; };

let CAPS = [], CUE = {};
// ---------------------------------------------------------------- pieces
const css = `
.A-tile { position: absolute; width: 170px; height: 111px; border-radius: 16px; background: linear-gradient(#fffaf0, #f6eedc); box-shadow: inset 0 5px 0 rgba(255,255,255,.6), 0 8px 0 #cdbb94, 0 14px 16px rgba(0,0,0,.4); }
.A-tile .p { position: absolute; left: 7px; top: 7px; width: 156px; height: 70px; border-radius: 10px; overflow: hidden; }
.A-tile .n { position: absolute; left: 0; right: 0; top: 80px; text-align: center; font: 800 22px/1 Manrope; color: #14295a; white-space: nowrap; }
.A-card { position: absolute; left: 130px; top: 236px; width: 820px; height: 560px; border-radius: 34px; background: linear-gradient(#fffaf0, #f6eedc); transform-origin: 0 0;
  box-shadow: inset 0 8px 0 rgba(255,255,255,.6), 0 16px 0 #cdbb94, 0 30px 40px rgba(0,0,0,.45); }
.A-card .p { position: absolute; left: 20px; top: 20px; width: 780px; height: 430px; border-radius: 22px; overflow: hidden; }
.A-card .nm { position: absolute; left: 0; right: 0; bottom: 26px; text-align: center; font: 900 60px/1 Montserrat; color: #14295a; white-space: nowrap; letter-spacing: -.5px; }
.A-q { position: absolute; left: 110px; top: 226px; padding: 10px 20px 12px; border-radius: 12px; background: #14295a; color: #ffb02e; font: 900 32px/1 Montserrat; letter-spacing: 1px;
  box-shadow: 0 8px 0 #0a1636; transform: rotate(-4deg); }
.A-title { top: 966px !important; font-size: 30px !important; line-height: 1.18 !important; white-space: normal !important; }
.A-title i { font-style: normal; color: #14295a; }
.A-tl { position: absolute; padding: 10px 20px 12px; border-radius: 12px; background: #14295a; color: #ffb02e; font: 900 34px/1 Montserrat; letter-spacing: 3px; box-shadow: 0 8px 0 #0a1636, 0 14px 18px rgba(0,0,0,.4); white-space: nowrap; }
`;
const tile = (id, x, y, st = '') => `<div class="A-tile" style="left:${x}px;top:${y}px;${st}"><div class="p">${pic(id)}</div><div class="n">${SHORT[id]}</div></div>`;
// when each card appears (just before its name), flies into the board (on the tier, but up at least 1.3 s and at most 2.4 s, so it
// can be seen and never covers her for long), and when its tier letter pops (on the tier word, or as it flies if that is later)
const TIME = (id) => { const c = CUE[id]; if (!c) return null; const at = c.name - 0.3, fly = Math.min(Math.max(c.tier, at + 1.3), at + 2.4);
  return { at, fly, stamp: Math.max(c.tier, fly) }; };
function cardAndFlight(t, id) {
  const T = TIME(id); if (!T || t < T.at) return '';
  const u = (t - T.at) / 0.35, f = (t - T.fly) / 0.55, s = SLOT[id];
  if (f >= 1) return tile(id, s.x, s.y);
  const k = easeInOut(f), sc = 1 - (1 - 170 / 820) * k;
  const dx = (s.x - 130) * k, dy = (s.y - 236) * k;
  const pop = f > 0 ? 1 : 0.6 + 0.4 * backOut(u, 2.0);
  const card = `<div class="A-card" style="transform:translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) scale(${(sc * pop).toFixed(4)}) rotate(${(f > 0 ? -2 * (1 - k) : -2 + 4 * (1 - easeOut(u))).toFixed(2)}deg);opacity:${clamp(u * 5).toFixed(3)}">
    <div class="p">${pic(id)}</div><div class="nm" style="opacity:${(1 - clamp(f * 3)).toFixed(3)}">${BIGNAME[id]}</div></div>`;
  const q = f <= 0 ? `<div class="A-q" style="opacity:${clamp(u * 4).toFixed(3)}">ЯМАР TIER ВЭ?</div>` : '';
  return card + q;
}
function stamp(t, id) {
  const T = TIME(id), it = ITEMS.find((i) => i.id === id); if (!T || t < T.stamp) return '';
  const u = (t - T.stamp) / 0.3, o = (t - T.stamp - 1.3) / 0.3; if (o >= 1) return '';
  const sc = (u < 1 ? 0.4 + 0.6 * backOut(u, 2.6) : 1) * (1 - 0.5 * clamp(o));
  return L.stamp(it.tier, 790, 300, `transform:rotate(-8deg) scale(${sc.toFixed(3)});opacity:${(clamp(u * 5) * (1 - clamp(o))).toFixed(3)}`);
}
function tray(t) {
  const left = ITEMS.filter((i) => !(TIME(i.id) && t >= TIME(i.id).at));
  return left.map((it, k) => `<div style="position:absolute;left:${540 - left.length * 55 + k * 110 + 10}px;top:${TRAY_Y}px;width:90px;height:90px;border-radius:18px;background:rgba(255,255,255,.12);padding:8px;box-sizing:border-box">
    <div style="width:74px;height:74px;border-radius:12px;overflow:hidden">${pic(it.id)}</div></div>`).join('');
}
function banners(t) {
  let g = '';
  const h = (t + 0.4) / 0.35, ho = (t - 7.9) / 0.3;                  // the hook, in place on frame one
  if (ho < 1) g += L.banner('Аль нь *үр дүнтэй*,<br>аль нь *цагийн гарз* вэ?', 676, `transform:scale(${(0.7 + 0.3 * backOut(h, 2)).toFixed(3)}) translateY(${(-80 * easeOut(clamp(ho)) ** 2).toFixed(1)}px);opacity:${(clamp(h * 4) * (1 - clamp(ho))).toFixed(3)}`);
  const ENROL = 88.22, PHONE = 92.6;
  if (t >= ENROL && t < PHONE) { const u = (t - ENROL) / 0.35; g += L.banner('Хагас сайн, бүтэн сайнд<br>*хүүхдийн анги · ЭЛСЭЛТ*', 690, `transform:scale(${(0.7 + 0.3 * backOut(u, 2)).toFixed(3)});opacity:${clamp(u * 4).toFixed(3)}`); }
  if (t >= PHONE) { const u = (t - PHONE) / 0.35; g += L.banner('*9930 4451* · *8888 3351*', 752, `font-size:58px;transform:scale(${(0.7 + 0.3 * backOut(u, 2)).toFixed(3)});opacity:${clamp(u * 4).toFixed(3)}`); }
  return g;
}
function caption(t) {
  for (let i = CAPS.length - 1; i >= 0; i--) {
    const [at, s] = CAPS[i]; if (t < at) continue;
    if (!s) return '';
    const u = (t - at) / 0.12;
    return `<div style="position:absolute;left:0;top:0;width:1080px;transform-origin:540px 905px;transform:scale(${(0.94 + 0.06 * clamp(u)).toFixed(3)})">${L.cap(s, 868)}</div>`;
  }
  return '';
}

export const EV = () => {                                             // cues for the score (built once the captions are loaded)
  const ev = [{ t: 0, type: 'clock' }];
  for (const it of ITEMS) { const T = TIME(it.id); if (T) ev.push({ t: +T.at.toFixed(3), type: 'card', id: it.id }, { t: +T.stamp.toFixed(3), type: 'tier', id: it.id, tier: it.tier }); }
  ev.push({ t: 88.22, type: 'enrol' }, { t: 92.6, type: 'phone' });
  return ev.sort((a, b) => a.t - b.t);
};

let st, BG = false;
export async function init(qs) {
  BG = qs.get('bg') === '1';
  const j = await (await fetch('edit/caps.json')).json(); CAPS = j.phrases; CUE = j.cues;
  document.head.insertAdjacentHTML('beforeend', `<style>${L.css}${css}${BG ? '' : 'html,body,#stage{background:transparent!important}'}</style>`);
  st = document.getElementById('stage');
  window.EV = EV();
  await Promise.all(['assets/ext/duo.webp', 'assets/ext/game.jpg', 'assets/ext/song.jpg', 'assets/ext/gt.png', 'assets/ext/toon.webp', 'assets/hml-logo.png', 'assets/hml-tree.png']
    .map((src) => { const i = new Image(); i.src = src; return i.decode().catch(() => {}); }));
}
export async function frame(t) {
  t = Math.min(t, DUR - 1 / 60);
  let g = BG ? `<img src="frames/${String(Math.min(3010, Math.round(t * 30))).padStart(5, '0')}.jpg" style="position:absolute;left:0;top:0;width:1080px;height:960px">` : '';
  g += L.board(TITLE_HTML);
  g += tray(t);
  for (const it of ITEMS) g += cardAndFlight(t, it.id);
  for (const it of ITEMS) g += stamp(t, it.id);
  g += banners(t) + caption(t);
  st.innerHTML = g;
  await Promise.all([...st.querySelectorAll('img')].map((x) => x.decode().catch(() => {})));
}
