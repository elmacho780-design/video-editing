// Needle-felt materials for three.js: mottled wool base + shell fuzz that halos every silhouette.
// felt(color) returns a group-ready factory: feltMesh(geometry, color, opts) gives the base mesh plus its fuzz shells.
import * as THREE from 'three';

const NOISE = /* glsl */ `
  float fHash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float fNoise(vec3 x) {
    vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(fHash(i), fHash(i + vec3(1, 0, 0)), f.x), mix(fHash(i + vec3(0, 1, 0)), fHash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(fHash(i + vec3(0, 0, 1)), fHash(i + vec3(1, 0, 1)), f.x), mix(fHash(i + vec3(0, 1, 1)), fHash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
  }
`;

// layer 0 = the felted surface (fibre bump on the normal); layers 1..N = fuzz shells pushed out along the normal,
// each fibre fading out through alpha-to-coverage so the halo is soft wool, not hard clumps
function feltMaterial(color, layer, layers, len, o) {
  const m = new THREE.MeshPhysicalMaterial({
    color, roughness: 1, metalness: 0, sheen: o.sheen ?? 1, sheenRoughness: 0.5,
    sheenColor: new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.5), vertexColors: !!o.vertexColors,
  });
  const k = layers > 0 ? layer / layers : 0;
  if (layer > 0) m.alphaToCoverage = true;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uShell = { value: k };
    sh.uniforms.uLen = { value: len };
    sh.uniforms.uFreq = { value: o.freq ?? 300 };
    sh.uniforms.uBump = { value: o.bump ?? 1.0 };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uShell; uniform float uLen; varying vec3 vFeltP;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n transformed += normalize(objectNormal) * uShell * uLen;\n vFeltP = (modelMatrix * vec4(position, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uShell; uniform float uFreq; uniform float uBump; varying vec3 vFeltP;\n' + NOISE)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float mott = fNoise(vFeltP * 9.0) * 0.6 + fNoise(vFeltP * 31.0) * 0.4;
        float fib = fNoise(vFeltP * uFreq) * 0.6 + fNoise(vFeltP * uFreq * 2.1) * 0.4;
        float grain = fNoise(vFeltP * uFreq * 0.35);
        if (uShell > 0.0) {
          float th = 0.4 + uShell * 0.5;
          diffuseColor.a = smoothstep(th - 0.06, th + 0.1, fib) * (1.0 - uShell * 0.35);
          if (diffuseColor.a < 0.02) discard;
        }
        diffuseColor.rgb *= (0.86 + 0.16 * mott + 0.08 * grain) * mix(1.0, 1.03, uShell);`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        if (uShell == 0.0) {
          float hb = fNoise(vFeltP * uFreq * 0.22) * 0.55 + fNoise(vFeltP * uFreq * 0.6) * 0.45;
          vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition);
          float dhx = dFdx(hb), dhy = dFdy(hb);
          vec3 r1 = cross(sy, normal), r2 = cross(normal, sx);
          float det = dot(sx, r1);
          vec3 grad = sign(det) * (dhx * r1 + dhy * r2);
          normal = normalize(abs(det) * normal - grad * uBump * 0.004);
        }`);
  };
  m.customProgramCacheKey = () => 'felt2';
  return m;
}

export function feltMesh(geometry, color, o = {}) {
  const layers = o.layers === 0 ? 0 : Math.max(1, Math.round((o.layers ?? 10) * (globalThis.FELT_Q ?? 1))), len = o.len ?? 0.01;
  const g = new THREE.Group();
  const base = new THREE.Mesh(geometry, feltMaterial(color, 0, layers, len, o));
  base.castShadow = true; base.receiveShadow = true;
  g.add(base);
  for (let i = 1; i <= layers; i++) {
    const s = new THREE.Mesh(geometry, feltMaterial(color, i, layers, len, o));
    s.receiveShadow = true;
    g.add(s);
  }
  g.userData.base = base;
  return g;
}

// an ellipsoid of felt: centre, radii, rotation
export function feltBlob(color, [x, y, z], [rx, ry, rz], rot = [0, 0, 0], o = {}) {
  const geo = new THREE.SphereGeometry(1, o.seg ?? 64, Math.round((o.seg ?? 64) * 0.66));
  geo.scale(rx, ry, rz);
  const m = feltMesh(geo, color, o);
  m.position.set(x, y, z);
  m.rotation.set(...rot);
  return m;
}

// a felt limb along a curve (tube), optional per-vertex colour bands
export function feltTube(color, pts, radius, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
  const geo = new THREE.TubeGeometry(curve, 48, radius, 32, false);
  // round the ends with spheres so the limb reads as stuffed wool
  const g = new THREE.Group();
  g.add(feltMesh(geo, color, o));
  const ends = o.caps === false ? [] : [pts[0], pts[pts.length - 1]];
  ends.forEach((p) => g.add(feltBlob(color, p, [radius, radius, radius], [0, 0, 0], { ...o, seg: 32 })));
  return g;
}

// glossy bits that are not wool: bead eyes, nose leather, the book
export const gloss = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08, ...o });

export function blob(material, [x, y, z], [rx, ry, rz], rot = [0, 0, 0], seg = 48) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, seg, Math.round(seg * 0.66)), material);
  m.scale.set(rx, ry, rz);
  m.position.set(x, y, z);
  m.rotation.set(...rot);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
