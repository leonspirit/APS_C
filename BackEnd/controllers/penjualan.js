var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connection = require('../database')
var token_auth = require('../token')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

function add_penjualan_barang(req, i, penjualanID){

    var satuanID = req.body.satuan[i]['satuanID']
    var quantity = req.body.satuan[i]['quantity']
    var disc = req.body.satuan[i]['disc']

    //Cari harga jual saat ini berdasarkan satuanID
    var querystring3 = 'SELECT barangID, harga_jual FROM satuanbarang WHERE satuanID = ?'
    var satuanbarang = [satuanID]
    connection.query(querystring3, satuanbarang, function(err4, result4){
        if(err4) throw err4;

        //Cari harga pokok saat ini berdasarkan barangID
        var querystring4 = 'SELECT harga_pokok FROM barang WHERE barangID = ?'
        var barang = [result4[0]['barangID']]
        connection.query(querystring4, barang, function(err5, result5){
            if(err5) throw err5;
            var querystring2 = 'INSERT INTO penjualanbarang SET penjualanID = ?, satuanID = ?, quantity = ?, disc = ?, harga_pokok_saat_ini = ?, harga_jual_saat_ini = ?'
            var penjualanbarang = [penjualanID, satuanID, quantity, disc, result5[0]['harga_pokok'], result4[0]['harga_jual']]
            connection.query(querystring2, penjualanbarang, function(err3, result3){
                if(err3) throw err3;
            })
        })
    })
}

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
                    add_penjualan_barang(req, i, result2.insertId)
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
            connection.query(querystring, function(err2, result2){
                if(err) throw err;
                resp['data'] = result
                res.status(200).send(resp);
            });
        }
    })
});

router.post('/list_penjualan_barang', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM penjualanbarang WHERE penjualanID = ?'
            var penjualanbarang = [req.body.penjualanID]
            connection.query(querystring, function(err2, result2){
                if(err) throw err
                resp['data'] = result
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/update_print', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'UPDATE penjualan SET isPrinted = ? WHERE penjualanID = ?'
            var penjualan = [req.body.isPrinted, req.body.penjualanID]
            connection.query(querystring, function(err2, result2){
                if(err) throw err
                resp['affectedRows'] = result2.affectedRows
                res.status(200).send(resp)
            })
        }
    })
})

module.exports = router
