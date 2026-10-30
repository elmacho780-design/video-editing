// The Essential English paperback as a 3D object, lit like a glossy product shot, rendered onto a transparent canvas
// that sits between the poster's giant letters and its small type. Units are millimetres: an A4 perfect-bound
// paperback, 237 pages (119 leaves of 80 gsm paper, about 0.1 mm each) inside 0.35 mm laminated card covers.
// The printed faces are the book's own PDF pages (assets/cover.png = page 1, assets/back.png = page 237, 350 dpi);
// the spine continues the cover's bands, measured from the PDF: orange 0-13.9 mm, dark navy to 19.5 mm,
// the navy field, dark navy from 278 mm, orange from 283 mm.
import * as THREE from 'three';

const W = 210, H = 297, LEAVES = 119, C = 0.35;
const T = LEAVES * 0.1 + 2 * C;            // 12.6 mm
const NAVY = '#114879', DEEP = '#0a2f52', ORANGE = '#fda00a';

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const rng = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);

// the page block's cut edge: one fine band per leaf, each a slightly different white, a hairline between them
function pageEdge(w, h, along) {
  const r = rng(7);
  return canvasTex(w, h, (g) => {
    g.fillStyle = '#f3f0e8'; g.fillRect(0, 0, w, h);
    const n = LEAVES, span = along === 'u' ? w : h;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * span, b = ((i + 1) / n) * span, v = 236 + Math.floor(r() * 14);
      g.fillStyle = `rgb(${v},${v - 2},${v - 7})`;
      if (along === 'u') g.fillRect(a, 0, b - a, h); else g.fillRect(0, a, w, b - a);
      g.fillStyle = 'rgba(120,110,95,0.16)';
      if (along === 'u') g.fillRect(b - 0.6, 0, 0.6, h); else g.fillRect(0, b - 0.6, w, 0.6);
    }
  });
}

// the spine, drawn upright (left = back cover side, right = front cover side), its title reading top to bottom
function spineTex() {
  const px = 40;                                   // pixels per mm
  return canvasTex(Math.round(T * px), H * px, (g, w, h) => {
    const mm = (v) => v * px;
    g.fillStyle = NAVY; g.fillRect(0, 0, w, h);
    g.save(); g.beginPath(); g.rect(0, mm(19.5), w, mm(278 - 19.5)); g.clip();   // the cover's fine diagonal hatching
    g.strokeStyle = 'rgba(10,47,82,0.55)'; g.lineWidth = mm(0.18);
    for (let y = -w; y < h + w; y += mm(4.6)) { g.beginPath(); g.moveTo(0, y + w * 1.7); g.lineTo(w, y); g.stroke(); }
    g.restore();
    g.fillStyle = ORANGE; g.fillRect(0, 0, w, mm(13.93)); g.fillRect(0, mm(283), w, h - mm(283));
    g.fillStyle = DEEP; g.fillRect(0, mm(13.93), w, mm(19.45 - 13.93)); g.fillRect(0, mm(278), w, mm(283 - 278));
    g.save(); g.translate(w / 2, 0); g.rotate(Math.PI / 2);   // text runs down the spine, its top towards the front cover
    g.textBaseline = 'middle';
    g.fillStyle = '#ffffff'; g.font = `bold ${mm(6.2)}px Arial, Helvetica, sans-serif`; g.textAlign = 'left';
    g.fillText('ESSENTIAL', mm(32), mm(0.15));
    const e = g.measureText('ESSENTIAL ').width;
    g.fillStyle = ORANGE; g.fillText('ENGLISH', mm(32) + e, mm(0.15));
    g.fillStyle = '#ffffff'; g.font = `bold ${mm(3.1)}px Arial, Helvetica, sans-serif`; g.textAlign = 'right';
    g.fillText('B1 – B2', mm(268), mm(0.1));
    g.fillStyle = DEEP; g.font = `bold ${mm(3.4)}px Arial, Helvetica, sans-serif`; g.textAlign = 'center';
    g.fillText('HML', mm(290), mm(0.1));
    g.fillStyle = ORANGE; g.font = `bold ${mm(3.0)}px Arial, Helvetica, sans-serif`; g.textAlign = 'left';
    g.fillText('HIGHER MIND LEARNING', mm(150), mm(0.1));
    g.restore();
  });
}

// a studio for reflections, dark so the print keeps its colour: a big soft box up left (it lights the spine and the
// top edge), and a tall strip light placed where the cover mirrors, so its reflection lies across the laminate as a
// soft diagonal sheen (o.strip = its angle round the book from straight ahead, o.stripK = its brightness)
function studio(renderer, o) {
  const s = new THREE.Scene();
  s.background = new THREE.Color('#2b2826');
  const panel = (w, h, color, k, pos, rz = 0) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(0, 0, 0); m.rotateZ(rz); s.add(m);
  };
  panel(7, 5, '#ffffff', 5, [-5, 6, 4]);
  const a = THREE.MathUtils.degToRad(o.strip);
  panel(2.2, 16, '#fff7ee', o.stripK, [Math.sin(a) * 8, o.stripY, Math.cos(a) * 8], THREE.MathUtils.degToRad(o.stripTilt));
  panel(12, 3, '#ffd28a', 0.8, [0, -7, 3]);
  const pm = new THREE.PMREMGenerator(renderer);
  return pm.fromScene(s, 0.02).texture;
}

// the laminate's sheen and falloff, as two films lying on the cover: a soft diagonal highlight band (added light)
// and a gentle darkening towards the far corner (o.sheen, o.falloff = their strengths; o.band = where the band crosses, 0..1)
function films(o) {
  const w = 1024, h = Math.round(1024 * H / W), ang = THREE.MathUtils.degToRad(o.bandAngle);
  const dx = Math.cos(ang), dy = Math.sin(ang), L = Math.abs(dx) * w + Math.abs(dy) * h;
  const line = (g) => { const cx = w / 2, cy = h / 2; return g.createLinearGradient(cx - dx * L / 2, cy - dy * L / 2, cx + dx * L / 2, cy + dy * L / 2); };
  const sheen = canvasTex(w, h, (g) => {
    const b = o.band, gr = line(g);
    [[0, 0], [b - 0.2, 0], [b - 0.06, 0.55], [b, 1], [b + 0.05, 0.6], [b + 0.16, 0.12], [b + 0.3, 0.2], [b + 0.42, 0], [1, 0]]
      .forEach(([s, a]) => gr.addColorStop(Math.min(1, Math.max(0, s)), `rgba(255,255,255,${a})`));
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  const shade = canvasTex(w, h, (g) => {
    const gr = line(g);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.55, 'rgba(0,0,0,0.05)'); gr.addColorStop(1, 'rgba(0,0,0,1)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  const film = (map, blending, opacity) => new THREE.MeshBasicMaterial({ map, transparent: true, opacity, blending, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -4 });
  return [film(sheen, THREE.AdditiveBlending, o.sheen), film(shade, THREE.NormalBlending, o.falloff)];
}

const load = (url) => new Promise((ok, no) => new THREE.TextureLoader().load(url, ok, undefined, no));

export async function renderBook(canvas, o) {
  const { width: pw, height: ph } = o;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
  renderer.setPixelRatio(1); renderer.setSize(pw, ph, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = o.exposure;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.VSMShadowMap;
  const aniso = renderer.capabilities.getMaxAnisotropy();

  const scene = new THREE.Scene();
  scene.environment = studio(renderer, o);
  scene.environmentIntensity = o.env;

  const [cover, back] = await Promise.all([load('assets/cover.png'), load('assets/back.png')]);
  for (const t of [cover, back]) { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; }
  const spine = spineTex(); spine.anisotropy = aniso;
  const edgeV = pageEdge(256, 4096, 'u'), edgeH = pageEdge(4096, 256, 'v');
  [edgeV, edgeH].forEach((t) => { t.anisotropy = aniso; });

  // gloss laminate on the printed faces, plain card at the cut edges, matte paper on the page block
  const laminate = (map) => new THREE.MeshPhysicalMaterial({ map, roughness: 0.55, specularIntensity: 0.4, clearcoat: 1, clearcoatRoughness: o.gloss, metalness: 0 });
  // the printed faces keep the PDF's exact colours (o.face scales them); their light and gloss come from films()
  const face = (map) => new THREE.MeshBasicMaterial({ map, color: new THREE.Color(o.face, o.face, o.face), toneMapped: false });
  const card = new THREE.MeshStandardMaterial({ color: '#ece7dc', roughness: 0.8 });
  const paper = (map) => new THREE.MeshStandardMaterial({ map, roughness: 0.92 });
  const book = new THREE.Group();
  const add = (geo, mats, pos) => { const m = new THREE.Mesh(geo, mats); m.position.set(...pos); m.castShadow = m.receiveShadow = true; book.add(m); return m; };
  //                       +x            -x     +y            -y            +z              -z
  add(new THREE.BoxGeometry(W, H, T - 2 * C), [paper(edgeV), card, paper(edgeH), paper(edgeH), card, card], [0, 0, 0]);
  add(new THREE.BoxGeometry(W, H, C), [card, card, card, card, face(cover), card], [0, 0, T / 2 - C / 2]);
  add(new THREE.BoxGeometry(W, H, C), [card, card, card, card, card, face(back)], [0, 0, -T / 2 + C / 2]);
  // the cover is one sheet folded round the spine, so the spine's front and back corners carry the print, not a cut edge
  const fold = new THREE.MeshStandardMaterial({ color: NAVY, roughness: 0.5 });
  add(new THREE.BoxGeometry(C, H, T), [card, laminate(spine), card, card, fold, fold], [-W / 2 - C / 2, 0, 0]);
  for (const [i, mat] of films(o).entries()) {
    const f = new THREE.Mesh(new THREE.PlaneGeometry(W, H), mat);
    f.position.z = T / 2 + 0.02 + i * 0.01; f.renderOrder = 2 + i; book.add(f);
  }
  book.children.forEach((m) => { m.position.x += C / 2; });   // centre the whole book, spine included

  // place it: o.cx, o.cy = centre on the poster (in % of the poster's width, from the top left); o.size = its height in the same units
  const k = H / o.size;                                         // mm per poster-width percent
  book.rotation.set(THREE.MathUtils.degToRad(o.rx), THREE.MathUtils.degToRad(o.ry), THREE.MathUtils.degToRad(o.rz), 'ZYX');
  book.position.set((o.cx - 50) * k, (ph / pw * 50 - o.cy) * k, 0);
  scene.add(book);

  // the poster's surface behind it, catching only the shadow
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.ShadowMaterial({ color: o.shadowColor, opacity: o.shadow }));
  wall.position.z = -o.gap; wall.receiveShadow = true; scene.add(wall);

  const key = new THREE.DirectionalLight('#fff6ea', o.key);
  key.position.set(...o.light); key.target = book;
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -420, right: 420, top: 420, bottom: -420, near: 10, far: 6000 });
  key.shadow.radius = o.soft; key.shadow.blurSamples = 25; key.shadow.bias = -0.0004;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight('#ffe2b8', o.rim); rim.position.set(900, 200, -300); scene.add(rim);
  const top = new THREE.DirectionalLight('#ffffff', o.top); top.position.set(-150, 1000, 250); scene.add(top);   // lifts the top page edge

  const camera = new THREE.PerspectiveCamera(o.fov, pw / ph, 10, 20000);
  const visH = (ph / pw) * 100 * k;
  camera.position.set(0, 0, visH / 2 / Math.tan(THREE.MathUtils.degToRad(o.fov / 2)));
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
  return { renderer, scene, camera, book };
}
