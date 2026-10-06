'use strict';
// Server-side validation. Never trust the browser: every field is re-checked here.
const SERVICES = ['Engine Diagnostics', 'Oil & Filter Service', 'Brake Service', 'AC & Cooling',
  'Tire & Wheel Service', 'Battery & Electrical', 'Other / Not sure'];
const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const TAGS = /<[^>]*>/;

const clean = (v) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim() : '');
const digits = (v) => v.replace(/\D/g, '');

function checkDate(v) {
  const bad = 'Please choose a valid date.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return bad;
  const d = new Date(`${v}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v) return bad;
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  if (d.getTime() < today || d.getTime() > today + 365 * 864e5) return 'Please choose today or a later date within the next year.';
  return d.getUTCDay() === 0 ? 'We are closed on Sundays. Please choose another day.' : true;
}

const rules = {
  name: (v) => /^\p{L}[\p{L}\s.'-]{1,79}$/u.test(v) || 'Please provide your full name.',
  phone: (v) => (/^\+?[\d\s()-]{10,20}$/.test(v) && digits(v).length >= 10 && digits(v).length <= 15) || 'Please provide a valid phone number.',
  email: (v) => (v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) || 'Please provide a valid email address.',
  vehicle: (v) => (v.length >= 2 && v.length <= 80) || 'Please tell us your vehicle (make, model, year).',
  service: (v) => SERVICES.includes(v) || 'Please choose a service from the list.',
  date: checkDate,
  time: (v) => TIMES.includes(v) || 'Please choose a time from the list.',
  message: (v) => v.length <= 1000 || 'Message must be 1000 characters or fewer.'
};
const REQUIRED = { booking: ['name', 'phone', 'vehicle', 'service'], contact: ['name', 'email', 'message'] };

/** Returns { values } or { errors } (field -> message). */
function validate(body, fields, kind) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { errors: { form: 'Invalid request.' } };
  const values = {}; const errors = {};
  for (const f of fields) {
    const raw = body[f];
    if (raw !== undefined && typeof raw !== 'string') { errors[f] = 'Invalid value.'; continue; }
    const v = clean(raw);
    if (!v) { if (REQUIRED[kind].includes(f)) errors[f] = 'This field is required.'; continue; }
    if (TAGS.test(v)) { errors[f] = 'Please remove HTML or markup.'; continue; }
    const r = rules[f](v);
    if (r === true) values[f] = v; else errors[f] = r;
  }
  return Object.keys(errors).length ? { errors } : { values };
}
module.exports = { validate, SERVICES, TIMES };
