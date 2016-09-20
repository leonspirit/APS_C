var express = require('express');
var router = express.Router();

router.use('/barang', require('./barang'))
router.use('/pelanggan', require('./pelanggan'))

module.exports = router
