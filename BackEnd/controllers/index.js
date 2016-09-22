var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'tokokohong'
});

router.use('/barang', require('./barang'))
router.use('/pelanggan', require('./pelanggan'))
router.use('/karyawan', require('./karyawan'))
router.use('/supplier', require('./supplier'))
router.use('/pembelian', require('./pembelian'))

module.exports = router
