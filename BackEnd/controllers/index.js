var express = require('express');
var router = express.Router();

router.use('/barang', require('./barang'))
router.use('/pelanggan', require('./pelanggan'))
router.use('/karyawan', require('./karyawan'))
router.use('/supplier', require('./supplier'))
router.use('/penjualan', require('./penjualan'))

module.exports = router
