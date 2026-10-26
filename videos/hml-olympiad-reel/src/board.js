// Storyboard sheet: the ten style frames with timing, picture, captions, motion and sound, plus the style legend.
// Render: still.mjs <project> 0 --size 2440x3200 --q 'view=board'
const P = [
  { t: '0:00–0:04', src: '1.0–5.3', name: 'Hook', pic: 'Opens mid-sentence on a 108% punch-in. A notebook-paper card slaps on above her, held by washi tape: a hand-drawn route from Өнөөдөр to Олимпиад, the 1, 3, 6 сар stamps filling orange as she says "3–6 сарын".', cap: 'Танай хүүхдийг · *3–6 сарын* · англи хэлийг нь · *эрчимтэй* бэлдэж', snd: 'Music starts on frame one: marimba and claps.' },
  { t: '0:04–0:08', src: '5.6–9.2', name: 'Not one, several', pic: 'On "нэг биш" a single medal is crossed out with a hand-drawn X, then four medals stamp on one by one on "нэлээд хэдэн". Ends on a two-tier question: a sticker above a big paper ticket.', cap: 'олон улсын · нэг биш, · нэлээд *хэдэн* олимпиад · оролцуулбал / *ямар вэ?*', snd: 'A glass tick as each medal lands.' },
  { t: '0:08–0:12', src: '9.4–13.5', name: 'Try several', pic: 'A slow push. The HML tree is drawn on a taped paper card: one trunk, "1 бэлтгэл", branching into four medals.', cap: 'Нэгэнт л сайн бэлдэж · байгаа юм чинь · хэд хэдэн *олимпиадад* · *сориод үзсэн* нь дээр', snd: 'A rising run as the branches grow.' },
  { t: '0:12–0:20', src: '13.8–22.6', name: 'The four olympiads', pic: 'Full-screen graph-paper page. Her face becomes a taped round photo sticker. The four olympiads slap onto the page as numbered stickers exactly as she names each, and a hand-drawn orange tick writes on beside each.', cap: 'The tiles carry the names, with no caption pill: SOF · SILVERZONE · HIPPO · USA Olympiad', snd: 'One rising note per tile.' },
  { t: '0:20', src: '22.6–22.9', name: 'Bloom wipe', pic: 'HML signature transition: the branches of the HML logo tree draw up from the bottom, flowers pop open, and the next shot blooms through them. About 0.4 s.', cap: 'none', snd: 'A soft paper whoosh and a swell.' },
  { t: '0:20–0:26', src: '22.9–28.6', name: 'Our focus', pic: 'A navy ribbon band scrolls "ОЛИМПИАДЫН БЭЛТГЭЛ ✦ HML ACADEMY" across the top, and an orange HML rubber stamp slams onto the wall on "төвлөрч" with a punch-in.', cap: 'Манай сургалтын төв нь · сурагчдыг · *олон улсын олимпиад* · бэлтгэхэд · илүүтэй *төвлөрч* ажилладаг', snd: 'Music thins out under her.' },
  { t: '0:26–0:32', src: '28.85–35.1', name: 'Contact', pic: 'A taped paper card with a split-flap board: both numbers flip in digit by digit like an airport departures board, with a "доор ↓" sticker. Then a sky-blue "Мессеж бичих" sticker slaps on.', cap: 'Хэрэв та · илүү их мэдээлэл · авахыг хүсвэл · утасны *дугаарт* · холбогдож, · мөн *мессеж* бичиж', snd: 'Soft key clicks while the numbers type.' },
  { t: '0:32–0:34', src: '35.3–37.4', name: 'The shout (comic)', pic: 'A hard crash zoom on her face with a 3-frame shake. Speed lines snap in and the voice from behind the camera slams in as huge comic words, one per beat. A tag points off-screen: "камерын цаанаас →". On "Аан тийм" a 💡 pops.', cap: '3 ДЭЭР · НЭМЭХ НЬ · 1-ЭЭ · ХЭЛСИЙМ ҮҮ?!   then   Аан *тийм!*', snd: 'Music cuts dead for the shout, with a cartoon "boing" on the zoom. A ding on 💡, and the music snaps back.' },
  { t: '0:34–0:41', src: '37.4–44.1', name: 'The 3+1 offer', pic: 'Three tear-off calendar pages drop in (1, 2, 3 сар), then an orange "+1 сар" page lands with an "ҮНЭГҮЙ" sticker and paper confetti.', cap: 'манайд бас · *3+1* буюу · 3 сараар нь бүртгүүлээд / *1 сар ҮНЭГҮЙ* · хөтөлбөр явагдаж байна', snd: 'A glockenspiel sparkle on the gift tile.' },
  { t: '0:41–0:43', src: '44.3–45.6', name: 'End card', pic: 'Bloom wipe onto a graph-paper end card: the logo taped on, the split-flap numbers, @hml_english and 3+1 stickers. She waves from a photo sticker. The last frame cuts cleanly back to frame one.', cap: 'За, *амжилт хүсье!*', snd: 'Music comes forward with a final chord at the loop point.' },
];
const keyed = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*(.+?)\*/g, '<b style="background:linear-gradient(100deg,#f0561e,#f7931e);color:#fff;border-radius:8px;padding:0 8px">$1</b>');

export async function init() {
  const stage = document.getElementById('stage');
  Object.assign(stage.style, { width: '2440px', height: '3200px', background: '#f6f1ea', color: '#1b3566' });
  const panel = (p, i) => `<div style="width:428px">
    <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:10px"><span style="font:900 40px Unbounded;color:#f0561e">${i + 1}</span>
      <span style="font:800 28px Manrope">${p.name}</span><span style="margin-left:auto;font:800 22px Manrope;color:#8a8378">${p.t}</span></div>
    <img src="stills/sf${i + 1}_0.jpg" style="width:428px;height:761px;display:block;border-radius:16px;box-shadow:0 10px 26px rgba(20,30,60,.2)">
    <div style="margin-top:14px;font:600 22px/1.4 Manrope;color:#3b3a44">
      <div style="color:#8a8378;font-weight:800;font-size:19px">SOURCE ${p.src} s</div>
      <div style="margin-top:6px">${keyed(p.pic)}</div>
      <div style="margin-top:10px;padding:10px 12px;background:#fff;border-left:5px solid #f7931e;border-radius:6px;font-weight:800;color:#1b3566">${keyed(p.cap)}</div>
      <div style="margin-top:8px"><b>Sound</b> ${keyed(p.snd)}</div></div></div>`;
  const row = (a, o) => `<div style="display:flex;gap:44px;align-items:flex-start">${a.map((p, i) => panel(p, i + o)).join('')}</div>`;
  const sw = (c, n) => `<div style="display:flex;align-items:center;gap:10px"><span style="width:54px;height:54px;border-radius:14px;background:${c};box-shadow:0 2px 6px rgba(0,0,0,.15)"></span><span style="font:700 22px Manrope">${n}</span></div>`;
  stage.innerHTML = `<div style="padding:64px 70px">
    <div style="display:flex;align-items:flex-end;gap:26px"><div style="font:900 70px Unbounded;line-height:1">Олимпиад Reel</div>
      <div style="font:800 32px Manrope;color:#f0561e;padding-bottom:6px">storyboard and style</div>
      <div style="margin-left:auto;font:800 26px Manrope;color:#8a8378;padding-bottom:8px">HML Academy · 9:16 · about 42 s · edited from the 46 s take</div></div>
    <div style="display:grid;grid-template-columns:1.25fr 1fr 1fr 1fr;gap:34px;margin:36px 0 50px;padding:30px 34px;background:#fff;border-radius:22px;box-shadow:0 6px 20px rgba(20,30,60,.08)">
      <div><div style="font:900 26px Unbounded;margin-bottom:14px">Captions</div>
        <div style="font:600 22px/1.45 Manrope;color:#3b3a44">Navy sticker labels with a thick white border and a hard orange shadow, 1 to 3 words, word-timed to her voice. The keyword turns orange with a hand-drawn squiggle under it. Each caption snaps on with a small tilt and bounce; tilts alternate. Questions and the offer use a small sticker above a big paper ticket.</div></div>
      <div><div style="font:900 26px Unbounded;margin-bottom:14px">Colour and type</div>
        <div style="display:grid;gap:10px">${sw('#14295a', 'HML navy')}${sw('#ff6a2b', 'HML orange')}${sw('#4ea3ff', 'Sky blue tape and stickers')}${sw('#f8f2e4', 'Notebook paper')}</div>
        <div style="margin-top:14px;font:900 30px Unbounded">Unbounded <span style="font:800 26px Manrope">+ Manrope</span></div></div>
      <div><div style="font:900 26px Unbounded;margin-bottom:14px">Motion</div>
        <div style="font:600 22px/1.45 Manrope;color:#3b3a44">"HML notebook": paper cards, washi tape, stickers, rubber stamps, hard shadows, no glass and no blur. Graphics slap on with a rotation snap and bounce, landing on the word. Cards sit in the wall above her head, captions on her sweater. Pauses trimmed, jump cuts hidden with punch-ins. One signature transition, the bloom wipe.</div></div>
      <div><div style="font:900 26px Unbounded;margin-bottom:14px">Music and sound</div>
        <div style="font:600 22px/1.45 Manrope;color:#3b3a44">An original bright track at 112 BPM: marimba, pizzicato, light claps and shaker, glockenspiel sparkles. It sits about 20 dB under her voice and ducks around words. Swells into each wipe, stops dead for the shout, and comes forward on the end card. CC0 samples, safe for ads.</div></div>
    </div>
    ${row(P.slice(0, 5), 0)}<div style="height:56px"></div>${row(P.slice(5), 5)}</div>`;
  await Promise.all([...stage.querySelectorAll('img')].map((im) => im.decode()));
}
export function frame() {}
