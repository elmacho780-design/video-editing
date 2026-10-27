// Style frame: "the turn". A needle-felt and cardstock miniature of winter Ulaanbaatar.
// Memorised words wait in a walnut card-catalogue cabinet; four of them fly out as paper tags and start becoming the world.
import { THREE, setup } from './three-common.js';
import { feltBlob } from './felt.js';
import { girl } from './girl.js';
import { mulberry } from './lib2d.js';
import { cabinet, wordTag, feltBus, alarmClock, dawnWorld, finish, ROAD_Z } from './set.js';

const FW = 1080, FH = 1920;
let S;

export async function init(q) {
  const stage = document.getElementById('stage');
  stage.style.width = FW + 'px'; stage.style.height = FH + 'px';
  globalThis.FELT_Q = +(q.get('fq') || 0.8);
  S = setup(stage, { w: FW, h: FH, fov: 30, ssaa: +(q.get('ssaa') || 1.5), exposure: 0.9 });
  const o = world(S.scene, S.camera);
  S.post.dof.focus = o.focus; S.post.dof.aper = o.aper; S.post.dof.maxCoc = o.maxCoc;
  S.post.bloom.strength = 0.1; S.post.bloom.threshold = 0.96;
  S.post.vig.uniforms.amt.value = 0.3;
  S.post.vig.uniforms.warm.value = 0.12;
  await finish(S, stage, { w: FW, h: FH, sub: q.get('sub') ?? 'Үгийг цээжлэх биш, ойлгох.', safe: q.get('safe') });
}

// the hero frame's set, camera and post settings, with h: handles on the moving parts (animated in film.js)
export function world(scene, camera) {
  const { groundH } = dawnWorld(scene);
  // her boot prints, leading in from the viewer's side
  const printM = new THREE.MeshStandardMaterial({ color: '#c9d3e6', roughness: 1, polygonOffset: true, polygonOffsetFactor: -2 });
  const print = (x, z, sx, sz, ry) => {
    const d = new THREE.Mesh(new THREE.CircleGeometry(1, 24), printM);
    d.scale.set(sx, sz, 1); d.rotation.set(-Math.PI / 2, 0, ry); d.position.set(x, groundH(x, z) + 0.004, z); d.receiveShadow = true; scene.add(d);
  };
  for (let i = 0; i < 6; i++) {   // boots, alternating left and right
    const t = i / 5, x = -0.3 + t * 0.6 + (i % 2 ? 0.09 : -0.09), z = 2.45 + t * 2.7;
    print(x, z, 0.075, 0.13, -0.18); print(x + 0.01, z - 0.13, 0.06, 0.05, -0.18);
  }
  const bus = feltBus(); bus.position.set(0.55, 0.02, ROAD_Z - 0.05); bus.rotation.y = -0.1; bus.scale.setScalar(0.75); scene.add(bus);
  const headlight = new THREE.PointLight('#ffd98a', 2.5, 2.5, 1.5); headlight.position.set(1.35, 0.42, ROAD_Z + 0.2); scene.add(headlight);
  const cab = cabinet(); cab.position.set(-1.45, 0, -0.55); cab.rotation.y = 0.45; scene.add(cab);
  const clock = alarmClock(); clock.position.set(-1.42, 2.98, -0.45); clock.rotation.set(-0.05, 0.45, 0.05); scene.add(clock);

  // words in flight
  const tag = (word, color, pos, rot, ink) => { const t = wordTag(word, color, ink); t.position.set(...pos); t.rotation.set(...rot); scene.add(t); return t; };
  const tags = {
    late: tag('late', '#ef7a2f', [-0.6, 3.52, -0.3], [0.05, 0.3, 0.14]),
    snowing: tag('snowing', '#4f86c9', [0.5, 4.1, -1.3], [0.1, -0.12, -0.07]),
    bus: tag('bus', '#f2b33a', [0.85, 1.95, -1.5], [0.0, -0.2, 0.1], '#7a3d12'),
    because: tag('because', '#ec6f60', [0.3, 2.85, 0.85], [-0.08, -0.22, 0.07]),
  };
  // "snowing" crumbles into felt snow as it flies; more snow drifts over the whole set
  const r = mulberry(29), trail = [], snow = [];
  for (let i = 0; i < 18; i++) {
    const t = i / 17;
    const b = feltBlob('#fbf8f2', [1.1 + t * 1.3 + (r() - 0.5) * 0.3, 3.85 - t * 1.4 + (r() - 0.5) * 0.4, -1.3 - t * 0.5], [0.03 + r() * 0.03, 0.03 + r() * 0.03, 0.03 + r() * 0.03], [0, 0, 0], { len: 0.008, layers: 5 });
    scene.add(b); trail.push(b);
  }
  for (let i = 0; i < 30; i++) {
    const s = 0.022 + r() * 0.03;
    const b = feltBlob('#fbf8f2', [-2.4 + r() * 5, 0.5 + r() * 4.4, -5.5 + r() * 7], [s, s, s], [0, 0, 0], { len: 0.007, layers: 4 });
    scene.add(b); snow.push(b);
  }
  // close to the lens: out-of-focus drifts that frame the bottom of the shot
  [[-1.25, 5.2, 0.75, 0.3], [0.2, 5.6, 0.55, 0.2], [1.35, 4.9, 0.7, 0.32]].forEach(([x, z, rx, ry]) => scene.add(feltBlob('#fbfbfd', [x, -0.08, z], [rx, ry, 0.45], [0, 0, 0], { len: 0.012, layers: 6 })));

  // the student
  const gl = girl({ reach: 1, look: [0.4, 0.9], mood: 'delighted', kick: 1 }); gl.position.set(-0.42, 0, 1.85); gl.rotation.y = 0.22; gl.scale.setScalar(1.12); scene.add(gl);

  camera.position.set(-0.05, 1.3, 11.5);
  camera.lookAt(-0.05, 1.85, 1.5);
  return { focus: 9.7, aper: 3.2, maxCoc: 12, h: { bus, clock, tags, trail, snow, girl: gl } };
}

export function frame() {}
