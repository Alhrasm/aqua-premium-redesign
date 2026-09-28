// Assembles the single-file site: node scripts/build.mjs  (or: npm run build)
import { readFileSync, writeFileSync } from 'node:fs';

const src = f => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
const stripComments = s => s.replace(/<!--[\s\S]*?-->\s*/g, '');

const html =
  src('head.html').replace('/*STYLES*/', src('styles.css').trim()) +
  stripComments(src('body.html')).trim() +
  '\n<script>\n' + src('app.js').trim() + '\n</script>\n</body>\n</html>\n';

const out = new URL('../index.html', import.meta.url);
writeFileSync(out, html);
console.log(`built index.html — ${(Buffer.byteLength(html) / 1024).toFixed(1)} kB`);
