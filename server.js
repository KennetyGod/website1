const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8'
};

const FOTO_PROYEK_DIR = path.join(PUBLIC_DIR, 'assets', 'images', 'foto proyek tahunan');
const fotoFileMap = new Map();

function scanFotoProyekDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanFotoProyekDir(fullPath);
    } else {
      const lowerName = entry.name.toLowerCase();
      if (!fotoFileMap.has(lowerName)) {
        fotoFileMap.set(lowerName, fullPath);
      }
    }
  }
}

try {
  scanFotoProyekDir(FOTO_PROYEK_DIR);
  console.log(`Indexed ${fotoFileMap.size} annual project media files.`);
} catch (err) {
  console.error('Error indexing foto proyek tahunan:', err);
}

const requestHandler = (req, res) => {
  let reqUrl = req.url.split('?')[0];
  try {
    reqUrl = decodeURIComponent(reqUrl);
  } catch (e) {}

  if (reqUrl === '/') {
    reqUrl = '/index.html';
  }

  let filePath = path.join(PUBLIC_DIR, reqUrl);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  // Resolve media inside 'foto proyek tahunan'
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    let relPath = reqUrl;
    if (reqUrl.startsWith('/assets/images/')) {
      relPath = reqUrl.substring('/assets/images/'.length);
    } else if (reqUrl.toLowerCase().startsWith('/foto proyek/')) {
      relPath = reqUrl.substring('/foto proyek/'.length);
    }

    let candidate = path.join(FOTO_PROYEK_DIR, relPath);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      filePath = candidate;
    } else {
      const relAlt = relPath.replace(/^(2021|2022|2023)\//, '2021-2023/');
      candidate = path.join(FOTO_PROYEK_DIR, relAlt);
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        filePath = candidate;
      } else {
        const baseName = path.basename(relPath).toLowerCase();
        if (fotoFileMap.has(baseName)) {
          filePath = fotoFileMap.get(baseName);
        }
      }
    }
  }

  // Fallback for missing image files (e.g., Foto Proyek/...)
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    const ext = path.extname(reqUrl).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
      const showcaseImages = [
        'kanopi21.png',
        'balkon21.jpg',
        'teralis21.jpg',
        'tangga21.png',
        'pagar-cat.jpg',
        'kaca21.jpg',
        'tempa21.jpg',
        'baja21.jpg',
        'fasad21.jpg',
        'pintu-cat.jpg',
        'custom-cat.jpg',
        'meja-cat.jpg'
      ];

      const lowerUrl = reqUrl.toLowerCase();
      let fallbackName = '';

      if (lowerUrl.includes('kanopi') || lowerUrl.includes('acp') || lowerUrl.includes('carport') || lowerUrl.includes('alderon')) {
        fallbackName = 'kanopi21.png';
      } else if (lowerUrl.includes('balkon') || lowerUrl.includes('terras')) {
        fallbackName = 'balkon21.jpg';
      } else if (lowerUrl.includes('teralis') || lowerUrl.includes('antimaling') || lowerUrl.includes('maling')) {
        fallbackName = 'teralis21.jpg';
      } else if (lowerUrl.includes('tangga') || lowerUrl.includes('railing')) {
        fallbackName = 'tangga21.png';
      } else if (lowerUrl.includes('tempa')) {
        fallbackName = 'tempa21.jpg';
      } else if (lowerUrl.includes('baja') || lowerUrl.includes('konstruksi') || lowerUrl.includes('lest plang')) {
        fallbackName = 'baja21.jpg';
      } else if (lowerUrl.includes('kaca') || lowerUrl.includes('partisi') || lowerUrl.includes('kusen') || lowerUrl.includes('etalase')) {
        fallbackName = 'kaca21.jpg';
      } else if (lowerUrl.includes('fasad') || lowerUrl.includes('kisi')) {
        fallbackName = 'fasad21.jpg';
      } else if (lowerUrl.includes('pintu') || lowerUrl.includes('folding') || lowerUrl.includes('garasi') || lowerUrl.includes('gate')) {
        fallbackName = 'pintu-cat.jpg';
      } else if (lowerUrl.includes('lift') || lowerUrl.includes('meja') || lowerUrl.includes('custom') || lowerUrl.includes('rak')) {
        fallbackName = lowerUrl.includes('meja') ? 'meja-cat.jpg' : 'custom-cat.jpg';
      } else {
        let hash = 0;
        for (let i = 0; i < reqUrl.length; i++) {
          hash = (hash << 5) - hash + reqUrl.charCodeAt(i);
          hash |= 0;
        }
        const index = Math.abs(hash) % showcaseImages.length;
        fallbackName = showcaseImages[index];
      }
      
      const fallbackPath = path.join(PUBLIC_DIR, 'assets', 'images', fallbackName);
      if (fs.existsSync(fallbackPath)) {
        filePath = fallbackPath;
      }
    }
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    let cacheHeader = 'no-cache, must-revalidate';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': cacheHeader,
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="id">
      <head><meta charset="utf-8"><title>404 Not Found</title></head>
      <body style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h2>404 - Halaman Tidak Ditemukan</h2>
        <p>File <code>${reqUrl}</code> tidak ditemukan.</p>
        <a href="/">Kembali ke Beranda</a>
      </body>
      </html>
    `);
  }
};

const server = http.createServer(requestHandler);
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://localhost:${PORT}/ and http://127.0.0.1:${PORT}/`);
});

const ipv6Server = http.createServer(requestHandler);
ipv6Server.on('error', (err) => {
  console.log('IPv6 listener note:', err.message);
});
ipv6Server.listen(PORT, '::1');
