// HML holiday-class Reel: helpers and icons shared by the five candidate looks (lvl, phone, bold, doodle, poster).
// Coordinates are page pixels on the 1080x1920 stage. His face sits about y 840 to 1230: cards go above his head, captions on his chest.

export const clamp = (x) => Math.max(0, Math.min(1, x));
export const backOut = (u, k = 2.2) => { u = clamp(u); return 1 + (k + 1) * (u - 1) ** 3 + k * (u - 1) ** 2; };
export const easeOut = (u) => 1 - (1 - clamp(u)) ** 3;
export const CAP_Y = 1330;
export const kw = (t, cls = 'kw') => t.replace(/\*(.+?)\*/g, `<span class="${cls}">$1</span>`);
export const footage = (src, { s = 1, x = 0, y = 0 } = {}) =>
  `<div class="footage" style="background-image:url(${src});transform:translate(${x}px,${y}px) scale(${s})"></div><div class="grade"></div>`;

// the three style-frame moments (source seconds from Whisper, edit/align.json) and his words there
export const MOMENTS = [
  { still: 'stills/src/f_hook.jpg', name: 'Hook: a week on the phone', cap: '*утсаа* ширтээд' },
  { still: 'stills/src/f_offer.jpg', name: 'The level-up class', cap: 'түвшин ахиулах *анги*' },
  { still: 'stills/src/f_result.jpg', name: 'Grades up 10 to 20%', cap: 'дүнгээ *10, 20 хувиар*' },
];
// the class: 2 to 8 November (Monday to Sunday), every day from 15:00
export const DAYS = [['Да', 2], ['Мя', 3], ['Лх', 4], ['Пү', 5], ['Ба', 6], ['Бя', 7], ['Ня', 8]];

const P = {
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  clock: '<circle cx="12" cy="12.5" r="8.5"/><path d="M12 8v4.8l3 1.8"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  up: '<path d="M4 17l6-6 4 4 6-7"/><path d="M15 8h5v5"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z"/>',
  game: '<path d="M7 9h10a4 4 0 0 1 4 4v1a3 3 0 0 1-5.3 1.9L14.5 14h-5l-1.2 1.9A3 3 0 0 1 3 14v-1a4 4 0 0 1 4-4z"/><path d="M8 11v3M6.5 12.5h3"/><circle cx="16" cy="12" r=".6"/><circle cx="17.5" cy="13.5" r=".6"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10.5l5-3v9l-5-3z"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
  phoneCall: '<path d="M21 16.4v2.9a1.9 1.9 0 0 1-2.1 1.9A18.9 18.9 0 0 1 2.8 5.1 1.9 1.9 0 0 1 4.7 3h2.9a1.9 1.9 0 0 1 1.9 1.6c.1.9.4 1.8.7 2.7a1.9 1.9 0 0 1-.4 2L8.5 10.6a15.2 15.2 0 0 0 5.7 5.7l1.3-1.3a1.9 1.9 0 0 1 2-.4c.9.3 1.8.6 2.7.7a1.9 1.9 0 0 1 1.6 1.9z"/>',
};
export const icon = (name, { s = 40, c = 'currentColor', w = 2.3, fill = 'none' } = {}) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${P[name]}</svg>`;
