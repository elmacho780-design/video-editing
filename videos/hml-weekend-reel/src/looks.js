// Three candidate looks for the weekend-classes Reel, shown on four beats of the real take (style frames for Batu to choose from).
// Beats: 0 the hook (the 2-3 month promise), 1 the books ("a year's book in one month"), 2 the enrolment (classes, dates, times),
// 3 the contact (phone numbers). The footage is flipped so "Oxford Discover" reads the right way round.
// Safe zones: key text stays out of the top 220 px, the bottom 380 px and the right 140 px, and off her face (about y 560-1000).
// All Mongolian here is Claude's, for Batu to check.

export const BEATS = [
  { frame: 36, cap: '2-3 сарын дотор' },
  { frame: 210, cap: '1 сарын дотор үзээд' },
  { frame: 620, cap: '11 сарын 14, 15-нд' },
  { frame: 880, cap: 'доорх утасны дугаараар' },
];
const kw = (s) => s.replace(/\*([^*]+)\*/g, '<b>$1</b>');

// ---------------------------------------------------------------- A · ABC blocks: wooden toy alphabet blocks, stacked and tumbling
const A = {
  name: 'A · ABC blocks',
  css: `
  .blk { position: absolute; display: flex; align-items: center; justify-content: center; border-radius: 16px; font: 900 78px/1 Montserrat; color: #14295a;
    box-shadow: inset 0 6px 0 rgba(255,255,255,.45), inset 0 -8px 0 rgba(0,0,0,.12), 0 12px 0 var(--side, #c47a14), 0 22px 26px rgba(10,20,50,.45); }
  .blk i { position: absolute; inset: 9px; border: 4px solid rgba(20,41,90,.18); border-radius: 10px; }
  .plank { position: absolute; padding: 18px 34px 22px; border-radius: 18px; font: 900 64px/1.05 Montserrat; color: #fff; letter-spacing: -.5px; white-space: nowrap;
    background: linear-gradient(#ff7a3d, #f2581f); box-shadow: inset 0 5px 0 rgba(255,255,255,.3), 0 10px 0 #b8420f, 0 20px 24px rgba(10,20,50,.45); }
  .acap { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; max-width: 800px; padding: 14px 30px 18px; border-radius: 16px; text-align: center;
    background: #fff8e8; color: #14295a; font: 800 54px/1.15 Manrope; box-shadow: 0 8px 0 #e5d3ad, 0 16px 22px rgba(10,20,50,.4); }
  .acap b { color: #f2581f; }
  .tagw { position: absolute; padding: 10px 22px 12px; border-radius: 12px; background: #14295a; color: #ffb02e; font: 900 38px/1 Montserrat; letter-spacing: 2px;
    box-shadow: 0 8px 0 #0a1636, 0 14px 18px rgba(10,20,50,.4); }`,
  block: (ch, x, y, s = 120, c = '#ffb02e', side = '#c47a14', r = 0, fs = 78) =>
    `<div class="blk" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:${c};--side:${side};transform:rotate(${r}deg);font-size:${fs}px"><i></i>${ch}</div>`,
  cap: (s, y = 1240) => `<div class="acap" style="top:${y}px">${kw(s)}</div>`,
  beats: [
    () => A.block('2', 120, 250, 150, '#ffb02e', '#c47a14', -6, 100) + A.block('-', 262, 290, 92, '#f6eedc', '#cdbb94', 4, 70) + A.block('3', 350, 250, 150, '#ff7a3d', '#b8420f', 5, 100)
      + `<div class="plank" style="left:520px;top:262px;transform:rotate(-2deg);font-size:56px">САРЫН<br>ДОТОР</div>`
      + `<div class="plank" style="left:150px;top:448px;transform:rotate(1.5deg);background:linear-gradient(#1d3a78,#14295a);box-shadow:inset 0 5px 0 rgba(255,255,255,.18),0 10px 0 #0a1636,0 20px 24px rgba(10,20,50,.45)">АНГЛИАР УНШИНА</div>`
      + A.block('A', 120, 1580, 110, '#ffb02e', '#c47a14', -8) + A.block('B', 236, 1600, 110, '#f6eedc', '#cdbb94', 6) + A.block('C', 352, 1585, 110, '#ff7a3d', '#b8420f', -4)
      + A.cap('*2-3* сарын дотор'),
    () => `<div class="tagw" style="left:120px;top:236px;transform:rotate(-2deg)">ОЛОН УЛСЫН ХӨТӨЛБӨР</div>`
      + A.block('1', 120, 300, 130, '#ffb02e', '#c47a14', -5, 88) + `<div class="plank" style="left:268px;top:318px;font-size:48px;transform:rotate(1deg)">ЖИЛИЙН НОМ</div>`
      + `<div class="abs" style="left:610px;top:322px;font:900 76px/1 Montserrat;color:#fff;text-shadow:0 6px 0 #0a1636">→</div>`
      + A.block('1', 700, 300, 130, '#ff7a3d', '#b8420f', 6, 88) + `<div class="plank" style="left:842px;top:318px;font-size:48px;transform:rotate(3deg);padding:18px 20px 22px">САР</div>`
      + A.cap('*1 сарын* дотор үзээд', 520),
    () => `<div class="tagw" style="left:120px;top:240px;transform:rotate(-2deg)">ШИНЭЭР ЭЛСЭЛТ</div>`
      + `<div class="plank" style="left:120px;top:312px;font-size:50px">ABC анги</div><div class="plank" style="left:420px;top:312px;font-size:50px;background:linear-gradient(#1d3a78,#14295a);box-shadow:inset 0 5px 0 rgba(255,255,255,.18),0 10px 0 #0a1636,0 20px 24px rgba(10,20,50,.45)">Түвшин ахиулах</div>`
      + A.block('<span style="font-size:44px;line-height:1.05;text-align:center">11/14<br><span style="font-size:32px">Бямба</span></span>', 120, 1060, 186, '#ffb02e', '#c47a14', -5)
      + A.block('<span style="font-size:44px;line-height:1.05;text-align:center">11/15<br><span style="font-size:32px">Ням</span></span>', 318, 1075, 186, '#f6eedc', '#cdbb94', 4)
      + A.block('<span style="font-size:46px">11:30</span>', 560, 1060, 176, '#ff7a3d', '#b8420f', 3) + A.block('<span style="font-size:46px">13:00</span>', 748, 1075, 176, '#ffb02e', '#c47a14', -4)
      + A.cap('*11 сарын 14, 15*-нд', 1320),
    () => `<div class="tagw" style="left:120px;top:250px;transform:rotate(-2deg)">БҮРТГЭЛ</div>`
      + `<div class="plank" style="left:120px;top:322px;font-size:66px">9930 4451</div><div class="plank" style="left:200px;top:442px;font-size:66px;background:linear-gradient(#1d3a78,#14295a);box-shadow:inset 0 5px 0 rgba(255,255,255,.18),0 10px 0 #0a1636,0 20px 24px rgba(10,20,50,.45)">8888 3351</div>`
      + A.block('A', 690, 300, 100, '#ffb02e', '#c47a14', 8) + A.block('B', 800, 340, 100, '#f6eedc', '#cdbb94', -6)
      + A.cap('доорх *утасны дугаараар*'),
  ],
};

// ---------------------------------------------------------------- B · Fast track: a calendar that races, speed lines, a progress track
const B = {
  name: 'B · Fast track',
  css: `
  .spd { position: absolute; font: 900 120px/0.95 Montserrat; color: #fff; letter-spacing: -3px; transform: skewX(-10deg);
    text-shadow: -14px 0 0 rgba(255,106,43,.55), -28px 0 0 rgba(255,106,43,.28), -42px 0 0 rgba(255,106,43,.12), 0 8px 18px rgba(0,0,0,.45); }
  .bar { position: absolute; height: 26px; border-radius: 13px; background: rgba(13,28,64,.75); overflow: hidden; box-shadow: 0 6px 16px rgba(0,0,0,.35); }
  .bar > div { height: 100%; background: repeating-linear-gradient(-45deg, #ff6a2b 0 22px, #ffb02e 22px 44px); border-radius: 13px; }
  .strip { position: absolute; padding: 12px 26px 14px; background: #ff6a2b; color: #fff; font: 900 44px/1 Montserrat; letter-spacing: 3px; transform: skewX(-10deg); white-space: nowrap;
    box-shadow: 0 10px 22px rgba(0,0,0,.35); }
  .strip.navy { background: #14295a; color: #ffb02e; }
  .page { position: absolute; width: 230px; border-radius: 14px; background: #fff; overflow: hidden; text-align: center; box-shadow: 0 14px 30px rgba(0,0,0,.45); }
  .page b { display: block; background: #e2412f; color: #fff; font: 900 30px/1 Montserrat; padding: 12px 0 10px; letter-spacing: 2px; }
  .page span { display: block; color: #14295a; font: 900 110px/1.05 Montserrat; letter-spacing: -4px; }
  .page i { display: block; color: #14295a; font: 800 34px/1 Manrope; font-style: normal; padding: 0 0 16px; }
  .bcap { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; max-width: 820px; padding: 12px 28px 16px; text-align: center; transform: skewX(-8deg);
    background: #14295a; color: #fff; font: 900 54px/1.12 Montserrat; letter-spacing: -.5px; box-shadow: 10px 10px 0 #ff6a2b; }
  .bcap b { color: #ffb02e; }`,
  cap: (s, y = 1240) => `<div class="bcap" style="top:${y}px">${kw(s)}</div>`,
  beats: [
    () => `<div class="spd" style="left:130px;top:250px;font-size:170px">2-3 САР</div>`
      + `<div class="strip" style="left:150px;top:440px">АНГЛИАР УНШИНА</div>`
      + `<div class="bar" style="left:130px;top:530px;width:800px"><div style="width:72%"></div></div>`
      + B.cap('*2-3* сарын дотор'),
    () => `<div class="page" style="left:120px;top:250px;transform:rotate(-6deg)"><b>12 САР</b><span>365</span><i>өдөр</i></div>`
      + `<div class="spd" style="left:390px;top:300px;font-size:110px">→</div>`
      + `<div class="page" style="left:560px;top:240px;transform:rotate(4deg)"><b>1 САР</b><span>30</span><i>өдөр</i></div>`
      + `<div class="strip" style="left:300px;top:420px">1 ЖИЛИЙН НОМ</div>`
      + B.cap('*1 сарын* дотор үзээд', 510),
    () => `<div class="strip navy" style="left:120px;top:240px">ШИНЭЭР ЭЛСЭЛТ</div>`
      + `<div class="strip" style="left:120px;top:320px;font-size:40px">ABC</div><div class="strip navy" style="left:300px;top:320px;font-size:40px">ТҮВШИН АХИУЛАХ</div>`
      + `<div class="page" style="left:120px;top:1060px;transform:rotate(-5deg)"><b>11 САР</b><span>14</span><i>Бямба</i></div>`
      + `<div class="page" style="left:370px;top:1075px;transform:rotate(3deg)"><b>11 САР</b><span>15</span><i>Ням</i></div>`
      + `<div class="spd" style="left:650px;top:1100px;font-size:80px;line-height:1.15">11:30<br>13:00</div>`
      + B.cap('*11 сарын 14, 15*-нд', 1420),
    () => `<div class="strip navy" style="left:120px;top:250px">БҮРТГҮҮЛЭЭРЭЙ</div>`
      + `<div class="spd" style="left:130px;top:340px;font-size:110px;text-shadow:-12px 0 0 rgba(255,106,43,.4),-24px 0 0 rgba(255,106,43,.15),0 8px 18px rgba(0,0,0,.45)">9930 4451</div><div class="spd" style="left:130px;top:460px;font-size:110px;text-shadow:-12px 0 0 rgba(255,106,43,.4),-24px 0 0 rgba(255,106,43,.15),0 8px 18px rgba(0,0,0,.45)">8888 3351</div>`
      + B.cap('доорх *утасны дугаараар*'),
  ],
};

// ---------------------------------------------------------------- C · Crayon: a child's crayon drawing over the film
const C = {
  name: 'C · Crayon',
  css: `
  .cr { position: absolute; font: 600 96px/1 Caveat; color: #ffb02e; white-space: nowrap; filter: url(#crayon);
    paint-order: stroke fill; -webkit-text-stroke: 16px #14295a; text-shadow: 0 8px 14px rgba(0,0,0,.35); }
  .ccap { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; max-width: 840px; text-align: center; font: 600 92px/1.05 Caveat; color: #fff;
    paint-order: stroke fill; -webkit-text-stroke: 16px #14295a; filter: url(#crayon) drop-shadow(0 6px 10px rgba(0,0,0,.35)); }
  .ccap b { color: #ffb02e; font-weight: 600; }`,
  defs: `<svg width="0" height="0" style="position:absolute"><filter id="crayon" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="1" seed="8" result="g"/><feColorMatrix in="g" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -0.55 1.08" result="m"/>
    <feComposite in="d" in2="m" operator="in"/></filter></svg>`,
  // a hand-drawn crayon stroke (svg path) with a wobble
  draw: (d, color = '#ff6a2b', w = 12) => `<svg class="layer" width="1080" height="1920" style="overflow:visible;filter:url(#crayon) drop-shadow(0 4px 6px rgba(0,0,0,.3))"><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  star: (x, y, s = 1, c = '#ffb02e') => C.draw(`M${x} ${y - 40 * s} L${x + 12 * s} ${y - 12 * s} L${x + 42 * s} ${y - 10 * s} L${x + 18 * s} ${y + 10 * s} L${x + 26 * s} ${y + 40 * s} L${x} ${y + 22 * s} L${x - 26 * s} ${y + 40 * s} L${x - 18 * s} ${y + 10 * s} L${x - 42 * s} ${y - 10 * s} L${x - 12 * s} ${y - 12 * s} Z`, c, 9),
  cap: (s, y = 1230) => `<div class="ccap" style="top:${y}px">${kw(s)}</div>`,
  beats: [
    () => C.defs + `<div class="cr" style="left:130px;top:240px;font-size:150px;color:#ff6a2b">2-3 сард</div>`
      + `<div class="cr" style="left:150px;top:400px;font-size:100px;color:#fff">англиар уншина!</div>`
      + C.draw('M150 520 C 330 500, 560 540, 860 505', '#ffb02e', 14) + C.star(860, 300, 1.2) + C.star(930, 420, 0.7, '#fff')
      + C.draw('M110 1600 l40 -90 l40 90 M126 1566 h48 M230 1510 v90 c60 0 60 -45 0 -45 c55 0 55 -45 0 -45 M380 1520 c-40 -25 -80 10 -70 45 c10 40 50 45 75 25', '#ffb02e', 11)
      + C.cap('*2-3* сарын дотор'),
    () => C.defs + `<div class="cr" style="left:130px;top:236px;font-size:110px;color:#fff">1 жилийн ном</div>`
      + `<div class="cr" style="left:560px;top:330px;font-size:120px;color:#ff6a2b">= 1 сар!</div>`
      + C.draw('M330 1150 C 220 1180, 230 1640, 470 1700 C 760 1760, 900 1560, 880 1330 C 860 1120, 600 1080, 330 1150', '#ff6a2b', 13)
      + C.draw('M960 560 C 990 760, 960 960, 900 1120 M900 1120 l-8 -64 M900 1120 l52 -40', '#ffb02e', 12) + C.star(910, 290, 1)
      + C.cap('*1 сарын* дотор үзээд', 470),
    () => C.defs + `<div class="cr" style="left:120px;top:236px;font-size:92px;color:#fff">Шинээр элсэлт!</div>`
      + `<div class="cr" style="left:120px;top:360px;font-size:84px;color:#ffb02e">ABC · Түвшин ахиулах</div>`
      + C.draw('M120 1080 h360 v260 h-360 Z M120 1150 h360 M240 1080 v-30 M360 1080 v-30', '#fff', 10)
      + `<div class="cr" style="left:150px;top:1160px;font-size:84px;color:#ff6a2b;-webkit-text-stroke:8px #14295a">14 · 15</div>`
      + `<div class="cr" style="left:600px;top:1100px;font-size:84px;color:#fff;line-height:1.1">11:30<br>13:00</div>`
      + C.draw('M560 1100 c-30 30 -30 80 0 110', '#ffb02e', 9)
      + C.cap('*11 сарын 14, 15*-нд', 1400),
    () => C.defs + `<div class="cr" style="left:130px;top:240px;font-size:84px;color:#fff">Бүртгүүлээрэй!</div>`
      + `<div class="cr" style="left:130px;top:350px;font-size:120px;color:#ffb02e">9930 4451</div><div class="cr" style="left:130px;top:480px;font-size:120px;color:#ff6a2b">8888 3351</div>`
      + C.draw('M760 300 c 40 -40 110 -20 100 40 c -6 40 -60 60 -40 120', '#fff', 10) + C.star(900, 520, 0.8)
      + C.cap('доорх *утасны дугаараар*'),
  ],
};
export const LOOKS = { a: A, b: B, c: C };
