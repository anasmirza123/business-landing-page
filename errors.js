'use strict';
const notFound = (req, res) => res.status(404).json({ success: false, message: 'Not found.' });

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ success: false, message: 'Request is too large.' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ success: false, message: 'Invalid request.' });
  console.error(`[error] ${req.method} ${req.originalUrl}`, err); // details stay in server logs only
  return res.status(500).json({ success: false, message: 'Something went wrong on our side. Please try again later.' });
};
module.exports = { notFound, errorHandler };
