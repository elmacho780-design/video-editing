// Style frames: ?view=frames&look=a|b|c. t = 0: three phrases in, the third just landing (5.2 s); t = 1: the full list (20.8 s).
import { LOOKS, ITEMS, SLOT } from './looks.js';
export const DUR = 2;
const STATES = [{ frame: 156, n: 3 }, { frame: 624, n: 7 }];
let st, L;
export async function init(q) {
  L = LOOKS[q.get('look') || 'a'];
  document.head.insertAdjacentHTML('beforeend', `<style>${L.css}</style>`);
  st = document.getElementById('stage');
}
export async function frame(t) {
  const s = STATES[Math.min(1, Math.floor(t + 1e-6))];
  let g = `<img src="frames/${String(s.frame).padStart(5, '0')}.jpg" style="position:absolute;left:0;top:0;width:1080px;height:1920px">` + L.head();
  for (let i = 0; i < s.n; i++) g += L.item(ITEMS[i], SLOT(i), i, i === s.n - 1 && s.n < 7);
  st.innerHTML = g;
  await Promise.all([...st.querySelectorAll('img')].map((x) => x.decode().catch(() => {})));
}
