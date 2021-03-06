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

function asyncLaba(iterations, func, callback) {
    var index = 0;
    var done = false;
    var total_laba = 0
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
                callback(total_laba);
            }
        },

        tambah: function(laba){
            total_laba = total_laba + laba
            return total_laba
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback(total_laba);
        }
    };
    loop.next();

    return loop;
}

function asyncVoucher(iterations, harga, func, callback) {
    var index = 0;
    var done = false;
    var sisa_harga = harga
    var loop = {
        next: function(minus_harga) {
            if (done) {
                return;
            }
            sisa_harga = sisa_harga - minus_harga
            if (index < iterations) {
                index++;
                func(loop);
            } else {
                done = true;
                callback();
            }
        },

        cek_harga: function(){
            return sisa_harga
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next(0);
    return loop;
}

function update_stok(item, barangID, satuanID, penjualanID, quantity, disc, harga_jual_saat_ini, nama_barang, callback){

    var querystring = 'SELECT stokID, stok_skrg FROM stok WHERE barangID = ? AND stok_skrg > 0 LIMIT 1'
    var stok = [barangID]
    connection.query(querystring, stok, function(err, result){
        if(err) throw err;

        if(result.length > 0){
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
                    var querystring3 = 'INSERT INTO penjualanbarang SET penjualanID = ?, satuanID = ?, quantity = ?, disc = ?, harga_pokok_saat_ini = ?, harga_jual_saat_ini = ?, stokID = ?, nama_barang = ?'
                    var penjualanbarang = [penjualanID, satuanID, quantity, disc, harga_pokok_saat_ini, harga_jual_saat_ini, stokID, nama_barang]
                    connection.query(querystring3, penjualanbarang, function(err5, result5){
                        if(err5) throw err5
                        return callback(resp)
                    })
                })
            })
        }
        else{
            //TODO: GA CUKUP STOKNYA
            var resp = {}
            resp['stok'] = item
            return callback(resp)
        }
    })
}

function add_penjualan_barang(req, i, penjualanID){

    if(req.body.satuan[i]['disc'] == '')req.body.satuan[i]['disc'] = 0

    var satuanID = req.body.satuan[i]['satuanID']
    var quantity = req.body.satuan[i]['quantity']
    var disc = req.body.satuan[i]['disc']
    var harga_jual_saat_ini = req.body.satuan[i]['harga_jual_saat_ini']

    var querystring = 'SELECT barangID, konversi, konversi_acuan FROM satuanbarang WHERE satuanID = ?'
    var satuanbarang = [satuanID]
    connection.query(querystring, satuanbarang, function(err, result){
        if(err) throw err;
        var barangID = result[0]['barangID']
        var konversi = result[0]['konversi'] * result[0]['konversi_acuan']

        if(req.body.satuan[i]['nama_barang'] == ''){

            var querystring2 = 'SELECT nama FROM barang WHERE barangID = ?'
            var barang = [barangID]
            connection.query(querystring2, barang, function(err2, result2){
                if(err2) throw err2
                asyncStok(quantity*konversi, function(loop){
                    update_stok(loop.sisa(), barangID, satuanID, penjualanID, quantity, disc, harga_jual_saat_ini, result2[0]['nama'], function(result){
                        loop.next(result['stok']);
                    })},
                    function(){
                    }
                )
            })
        }
        else{
            asyncStok(quantity*konversi, function(loop){
                update_stok(loop.sisa(), barangID, satuanID, penjualanID, quantity, disc, harga_jual_saat_ini, req.body.satuan[i]['nama_barang'], function(result){
                    loop.next(result['stok']);
                })},
                function(){
                }
            )
        }
    })
}

function voucher_use(index, sisa_harga, penjualanID, tanggal, karyawanID, data, callback){

    var resp = {}
    var voucherID = data[index]['voucherpenjualanID']
    var qrstring1 = 'SELECT jumlah FROM voucherpenjualan WHERE voucherpenjualanID = ?'
    var voucher = [voucherID]
    connection.query(qrstring1, voucher, function(err, result){
        if(err) throw err

        var sisa_voucher = result[0]['jumlah']
        var qrstring2 = 'UPDATE voucherpenjualan SET jumlah = jumlah - ? WHERE voucherpenjualanID = ?'
        var kurang = 0
        if(sisa_voucher >= sisa_harga){
            kurang = sisa_harga
            resp['kurang'] = sisa_harga
        }
        else{
            kurang = sisa_voucher
            resp['kurang'] = sisa_voucher
        }
        var vocer = [kurang, voucherID]
        connection.query(qrstring2, vocer, function(err2, result2){
            if(err2) throw err2

            var qrstring3 = 'INSERT INTO cicilanpenjualan SET penjualanID = ?, tanggal_cicilan = ?, nominal = ?, cara_pembayaran = "voucher", karyawanID = ?, voucherID = ?'
            var cicilan = [penjualanID, tanggal, kurang, karyawanID, voucherID]
            connection.query(qrstring3, cicilan, function(err3, result3){
                if(err3) throw err3
                return callback(resp)
            })
        })
    })
}

function add_nama_karyawan(index, data, callback){

    var karyawanID = data[index]['karyawanID']
    var qrstring = 'SELECT nama FROM karyawan WHERE karyawanID = ?'
    var karyawan = [karyawanID]
    connection.query(qrstring, karyawan, function(err, result){
        if(err) throw err
        data[index]['karyawanNama'] = result[0]['nama']
        callback()
    })
}

function add_harga_pokok_unit(index, data, callback){

    var penjualanbarangID = data[index]['penjualanbarangID']
    var satuanID = data[index]['satuanID']
    var quantity = data[index]['quantity']
    var harga_jual = data[index]['harga_jual_saat_ini']
    var harga_pokok_piece = data[index]['harga_pokok_saat_ini']
    var disc = data[index]['disc']
    harga_jual = harga_jual * (100-disc) / 100

    var qrstring = 'SELECT konversi, konversi_acuan FROM satuanbarang WHERE satuanID = ?'
    var satuan = [satuanID]
    connection.query(qrstring, satuan, function(err, result){
        if(err) throw err

        var qrstring2 = 'SELECT penjualanbarangID, SUM(quantity) as jumlah FROM returpenjualan WHERE penjualanbarangID = ? GROUP BY penjualanbarangID'
        var retur = [penjualanbarangID]
        connection.query(qrstring2, retur, function(err2, result2){
            if(result2.length){
                quantity = quantity - result2[0]['jumlah']
            }

            var konversi_unit = result[0]['konversi'] * result[0]['konversi_acuan']
            var harga_pokok_unit = konversi_unit * harga_pokok_piece

            var resp = {}
            resp['laba'] = (harga_jual - harga_pokok_unit) * quantity
            return callback(resp)
        })
    })
}

function add_laba_penjualan(index, data, callback){

    var penjualanID = data[index]['penjualanID']
    var qrstring = 'SELECT penjualanbarangID, satuanID, quantity, harga_pokok_saat_ini, disc, harga_jual_saat_ini FROM penjualanbarang WHERE penjualanID = ?'
    var penjualan = [penjualanID]
    connection.query(qrstring, penjualan, function(err, result){
        if(err) throw err

        var len = result.length
        asyncLaba(len, function(loop) {
            add_harga_pokok_unit(loop.iteration(), result, function(result2) {
                loop.tambah(result2['laba'])
                loop.next();
            })},
            function(result3){
                data[index]['laba'] = result3
                callback()
            }
        );
    })
}

function add_detail_box(index, data, callback){

    var satuanID = data[index]['satuanID']
    var qrstring1 = 'SELECT barangID, satuan, konversi, konversi_acuan FROM satuanbarang WHERE satuanID = ?'
    var satuan = [satuanID]
    connection.query(qrstring1, satuan, function(err, result){
        if(err) throw err
        data[index]['satuan_unit'] = result[0]['satuan']
        data[index]['konversi_unit'] = result[0]['konversi']
        data[index]['konversi_acuan_unit'] = result[0]['konversi_acuan']

        var qrstring2 = 'SELECT konversi, satuan_acuan FROM satuanbarang WHERE barangID = ? AND satuan = "box"'
        var box = [result[0]['barangID']]
        connection.query(qrstring2, box, function(err2, result2){
            if(err2) throw err2
            data[index]['konversi_box'] = result2[0]['konversi']
            data[index]['satuan_acuan_box'] = result2[0]['satuan_acuan']
            callback()
        })
    })
}

function add_nama_pelanggan(index, data, callback){

    var pelangganID = data[index]['pelangganID']
    var qrstring = 'SELECT nama FROM pelanggan WHERE pelangganID = ?'
    var pelanggan = [pelangganID]
    connection.query(qrstring, pelanggan, function(err, result){
        if(err) throw err
        data[index]['pelangganNama'] = result[0]['nama']
        callback()
    })
}

function add_metode_retur(index, data, callback){

    var returpenjualanID = data[index]['returpenjualanID']
    var qrstring = 'SELECT voucherpenjualanID FROM voucherpenjualan WHERE returpenjualanID = ?'
    var retur = [returpenjualanID]
    connection.query(qrstring, retur, function(err, result){
        if(err) throw err
        if(result.length == 0){
            data[index]['metode'] = 0
        }
        else{
            data[index]['metode'] = 1
        }
        callback()
    })
}

router.post('/tambah_penjualan', function(req,res){

    if(req.body.jatuh_tempo == '')req.body.jatuh_tempo = null
    var resp = {}
    res.type('application/json')
    token_auth.check_user(req.body.token, function(result){
        if(result['hak_akses'] == null || result['hak_akses'] == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'INSERT INTO penjualan SET pelangganID = ?, tanggal_transaksi = ?, jatuh_tempo = ?, subtotal = ?, karyawanID = ?, isPrinted = ?, status = ?, alamat = ?, notes = ?';
            var penjualan = [req.body.pelangganID, req.body.tanggal_transaksi, req.body.jatuh_tempo, req.body.subtotal, result['karyawanID'], req.body.isPrinted, req.body.status, req.body.alamat, req.body.notes]
            connection.query(querystring, penjualan, function(err2, result2){
                if(err2) throw err2;
                resp['penjualanID'] = result2.insertId;

                var len = req.body.satuan.length
                for(var i=0; i<len; i++){
                    add_penjualan_barang(req, i, result2.insertId);
                }

                if(req.body.voucher){
                    var len2 = req.body.voucher.length
                    asyncVoucher(len2, req.body.subtotal, function(loop) {
                        voucher_use(loop.iteration(), loop.cek_harga(), result2.insertId, req.body.tanggal_transaksi, result['karyawanID'], req.body.voucher, function(result) {
                            loop.next(result['kurang']);
                        })},
                        function(){res.status(200).send(resp);}
                    );
                }
                else{
                    res.status(200).send(resp)
                }
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

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_nama_pelanggan(loop.iteration(), result2, function(result) {
                        loop.next();
                    })},
                    function(){resp['data'] = result2; res.status(200).send(resp);}
                );
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
            var querystring = 'SELECT * FROM penjualan WHERE status != "lunas" AND tanggal_transaksi >= ? AND tanggal_transaksi <= ?'
            var penjualan = [req.body.tgl_awal, req.body.tgl_akhir]
            connection.query(querystring, penjualan, function(err2, result2){
                if(err2) throw err2

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_nama_pelanggan(loop.iteration(), result2, function(result) {
                        loop.next();
                    })},
                    function(){
                        asyncLoop(len, function(loop) {
                            add_nama_karyawan(loop.iteration(), result2, function(result) {
                                loop.next();
                            })},
                            function(){
                                resp['data'] = result2
                                resp['data'].sort(function(a,b){
                                    return new Date(a.tanggal_transaksi).getTime() - new Date(b.tanggal_transaksi).getTime()
                                })
                                res.status(200).send(resp)
                            }
                        );
                    }
                );
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
            var querystring = 'SELECT * FROM penjualan WHERE status = "lunas" AND tanggal_transaksi >= ? AND  tanggal_transaksi <= ?'
            var penjualan = [req.body.tgl_awal, req.body.tgl_akhir]
            connection.query(querystring, penjualan, function(err2, result2){
                if(err2) throw err2

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_nama_pelanggan(loop.iteration(), result2, function(result) {
                        loop.next();
                    })},
                    function(){
                        asyncLoop(len, function(loop) {
                            add_nama_karyawan(loop.iteration(), result2, function(result) {
                                loop.next();
                            })},
                            function(){
                                asyncLoop(len, function(loop){
                                    add_laba_penjualan(loop.iteration(), result2, function(result){
                                        loop.next()
                                    })},
                                    function(){
                                        resp['data'] = result2
                                        resp['data'].sort(function(a,b){
                                            return new Date(a.tanggal_transaksi).getTime() - new Date(b.tanggal_transaksi).getTime()
                                        })
                                        res.status(200).send(resp)
                                    }
                                )
                            }
                        );
                    }
                );
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

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_nama_pelanggan(loop.iteration(), result2, function(result) {
                        loop.next();
                    })},
                    function(){resp['data'] = result2; res.status(200).send(resp);}
                );
            })
        }
    })
})

router.post('/detail_penjualan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM penjualan WHERE penjualanID = ?'
            var penjualan = [req.body.penjualanID]
            connection.query(querystring, penjualan, function(err2, result2){
                if(err2)throw err2
                if(result2.length == 0){
                    resp['num_rows'] = 0
                    res.status(200).send(resp)
                }
                else{
                    resp['num_rows'] = 1
                    var len = result2.length
                    asyncLoop(len, function(loop) {
                        add_nama_pelanggan(loop.iteration(), result2, function(result) {
                            loop.next();
                        })},
                        function(){
                            resp['data'] = result2
                            var querystring2 = 'SELECT * FROM penjualanbarang WHERE penjualanID = ?'
                            connection.query(querystring2, penjualan, function(err3, result3){
                                if(err3)throw err3

                                var len2 = result3.length
                                asyncLoop(len2, function(loop){
                                    add_detail_box(loop.iteration(), result3, function(result){
                                        loop.next()
                                    })},
                                    function(){
                                        resp['data'][0]['barang'] = result3

                                        var querystring3 = 'SELECT * FROM cicilanpenjualan WHERE penjualanID = ?'
                                        connection.query(querystring3, penjualan, function(err4, result4){
                                            if(err4) throw err4
                                            resp['data'][0]['cicilan'] = result4

                                            var querystring4 = 'SELECT penjualanbarangID FROM penjualanbarang WHERE penjualanID = ?'
                                            var querystring5 = 'SELECT * FROM returpenjualan WHERE penjualanbarangID IN ('+querystring4+')'
                                            connection.query(querystring5, penjualan, function(err5, result5){
                                                if(err5) throw err5

                                                var len = result5.length
                                                asyncLoop(len, function(loop) {
                                                    add_metode_retur(loop.iteration(), result5, function(result) {
                                                        loop.next();
                                                    })},
                                                    function(){
                                                        resp['data'][0]['retur'] = result5
                                                        res.status(200).send(resp)
                                                    }
                                                );
                                            })
                                        })
                                    }
                                )
                            })
                        }
                    );
                }
            })
        }
    })
})

router.post('/tambah_cicilan_penjualan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_user(req.body.token, function(result){
        if(result['hak_akses'] == null || result['hak_akses'] == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'

            if(req.body.tanggal_pencairan == '')req.body.tanggal_pencairan = null
            var querystring = 'INSERT INTO cicilanpenjualan SET penjualanID = ?, tanggal_cicilan = ?, nominal = ?, notes = ?, cara_pembayaran = ?, bank = ?, nomor_giro = ?, tanggal_pencairan = ?, karyawanID = ?'
            var cicilanpenjualan = [req.body.penjualanID, req.body.tanggal_cicilan, req.body.nominal, req.body.notes, req.body.cara_pembayaran, req.body.bank, req.body.nomor_giro, req.body.tanggal_pencairan, result['karyawanID']]
            connection.query(querystring, cicilanpenjualan, function(err2, result2){
                if(err2) throw err2;
                resp['cicilanpenjualanID'] = result2.insertId;

                token_auth.update_status_penjualan(req.body.penjualanID, function(result){
                    res.status(200).send(resp)
                })
            })
        }
    })
})

router.post('/list_penjualan_jatuh_tempo', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'

            var today = new Date()
            var last_n_day = new Date()
            last_n_day.setDate(last_n_day.getDate() + parseInt(req.body.n))

            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}today = yyyy+'-'+mm+'-'+dd

            dd = last_n_day.getDate()
            mm = last_n_day.getMonth()+1
            yyyy = last_n_day.getFullYear()
            if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}last_n_day = yyyy+'-'+mm+'-'+dd

            var querystring = 'SELECT * FROM penjualan WHERE jatuh_tempo <= ? AND status!="lunas"'
            var penjualan = [last_n_day]
            connection.query(querystring, penjualan, function(err2, result2){
                if(err2) throw err2
                resp['data'] = result2

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_nama_pelanggan(loop.iteration(), result2, function(result) {
                        loop.next();
                    })},
                    function(){
                        asyncLoop(len, function(loop) {
                            add_nama_karyawan(loop.iteration(), result2, function(result) {
                                loop.next();
                            })},
                            function(){
                                resp['data'] = result2
                                resp['data'].sort(function(a,b){
                                    return new Date(a.jatuh_tempo).getTime() - new Date(b.jatuh_tempo).getTime()
                                })
                                res.status(200).send(resp)
                            }
                        );
                    }
                );
            })
        }
    })
})

router.post('/list_penjualan_barang_A', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring1 = 'SELECT satuanID FROM satuanbarang WHERE barangID = ?'
            var querystring2 = 'SELECT penjualanID, SUM(quantity*harga_jual_saat_ini*(100-disc)/100) as subtotal FROM penjualanbarang WHERE satuanID IN ('+querystring1+') GROUP BY penjualanID'
            var querystring3 = 'SELECT p.penjualanID, pelangganID, tanggal_transaksi, jatuh_tempo, karyawanID, isPrinted, status, alamat, notes, t.subtotal as subtotal FROM penjualan as p, ('+querystring2+') as t WHERE p.penjualanID = t.penjualanID AND tanggal_transaksi >= ? AND tanggal_transaksi <= ?'
            var penjualanbarang = [req.body.barangID, req.body.tgl_awal, req.body.tgl_akhir]
            connection.query(querystring3, penjualanbarang, function(err2, result2){
                if(err2) throw err2

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_nama_pelanggan(loop.iteration(), result2, function(result) {
                        loop.next();
                    })},
                    function(){
                        asyncLoop(len, function(loop) {
                            add_nama_karyawan(loop.iteration(), result2, function(result) {
                                loop.next();
                            })},
                            function(){
                                asyncLoop(len, function(loop){
                                    add_laba_penjualan(loop.iteration(), result2, function(result){
                                        loop.next()
                                    })},
                                    function(){
                                        resp['data'] = result2
                                        resp['data'].sort(function(a,b){
                                            return new Date(a.tanggal_transaksi).getTime() - new Date(b.tanggal_transaksi).getTime()
                                        })
                                        res.status(200).send(resp)
                                    }
                                )
                            }
                        );
                    }
                );
            })
        }
    })
})

router.post('/change_printed_status', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'UPDATE penjualan SET isPrinted = 1 - isPrinted WHERE penjualanID = ?'
            var penjualan = [req.body.penjualanID]
            connection.query(querystring, penjualan, function(err2, result2){
                if(err2) throw err2
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/edit_penjualanbarang', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'

            var querystring1 = 'SELECT penjualanID, quantity, disc, harga_jual_saat_ini FROM penjualanbarang WHERE penjualanbarangID = ?'
            var penjualan1 = [req.body.penjualanbarangID]
            connection.query(querystring1, penjualan1, function(err2, result2){
                if(err2) throw err2

                var price_awal = result2[0]['quantity'] * result2[0]['harga_jual_saat_ini']
                price_awal = price_awal * (100-result2[0]['disc']) / 100

                var curr_price = result2[0]['quantity'] * req.body.harga_jual_saat_ini
                curr_price = curr_price * (100-req.body.disc) / 100

                var querystring2 = 'UPDATE penjualanbarang SET nama_barang = ?, harga_jual_saat_ini = ?, disc = ? WHERE penjualanbarangID = ?'
                var penjualanbarang = [req.body.nama_barang, req.body.harga_jual_saat_ini, req.body.disc, req.body.penjualanbarangID]
                connection.query(querystring2, penjualanbarang, function(err3, result3){
                    if(err3) throw err3
                    resp['affectedRows'] = result3.affectedRows

                    var querystring3 = 'UPDATE penjualan SET subtotal = subtotal - ? WHERE penjualanID = ?'
                    var penjualan = [price_awal-curr_price, result2[0]['penjualanID']]
                    connection.query(querystring3, penjualan, function(err4, result4){
                        if(err4) throw err4
                        token_auth.update_status_penjualan(result2[0]['penjualanID'], function(result){
                            res.status(200).send(resp)
                        })
                    })
                })
            })
        }
    })
})

router.post('/edit_penjualan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] ='failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            if(req.body.jatuh_tempo == '')req.body.jatuh_tempo = null
            var querystring = 'UPDATE penjualan SET tanggal_transaksi = ?, jatuh_tempo = ?, notes = ?, alamat = ? WHERE penjualanID = ?'
            var penjualan = [req.body.tanggal_transaksi, req.body.jatuh_tempo, req.body.notes, req.body.alamat, req.body.penjualanID]
            connection.query(querystring, penjualan, function(err2, result2){
                if(err2) throw err2
                resp['affectedRows'] = result2.affectedRows
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/batal_pembayaran', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'

            var querystring = 'DELETE FROM cicilanpenjualan WHERE cicilanpenjualanID = ?'
            var cicilan = [req.body.cicilanpenjualanID]

            connection.query(querystring, cicilan, function(err2, result2){
                if(err2) throw err2;
                res.status(200).send(resp)
            })
        }
    })
})

module.exports = router
