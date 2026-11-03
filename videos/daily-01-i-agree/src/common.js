// Daily English Day 1 ("I am agree" vs "I agree"): what the three candidate looks share.
// Stage 1080x1920. Key text in the middle third (y 640 to 1280); the series tag just above it; the VO subtitle below it;
// top 220, bottom 380 and right 140 px kept clear of key text.

export const clamp = (x) => Math.max(0, Math.min(1, x));
export const SUB_Y = 1410;                       // the voiceover subtitle line

// the four style-frame moments, from SCRIPT.md (Mongolian by Claude: Batu to check)
export const MOMENTS = [
  { key: 'hook', name: 'Hook: the mistake', sub: '“I am agree” гэж битгий хэлээрэй!' },
  { key: 'why', name: 'Why Mongolians say it', sub: '“байна”-г am гэж орчуулчихдаг' },
  { key: 'fix', name: 'The fix', sub: 'Зөв нь: I agree.' },
  { key: 'pair', name: 'An example pair', sub: 'Асуухдаа: Do you agree?' },
];
export const SERIES = 'STOP SAYING THIS';
export const DAY = 'Day 1';
