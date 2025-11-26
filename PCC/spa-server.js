// Servidor simple para Angular SPA con soporte de rutas
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DIST_FOLDER = path.join(__dirname, 'dist', 'pcc', 'browser');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  // CORS headers para permitir conexiones desde otros dispositivos
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  let filePath = path.join(DIST_FOLDER, req.url === '/' ? 'index.html' : req.url);
  
  // Si el archivo no existe y no es un asset, servir index.html (para rutas de Angular)
  if (!fs.existsSync(filePath) && !req.url.includes('.')) {
    filePath = path.join(DIST_FOLDER, 'index.html');
    console.log(`  → Sirviendo index.html para ruta: ${req.url}`);
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.log(`  ✗ Archivo no encontrado: ${filePath}`);
        // Archivo no encontrado, servir index.html
        fs.readFile(path.join(DIST_FOLDER, 'index.html'), (err, indexContent) => {
          if (err) {
            console.log(`  ✗ Error cargando index.html: ${err.message}`);
            res.writeHead(500);
            res.end('Error loading index.html');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' });
            res.end(indexContent, 'utf-8');
          }
        });
      } else {
        console.log(`  ✗ Error del servidor: ${error.code}`);
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      console.log(`  ✓ ${contentType} (${content.length} bytes)`);
      
      const headers = {
        'Content-Type': contentType,
        'Cache-Control': req.url.includes('ngsw') || req.url.includes('.js') || req.url.includes('.css') 
          ? 'no-cache' 
          : 'public, max-age=31536000',
        'X-Content-Type-Options': 'nosniff'
      };
      
      res.writeHead(200, headers);
      
      // Para archivos de texto (JS, CSS, HTML), especificar encoding
      if (contentType.includes('javascript') || contentType.includes('css') || contentType.includes('html')) {
        res.end(content, 'utf-8');
      } else {
        res.end(content);
      }
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  
  console.log(`✅ Servidor corriendo en:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   http://127.0.0.1:${PORT}`);
  addresses.forEach(addr => console.log(`   http://${addr}:${PORT}`));
  console.log(`\n📱 PWA Lista - Presiona Ctrl+C para detener\n`);
});
