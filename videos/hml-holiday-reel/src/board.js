// The comparison sheet: five candidate looks as rows, the same three moments as columns.
// Render: still.mjs <project> 0 --size 2440x5360 --q 'view=board'
import { MOMENTS } from './common.js';

const LOOKS = [
  { o: 'lvl', n: 1, name: 'Level Up', tag: 'The class levels them up, so the Reel is a video game',
    about: 'A game screen over the footage: a level badge and an XP bar that fills as he talks, captions as an RPG dialogue box, a stats screen for the wasted week, the 7 days as a level map, and "LEVEL UP!" with +10% and +20% score pops.',
    motion: 'Pixel boxes snap on frame by frame (no smooth easing), the XP bar ticks up in blocks, score numbers bounce, a light burst on LEVEL UP.',
    music: 'A bouncy game tune played on real instruments (glockenspiel, marimba, pizzicato strings): no synth noise.', sw: [['#0b1530', 'Night navy'], ['#ffb02e', 'Amber'], ['#ff6a2b', 'HML orange'], ['#ffffff', 'White']], type: 'Press Start 2P (pixel)' },
  { o: 'phone', n: 2, name: 'Screen time', tag: 'It starts where the problem is: the phone',
    about: 'It opens on the phone\'s screen-time report for the holiday week, every day full. Then clean app cards tell the rest: a calendar with all seven days and 15:00, a progress-test chart going up. Captions are chat bubbles from HML.',
    motion: 'Cards slide up like phone widgets, bars grow, the chart line draws on, numbers count up.',
    music: 'A light, modern pop groove; soft taps and pops as cards land.', sw: [['#ffffff', 'App white'], ['#14295a', 'Navy'], ['#ff6a2b', 'HML orange'], ['#eef3fb', 'Soft blue']], type: 'Unbounded, Montserrat + Manrope' },
  { o: 'bold', n: 3, name: 'Big bold captions', tag: 'The high-energy Reels look',
    about: 'Huge one or two word captions with a thick outline, the key word in amber, a punch-in on every sentence, a few icon stickers, almost no cards. The fastest to make and the most "viral" grammar, but the least unique to HML.',
    motion: 'Each word slams in on its syllable, the picture punches in and out, stickers spin on.',
    music: 'A driving upbeat track with hits on every punch-in.', sw: [['#ffffff', 'White'], ['#ffc23d', 'Amber'], ['#ff6a2b', 'HML orange'], ['#0b1530', 'Ink outline']], type: 'Unbounded, Montserrat Black' },
  { o: 'doodle', n: 4, name: 'Doodles', tag: 'Hand-drawn marker over the video',
    about: 'White and orange marker scribbles animate around him: a doodled phone scribbled out, arrows, stars, a hand-drawn week with every day ticked, a graph going up. Playful and personal, fits a kids\' class.',
    motion: 'Every line draws itself on in about a third of a second, with a slight hand-made wobble; words are written in, not typed.',
    music: 'A light acoustic tune (ukulele, glockenspiel); a soft pencil-like tick on each doodle, played on real instruments.', sw: [['#ffffff', 'Marker white'], ['#ff6a2b', 'HML orange'], ['#ffc23d', 'Amber'], ['#14295a', 'Navy']], type: 'Caveat (handwriting)' },
  { o: 'poster', n: 5, name: 'Poster campaign', tag: 'Your A3 3+1 poster, in motion',
    about: 'A cream header panel with a diagonal edge, the golden plane and dots, giant cropped orange type, Montserrat Black with an outlined word, the round stamp. The Reel and the print poster read as one HML campaign.',
    motion: 'The panel wipes down on the diagonal, giant letters slide in from the edges, the stamp thumps on.',
    music: 'A warm, confident groove with hits as the big type lands.', sw: [['#f6f0e4', 'Cream'], ['#ffc23d', 'Sun'], ['#f26a1b', 'Fire'], ['#0a2f52', 'Navy']], type: 'Montserrat Black + Outline' },
];

export async function init() {
  const stage = document.getElementById('stage');
  Object.assign(stage.style, { width: '2440px', height: '5360px', background: '#f6f1ea', color: '#14295a' });
  const sw = ([c, n]) => `<div style="display:flex;align-items:center;gap:10px"><span style="width:40px;height:40px;border-radius:11px;background:${c};box-shadow:0 0 0 2px rgba(20,41,90,.12)"></span><span style="font:700 21px Manrope">${n}</span></div>`;
  const row = (L, k) => `<div style="display:flex;gap:36px;align-items:flex-start;margin-top:${k ? 56 : 0}px">
    <div style="width:640px;flex:none;padding-top:6px">
      <div style="display:flex;align-items:center;gap:18px"><span style="width:86px;height:86px;border-radius:24px;background:#14295a;color:#fff;display:grid;place-items:center;font:900 52px Unbounded, Montserrat">${L.n}</span>
        <div><div style="font:900 40px/1.1 Unbounded, Montserrat">${L.name}</div><div style="font:800 24px Manrope;color:#f0561e;margin-top:6px">${L.tag}</div></div></div>
      <div style="margin-top:22px;font:600 24px/1.45 Manrope;color:#33374a">${L.about}</div>
      <div style="margin-top:14px;font:600 24px/1.45 Manrope;color:#33374a"><b style="color:#14295a">Motion</b> ${L.motion}</div>
      <div style="margin-top:14px;font:600 24px/1.45 Manrope;color:#33374a"><b style="color:#14295a">Music</b> ${L.music}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px">${L.sw.map(sw).join('')}</div>
      <div style="margin-top:14px;font:800 22px Manrope;color:#8a8378">${L.type}</div></div>
    ${MOMENTS.map((m, i) => `<img src="stills/looks/${L.o}${i + 1}_0.jpg" style="width:520px;height:924px;border-radius:18px;box-shadow:0 12px 28px rgba(20,30,60,.22);display:block">`).join('')}</div>`;
  stage.innerHTML = `<div style="padding:64px 70px">
    <div style="display:flex;align-items:flex-end;gap:26px"><div style="font:900 70px Unbounded, Montserrat;line-height:1">Амралтын анги Reel</div>
      <div style="font:800 32px Manrope;color:#f0561e;padding-bottom:6px">five fresh looks</div>
      <div style="margin-left:auto;font:800 24px Manrope;color:#8a8378;padding-bottom:8px">HML Academy · 9:16 · about 34 s · same three moments, same captions</div></div>
    <div style="display:flex;gap:36px;margin:40px 0 22px"><div style="width:640px;flex:none"></div>
      ${MOMENTS.map((m, i) => `<div style="width:520px;font:800 26px Manrope"><span style="font:900 32px Unbounded, Montserrat;color:#f0561e">${i + 1}</span> ${m.name}</div>`).join('')}</div>
    ${LOOKS.map(row).join('')}
    <div style="margin-top:44px;padding:22px 28px;background:#fff;border-radius:18px;font:600 23px/1.5 Manrope;color:#33374a;box-shadow:0 6px 20px rgba(20,30,60,.08)">
      <b style="color:#14295a">Notes.</b> Captions are his own words (timed word by word in the edit). Card text is written by Claude: please check the Mongolian. The dates and time (11 сарын 2–8, өдөр бүр 15:00) are added on screen because he doesn't say them. Cards stay above his head and captions on his chest, clear of the Reels buttons. Any look can be mixed with another (for example Level Up cards with big bold captions).</div>
  </div>`;
  await Promise.all([...stage.querySelectorAll('img')].map((im) => im.decode()));
}
export function frame() {}
