// HML online Reel: helpers, icons and the coffee cup, shared by the three looks (a: notebook, b: online class, c: 3+1 poster).
// Coordinates are page pixels on the 1080x1920 stage. Cards sit above his head (y 230 to 720), captions on his T-shirt.

export const clamp = (x) => Math.max(0, Math.min(1, x));
export const backOut = (u, k = 2.2) => { u = clamp(u); return 1 + (k + 1) * (u - 1) ** 3 + k * (u - 1) ** 2; };
export const easeOut = (u) => 1 - (1 - clamp(u)) ** 3;
export const CAP_Y = 1300;

export const footage = (src, { s = 1, x = 0, y = 0 } = {}) =>
  `<div class="footage" style="background-image:url(${src});transform:translate(${x}px,${y}px) scale(${s})"></div><div class="grade"></div>`;

// the four style-frame moments: source still, what he is saying, the caption (key words in *asterisks*)
export const MOMENTS = [
  { still: 'stills/src/f_2.6.jpg', src: 2.6, name: 'Hook: the morning coffee', cap: '*кофены* мөнгөөр' },
  { still: 'stills/src/f_13.4.jpg', src: 13.4, name: 'Why online', cap: 'манайх *онлайн сургалт*' },
  { still: 'stills/src/f_25.6.jpg', src: 25.6, name: 'Schedule', cap: 'хоёрдох, *дөрөвдөх*' },
  { still: 'stills/src/f_32.4.jpg', src: 32.4, name: 'The 3+1 offer', cap: 'манай *3+1* урамшуулал' },
];
export const kw = (t, cls = 'kw') => t.replace(/\*(.+?)\*/g, `<span class="${cls}">$1</span>`);

// days of the week (Даваа … Ням); classes on Tuesday, Thursday, Saturday ("хоёрдох, дөрөвдөх, хагас сайн")
export const DAYS = ['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня'];
export const ON = [1, 3, 5];
export const PAINS = [['car', 'Хүүхдээ хүргэж өгөх боломжгүй'], ['moon', 'Хичээлээ орой тардаг'], ['school', 'Танхимаар суух боломжгүй']];

// ---------------------------------------------------------------- line icons (24 x 24)
const P = {
  car: '<path d="M4 16.5V12l2.2-5.2A2 2 0 0 1 8 5.5h8a2 2 0 0 1 1.8 1.3L20 12v4.5"/><path d="M3 12h18v4.5H3z"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',
  moon: '<path d="M20 14.6A8.2 8.2 0 1 1 9.4 4a6.6 6.6 0 0 0 10.6 10.6z"/><path d="M16.5 3.5v3M15 5h3"/>',
  school: '<path d="M3 21h18M5 21V10.5L12 6l7 4.5V21"/><path d="M10 21v-4.5h4V21M12 6V2.5h3.5V4H12"/><circle cx="12" cy="11.5" r="1.6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  gift: '<rect x="3.5" y="9" width="17" height="11.5" rx="2"/><path d="M2.5 9h19v-.5M12 9v11.5M12 9c-1.5-4-6-4.5-6-2s4 2 6 2zm0 0c1.5-4 6-4.5 6-2s-4 2-6 2z"/>',
  phone: '<path d="M21 16.4v2.9a1.9 1.9 0 0 1-2.1 1.9A18.9 18.9 0 0 1 2.8 5.1 1.9 1.9 0 0 1 4.7 3h2.9a1.9 1.9 0 0 1 1.9 1.6c.1.9.4 1.8.7 2.7a1.9 1.9 0 0 1-.4 2L8.5 10.6a15.2 15.2 0 0 0 5.7 5.7l1.3-1.3a1.9 1.9 0 0 1 2-.4c.9.3 1.8.6 2.7.7a1.9 1.9 0 0 1 1.6 1.9z"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  clock: '<circle cx="12" cy="12.5" r="8.5"/><path d="M12 8v4.8l3 1.8"/>',
};
export const icon = (name, { s = 40, c = 'currentColor', w = 2.3 } = {}) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${P[name]}</svg>`;

// ---------------------------------------------------------------- the coffee cup
// a takeaway cup: steam, lid, body and sleeve. Colours set per look; stroke 0 draws it flat (the poster look)
export const cup = ({ w = 200, body = '#c9a173', lid = '#f8f2e4', sleeve = '#14295a', steam = '#14295a', stroke = '#14295a', sw = 6, coin = true, steamOn = 1 } = {}) => {
  const st = sw ? `stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"` : '';
  return `<svg width="${w}" height="${w * 1.3}" viewBox="0 0 200 260" style="overflow:visible">
    <g fill="none" stroke="${steam}" stroke-width="${sw ? 7 : 10}" stroke-linecap="round" opacity="${steamOn}">
      <path d="M72 46c-10-12 10-18 0-32"/><path d="M100 50c-12-14 12-20 0-38"/><path d="M128 46c-10-12 10-18 0-32"/></g>
    <path d="M40 92 L160 92 L144 252 Q100 258 56 252 Z" fill="${body}" ${st}/>
    <path d="M45.5 140 L154.5 140 L148.5 200 L51.5 200 Z" fill="${sleeve}" ${st}/>
    ${coin ? `<circle cx="100" cy="170" r="21" fill="#fff" ${sw ? `stroke="${stroke}" stroke-width="3"` : ''}/><image href="assets/hml-tree.png" x="84" y="158" width="32" height="25"/>` : ''}
    <rect x="30" y="74" width="140" height="22" rx="8" fill="${lid}" ${st}/>
    <path d="M44 74 Q48 58 64 58 L136 58 Q152 58 156 74 Z" fill="${lid}" ${st}/>
  </svg>`;
};

// a coffee ring left on the paper by the cup
export const coffeeRing = ({ x, y, r = 70, o = 0.3, seed = 3 } = {}) => `
  <svg class="abs" style="left:${x - r - 20}px;top:${y - r - 20}px" width="${2 * r + 40}" height="${2 * r + 40}">
    <defs><filter id="ring${seed}"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter></defs>
    <g filter="url(#ring${seed})" fill="none" stroke="#7a4a26" opacity="${o}">
      <circle cx="${r + 20}" cy="${r + 20}" r="${r}" stroke-width="7"/>
      <path d="M${r + 20 - r * 0.92} ${r + 20 + r * 0.25} A${r * 0.95} ${r * 0.95} 0 0 1 ${r + 20 + r * 0.6} ${r + 20 - r * 0.72}" stroke-width="3"/></g></svg>`;

// the cut list (source seconds): the five takes without his walks in and out of frame, then a 2 s end card
export const KEEP = [[0.72, 5.75], [6.92, 14.75], [16.18, 22.55], [23.25, 28.25], [29.40, 38.40]];
export const END = 2.0;
export const O = (src) => { let o = 0; for (const [a, b] of KEEP) { if (src <= b) return o + Math.max(0, src - a); o += b - a; } return o; };
