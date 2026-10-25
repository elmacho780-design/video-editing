// Shared 3D set-up for the pop-up and toy samples: renderer, studio light, post chain, text and image textures.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { makePost } from '/core/three/post.js';

export { THREE, RoundedBoxGeometry };
export const W = 1080, H = 1920;

export function setup(stage, { fov = 30, ssaa = 2, exposure = 1.0 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  stage.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W * ssaa, H * ssaa, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(fov, W / H, 0.1, 200);
  const post = makePost(renderer, scene, camera, W, H, { ssaa, ao: true, aoRadius: 0.35, aoAmt: 0.7 });
  return { renderer, scene, camera, post, canvas };
}

export function keyLight(scene, { color = '#fff1e2', intensity = 2.6, pos = [-5, 9, 7], size = 9, map = 4096 } = {}) {
  const l = new THREE.DirectionalLight(color, intensity);
  l.position.set(...pos);
  l.castShadow = true;
  l.shadow.mapSize.set(map, map);
  Object.assign(l.shadow.camera, { left: -size, right: size, top: size, bottom: -size, near: 0.5, far: 40 });
  l.shadow.bias = -0.0003;
  l.shadow.normalBias = 0.02;
  l.shadow.radius = 5;
  scene.add(l);
  return l;
}

// a canvas texture with text drawn on it
export function textTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// an SVG string drawn into a canvas texture (for printed art), with an optional white die-cut border
export async function svgTexture(svg, w, h, { border = 0, shadow = false } = {}) {
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  await img.decode();
  return imageTexture(img, w, h, { border, shadow });
}
export async function urlTexture(url, w, h, opts = {}) {
  const img = new Image();
  img.src = url;
  await img.decode();
  return imageTexture(img, w, h, opts);
}
function imageTexture(img, w, h, { border = 0 } = {}) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  const pad = border * 1.5, iw = w - pad * 2, ih = h - pad * 2;
  if (border) {
    // die-cut: stamp the silhouette in white around itself
    const sil = document.createElement('canvas');
    sil.width = w; sil.height = h;
    const sg = sil.getContext('2d');
    sg.drawImage(img, pad, pad, iw, ih);
    sg.globalCompositeOperation = 'source-in';
    sg.fillStyle = '#fffdf8';
    sg.fillRect(0, 0, w, h);
    for (let a = 0; a < 32; a++) {
      const r = border, x = Math.cos((a / 32) * Math.PI * 2) * r, y = Math.sin((a / 32) * Math.PI * 2) * r;
      g.drawImage(sil, x, y);
    }
  }
  g.drawImage(img, pad, pad, iw, ih);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// a flat card that casts a proper silhouette shadow from its texture's alpha
export function card(tex, width, height, { side = THREE.DoubleSide, rough = 0.85 } = {}) {
  const mat = new THREE.MeshStandardMaterial({ map: tex, alphaTest: 0.5, side, roughness: rough, metalness: 0 });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  m.castShadow = true;
  m.receiveShadow = true;
  m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.5 });
  return m;
}

export const glossy = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.15, ...o });
export const matte = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, ...o });

// Mongolian subtitle overlay, placed high and clear of Instagram's interface
export function subtitleOverlay(stage, text) {
  const d = document.createElement('div');
  d.textContent = text;
  Object.assign(d.style, {
    position: 'absolute', left: '0', top: '170px', width: W + 'px', textAlign: 'center', zIndex: 5,
    font: '900 62px Nunito, sans-serif', color: '#fff', webkitTextStroke: '16px #163463', paintOrder: 'stroke fill',
  });
  stage.appendChild(d);
}
