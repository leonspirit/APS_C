var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connection = require('../database')
var token_auth = require('../token')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);
            } else {
                done = true;
                callback();
            }
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}

function add_voucher_pembelian(index, data, callback){

    var returID = data[index]['returpembelianID']
    var qrstring = 'SELECT pembelianbarangID FROM returpembelian WHERE returpembelianID = ?'
    var retur = [returID]
    connection.query(qrstring, retur, function(err, result){
        if(err) throw err

        var pembelianbarangID = result[0]['pembelianbarangID']
        var qrstring2 = 'SELECT pembelianID FROM pembelianbarang WHERE pembelianbarangID = ?'
        var pembelianbarang = [pembelianbarangID]
        connection.query(qrstring2, pembelianbarang, function(err2, result2){
            if(err2) throw err2

            var pembelianID = result2[0]['pembelianID']
            var qrstring3 = 'SELECT tanggal_transaksi FROM pembelian WHERE pembelianID = ?'
            var pembelian = [pembelianID]
            connection.query(qrstring3, pembelian, function(err3, result3){
                if(err3) throw err3

                data[index]['pembelianID'] = pembelianID
                data[index]['tanggal_transaksi'] = result3[0]['tanggal_transaksi']
                callback()
            })
        })
    })
}

function add_voucher_penjualan(index, data, callback){

    var returID = data[index]['returpenjualanID']
    var qrstring = 'SELECT penjualanbarangID FROM returpenjualan WHERE returpenjualanID = ?'
    var retur = [returID]
    connection.query(qrstring, retur, function(err, result){
        if(err) throw err

        var penjualanbarangID = result[0]['penjualanbarangID']
        var qrstring2 = 'SELECT penjualanID FROM penjualanbarang WHERE penjualanbarangID = ?'
        var penjualanbarang = [penjualanbarangID]
        connection.query(qrstring2, penjualanbarang, function(err2, result2){
            if(err2) throw err2

            var penjualanID = result2[0]['penjualanID']
            var qrstring3 = 'SELECT tanggal_transaksi FROM penjualan WHERE penjualanID = ?'
            var penjualan = [penjualanID]
            connection.query(qrstring3, penjualan, function(err3, result3){
                if(err3) throw err3

                data[index]['penjualanID'] = penjualanID
                data[index]['tanggal_transaksi'] = result3[0]['tanggal_transaksi']
                callback()
            })
        })
    })
}

router.post('/list_voucher_supplier_A', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM voucherpembelian WHERE supplierID = ? AND jumlah > 0'
            var vocer = [req.body.supplierID]
            connection.query(querystring, vocer, function(err2, result2){
                if(err2) throw err2

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_voucher_pembelian(loop.iteration(), result2, function(result) {
                        loop.next();
                    })},
                    function(){resp['data'] = result2; res.status(200).send(resp);}
                );
            })
        }
    })
})

router.post('/list_voucher_pelanggan_A', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM voucherpenjualan WHERE pelangganID = ? AND jumlah > 0'
            var vocer = [req.body.pelangganID]
            connection.query(querystring, vocer, function(err2, result2){
                if(err2) throw err2

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_voucher_penjualan(loop.iteration(), result2, function(result) {
                        loop.next();
                    })},
                    function(){resp['data'] = result2; res.status(200).send(resp);}
                );
            })
        }
    })
})

module.exports = router
