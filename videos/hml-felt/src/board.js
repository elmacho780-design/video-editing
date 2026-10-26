// Storyboard key frames for "Words in boxes", one per shot: ?view=board&s=1..8 (shot 6 is the turn style frame).
// Shots 1 to 3 live in a cold, grey archive of drawers; colour arrives with the orange yarn in shot 4.
import { THREE, RoundedBoxGeometry, setup, keyLight, textTexture, urlTexture } from './three-common.js';
import { feltBlob, feltTube, feltMesh, gloss, blob } from './felt.js';
import { girl } from './girl.js';
import { mulberry } from './lib2d.js';
import { paper, paperTex, brass, cabinet, wordTag, ROAD_Z } from './set.js';

const FW = 1080, FH = 1920;
let S;

// the Mongolian voiceover, split over the shots it plays under (for Batu to check)
export const SUBS = {
  1: 'Таны хүүхэд англи үгийг цээжилдэг үү,',
  2: 'эсвэл ойлгодог уу?',
  3: 'Тусад нь цээжилсэн үгс хоорондоо холбогддоггүй.',
  4: 'HML-д бид үг бүрийг утга, хэрэглээтэй нь холбож заадаг.',
  5: 'Үгс утгаа олоход',
  6: 'англи хэл амилдаг.',
  7: 'Олимпиадын хоёрдугаар шатанд яг энэ чадвар хэрэгтэй.',
  8: 'Үгийг цээжлэх биш, ойлгох.',
};

const WALL_WORDS = ['run', 'cold', 'early', 'wait', 'coat', 'home', 'friend', 'warm', 'street', 'city', 'happy', 'school', 'morning', 'window',
  'hurry', 'door', 'scarf', 'today', 'tired', 'quickly', 'teacher', 'winter', 'clock', 'walk', 'book', 'sleep', 'road', 'again', 'careful',
  'always', 'ticket', 'stop', 'slowly', 'minute', 'outside', 'jacket', 'station', 'never', 'mother', 'after', 'under', 'sorry', 'before',
  'gloves', 'river', 'light', 'answer', 'question', 'open', 'listen'];
const ROWS = 14, COLS = 7;
// the wall's words, with the four story words side by side at the eye-level drawers
function wallWords() {
  const w = []; for (let i = 0; i < ROWS * COLS; i++) w.push(WALL_WORDS[(i * 17) % WALL_WORDS.length]);
  w[8 * COLS + 2] = 'late'; w[8 * COLS + 3] = 'because'; w[8 * COLS + 4] = 'bus'; w[9 * COLS + 3] = 'snowing';
  return w;
}
export const TAG_COLOURS = [['#ef7a2f', '#ffffff'], ['#4f86c9', '#ffffff'], ['#f2b33a', '#7a3d12'], ['#ec6f60', '#ffffff'], ['#3f9a7a', '#ffffff'], ['#8a6ac8', '#ffffff'], ['#f08fa8', '#ffffff']];

const v3 = (a) => new THREE.Vector3(...a);
function addTag(scene, word, [col, ink], pos, rot, scale = 1, o) {
  const t = wordTag(word, col, ink, o); t.position.set(...pos); t.rotation.set(...rot); t.scale.setScalar(scale); scene.add(t); t.updateMatrixWorld(true);
  return t;
}

// ---------------------------------------------------------------- the cold archive (shots 1 to 3)
export function archive(scene, { warm = 0 } = {}) {
  scene.background = new THREE.Color('#1f2633');
  scene.add(new THREE.HemisphereLight('#b9c6dc', '#3a3f4a', 0.55 + 0.15 * warm));
  keyLight(scene, { pos: [-5, 9, 6], intensity: 2.1, size: 9, color: '#dfe8f5', map: 4096 });
  const rim = new THREE.DirectionalLight('#9fb3d6', 0.9); rim.position.set(6, 4, -4); scene.add(rim);
  if (warm) { const w = new THREE.DirectionalLight('#ffbf80', 2.2 * warm); w.position.set(5, 3, 7); scene.add(w); }
  const floor = feltMesh(new THREE.PlaneGeometry(30, 30, 2, 2), '#4b505b', { layers: 0, bump: 1.4, sheen: 0.3 });
  floor.rotation.x = -Math.PI / 2; scene.add(floor);
}
export function bigWall(scene, o = {}) {
  const wall = cabinet({ rows: ROWS, cols: COLS, words: wallWords(), open: {}, grey: true, ...o });
  wall.scale.setScalar(1.5); scene.add(wall);
  return wall;
}
// a drawer's centre on the 1.5x wall
const drawerAt = (r, c) => [(-(COLS - 1) * 0.27 + c * 0.54) * 1.5, (ROWS * 0.45 + 0.25 - 0.3 - r * 0.45) * 1.5, 0.47 * 1.5];

// a long dressmaker's pin: steel shaft, round head
function pin(head = '#c23b3b') {
  const g = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.34, 10), gloss('#c9ccd2', { metalness: 0.9, roughness: 0.25 }));
  shaft.rotation.x = Math.PI / 2; shaft.position.z = -0.12; g.add(shaft);
  g.add(blob(gloss(head, { roughness: 0.2 }), [0, 0, 0.05], [0.03, 0.03, 0.03]));
  return g;
}

// ---------------------------------------------------------------- shots
const SHOTS = {
  // 1. Hook: an extreme close-up of one grey drawer, "because", rattling to get out
  1(scene, camera) {
    archive(scene);
    bigWall(scene, { open: (w) => (w === 'because' ? 0.05 : 0), keepLabels: true });
    const [x, y, z] = drawerAt(8, 3);
    camera.position.set(x + 1.35, y - 0.55, z + 3.6);
    camera.lookAt(x + 0.05, y + 0.05, z);
    camera.rotateZ(0.07);
    return { focus: 3.9, aper: 4, maxCoc: 14 };
  },

  // 2. The wall: hundreds of grey drawers tower over her; a question card hangs in the air and she freezes
  2(scene, camera) {
    archive(scene);
    bigWall(scene);
    const card = new THREE.Mesh(new RoundedBoxGeometry(2.1, 1.05, 0.02, 2, 0.01), [0, 0, 0, 0, 1, 1].map((k) => (k ? new THREE.MeshStandardMaterial({
      map: paperTex('#f6f0e2', {
        w: 1024, h: 512, seed: 5, draw: (g, w, h) => {
          g.fillStyle = '#8a8378'; g.font = '800 46px Nunito'; g.textAlign = 'left'; g.fillText('Question 7', 70, 110);
          g.fillStyle = '#1e3a6e'; g.font = '900 96px Nunito'; g.fillText('Why was Saraa', 70, 260); g.fillText('late?', 70, 380);
          g.strokeStyle = '#c23b3b'; g.lineWidth = 6; g.beginPath(); g.arc(880, 330, 70, 0, Math.PI * 2); g.stroke();
          g.fillStyle = '#c23b3b'; g.font = '900 110px Nunito'; g.textAlign = 'center'; g.fillText('?', 880, 368);
        },
      }), roughness: 0.9,
    }) : new THREE.MeshStandardMaterial({ color: '#d8d0c0', roughness: 0.9 }))));
    card.position.set(0.55, 3.55, 4.2); card.rotation.set(0.12, -0.12, 0.05); card.castShadow = true; scene.add(card);
    const gl = girl({ reach: 0, look: [0.15, 1], mood: 'worried', kick: 0 }); gl.position.set(0.2, 0, 2.6); gl.rotation.y = -0.1; scene.add(gl);
    camera.position.set(0.1, 0.9, 15.5);
    camera.lookAt(0, 3.15, 0);
    return { focus: 12.9, aper: 1.6, maxCoc: 8 };
  },

  // 3. The problem: she pulls words out, but each one stays pinned in place on its own, grey and separate
  3(scene, camera) {
    archive(scene);
    bigWall(scene, { open: { late: 0.25, bus: 0.25, snowing: 0.25 } });
    const greys = [['#9399a3', '#f1f2f4'], ['#a59f97', '#f6f3ee'], ['#8b929e', '#eef0f3']];
    [['late', [-0.35, 3.3, 1.35], 0.12], ['bus', [0.78, 2.82, 1.35], -0.14], ['snowing', [-0.25, 2.28, 1.35], 0.06]].forEach(([w, p, rz], i) => {
      const t = addTag(scene, w, greys[i], p, [0, 0, rz], 1, { twine: false });
      const pn = pin(); pn.position.copy(t.localToWorld(t.userData.eyelet.clone())); pn.position.z += 0.03; scene.add(pn);
      // the pin runs back to the drawer it was taken from
      const shaftBack = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.65, 8), gloss('#c9ccd2', { metalness: 0.9, roughness: 0.25 }));
      shaftBack.rotation.x = Math.PI / 2; shaftBack.position.copy(pn.position); shaftBack.position.z -= 0.35; scene.add(shaftBack);
    });
    const gl = girl({ reach: 0.35, look: [-0.6, 0.7], mood: 'worried', kick: 0 }); gl.position.set(0.75, 0, 2.3); gl.rotation.y = -0.55; scene.add(gl);
    camera.position.set(0.45, 1.9, 8.6);
    camera.lookAt(0.1, 2.3, 1.0);
    return { focus: 6.7, aper: 2.2, maxCoc: 10 };
  },

  // 4. The turn: an HML-orange yarn on a felting needle stitches the words into one sentence; each word it reaches takes colour
  4(scene, camera) {
    archive(scene, { warm: 0.8 });
    bigWall(scene);
    const cream = ['#f4ead6', '#1e3a6e'];
    const seq = [
      ['She was', cream, [-0.42, 3.3, 1.2], 0.08, 0.62],
      ['late', TAG_COLOURS[0], [0.42, 3.05, 1.3], -0.1, 1],
      ['for the', cream, [-0.4, 2.68, 1.2], 0.06, 0.62],
      ['bus', TAG_COLOURS[2], [0.42, 2.42, 1.3], -0.08, 1],
      ['because', TAG_COLOURS[3], [-0.25, 1.98, 1.35], 0.05, 1],
      ['it was', cream, [0.3, 1.58, 1.2], -0.06, 0.62],
      ['snowing', ['#9399a3', '#f1f2f4'], [-0.3, 1.18, 1.15], 0.1, 1],
    ];
    const eyes = seq.map(([w, col, p, rz, sc]) => { const t = addTag(scene, w, col, p, [0, 0, rz], sc, { twine: false }); return t.localToWorld(t.userData.eyelet.clone()); });
    // the yarn swoops in from the top, loops through every eyelet, and ends at the needle about to pierce "snowing"
    const pts = [v3([-1.5, 3.55, 0.9])];
    eyes.forEach((e, i) => {
      pts.push(e.clone().add(v3([0, 0, 0.03])));
      if (i < eyes.length - 1) { const n = eyes[i + 1]; pts.push(e.clone().lerp(n, 0.5).add(v3([i % 2 ? -0.25 : 0.25, -0.08, 0.12]))); }
    });
    const last = eyes[eyes.length - 1];
    pts.splice(pts.length - 1, 1, last.clone().add(v3([0.05, 0.1, 0.12])));
    scene.add(feltTube('#ee8a2c', pts.map((p) => p.toArray()), 0.018, { len: 0.012, layers: 8 }));
    // the felting needle: steel with a notched tip and an orange grip, its tip just touching the last eyelet
    const nd = new THREE.Group();
    const steel = gloss('#d4d7dc', { metalness: 0.95, roughness: 0.2 });
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 14), steel); sh.position.y = 0.43; nd.add(sh);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.09, 14), steel); tip.rotation.x = Math.PI; tip.position.y = 0.0; nd.add(tip);
    nd.add(feltTube('#ee8a2c', [[0, 0.82, 0], [0, 1.12, 0]], 0.055, { len: 0.01, layers: 6 }));
    nd.position.copy(last).add(v3([0.03, 0.04, 0.06])); nd.rotation.set(0.45, 0, -0.95); scene.add(nd);
    const gl = girl({ reach: 0, look: [-0.5, 0.9], mood: 'delighted', kick: 0 }); gl.position.set(0.82, 0, 3.6); gl.rotation.y = -0.5; scene.add(gl);
    camera.position.set(0.1, 2.1, 8.9);
    camera.lookAt(0.05, 2.42, 1.2);
    return { focus: 7.35, aper: 2.4, maxCoc: 10, warmVig: 0.15 };
  },

  // 5. The burst: every drawer flies open and the words pour out in full colour
  5(scene, camera) {
    const r = mulberry(11);
    scene.background = new THREE.Color('#2a2238');
    scene.add(new THREE.HemisphereLight('#ffe2c2', '#4a3a3a', 0.7));
    keyLight(scene, { pos: [4, 8, 8], intensity: 2.6, size: 9, color: '#ffd6a8', map: 4096 });
    const rim = new THREE.DirectionalLight('#9fb8ff', 0.8); rim.position.set(-6, 4, -2); scene.add(rim);
    const floor = feltMesh(new THREE.PlaneGeometry(30, 30, 2, 2), '#6b5a54', { layers: 0, bump: 1.4, sheen: 0.3 }); floor.rotation.x = -Math.PI / 2; scene.add(floor);
    bigWall(scene, { grey: false, open: () => 0.12 + r() * 0.5 });
    // warm light pouring out of the open drawers
    [[-1.5, 6.5], [1.2, 4.5], [-0.4, 2.8], [1.8, 8.4], [-2.0, 3.6]].forEach(([x, y]) => { const l = new THREE.PointLight('#ffb15e', 6, 4, 1.6); l.position.set(x, y, 1.6); scene.add(l); });
    for (let i = 0; i < 46; i++) {
      const t = r(), z = 1.4 + t * 8, spread = 1.2 + t * 2.2;
      const x = (r() - 0.5) * 2 * spread, y = 1.6 + r() * (6.5 - t * 2.5);
      if (z > 6 && Math.abs(x) < 0.9 && y < 3) continue;   // keep the girl clear
      addTag(scene, WALL_WORDS[Math.floor(r() * WALL_WORDS.length)], TAG_COLOURS[i % TAG_COLOURS.length], [x, y, z], [(r() - 0.5) * 0.9, (r() - 0.5) * 1.4, (r() - 0.5) * 0.9], 0.8 + r() * 0.3);
    }
    const gl = girl({ reach: 1, look: [0.1, 1], mood: 'delighted', kick: 1 }); gl.position.set(-0.15, 0, 3.4); gl.rotation.y = 0.15; scene.add(gl);
    camera.position.set(0.05, 0.85, 13.5);
    camera.lookAt(0, 3.0, 0);
    return { focus: 10.2, aper: 2.8, maxCoc: 14, bloom: 0.25 };
  },

  // 7. The proof: the bus ride ends in a paper London; a gold medal on her coat
  async 7(scene, camera) {
    const skyTex = textTexture(64, 1024, (g, w, h) => {
      const grd = g.createLinearGradient(0, 0, 0, h);
      [[0, '#6f9fd8'], [0.55, '#a9c6ea'], [0.72, '#f3cfc6'], [1, '#f7dccb']].forEach(([s, c]) => grd.addColorStop(s, c));
      g.fillStyle = grd; g.fillRect(0, 0, w, h);
    });
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), new THREE.MeshBasicMaterial({ map: skyTex, toneMapped: false })); sky.position.set(0, 9, -14); scene.add(sky);
    scene.background = new THREE.Color('#6f9fd8');
    scene.add(new THREE.HemisphereLight('#e4eeff', '#e8d6c4', 0.7));
    keyLight(scene, { pos: [-5, 9, 7], intensity: 2.6, size: 8, color: '#fff0dc', map: 4096 });
    const rim = new THREE.DirectionalLight('#ffd2a6', 1.6); rim.position.set(5, 4, -8); scene.add(rim);
    const ground = feltMesh(new THREE.PlaneGeometry(30, 30, 2, 2), '#cfc8bd', { layers: 0, bump: 1.4, sheen: 0.3 }); ground.rotation.x = -Math.PI / 2; scene.add(ground);
    // paper Big Ben and a row of paper rooftops
    const stone = paper('#d9c49a', { seed: 71, draw: (c, w, h) => { c.strokeStyle = 'rgba(120,90,50,0.35)'; c.lineWidth = 6; for (let x = 20; x < w; x += 46) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } } });
    const tower = new THREE.Group(); tower.position.set(-1.45, 0, -4.2); tower.rotation.y = 0.3; scene.add(tower);
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.75, 4.2, 0.75), stone); shaft.position.y = 2.1; shaft.castShadow = true; tower.add(shaft);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.95), stone); head.position.y = 4.55; head.castShadow = true; tower.add(head);
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.36, 40), paper('#fbf5e6', {
      w: 512, h: 512, seed: 72, draw: (c) => {
        c.strokeStyle = '#2b2f3a'; c.lineCap = 'round';
        for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; c.lineWidth = 12; c.beginPath(); c.moveTo(256 + Math.cos(a) * 215, 256 + Math.sin(a) * 215); c.lineTo(256 + Math.cos(a) * 180, 256 + Math.sin(a) * 180); c.stroke(); }
        c.lineWidth = 18; c.beginPath(); c.moveTo(256, 256); c.lineTo(256, 110); c.stroke(); c.beginPath(); c.moveTo(256, 256); c.lineTo(350, 300); c.stroke();
      },
    }));
    face.position.set(0, 4.55, 0.48); tower.add(face);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.62, 1.4, 4), paper('#3b4a5e', { seed: 73 })); spire.position.y = 5.72; spire.rotation.y = Math.PI / 4; spire.castShadow = true; tower.add(spire);
    [[0.6, 1.3, 1.8, '#c9b48f'], [1.9, 1.7, 1.4, '#b7a283'], [3.0, 1.2, 1.4, '#d4c19c']].forEach(([x, h, w, col]) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.6), paper(col, { seed: 80 + x * 10 })); b.position.set(x, h / 2, -5.2); b.castShadow = true; scene.add(b);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(w * 0.72, 0.6, 4), paper('#5a6578', { seed: 90 + x * 10 })); roof.position.set(x, h + 0.3, -5.2); roof.rotation.y = Math.PI / 4; roof.scale.z = 0.45; scene.add(roof);
    });
    // a red felt double-decker
    const dd = new THREE.Group(); dd.position.set(1.15, 0.02, -2.4); dd.rotation.y = -0.35; dd.scale.setScalar(0.72); scene.add(dd);
    const red = feltMesh(new RoundedBoxGeometry(2.3, 1.6, 0.95, 4, 0.18), '#d6372f', { len: 0.01 }); red.position.y = 1.05; dd.add(red);
    [0.75, 1.45].forEach((y) => { for (let i = 0; i < 4; i++) { const w = feltMesh(new RoundedBoxGeometry(0.4, 0.34, 0.04, 2, 0.04), '#fbf3df', { len: 0.004, layers: 3 }); w.position.set(-0.8 + i * 0.52, y, 0.47); dd.add(w); } });
    [-0.7, 0.7].forEach((x) => { const wh = feltMesh(new THREE.TorusGeometry(0.16, 0.08, 16, 32), '#2a2a33', { len: 0.008 }); wh.position.set(x, 0.24, 0.45); dd.add(wh); });
    // bunting across the top of the stage
    const r = mulberry(5), flagCols = ['#1e3a6e', '#d6372f', '#fbf5e6'];
    const bunt = [[-2.4, 3.7, -0.6], [0, 3.35, -0.6], [2.4, 3.8, -0.6]];
    scene.add(feltTube('#c8a77a', bunt, 0.008, { len: 0.003, layers: 2 }));
    const curve = new THREE.CatmullRomCurve3(bunt.map(v3));
    for (let i = 1; i < 14; i++) {
      const p = curve.getPoint(i / 14), f = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.26, 3), paper(flagCols[i % 3], { w: 64, h: 64, seed: i }));
      f.rotation.set(Math.PI, 0, 0); f.scale.z = 0.12; f.position.set(p.x, p.y - 0.14, p.z); f.castShadow = true; scene.add(f);
    }
    // a little navy stage, the girl on it with her medal, felt confetti in the air
    const stage = feltMesh(new RoundedBoxGeometry(1.4, 0.32, 0.95, 3, 0.05), '#1e3a6e', { len: 0.008 }); stage.position.set(-0.05, 0.16, 1.2); scene.add(stage);
    const trim = new THREE.Mesh(new RoundedBoxGeometry(1.42, 0.04, 0.97, 2, 0.015), brass); trim.position.set(-0.05, 0.31, 1.2); scene.add(trim);
    const gl = girl({ reach: 1, look: [0.1, 0.6], mood: 'delighted', kick: 1, medal: true }); gl.position.set(-0.05, 0.32, 1.25); gl.rotation.y = 0.05; scene.add(gl);
    for (let i = 0; i < 40; i++) { const s = 0.025 + r() * 0.03; scene.add(feltBlob(['#ee8a2c', '#f2b33a', '#ec6f60', '#4f86c9', '#fbf5e6'][i % 5], [(r() - 0.5) * 4, 1.2 + r() * 4, -1.5 + r() * 4], [s, s * 0.4, s], [r() * 3, r() * 3, r() * 3], { len: 0.006, layers: 3 })); }
    camera.position.set(0, 1.45, 10.4);
    camera.lookAt(0, 2.05, 0.5);
    return { focus: 9.2, aper: 2.2, maxCoc: 10 };
  },

  // 8. End card: the HML logo printed on card, sewn onto navy felt; the numbers on a paper strip; she waves goodbye
  async 8(scene, camera) {
    scene.background = new THREE.Color('#16305c');
    scene.add(new THREE.HemisphereLight('#dfe7ff', '#2a3550', 0.75));
    keyLight(scene, { pos: [-4, 7, 8], intensity: 2.5, size: 7, color: '#fff1e2', map: 4096 });
    const rim = new THREE.DirectionalLight('#ffd2a6', 1.0); rim.position.set(5, 4, -4); scene.add(rim);
    const back = feltMesh(new THREE.PlaneGeometry(14, 14, 2, 2), '#1e3a6e', { layers: 0, bump: 1.6, sheen: 0.4 }); back.position.set(0, 4, -0.6); scene.add(back);
    const floor = feltMesh(new THREE.PlaneGeometry(14, 10, 2, 2), '#2a4a85', { layers: 0, bump: 1.6, sheen: 0.4 }); floor.rotation.x = -Math.PI / 2; floor.position.z = 4; scene.add(floor);
    const logoTex = await urlTexture('assets/hml-logo.png', 1024, 1024);
    const card = new THREE.Mesh(new RoundedBoxGeometry(2.05, 2.05, 0.03, 3, 0.04), [0, 0, 0, 0, 1, 1].map((k) => (k ? new THREE.MeshBasicMaterial({ map: logoTex, toneMapped: false }) : new THREE.MeshStandardMaterial({ color: '#e8e1d2', roughness: 0.9 }))));
    card.position.set(0, 2.95, -0.5); card.rotation.z = -0.02; card.castShadow = true; scene.add(card);
    // orange running stitch around the card
    const st = new THREE.MeshStandardMaterial({ color: '#ee8a2c', roughness: 0.9 });
    for (let i = 0; i < 4; i++) for (let k = 0; k < 11; k++) {
      const t = -0.98 + k * 0.196 + 0.05, d = new THREE.Mesh(new RoundedBoxGeometry(0.11, 0.025, 0.02, 2, 0.01), st);
      const [x, y, rz] = [[t, 1.08, 0], [1.08, t, Math.PI / 2], [t, -1.08, 0], [-1.08, t, Math.PI / 2]][i];
      d.position.set(x, 2.95 + y, -0.47); d.rotation.z = rz; scene.add(d);
    }
    // felt flowers from the logo's tree, gathered at the card's corners
    const r = mulberry(8);
    const flower = (x, y, s, col) => {
      for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 + 0.3; scene.add(feltBlob(col, [x + Math.cos(a) * s * 0.9, y + Math.sin(a) * s * 0.9, -0.42], [s * 0.62, s * 0.62, s * 0.28], [0, 0, 0], { len: 0.008, layers: 5 })); }
      scene.add(feltBlob('#fff2c4', [x, y, -0.36], [s * 0.5, s * 0.5, s * 0.3], [0, 0, 0], { len: 0.006, layers: 4 }));
    };
    [[-1.1, 4.0, 0.14, '#f39a2a'], [-0.82, 4.12, 0.09, '#ffc93c'], [1.08, 1.92, 0.15, '#f0561e'], [0.82, 1.8, 0.1, '#f7931e'], [1.15, 3.98, 0.08, '#ffc93c'], [-1.12, 1.9, 0.08, '#f7931e']].forEach(([x, y, s, c]) => flower(x, y, s, c));
    [[-1.0, 3.8], [1.0, 2.1], [-1.25, 4.15], [0.95, 1.75]].forEach(([x, y]) => scene.add(feltBlob('#5f8f3a', [x + (r() - 0.5) * 0.1, y, -0.44], [0.09, 0.04, 0.02], [0, 0, r() * 3], { len: 0.005, layers: 3 })));
    // the numbers and handle on a cream paper strip
    const strip = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.62, 0.02, 2, 0.01), [0, 0, 0, 0, 1, 1].map((k) => (k ? new THREE.MeshStandardMaterial({
      map: paperTex('#fbf5e6', {
        w: 1024, h: 276, seed: 9, draw: (g, w, h) => {
          g.fillStyle = '#1e3a6e'; g.textAlign = 'center'; g.font = '900 84px Nunito'; g.fillText('9930 4451 · 8888 3351', w / 2, 118);
          g.fillStyle = '#e8762f'; g.font = '800 62px Nunito'; g.fillText('@hml_english', w / 2, 214);
        },
      }), roughness: 0.9,
    }) : new THREE.MeshStandardMaterial({ color: '#ddd3bf', roughness: 0.9 }))));
    strip.position.set(0.05, 1.35, -0.3); strip.rotation.set(0, 0, 0.03); strip.castShadow = true; scene.add(strip);
    const gl = girl({ reach: 1, look: [0.3, 0.2], mood: 'delighted', kick: 0 }); gl.position.set(-0.75, 0, 1.6); gl.rotation.y = 0.3; gl.scale.setScalar(0.62); scene.add(gl);
    camera.position.set(0, 2.45, 8.6);
    camera.lookAt(0, 2.45, 0);
    return { focus: 9.0, aper: 0.8, maxCoc: 6 };
  },
};

export async function init(q) {
  const s = +(q.get('s') || 1);
  if (s === 6) { q.set('sub', SUBS[6]); return (await import('./turn.js')).init(q); }
  const stage = document.getElementById('stage');
  stage.style.width = FW + 'px'; stage.style.height = FH + 'px';
  globalThis.FELT_Q = +(q.get('fq') || 0.8);
  S = setup(stage, { w: FW, h: FH, fov: 30, ssaa: +(q.get('ssaa') || 1.5), exposure: 0.95 });
  const { scene, camera } = S;
  const o = (await SHOTS[s](scene, camera)) || {};
  S.post.dof.focus = o.focus; S.post.dof.aper = o.aper; S.post.dof.maxCoc = o.maxCoc;
  S.post.bloom.strength = o.bloom ?? 0.08; S.post.bloom.threshold = 0.92;
  S.post.vig.uniforms.amt.value = 0.32;
  S.post.vig.uniforms.warm.value = o.warmVig ?? (s <= 3 ? 0 : 0.1);
  const { finish } = await import('./set.js');
  await finish(S, stage, { w: FW, h: FH, sub: SUBS[s], safe: q.get('safe') });
}

export function frame() {}
