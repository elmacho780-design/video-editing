// The comparison sheet: ?view=board at 2360x3520. Three looks (rows) x four beats (columns), from the stills in stills/.
import { LOOKS } from './looks.js';
export const DUR = 1;
const COLS = ['1 · The hook (0 s)', '2 · The books (7 s)', '3 · Enrolment (20 s)', '4 · Contact (29 s)'];
const ABOUT = {
  a: 'Wooden toy alphabet blocks and painted planks: a kids’ ABC class you can touch. Music: a toy-box tune (marimba, xylophone, pizzicato).',
  b: 'Bold, fast type with speed trails, a racing progress bar and calendar pages (365 days to 30). Music: a driving beat with brass stabs that hits every number.',
  c: 'A child’s crayon drawing over the film: handwriting, circles round the books, stars and arrows. Music: ukulele, whistling and claps, like a class song.',
};
let st;
export async function init() {
  st = document.getElementById('stage');
  st.style.width = '2360px'; st.style.height = '3520px'; st.style.background = '#14295a';
}
export async function frame() {
  let g = `<div class="abs" style="left:40px;top:30px;font:900 60px Montserrat;color:#fff">Weekend classes Reel · three looks</div>`;
  COLS.forEach((c, i) => { g += `<div class="abs" style="left:${40 + i * 580}px;top:120px;font:800 34px Manrope;color:#ffb02e">${c}</div>`; });
  ['a', 'b', 'c'].forEach((k, r) => {
    const y = 180 + r * 1100;
    g += `<div class="abs" style="left:40px;top:${y}px;font:900 44px Montserrat;color:#fff">${LOOKS[k].name}</div>`
      + `<div class="abs" style="left:40px;top:${y + 58}px;width:2280px;font:600 30px Manrope;color:#cfd7e6">${ABOUT[k]}</div>`;
    for (let i = 0; i < 4; i++) g += `<img src="stills/${k}${i}.jpg" style="position:absolute;left:${40 + i * 580}px;top:${y + 112}px;width:540px;height:960px;border-radius:18px">`;
  });
  st.innerHTML = g;
  await Promise.all([...st.querySelectorAll('img')].map((x) => x.decode().catch(() => {})));
}
