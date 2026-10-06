'use strict';
const { validate } = require('../utils/validate');
const store = require('../utils/store');

const OK = { success: true, message: 'Request submitted successfully.' };

const makeHandler = (type, fields) => async (req, res, next) => {
  try {
    if (req.body && typeof req.body.website === 'string' && req.body.website.trim()) {
      return res.status(201).json(OK); // honeypot: bots fill the hidden field; pretend success, store nothing
    }
    const { values, errors } = validate(req.body, fields, type);
    if (errors) return res.status(400).json({ success: false, message: Object.values(errors)[0], errors });

    const { date, time, ...rest } = values;
    const data = type === 'booking' ? { ...rest, preferred_date: date || null, preferred_time: time || null } : rest;
    const record = await store.save(type, data);
    console.info(`[${type}] stored ${record.id}`);
    return res.status(201).json({ ...OK, id: record.id });
  } catch (err) {
    return next(err);
  }
};

exports.createBooking = makeHandler('booking', ['name', 'phone', 'email', 'vehicle', 'service', 'date', 'time', 'message']);
exports.createContact = makeHandler('contact', ['name', 'phone', 'email', 'message']);
