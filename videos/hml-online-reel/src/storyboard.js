// Storyboard sheet in look A: eleven frames with timing, picture, captions and sound, the cut list and the style legend.
// Render: still.mjs <project> 0 --size 2440x4960 --q 'view=storyboard'
import { KEEP, END, O } from './common.js';

const T = (s) => { const t = O(s); return `0:${String(Math.floor(t)).padStart(2, '0')}`; };
const span = (a, b) => `${T(a)}–${T(b)}`;
const P = [
  { t: span(0.72, 3.1), src: '0.7–3.1', name: 'Hook: the coffee', pic: 'Opens on his first word. The kraft coffee cup slaps onto a taped paper card above his head, so frame one is never empty. On "англи хэл" an orange "=" draws on and the English notebook pops on beside the cup.', cap: 'Таны өглөө болгон · уух *кофены* мөнгөөр · хүүхэд чинь · *англи хэл* сурах · боломжтой', snd: 'A cup clink and a two-note café piano pickup on frame one; the music starts.' },
  { t: span(3.1, 5.45), src: '3.1–5.4', name: 'The question', pic: 'The full card reads "1 аяга кофе = англи хэл". His question lands as a small sticker over a big paper ticket, with a gentle push in on him.', cap: 'гэвэл ямар / *сонсогдож* байна?', snd: 'Glockenspiel on the "=", a pop on the notebook, a soft "ding" on the question.' },
  { t: T(5.45), src: '5.45 → 6.92', name: 'Steam wipe', pic: 'Signature transition, about 0.5 s: the cup drops to the bottom of the frame and its steam grows into the HML tree; flowers open and the next page shows through them. It also hides his walk back into frame.', cap: 'none', snd: 'A soft whoosh and a rising vibraphone swell.' },
  { t: span(6.92, 9.6), src: '6.9–9.6', name: 'Does this happen to you?', pic: 'A full-screen notebook page covers the start of the take (he is still walking in). Each reason slaps on as he says it, his face taped on as a round photo sticker. Once he is in place the page shrinks up into the card above his head.', cap: 'The rows carry his words, no caption sticker', snd: 'A paper slap on each row, on the beat.' },
  { t: span(9.6, 14.75), src: '9.6–14.75', name: 'ОНЛАЙН stamp', pic: 'The third reason pops on the card. On "онлайн" the orange marker strikes all three through and the ОНЛАЙН СУРГАЛТ stamp slams down, with a small punch in.', cap: 'танхимаар суух боломжгүй · хүүхдүүдэд *зориулаад* · манайх *онлайн сургалт* · зарлаж байна', snd: 'Three marker squeaks, then a rubber stamp thump.' },
  { t: span(16.18, 22.45), src: '16.2–22.45', name: 'Olympiad or level up', pic: 'The steam wipe again, hiding his walk in. Two kraft tags, Олимпиадын бэлтгэл and Түвшин ахиулах, each ticked by hand as he says it; on "бүгд" a БҮГД БАГТСАН stamp lands on the corner.', cap: 'олимпиадад *бэлдмээр* байна уу · эсвэл *түвшингөө* ахиулмаар · хамаагүй · *бүгд багтсан* байгаа', snd: 'Pen ticks, a stamp thump.' },
  { t: span(23.25, 24.6), src: '23.25–24.6', name: 'Schedule page', pic: 'He starts talking before he is in shot, so a planner page fills the frame while he says "Хуваарийн хувьд гэх юм бол". Then it shrinks to the card above his head.', cap: '*Хуваарийн* хувьд · гэх юм бол', snd: 'A page flip.' },
  { t: span(24.6, 28.25), src: '24.6–28.25', name: 'The days, circled', pic: 'Orange marker circles Мя, Пү and Бя exactly on "хоёрдох", "дөрөвдөх" and "хагас сайн"; each day flips to navy with 17:00, and a 17:00 sticker pops on "хичээл маань". His two fingers on "хоёрдох" land with the first circle.', cap: '*хоёрдох,* · *дөрөвдөх,* · *хагас сайн* өдрүүдэд · хичээл маань · орж байгаа', snd: 'A rising marimba note for each day.' },
  { t: span(29.4, 33.6), src: '29.4–33.6', name: '3+1 loyalty card', pic: 'Full screen again while he walks in: the café loyalty card. Stamps 1, 2 and 3 thump on "гурав", the orange +1 lands on "нэмэх нэг" with ҮНЭГҮЙ, then the card flies up above his head for "урамшуулал хэрэгжиж байгаа".', cap: 'Энэн дээр мөн адил · манай *3+1* · *урамшуулал* · хэрэгжиж байгаа бөгөөд', snd: 'Three stamp thumps, a glockenspiel sparkle and a till "ka-ching" on the +1.' },
  { t: span(33.6, 37.2), src: '33.6–37.2', name: 'Contact', pic: 'On "илүү их мэдээлэл" the card slides off and the phone board drops in. Both numbers flip in digit by digit on "доорх дугаараар", with a "доор ↓" sticker.', cap: 'илүү их *мэдээллийг* · та хүсэж байвал · доорх *дугаараар* · холбогдоорой', snd: 'Soft split-flap clicks.' },
  { t: `${T(37.28)}–0:${Math.round(O(38.1) + END)}`, src: '37.3–38.1, then the end card', name: 'Thanks and end card', pic: 'He says "Баярлалаа" on camera, then a last steam wipe to the end card: the logo taped on, the numbers, @hml_english and 3+1 stickers, the cup, and his photo sticker. The last frame loops cleanly back to the first.', cap: '*Баярлалаа!*', snd: 'The music resolves on a warm final chord.' },
];
const keyed = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*(.+?)\*/g, '<b style="background:linear-gradient(100deg,#f0561e,#f7931e);color:#fff;border-radius:8px;padding:0 8px">$1</b>');

export async function init() {
  const stage = document.getElementById('stage');
  Object.assign(stage.style, { width: '2440px', height: '4960px', background: '#f6f1ea', color: '#14295a' });
  const panel = (p, i) => `<div style="width:542px">
    <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:10px"><span style="font:900 42px Unbounded;color:#f0561e">${i + 1}</span>
      <span style="font:800 28px Manrope">${p.name}</span><span style="margin-left:auto;font:800 24px Manrope;color:#8a8378">${p.t}</span></div>
    <img src="stills/board/s${i + 1}_0.jpg" style="width:542px;height:964px;display:block;border-radius:18px;box-shadow:0 10px 26px rgba(20,30,60,.2)">
    <div style="margin-top:14px;font:600 22px/1.42 Manrope;color:#3b3a44">
      <div style="color:#8a8378;font-weight:800;font-size:19px">SOURCE ${p.src}${/[0-9]$/.test(p.src) ? " s" : ""}</div>
      <div style="margin-top:6px">${keyed(p.pic)}</div>
      <div style="margin-top:10px;padding:10px 12px;background:#fff;border-left:5px solid #f7931e;border-radius:6px;font-weight:800;color:#14295a">${keyed(p.cap)}</div>
      <div style="margin-top:8px"><b>Sound</b> ${keyed(p.snd)}</div></div></div>`;
  const cut = `<div style="width:542px;padding:30px 32px;background:#fff;border-radius:22px;box-shadow:0 6px 20px rgba(20,30,60,.08);box-sizing:border-box;margin-top:52px">
    <div style="font:900 30px Unbounded;margin-bottom:16px">The cut</div>
    <div style="font:600 22px/1.5 Manrope;color:#3b3a44">He films each line as its own take and walks in and out of frame. Kept (source seconds):</div>
    <div style="margin:14px 0;display:grid;gap:8px">${KEEP.map(([a, b], i) => `<div style="display:flex;justify-content:space-between;font:800 24px Manrope;padding:8px 14px;background:#f6f1ea;border-radius:10px"><span>Take ${i + 1}</span><span>${a.toFixed(2)}–${b.toFixed(2)} s</span></div>`).join('')}
      <div style="display:flex;justify-content:space-between;font:800 24px Manrope;padding:8px 14px;background:#ffe6db;border-radius:10px"><span>End card</span><span>${END.toFixed(1)} s</span></div></div>
    <div style="font:600 22px/1.5 Manrope;color:#3b3a44">Cut: the walk-ins and walk-outs, the pauses between takes and the empty room at the end. Where he talks while walking in (0:04, 0:18, 0:23) a full-screen page covers the picture and his voice carries on. Total <b style="color:#14295a">about ${Math.round(O(38.1) + END)} s</b>.</div></div>`;
  const row = (a, o, extra = '') => `<div style="display:flex;gap:44px;align-items:flex-start">${a.map((p, i) => panel(p, i + o)).join('')}${extra}</div>`;
  const sw = (c, n) => `<div style="display:flex;align-items:center;gap:10px"><span style="width:50px;height:50px;border-radius:13px;background:${c};box-shadow:0 2px 6px rgba(0,0,0,.15)"></span><span style="font:700 22px Manrope">${n}</span></div>`;
  stage.innerHTML = `<div style="padding:64px 70px">
    <div style="display:flex;align-items:flex-end;gap:26px"><div style="font:900 70px Unbounded;line-height:1">Онлайн сургалт Reel</div>
      <div style="font:800 32px Manrope;color:#f0561e;padding-bottom:6px">storyboard · look A</div>
      <div style="margin-left:auto;font:800 26px Manrope;color:#8a8378;padding-bottom:8px">HML Academy · 9:16 · about ${Math.round(O(38.1) + END)} s · edited from the 42 s take</div></div>
    <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr 1.25fr;gap:34px;margin:36px 0 50px;padding:30px 34px;background:#fff;border-radius:22px;box-shadow:0 6px 20px rgba(20,30,60,.08)">
      <div><div style="font:900 26px Unbounded;margin-bottom:14px">Captions</div>
        <div style="font:600 22px/1.45 Manrope;color:#3b3a44">Navy sticker labels with a white border and a hard orange shadow, 1 to 3 words, timed word by word to his voice (Whisper). The key word turns orange with a squiggle. Captions sit on his T-shirt; cards sit on the wall above his head; nothing in the Reels buttons or the bottom bar.</div></div>
      <div><div style="font:900 26px Unbounded;margin-bottom:14px">Colour and type</div>
        <div style="display:grid;gap:10px">${sw('#14295a', 'HML navy')}${sw('#ff6a2b', 'HML orange')}${sw('#c9a173', 'Kraft (cups, tape, tags)')}${sw('#f8f2e4', 'Notebook paper')}</div>
        <div style="margin-top:14px;font:900 30px Unbounded">Unbounded <span style="font:800 26px Manrope">+ Manrope</span></div></div>
      <div><div style="font:900 26px Unbounded;margin-bottom:14px">Motion</div>
        <div style="font:600 22px/1.45 Manrope;color:#3b3a44">Cards slap on with a rotation snap and bounce, landing on the word. Marker strikes, ticks and circles draw on. Stamps slam with a small punch in. Full-screen pages shrink up into the card spot. One signature transition: the steam wipe.</div></div>
      <div><div style="font:900 26px Unbounded;margin-bottom:14px">Music and sound</div>
        <div style="font:600 22px/1.45 Manrope;color:#3b3a44">An original warm "morning café" track at about 100 BPM: nylon guitar and upright piano over pizzicato bass, brushes and shaker, with glockenspiel and vibraphone sparkles on the cards. It starts on frame one, sits well under his voice and ducks around words, swells into each steam wipe and resolves on the end card. His voice stays exactly as recorded. CC0 samples, safe for ads.</div></div>
    </div>
    ${row(P.slice(0, 4), 0)}<div style="height:56px"></div>${row(P.slice(4, 8), 4)}<div style="height:56px"></div>${row(P.slice(8), 8, cut)}</div>`;
  await Promise.all([...stage.querySelectorAll('img')].map((im) => im.decode()));
}
export function frame() {}
