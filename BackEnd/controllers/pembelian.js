var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connection = require('../database')
var token_auth = require('../token')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

function add_pembelian_barang(req, i, pembelianID){

    var satuanID = req.body.satuan[i]['satuanID']
    var quantity = req.body.satuan[i]['quantity']
    var disc1 = req.body.satuan[i]['disc1']
    var disc2 = req.body.satuan[i]['disc2']
    var disc3 = req.body.satuan[i]['disc3']
    var harga = req.body.satuan[i]['harga_per_biji']
    var total_disc = disc1 + disc2 + disc3
    var harga_pokok = harga * ((100 - total_disc)/100)

    var querystring = 'SELECT barangID, konversi, konversi_acuan FROM satuanbarang WHERE satuanID = ?'
    var satuanbarang = [satuanID]
    connection.query(querystring, satuanbarang, function(err, result){
        if(err) throw err;
        var barangID = result[0]['barangID']
        var konversi = result[0]['konversi'] * result[0]['konversi_acuan']

        var querystring2 = 'INSERT INTO stok SET barangID = ?, harga_beli = ?, stok_awal = ?, stok_skrg = ?, koreksi = ?'
        var stok = [barangID, harga_pokok/konversi, konversi*quantity, konversi*quantity, 0];
        connection.query(querystring2, stok, function(err2, result2){
            if(err2) throw err2;
            var stokID = result2.insertId;

            var querystring3 = 'INSERT INTO pembelianbarang SET pembelianID = ?, quantity = ?, harga_per_biji = ?, disc_1 = ?, disc_2 = ?, disc_3 = ?, satuanID = ?, stokID = ?'
            var pembelianbarang = [pembelianID, quantity, harga, disc1, disc2, disc3, satuanID, stokID]
            connection.query(querystring3, pembelianbarang, function(err3, result3){
                if(err3) throw err3;
            })
        })
    })
}

router.post('/tambah_pembelian', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_user(req.body.token, function(result){
        if(result['hak_akses'] == null || result['hak_akses'] == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'INSERT INTO pembelian SET supplierID = ?, tanggal_transaksi = ?, jatuh_tempo = ?, subtotal = ?, karyawanID = ?, disc = ?, isPrinted = ?, status = ?';
            var pembelian = [req.body.supplierID, req.body.tanggal_transaksi, req.body.jatuh_tempo, req.body.subtotal, result['karyawanID'], req.body.disc, req.body.isPrinted, req.body.status]
            connection.query(querystring, pembelian, function(err2, result2){
                if(err2) throw err2;
                resp['pembelianID'] = result2.insertId;

                var len = req.body.satuan.length
                for(var i=0; i<len; i++){
                    add_pembelian_barang(req, i, result2.insertId);
                }
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/list_pembelian', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else {
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM pembelian';
            connection.query(querystring, function(err2, result2){
                if(err2) throw err2
                resp['data'] = result2
                res.status(200).send(resp)
            });
        }
    })
})

router.post('/list_hutang_pembelian', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM pembelian WHERE status != "lunas"'
            connection.query(querystring, function(err2, result2){
                if(err2) throw err2
                resp['data'] = result2
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/list_lunas_pembelian', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM pembelian WHERE status = "lunas"'
            connection.query(querystring, function(err2, result2){
                if(err2) throw err2
                resp['data'] = result2
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/list_pembelian_not_printed', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM pembelian WHERE isPrinted = 0'
            connection.query(querystring, function(err2, result2){
                if(err2) throw err2
                resp['data'] = result2
                res.status(200).send(resp)
            })
        }
    })
})

module.exports = router
