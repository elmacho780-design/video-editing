// Cast sheet: the felt student in three views and three moods, on a paper sweep.
import { THREE, setup, keyLight } from './three-common.js';
import { girl } from './girl.js';

const SW = 1920, SH = 1080;
let S;

export async function init(q) {
  const stage = document.getElementById('stage');
  stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
  globalThis.FELT_Q = +(q.get('fq') || 0.6);
  S = setup(stage, { w: SW, h: SH, fov: 18, ssaa: +(q.get('ssaa') || 1), exposure: 0.88 });
  const { scene, camera } = S;
  scene.background = new THREE.Color('#efe9df');
  scene.add(new THREE.HemisphereLight('#fff6ec', '#d8cfc2', 0.9));
  keyLight(scene, { pos: [-4, 7, 6], intensity: 2.4, size: 6, color: '#fff1e2', map: 2048 });
  const rim = new THREE.DirectionalLight('#ffe9d6', 1.4); rim.position.set(4, 4, -6); scene.add(rim);
  const fill = new THREE.DirectionalLight('#dbe8ff', 0.5); fill.position.set(6, 3, 6); scene.add(fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), new THREE.MeshStandardMaterial({ color: '#f3eee6', roughness: 0.95 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  [
    { x: -1.15, ry: 0.35, pose: { reach: 1, look: [0.2, 0.6], kick: 1 } },
    { x: 0.2, ry: 0.0, pose: { reach: 0, look: [0, 0], mood: 'calm', kick: 0 } },
    { x: 1.5, ry: -1.0, pose: { reach: 0.4, look: [0.2, 0.1], mood: 'worried', kick: 0 } },
  ].forEach(({ x, ry, pose }) => { const g = girl(pose); g.position.set(x, 0, 0); g.rotation.y = ry; scene.add(g); });

  camera.position.set(0.15, 1.15, 8.6);
  camera.lookAt(0.15, 1.0, 0);
  S.post.dof.focus = 8.6; S.post.dof.aper = 0.6; S.post.dof.maxCoc = 4;
  S.post.bloom.strength = 0.04;
  S.post.vig.uniforms.amt.value = 0.15;

  S.post.composer.render();
  const img = new Image();
  img.src = S.canvas.toDataURL('image/png');
  await img.decode();
  Object.assign(img.style, { position: 'absolute', left: '0', top: '0', width: SW + 'px', height: SH + 'px' });
  S.canvas.replaceWith(img);
  const lab = document.createElement('div');
  lab.innerHTML = '<b>HML cast</b> · needle-felt&nbsp;&nbsp;&nbsp;<span style="opacity:.55">student · delighted · calm · worried</span>';
  Object.assign(lab.style, { position: 'absolute', left: '64px', top: '48px', font: '800 30px Nunito, sans-serif', color: '#3b3128', zIndex: 5 });
  stage.appendChild(lab);
}

export function frame() {}
