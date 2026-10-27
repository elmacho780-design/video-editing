// Shot 4, animated (?view=shot4): the HML-orange yarn on a felting needle stitches the grey words into one sentence,
// and each word it reaches fills with colour from its eyelet outwards. The camera follows the needle down the garland
// and settles on the approved key frame (board shot 4).
// Clip time t = 0 is film time 7.0 s; the seven stitches land on the score's stitch notes (7.0, 7.5 ... 10.0),
// and the last half second shows the needle pulling through "snowing" before the burst.
import { THREE, setup } from './three-common.js';
import { feltMesh, feltBlob, gloss } from './felt.js';
import { girl } from './girl.js';
import { wordTag, subtitle } from './set.js';
import { archive, bigWall, TAG_COLOURS, SUBS } from './board.js';

const FW = 1080, FH = 1920;
const DUR = 3.5;
const STITCH = [0, 0.5, 1, 1.5, 2, 2.5, 3];   // seconds after 7.0
const COLOUR_AT = 1;                          // 8.0 s: the key turns to D major, the warm light comes up

const cream = ['#f4ead6', '#1e3a6e'];
const SEQ = [
  ['She was', cream, [-0.42, 3.3, 1.2], 0.08, 0.62],
  ['late', TAG_COLOURS[0], [0.42, 3.05, 1.3], -0.1, 1],
  ['for the', cream, [-0.4, 2.68, 1.2], 0.06, 0.62],
  ['bus', TAG_COLOURS[2], [0.42, 2.42, 1.3], -0.08, 1],
  ['because', TAG_COLOURS[3], [-0.25, 1.98, 1.35], 0.05, 1],
  ['it was', cream, [0.3, 1.58, 1.2], -0.06, 0.62],
  ['snowing', TAG_COLOURS[1], [-0.3, 1.18, 1.15], 0.1, 1],
];
const GREYS = [['#9399a3', '#f1f2f4'], ['#a59f97', '#f6f3ee'], ['#8b929e', '#eef0f3']];

const v3 = (a) => new THREE.Vector3(...a);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => { const k = clamp01((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const easeOut = (x) => 1 - (1 - clamp01(x)) ** 3;

let S, update;

// a word tag that starts grey and floods with its colour from the eyelet: both faces in one shader, mixed by uP
function stitchTag(word, [col, ink], grey, pos, rz, sc) {
  const t = wordTag(word, col, ink, { twine: false });
  const greyMap = wordTag(word, grey[0], grey[1], { twine: false }).children[0].material[4].map;
  const mesh = t.children[0], front = mesh.material[4], edge = mesh.material[0];
  const w = t.userData.width;
  const u = { uGrey: { value: greyMap }, uP: { value: 0 }, uEye: { value: new THREE.Vector2(0.09 / w, 0.5) }, uAsp: { value: w / 0.42 } };
  front.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D uGrey; uniform float uP; uniform vec2 uEye; uniform float uAsp;')
      .replace('#include <map_fragment>', `#include <map_fragment>
        float dEye = length((vMapUv - uEye) * vec2(uAsp, 1.0)), reach = uP * (uAsp + 0.3);
        float stillGrey = smoothstep(reach - 0.14, reach, dEye);
        diffuseColor.rgb = mix(diffuseColor.rgb, texture2D(uGrey, vMapUv).rgb, stillGrey);
        diffuseColor.rgb *= 1.0 + 0.18 * (1.0 - abs(stillGrey * 2.0 - 1.0)) * step(0.001, uP) * step(uP, 0.999);`);
  };
  front.customProgramCacheKey = () => 'stitch-tag';
  const edgeGrey = new THREE.Color(grey[0]).multiplyScalar(0.85), edgeCol = new THREE.Color(col).multiplyScalar(0.85);
  // pivot on the eyelet, so the tag can jolt when stitched without tearing away from the yarn
  t.position.set(...pos); t.rotation.z = rz; t.scale.setScalar(sc); t.updateMatrixWorld(true);
  const eye = t.localToWorld(t.userData.eyelet.clone());
  const pivot = new THREE.Group();
  pivot.position.copy(eye); pivot.rotation.z = rz; pivot.scale.setScalar(sc);
  t.position.copy(t.userData.eyelet).negate(); t.rotation.set(0, 0, 0); t.scale.setScalar(1);
  pivot.add(t);
  return { pivot, eye, rz, sc, set: (p) => { u.uP.value = p; edge.color.copy(edgeGrey).lerp(edgeCol, p); } };
}

export function feltNeedle() {
  const nd = new THREE.Group();   // local origin at the tip, shaft along +y
  const steel = gloss('#d4d7dc', { metalness: 0.95, roughness: 0.2 });
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 14), steel); sh.position.y = 0.43; sh.castShadow = true; nd.add(sh);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.09, 14), steel); tip.rotation.x = Math.PI; nd.add(tip);
  const grip = feltMesh(new THREE.CylinderGeometry(0.055, 0.055, 0.3, 24), '#ee8a2c', { len: 0.01, layers: 6 }); grip.position.y = 0.97; nd.add(grip);
  [0.82, 1.12].forEach((y) => nd.add(feltBlob('#ee8a2c', [0, y, 0], [0.055, 0.055, 0.055], [0, 0, 0], { len: 0.01, layers: 6, seg: 32 })));
  return nd;
}

export async function init(q) {
  window.DUR = DUR;
  const stage = document.getElementById('stage');
  stage.style.width = FW + 'px'; stage.style.height = FH + 'px';
  globalThis.FELT_Q = +(q.get('fq') || 0.8);
  S = setup(stage, { w: FW, h: FH, fov: 30, ssaa: +(q.get('ssaa') || 1.5), exposure: 0.95 });
  update = build(S);
  subtitle(stage, FW, SUBS[4]);
}

export function frame(t) {
  update(t);
  S.post.composer.render();
}

// the shot's set on S.scene; returns update(t) for clip time t (the film calls it with t = film time - 7)
export function build(S) {
  const { scene } = S;
  let warmLight, hemi;
  archive(scene, { warm: 1 });
  scene.traverse((o) => { if (o.isDirectionalLight && o.color.getHexString() === 'ffbf80') warmLight = o; if (o.isHemisphereLight) hemi = o; });
  bigWall(scene);

  const tags = SEQ.map(([w, col, p, rz, sc], i) => { const tg = stitchTag(w, col, GREYS[i % 3], p, rz, sc); scene.add(tg.pivot); return tg; });

  // the yarn's path, as on the key frame: in from the top left, through every eyelet, swinging left and right between them,
  // then on through "snowing" where the needle pulls it out after the last stitch
  const eyes = tags.map((tg) => tg.eye);
  const pts = [v3([-1.5, 3.55, 0.9])];
  eyes.forEach((e, i) => {
    pts.push(e.clone().add(v3([0, 0, 0.03])));
    if (i < eyes.length - 1) pts.push(e.clone().lerp(eyes[i + 1], 0.5).add(v3([i % 2 ? -0.25 : 0.25, -0.08, 0.12])));
  });
  pts.push(eyes[eyes.length - 1].clone().add(v3([0.32, -0.22, 0.3])));
  const curve = new THREE.CatmullRomCurve3(pts);

  // where along the yarn (arc length, 0..1) each eyelet sits: the needle is there on its stitch note
  const M = 3000, samples = curve.getSpacedPoints(M);
  let from = 0;
  const keys = eyes.map((e, i) => {
    const target = e.clone().add(v3([0, 0, 0.03]));
    let best = from, bd = Infinity;
    for (let k = from; k <= M; k++) { const d = samples[k].distanceToSquared(target); if (d < bd) { bd = d; best = k; } }
    from = best;
    return [STITCH[i], best / M];
  });
  keys.push([DUR, 1]);

  // the whole yarn built once; it is revealed behind the needle with a draw range (all felt shells share the geometry)
  const N = 900, RAD = 12;
  const geo = new THREE.TubeGeometry(curve, N, 0.018, RAD, false);
  const yarn = { geo, N, RAD };
  scene.add(feltMesh(geo, '#ee8a2c', { len: 0.012, layers: 8 }));
  scene.add(feltBlob('#ee8a2c', pts[0].toArray(), [0.018, 0.018, 0.018], [0, 0, 0], { len: 0.012, layers: 8, seg: 32 }));
  const yarnEnd = feltBlob('#ee8a2c', [0, 0, 0], [0.018, 0.018, 0.018], [0, 0, 0], { len: 0.012, layers: 8, seg: 32 });
  scene.add(yarnEnd);
  const needle = feltNeedle(); scene.add(needle);

  // she watches, worried, until the colour arrives on the D major chord; then she lights up
  const girls = ['worried', 'delighted'].map((mood) => {
    const gl = girl({ reach: 0, look: [-0.5, mood === 'worried' ? 1 : 0.9], mood, kick: 0 });
    gl.position.set(0.82, 0, 3.6); gl.rotation.y = -0.5; scene.add(gl);
    return gl;
  });

  S.post.dof.aper = 2.4; S.post.dof.maxCoc = 10;
  S.post.bloom.strength = 0.08; S.post.bloom.threshold = 0.92;
  S.post.vig.uniforms.amt.value = 0.32;

  // how far along the yarn the needle is at clip time t: still at each eyelet on its note, a smooth swoop between
  const along = (t) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) {
      const [ta, ua] = keys[i], [tb, ub] = keys[i + 1];
      if (t <= tb) { const s = (t - ta) / (tb - ta); return ua + (ub - ua) * (i === keys.length - 2 ? easeOut(s) : smooth(0, 1, s)); }
    }
    return 1;
  };

  return (t) => {
    const { camera } = S;

    // the yarn behind the needle, and the needle stabbing each eyelet on its note
    const u = along(t);
    yarn.geo.setDrawRange(0, Math.floor(u * yarn.N) * yarn.RAD * 6);
    const p = curve.getPointAt(u);
    yarnEnd.position.copy(p);
    const dir = curve.getTangentAt(Math.min(u, 0.999)).add(IN.clone().multiplyScalar(0.7)).normalize();
    const stab = STITCH.reduce((a, ts) => a + Math.exp(-(((t - ts) / 0.07) ** 2)), 0);
    needle.quaternion.setFromUnitVectors(UP, dir);
    needle.position.copy(p).addScaledVector(dir, 0.06 * stab - 0.02);

    // each stitched word floods with colour and gives a little jolt; the others sway, pinned and waiting
    tags.forEach((tg, i) => {
      const dt = t - STITCH[i];
      tg.set(dt < 0 ? 0 : easeOut(dt / 0.45));
      const jolt = dt < 0 ? 0 : Math.exp(-dt * 6) * Math.sin(dt * 24);
      tg.pivot.rotation.z = tg.rz + 0.07 * jolt + (dt < 0 ? 0.012 * Math.sin(t * 2.3 + i * 1.7) : 0);
      tg.pivot.scale.setScalar(tg.sc * (1 + 0.05 * Math.max(0, jolt)));
    });

    // the warm light comes up with the D major chord
    const warm = 0.1 + 0.7 * smooth(COLOUR_AT - 0.4, COLOUR_AT + 0.6, t);
    warmLight.intensity = 2.2 * warm; hemi.intensity = 0.55 + 0.15 * warm;
    S.post.vig.uniforms.warm.value = 0.15 * smooth(COLOUR_AT - 0.4, COLOUR_AT + 0.6, t);
    girls[0].visible = t < COLOUR_AT; girls[1].visible = t >= COLOUR_AT;

    // the camera drifts down the garland with the needle and settles on the key frame by the last stitch
    const k = smooth(0, STITCH[STITCH.length - 1], t);
    camera.position.lerpVectors(v3(CAM_A.pos), v3(CAM_B.pos), k);
    const look = v3(CAM_A.look).lerp(v3(CAM_B.look), k);
    camera.lookAt(look);
    S.post.dof.focus = camera.position.distanceTo(look) - 0.36;
  };
}

const UP = new THREE.Vector3(0, -1, 0), IN = new THREE.Vector3(0, 0, -1);
const CAM_A = { pos: [-0.2, 2.8, 7.7], look: [-0.3, 3.02, 1.2] }, CAM_B = { pos: [0.1, 2.1, 8.9], look: [0.05, 2.42, 1.2] };
