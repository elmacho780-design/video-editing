// The tier-list Reel's building blocks, in the reference video's grammar (a split screen: the teacher on top, a tier board below
// that fills in as she ranks; a big card of each method when she introduces it, which then flies down into its tier), drawn in our
// own looks. Three skins are offered: ABC blocks, paper-cut, notebook stickers.
// Layout (1080 x 1920): the footage window is the top 960 px (a straight crop of the landscape take, never scaled); the board is the
// bottom half, with its rows inside y 1040-1510 so nothing key sits in Instagram's bottom 380 px or the right-hand 140 px.
// Icons are our own drawings: no app logos or mascots. All Mongolian is Claude's, for Batu to check.

export const TIERS = ['S', 'A', 'B', 'C'];
export const ROW_Y = [1042, 1167, 1292, 1417], ROW_H = 115;
export const ITEMS = [
  { id: 'duo', name: 'Duolingo', mn: 'Апп', tier: 'B', icon: 'phone' },
  { id: 'game', name: 'Видео тоглоом', mn: 'Тоглоом', tier: 'S', icon: 'pad' },
  { id: 'song', name: 'Дуу сонсох', mn: 'Дуу', tier: 'B', icon: 'music' },
  { id: 'gt', name: 'Google Translate', mn: 'Орчуулагч', tier: 'C', icon: 'translate' },
  { id: 'toon', name: 'Хүүхэлдэйн кино', mn: 'Кино', tier: 'S', icon: 'tv' },
  { id: 'words', name: 'Үг цээжлэх', mn: 'Үг цээжлэх', tier: 'C', icon: 'cards' },
  { id: 'hml', name: 'Зөв чиглүүлэгтэй анги', mn: 'HML анги', tier: 'S', icon: 'hml' },
];
// where each item sits in its row (left to right, in the order she ranks them)
export const SLOT = (() => {
  const n = {}, out = {};
  for (const it of ITEMS) { const k = n[it.tier] || 0; n[it.tier] = k + 1; out[it.id] = { x: 182 + k * 186, y: ROW_Y[TIERS.indexOf(it.tier)] + 2 }; }
  return out;
})();

// ---------------------------------------------------------------- icons (our own, flat, two-tone)
export const ICON = {
  phone: (c = '#14295a', a = '#2fae66') => `<svg viewBox="0 0 100 100"><rect x="28" y="8" width="44" height="84" rx="9" fill="${c}"/><rect x="33" y="17" width="34" height="58" rx="3" fill="#fff"/><path d="M40 52 l8 8 l14 -18" fill="none" stroke="${a}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="84" r="4" fill="#fff"/><path d="M58 26 c6 4 6 10 2 14 c4 -2 8 -8 4 -16z" fill="#ff6a2b"/></svg>`,
  pad: (c = '#14295a', a = '#ff6a2b') => `<svg viewBox="0 0 100 100"><path d="M22 34 h56 c12 0 18 10 18 24 c0 14 -6 24 -14 24 c-8 0 -12 -10 -20 -10 h-24 c-8 0 -12 10 -20 10 c-8 0 -14 -10 -14 -24 c0 -14 6 -24 18 -24z" fill="${c}"/><path d="M28 50 v14 M21 57 h14" stroke="#fff" stroke-width="6" stroke-linecap="round"/><circle cx="70" cy="51" r="5" fill="${a}"/><circle cx="80" cy="60" r="5" fill="#ffb02e"/></svg>`,
  music: (c = '#14295a', a = '#ff6a2b') => `<svg viewBox="0 0 100 100"><path d="M18 58 a32 32 0 0 1 64 0" fill="none" stroke="${c}" stroke-width="9"/><rect x="12" y="54" width="18" height="30" rx="7" fill="${c}"/><rect x="70" y="54" width="18" height="30" rx="7" fill="${c}"/><path d="M46 30 v28 a8 8 0 1 1 -6 -7 v-25 l18 -4 v8z" fill="${a}"/></svg>`,
  translate: (c = '#14295a', a = '#4ea3ff') => `<svg viewBox="0 0 100 100"><rect x="8" y="14" width="52" height="52" rx="10" fill="${c}"/><text x="34" y="52" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="34" fill="#fff">A</text><rect x="40" y="36" width="52" height="52" rx="10" fill="${a}"/><text x="66" y="74" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="30" fill="#fff">Аа</text></svg>`,
  tv: (c = '#14295a', a = '#ff6a2b') => `<svg viewBox="0 0 100 100"><path d="M36 10 l14 14 l14 -14" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/><rect x="8" y="24" width="84" height="62" rx="12" fill="${c}"/><rect x="16" y="32" width="68" height="46" rx="6" fill="#4ea3ff"/><path d="M44 44 v22 l18 -11z" fill="#fff"/><circle cx="30" cy="66" r="7" fill="#ffb02e"/><circle cx="27" cy="64" r="1.6" fill="${c}"/><circle cx="33" cy="64" r="1.6" fill="${c}"/></svg>`,
  cards: (c = '#14295a', a = '#ff6a2b') => `<svg viewBox="0 0 100 100"><rect x="14" y="20" width="56" height="40" rx="6" fill="#ffb02e" transform="rotate(-10 42 40)"/><rect x="22" y="30" width="58" height="42" rx="6" fill="#fff" stroke="${c}" stroke-width="4" transform="rotate(4 51 51)"/><text x="51" y="62" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="20" fill="${c}" transform="rotate(4 51 51)">word</text></svg>`,
  hml: () => `<div style="width:100%;height:100%;background:#fff url(assets/hml-tree.png) center/82% no-repeat;border-radius:16px"></div>`,
};
// the tray of methods still to be ranked (bottom strip, inside Instagram's caption zone: decoration, not key content)
export const TRAY_Y = 1590;
export const icon = (name, size) => `<div style="width:${size}px;height:${size}px">${ICON[name]()}</div>`;
