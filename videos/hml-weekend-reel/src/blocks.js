// Look A, "ABC blocks" (approved): wooden toy alphabet blocks and painted planks over the film, in motion.
// Blocks drop in with a wooden bounce and settle; planks slide in from the side; on the way out they fall away. Nothing jitters once
// it has landed (the blocks are solid wood, and a still picture never looks like a glitch).
// Fonts: Montserrat Black and Manrope (both have the Mongolian Ү and Ө).
export const clamp = (x) => Math.max(0, Math.min(1, x));
export const easeOut = (u) => 1 - (1 - clamp(u)) ** 3;
export const easeIn = (u) => clamp(u) ** 3;
export const backOut = (u, k = 1.7) => { u = clamp(u); return 1 + (k + 1) * (u - 1) ** 3 + k * (u - 1) ** 2; };
// a wooden bounce: falls, hits, bounces once, settles
export const bounce = (u) => { u = clamp(u); if (u < 0.55) return (u / 0.55) ** 2; const v = (u - 0.55) / 0.45; return 1 - 0.12 * Math.sin(Math.PI * v) * (1 - v); };

export const PAL = {
  amber: ['#ffb02e', '#c47a14'], orange: ['#ff7a3d', '#b8420f'], cream: ['#f6eedc', '#cdbb94'], navy: ['#1d3a78', '#0a1636'],
};
export const css = `
.blk { position: absolute; display: flex; align-items: center; justify-content: center; border-radius: 18px; font: 900 80px/1 Montserrat; color: #14295a; text-align: center;
  box-shadow: inset 0 6px 0 rgba(255,255,255,.45), inset 0 -8px 0 rgba(0,0,0,.12), 0 12px 0 var(--side), 0 22px 26px rgba(10,20,50,.45); }
.blk::before { content: ''; position: absolute; inset: 9px; border: 4px solid rgba(20,41,90,.16); border-radius: 11px; }
.blk.navy { color: #ffb02e; } .blk.navy::before { border-color: rgba(255,176,46,.25); }
.plank { position: absolute; padding: 18px 34px 22px; border-radius: 18px; font: 900 62px/1.05 Montserrat; color: #fff; letter-spacing: -.5px; white-space: nowrap;
  background: linear-gradient(#ff7a3d, #f2581f); box-shadow: inset 0 5px 0 rgba(255,255,255,.3), 0 10px 0 #b8420f, 0 20px 24px rgba(10,20,50,.45); }
.plank.navy { background: linear-gradient(#1d3a78, #14295a); box-shadow: inset 0 5px 0 rgba(255,255,255,.18), 0 10px 0 #0a1636, 0 20px 24px rgba(10,20,50,.45); }
.plank.cream { background: linear-gradient(#fffaf0, #f6eedc); color: #14295a; box-shadow: inset 0 5px 0 rgba(255,255,255,.6), 0 10px 0 #cdbb94, 0 20px 24px rgba(10,20,50,.45); }
.tagw { position: absolute; padding: 10px 22px 12px; border-radius: 12px; background: #14295a; color: #ffb02e; font: 900 38px/1 Montserrat; letter-spacing: 2px; white-space: nowrap;
  box-shadow: 0 8px 0 #0a1636, 0 14px 18px rgba(10,20,50,.4); }
.acap { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; max-width: 800px; padding: 14px 30px 18px; border-radius: 16px; text-align: center;
  background: #fff8e8; color: #14295a; font: 800 54px/1.15 Manrope; box-shadow: 0 8px 0 #e5d3ad, 0 16px 22px rgba(10,20,50,.4); }
.acap b { color: #f2581f; }
`;

// in: progress of the drop (0..1); out: progress of the fall-away (0..1). Returns transform + opacity.
// up: the exit flies up and out of the top of the frame (for graphics above her face), instead of falling across it
const motion = ({ u, x = 0, r = 0, from = -320, side = 0, up = false }) => {
  if (u <= 0 || x >= 1) return null;
  const y = from * (1 - bounce(u)) + (up ? -900 : 900) * easeIn(x), rot = r + (side || 14) * (1 - easeOut(u)) + 30 * easeIn(x) * (side >= 0 ? 1 : -1);
  return `transform:translateY(${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg);opacity:${(clamp(u * 6) * (1 - easeIn(x) ** 2)).toFixed(3)}`;
};
// a block: ch (html), position, size, palette key, resting tilt, entry/exit progress
export const block = ({ ch, x, y, s = 150, pal = 'amber', r = 0, u = 1, out = 0, fs = null, side = 0, up = y < 600 }) => {
  const m = motion({ u, x: out, r, side: side || (x % 2 ? 16 : -16), up }); if (!m) return '';
  const [c, sd] = PAL[pal];
  return `<div class="blk${pal === 'navy' ? ' navy' : ''}" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:${c};--side:${sd};${fs ? `font-size:${fs}px;` : ''}${m}">${ch}</div>`;
};
// a plank slides in from the left (or right) with a small overshoot, and falls away on exit
export const plank = ({ text, x, y, cls = '', r = 0, u = 1, out = 0, fs = null, dir = -1, extra = '', up = y < 600 }) => {
  if (u <= 0 || out >= 1) return '';
  const dx = dir * 700 * (1 - backOut(u, 1.4)), dy = (up ? -900 : 900) * easeIn(out), rot = r + dir * 4 * (1 - easeOut(u)) + 20 * easeIn(out);
  return `<div class="plank ${cls}" style="left:${x}px;top:${y}px;${fs ? `font-size:${fs}px;` : ''}transform:translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) rotate(${rot.toFixed(2)}deg);opacity:${(clamp(u * 5) * (1 - easeIn(out) ** 2)).toFixed(3)};${extra}">${text}</div>`;
};
export const tag = ({ text, x = 120, y = 236, r = -2, u = 1, out = 0 }) => {
  if (u <= 0 || out >= 1) return '';
  const sc = 0.6 + 0.4 * backOut(u, 2.2), dy = -260 * easeIn(out);
  return `<div class="tagw" style="left:${x}px;top:${y}px;transform:translateY(${dy.toFixed(1)}px) rotate(${r}deg) scale(${sc.toFixed(3)});transform-origin:0 50%;opacity:${(clamp(u * 5) * (1 - easeIn(out))).toFixed(3)}">${text}</div>`;
};
// the caption: one phrase at a time, popping in; *word* = orange keyword
export const cap = ({ text, y, u = 1, fs = 54 }) => {
  const sc = 0.9 + 0.1 * backOut(clamp(u / 0.6), 2.4);
  return `<div class="acap" style="top:${y}px;font-size:${fs}px;max-width:${fs < 54 ? 860 : 800}px;transform:scale(${sc.toFixed(3)});opacity:${clamp(u * 4).toFixed(3)}">${text.replace(/\*([^*]+)\*/g, '<b>$1</b>')}</div>`;
};
// a green tick block
export const tick = ({ x, y, s = 120, u = 1, out = 0 }) => block({ ch: `<svg width="${s * 0.62}" height="${s * 0.62}" viewBox="0 0 100 100"><path d="M14 54 L40 78 L88 24" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  x, y, s, pal: 'amber', u, out, r: 6 }).replace('background:#ffb02e;--side:#c47a14', 'background:#2fae66;--side:#1d7a44');
