'use strict';
require('dotenv').config();
const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errors');

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const origins = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
const CLIENT_DIR = path.join(__dirname, '../client');

if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1);
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", 'data:'],
      'frame-src': ['https://www.google.com', 'https://maps.google.com'],
      'upgrade-insecure-requests': isProd ? [] : null // would break http://localhost
    }
  }
}));

// API: cross-origin only for listed origins; small body limit.
app.use('/api', cors({ origin: origins.length ? origins : false, methods: ['GET', 'POST'] }), express.json({ limit: '10kb' }));
app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok', uptime: Math.round(process.uptime()) }));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/booking', require('./routes/booking'));
app.use('/api', notFound);

// Client: HTML always revalidated, other assets cached.
app.use(express.static(CLIENT_DIR, {
  maxAge: isProd ? '7d' : 0,
  setHeaders: (res, file) => { if (file.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache'); }
}));
app.use(errorHandler);

module.exports = app;

if (require.main === module) {
  const port = Number(process.env.PORT) || 5000;
  const server = app.listen(port, () => console.info(`Al-Noor Auto Workshop running on http://localhost:${port}`));
  process.on('SIGTERM', () => server.close(() => process.exit(0)));
}
