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

router.post('/tambah_karyawan', function(req,res){

    var querystring = 'INSERT INTO karyawan SET nama = ?, telp = ?, alamat = ?, username = ?, password = ?, hak_akses = ?';
    var karyawan = [req.body.nama, req.body.telp, req.body.alamat, req.body.username, req.body.password, req.body.hak_akses];
    connection.query(querystring, karyawan, function(err,result){
        if(err) throw err;
        var resp = {karyawanID:result.insertId};
        res.type('application/json');
        res.status(200).send(resp);
    });
});

router.get('/list_karyawan', function(req,res){

    var querystring = 'SELECT karyawanID, nama, telp, alamat, username, hak_akses FROM karyawan';
    connection.query(querystring, function(err, result){
        if(err) throw err;
        res.status(200).send(result);
    });
});

router.post('/hapus_karyawan', function(req,res){

    var querystring = 'DELETE FROM karyawan WHERE karyawanID = ?';
    var karyawan = [req.body.karyawanID];
    connection.query(querystring, karyawan, function(err, result){
        if(err) throw err;
        var resp = {affectedRows:result.affectedRows};
        res.type('application/json');
        res.status(200).send(resp);
    });
});

router.post('/update_karyawan', function(req,res){

    var querystring = 'UPDATE karyawan SET nama = ?, telp = ?, alamat = ?, username = ?, hak_akses = ? WHERE karyawanID = ?';
    var karyawan = [req.body.nama, req.body.telp, req.body.alamat, req.body.username, req.body.hak_akses, req.body.karyawanID];
    connection.query(querystring, karyawan, function(err, result){
        if(err) throw err;
        var resp = {affectedRows:result.affectedRows};
        res.type('application/json');
        res.status(200).send(resp);
    });
});


module.exports = router
