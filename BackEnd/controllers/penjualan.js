var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connection = require('../database')
var token_auth = require('../token')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

function asyncStok(sisa_item, func, callback){
    var done = false;
    var loop = {
        next: function(minus_stok) {
            if(done){
                return;
            }

            if(!minus_stok)minus_stok=0;
            sisa_item = sisa_item - minus_stok;

            if(sisa_item > 0){
                func(loop);
            }
            else{
                done = true;
                callback();
            }
        },

        sisa: function(){
            return sisa_item;
        },

        break: function(){
            done = true;
            callback();
        }
    }
    loop.next(0);
    return loop;
}

function update_stok(item, barangID, satuanID, penjualanID, quantity, disc, callback){

    var querystring = 'SELECT stokID, stok_skrg FROM stok WHERE barangID = ? AND stok_skrg > 0 LIMIT 1'
    var stok = [barangID]
    connection.query(querystring, stok, function(err, result){
        if(err) throw err;
        var stokID = result[0]['stokID']
        var stok_skrg = result[0]['stok_skrg']

        var kurang = 0
        if(stok_skrg >= item){
            kurang = item;
        }
        else{
            kurang = stok_skrg;
        }

        var resp = {}
        resp['stok'] = kurang

        var querystring2 = 'UPDATE stok SET stok_skrg = stok_skrg - ? WHERE stokID = ?'
        var stok_jual = [kurang, stokID]
        connection.query(querystring2, stok_jual, function(err2, result2){
            if(err2) throw err2;

            token_auth.get_stok_harga_pokok(barangID, function(result3){
                var harga_pokok_saat_ini = result3['harga_pokok']

                token_auth.get_harga_jual(satuanID, function(result4){
                    var harga_jual_saat_ini = result4['harga_jual']

                    var querystring3 = 'INSERT INTO penjualanbarang SET penjualanID = ?, satuanID = ?, quantity = ?, disc = ?, harga_pokok_saat_ini = ?, harga_jual_saat_ini = ?, stokID = ?'
                    var penjualanbarang = [penjualanID, satuanID, quantity, disc, harga_pokok_saat_ini, harga_jual_saat_ini, stokID]
                    connection.query(querystring3, penjualanbarang, function(err5, result5){
                        if(err5) throw err5
                        return callback(resp)
                    })
                })
            })
        })
    })
}

function add_penjualan_barang(req, i, penjualanID){

    var satuanID = req.body.satuan[i]['satuanID']
    var quantity = req.body.satuan[i]['quantity']
    var disc = req.body.satuan[i]['disc']

    var querystring = 'SELECT barangID, konversi, konversi_acuan FROM satuanbarang WHERE satuanID = ?'
    var satuanbarang = [satuanID]
    connection.query(querystring, satuanbarang, function(err, result){
        if(err) throw err;
        var barangID = result[0]['barangID']
        var konversi = result[0]['konversi'] * result[0]['konversi_acuan']

        asyncStok(quantity*konversi, function(loop){
            update_stok(loop.sisa(), barangID, satuanID, penjualanID, quantity, disc, function(result){
                loop.next(result['stok']);
            })},
            function(){
            }
        )
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
            var pembelian = [req.body.pelangganID, req.body.tanggal_transaksi, req.body.jatuh_tempo, req.body.subtotal, result['karyawanID'], req.body.isPrinted, req.body.status, req.body.alamat]
            connection.query(querystring, pembelian, function(err2, result2){
                if(err2) throw err2;
                resp['penjualanID'] = result2.insertId;

                var len = req.body.satuan.length
                for(var i=0; i<len; i++){
                    add_penjualan_barang(req, i, result2.insertId);
                }
                res.status(200).send(resp)
            })
        }
    })
})

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
                if(err2) throw err2
                resp['data'] = result2
                res.status(200).send(resp)
            });
        }
    })
})

router.post('/list_piutang_penjualan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM penjualan WHERE status != "lunas"'
            connection.query(querystring, function(err2, result2){
                if(err2) throw err2
                resp['data'] = result2
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/list_lunas_penjualan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM penjualan WHERE status = "lunas"'
            connection.query(querystring, function(err2, result2){
                if(err2) throw err2
                resp['data'] = result2
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/list_penjualan_not_printed', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM penjualan WHERE isPrinted = 0'
            connection.query(querystring, function(err2, result2){
                if(err2) throw err2
                resp['data'] = result2
                res.status(200).send(resp)
            })
        }
    })
})

module.exports = router
