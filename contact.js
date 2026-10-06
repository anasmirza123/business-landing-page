'use strict';
const router = require('express').Router();
const limiter = require('../middleware/limiter');
const { createContact } = require('../controllers/requests');

router.post('/', limiter, createContact);
module.exports = router;
