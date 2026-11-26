// The comparison sheet: ?view=board at 2360x3520. Three skins (rows) x four moments (columns), from the stills in stills/.
import { LOOKS } from './looks.js';
export const DUR = 1;
const COLS = ['1 · The hook (first second)', '2 · A method’s big card', '3 · Its verdict', '4 · The finished board'];
let st;
export async function init() {
  st = document.getElementById('stage');
  st.style.width = '2360px'; st.style.height = '3520px'; st.style.background = '#14295a';
}
export async function frame() {
  let g = `<div class="abs" style="left:40px;top:30px;font:900 56px Montserrat;color:#fff">Tier-list Reel · three skins, the reference's split-screen format</div>`;
  COLS.forEach((c, i) => { g += `<div class="abs" style="left:${40 + i * 580}px;top:118px;font:800 32px Manrope;color:#ffb02e">${c}</div>`; });
  ['a', 'b', 'c'].forEach((k, r) => {
    const y = 180 + r * 1100;
    g += `<div class="abs" style="left:40px;top:${y}px;font:900 44px Montserrat;color:#fff">${LOOKS[k].name}<span style="font:600 30px Manrope;color:#cfd7e6;margin-left:20px">${LOOKS[k].from}</span></div>`;
    for (let i = 0; i < 4; i++) g += `<img src="stills/${k}${i}.jpg" style="position:absolute;left:${40 + i * 580}px;top:${y + 70}px;width:540px;height:960px;border-radius:18px">`;
  });
  st.innerHTML = g;
  await Promise.all([...st.querySelectorAll('img')].map((x) => x.decode().catch(() => {})));
}
