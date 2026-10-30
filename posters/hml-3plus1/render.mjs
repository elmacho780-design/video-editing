// Render the poster to a lossless PNG through the Lemo-Opuscar page loader (GPU headless Chromium).
//   node render.mjs [--size 3508x4960] [--q 'k=v&..'] --out poster.png
// LIB = the library (default ~/lemo-opuscar). 3508x4960 is A3 at 300 dpi (A3 is 4961 px tall; the loader needs even sizes).
import path from 'path'; import os from 'os'; import { pathToFileURL, fileURLToPath } from 'url';
const LIB = process.env.LIB || path.join(os.homedir(), 'lemo-opuscar');
const { openDemo, closeServer, takeSize } = await import(pathToFileURL(path.join(LIB, 'core/render/page.mjs')).href);
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const { w, h } = takeSize(args.includes('--size') ? args : [...args, '--size', '3508x4960']);
const out = path.resolve(opt('--out', 'poster.png'));
const t0 = Date.now();
const { browser, page } = await openDemo(path.dirname(fileURLToPath(import.meta.url)), { w, h, q: opt('--q', '') });
await page.screenshot({ path: out, type: 'png' });
await browser.close(); closeServer();
console.log(out, `${w}x${h}`, Date.now() - t0 + 'ms');
