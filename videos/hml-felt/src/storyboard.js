// The storyboard sheet: the eight key frames (stills/board/sN_0.jpg) with timing, picture, camera, voiceover and sound.
// Render: still.mjs <project> 0 --size 2440x3460 --q 'view=storyboard'
export const PANELS = [
  { t: '0:00 to 0:02', name: 'Hook', pic: 'Extreme close-up: a grey drawer labelled "because" rattles, trying to get out.', cam: 'Slow push-in, slight tilt.', mn: 'Таны хүүхэд англи үгийг цээжилдэг үү,', en: 'Does your child memorise English words,', sfx: 'Low room hum, the drawer rattles.' },
  { t: '0:02 to 0:04', name: 'The wall', pic: 'Pull back: hundreds of grey drawers tower over her. A question card drops in: "Why was Saraa late?" She freezes.', cam: 'Fast crane back and down.', mn: 'эсвэл ойлгодог уу?', en: 'or understand them?', sfx: 'Card flutters in, one low piano note.' },
  { t: '0:04 to 0:07', name: 'The problem', pic: 'She pulls out "late", "bus", "snowing". Each stays pinned in place, grey and alone. They will not join.', cam: 'Medium shot, slow drift.', mn: 'Тусад нь цээжилсэн үгс хоорондоо холбогддоггүй.', en: 'Words memorised one by one don\'t connect.', sfx: 'Pins tink, drawers thud shut.' },
  { t: '0:07 to 0:10', name: 'The turn', pic: 'An HML-orange yarn on a felting needle stitches the words into one sentence: "She was late for the bus because it was snowing." Each word it reaches fills with colour.', cam: 'Follows the needle down the garland.', mn: 'HML-д бид үг бүрийг утга, хэрэглээтэй нь холбож заадаг.', en: 'At HML we teach every word joined to its meaning and use.', sfx: 'A soft stitch sound per word; the music starts (pizzicato).' },
  { t: '0:10 to 0:12', name: 'The burst', pic: 'The yarn pulls tight. Every drawer flies open and hundreds of words pour out in full colour.', cam: 'Fast push-in, words fly past the lens.', mn: 'Үгс утгаа олоход', en: 'When words find their meaning,', sfx: 'Big whoosh, the music swells.' },
  { t: '0:12 to 0:16', name: 'The world', pic: 'The words build winter Ulaanbaatar: "snowing" becomes the snow, "bus" the bus, "late" the alarm clock. She catches "bus" and runs for it.', cam: 'Whip pan into the street, settles on the hero frame.', mn: 'англи хэл амилдаг.', en: 'English comes alive.', sfx: 'Bus bell, alarm clock ring.' },
  { t: '0:16 to 0:20', name: 'The proof', pic: 'The bus ride ends in a paper London. She stands on a stage with a medal; felt confetti falls.', cam: 'The bus drives out of frame, the camera rises to Big Ben.', mn: 'Олимпиадын хоёрдугаар шатанд яг энэ чадвар хэрэгтэй.', en: 'This is exactly the skill the olympiad\'s second round needs.', sfx: 'Soft cheer, the music peaks.' },
  { t: '0:20 to 0:24', name: 'End card', pic: 'The orange yarn stitches round the HML logo on navy felt, and felt flowers bloom from the logo\'s tree. Phone numbers and @hml_english. She waves.', cam: 'Locked off, gentle settle.', mn: 'HML Academy. Үгийг цээжлэх биш, ойлгох.', en: 'HML Academy. Don\'t memorise words, understand them.', sfx: 'The music resolves, a soft chime.' },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export async function init() {
  const stage = document.getElementById('stage');
  const W = 2440;
  Object.assign(stage.style, { width: W + 'px', background: '#f4efe6', font: '500 25px Nunito, sans-serif', color: '#2f2a25' });
  document.body.style.background = '#f4efe6';
  const panel = (p, i) => `
    <div style="width:540px">
      <div style="display:flex;align-items:baseline;gap:14px;margin-bottom:14px">
        <span style="font:900 44px Nunito;color:#e8762f">${i + 1}</span>
        <span style="font:900 32px Nunito;color:#1e3a6e">${esc(p.name)}</span>
        <span style="margin-left:auto;font:800 24px Nunito;color:#8a8378">${p.t}</span>
      </div>
      <img src="stills/board/s${i + 1}_0.jpg" style="width:540px;height:960px;display:block;border-radius:14px;box-shadow:0 10px 28px rgba(40,30,20,.18)">
      <div style="margin-top:20px;line-height:1.35">
        <div><b style="color:#1e3a6e">Picture</b> ${esc(p.pic)}</div>
        <div style="margin-top:8px"><b style="color:#1e3a6e">Camera</b> ${esc(p.cam)}</div>
        <div style="margin-top:12px;padding:14px 16px;background:#fff9ef;border-left:6px solid #e8762f;border-radius:6px">
          <div style="font:900 27px Nunito;color:#2f2a25">${esc(p.mn)}</div>
          <div style="margin-top:4px;font-style:italic;color:#6d665d">${esc(p.en)}</div>
        </div>
        <div style="margin-top:10px"><b style="color:#1e3a6e">Sound</b> ${esc(p.sfx)}</div>
      </div>
    </div>`;
  const row = (a) => `<div style="display:flex;gap:40px;align-items:flex-start">${a.map((p) => panel(p, PANELS.indexOf(p))).join('')}</div>`;
  stage.innerHTML = `
    <div style="padding:70px 80px 80px">
      <div style="display:flex;align-items:flex-end;gap:30px">
        <div style="font:900 72px Nunito;color:#1e3a6e;line-height:1">Words in boxes</div>
        <div style="font:800 32px Nunito;color:#e8762f;padding-bottom:6px">storyboard</div>
        <div style="margin-left:auto;font:800 26px Nunito;color:#8a8378;padding-bottom:8px">HML Academy Reel · 9:16 · 24 s · needle-felt and paper</div>
      </div>
      <div style="margin:22px 0 46px;font:600 27px Nunito;color:#5d564e;max-width:2100px;line-height:1.4">
        Grey and cold while the words sit in their boxes (1 to 3). Colour arrives with the orange yarn (4), and the world blooms out of the words (5 to 6). Subtitles sit high, clear of the Reels buttons and caption.
      </div>
      ${row(PANELS.slice(0, 4))}
      <div style="height:64px"></div>
      ${row(PANELS.slice(4))}
    </div>`;
  await Promise.all([...stage.querySelectorAll('img')].map((im) => im.decode()));
}

export function frame() {}
