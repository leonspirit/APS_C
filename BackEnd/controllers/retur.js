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

function add_harga_stok(index, res_query, data, callback){

    var stok = res_query[index]['stok_skrg']
    var harga = res_query[index]['harga_beli']

    if(data['stok']){
        data['stok'] = data['stok'] + stok
    }
    else{
        data['stok'] = stok
    }

    if(data['harga_pokok']){
        data['harga_pokok'] = data['harga_pokok'] + (harga * stok)
    }
    else{
        data['harga_pokok'] = harga * stok
    }
    callback()
}

function get_stok_harga_barang(index, data, callback){

    var barangID = data[index]['barangID']

    var qrstring = 'SELECT harga_beli, stok_skrg FROM stok WHERE barangID = ?'
    var barang = [barangID]
    connection.query(qrstring, barang, function(err, result){
        if(err) throw err

        var len = result.length
        asyncLoop(len, function(loop) {
            add_harga_stok(loop.iteration(), result, data[index], function(result) {
                loop.next();
            })},
            function(){
                if(data[index]['stok']){
                    data[index]['harga_pokok'] = data[index]['harga_pokok'] / data[index]['stok']
                }
                else{
                    data[index]['stok'] = 0
                }

                if(!data[index]['harga_pokok']){
                    data[index]['harga_pokok'] = 0
                }
                data[index]['harga_pokok'] = data[index]['harga_pokok']
                //data[index]['harga_pokok'] = Math.round(data[index]['harga_pokok'])
                callback()
            }
        );
    })
}

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
            var querystring = 'INSERT INTO returpenjualan SET penjualanbarangID = ?, tanggal = ?, quantity = ?, karyawanID = ?, metode = ?'
            var retur = [req.body.penjualanbarangID, req.body.tanggal, req.body.quantity, result['karyawanID'], req.body.metode]
            connection.query(querystring, retur, function(err2, result2){
                if(err2) throw err2
                resp['returpenjualanID'] = result2.insertId

                var querystring5 = 'SELECT penjualanID, stokID, satuanID, harga_pokok_saat_ini, disc FROM penjualanbarang WHERE penjualanbarangID = ?'
                var penjualan = [req.body.penjualanbarangID]
                connection.query(querystring5, penjualan, function(err4, result4){
                    if(err4) throw err4
                    var penjualanID = result4[0]['penjualanID']
                    var harga_pokok_lalu = result4[0]['harga_pokok_saat_ini'] * (100-result4[0]['disc']) / 100

                    var querystring10 = 'SELECT barangID, konversi, konversi_acuan FROM satuanbarang WHERE satuanID = ?'
                    var satuan = [result4[0]['satuanID']]
                    connection.query(querystring10, satuan, function(err7, result7){
                        if(err7) throw err7

                        var barangID = result7[0]['barangID']
                        var konversi = result7[0]['konversi'] * result7[0]['konversi_acuan']

                        var querystring12 = 'SELECT stok_skrg, harga_beli FROM stok WHERE stokID = ?'
                        var sisa_stok = [result4[0]['stokID']]
                        connection.query(querystring12, sisa_stok, function(err10, result10){
                            if(err10) throw err10

                            var last_stok = result10[0]['stok_skrg'] * result10[0]['harga_beli']
                            last_stok = last_stok + (harga_pokok_lalu * req.body.quantity * konversi)
                            last_stok = last_stok / (result10[0]['stok_skrg'] + (req.body.quantity*konversi))

                            var querystring11 = 'UPDATE stok SET stok_skrg = stok_skrg + ?, harga_beli = ? WHERE stokID = ?'
                            var stok = [konversi*req.body.quantity, last_stok, result4[0]['stokID']]
                            connection.query(querystring11, stok, function(err8, result8){
                                if(err8) throw err8

                                var len = 1
                                asyncLoop(len, function(loop) {
                                    get_stok_harga_barang(loop.iteration(), result7, function(result11) {
                                        loop.next();
                                    })},
                                    function(){
                                        var qrstring1 = 'UPDATE stok SET harga_beli = ? WHERE barangID = ?'
                                        var harga_stok = [result7[0]['harga_pokok'], barangID]
                                        connection.query(qrstring1, harga_stok, function(err4, result4){
                                            if(err4) throw err4

                                            if(req.body.metode == 0){
                                                res.status(200).send(resp)
                                            }
                                            else if(req.body.metode == 1){
                                                var querystring2 = 'SELECT penjualanID, harga_jual_saat_ini*(100-disc)/100 as harga FROM penjualanbarang WHERE penjualanbarangID = ?'
                                                var querystring3 = 'SELECT p.pelangganID as pelangganID, t.harga as harga FROM penjualan as p, ('+querystring2+') as t WHERE p.penjualanID = t.penjualanID'
                                                var voucherpenjualan = [req.body.penjualanbarangID]
                                                connection.query(querystring3, voucherpenjualan, function(err3, result3){
                                                    if(err3) throw err3
                                                    var harga_total = result3[0]['harga'] * req.body.quantity

                                                    var querystring6 = 'SELECT penjualanbarangID FROM penjualanbarang WHERE penjualanID = ?'
                                                    var querystring7 = 'SELECT returpenjualanID FROM returpenjualan WHERE penjualanbarangID IN ('+querystring6+')'
                                                    var querystring8 = 'SELECT voucherpenjualanID FROM voucherpenjualan WHERE returpenjualanID IN ('+querystring7+')'
                                                    var voucher = [penjualanID]
                                                    connection.query(querystring8, voucher, function(err5, result5){
                                                        if(err5) throw err5

                                                        if(result5.length == 0){
                                                            var querystring9 = 'INSERT INTO voucherpenjualan SET pelangganID = ?, jumlah = ?, jumlah_awal = ?, returpenjualanID = ?'
                                                            var vocer = [result3[0]['pelangganID'], harga_total, harga_total, result2.insertId]
                                                            connection.query(querystring9, vocer, function(err6, result6){
                                                                if(err6) throw err6
                                                                res.status(200).send(resp)
                                                            })
                                                        }
                                                        else{
                                                            var voucherpenjualanID = result5[0]['voucherpenjualanID']
                                                            var querystring9 = 'UPDATE voucherpenjualan SET jumlah_awal = jumlah_awal + ?, jumlah = jumlah + ? WHERE voucherpenjualanID = ?'
                                                            var vocer = [harga_total, harga_total, voucherpenjualanID]
                                                            connection.query(querystring9, vocer, function(err6, result6){
                                                                if(err6) throw err6
                                                                res.status(200).send(resp)
                                                            })
                                                        }
                                                    })
                                                })
                                            }
                                            else{
                                                var querystring2 = 'SELECT penjualanID, harga_jual_saat_ini*(100-disc)/100 as harga FROM penjualanbarang WHERE penjualanbarangID = ?'
                                                var cicilanpenjualan = [req.body.penjualanbarangID]
                                                connection.query(querystring2, cicilanpenjualan, function(err3, result3){
                                                    if(err3) throw err3
                                                    var nominal = result3[0]['harga'] * req.body.quantity

                                                    var querystring3 = 'INSERT INTO cicilanpenjualan SET penjualanID = ?, tanggal_cicilan = ?, nominal = ?, cara_pembayaran = "retur", karyawanID = ?'
                                                    var cicilan = [result3[0]['penjualanID'], req.body.tanggal, nominal, result['karyawanID']]
                                                    connection.query(querystring3, cicilan, function(err5, result5){
                                                        if(err5) throw err5
                                                        res.status(200).send(resp)
                                                    })
                                                })
                                            }
                                        })
                                    }
                                );
                            })
                        })
                    })
                })
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
            var querystring = 'INSERT INTO returpembelian SET pembelianbarangID = ?, tanggal = ?, quantity = ?, karyawanID = ?, metode = ?'
            var retur = [req.body.pembelianbarangID, req.body.tanggal, req.body.quantity, result['karyawanID'], req.body.metode]
            connection.query(querystring, retur, function(err2, result2){
                if(err2) throw err2
                resp['returpembelianID'] = result2.insertId

                var querystring5 = 'SELECT pembelianID, stokID, satuanID FROM pembelianbarang WHERE pembelianbarangID = ?'
                var pembelian = [req.body.pembelianbarangID]
                connection.query(querystring5, pembelian, function(err4, result4){
                    if(err4) throw err4
                    var pembelianID = result4[0]['pembelianID']

                    var querystring10 = 'SELECT konversi, konversi_acuan FROM satuanbarang WHERE satuanID = ?'
                    var satuan = [result4[0]['satuanID']]
                    connection.query(querystring10, satuan, function(err7, result7){
                        if(err7) throw err7

                        var konversi = result7[0]['konversi'] * result7[0]['konversi_acuan']
                        var querystring11 = 'UPDATE stok SET stok_skrg = stok_skrg - ? WHERE stokID = ?'
                        var stok = [konversi*req.body.quantity, result4[0]['stokID']]
                        connection.query(querystring11, stok, function(err8, result8){
                            if(err8) throw err8
                            if(req.body.metode == 0){
                                res.status(200).send(resp)
                            }
                            else if (req.body.metode == 1){
                                var querystring2 = 'SELECT pembelianID, harga_per_biji*(100 - (disc_1) - ((100-disc_1)/100*disc_2) - ((100 - (disc_1) - ((100-disc_1)/100*disc_2))/100*disc_3) )/100 as harga FROM pembelianbarang WHERE pembelianbarangID = ?'
                                var querystring3 = 'SELECT p.supplierID as supplierID, p.disc as diskon, t.harga as harga FROM pembelian as p, ('+querystring2+') as t WHERE p.pembelianID = t.pembelianID'
                                var voucherpembelian = [req.body.pembelianbarangID]
                                connection.query(querystring3, voucherpembelian, function(err3, result3){
                                    if(err3) throw err3
                                    var harga_total = result3[0]['harga'] * req.body.quantity
                                    var diskon = result3[0]['diskon']
                                    harga_total = harga_total * (100-diskon) / 100

                                    var querystring6 = 'SELECT pembelianbarangID FROM pembelianbarang WHERE pembelianID = ?'
                                    var querystring7 = 'SELECT returpembelianID FROM returpembelian WHERE pembelianbarangID IN ('+querystring6+')'
                                    var querystring8 = 'SELECT voucherpembelianID FROM voucherpembelian WHERE returpembelianID IN ('+querystring7+')'
                                    var voucher = [pembelianID]
                                    connection.query(querystring8, voucher, function(err5, result5){
                                        if(err5) throw err5

                                        if(result5.length == 0){
                                            var querystring9 = 'INSERT INTO voucherpembelian SET supplierID = ?, jumlah = ?, jumlah_awal = ?, returpembelianID = ?'
                                            var vocer = [result3[0]['supplierID'], harga_total, harga_total, result2.insertId]
                                            connection.query(querystring9, vocer, function(err6, result6){
                                                if(err6) throw err6
                                                res.status(200).send(resp)
                                            })
                                        }
                                        else{
                                            var voucherpembelianID = result5[0]['voucherpembelianID']
                                            var querystring9 = 'UPDATE voucherpembelian SET jumlah_awal = jumlah_awal + ?, jumlah = jumlah + ? WHERE voucherpembelianID = ?'
                                            var vocer = [harga_total, harga_total, voucherpembelianID]
                                            connection.query(querystring9, vocer, function(err6, result6){
                                                if(err6) throw err6
                                                res.status(200).send(resp)
                                            })
                                        }
                                    })
                                })
                            }
                            else{
                                var querystring2 = 'SELECT pembelianID, harga_per_biji*(100 - (disc_1) - ((100-disc_1)/100*disc_2) - ((100 - (disc_1) - ((100-disc_1)/100*disc_2))/100*disc_3) )/100 as harga FROM pembelianbarang WHERE pembelianbarangID = ?'
                                var cicilanpembelian = [req.body.pembelianbarangID]
                                connection.query(querystring2, cicilanpembelian, function(err3, result3){
                                    if(err3) throw err3
                                    var nominal = result3[0]['harga'] * req.body.quantity

                                    var querystring12 = 'SELECT disc FROM pembelian WHERE pembelianID = ?'
                                    var pemb = [result3[0]['pembelianID']]
                                    connection.query(querystring12, pemb, function(err12, result12){
                                        if(err12) throw err12

                                        var diskon = result12[0]['disc']
                                        nominal = nominal * (100-diskon) / 100

                                        var querystring3 = 'INSERT INTO cicilanpembelian SET pembelianID = ?, tanggal_cicilan = ?, nominal = ?, cara_pembayaran = "retur", karyawanID = ?'
                                        var cicilan = [result3[0]['pembelianID'], req.body.tanggal, nominal, result['karyawanID']]
                                        connection.query(querystring3, cicilan, function(err5, result5){
                                            if(err5) throw err5
                                            res.status(200).send(resp)
                                        })
                                    })
                                })
                            }
                        })
                    })
                })
            })
        }
    })
})

module.exports = router
