// Style frames: ?view=frames&look=a|b|c. t = 0, 1, 2, 3 shows that beat of the look on its frame of the (flipped) take.
import { LOOKS, BEATS } from './looks.js';
export const DUR = 4;
let st, L;
export async function init(q) {
  L = LOOKS[q.get('look') || 'a'];
  document.head.insertAdjacentHTML('beforeend', `<style>${L.css}</style>`);
  st = document.getElementById('stage');
}
export async function frame(t) {
  const i = Math.max(0, Math.min(3, Math.floor(t + 1e-6))), b = BEATS[i];
  st.innerHTML = `<img src="frames/${String(b.frame).padStart(5, '0')}.jpg" style="position:absolute;left:0;top:0;width:1080px;height:1920px">` + L.beats[i]();
  await Promise.all([...st.querySelectorAll('img')].map((x) => x.decode().catch(() => {})));
}
