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

function add_nama_supplier(index, data, callback){

    var supplierID = data[index]['supplierID']
    var qrstring = 'SELECT nama FROM supplier WHERE supplierID = ?'
    var supplier = [supplierID]
    connection.query(qrstring, supplier, function(err, result){
        if(err) throw err
        data[index]['supplierNama'] = result[0]['nama']
        callback()
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

            var qrstring3 = 'SELECT nama FROM barang WHERE barangID = ?'
            var barang = [result[0]['barangID']]
            connection.query(qrstring3, barang, function(err3, result3){
                if(err3) throw err3
                data[index]['nama_barang'] = result3[0]['nama']
                callback()
            })
        })
    })
}

function add_metode_retur(index, data, callback){

    var returpembelianID = data[index]['returpembelianID']
    var qrstring = 'SELECT voucherpembelianID FROM voucherpembelian WHERE returpembelianID = ?'
    var retur = [returpembelianID]
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

function add_pembelian_barang(req, i, pembelianID){

    var satuanID = req.body.satuan[i]['satuanID']
    var quantity = req.body.satuan[i]['quantity']

    if(req.body.satuan[i]['disc1'] == '')req.body.satuan[i]['disc1'] = 0
    if(req.body.satuan[i]['disc2'] == '')req.body.satuan[i]['disc2'] = 0
    if(req.body.satuan[i]['disc3'] == '')req.body.satuan[i]['disc3'] = 0

    var disc1 = parseFloat(req.body.satuan[i]['disc1'])
    var disc2 = parseFloat(req.body.satuan[i]['disc2']) * (100-disc1)/100
    var disc3 = parseFloat(req.body.satuan[i]['disc3']) * (100-disc1-disc2)/100

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
            var pembelianbarang = [pembelianID, quantity, harga, parseFloat(req.body.satuan[i]['disc1']), parseFloat(req.body.satuan[i]['disc2']), parseFloat(req.body.satuan[i]['disc3']), satuanID, stokID]
            connection.query(querystring3, pembelianbarang, function(err3, result3){
                if(err3) throw err3;

                var len = 1
                asyncLoop(len, function(loop) {
                    get_stok_harga_barang(loop.iteration(), result, function(result5) {
                        loop.next();
                    })},
                    function(){

                        var qrstring1 = 'UPDATE stok SET harga_beli = ? WHERE barangID = ?'
                        var harga_stok = [result[0]['harga_pokok'], barangID]
                        connection.query(qrstring1, harga_stok, function(err4, result4){
                            if(err4) throw err4
                        })
                    }
                );
            })
        })
    })
}

function voucher_use(index, sisa_harga, pembelianID, tanggal, karyawanID, data, callback){

    var resp = {}
    var voucherID = data[index]['voucherpembelianID']
    var qrstring1 = 'SELECT jumlah FROM voucherpembelian WHERE voucherpembelianID = ?'
    var voucher = [voucherID]
    connection.query(qrstring1, voucher, function(err, result){
        if(err) throw err

        var sisa_voucher = result[0]['jumlah']
        var qrstring2 = 'UPDATE voucherpembelian SET jumlah = jumlah - ? WHERE voucherpembelianID = ?'
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

            var qrstring3 = 'INSERT INTO cicilanpembelian SET pembelianID = ?, tanggal_cicilan = ?, nominal = ?, cara_pembayaran = "voucher", karyawanID = ?, voucherID = ?'
            var cicilan = [pembelianID, tanggal, kurang, karyawanID, voucherID]
            connection.query(qrstring3, cicilan, function(err3, result3){
                if(err3) throw err3
                return callback(resp)
            })
        })
    })
}

router.post('/tambah_pembelian', function(req,res){

    if(req.body.jatuh_tempo == '')req.body.jatuh_tempo = null
    if(req.body.disc == '')req.body.disc = 0
    var resp = {}
    res.type('application/json')
    token_auth.check_user(req.body.token, function(result){
        if(result['hak_akses'] == null || result['hak_akses'] == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'INSERT INTO pembelian SET supplierID = ?, tanggal_transaksi = ?, jatuh_tempo = ?, subtotal = ?, karyawanID = ?, disc = ?, isPrinted = ?, status = ?, notes = ?';
            var pembelian = [req.body.supplierID, req.body.tanggal_transaksi, req.body.jatuh_tempo, req.body.subtotal, result['karyawanID'], req.body.disc, req.body.isPrinted, req.body.status, req.body.notes]
            connection.query(querystring, pembelian, function(err2, result2){
                if(err2) throw err2;
                resp['pembelianID'] = result2.insertId;

                var len = req.body.satuan.length
                for(var i=0; i<len; i++){
                    add_pembelian_barang(req, i, result2.insertId);
                }

                if(req.body.voucher){
                    var len2 = req.body.voucher.length
                    asyncVoucher(len2, req.body.subtotal*(100-req.body.disc)/100, function(loop) {
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

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_nama_supplier(loop.iteration(), result2, function(result) {
                        loop.next();
                    })},
                    function(){resp['data'] = result2; res.status(200).send(resp);}
                );
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
            var querystring = 'SELECT * FROM pembelian WHERE status != "lunas" AND tanggal_transaksi >= ? AND tanggal_transaksi <= ?'
            var pembelian = [req.body.tgl_awal, req.body.tgl_akhir]
            connection.query(querystring, pembelian, function(err2, result2){
                if(err2) throw err2

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_nama_supplier(loop.iteration(), result2, function(result) {
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
            var querystring = 'SELECT * FROM pembelian WHERE status = "lunas" AND tanggal_transaksi >= ? AND tanggal_transaksi <= ?'
            var pembelian = [req.body.tgl_awal, req.body.tgl_akhir]
            connection.query(querystring, pembelian, function(err2, result2){
                if(err2) throw err2

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_nama_supplier(loop.iteration(), result2, function(result) {
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

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_nama_supplier(loop.iteration(), result2, function(result) {
                        loop.next();
                    })},
                    function(){resp['data'] = result2; res.status(200).send(resp);}
                );
            })
        }
    })
})

router.post('/detail_pembelian', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM pembelian WHERE pembelianID = ?'
            var pembelian = [req.body.pembelianID]
            connection.query(querystring, pembelian, function(err2, result2){
                if(err2)throw err2
                if(result2.length == 0){
                    resp['num_rows'] = 0
                    res.status(200).send(resp)
                }
                else{
                    resp['num_rows'] = 1
                    var len = result2.length
                    asyncLoop(len, function(loop) {
                        add_nama_supplier(loop.iteration(), result2, function(result) {
                            loop.next();
                        })},
                        function(){
                            resp['data'] = result2
                            var querystring2 = 'SELECT * FROM pembelianbarang WHERE pembelianID = ?'
                            connection.query(querystring2, pembelian, function(err3, result3){
                                if(err3)throw err3

                                var len2 = result3.length
                                asyncLoop(len2, function(loop){
                                    add_detail_box(loop.iteration(), result3, function(result){
                                        loop.next()
                                    })},
                                    function(){
                                        resp['data'][0]['barang'] = result3

                                        var querystring3 = 'SELECT * FROM cicilanpembelian WHERE pembelianID = ?'
                                        connection.query(querystring3, pembelian, function(err4, result4){
                                            if(err4) throw err4
                                            resp['data'][0]['cicilan'] = result4

                                            var querystring4 = 'SELECT pembelianbarangID FROM pembelianbarang WHERE pembelianID = ?'
                                            var querystring5 = 'SELECT * FROM returpembelian WHERE pembelianbarangID IN ('+querystring4+')'
                                            connection.query(querystring5, pembelian, function(err5, result5){
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

router.post('/tambah_cicilan_pembelian', function(req,res){

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
            var querystring = 'INSERT INTO cicilanpembelian SET pembelianID = ?, tanggal_cicilan = ?, nominal = ?, notes = ?, cara_pembayaran = ?, bank = ?, nomor_giro = ?, tanggal_pencairan = ?, karyawanID = ?'
            var cicilanpembelian = [req.body.pembelianID, req.body.tanggal_cicilan, req.body.nominal, req.body.notes, req.body.cara_pembayaran, req.body.bank, req.body.nomor_giro, req.body.tanggal_pencairan, result['karyawanID']]
            connection.query(querystring, cicilanpembelian, function(err2, result2){
                if(err2) throw err2;
                resp['cicilanpembelianID'] = result2.insertId;

                token_auth.update_status_pembelian(req.body.pembelianID, function(result){
                    res.status(200).send(resp)
                })
            })
        }
    })
})

router.post('/list_pembelian_jatuh_tempo', function(req,res){

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

            var querystring = 'SELECT * FROM pembelian WHERE jatuh_tempo <= ? AND status!="lunas"'
            var pembelian = [last_n_day]
            connection.query(querystring, pembelian, function(err2, result2){
                if(err2) throw err2

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_nama_supplier(loop.iteration(), result2, function(result) {
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

router.post('/list_pembelian_barang_A', function(req,res){

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
            var querystring2 = 'SELECT pembelianID, SUM(quantity*harga_per_biji*(100 - (disc_1) - ((100-disc_1)/100*disc_2) - ((100 - (disc_1) - ((100-disc_1)/100*disc_2))/100*disc_3) )/100) as subtotal FROM pembelianbarang WHERE satuanID IN ('+querystring1+') GROUP BY pembelianID'
            var querystring3 = 'SELECT p.pembelianID, supplierID, tanggal_transaksi, jatuh_tempo, karyawanID, isPrinted, status, notes, t.subtotal as subtotal FROM pembelian as p, ('+querystring2+') as t WHERE p.pembelianID = t.pembelianID AND tanggal_transaksi >= ? AND tanggal_transaksi <= ?'
            var pembelianbarang = [req.body.barangID, req.body.tgl_awal, req.body.tgl_akhir]
            connection.query(querystring3, pembelianbarang, function(err2, result2){
                if(err2) throw err2

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_nama_supplier(loop.iteration(), result2, function(result) {
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

router.post('/list_pembelian_supplier_A', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM pembelian WHERE supplierID = ? AND tanggal_transaksi >= ? AND tanggal_transaksi <= ?'
            var pembelian = [req.body.supplierID, req.body.tgl_awal, req.body.tgl_akhir]
            connection.query(querystring, pembelian, function(err2, result2){
                if(err2) throw err2

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_nama_supplier(loop.iteration(), result2, function(result) {
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
            var querystring = 'UPDATE pembelian SET isPrinted = 1 - isPrinted WHERE pembelianID = ?'
            var pembelian = [req.body.pembelianID]
            connection.query(querystring, pembelian, function(err2, result2){
                if(err2) throw err2
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/edit_pembelianbarang', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'

            var querystring1 = 'SELECT pembelianID, quantity, disc_1, disc_2, disc_3, harga_per_biji, satuanID, stokID FROM pembelianbarang WHERE pembelianbarangID = ?'
            var pembelian1 = [req.body.pembelianbarangID]
            connection.query(querystring1, pembelian1, function(err2, result2){
                if(err2) throw err2

                var price_awal = result2[0]['quantity'] * result2[0]['harga_per_biji']
                price_awal = price_awal * (100 - (result2[0]['disc_1']) - ((100-result2[0]['disc_1'])/100*result2[0]['disc_2']) - ( (100-(result2[0]['disc_1'])-(100-result2[0]['disc_1'])/100*result2[0]['disc_2'])/100*result2[0]['disc_3']) ) / 100

                var d1 = parseFloat(req.body.disc_1)
                var d2 = parseFloat(req.body.disc_2) * (100-d1)/100
                var d3 = parseFloat(req.body.disc_3) * (100-d1-d2)/100

                var curr_price = result2[0]['quantity'] * req.body.harga_per_biji
                curr_price = curr_price * (100-d1-d2-d3) / 100

                var satuanID = result2[0]['satuanID']
                var stokID = result2[0]['stokID']

                var querystring2 = 'UPDATE pembelianbarang SET harga_per_biji = ?, disc_1 = ?, disc_2 = ?, disc_3 = ? WHERE pembelianbarangID = ?'
                var pembelianbarang = [req.body.harga_per_biji, req.body.disc_1, req.body.disc_2, req.body.disc_3, req.body.pembelianbarangID]
                connection.query(querystring2, pembelianbarang, function(err3, result3){
                    if(err3) throw err3
                    resp['affectedRows'] = result3.affectedRows

                    var querystring3 = 'UPDATE pembelian SET subtotal = subtotal - ? WHERE pembelianID = ?'
                    var pembelian = [price_awal-curr_price, result2[0]['pembelianID']]
                    connection.query(querystring3, pembelian, function(err4, result4){
                        if(err4) throw err4

                        var querystring4 = 'SELECT konversi, konversi_acuan FROM satuanbarang WHERE satuanID = ?'
                        var satuanbarang = [satuanID]
                        connection.query(querystring4, satuanbarang, function(err5, result5){
                            if(err5) throw err5;
                            var konversi = result5[0]['konversi'] * result5[0]['konversi_acuan']

                            var total_disc = d1 + d2 + d3
                            var harga_pokok = req.body.harga_per_biji * ((100 - total_disc)/100)

                            var querystring5 = 'UPDATE stok SET harga_beli = ? WHERE stokID = ?'
                            var stok = [harga_pokok/konversi, stokID];
                            connection.query(querystring5, stok, function(err6, result6){
                                if(err6) throw err6
                                token_auth.update_status_pembelian(result2[0]['pembelianID'], function(result){
                                    res.status(200).send(resp)
                                })
                            })
                        })
                    })
                })
            })
        }
    })
})

router.post('/edit_pembelian', function(req,res){

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
            var querystring = 'UPDATE pembelian SET tanggal_transaksi = ?, jatuh_tempo = ?, notes = ?, disc = ? WHERE pembelianID = ?'
            var pembelian = [req.body.tanggal_transaksi, req.body.jatuh_tempo, req.body.notes, req.body.disc, req.body.pembelianID]
            connection.query(querystring, pembelian, function(err2, result2){
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

            var querystring = 'DELETE FROM cicilanpembelian WHERE cicilanpembelianID = ?'
            var cicilan = [req.body.cicilanpembelianID]

            connection.query(querystring, cicilan, function(err2, result2){
                if(err2) throw err2;
                res.status(200).send(resp)
            })
        }
    })
})

module.exports = router
