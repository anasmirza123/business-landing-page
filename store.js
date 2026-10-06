'use strict';
// Storage adapter. Swap this one function for PostgreSQL/MongoDB/email in production.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

async function save(type, data) {
  const file = path.resolve(process.env.DATA_FILE || path.join(__dirname, '../../data/requests.ndjson'));
  const record = { id: crypto.randomUUID(), type, ...data, created_at: new Date().toISOString() };
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.appendFile(file, `${JSON.stringify(record)}\n`);
  return record;
}
module.exports = { save };
