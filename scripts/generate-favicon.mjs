import fs from 'node:fs/promises';
import path from 'node:path';
import opentype from 'opentype.js';

const fontPath = path.resolve('scripts', 'assets', 'ZenDots.ttf');
const fontData = await fs.readFile(fontPath);
const font = opentype.parse(fontData.buffer.slice(fontData.byteOffset, fontData.byteOffset + fontData.byteLength));

const size = 64;
const fontSize = 46;
const text = 'd';

const makePath = () => {
  const basePath = font.getPath(text, 0, 0, fontSize);
  const bbox = basePath.getBoundingBox();
  const width = bbox.x2 - bbox.x1;
  const height = bbox.y2 - bbox.y1;
  const dx = (size - width) / 2 - bbox.x1;
  const dy = (size - height) / 2 - bbox.y1;
  return font.getPath(text, dx, dy, fontSize).toPathData(2);
};

const glyphPath = makePath();

const renderSvg = ({ bg, fg, glow1, glow2, outputFile }) => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="glow-1" cx="18%" cy="12%" r="75%">
      <stop offset="0%" stop-color="${glow1.color}" stop-opacity="${glow1.opacity}" />
      <stop offset="60%" stop-color="${glow1.color}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glow-2" cx="86%" cy="8%" r="65%">
      <stop offset="0%" stop-color="${glow2.color}" stop-opacity="${glow2.opacity}" />
      <stop offset="60%" stop-color="${glow2.color}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="14" fill="${bg}" />
  <rect width="${size}" height="${size}" rx="14" fill="url(#glow-1)" />
  <rect width="${size}" height="${size}" rx="14" fill="url(#glow-2)" />
  <path d="${glyphPath}" fill="${fg}" />
</svg>
`;
  return fs.writeFile(outputFile, svg);
};

await renderSvg({
  bg: '#0b1120',
  fg: '#f8fafc',
  glow1: { color: '#38bdf8', opacity: 0.35 },
  glow2: { color: '#4fbf9c', opacity: 0.28 },
  outputFile: path.resolve('public', 'favicon-dark.svg'),
});

await renderSvg({
  bg: '#f8fafc',
  fg: '#0b1120',
  glow1: { color: '#38bdf8', opacity: 0.3 },
  glow2: { color: '#3aa984', opacity: 0.26 },
  outputFile: path.resolve('public', 'favicon-light.svg'),
});

console.log('favicons updated');
