// The graphics layer, lossless and with alpha: node tools/overlay.mjs <project> [--fps 30] [--workers 5] [--q 'view=edit'] [--out out/overlay.mkv]
// Every frame of the page is screenshotted as a PNG with a transparent background (no JPEG anywhere) and stored losslessly
// (FFV1, BGRA). The footage is NOT in this layer: tools/composite.sh lays it over the original camera file.
// The library's page loader is used as it is (LIB, default /root/lemo-opuscar).
import fs from 'fs'; import path from 'path'; import { spawn, execFileSync } from 'child_process';
const LIB = process.env.LIB || '/root/lemo-opuscar';
const { openDemo, closeServer } = await import(path.join(LIB, 'core/render/page.mjs'));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const dir = path.resolve(args[0]), FPS = +opt('--fps', 30), WK = +opt('--workers', 5), Q = opt('--q', 'view=edit');
const out = path.resolve(dir, opt('--out', 'out/overlay.mkv')), seg = out + '.segs';
fs.rmSync(seg, { recursive: true, force: true }); fs.mkdirSync(seg, { recursive: true });
const probe = await openDemo(dir, { w: 1080, h: 1920, q: Q }); const DUR = await probe.page.evaluate(() => window.DUR); await probe.browser.close();
const TOTAL = Math.round(DUR * FPS), per = Math.ceil(TOTAL / WK), t0 = Date.now();
await Promise.all([...Array(WK)].map(async (_, w) => {
  const a = w * per, b = Math.min(TOTAL, a + per); if (a >= b) return;
  const { browser, page } = await openDemo(dir, { w: 1080, h: 1920, q: Q });
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'ffv1', '-level', '3', '-pix_fmt', 'bgra', '-g', '1', `seg_${String(w).padStart(2, '0')}.mkv`], { cwd: seg, stdio: ['pipe', 'inherit', 'inherit'] });
  const closed = new Promise((r) => ff.on('close', r));
  for (let f = a; f < b; f++) {
    await page.evaluate((t) => window.render(t), f / FPS);
    const buf = await page.screenshot({ type: 'png', omitBackground: true });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if ((f - a) % 60 === 0) console.log(`w${w} ${f - a}/${b - a}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end(); await closed; await browser.close();
}));
const list = fs.readdirSync(seg).filter((n) => n.endsWith('.mkv')).sort().map((n) => `file '${n}'`).join('\n');
fs.writeFileSync(path.join(seg, 'list.txt'), list + '\n');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', 'list.txt', '-c', 'copy', out], { cwd: seg });
fs.rmSync(seg, { recursive: true, force: true }); closeServer();
const n = execFileSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', out]).toString().trim();
console.log(`done ${out}: ${n} frames (expected ${TOTAL}), ${((Date.now() - t0) / 1000).toFixed(0)} s`);
