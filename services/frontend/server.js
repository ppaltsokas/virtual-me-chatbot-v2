// Static file server for Railway deployment

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log(`Headers:`, JSON.stringify(req.headers, null, 2));
  
  // Health check
  if (req.url === '/health' || req.url === '/healthz' || req.url === '/_health') {
    console.log('Health check requested');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', port: PORT, timestamp: new Date().toISOString() }));
    return;
  }

  // Resolve file path
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(DIST_DIR, filePath);
  
  // Prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Get MIME type from extension
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  // Serve file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // SPA fallback: serve index.html
        const indexPath = path.join(DIST_DIR, 'index.html');
        fs.readFile(indexPath, (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`✅ Serving files from: ${DIST_DIR}`);
  console.log(`✅ Health check available at: /health`);
  console.log(`✅ Ready to accept requests`);
  
  // Log dist folder contents
  try {
    const files = fs.readdirSync(DIST_DIR);
    console.log(`✅ Dist folder contains ${files.length} items:`, files.join(', '));
  } catch (err) {
    console.error(`❌ Error reading dist folder:`, err);
  }
});

// Error handler
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

