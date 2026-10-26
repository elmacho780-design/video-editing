// Style frames for the storyboard: ?view=frames&f=1..10, each a key moment mocked up on a still from the real footage.
import * as U from './ui.js';

const S = (t) => `stills/src/f_${t}.jpg`;
const FRAMES = {
  1: () => U.footage(S('2.3'), { s: 1.08 }) + U.brand() + U.timelineCard({ fill: 0.45 }) + U.cap('*3–6 сарын*'),
  2: () => U.footage(S('7.4')) + U.brand() + U.medalFan() + U.cap('нэлээд *хэдэн* олимпиад', { tilt: 1.5 }),
  3: () => U.footage(S('11.6'), { s: 1.04, y: 60 }) + U.brand() + U.treeDiagram() + U.cap('хэд хэдэн *олимпиадад*'),
  4: () => U.notebookScene(S('18.0'), { named: 3, entering: 0.55, tick: 0.7 }),
  5: (q) => U.bloomWipe(U.notebookScene(S('18.0'), { named: 4 }), U.footage(S('24.8')) + U.ribbon(), +(q.get('p') || 0.66)),
  6: () => U.footage(S('25.6')) + U.ribbon({ shift: 220 }) + U.stamp() + U.cap('*олон улсын* олимпиадад'),
  7: () => U.footage(S('31.8')) + U.brand() + U.phoneBoard({ flipped: 12, y: 128, scale: 0.9 }) + U.chatSticker() + U.cap('утасны *дугаарт*', { tilt: 1.5 }),
  8: () => U.footage(S('35.9'), { s: 1.3, y: 120, r: -3 }) + U.speedLines() +
    U.shout([{ t: '3 ДЭЭР' }, { t: 'НЭМЭХ НЬ' }, { t: '1-ЭЭ', size: 150 }, { t: 'ХЭЛСИЙМ ҮҮ?!', size: 84 }], { y: 170 }),
  9: () => U.footage(S('40.2')) + U.brand() + U.confetti(5, 34) + U.offerCard() + U.twoTier('3 сараар нь бүртгүүлээд', '1 сар ҮНЭГҮЙ'),
  10: () => U.endCard(S('44.6')) + U.cap('За, *амжилт хүсье!*', { y: 1740, tilt: -2 }),
};

export async function init(q) {
  document.getElementById('stage').innerHTML = FRAMES[+(q.get('f') || 1)](q);
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  await new Promise((r) => setTimeout(r, 300));
}
export function frame() {}
