// Express server with compression for Astro middleware-mode output.
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import compression from 'compression';
import { handler } from './dist/server/entry.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(compression());
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.destiny-ghost.com https://www.bungie.net",
      "img-src 'self' data:",
      "frame-ancestors 'none'",
    ].join('; ')
  );
  next();
});
app.use(express.static(join(__dirname, 'dist/client')));
app.use(handler);

const port = parseInt(process.env.PORT || '1101', 10);
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});

const shutdown = () => process.exit(0);
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
