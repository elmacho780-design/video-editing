// Style frames: ?view=frames&o=cut|pen|type&f=1..4, each candidate series look on the same four moments of Day 1, with the same subtitles.
import { MOMENTS } from './common.js';

export async function init(q) {
  const look = await import(`./${q.get('o') || 'cut'}.js`);
  const f = +(q.get('f') || 1);
  document.head.insertAdjacentHTML('beforeend', `<style>${look.css}</style>`);
  document.getElementById('stage').innerHTML = look.frames[f](MOMENTS[f - 1]);
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  await new Promise((r) => setTimeout(r, 300));
}
export function frame() {}
