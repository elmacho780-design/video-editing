// The comparison sheet: three candidate series looks as rows, the same four moments of Day 1 as columns.
// Render: still.mjs <project> 0 --size 2440x2800 --q 'view=board'
import { MOMENTS } from './common.js';

const LOOKS = [
  { o: 'cut', n: 1, name: 'Paper-cut', tag: 'Words cut from paper, with real depth',
    about: 'Every element is cut from coloured paper and layered: a navy ground, orange and amber paper waves, words on paper tiles, a red paper ✗ and a green paper ✓. In motion, tiles drop in with a little bounce, and scissors snip the wrong word out of the sentence. Fresh for HML, tactile and premium.',
    flex: 'Levels stack as paper tiles, timers are paper dials, timelines are paper strips: it suits every animated series.' },
  { o: 'pen', n: 2, name: 'Red pen', tag: 'The teacher marking the page',
    about: 'The HML notebook family: ruled paper, the English typed in navy on an amber highlighter, the teacher\'s red pen circling, striking and ticking, Mongolian notes handwritten in pencil, a red rubber stamp for the series name. Familiar from the olympiad and online Reels.',
    flex: 'Natural for mistakes and quizzes; the closest to what HML already posts.' },
  { o: 'type', n: 3, name: 'Bold type', tag: 'Big flat kinetic type in the poster\'s palette',
    about: 'Pure type and colour, no texture: giant Montserrat Black words on navy, the English in sun yellow, the wrong word outlined and slashed, the fix on a yellow block with a round ✓ badge. Fast, modern and matched to the 3+1 poster.',
    flex: 'The quickest to produce every day; the least hand-made feel.' },
];

export async function init() {
  const stage = document.getElementById('stage');
  Object.assign(stage.style, { width: '2440px', height: '2800px', background: '#f6f1ea', color: '#14295a' });
  const row = (L, k) => `<div style="display:flex;gap:30px;align-items:flex-start;margin-top:${k ? 54 : 0}px">
    <div style="width:560px;flex:none;padding-top:6px">
      <div style="display:flex;align-items:center;gap:18px"><span style="width:86px;height:86px;border-radius:24px;background:#14295a;color:#fff;display:grid;place-items:center;font:900 50px Montserrat">${L.n}</span>
        <div><div style="font:900 42px/1.1 Montserrat">${L.name}</div><div style="font:800 24px Manrope;color:#f0561e;margin-top:6px">${L.tag}</div></div></div>
      <div style="margin-top:22px;font:600 24px/1.45 Manrope;color:#33374a">${L.about}</div>
      <div style="margin-top:14px;font:600 24px/1.45 Manrope;color:#33374a"><b style="color:#14295a">For the whole series</b> ${L.flex}</div></div>
    ${MOMENTS.map((m, i) => `<img src="stills/looks/${L.o}${i + 1}_0.jpg" style="width:420px;height:747px;border-radius:18px;box-shadow:0 12px 28px rgba(20,30,60,.22);display:block">`).join('')}</div>`;
  stage.innerHTML = `<div style="padding:64px 70px">
    <div style="display:flex;align-items:flex-end;gap:26px"><div style="font:900 64px Montserrat;line-height:1">Daily English · Day 1</div>
      <div style="font:800 30px Manrope;color:#f0561e;padding-bottom:6px">"I am agree" vs "I agree" · three looks for the series</div></div>
    <div style="display:flex;gap:30px;margin:40px 0 22px"><div style="width:560px;flex:none"></div>
      ${MOMENTS.map((m, i) => `<div style="width:420px;font:800 25px Manrope"><span style="font:900 30px Montserrat;color:#f0561e">${i + 1}</span> ${m.name}</div>`).join('')}</div>
    ${LOOKS.map(row).join('')}
    <div style="margin-top:44px;padding:22px 28px;background:#fff;border-radius:18px;font:600 23px/1.5 Manrope;color:#33374a;box-shadow:0 6px 20px rgba(20,30,60,.08)">
      <b style="color:#14295a">Notes.</b> The chosen look becomes the style sheet for every animated day. English is in its own colour, separate from the Mongolian; key text sits in the middle third; each example stays on screen for at least 2 seconds; a soft pop only on reveals and answers.
      The subtitle line shows Batu's voiceover (timed to his recording). All Mongolian here is written by Claude: please check.</div>
  </div>`;
  await Promise.all([...stage.querySelectorAll('img')].map((im) => im.decode()));
}
export function frame() {}
