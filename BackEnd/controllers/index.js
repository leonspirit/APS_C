var express = require('express');
var router = express.Router();

router.use('/barang', require('./barang'))

module.exports = router
