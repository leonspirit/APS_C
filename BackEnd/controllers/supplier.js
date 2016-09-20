var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'tokokohong'
});
connection.connect();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/tambah_supplier', function(req,res){

    var querystring = 'INSERT INTO supplier SET nama = ?, telp = ?, alamat = ?';
    var supplier = [req.body.nama, req.body.telp, req.body.alamat];
    connection.query(querystring, supplier, function(err,result){
        if(err) throw err;
        var resp = {supplierID:result.insertId};
        res.type('application/json');
        res.status(200).send(resp);
    });
});

router.get('/list_supplier', function(req,res){

    var querystring = 'SELECT * FROM supplier';
    connection.query(querystring, function(err, result){
        if(err) throw err;
        res.status(200).send(result);
    });
});

router.post('/hapus_supplier', function(req,res){

    var querystring = 'DELETE FROM supplier WHERE supplierID = ?';
    var supplier = [req.body.supplierID];
    connection.query(querystring, supplier, function(err, result){
        if(err) throw err;
        var resp = {affectedRows:result.affectedRows};
        res.type('application/json');
        res.status(200).send(resp);
    });
})

module.exports = router
