// The comparison sheet: ?view=board at 2360x2140. Three looks side by side: the full list on the real frame, and a close-up of it.
import { LOOKS } from './looks.js';
export const DUR = 1;
const TITLE = { a: ['A · Paper-cut', 'the Daily English series look'], b: ['B · Notebook stickers', 'the olympiad and online-course ads'], c: ['C · ABC blocks', 'the weekend-classes ad'] };
let st;
export async function init() {
  st = document.getElementById('stage');
  st.style.width = '2360px'; st.style.height = '2140px'; st.style.background = '#14295a';
}
export async function frame() {
  let g = `<div class="abs" style="left:40px;top:30px;font:900 56px Montserrat;color:#fff">Linking words Reel · three looks</div>
    <div class="abs" style="left:40px;top:106px;width:2280px;font:600 30px Manrope;color:#cfd7e6">The reference's list format: each phrase appears as she says it, English with its Mongolian underneath, and stays on. The list builds up above her head, clear of her face.</div>`;
  ['a', 'b', 'c'].forEach((k, c) => {
    const x = 40 + c * 780;
    g += `<div class="abs" style="left:${x}px;top:180px;font:900 40px Montserrat;color:#ffb02e">${TITLE[k][0]}</div>
      <div class="abs" style="left:${x}px;top:232px;font:600 28px Manrope;color:#cfd7e6">${TITLE[k][1]}</div>
      <img src="stills/${k}1.jpg" style="position:absolute;left:${x}px;top:290px;width:720px;height:1280px;border-radius:16px">
      <div class="abs" style="left:${x}px;top:1610px;width:720px;height:458px;overflow:hidden;border-radius:16px">
        <img src="stills/${k}1.jpg" style="position:absolute;left:-30px;top:-158px;width:810px;height:1440px"></div>`;
  });
  st.innerHTML = g;
  await Promise.all([...st.querySelectorAll('img')].map((x) => x.decode().catch(() => {})));
}
