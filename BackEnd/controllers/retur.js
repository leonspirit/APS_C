var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connection = require('../database')
var token_auth = require('../token')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/tambah_retur_penjualan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_user(req.body.token, function(result){
        if(result['hak_akses'] == null || result['hak_akses'] == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'INSERT INTO returpenjualan SET penjualanbarangID = ?, tanggal = ?, quantity = ?, karyawanID = ?'
            var retur = [req.body.penjualanbarangID, req.body.tanggal, req.body.quantity, result['karyawanID']]
            connection.query(querystring, retur, function(err2, result2){
                if(err2) throw err2
                resp['returpenjualanID'] = result2.insertId

                if(req.body.metode == 0){
                    res.status(200).send(resp)
                }
                else{
                    var querystring2 = 'SELECT penjualanID, harga_jual_saat_ini*(100-disc)/100 as harga FROM penjualanbarang WHERE penjualanbarangID = ?'
                    var querystring3 = 'SELECT p.pelangganID as pelangganID, t.harga as harga FROM penjualan as p, ('+querystring2+') as t WHERE p.penjualanID = t.penjualanID'
                    var voucherpenjualan = [req.body.penjualanbarangID]
                    connection.query(querystring3, voucherpenjualan, function(err3, result3){
                        if(err3) throw err3
                        var harga_total = result3[0]['harga'] * req.body.quantity
                        var querystring4 = 'INSERT INTO voucherpenjualan SET pelangganID = ?, jumlah = ?, jumlah_awal = ?, returpenjualanID = ?'
                        var vocer = [result3[0]['pelangganID'], harga_total, harga_total, result2.insertId]
                        connection.query(querystring4, vocer, function(err4, result4){
                            if(err4) throw err4
                            res.status(200).send(resp)
                        })
                    })
                }
            })
        }
    })
})

router.post('/tambah_retur_pembelian', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_user(req.body.token, function(result){
        if(result['hak_akses'] == null || result['hak_akses'] == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'INSERT INTO returpembelian SET pembelianbarangID = ?, tanggal = ?, quantity = ?, karyawanID = ?'
            var retur = [req.body.pembelianbarangID, req.body.tanggal, req.body.quantity, result['karyawanID']]
            connection.query(querystring, retur, function(err2, result2){
                if(err2) throw err2
                resp['returpembelianID'] = result2.insertId

                if(req.body.metode == 0){
                    res.status(200).send(resp)
                }
                else{
                    var querystring2 = 'SELECT pembelianID, harga_per_biji*(100-disc_1-disc_2-disc_3)/100 as harga FROM pembelianbarang WHERE pembelianbarangID = ?'
                    var querystring3 = 'SELECT p.supplierID as supplierID, t.harga as harga FROM pembelian as p, ('+querystring2+') as t WHERE p.pembelianID = t.pembelianID'
                    var voucherpembelian = [req.body.pembelianbarangID]
                    connection.query(querystring3, voucherpembelian, function(err3, result3){
                        if(err3) throw err3
                        var harga_total = result3[0]['harga'] * req.body.quantity
                        var querystring4 = 'INSERT INTO voucherpembelian SET supplierID = ?, jumlah = ?, jumlah_awal = ?, returpembelianID = ?'
                        var vocer = [result3[0]['supplierID'], harga_total, harga_total, result2.insertId]
                        connection.query(querystring4, vocer, function(err4, result4){
                            if(err4) throw err4
                            res.status(200).send(resp)
                        })
                    })
                }
            })
        }
    })
})

module.exports = router
