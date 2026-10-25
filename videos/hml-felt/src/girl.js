// The student as a needle-felted doll dressed for an Ulaanbaatar morning: HML-orange knit beanie with a pom-pom,
// navy duffle coat with cream toggles and the crest, maroon skirt hem, orange mittens and scarf, fur-cuffed boots.
// Feet on y = 0, facing +z, about 2 units tall to the pom-pom.
import * as THREE from 'three';
import { feltBlob, feltTube, feltMesh, gloss, blob } from './felt.js';

export const GIRL = {
  skin: '#f3c9a6', hair: '#231b1a', navy: '#24407a', navyDeep: '#1a2c55', skirt: '#6a1d2c',
  tights: '#2a2c3a', boot: '#7a4a2c', cuff: '#f4ece0', knit: '#ee8a2c', knitDeep: '#d9701f', cream: '#f6efe2',
  crest: '#f0a030', cheek: '#f2909c',
};

// pose: { reach: 0..1 right arm up, look: [x, y], mood: 'delighted' | 'worried' | 'calm', kick: 0..1 right foot up behind }
export function girl(pose = {}) {
  const C = GIRL, P = { reach: 1, look: [0.1, 0.3], mood: 'delighted', kick: 1, ...pose };
  const F = (o = {}) => ({ len: 0.009, freq: 300, ...o });
  const root = new THREE.Group();

  // legs and boots: left planted, right kicked up behind in excitement
  const boot = (pos, quat) => {
    const b = new THREE.Group(); b.position.set(...pos); if (quat) b.quaternion.copy(quat); root.add(b);
    b.add(feltBlob(C.boot, [0, 0.0, 0.035], [0.075, 0.06, 0.12], [0, 0, 0], F({ len: 0.006 })));
    b.add(feltTube(C.boot, [[0, 0.02, 0], [0, 0.15, -0.005]], 0.068, F({ len: 0.006 })));
    const cuff = feltMesh(new THREE.TorusGeometry(0.07, 0.03, 16, 40), C.cuff, F({ len: 0.016 }));
    cuff.rotation.x = Math.PI / 2; cuff.position.y = 0.17; b.add(cuff);
    return b;
  };
  root.add(feltTube(C.tights, [[-0.09, 0.47, 0], [-0.1, 0.2, 0.01]], 0.05, F({ len: 0.006 })));
  boot([-0.1, 0.05, 0.02]);
  // the right heel flicks up and out to the side, so it reads from the front
  const k = P.kick;
  const knee = [0.11 + 0.02 * k, 0.3 - 0.02 * k, 0.05 * k], ankle = [0.1 + 0.17 * k, 0.2 + 0.11 * k, -0.08 * k];
  root.add(feltTube(C.tights, [[0.09, 0.47, 0], knee, ankle], 0.05, F({ len: 0.006 })));
  const shin = new THREE.Vector3(knee[0] - ankle[0], knee[1] - ankle[1], knee[2] - ankle[2]).normalize();
  boot([ankle[0] - 0.15 * shin.x, ankle[1] - 0.15 * shin.y, ankle[2] - 0.15 * shin.z], new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), shin));

  // duffle coat: a flared lathe from shoulders to hem, the skirt hem peeking under it
  const prof = [[0.001, 1.17], [0.11, 1.165], [0.18, 1.12], [0.212, 1.03], [0.218, 0.9], [0.24, 0.76], [0.285, 0.6], [0.305, 0.52], [0.29, 0.5], [0.001, 0.5]];
  const coatGeo = new THREE.LatheGeometry(prof.slice().reverse().map(([r, y]) => new THREE.Vector2(r, y)), 72);
  coatGeo.scale(1, 1, 0.82);
  root.add(feltMesh(coatGeo, C.navy, F()));
  const hem = feltMesh(new THREE.CylinderGeometry(0.29, 0.315, 0.09, 64, 2), C.skirt, F({ len: 0.007 }));
  hem.scale.z = 0.84; hem.position.y = 0.475; root.add(hem);
  // toggles, crest, a deep front placket
  root.add(feltTube(C.navyDeep, [[0, 1.1, 0.165], [0, 0.85, 0.184], [0, 0.56, 0.236]], 0.012, F({ len: 0.004, layers: 3 })));
  [1.0, 0.86, 0.72].forEach((y, i) => {
    root.add(feltBlob(C.cream, [0.0, y, 0.185 + i * 0.012], [0.042, 0.016, 0.018], [0, 0, 0.12], F({ len: 0.004, layers: 3 })));
    root.add(feltTube('#c8a77a', [[-0.045, y + 0.005, 0.18 + i * 0.012], [0.045, y - 0.005, 0.18 + i * 0.012]], 0.004, F({ len: 0.002, layers: 2 })));
  });
  root.add(feltBlob(C.crest, [-0.11, 0.98, 0.16], [0.034, 0.04, 0.012], [0.1, -0.5, 0], F({ len: 0.004, layers: 4 })));
  // scarf: a fat knit ring round the neck, one end hanging over the coat
  const scarfRing = feltMesh(new THREE.TorusGeometry(0.13, 0.065, 24, 64), C.knit, F({ len: 0.011 }));
  scarfRing.position.set(0, 1.18, 0); scarfRing.rotation.x = Math.PI / 2 - 0.12; root.add(scarfRing);
  root.add(feltTube(C.knit, [[0.1, 1.15, 0.12], [0.13, 1.02, 0.17], [0.12, 0.86, 0.19]], 0.05, F({ len: 0.011 })));
  [0.97, 0.91].forEach((y) => root.add(feltTube(C.cream, [[0.09, y, 0.215], [0.17, y - 0.01, 0.195]], 0.012, F({ len: 0.004, layers: 3 }))));
  // arms in coat sleeves, orange mittens with cream cuffs
  const mitten = (pos, rz) => {
    const m = new THREE.Group(); m.position.set(...pos); m.rotation.z = rz; root.add(m);
    m.add(feltBlob(C.knit, [0, 0.03, 0], [0.058, 0.07, 0.05], [0, 0, 0], F({ len: 0.01 })));
    m.add(feltBlob(C.knit, [0.045, 0.0, 0.025], [0.022, 0.032, 0.022], [0, 0, -0.5], F({ len: 0.008 })));
    const c = feltMesh(new THREE.TorusGeometry(0.05, 0.02, 12, 32), C.cream, F({ len: 0.008 }));
    c.rotation.x = Math.PI / 2; c.position.y = -0.04; m.add(c);
  };
  root.add(feltTube(C.navy, [[-0.19, 1.08, 0], [-0.26, 0.9, 0.04], [-0.27, 0.74, 0.08]], 0.06, F()));
  mitten([-0.275, 0.66, 0.09], 0.1);
  const r = P.reach;
  const el = [0.32 + 0.04 * r, 1.12 + 0.18 * r, 0.06 + 0.04 * r], hand = [0.36 + 0.1 * r, 1.0 + 0.62 * r, 0.1 + 0.08 * r];
  root.add(feltTube(C.navy, [[0.19, 1.08, 0], el, hand], 0.06, F()));
  mitten([hand[0] + 0.02, hand[1] + 0.07, hand[2]], -0.3);

  // head
  root.add(feltTube(C.skin, [[0, 1.16, 0], [0, 1.27, 0.01]], 0.058, F({ len: 0.006 })));
  const head = new THREE.Group(); head.position.set(0, 1.5, 0.02); root.add(head);
  head.rotation.set(-0.16 - 0.1 * (P.look[1] || 0), 0.15, 0.1);
  head.add(feltBlob(C.skin, [0, 0, 0], [0.27, 0.255, 0.25], [0, 0, 0], F({ len: 0.006 })));
  [-1, 1].forEach((s) => head.add(feltBlob(C.skin, [s * 0.255, -0.02, -0.02], [0.04, 0.06, 0.035], [0, 0, 0], F({ len: 0.005 }))));
  // hair: back mass under the hat, a soft fringe, two short bunches flaring out at the jaw
  head.add(feltBlob(C.hair, [0, -0.03, -0.09], [0.285, 0.25, 0.22], [0, 0, 0], F({ len: 0.012 })));
  head.add(feltBlob(C.hair, [0, 0.13, 0.15], [0.21, 0.065, 0.1], [0.55, 0, 0], F({ len: 0.012 })));
  [-1, 1].forEach((s) => {
    head.add(feltBlob(C.hair, [s * 0.24, 0.0, 0.03], [0.055, 0.13, 0.1], [0.1, 0, s * 0.12], F({ len: 0.012 })));
    head.add(feltBlob(C.hair, [s * 0.3, -0.16, -0.04], [0.075, 0.105, 0.075], [0, 0, s * 0.75], F({ len: 0.014 })));
    const tie = feltMesh(new THREE.TorusGeometry(0.038, 0.016, 10, 28), C.knit, F({ len: 0.005, layers: 3 }));
    tie.position.set(s * 0.255, -0.1, -0.035); tie.rotation.set(0.3, s * 0.4, s * 0.75 + Math.PI / 2); head.add(tie);
  });
  // knit beanie, pushed back: dome, folded cream band, pom-pom
  const hat = new THREE.Group(); hat.rotation.x = -0.32; head.add(hat);
  const dome = new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.55);
  dome.scale(0.3, 0.33, 0.3);
  const domeM = feltMesh(dome, C.knit, F({ len: 0.012 })); domeM.position.y = 0.04; hat.add(domeM);
  // knit ribs: thin raised lines running up the dome
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2, pts = [];
    for (let j = 0; j <= 6; j++) { const t = 0.12 + (j / 6) * 0.68, ph = t * Math.PI * 0.5; pts.push([Math.sin(ph) * 0.302 * Math.sin(a), 0.04 + Math.cos(ph) * 0.332, Math.sin(ph) * 0.302 * Math.cos(a)]); }
    hat.add(feltTube(C.knitDeep, pts, 0.008, F({ len: 0.005, layers: 3, caps: false })));
  }
  const band = feltMesh(new THREE.TorusGeometry(0.286, 0.05, 20, 72), C.cream, F({ len: 0.012 }));
  band.rotation.x = Math.PI / 2; band.position.y = 0.05; band.scale.set(1, 1.04, 1); hat.add(band);
  hat.add(feltBlob(C.cream, [0, 0.39, -0.01], [0.105, 0.1, 0.105], [0, 0, 0], F({ len: 0.024, layers: 12 })));

  // face: glossy bead eyes with catch-lights and a lash flick, rosy cheeks, a tiny nose
  const [lx, ly] = P.look;
  [-1, 1].forEach((s) => {
    head.add(blob(gloss('#120d0d', { roughness: 0.08 }), [s * 0.09 + lx * 0.01, -0.01 + ly * 0.008, 0.232], [0.034, 0.045, 0.02]));
    head.add(blob(new THREE.MeshBasicMaterial({ color: '#ffffff' }), [s * 0.09 + lx * 0.01 - 0.01, 0.008 + ly * 0.008, 0.252], [0.01, 0.012, 0.004]));
    head.add(feltTube('#120d0d', [[s * 0.112, 0.024, 0.228], [s * 0.132, 0.036, 0.218]], 0.0045, F({ len: 0.002, layers: 2 })));
    head.add(feltBlob(C.cheek, [s * 0.155, -0.09, 0.198], [0.052, 0.034, 0.02], [0, s * 0.5, 0], F({ len: 0.005, layers: 4 })));
    head.add(feltTube('#3a2522', [[s * 0.055, 0.075, 0.236], [s * 0.095, 0.088, 0.232], [s * 0.13, 0.08, 0.22]], 0.006, F({ len: 0.003, layers: 3 })));
  });
  head.add(feltBlob(C.skin, [0, -0.055, 0.252], [0.022, 0.017, 0.015], [0, 0, 0], F({ len: 0.004, layers: 3 })));
  if (P.mood === 'delighted') {
    // an open, delighted smile: dark crescent, a hint of tongue, thin lip line
    head.add(blob(gloss('#5a1c24', { roughness: 0.5, clearcoat: 0.1 }), [0, -0.125, 0.232], [0.052, 0.026, 0.016], [0.2, 0, 0]));
    head.add(blob(gloss('#e47b88', { roughness: 0.5, clearcoat: 0.1 }), [0, -0.138, 0.24], [0.03, 0.012, 0.012], [0.2, 0, 0]));
    head.add(feltBlob(C.skin, [0, -0.106, 0.243], [0.06, 0.013, 0.015], [0, 0, 0], F({ len: 0.003, layers: 3 })));
  } else if (P.mood === 'worried') {
    head.add(feltTube('#3a2522', [[-0.03, -0.11, 0.24], [0, -0.103, 0.245], [0.03, -0.11, 0.24]], 0.006, F({ len: 0.003, layers: 3 })));
  } else {
    head.add(feltTube('#3a2522', [[-0.032, -0.105, 0.24], [0, -0.116, 0.245], [0.032, -0.105, 0.24]], 0.006, F({ len: 0.003, layers: 3 })));
  }
  root.userData.head = head;
  return root;
}
