// The whole film (?view=film): 24 s, 9:16, the eight storyboard shots on the score's timeline (STORYBOARD.md).
// Every shot starts from its storyboard scene (board.js, turn.js, shot4.js) and is animated from there, with each
// move landing on its cue in audio/score.py. window.render(t) is deterministic.
// Only one scene lives at a time: it is built when the film first reaches it (each render worker draws a contiguous
// run of frames, so a worker builds each scene at most once). The girl moves like stop-motion: pose variants of the
// felt doll, swapped on twos.
import { THREE, setup } from './three-common.js';
import { girl } from './girl.js';
import { subtitle, ROAD_Z } from './set.js';
import { SHOTS, SUBS, drawerAt } from './board.js';
import { world } from './turn.js';
import { build as buildStitching, feltNeedle } from './shot4.js';

const FW = 1080, FH = 1920, DUR = 24;
// where each storyboard shot starts (its subtitle line plays until the next), and the scenes that play them:
// shots 1 and 2 share one set, the hook's close-up pulling back into the wall in one move
const SHOT_AT = [0, 2, 4, 7, 10, 12, 16, 20];
const SCENES = [[0, 4, 'wall'], [4, 7, 'problem'], [7, 10, 'stitch'], [10, 12, 'burst'], [12, 16, 'world'], [16, 20, 'proof'], [20, 24, 'end']];

const v3 = (a) => new THREE.Vector3(...a);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => { const k = clamp01((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const easeOut = (x) => 1 - (1 - clamp01(x)) ** 3;
const easeIn = (x) => clamp01(x) ** 3;
const easeBack = (x) => { const s = clamp01(x) - 1; return 1 + 2.7 * s ** 3 + 1.7 * s ** 2; };   // pops a little past 1, then settles
const lerp = (a, b, k) => a + (b - a) * k;
const after = (t, at, w) => (t < at ? 0 : Math.exp(-(t - at) / w));   // a decaying impulse from a cue
const arc = (t, at, len) => (t < at || t > at + len ? 0 : Math.sin(Math.PI * (t - at) / len));   // a single hop
const twos = (t) => Math.floor(t * 12);   // stop-motion: a new pose every second frame at 24 fps
const Y = new THREE.Vector3(0, 1, 0);

function post(S, o, { bloom = 0.08, threshold = 0.92, vig = 0.32, warm = 0 } = {}) {
  S.post.dof.focus = o.focus; S.post.dof.aper = o.aper; S.post.dof.maxCoc = o.maxCoc;
  S.post.bloom.strength = o.bloom ?? bloom; S.post.bloom.threshold = threshold;
  S.post.vig.uniforms.amt.value = vig; S.post.vig.uniforms.warm.value = warm;
}
function aim(S, pos, look, roll = 0) {
  S.camera.position.copy(pos); S.camera.lookAt(look);
  if (roll) S.camera.rotateZ(roll);
}

// pose variants of a girl already in the scene; they share her place, and show(i) picks one (0 = the storyboard pose)
function poses(scene, base, list) {
  const all = [base, ...list.map((p) => { const g = girl(p); scene.add(g); return g; })];
  const place = (pos, ry, sy = 1) => all.forEach((g) => { g.position.copy(pos); g.rotation.set(0, ry, 0); g.scale.set(base.scale.x, base.scale.x * sy, base.scale.x); });
  place(base.position.clone(), base.rotation.y);
  return { all, place, home: base.position.clone(), ry: base.rotation.y, show: (i) => all.forEach((g, k) => { g.visible = k === i; }) };
}

// the cabinet's drawers, which can slide out to the depth they were built at: openTo(d, 0) is shut, 1 as built
function drawers(wall) {
  return wall.children.filter((d) => d.userData.word !== undefined)
    .map((d) => { const out = d.position.z - 0.44; return { d, out, box: out > 1e-6 ? d.children[1] : null }; });
}
function openTo(x, k) {
  x.d.position.z = 0.44 + x.out * k;
  if (x.box) { x.box.scale.z = Math.max(k, 0.001); x.box.position.z = -x.out * k / 2; }
}

const BUILD = {
  // 1 and 2 (0 to 4 s): the drawer "because" rattles on the music box's notes; the camera pulls back and down off it,
  // the question card flutters down and lands on the bell at 3.0, and she freezes
  async wall(S) {
    const o = await SHOTS[2](S.scene, S.camera, { wall: { open: (w) => (w === 'because' ? 0.05 : 0), keepLabels: true } });
    post(S, o);
    const { wall, card, girl: gl } = o.h;
    const drawer = wall.children.find((d) => d.userData.word === 'because'), z0 = drawer.position.z;
    const D = v3(drawerAt(8, 3));
    const P1 = D.clone().add(v3([1.35, -0.55, 3.6])), L1 = D.clone().add(v3([0.05, 0.05, 0]));
    const P0 = P1.clone().lerp(L1, -0.2), P2 = v3([0.1, 0.9, 15.5]), L2 = v3([0, 3.15, 0]);
    const cardP = card.position.clone(), cardR = card.rotation.clone();
    const g = poses(S.scene, gl, [{ reach: 0, look: [0.15, 1], mood: 'calm', kick: 0 }]);
    const BOX = [0, 1 / 3, 0.5, 1, 4 / 3, 1.5];   // the music box's notes in bar 1
    return {
      update(t) {
        const shake = t >= 3 ? 0 : BOX.reduce((a, h) => a + after(t, h, 0.09), 0) + 0.7 * smooth(2, 2.9, t);
        drawer.position.z = z0 + 0.012 + 0.03 * shake * (0.5 + 0.5 * Math.sin(t * 97));
        drawer.rotation.set(0, 0.025 * shake * Math.sin(t * 53 + 1), 0.035 * shake * Math.sin(t * 71));

        const s = clamp01((t - 2.15) / 0.85);
        card.visible = t >= 2.15;
        card.position.set(cardP.x + 0.25 * Math.sin(s * Math.PI * 2.5) * (1 - s), cardP.y + 4.2 * (1 - s) ** 2 - 0.04 * arc(t, 3, 0.25) + (t > 3 ? 0.015 * Math.sin((t - 3) * 3) : 0), cardP.z);
        card.rotation.set(cardR.x + 0.3 * (1 - s), cardR.y, cardR.z + 0.4 * Math.sin(s * Math.PI * 3) * (1 - s));

        g.show(t < 3 ? 1 : 0);
        g.place(g.home, g.ry, 1 - 0.035 * arc(t, 3, 0.2));

        if (t < 2) {
          const k = t / 2;
          aim(S, P0.clone().lerp(P1, k), L1, 0.04 + 0.03 * k);
          S.post.dof.focus = S.camera.position.distanceTo(D);
        } else {
          const k = smooth(2, 3.1, t);
          aim(S, P1.clone().lerp(P2, k), L1.clone().lerp(L2, k), 0.07 * (1 - k));
          S.post.dof.focus = lerp(S.camera.position.distanceTo(D), 12.9, k);
          S.post.dof.aper = lerp(4, 1.6, k); S.post.dof.maxCoc = lerp(14, 8, k);
        }
        if (t < 2) { S.post.dof.aper = 4; S.post.dof.maxCoc = 14; }
      },
      blur: (t) => (t > 2.05 && t < 2.9 ? 8 : 1),
    };
  },

  // 3 (4 to 7 s): she pulls out "late", "bus", "snowing"; each flies to its place and is pinned there on its pluck
  async problem(S) {
    const o = await SHOTS[3](S.scene, S.camera);
    post(S, o);
    const { wall, tags, girl: gl } = o.h;
    const drs = Object.fromEntries(drawers(wall).filter((x) => x.out > 0).map((x) => [x.d.userData.word, x]));
    const PLUCK = [4.35, 5.05, 5.8];
    tags.forEach((tg) => {
      const x = drs[tg.word], [dx, dy, dz] = drawerAt(x.d.userData.r, x.d.userData.c);
      Object.assign(tg, { p: tg.tag.position.clone(), r: tg.tag.rotation.clone(), pinP: tg.pin.position.clone(), from: v3([dx, dy, dz + x.out * 1.5 + 0.05]) });
    });
    const g = poses(S.scene, gl, [{ reach: 0, look: [-0.6, 0.7], mood: 'worried', kick: 0 }, { reach: 0.65, look: [-0.6, 0.85], mood: 'worried', kick: 0 }]);
    const A = { pos: [0.8, 2.05, 9.0], look: [0.2, 2.35, 1.0] }, B = { pos: [0.45, 1.9, 8.6], look: [0.1, 2.3, 1.0] };
    return {
      update(t) {
        let pose = t < PLUCK[0] - 0.4 ? 1 : 0;
        tags.forEach((tg, i) => {
          const p = PLUCK[i];
          if (t >= p - 0.75 && t < p - 0.4) pose = 2;
          openTo(drs[tg.word], easeOut((t - (p - 0.72)) / 0.25));
          // the word flies from its drawer and lands on the pluck; the pin goes in, and it stays put, apart from the others
          const f = clamp01((t - (p - 0.4)) / 0.4), e = easeOut(f);
          tg.tag.visible = t >= p - 0.4;
          tg.tag.position.copy(tg.from).lerp(tg.p, e).add(v3([0, 0.25 * Math.sin(Math.PI * f), 0.2 * Math.sin(Math.PI * f)]));
          tg.tag.scale.setScalar(lerp(0.45, 1, e));
          const tug = 0.02 * Math.sin(t * 11 + i * 2) * smooth(6, 6.3, t);
          tg.tag.rotation.set(tg.r.x, tg.r.y + 1.2 * (1 - e), tg.r.z + 0.05 * after(t, p, 0.12) * Math.sin((t - p) * 30) + tug);
          tg.pin.visible = t >= p - 0.05; tg.shaft.visible = t >= p;
          tg.pin.position.copy(tg.pinP); tg.pin.position.z += 0.3 * (1 - clamp01((t - (p - 0.05)) / 0.05));
        });
        g.show(pose);
        const k = smooth(4, 7, t);
        aim(S, v3(A.pos).lerp(v3(B.pos), k), v3(A.look).lerp(v3(B.look), k));
        S.post.dof.focus = S.camera.position.z - 1.9;
      },
    };
  },

  // 4 (7 to 10 s): the stitching, as approved (shot4.js)
  async stitch(S) {
    const up = buildStitching(S);
    return { update: (t) => up(t - 7) };
  },

  // 5 (10 to 12 s): the burst. The drawers fly open from the middle outwards, warm light pours out, the words scatter
  // past the lens, she jumps for joy (and again on the "wonder" chord at 11.0)
  async burst(S) {
    const o = await SHOTS[5](S.scene, S.camera);
    post(S, o, { warm: 0.1 });
    const { wall, glow, tags, girl: gl } = o.h;
    const drs = drawers(wall);
    drs.forEach((x) => { x.delay = 0.025 * Math.hypot(x.d.userData.r - 8, x.d.userData.c - 3); });
    const glowI = glow.map((l) => l.intensity);
    tags.forEach((tg, i) => {
      const src = drs[(i * 37) % drs.length], [x, y, z] = drawerAt(src.d.userData.r, src.d.userData.c);
      tg.userData.fly = { p: tg.position.clone(), r: tg.rotation.clone(), s: tg.scale.x, from: v3([x, y, z + 0.6]), delay: src.delay + 0.06, spin: v3([Math.sin(i * 1.3) * 3, Math.cos(i * 0.7) * 4, Math.sin(i * 2.1) * 3]) };
    });
    const g = poses(S.scene, gl, [{ reach: 0.3, look: [0.1, 1], mood: 'delighted', kick: 0 }]);
    return {
      update(t) {
        drs.forEach((x) => openTo(x, easeBack((t - 10 - x.delay) / 0.22)));
        glow.forEach((l, i) => { l.intensity = glowI[i] * smooth(10, 10.4, t); });
        tags.forEach((tg) => {
          const F = tg.userData.fly, f = clamp01((t - 10 - F.delay) / 0.7), e = easeOut(f);
          tg.visible = t >= 10 + F.delay;
          tg.position.copy(F.from).lerp(F.p, e);
          tg.position.z += 0.6 * Math.max(0, t - 10.3);
          tg.rotation.set(F.r.x + F.spin.x * (1 - e), F.r.y + F.spin.y * (1 - e), F.r.z + F.spin.z * (1 - e));
          tg.scale.setScalar(F.s * lerp(0.4, 1, e));
        });
        g.show(t < 10.15 ? 1 : 0);
        g.place(g.home.clone().add(v3([0, 0.28 * arc(t, 10.15, 0.45) + 0.12 * arc(t, 11, 0.35), 0])), g.ry);
        const k = easeOut((t - 10) / 2);
        aim(S, v3([0.05, 0.85, 13.5]).lerp(v3([0.05, 1.05, 10.2]), k), v3([0, 3.0, 0]).lerp(v3([0, 2.9, 0]), k));
        S.post.dof.focus = S.camera.position.z - 3.3;
      },
      blur: (t) => (t < 10.7 ? 6 : 1),
    };
  },

  // 6 (12 to 16 s): a whip pan into the street, settling on the hero frame. The words become the world: "snowing"
  // crumbles into the snow, "late" rings the alarm clock on the beat, and she catches "bus" at 14.0 and runs for it
  async world(S) {
    const o = world(S.scene, S.camera);
    post(S, o, { bloom: 0.1, threshold: 0.96, vig: 0.3, warm: 0.12 });
    const { clock, tags, trail, snow, girl: gl } = o.h;
    const P = S.camera.position.clone(), L = v3([-0.05, 1.85, 1.5]);
    const home = Object.fromEntries(Object.entries(tags).map(([w, tg]) => [w, { p: tg.position.clone(), r: tg.rotation.clone() }]));
    const trailP = trail.map((b) => b.position.clone()), snowP = snow.map((b) => b.position.clone());
    const clockR = clock.rotation.clone(), clockP = clock.position.clone();
    const g = poses(S.scene, gl, [{ reach: 0.75, look: [0.6, 0.5], mood: 'delighted', kick: 0.2 }]);
    const HAND = v3([0.48, 1.69, 0.18]);   // her raised mitten, in her own space
    const run = v3([0.875, 0, -0.483]);
    const girlAt = (t) => g.home.clone().addScaledVector(run, 1.1 * Math.max(0, t - 14.5));
    return {
      update(t) {
        // she runs from 14.5, on twos, turning towards the bus in two frames
        const gp = girlAt(t), running = t >= 14.5;
        g.place(gp.clone().add(v3([0, running ? 0.07 * (twos(t) % 2) : 0.03 * arc(t, 14, 0.25), 0])), t < 14.45 ? g.ry : t < 14.53 ? 1.1 : 2.07);
        g.show(running && twos(t) % 2 ? 1 : 0);
        g.all[0].updateMatrixWorld(true);
        const hand = g.all[0].localToWorld(HAND.clone());

        Object.entries(tags).forEach(([w, tg], i) => {
          const h = home[w], k = easeOut((t - 12 - i * 0.05) / 0.7);
          tg.position.copy(h.p).add(v3([(-2.2 - i * 0.4) * (1 - k), 0.4 * (1 - k) + 0.04 * Math.sin(t * 2.2 + i), 0]));
          tg.rotation.set(h.r.x, h.r.y, h.r.z + 0.03 * Math.sin(t * 1.7 + i));
        });
        // "bus" flies into her mitten at 14.0 and goes with her
        const bus = tags.bus, f = clamp01((t - 13.6) / 0.4);
        if (f > 0) {
          const grab = hand.clone().add(v3([0.3, 0.05, 0.05]));
          bus.position.copy(home.bus.p).lerp(grab, easeOut(f)).add(v3([0, 0.3 * Math.sin(Math.PI * f), 0]));
          bus.rotation.set(0, lerp(home.bus.r.y, 0.2, f), lerp(home.bus.r.z, 0.15, f) + 0.1 * after(t, 14, 0.1) * Math.sin((t - 14) * 30));
        }
        // "late" sets the clock ringing on the beats
        const ring = after(t, 13, 0.15) + after(t, 13.5, 0.15);
        clock.rotation.set(clockR.x, clockR.y, clockR.z + 0.08 * ring * Math.sin(t * 45));
        clock.position.set(clockP.x, clockP.y + 0.03 * ring * Math.abs(Math.sin(t * 45)), clockP.z);
        // "snowing" crumbles into felt snow, and the snow falls
        trail.forEach((b, i) => { const at = 12.4 + i * 0.06; b.visible = t >= at; b.position.copy(trailP[i]).add(v3([0, -0.25 * Math.max(0, t - at), 0])); });
        snow.forEach((b, i) => {
          const y = 0.5 + ((((snowP[i].y - 0.5 - 0.35 * (t - 12)) % 4.4) + 4.4) % 4.4);
          b.position.set(snowP[i].x + 0.05 * Math.sin(t * 1.3 + i), y, snowP[i].z);
        });

        // the whip pan settles on the hero frame, then the camera eases in and follows her a little
        const yaw = -0.65 * (1 - easeOut((t - 12) / 0.45));
        const pos = P.clone().add(v3([0.3 * (gp.x - g.home.x), 0, -0.6 * smooth(12.5, 16, t)]));
        const look = pos.clone().add(L.clone().sub(P).applyAxisAngle(Y, yaw));
        aim(S, pos, look);
        S.post.dof.focus = pos.distanceTo(gp) - 0.15;
      },
      blur: (t) => (t < 12.45 ? 8 : 1),
    };
  },

  // 7 (16 to 20 s): the bus drives out of frame, the camera rises to Big Ben and her stage; the medal arrives on the
  // crash at 18.0 and the felt confetti falls
  async proof(S) {
    const o = await SHOTS[7](S.scene, S.camera);
    post(S, o, { warm: 0.1 });
    const { bus, girl: gl, confetti } = o.h;
    const busP = bus.position.clone();
    const conf = confetti.map((c) => ({ c, p: c.position.clone(), r: c.rotation.clone() }));
    const g = poses(S.scene, gl, [{ reach: 0.15, look: [0.1, 0.6], mood: 'delighted', kick: 0 }]);
    const A = { pos: [1.9, 0.6, 7.2], look: [1.1, 0.75, -2.4] }, B = { pos: [0, 1.45, 10.4], look: [0, 2.05, 0.5] }, C = { pos: [0, 1.5, 9.7], look: [0, 2.05, 0.5] };
    return {
      update(t) {
        const d = t - 16;
        bus.position.set(busP.x - 1.0 + 2.2 * d + 1.2 * d * d, busP.y + 0.012 * Math.abs(Math.sin(t * 18)), busP.z);
        g.show(t < 18 ? 1 : 0);
        g.place(g.home.clone().add(v3([0, 0.22 * arc(t, 18, 0.4) + 0.08 * arc(t, 18.5, 0.25), 0])), g.ry);
        conf.forEach(({ c, p, r }, i) => {
          c.visible = t >= 18;
          const ft = Math.max(0, t - 18);
          c.position.set(p.x + 0.08 * Math.sin(t * 3 + i), p.y + 3.0 - 1.4 * ft, p.z);
          c.rotation.set(r.x + ft * (2 + (i % 3)), r.y + ft * 1.5, r.z);
        });
        let pos, look;
        if (t < 17) { pos = v3(A.pos); look = v3(A.look).add(v3([0.6 * d, 0, 0])); }
        else if (t < 18) { const k = smooth(17, 18, t); pos = v3(A.pos).lerp(v3(B.pos), k); look = v3(A.look).add(v3([0.6, 0, 0])).lerp(v3(B.look), k); }
        else { const k = smooth(18, 20, t); pos = v3(B.pos).lerp(v3(C.pos), k); look = v3(B.look); }
        aim(S, pos, look);
        S.post.dof.focus = lerp(pos.distanceTo(bus.position), pos.z - 1.2, smooth(16.8, 17.8, t));
      },
    };
  },

  // 8 (20 to 24 s): the end card. The needle stitches round the logo, the felt flowers bloom on the music box's
  // notes, she waves; the camera settles and holds
  async end(S) {
    const o = await SHOTS[8](S.scene, S.camera);
    post(S, o, { warm: 0.1 });
    const { card, stitches, flowers, leaves, girl: gl } = o.h;
    // round the card clockwise from the top left: along the top, down the right, back along the bottom, up the left
    const seq = [...stitches[0], ...stitches[1].slice().reverse(), ...stitches[2].slice().reverse(), ...stitches[3]];
    const T0 = 20.0, STEP = 1.5 / seq.length;
    const needle = feltNeedle(); needle.scale.setScalar(0.8); S.scene.add(needle);
    const cardP = card.position.clone();
    const BLOOM = [20.5, 20 + 5 / 6, 21.0, 21.5, 21 + 5 / 6, 22.0];   // the music box's notes
    const g = poses(S.scene, gl, [{ reach: 0.75, look: [0.3, 0.2], mood: 'delighted', kick: 0 }, { reach: 0.15, look: [0.3, 0.2], mood: 'delighted', kick: 0 }]);
    const DOWN = v3([0, -1, 0]);
    return {
      update(t) {
        const s = clamp01((t - 20) / 0.35);
        card.position.set(cardP.x, cardP.y + 0.12 * (1 - easeOut(s)), cardP.z);
        card.scale.setScalar(1 + 0.03 * (1 - easeOut(s)));
        seq.forEach((d, j) => { d.scale.x = Math.max(0.001, clamp01((t - T0 - j * STEP) / 0.04)); d.visible = t >= T0 + j * STEP; });
        // the needle rides the stitch it is sewing, stabbing in on each one, then lifts away
        const j = Math.min(seq.length - 1, Math.floor((t - T0) / STEP));
        needle.visible = t < 22.1;
        if (needle.visible) {
          const a = seq[Math.max(0, j)].position, b = seq[Math.min(seq.length - 1, Math.max(0, j) + 1)].position;
          const ph = clamp01((t - T0) / STEP - j), along = a.clone().lerp(b, ph);
          const dir = b.clone().sub(a).normalize().multiplyScalar(0.6).add(v3([0, 0, -1])).normalize();
          needle.quaternion.setFromUnitVectors(DOWN, dir);
          needle.position.copy(along).addScaledVector(dir, 0.04 * Math.sin(ph * Math.PI) - 0.03).add(v3([1.5, 1.5, 1]).multiplyScalar(easeIn((t - 21.5) / 0.6)));
        }
        flowers.forEach((f, i) => { const k = easeBack((t - BLOOM[i]) / 0.35); f.scale.setScalar(Math.max(0.001, k)); f.rotation.z = -0.6 * (1 - clamp01((t - BLOOM[i]) / 0.35)); });
        leaves.forEach((l, i) => { l.visible = t >= 20.6 + i * 0.4; l.scale.setScalar(Math.max(0.001, easeBack((t - 20.6 - i * 0.4) / 0.3))); });
        g.show(t < 20.6 ? 2 : t < 23.4 ? (Math.floor((t - 20.6) * 6) % 2 ? 1 : 0) : 0);
        const k = smooth(20, 22, t);
        aim(S, v3([0, 2.55, 9.2]).lerp(v3([0, 2.45, 8.6]), k), v3([0, 2.45, 0]));
      },
    };
  },
};

let stage, S = null, current = null, shot = null, subEl, acc, accG, chain = Promise.resolve();
let ssaa = 1.5;

export async function init(q) {
  window.DUR = DUR;
  stage = document.getElementById('stage');
  stage.style.width = FW + 'px'; stage.style.height = FH + 'px';
  globalThis.FELT_Q = +(q.get('fq') || 0.8);
  ssaa = +(q.get('ssaa') || 1.5);
  subEl = subtitle(stage, FW, '');
  // motion blur for the fast moves: sub-frames averaged into a 2D canvas laid over the WebGL one
  acc = document.createElement('canvas'); acc.width = FW; acc.height = FH;
  Object.assign(acc.style, { position: 'absolute', left: '0', top: '0', width: FW + 'px', height: FH + 'px', zIndex: 2, display: 'none' });
  stage.appendChild(acc); accG = acc.getContext('2d');
  await draw(0);
}

// render calls are queued, so a scene is never built twice at once
export function frame(t) {
  chain = chain.then(() => draw(t));
  return chain;
}

async function draw(t) {
  t = Math.min(Math.max(t, 0), DUR - 1e-6);
  const [, , name] = SCENES.find(([a, b]) => t >= a && t < b);
  if (current !== name) {
    if (S) { S.canvas.remove(); S.renderer.dispose(); S.renderer.forceContextLoss(); }
    S = setup(stage, { w: FW, h: FH, fov: 30, ssaa, exposure: name === 'world' ? 0.9 : 0.95 });
    shot = await BUILD[name](S);
    current = name;
  }
  subEl.textContent = SUBS[SHOT_AT.findLastIndex((a) => t >= a) + 1];

  const n = shot.blur ? shot.blur(t) : 1;
  if (n <= 1) { shot.update(t); S.post.composer.render(); acc.style.display = 'none'; return; }
  const shutter = 1 / 48;   // a 180-degree shutter at 24 fps
  for (let i = 0; i < n; i++) {
    shot.update(t - shutter + (shutter * i) / (n - 1));
    S.post.composer.render();
    accG.globalAlpha = 1 / (i + 1);
    accG.drawImage(S.canvas, 0, 0, FW, FH);
  }
  acc.style.display = 'block';
}
