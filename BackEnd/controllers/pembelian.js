var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connection = require('../database')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/tambah_pembelian', function(req,res){

    var querystring = 'INSERT INTO pembelian SET nama = ?, telp = ?, alamat = ?';
    var pelanggan = [req.body.nama, req.body.telp, req.body.alamat];
    connection.query(querystring, pelanggan, function(err,result){
        if(err) throw err;
        var resp = {pelangganID:result.insertId};
        res.type('application/json');
        res.status(200).send(resp);
    });
});

/*
router.get('/list_pelanggan', function(req,res){

    var querystring = 'SELECT * FROM pelanggan';
    connection.query(querystring, function(err, result){
        if(err) throw err;
        res.status(200).send(result);
    });
});

router.post('/hapus_pelanggan', function(req,res){

    var querystring = 'DELETE FROM pelanggan WHERE pelangganID = ?';
    var pelanggan = [req.body.pelangganID];
    connection.query(querystring, pelanggan, function(err, result){
        if(err) throw err;
        var resp = {affectedRows:result.affectedRows};
        res.type('application/json');
        res.status(200).send(resp);
    });
})
*/

module.exports = router
