// The felt-and-paper set for HML's "Words in boxes": paper and wood materials, the card-catalogue cabinet,
// cardstock word tags, the felt bus, gers, paper hills, the skyline and the Blue Sky tower, the alarm clock,
// the dawn world they stand in, and the render-then-show finish every view shares.
import { THREE, RoundedBoxGeometry, keyLight, textTexture } from './three-common.js';
import { feltBlob, feltTube, feltMesh, gloss, blob } from './felt.js';
import { mulberry } from './lib2d.js';

// ---------------------------------------------------------------- materials made of paper and wood
export function paperTex(base, { w = 512, h = 512, seed = 3, draw } = {}) {
  return textTexture(w, h, (g) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    const r = mulberry(seed);
    for (let i = 0, n = Math.max(160, Math.round(2600 * w * h / 262144)); i < n; i++) {   // paper fibres
      const x = r() * w, y = r() * h, l = 3 + r() * 10, a = r() * Math.PI;
      g.strokeStyle = r() < 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.05)';
      g.lineWidth = 0.6 + r();
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    }
    if (draw) draw(g, w, h);
  });
}
export const paper = (color, o = {}) => new THREE.MeshStandardMaterial({ map: paperTex(color, o), roughness: 0.92, ...o.mat });

// grey: the drained, before-understanding version of the same walnut
export function woodTex(seed = 5, grey = false) {
  const t = textTexture(512, 1024, (g, w, h) => {
    g.fillStyle = grey ? '#6c6a68' : '#7b5236'; g.fillRect(0, 0, w, h);
    const r = mulberry(seed);
    for (let i = 0; i < 90; i++) {
      const x = r() * w, a = 0.05 + r() * 0.14;
      g.strokeStyle = r() < 0.6 ? (grey ? `rgba(40,40,42,${a})` : `rgba(60,35,20,${a})`) : (grey ? `rgba(180,178,175,${a * 0.7})` : `rgba(200,150,105,${a * 0.7})`);
      g.lineWidth = 1 + r() * 5;
      g.beginPath(); g.moveTo(x, 0);
      for (let y = 0; y <= h; y += 32) g.lineTo(x + Math.sin(y * 0.012 + i) * 7 + Math.sin(y * 0.003 + i * 2) * 14, y);
      g.stroke();
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
export const brass = gloss('#c9a14e', { metalness: 0.85, roughness: 0.32, clearcoat: 0.3 });

// ---------------------------------------------------------------- the card catalogue
export const CAB_WORDS = ['run', 'cold', 'snow', 'early', 'wait', 'late', 'coat', 'home', 'friend', 'warm', 'bus', 'street', 'because', 'city', 'happy'];
// rows x cols drawers, one word each (row by row). open: word -> how far its drawer stands out (its word has left, so its label is blank).
// grey: the cold, before-understanding world (wood and labels drained of colour)
export function cabinet({ rows = 5, cols = 3, words = CAB_WORDS, open = { snow: 0.42, late: 0.3, bus: 0.36, because: 0.46 }, grey = false, keepLabels = false } = {}) {
  const g = new THREE.Group();
  const W = cols * 0.54 + 0.1, H = rows * 0.45 + 0.25;
  const wood = new THREE.MeshStandardMaterial({ map: woodTex(5, grey), roughness: 0.55, metalness: 0 });
  const woodL = new THREE.MeshStandardMaterial({ map: woodTex(9, grey), roughness: 0.5, color: grey ? '#d6d6d6' : '#d8c3ae' });
  const inside = new THREE.MeshStandardMaterial({ color: grey ? '#3b3734' : '#4a3020', roughness: 0.8 });
  const body = new THREE.Mesh(new RoundedBoxGeometry(W, H, 0.85, 4, 0.05), wood);
  body.position.y = H / 2; body.castShadow = body.receiveShadow = true; g.add(body);
  const top = new THREE.Mesh(new RoundedBoxGeometry(W + 0.14, 0.1, 0.96, 4, 0.04), wood);
  top.position.y = H + 0.05; top.castShadow = top.receiveShadow = true; g.add(top);
  const frontGeo = new RoundedBoxGeometry(0.5, 0.42, 0.06, 3, 0.02), plateGeo = new RoundedBoxGeometry(0.34, 0.145, 0.008, 2, 0.003);
  const pullGeo = new THREE.TorusGeometry(0.05, 0.012, 10, 24, Math.PI), labelGeo = new THREE.PlaneGeometry(0.3, 0.11);
  const metal = grey ? gloss('#9c9a96', { metalness: 0.85, roughness: 0.4, clearcoat: 0.2 }) : brass;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const w = words[(r * cols + c) % words.length], out = (typeof open === 'function' ? open(w, r, c) : open[w]) || 0;
    const d = new THREE.Group();
    const front = new THREE.Mesh(frontGeo, woodL);
    front.castShadow = front.receiveShadow = true; d.add(front);
    if (out) {   // the drawer box behind the front
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, out), inside);
      box.position.z = -out / 2; box.castShadow = true; d.add(box);
    }
    const label = new THREE.Mesh(labelGeo, paper(grey ? '#dcd9d3' : '#f3ead8', {
      w: 256, h: 96, seed: r * cols + c, draw: (x, ww, hh) => {
        if (out && !keepLabels) return;
        x.fillStyle = grey ? '#55524e' : '#4a3a2c'; x.font = '800 44px Nunito'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(w, ww / 2, hh / 2 + 3);
      },
    }));
    label.position.set(0, 0.07, 0.0352); d.add(label);
    const plate = new THREE.Mesh(plateGeo, metal);
    plate.position.set(0, 0.07, 0.03); d.add(plate);
    const pull = new THREE.Mesh(pullGeo, metal);
    pull.rotation.z = Math.PI; pull.position.set(0, -0.09, 0.05); d.add(pull);
    d.position.set(-(cols - 1) * 0.27 + c * 0.54, H - 0.3 - r * 0.45, 0.44 + out);
    d.userData = { word: w, r, c };
    g.add(d);
  }
  g.userData.size = [W, H];
  return g;
}

// ---------------------------------------------------------------- a cardstock word tag with a brass eyelet and twine
// o.twine: false drops the loose string (when yarn threads the eyelet instead); userData.eyelet is the eyelet's local position
export function wordTag(word, color, ink = '#ffffff', o = {}) {
  const w = 0.42 + word.length * 0.13, h = 0.42;
  const face = paperTex(color, {
    w: 1024, h: Math.round(1024 * h / w), seed: word.length * 7, draw: (g, cw, ch) => {
      g.fillStyle = ink; g.font = `900 ${Math.round(ch * 0.56)}px Nunito`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(word, cw * 0.56, ch * 0.54);
      g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = ch * 0.025; g.setLineDash([ch * 0.06, ch * 0.05]);
      g.strokeRect(ch * 0.06, ch * 0.06, cw - ch * 0.12, ch - ch * 0.12);
    },
  });
  const edge = new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.85), roughness: 0.9 });
  const front = new THREE.MeshStandardMaterial({ map: face, roughness: 0.9 });
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.018, 2, 0.008), [edge, edge, edge, edge, front, front]);
  m.castShadow = true; m.receiveShadow = true;
  const g = new THREE.Group(); g.add(m);
  const eye = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.012, 10, 24), brass);
  eye.position.set(-w / 2 + 0.09, 0, 0.012); g.add(eye);
  const twine = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(-w / 2 + 0.09, 0, 0.01), new THREE.Vector3(-w / 2 - 0.08, 0.06, 0.03), new THREE.Vector3(-w / 2 - 0.2, -0.04, 0.0), new THREE.Vector3(-w / 2 - 0.3, 0.02, -0.03),
  ]), 24, 0.008, 6), new THREE.MeshStandardMaterial({ color: '#c8a77a', roughness: 1 }));
  twine.castShadow = true; if (o.twine !== false) g.add(twine);
  g.userData.eyelet = new THREE.Vector3(-w / 2 + 0.09, 0, 0.012);
  g.userData.width = w;
  return g;
}

// ---------------------------------------------------------------- felt things of the city
export function feltBus() {
  const g = new THREE.Group();
  g.add(feltMesh(new RoundedBoxGeometry(2.2, 0.9, 0.9, 4, 0.2), '#f0a12b', { len: 0.01 }));
  g.children[0].position.y = 0.72;
  const roofSnow = feltBlob('#fbf8f2', [0, 1.2, 0], [1.0, 0.08, 0.4], [0, 0, 0], { len: 0.012 }); g.add(roofSnow);
  g.add(feltMesh(new RoundedBoxGeometry(2.22, 0.12, 0.92, 3, 0.05), '#22396b', { len: 0.006, layers: 5 }));
  g.children[g.children.length - 1].position.y = 0.38;
  ['B', 'U', 'S'].forEach((ch, i) => {
    const win = feltMesh(new RoundedBoxGeometry(0.46, 0.42, 0.04, 3, 0.04), '#22396b', { len: 0.005, layers: 4 });
    win.position.set(-0.7 + i * 0.52, 0.8, 0.45); g.add(win);
    const letter = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), paper('#fff4d6', {
      w: 256, h: 256, seed: i + 30, draw: (x, w, h) => { x.fillStyle = '#e8892b'; x.font = '900 200px Nunito'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ch, w / 2, h / 2 + 14); },
    }));
    letter.position.set(-0.7 + i * 0.52, 0.8, 0.475); letter.rotation.z = (i - 1) * 0.06; g.add(letter);
  });
  const screen = feltMesh(new RoundedBoxGeometry(0.06, 0.42, 0.6, 3, 0.03), '#9fd0ff', { len: 0.004, layers: 3 });
  screen.position.set(1.1, 0.82, 0); g.add(screen);
  [-0.68, 0.68].forEach((x) => {
    const wheel = feltMesh(new THREE.TorusGeometry(0.16, 0.08, 16, 32), '#2a2a33', { len: 0.008 });
    wheel.position.set(x, 0.24, 0.42); g.add(wheel);
    g.add(blob(gloss('#c9c4bb', { roughness: 0.4 }), [x, 0.24, 0.47], [0.08, 0.08, 0.03]));
  });
  g.add(blob(new THREE.MeshStandardMaterial({ color: '#fff3b0', emissive: '#ffd970', emissiveIntensity: 1.2 }), [1.12, 0.5, 0.3], [0.03, 0.06, 0.06]));
  return g;
}

export function feltGer(scale = 1) {
  const g = new THREE.Group();
  g.add(feltMesh(new THREE.CylinderGeometry(0.42, 0.42, 0.34, 48, 3), '#f7f2e8', { len: 0.01 }));
  g.children[0].position.y = 0.17;
  g.add(feltMesh(new THREE.ConeGeometry(0.47, 0.26, 48, 3), '#f3ede2', { len: 0.01 }));
  g.children[1].position.y = 0.47;
  const band = feltMesh(new THREE.TorusGeometry(0.425, 0.018, 8, 64), '#e8892b', { len: 0.004, layers: 3 });
  band.rotation.x = Math.PI / 2; band.position.y = 0.26; g.add(band);
  const door = feltMesh(new RoundedBoxGeometry(0.15, 0.22, 0.04, 2, 0.015), '#e2562c', { len: 0.004, layers: 3 });
  door.position.set(0, 0.12, 0.41); g.add(door);
  g.scale.setScalar(scale);
  return g;
}

export function hillLayer(color, y, depth, seed, amp, width = 16) {
  const r = mulberry(seed), sh = new THREE.Shape();
  sh.moveTo(-width / 2, -1);
  for (let i = 0; i <= 24; i++) {
    const x = -width / 2 + (i / 24) * width;
    sh.lineTo(x, y + Math.sin(i * 0.7 + seed) * amp * 0.6 + r() * amp * 0.4);
  }
  sh.lineTo(width / 2, -1); sh.closePath();
  const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.03, bevelEnabled: false, curveSegments: 24 }), paper(color, { seed }));
  m.position.z = depth; m.castShadow = true; m.receiveShadow = true;
  return m;
}

export function skyline() {
  const g = new THREE.Group();
  const r = mulberry(17);
  [[-2.6, 1.9, 0.8], [-1.6, 2.6, 0.9], [-0.4, 2.2, 0.8], [1.9, 2.8, 0.9], [3.0, 2.0, 0.8]].forEach(([x, h, w], i) => {
    const lit = [];
    const tex = textTexture(256, Math.round(256 * h / w), (c, cw, ch) => {
      c.fillStyle = '#1d3463'; c.fillRect(0, 0, cw, ch);
      for (let y = 24; y < ch - 20; y += 40) for (let xx = 22; xx < cw - 26; xx += 44) {
        if (r() < 0.62) { const col = r() < 0.7 ? '#ffd970' : '#f7a64a'; lit.push([xx, y, col]); c.fillStyle = col; c.fillRect(xx, y, 22, 24); }
      }
    });
    const em = textTexture(256, Math.round(256 * h / w), (c, cw, ch) => {
      c.fillStyle = '#000000'; c.fillRect(0, 0, cw, ch);
      lit.forEach(([xx, y, col]) => { c.fillStyle = col; c.fillRect(xx, y, 22, 24); });
    });
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.05, 2, 0.02), new THREE.MeshStandardMaterial({ map: tex, emissive: '#ffffff', emissiveMap: em, emissiveIntensity: 0.55, roughness: 0.9 }));
    m.position.set(x, h / 2, 0); m.castShadow = true; g.add(m);
  });
  // the Blue Sky tower: a glass-blue paper sail
  const sail = new THREE.Shape();
  sail.moveTo(0, 0); sail.lineTo(0, 4.4); sail.bezierCurveTo(0.8, 3.9, 1.25, 2.0, 1.2, 0); sail.closePath();
  const t = new THREE.Mesh(new THREE.ExtrudeGeometry(sail, { depth: 0.05, bevelEnabled: false, curveSegments: 32 }), paper('#3c84d4', {
    seed: 23, draw: (c, w, h) => { c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 6; for (let y = 30; y < h; y += 46) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y + 14); c.stroke(); } },
  }));
  t.position.set(0.6, 0, 0.1); t.castShadow = true; g.add(t);
  return g;
}

export function alarmClock() {
  const g = new THREE.Group();
  const body = feltMesh(new THREE.CylinderGeometry(0.32, 0.32, 0.18, 48), '#e8562a', { len: 0.009 });
  body.rotation.x = Math.PI / 2; g.add(body);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.26, 48), paper('#fff6e6', {
    w: 512, h: 512, seed: 41, draw: (c, w, h) => {
      c.strokeStyle = '#22396b'; c.lineCap = 'round';
      for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; c.lineWidth = 14; c.beginPath(); c.moveTo(256 + Math.cos(a) * 205, 256 + Math.sin(a) * 205); c.lineTo(256 + Math.cos(a) * 175, 256 + Math.sin(a) * 175); c.stroke(); }
      c.lineWidth = 22; c.beginPath(); c.moveTo(256, 256); c.lineTo(266, 105); c.stroke(); c.beginPath(); c.moveTo(256, 256); c.lineTo(150, 300); c.stroke();
    },
  }));
  face.position.z = 0.095; g.add(face);
  [-1, 1].forEach((s) => g.add(feltBlob('#f2b23a', [s * 0.2, 0.3, 0], [0.12, 0.08, 0.1], [0, 0, -s * 0.5], { len: 0.008 })));
  [-1, 1].forEach((s) => g.add(feltTube('#c9452a', [[s * 0.18, -0.24, 0], [s * 0.25, -0.36, 0.02]], 0.03, { len: 0.005 })));
  return g;
}

// ---------------------------------------------------------------- the dawn world: sky, light, snow, road, the city behind
export const ROAD_Z = -3.0;
export function dawnWorld(scene) {
  // painted dawn sky: deep winter blue overhead, a warm band low behind the city
  const skyTex = textTexture(64, 1024, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    [[0, '#0d1838'], [0.45, '#1a3268'], [0.58, '#2f5398'], [0.65, '#6f87c0'], [0.695, '#c99c92'], [0.725, '#f2b47c'], [0.76, '#f8cf92'], [1, '#f8d8a2']].forEach(([s, c]) => grd.addColorStop(s, c));
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  });
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), new THREE.MeshBasicMaterial({ map: skyTex, toneMapped: false }));
  sky.position.set(0, 9, -16); scene.add(sky);
  scene.background = new THREE.Color('#0d1838');

  scene.add(new THREE.HemisphereLight('#c4d4ff', '#f3dcc4', 0.45));
  keyLight(scene, { pos: [-6, 8, 7], intensity: 2.8, size: 8, color: '#ffe2c4', map: 4096 });
  const rim = new THREE.DirectionalLight('#ffc590', 2.4); rim.position.set(4, 3.5, -9); scene.add(rim);
  const fill = new THREE.DirectionalLight('#9fb8ff', 0.5); fill.position.set(7, 3, 6); scene.add(fill);

  // snowy felt ground with soft drifts, pressed flat where the road runs
  const groundH = (x, z) => {
    const y = -z, m = THREE.MathUtils.smoothstep(Math.abs(z - ROAD_Z), 0.7, 1.3);
    return (Math.sin(x * 0.9) * 0.05 + Math.cos(y * 1.3 + x * 0.4) * 0.05 + Math.sin(x * 2.3 + y * 1.7) * 0.02) * m - 0.06 * (1 - m);
  };
  const gg = new THREE.PlaneGeometry(30, 30, 200, 200);
  const p = gg.attributes.position;
  for (let i = 0; i < p.count; i++) p.setZ(i, groundH(p.getX(i), -p.getY(i)));
  gg.computeVertexNormals();
  const ground = feltMesh(gg, '#f1f4fa', { layers: 0, bump: 1.3, sheen: 0.4 }); ground.rotation.x = -Math.PI / 2; scene.add(ground);
  // the road: slushy blue-grey felt with a dashed paper centre line, snow banked along both kerbs
  const road = feltMesh(new RoundedBoxGeometry(30, 0.08, 1.45, 2, 0.03), '#9aa6bb', { layers: 0, bump: 1.6, sheen: 0.5 });
  road.position.set(0, -0.03, ROAD_Z); scene.add(road);
  for (let x = -8; x < 8; x += 0.9) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.06), new THREE.MeshStandardMaterial({ color: '#f4efe4', roughness: 0.9 }));
    d.rotation.x = -Math.PI / 2; d.position.set(x, 0.013, ROAD_Z); d.receiveShadow = true; scene.add(d);
  }
  [-1, 1].forEach((s) => scene.add(feltTube('#fbfbfd', [[-9, 0.0, ROAD_Z + s * 0.78], [-3, 0.02, ROAD_Z + s * 0.8], [3, 0.0, ROAD_Z + s * 0.77], [9, 0.02, ROAD_Z + s * 0.8]], 0.1, { len: 0.012, layers: 6 })));

  // back of the set: hills with gers, the skyline, the tower
  scene.add(hillLayer('#e3ebf5', 1.0, -9.5, 7, 0.5));
  const city = skyline(); city.position.set(0.4, 0, -8.6); scene.add(city);
  scene.add(hillLayer('#f1f4f8', 0.55, -6.6, 11, 0.4));
  [[-2.6, -6.2, 0.9], [-1.5, -6.0, 0.75], [2.4, -6.1, 0.85]].forEach(([x, z, s]) => { const ger = feltGer(s); ger.position.set(x, 0.38, z); scene.add(ger); });
  scene.add(hillLayer('#fbfaf7', 0.25, -4.6, 19, 0.3));
  return { groundH };
}

// Mongolian subtitle, placed high and clear of the Reels UI (stills and animated views alike)
export function subtitle(stage, w, sub) {
  const el = document.createElement('div');
  el.textContent = sub;
  Object.assign(el.style, {
    position: 'absolute', left: '60px', top: '168px', width: (w - 120) + 'px', textAlign: 'center', zIndex: 5, lineHeight: '1.18',
    font: '900 58px Nunito, sans-serif', color: '#fff8ec', textShadow: '0 4px 18px rgba(10,20,45,.6), 0 2px 0 rgba(10,20,45,.4)',
  });
  stage.appendChild(el);
  return el;
}

// ---------------------------------------------------------------- render once while loading (no screenshot timeout), then show the picture and the subtitle
export async function finish(S, stage, { w, h, sub, safe, extra } = {}) {
  S.post.composer.render();
  const img = new Image();
  img.src = S.canvas.toDataURL('image/png');
  await img.decode();
  Object.assign(img.style, { position: 'absolute', left: '0', top: '0', width: w + 'px', height: h + 'px' });
  S.canvas.replaceWith(img);
  if (sub) subtitle(stage, w, sub);
  if (extra) stage.insertAdjacentHTML('beforeend', extra);
  if (safe) {   // Reels UI overlay, for checking the composition only
    const o = document.createElement('div');
    Object.assign(o.style, { position: 'absolute', left: '0', top: '0', width: w + 'px', height: h + 'px', zIndex: 6, boxSizing: 'border-box', borderTop: '220px solid rgba(255,0,80,.18)', borderBottom: '380px solid rgba(255,0,80,.18)', borderRight: '140px solid rgba(255,0,80,.18)' });
    stage.appendChild(o);
  }
}
