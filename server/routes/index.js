// server/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/api/products', require('./api/products'));

module.exports = router;
