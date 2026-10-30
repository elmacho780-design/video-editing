// Storyboard frames in look A: ?view=story&f=1..11, each a key moment mocked up on a still from his footage.
import { footage } from './common.js';
import * as A from './a.js';

const S = (t) => `stills/src/f_${t}.jpg`;
const shot = (t, z = { s: 1.02 }) => footage(S(t), z);
export const FRAMES = {
  1: () => shot('2.6') + A.brand() + A.hookCard({ eq: 0, book: 0 }) + A.cap('*кофены* мөнгөөр'),
  2: () => shot('4.6') + A.brand() + A.hookCard() + A.ticket('гэвэл ямар', '*сонсогдож* байна?'),
  3: () => A.steamWipe(shot('5.3') + A.brand() + A.hookCard(), A.painsPage(S('10.5'), { rows: [1, 0, 0] }), 0.52),
  4: () => A.painsPage(S('10.5'), { rows: [1, 1, 0.55] }),
  5: () => shot('13.4', { s: 1.06, y: 30 }) + A.brand() + A.painsCard() + A.cap('манайх *онлайн сургалт*', { tilt: 1.5 }),
  6: () => shot('21.3') + A.brand() + A.tagsCard() + A.cap('*бүгд багтсан* байгаа'),
  7: () => A.weekPage(S('26.9')) + A.cap('*Хуваарийн* хувьд', { tilt: 1.5 }),
  8: () => shot('25.6') + A.brand() + A.weekCard({ circles: [1, 1, 0.45] }) + A.cap('хоёрдох, *дөрөвдөх*'),
  9: () => A.loyaltyPage(S('32.4'), { stamps: [1, 1, 0.7], plus: 0, free: 0 }) + A.cap('манай *3+1* урамшуулал', { tilt: 1.5 }),
  10: () => shot('36.3') + A.brand() + A.phoneBoard({ flipped: 11 }) + A.cap('доорх *дугаараар*'),
  11: () => A.endCard(S('37.6')),
};

export async function init(q) {
  document.head.insertAdjacentHTML('beforeend', `<style>${A.css}</style>`);
  document.getElementById('stage').innerHTML = FRAMES[+(q.get('f') || 1)]();
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  await new Promise((r) => setTimeout(r, 300));
}
export function frame() {}
