// Option 3, "Soft 3D toy world": the same moment built as glossy toys on a snowy tabletop.
import { THREE, RoundedBoxGeometry, setup, keyLight, textTexture, urlTexture, card, glossy, matte, subtitleOverlay, W, H } from './three-common.js';
import { mulberry } from './lib2d.js';

const NAVY = '#1e4c8f', NAVY_D = '#163463', ORANGE = '#f0561e', AMBER = '#f7931e', YELLOW = '#ffc93c', CORAL = '#f2876b',
  MAROON = '#7a1f2b', SKIN = '#f3cdb0', PINK = '#f59bb5', HAIR = '#1c1818', SNOW = '#f8f7f3';

let S;

function letterBlock(ch, color, size = 0.36) {
  const face = textTexture(256, 256, (g, w, h) => {
    g.fillStyle = color; g.fillRect(0, 0, w, h);
    g.fillStyle = '#ffffff'; g.font = '900 190px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(ch, w / 2, h / 2 + 12);
  });
  const plain = glossy(color, { roughness: 0.28 });
  const front = new THREE.MeshPhysicalMaterial({ map: face, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12 });
  const m = new THREE.Mesh(new RoundedBoxGeometry(size, size, size, 4, size * 0.16), [plain, plain, plain, plain, front, plain]);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

// a word flying along an arc, letters tumbling a little and spreading out of the drawer
function flyingWord(word, color, curve, t0, t1, size, spin) {
  const g = new THREE.Group();
  const n = word.length;
  for (let i = 0; i < n; i++) {
    const u = t0 + (t1 - t0) * (i / Math.max(1, n - 1));
    const b = letterBlock(word[i], color, size);
    b.position.copy(curve.getPoint(u));
    const tan = curve.getTangent(u);
    b.rotation.set(spin * (i - n / 2) * 0.12, -Math.atan2(tan.z, tan.x) * 0.25 + 0.15, Math.atan2(tan.y, Math.hypot(tan.x, tan.z)) * 0.5 + (i % 2 ? 0.08 : -0.08));
    g.add(b);
  }
  return g;
}

function cabinet() {
  const g = new THREE.Group();
  const wood = matte('#8f8a84', { roughness: 0.6 }), dark = matte('#5f5a55'), front = matte('#b3aea7', { roughness: 0.55 });
  const body = new THREE.Mesh(new RoundedBoxGeometry(2.0, 3.3, 0.95, 4, 0.06), wood);
  body.position.y = 1.72; body.castShadow = body.receiveShadow = true; g.add(body);
  const top = new THREE.Mesh(new RoundedBoxGeometry(2.2, 0.16, 1.1, 4, 0.05), dark);
  top.position.y = 3.42; top.castShadow = true; g.add(top);
  const words = [['run', 'cold', ''], ['early', 'wait', ''], ['friend', 'coat', 'home'], ['school', 'warm', 'street'], ['happy', '', 'window'], ['catch', 'city', '']];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) {
    const w = words[r][c], open = !w;
    const label = textTexture(256, 96, (x, ww, hh) => {
      x.fillStyle = '#f4f2ee'; x.fillRect(0, 0, ww, hh);
      x.strokeStyle = '#bdb9b2'; x.lineWidth = 6; x.strokeRect(3, 3, ww - 6, hh - 6);
      if (w) { x.fillStyle = '#8f8a84'; x.font = '800 46px Nunito'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(w, ww / 2, hh / 2 + 3); }
    });
    const d = new THREE.Group();
    const box = new THREE.Mesh(new RoundedBoxGeometry(0.58, 0.46, open ? 0.7 : 0.1, 3, 0.03), front);
    box.castShadow = box.receiveShadow = true; d.add(box);
    const lab = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.16), new THREE.MeshStandardMaterial({ map: label, roughness: 0.9 }));
    lab.position.set(0, 0.07, (open ? 0.35 : 0.05) + 0.002); d.add(lab);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), glossy('#8f8a84'));
    knob.position.set(0, -0.11, (open ? 0.35 : 0.05) + 0.03); d.add(knob);
    if (open) { const hole = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.36), matte('#3e3a36')); hole.rotation.x = -Math.PI / 2; hole.position.set(0, 0.2, 0); d.add(hole); }
    d.position.set(-0.64 + c * 0.64, 3.05 - r * 0.52 - 0.04, 0.48 + (open ? 0.32 : 0));
    g.add(d);
  }
  return g;
}

function bus() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(3.0, 1.15, 1.2, 5, 0.22), glossy(AMBER, { roughness: 0.3 }));
  body.position.y = 0.92; body.castShadow = body.receiveShadow = true; g.add(body);
  const roof = new THREE.Mesh(new RoundedBoxGeometry(2.8, 0.14, 1.04, 4, 0.06), matte(SNOW));
  roof.position.y = 1.53; roof.castShadow = true; g.add(roof);
  const side = textTexture(1024, 300, (x, w, h) => {
    x.clearRect(0, 0, w, h);
    ['B', 'U', 'S'].forEach((c, i) => {
      x.fillStyle = NAVY_D; x.beginPath(); x.roundRect(40 + i * 250, 30, 220, 210, 34); x.fill();
      x.fillStyle = YELLOW; x.font = '900 190px Nunito'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(c, 150 + i * 250, 146);
    });
    x.fillStyle = '#9fd0ff'; x.beginPath(); x.roundRect(800, 30, 190, 250, 34); x.fill();
  });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.8), new THREE.MeshPhysicalMaterial({ map: side, transparent: true, roughness: 0.2, clearcoat: 1 }));
  panel.position.set(0, 1.0, 0.605); g.add(panel);
  const stripe = new THREE.Mesh(new RoundedBoxGeometry(3.02, 0.16, 1.22, 3, 0.05), glossy(NAVY));
  stripe.position.y = 0.48; g.add(stripe);
  [-0.95, 0.95].forEach((x) => {
    const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.25, 32), glossy(NAVY_D, { roughness: 0.5 }));
    wh.rotation.x = Math.PI / 2; wh.position.set(x, 0.32, 0.56); wh.castShadow = true; g.add(wh);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.27, 24), glossy('#c9c5be'));
    hub.rotation.x = Math.PI / 2; hub.position.set(x, 0.32, 0.57); g.add(hub);
  });
  return g;
}

function city(rnd) {
  const g = new THREE.Group();
  const win = textTexture(256, 512, (x, w, h) => {
    x.fillStyle = '#1b3f78'; x.fillRect(0, 0, w, h);
    for (let yy = 20; yy < h - 20; yy += 46) for (let xx = 22; xx < w - 30; xx += 52) {
      x.fillStyle = rnd() < 0.6 ? YELLOW : rnd() < 0.5 ? AMBER : '#2c5590';
      x.beginPath(); x.roundRect(xx, yy, 30, 30, 6); x.fill();
    }
  });
  win.wrapS = win.wrapT = THREE.RepeatWrapping;
  [[-1.6, -9, 1.4, 4.2], [0.2, -10.5, 1.6, 5.4], [3.6, -9.5, 1.4, 4.6], [5.2, -11, 1.5, 6]].forEach(([x, z, w, h]) => {
    const t = win.clone(); t.needsUpdate = true; t.repeat.set(w / 1.4, h / 2.8);
    const b = new THREE.Mesh(new RoundedBoxGeometry(w, h, 1.4, 3, 0.12), new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 }));
    b.position.set(x, h / 2, z); b.castShadow = b.receiveShadow = true; g.add(b);
    const cap = new THREE.Mesh(new RoundedBoxGeometry(w + 0.06, 0.14, 1.46, 3, 0.06), matte(SNOW));
    cap.position.set(x, h + 0.05, z); g.add(cap);
  });
  // the Blue Sky tower: a glass sail
  const sail = new THREE.Shape();
  sail.moveTo(0, 0); sail.lineTo(0, 7.2); sail.bezierCurveTo(1.3, 6.4, 2.0, 3.2, 1.9, 0); sail.closePath();
  const sg = new THREE.ExtrudeGeometry(sail, { depth: 0.9, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 3, curveSegments: 24 });
  const tower = new THREE.Mesh(sg, new THREE.MeshPhysicalMaterial({ color: '#8cc3f0', roughness: 0.08, metalness: 0.1, clearcoat: 1 }));
  tower.position.set(1.6, 0, -12.2); tower.castShadow = true; g.add(tower);
  // gers on a snowy hill
  const hill = new THREE.Mesh(new THREE.SphereGeometry(5, 48, 24), matte(SNOW, { roughness: 0.9 }));
  hill.scale.set(1.4, 0.32, 1); hill.position.set(-5.5, -0.4, -8); hill.receiveShadow = true; g.add(hill);
  [[-4.2, 1.15, -6.4], [-5.6, 1.2, -7.2], [-3.2, 0.8, -7.6]].forEach(([x, y, z]) => {
    const ger = new THREE.Group();
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.34, 32), matte('#ffffff'));
    wall.position.y = 0.17; ger.add(wall);
    const roofm = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.3, 32), matte('#f4f1ea'));
    roofm.position.y = 0.48; ger.add(roofm);
    const door = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.22), matte(ORANGE));
    door.position.set(0, 0.13, 0.425); ger.add(door);
    ger.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    ger.position.set(x, y - 0.3, z); g.add(ger);
  });
  return g;
}

function alarmClock() {
  const g = new THREE.Group();
  const face = textTexture(512, 512, (x, w, h) => {
    x.fillStyle = '#fff7ec'; x.beginPath(); x.arc(256, 256, 250, 0, Math.PI * 2); x.fill();
    x.strokeStyle = NAVY; x.lineCap = 'round';
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; x.lineWidth = 14; x.beginPath(); x.moveTo(256 + Math.cos(a) * 200, 256 + Math.sin(a) * 200); x.lineTo(256 + Math.cos(a) * 172, 256 + Math.sin(a) * 172); x.stroke(); }
    x.lineWidth = 22; x.beginPath(); x.moveTo(256, 256); x.lineTo(268, 100); x.stroke();
    x.beginPath(); x.moveTo(256, 256); x.lineTo(150, 300); x.stroke();
    x.fillStyle = ORANGE; x.font = '900 120px Nunito'; x.textAlign = 'center'; x.fillText('late', 256, 410);
  });
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.4, 48), glossy(ORANGE));
  ring.rotation.x = Math.PI / 2; g.add(ring);
  const f = new THREE.Mesh(new THREE.CircleGeometry(0.76, 48), new THREE.MeshPhysicalMaterial({ map: face, roughness: 0.3, clearcoat: 1 }));
  f.position.z = 0.205; g.add(f);
  [-1, 1].forEach((s) => {
    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), glossy(YELLOW));
    bell.position.set(s * 0.55, 0.78, 0); bell.rotation.z = -s * 0.5; g.add(bell);
  });
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

function girl() {
  // a vinyl schoolgirl: big round head, solid black bob with a bun, navy blazer, maroon skirt
  const g = new THREE.Group();
  const skin = glossy(SKIN, { roughness: 0.45, clearcoat: 0.3 }), hair = glossy(HAIR, { roughness: 0.35 }), navy = glossy(NAVY, { roughness: 0.5, clearcoat: 0.3 });
  const add = (m, x, y, z) => { m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; g.add(m); return m; };
  [-0.13, 0.13].forEach((x) => {
    add(new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.42, 8, 16), glossy('#2a2f45', { roughness: 0.6 })), x, 0.33, 0);
    add(new THREE.Mesh(new RoundedBoxGeometry(0.17, 0.1, 0.26, 3, 0.04), glossy('#2b2b33')), x, 0.05, 0.04);
  });
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.42, 0.34, 32), glossy(MAROON, { roughness: 0.5, clearcoat: 0.3 })), 0, 0.68, 0);
  add(new THREE.Mesh(new THREE.CapsuleGeometry(0.29, 0.34, 10, 24), navy), 0, 1.0, 0);
  add(new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.07, 14, 28), glossy(CORAL, { roughness: 0.6, clearcoat: 0 })), 0, 1.33, 0).rotation.x = Math.PI / 2;
  const crest = add(new THREE.Mesh(new THREE.CircleGeometry(0.06, 20), glossy(AMBER)), 0.13, 1.08, 0.29); crest.castShadow = false;
  // arms: one down, one raised to catch the word
  const armL = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.38, 8, 16), navy), -0.34, 0.95, 0); armL.rotation.z = -0.25;
  const armR = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.4, 8, 16), navy), 0.42, 1.38, 0.05); armR.rotation.z = -0.75;
  add(new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 14), skin), -0.42, 0.7, 0);
  add(new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 14), skin), 0.6, 1.6, 0.06);
  // head, tilted up toward the words
  const head = new THREE.Group(); head.position.set(0, 1.78, 0); head.rotation.set(-0.22, 0.28, 0.06); g.add(head);
  const hadd = (m, x, y, z) => { m.position.set(x, y, z); m.castShadow = true; head.add(m); return m; };
  hadd(new THREE.Mesh(new THREE.SphereGeometry(0.44, 48, 32), skin), 0, 0, 0);
  const cap = hadd(new THREE.Mesh(new THREE.SphereGeometry(0.47, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.62), hair), 0, 0.02, -0.03);
  cap.rotation.x = -0.35;
  hadd(new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), hair), 0, 0.5, -0.1);
  const fringe = hadd(new THREE.Mesh(new THREE.SphereGeometry(0.46, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.5), hair), 0, 0.1, 0.06);
  fringe.scale.set(1.02, 0.55, 1.0); fringe.rotation.x = 0.55;
  [-0.36, 0.36].forEach((x) => { const side = hadd(new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.38, 8, 16), hair), x, -0.08, 0.04); side.rotation.x = 0.1; });
  [-0.15, 0.15].forEach((x) => {
    const e = hadd(new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 14), glossy(HAIR, { roughness: 0.1 })), x, -0.02, 0.4); e.scale.set(1, 1.35, 0.6);
    const hl = hadd(new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 8), new THREE.MeshBasicMaterial({ color: '#ffffff' })), x - 0.018, 0.025, 0.437); hl.castShadow = false;
    const ch = hadd(new THREE.Mesh(new THREE.CircleGeometry(0.06, 20), new THREE.MeshBasicMaterial({ color: PINK, transparent: true, opacity: 0.8 })), x * 1.45, -0.13, 0.405);
    ch.scale.x = 1.4; ch.lookAt(ch.position.clone().multiplyScalar(2)); ch.castShadow = false;
  });
  const smile = hadd(new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.014, 8, 20, Math.PI), glossy('#8a2b3a')), 0, -0.14, 0.415); smile.rotation.z = Math.PI;
  return g;
}

export async function init(q) {
  const stage = document.getElementById('stage');
  stage.style.width = W + 'px'; stage.style.height = H + 'px';
  S = setup(stage, { fov: 34, ssaa: 2, exposure: 0.95 });
  const { scene, camera } = S;
  // the post chain writes an opaque frame, so the winter sky is a real background
  const sky = textTexture(64, 512, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#4f93d8'); grd.addColorStop(0.5, '#8cc4ef'); grd.addColorStop(0.8, '#cfe7fa'); grd.addColorStop(1, '#e8f3fc');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  });
  scene.background = sky;
  scene.fog = new THREE.Fog('#dcecf9', 26, 52);
  scene.add(new THREE.HemisphereLight('#dceeff', '#fff4e8', 1.0));
  keyLight(scene, { pos: [-6, 11, 8], intensity: 2.3, size: 16 });
  const rim = new THREE.DirectionalLight('#ffe2c4', 1.0); rim.position.set(6, 5, -8); scene.add(rim);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(80, 64), matte('#edf2f7', { roughness: 0.95 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  const cab = cabinet(); cab.position.set(-1.55, 0, -0.4); cab.rotation.y = 0.36; scene.add(cab);
  const b = bus(); b.position.set(1.45, 0, -3.4); b.rotation.y = -0.28; b.scale.setScalar(0.85); scene.add(b);
  const cityG = city(mulberry(5)); cityG.position.z = -3; cityG.scale.setScalar(0.85); scene.add(cityG);
  const clock = alarmClock(); clock.position.set(1.55, 5.9, -7); clock.rotation.y = -0.2; clock.scale.setScalar(0.72); scene.add(clock);
  const gl = girl(); gl.position.set(1.15, 0, 2.3); gl.rotation.y = -0.25; scene.add(gl);

  const C3 = (pts) => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
  scene.add(flyingWord('snowing', '#6fa9e0', C3([[-1.3, 3.3, 0.2], [-1.0, 5.0, -0.6], [0.6, 5.9, -2.2], [2.8, 5.3, -4]]), 0.22, 0.7, 0.4, 1));
  scene.add(flyingWord('late', ORANGE, C3([[-0.8, 2.8, 0.3], [0.2, 4.0, -1.5], [1.2, 4.7, -5]]), 0.3, 0.72, 0.36, -1));
  scene.add(flyingWord('bus', YELLOW, C3([[-1.0, 1.6, 0.4], [0.0, 2.4, -0.6], [1.0, 2.2, -2.4]]), 0.35, 0.8, 0.36, 1));
  scene.add(flyingWord('because', CORAL, C3([[-0.9, 1.2, 0.8], [-0.3, 2.9, 1.6], [0.9, 3.4, 2.1], [1.9, 2.9, 2.4]]), 0.32, 0.96, 0.3, -1));

  // falling snow
  const r = mulberry(21), flake = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.3, clearcoat: 1 });
  for (let i = 0; i < 60; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.03 + r() * 0.035, 12, 8), flake);
    m.position.set(-3.2 + r() * 7, 0.6 + r() * 6, -8 + r() * 10);
    scene.add(m);
  }

  // the beagle, as a standee of the real mascot art
  const tex = await urlTexture('assets/beagle.png', 856, 1104);
  const beagle = card(tex, 1.3, 1.68);
  beagle.position.set(-1.45, 0.84, 2.3); beagle.rotation.y = 0.14; scene.add(beagle);

  camera.position.set(0.1, 5.0, 17.5);
  camera.lookAt(0.1, 2.75, -1);
  S.post.dof.focus = 15.5; S.post.dof.aper = 1.8; S.post.dof.maxCoc = 9;
  S.post.bloom.strength = 0.08;
  S.post.vig.uniforms.amt.value = 0.16;
  subtitleOverlay(stage, 'Үгийг цээжлэх биш, ойлгох.');
}

export function frame(t, q, stage) {
  S.post.composer.render();
}
