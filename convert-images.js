// convert-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'assets/images/orig');
const outDir = path.join(__dirname, 'assets/images/optimized');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const images = [
  { file: 'qVM5h4DTtg29Nmmz7D741.jpeg', base: 'logo' },
  { file: 'vVpX1me4oo8TtYtrv7kV1.jpeg', base: 'hero' },
  { file: 'Phh5yDZhtvaLUzywogcow.jpeg', base: 'door1' },
  { file: 'Cv2U93h3BvkHmaGiwfLhx.jpeg', base: 'door2' }
];

const sizes = [320, 640, 1024, 1600];

(async () => {
  for (const img of images) {
    const input = path.join(inputDir, img.file);
    if (!fs.existsSync(input)) {
      console.warn('Missing input', input);
      continue;
    }
    for (const w of sizes) {
      const outWebp = path.join(outDir, `${img.base}-${w}.webp`);
      await sharp(input).resize({ width: w }).webp({ quality: 78, reductionEffort: 6 }).toFile(outWebp);
      console.log('wrote', outWebp);
    }
    // create a medium JPEG fallback
    const jpegOut = path.join(outDir, `${img.base}-1024.jpg`);
    await sharp(input).resize({ width: 1024 }).jpeg({ quality: 76 }).toFile(jpegOut);
    // create small logo variants for favicon/header
    if (img.base === 'logo') {
      await sharp(input).resize({ width: 64 }).webp({ quality: 85 }).toFile(path.join(outDir, 'logo-64.webp'));
      await sharp(input).resize({ width: 128 }).webp({ quality: 85 }).toFile(path.join(outDir, 'logo-128.webp'));
      await sharp(input).resize({ width: 128 }).jpeg({ quality: 85 }).toFile(path.join(outDir, 'logo-128.jpg'));
    }
  }
  console.log('Done optimizing images');
})();
