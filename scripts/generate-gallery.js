const fs   = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'assets', 'ourBrides');
const files = fs.readdirSync(imagesDir)
  .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
  .sort((a, b) => {
    const n = s => parseInt(s) || s;
    return n(a) < n(b) ? -1 : n(a) > n(b) ? 1 : 0;
  });

function buildGalleryHTML(altPrefix) {
  return files.map((file, i) =>
    `        <div class="gallery-item" onclick="openLightbox(${i})">` +
    `<img src="assets/ourBrides/${file}" alt="${altPrefix} ${i + 1}" loading="lazy"></div>`
  ).join('\n');
}

const START = '      <!-- GALLERY-START -->';
const END   = '      <!-- GALLERY-END -->';

function updateFile(filePath, altPrefix) {
  let html = fs.readFileSync(filePath, 'utf8');
  const before = html.indexOf(START);
  const after  = html.indexOf(END);
  if (before === -1 || after === -1) {
    console.error('markers not found in ' + filePath);
    return;
  }
  const newBlock =
    START + '\n' +
    '      <div class="masonry-gallery">\n' +
    buildGalleryHTML(altPrefix) + '\n' +
    '      </div>\n' +
    END;
  html = html.slice(0, before) + newBlock + html.slice(after + END.length);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Updated ' + path.basename(filePath) + ' (' + files.length + ' images)');
}

updateFile(path.join(__dirname, '..', 'ourBrides.html'),    'כלה');
updateFile(path.join(__dirname, '..', 'ourBrides-en.html'), 'Bride');
