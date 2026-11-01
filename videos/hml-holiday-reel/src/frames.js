// Style frames: ?view=frames&o=lvl|phone|bold|doodle|poster&f=1..3, each look mocked up on the same three stills from his footage, with the same captions.
import { MOMENTS, footage } from './common.js';

export async function init(q) {
  const look = await import(`./${q.get('o') || 'a'}.js`);
  const m = MOMENTS[+(q.get('f') || 1) - 1];
  const zoom = look.zoom ? look.zoom(m) : { s: 1.02 };
  document.head.insertAdjacentHTML('beforeend', `<style>${look.css}</style>`);
  document.getElementById('stage').innerHTML = footage(m.still, zoom) + look.frames[+(q.get('f') || 1)](m);
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  await new Promise((r) => setTimeout(r, 300));
}
export function frame() {}
