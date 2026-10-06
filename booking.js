'use strict';
const router = require('express').Router();
const limiter = require('../middleware/limiter');
const { createBooking } = require('../controllers/requests');

router.post('/', limiter, createBooking);
module.exports = router;
