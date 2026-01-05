import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { QRCodeStyling } = require('qr-code-styling/lib/qr-code-styling.common.js');
const { JSDOM } = require('jsdom');

const message = '\u{1F44B} Hi! I am interested in docco';
const phone = '919226386487';
const encodedMessage = encodeURIComponent(message);
const whatsappLink = `whatsapp://send?phone=${phone}&text=${encodedMessage}`;

const qrSize = 480;
const qrMargin = 12;

const toBuffer = async (rawData) => {
  if (Buffer.isBuffer(rawData)) {
    return rawData;
  }
  if (rawData instanceof ArrayBuffer) {
    return Buffer.from(rawData);
  }
  if (rawData?.arrayBuffer) {
    return Buffer.from(await rawData.arrayBuffer());
  }
  return Buffer.from(String(rawData));
};

const buildQr = async ({ dotsColor, backgroundColor, outputFile }) => {
  const qrCode = new QRCodeStyling({
    jsdom: JSDOM,
    width: qrSize,
    height: qrSize,
    type: 'svg',
    data: whatsappLink,
    margin: qrMargin,
    dotsOptions: {
      color: dotsColor,
      type: 'dots',
    },
    cornersSquareOptions: {
      color: dotsColor,
      type: 'dot',
    },
    cornersDotOptions: {
      color: dotsColor,
      type: 'dot',
    },
    backgroundOptions: {
      color: backgroundColor,
    },
  });

  const rawData = await qrCode.getRawData('svg');
  const buffer = await toBuffer(rawData);
  await fs.writeFile(outputFile, buffer);
};

const outDir = path.resolve('public', 'qr');
await fs.mkdir(outDir, { recursive: true });

await buildQr({
  dotsColor: '#0f172a',
  backgroundColor: '#ffffff',
  outputFile: path.join(outDir, 'whatsapp-light.svg'),
});

await buildQr({
  dotsColor: '#e2e8f0',
  backgroundColor: '#0b1120',
  outputFile: path.join(outDir, 'whatsapp-dark.svg'),
});
