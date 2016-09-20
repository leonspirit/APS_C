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

/*
router.get('/', function (req, res) {
    var temp = []
    var stok1 = {"kode":1, "nama":"sendok", "stok":100, "harga_jual":1000, "harga_pokok":1500};
    var stok2 = {"kode":2, "nama":"garpu", "stok":50, "harga_jual":1200, "harga_pokok":1400};
    var stok3 = {"kode":3, "nama":"piring", "stok":150, "harga_jual":5000, "harga_pokok":5500};

    temp.push(stok1);
    temp.push(stok2);
    temp.push(stok3);

    console.log(temp);
    res.send(JSON.stringify(temp));
});
*/

router.post('/tambah_barang', function(req,res){

    var barang = [req.body.nama, req.body.stok];
    var querystring = 'INSERT INTO barang SET nama = ?, stok = ?';
    connection.query(querystring, barang, function(err,result){

        if(err) throw err;
        var querystring2 = 'INSERT INTO satuanbarang SET barangID = ?, harga_jual = ?, harga_pokok = ?, satuan = ?';
        var satuan = [result.insertId, req.body.harga_jual, req.body.harga_pokok, req.body.satuan];
        connection.query(querystring2, satuan, function(err2, result2){
            if(err2) throw err2;
            var resp = {barangID:result.insertId, satuanID:result2.insertId};
            res.type('application/json')
            res.status(200).send(resp);
        });
    });
});

router.post('/tambah_satuan', function(req,res){

    var satuan = [req.body.barangID, req.body.harga_jual, req.body.harga_pokok, req.body.satuan];
    var querystring = 'INSERT INTO satuanbarang SET barangID = ?, harga_jual = ?, harga_pokok = ?, satuan = ?';
    connection.query(querystring, satuan, function(err, result){
        if(err) throw err;
        var resp = {satuanID:result.insertId};
        res.type('application/json');
        res.status(200).send(resp);
    });
});

router.get('/list_barang', function(req,res){

    var querystring = 'SELECT * FROM barang';
    connection.query(querystring, function(err, result){
        if(err) throw err;
        res.status(200).send(result);
    });
});

router.get('/list_satuan/:barangID', function(req,res){

    var querystring = 'SELECT * FROM satuanbarang WHERE barangID = ?';
    var satuan = [req.params.barangID];
    connection.query(querystring, satuan, function(err, result){
        if(err) throw err;
        res.status(200).send(result);
    });
});

module.exports = router
