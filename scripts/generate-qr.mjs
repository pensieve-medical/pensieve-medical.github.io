import fs from 'node:fs/promises';
import path from 'node:path';
import qrcode from 'qrcode-generator';

const message = '\u{1F44B} Hi! I am interested in docco';
const phone = '919226386487';
const encodedMessage = encodeURIComponent(message);
const whatsappLink = `https://wa.me/${phone}?text=${encodedMessage}`;

const qr = qrcode(0, 'H');
qr.addData(whatsappLink);
qr.make();

const moduleCount = qr.getModuleCount();
const moduleSize = 5;
const marginModules = 4;
const dimension = (moduleCount + marginModules * 2) * moduleSize;
const dotRadius = moduleSize / 2;

const renderSvg = (fillColor) => {
  const parts = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}" shape-rendering="geometricPrecision">`
  );

  for (let row = 0; row < moduleCount; row += 1) {
    for (let col = 0; col < moduleCount; col += 1) {
      if (!qr.isDark(row, col)) {
        continue;
      }
      const cx = (col + marginModules) * moduleSize + dotRadius;
      const cy = (row + marginModules) * moduleSize + dotRadius;
      parts.push(
        `<circle cx="${cx}" cy="${cy}" r="${dotRadius}" fill="${fillColor}" />`
      );
    }
  }

  parts.push('</svg>');
  return parts.join('');
};

const outDir = path.resolve('public', 'qr');
await fs.mkdir(outDir, { recursive: true });

await fs.writeFile(path.join(outDir, 'whatsapp-light.svg'), renderSvg('#0f172a'));
await fs.writeFile(path.join(outDir, 'whatsapp-dark.svg'), renderSvg('#e2e8f0'));
