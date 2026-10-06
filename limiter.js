'use strict';
const rateLimit = require('express-rate-limit');

// 10 submissions per 15 minutes per IP on public form endpoints.
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again in a few minutes.' }
});
