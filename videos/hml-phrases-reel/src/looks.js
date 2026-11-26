// Three candidate looks for the linking-phrases Reel, in the reference video's format: a header, then each phrase as an English line
// with its Mongolian meaning underneath, appearing as she says it and staying on, so a list builds up.
// Her face sits in the middle of the frame (about y 840 to 1180), so the list is a two-column grid in the open space above her
// head (y 230 to 790), clear of the top 220 px and the right-hand 140 px. All Mongolian is Claude's reading, for Batu to check.

export const ITEMS = [
  ['Nevertheless', 'гэсэн хэдий ч'], ['As a result', 'үүний үр дүнд'], ['In fact', 'яг үнэндээ'], ['Moreover', 'түүнчлэн'],
  ['Furthermore', 'үүнээс гадна'], ['In other words', 'өөрөөр хэлбэл'], ['In this regard', 'үүнтэй холбоотойгоор'],
];
export const HEAD = ['LINKING WORDS', 'холбох үгс'];
// the grid: two columns, four rows; the seventh phrase sits centred on the last row
export const SLOT = (i) => i < 6 ? { x: [60, 510][i % 2], y: 316 + 124 * Math.floor(i / 2), w: 430 } : { x: 285, y: 688, w: 430 };

const TEX = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' seed='4'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

// ---------------------------------------------------------------- A · paper-cut (the Daily English series look)
const A = {
  name: 'A · Paper-cut (the Daily English series look)',
  css: `
  .pc-depth { filter: drop-shadow(0 6px 0 rgba(8,16,40,.18)) drop-shadow(0 14px 16px rgba(8,16,40,.38)); }
  .pc-en { display: inline-block; padding: 10px 22px 13px; border-radius: 12px; background-color: #ffb02e; background-image: ${TEX}; color: #0d1c40; font: 900 47px/1 Montserrat; letter-spacing: -.5px; white-space: nowrap; }
  .pc-mn { display: inline-block; margin: -4px 0 0 16px; padding: 7px 18px 10px; border-radius: 10px; background-color: #f6eedc; background-image: ${TEX}; color: #14295a; font: 800 33px/1 Manrope; white-space: nowrap; }
  .pc-tag { position: absolute; padding: 12px 28px 14px; background-color: #ff6a2b; background-image: ${TEX}; color: #fff; font: 900 38px/1 Montserrat; letter-spacing: 4px; white-space: nowrap;
    clip-path: polygon(0 0, 100% 0, 97% 50%, 100% 100%, 0 100%, 3% 50%); }`,
  head: () => `<div class="pc-tag pc-depth" style="left:60px;top:232px;transform:rotate(-2deg)">${HEAD[0]} <span style="font:800 30px Manrope;letter-spacing:0;opacity:.9">· ${HEAD[1]}</span></div>`,
  item: ([en, mn], s, i, isNew) => `<div class="abs pc-depth" style="left:${s.x}px;top:${s.y}px;transform:rotate(${[-1.5, 1.2, -0.8, 1.6, -1.2, 0.8, -0.6][i]}deg) scale(${isNew ? 1.06 : 1});transform-origin:0 0">
    <div class="pc-en">${en}</div><br><div class="pc-mn">${mn}</div></div>`,
};

// ---------------------------------------------------------------- B · HML notebook stickers (the olympiad and online-course ads)
const B = {
  name: 'B · HML notebook stickers (the olympiad and online-course ads)',
  css: `
  .nb { position: absolute; background: #14295a; color: #fff; border: 5px solid #fff; border-radius: 18px; padding: 10px 22px 12px;
    box-shadow: 6px 7px 0 #ff6a2b, 0 16px 28px rgba(8,16,40,.3); white-space: nowrap; }
  .nb b { display: block; font: 800 46px/1.05 Manrope; letter-spacing: -.5px; }
  .nb i { display: block; font: 700 32px/1.15 Manrope; font-style: normal; color: #ffb02e; margin-top: 4px; }
  .nb.new { background: #ff6a2b; box-shadow: 6px 7px 0 #14295a, 0 16px 28px rgba(8,16,40,.3); } .nb.new i { color: #14295a; }
  .nb-head { position: absolute; background: #f8f2e4; border: 5px solid #14295a; border-radius: 16px; padding: 10px 26px 12px; color: #14295a;
    font: 900 40px/1 Montserrat; letter-spacing: 2px; box-shadow: 8px 9px 0 #14295a, 0 16px 28px rgba(8,16,40,.3);
    background-image: repeating-linear-gradient(180deg, transparent 0 22px, rgba(78,163,255,.28) 22px 24px); }
  .nb-tape { position: absolute; width: 130px; height: 40px; background: rgba(78,163,255,.6);
    clip-path: polygon(0 8%, 4% 0, 8% 10%, 12% 0, 16% 8%, 20% 0, 80% 0, 84% 9%, 88% 0, 92% 8%, 96% 0, 100% 10%, 100% 92%, 96% 100%, 92% 90%, 88% 100%, 84% 91%, 80% 100%, 20% 100%, 16% 92%, 12% 100%, 8% 90%, 4% 100%, 0 92%); }`,
  head: () => `<div class="nb-head" style="left:60px;top:228px;transform:rotate(-1.5deg)">${HEAD[0]} <span style="font:800 30px Manrope;letter-spacing:0">· ${HEAD[1]}</span></div>
    <div class="nb-tape" style="left:20px;top:212px;transform:rotate(-24deg)"></div>`,
  item: ([en, mn], s, i, isNew) => `<div class="nb${isNew ? ' new' : ''}" style="left:${s.x}px;top:${s.y}px;transform:rotate(${[-2, 1.5, -1, 2, -1.5, 1, -0.5][i]}deg) scale(${isNew ? 1.05 : 1});transform-origin:0 0"><b>${en}</b><i>${mn}</i></div>`,
};

// ---------------------------------------------------------------- C · ABC blocks (the weekend-classes ad)
const C = {
  name: 'C · ABC blocks (the weekend-classes ad)',
  css: `
  .bk-wrap { position: absolute; filter: drop-shadow(0 16px 18px rgba(10,20,50,.45)); }
  .bk-en { display: inline-block; padding: 10px 24px 14px 60px; border-radius: 16px; background: linear-gradient(#ff7a3d, #f2581f); color: #fff; font: 900 44px/1 Montserrat; letter-spacing: -.5px;
    box-shadow: inset 0 5px 0 rgba(255,255,255,.3), 0 9px 0 #b8420f; white-space: nowrap; }
  .bk-en.navy { background: linear-gradient(#1d3a78, #14295a); box-shadow: inset 0 5px 0 rgba(255,255,255,.18), 0 9px 0 #0a1636; }
  .bk-mn { display: inline-block; margin: 6px 0 0 30px; padding: 7px 18px 10px; border-radius: 12px; background: linear-gradient(#fffaf0, #f6eedc); color: #14295a; font: 800 32px/1 Manrope;
    box-shadow: inset 0 4px 0 rgba(255,255,255,.6), 0 7px 0 #cdbb94; white-space: nowrap; }
  .bk-num { position: absolute; z-index: 2; left: -18px; top: -14px; width: 62px; height: 62px; border-radius: 12px; background: #ffb02e; color: #14295a; font: 900 38px/62px Montserrat; text-align: center;
    box-shadow: inset 0 4px 0 rgba(255,255,255,.45), 0 7px 0 #c47a14; transform: rotate(-8deg); }
  .bk-tag { position: absolute; padding: 10px 22px 12px; border-radius: 12px; background: #14295a; color: #ffb02e; font: 900 38px/1 Montserrat; letter-spacing: 2px; white-space: nowrap;
    box-shadow: 0 8px 0 #0a1636, 0 14px 18px rgba(10,20,50,.4); }`,
  head: () => `<div class="bk-tag" style="left:60px;top:228px;transform:rotate(-2deg)">${HEAD[0]} <span style="font:800 30px Manrope;letter-spacing:0;color:#fff">· ${HEAD[1]}</span></div>`,
  item: ([en, mn], s, i, isNew) => `<div class="bk-wrap" style="left:${s.x + 16}px;top:${s.y + 8}px;transform:rotate(${[-1.5, 1.2, -1, 1.5, -1.2, 1, -0.6][i]}deg) scale(${isNew ? 1.06 : 1});transform-origin:0 0">
    <div class="bk-num">${i + 1}</div><div class="bk-en${i % 2 ? ' navy' : ''}">${en}</div><br><div class="bk-mn">${mn}</div></div>`,
};
export const LOOKS = { a: A, b: B, c: C };
