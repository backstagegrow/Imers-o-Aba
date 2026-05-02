const fs = require('fs');
const path = require('path');

// Dirs to skip — too large for Cloudflare Pages 25MB/file limit
const SKIP_DIRS = ['videos'];

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.includes(entry.name)) {
      console.log(`  skipped: ${path.join(src, entry.name)}`);
      continue;
    }
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

fs.mkdirSync('dist', { recursive: true });
fs.copyFileSync('index.html', 'dist/index.html');
copyDir('assets', 'dist/assets');
console.log('Build OK → dist/');
