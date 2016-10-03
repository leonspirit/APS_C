var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connection = require('../database')
var token_auth = require('../token')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/tambah_penjualan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_user(req.body.token, function(result){
        if(result['hak_akses'] == null || result['hak_akses'] == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'INSERT INTO penjualan SET pelangganID = ?, tanggal_transaksi = ?, jatuh_tempo = ?, subtotal = ?, karyawanID = ?, isPrinted = ?, status = ?, alamat = ?';
            var penjualan = [req.body.pelangganID, req.body.tanggal_transaksi, req.body.jatuh_tempo, req.body.subtotal, result['karyawanID'], 0, "belum lunas", req.body.alamat]
            connection.query(querystring, penjualan, function(err2, result2){
                if(err2) throw err2;
                resp['penjualanID'] = result2.insertId;

                var len = req.body.satuan.length
                for(var i=0; i<len; i++){
                    var querystring2 = 'INSERT INTO penjualanbarang SET penjualanID = ?, satuanID = ?, quantity = ?, disc = ?, harga_pokok_saat_ini = ?'
                    var penjualanbarang = [result2.insertId, req.body.satuan[i]['satuanID'], req.body.satuan[i]['quantity'], req.body.satuan[i]['disc'], 0]
                    connection.query(querystring2, penjualanbarang, function(err3, result3){
                        if(err3) throw err3;
                    })
                }
                res.status(200).send(resp)
            });
        }
    })
});

router.post('/list_penjualan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else {
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM penjualan';
            connection.query(querystring, function(err, result){
                if(err) throw err;
                resp['data'] = result
                res.status(200).send(resp);
            });
        }
    })
});

module.exports = router
