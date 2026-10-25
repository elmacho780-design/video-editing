// Option 2, "Pop-up book": the flat art from option 1 printed on die-cut card, standing up out of an open HML book.
import { THREE, RoundedBoxGeometry, setup, keyLight, textTexture, svgTexture, urlTexture, card, glossy, matte, subtitleOverlay, W, H } from './three-common.js';
import { cabinet, alarmClock, bus, girl } from './words.js';
import { mulberry, sp } from './lib2d.js';

const NAVY = '#1e4c8f', NAVY_D = '#163463', ORANGE = '#f0561e', AMBER = '#f7931e', YELLOW = '#ffc93c', CORAL = '#f2876b', SNOW = '#fbfaf7';
let S;
let FONTCSS = '';

async function fontCss() {
  const b64 = async (url) => {
    const buf = new Uint8Array(await (await fetch(url)).arrayBuffer());
    let s = '';
    for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return btoa(s);
  };
  const f9 = await b64('fonts/Nunito-900-latin.woff2'), f8 = await b64('fonts/Nunito-800-latin.woff2');
  return `<style>@font-face{font-family:Nunito;font-weight:900;src:url(data:font/woff2;base64,${f9}) format('woff2')}@font-face{font-family:Nunito;font-weight:800;src:url(data:font/woff2;base64,${f8}) format('woff2')}</style>`;
}

const svgDoc = (vb, w, h, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}"><defs>${FONTCSS}` +
  `<linearGradient id="busg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd35a"/><stop offset="1" stop-color="#f7931e"/></linearGradient></defs>${inner}</svg>`;

function citySvg() {
  // skyline card: snowy hill with gers, lit blocks and the Blue Sky tower
  const r = mulberry(9);
  let s = `<path d="${sp([[0, 640, 1], [40, 560], [200, 520], [360, 560], [420, 640, 1]], true)}" fill="#fbfaf7"/>`;
  [[90, 540, 1], [180, 528, 0.85], [262, 548, 0.75]].forEach(([x, y, k]) => {
    s += `<path d="M${x - 34 * k} ${y + 20 * k}L${x - 34 * k} ${y + 4 * k}Q${x} ${y - 26 * k} ${x + 34 * k} ${y + 4 * k}L${x + 34 * k} ${y + 20 * k}Z" fill="#ffffff" stroke="#d9d6d1" stroke-width="2"/>`;
    s += `<rect x="${x - 7 * k}" y="${y + 4 * k}" width="${14 * k}" height="${16 * k}" fill="${ORANGE}"/>`;
  });
  [[300, 260, 130], [440, 330, 100], [640, 220, 120], [760, 300, 110]].forEach(([x, y, w]) => {
    s += `<rect x="${x}" y="${y}" width="${w}" height="${640 - y}" rx="8" fill="#173a73"/>`;
    for (let yy = y + 20; yy < 620; yy += 32) for (let xx = x + 14; xx < x + w - 16; xx += 26)
      if (r() < 0.6) s += `<rect x="${xx}" y="${yy}" width="13" height="15" rx="2" fill="${r() < 0.7 ? YELLOW : AMBER}"/>`;
  });
  s += `<path d="M560 640L560 80C620 104 676 230 690 640Z" fill="#7fb4e4"/>`;
  for (let i = 0; i < 10; i++) s += `<path d="M560 ${120 + i * 52}L${612 + i * 6} ${134 + i * 52}" stroke="#bfe0ff" stroke-width="4"/>`;
  return s;
}

function tagTexture(word, color) {
  return textTexture(512, 180, (g, w, h) => {
    g.fillStyle = '#fffdf8'; g.beginPath(); g.roundRect(4, 4, w - 8, h - 8, 40); g.fill();
    g.fillStyle = color; g.beginPath(); g.roundRect(16, 16, w - 32, h - 32, 30); g.fill();
    g.fillStyle = '#ffffff'; g.font = '900 108px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(word, w / 2, h / 2 + 6);
  });
}

function paperStrip(points, width = 0.06) {
  // a thin paper ribbon following a curve, its flat side turned toward the camera
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const n = 60, pos = [], idx = [];
  for (let i = 0; i <= n; i++) {
    const p = curve.getPoint(i / n), t = curve.getTangent(i / n);
    const side = new THREE.Vector3().crossVectors(t, new THREE.Vector3(0, 0.35, 1).normalize()).normalize().multiplyScalar(width / 2);
    pos.push(p.x - side.x, p.y - side.y, p.z - side.z, p.x + side.x, p.y + side.y, p.z + side.z);
    if (i < n) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#fbf8f1', roughness: 0.9, side: THREE.DoubleSide }));
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

function pageTexture(left) {
  return textTexture(1024, 1400, (g, w, h) => {
    const grd = g.createLinearGradient(left ? w : 0, 0, left ? 0 : w, 0);
    grd.addColorStop(0, '#e9e2d4'); grd.addColorStop(0.08, '#fbf8f1'); grd.addColorStop(1, '#fdfbf6');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    g.fillStyle = NAVY; g.font = '900 54px Nunito'; g.fillText(left ? 'Unit 3' : 'Word Power', 110, 150);
    g.fillStyle = '#d9d2c4';
    for (let y = 230; y < h - 120; y += 58) g.fillRect(110, y, (w - 220) * (0.55 + ((y * 37) % 40) / 100), 16);
    if (!left) { g.fillStyle = '#c9c1b1'; g.font = '800 34px Nunito'; g.fillText('HML Academy', w - 330, h - 70); }
  });
}

function book() {
  const g = new THREE.Group();
  const cover = new THREE.Mesh(new RoundedBoxGeometry(5.3, 0.14, 3.75, 3, 0.04), glossy(NAVY_D, { roughness: 0.55, clearcoat: 0.3 }));
  cover.position.y = 0.07; cover.receiveShadow = cover.castShadow = true; g.add(cover);
  [-1, 1].forEach((sd) => {
    const geo = new THREE.PlaneGeometry(2.5, 3.5, 40, 1);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), u = (x + 1.25) / 2.5;                 // 0 at the outer edge → 1 at the spine
      const d = sd < 0 ? u : 1 - u;
      p.setZ(i, 0.12 * Math.sin(Math.PI * d * 0.92) + 0.02 * d);
    }
    geo.computeVertexNormals();
    const page = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: pageTexture(sd < 0), roughness: 0.92 }));
    page.rotation.x = -Math.PI / 2;
    page.position.set(sd * 1.27, 0.24, 0);
    page.receiveShadow = true;
    g.add(page);
    const block = new THREE.Mesh(new THREE.BoxGeometry(2.48, 0.1, 3.46), matte('#f3eee3'));
    block.position.set(sd * 1.27, 0.18, 0); block.castShadow = block.receiveShadow = true; g.add(block);
  });
  return g;
}

function desk() {
  const tex = textTexture(1024, 1024, (g, w, h) => {
    g.fillStyle = '#a8724a'; g.fillRect(0, 0, w, h);
    const r = mulberry(4);
    for (let i = 0; i < 160; i++) {
      const y = r() * h, a = 0.05 + r() * 0.12;
      g.strokeStyle = r() < 0.5 ? `rgba(90,50,25,${a})` : `rgba(255,220,180,${a * 0.6})`;
      g.lineWidth = 1 + r() * 4;
      g.beginPath(); g.moveTo(0, y);
      for (let x = 0; x <= w; x += 64) g.lineTo(x, y + Math.sin(x * 0.01 + i) * 6);
      g.stroke();
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(3, 3);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55 }));
  m.rotation.x = -Math.PI / 2; m.receiveShadow = true;
  return m;
}

function pencil() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.2, 6), glossy(YELLOW, { roughness: 0.4 }));
  g.add(body);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.22, 6), matte('#e8c9a0')); tip.position.y = -1.21; tip.rotation.x = Math.PI; g.add(tip);
  const eraser = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.16, 16), matte('#f59bb5')); eraser.position.y = 1.18; g.add(eraser);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.rotation.set(Math.PI / 2, 0, 0.5); g.position.set(3.1, 0.08, 1.4);
  return g;
}

export async function init(q) {
  const stage = document.getElementById('stage');
  stage.style.width = W + 'px'; stage.style.height = H + 'px';
  stage.style.background = 'radial-gradient(ellipse 900px 1100px at 50% 40%, #6b4a33 0%, #3a271b 100%)';
  FONTCSS = await fontCss();
  S = setup(stage, { fov: 32, ssaa: 2, exposure: 0.9 });
  const { scene, camera } = S;
  scene.background = new THREE.Color('#3a271b');
  scene.fog = new THREE.Fog('#3a271b', 18, 34);
  scene.add(new THREE.HemisphereLight('#ffe9d2', '#5a3c28', 0.85));
  keyLight(scene, { pos: [-5, 10, 5], intensity: 3.0, size: 7, color: '#ffe6c8' });
  const fill = new THREE.DirectionalLight('#cfe4ff', 0.6); fill.position.set(6, 6, 8); scene.add(fill);
  scene.add(desk());
  scene.add(book());
  scene.add(pencil());

  // printed, die-cut cards standing up out of the pages
  const tex = async (inner, vb, w, h, border = 14) => svgTexture(svgDoc(vb, w, h, inner), w + border * 3, h + border * 3, { border });
  const cab = card(await tex(cabinet(), '30 430 400 912', 440, 1003), 1.25, 2.85);
  cab.position.set(-1.35, 1.66, -0.95); cab.rotation.y = 0.22; S.scene.add(cab);
  const cityC = card(await tex(citySvg(), '0 60 900 590', 900, 590, 12), 2.5, 1.65);
  cityC.position.set(1.25, 1.06, -1.25); cityC.rotation.y = -0.12; S.scene.add(cityC);
  const busC = card(await tex(bus(0, 30), '-6 0 392 220', 784, 440), 1.75, 0.98);
  busC.position.set(1.3, 0.73, -0.15); busC.rotation.y = -0.2; S.scene.add(busC);
  const clockC = card(await tex(alarmClock(120, 140, 92), '10 20 220 240', 440, 480), 0.8, 0.88);
  clockC.position.set(1.35, 2.75, -1.1); clockC.rotation.y = -0.12; S.scene.add(clockC);
  S.scene.add(paperStrip([[1.38, 1.85, -1.3], [1.4, 2.1, -1.2], [1.37, 2.32, -1.12]], 0.07));
  const girlC = card(await tex(girl(160, 500), '60 -14 270 534', 540, 1068), 0.83, 1.64);
  girlC.position.set(0.55, 1.05, 0.95); girlC.rotation.y = -0.15; S.scene.add(girlC);
  const beagle = card(await urlTexture('assets/beagle.png', 856 + 42, 1104 + 42, { border: 14 }), 1.2, 1.53);
  beagle.position.set(-1.25, 1.0, 1.05); beagle.rotation.y = 0.18; S.scene.add(beagle);

  // words as paper tags, pulled out of the cabinet on paper strips
  const tags = [
    ['snowing', '#5f9bd6', [-1.05, 2.75, -0.85], [-0.2, 3.35, -0.75], 0.0],
    ['late', ORANGE, [-0.9, 2.2, -0.8], [0.3, 2.55, -0.85], 0.06],
    ['bus', '#e8a21c', [-0.85, 1.45, -0.75], [0.35, 1.5, -0.2], -0.05],
    ['because', CORAL, [-0.85, 0.95, -0.65], [0.95, 2.05, 0.95], 0.04],
  ];
  for (const [word, col, from, to, rot] of tags) {
    const mid = [(from[0] + to[0]) / 2, Math.max(from[1], to[1]) + 0.22, (from[2] + to[2]) / 2 + 0.15];
    S.scene.add(paperStrip([from, mid, to], 0.045));
    const w = 0.28 + word.length * 0.11;
    const t = card(tagTexture(word, col), w, w * 180 / 512);
    t.position.set(to[0], to[1] + 0.02, to[2] + 0.02); t.rotation.set(-0.15, -0.1, rot); S.scene.add(t);
  }
  // paper snowflakes
  const r = mulberry(13);
  const flakeShape = new THREE.Shape();
  for (let i = 0; i < 12; i++) { const rr = i % 2 ? 0.035 : 0.09, a = (i / 12) * Math.PI * 2; i ? flakeShape.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : flakeShape.moveTo(rr, 0); }
  const flakeGeo = new THREE.ShapeGeometry(flakeShape), flakeMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8, side: THREE.DoubleSide });
  for (let i = 0; i < 16; i++) {
    const m = new THREE.Mesh(flakeGeo, flakeMat);
    m.position.set(0.2 + r() * 2.2, 1.9 + r() * 1.8, -1.5 + r() * 1.0); m.rotation.set(r() * 3, r() * 3, r() * 3); m.castShadow = true;
    S.scene.add(m);
  }

  camera.position.set(0.05, 8.4, 11.2);
  camera.lookAt(0.05, 1.25, -0.25);
  S.post.dof.focus = 13.2; S.post.dof.aper = 1.4; S.post.dof.maxCoc = 8;
  S.post.bloom.strength = 0.06;
  S.post.vig.uniforms.amt.value = 0.32;
  subtitleOverlay(stage, 'Үгийг цээжлэх биш, ойлгох.');
}

export function frame(t, q, stage) {
  S.post.composer.render();
}
