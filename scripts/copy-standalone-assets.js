const fs = require('fs');
const path = require('path');

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  const publicDir = path.join(__dirname, '..', 'public');
  const standalonePublic = path.join(__dirname, '..', '.next', 'standalone', 'public');
  if (fs.existsSync(publicDir)) {
    copyDirSync(publicDir, standalonePublic);
  }

  const staticDir = path.join(__dirname, '..', '.next', 'static');
  const standaloneStatic = path.join(__dirname, '..', '.next', 'standalone', '.next', 'static');
  if (fs.existsSync(staticDir)) {
    copyDirSync(staticDir, standaloneStatic);
  }
  console.log('Standalone assets copied successfully.');
} catch (e) {
  console.warn('Error copying standalone assets:', e);
}
