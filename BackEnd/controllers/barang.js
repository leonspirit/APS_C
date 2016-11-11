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

router.post('/tambah_barang', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'INSERT INTO barang SET nama = ?, harga_pokok = ?';
            var barang = [req.body.nama, 0];
            connection.query(querystring, barang, function(err2,result2){
                if(err2) throw err2;
                resp['barangID'] = result2.insertId;
                res.status(200).send(resp)
            });
        }
    })
});

router.post('/tambah_satuan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var satuan = [req.body.barangID, req.body.harga_jual, req.body.satuan, req.body.konversi, req.body.satuan_acuan, req.body.konversi_acuan];
            var querystring = 'INSERT INTO satuanbarang SET barangID = ?, harga_jual = ?, satuan = ?, konversi = ?, satuan_acuan = ?, konversi_acuan = ?';
            connection.query(querystring, satuan, function(err2, result2){
                if(err2) throw err2;
                resp['satuanID'] = result2.insertId;
                res.status(200).send(resp);
            });
        }
    })
});

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
                data[index]['harga_pokok'] = Math.round(data[index]['harga_pokok'])
                callback()
            }
        );
    })
}

router.post('/list_barang', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else {
            resp['token_status'] = 'success'
            var querystring = 'SELECT barangID, nama FROM barang';
            connection.query(querystring, function(err2, result2){
                if(err2) throw err2;

                var len = result2.length
                asyncLoop(len, function(loop) {
                    get_stok_harga_barang(loop.iteration(), result2, function(result) {
                        loop.next();
                    })},
                    function(){resp['data'] = result2; res.status(200).send(resp);}
                );
            });
        }
    })
});

router.post('/list_satuan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else {
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM satuanbarang WHERE barangID = ?';
            var satuan = [req.body.barangID];
            connection.query(querystring, satuan, function(err2, result2){
                if(err2) throw err2;
                resp['data'] = result2;
                res.status(200).send(resp);
            });
        }
    })
});

router.post('/update_satuan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'UPDATE satuanbarang SET harga_jual = ?, satuan = ?, konversi = ?, satuan_acuan = ?, konversi_acuan = ? WHERE satuanID = ?'
            var satuanbarang = [req.body.harga_jual, req.body.satuan, req.body.konversi, req.body.satuan_acuan, req.body.konversi_acuan, req.body.satuanID]
            connection.query(querystring, satuanbarang, function(err2, result2){
                if(err2) throw err2;
                resp['affectedRows'] = result2.affectedRows
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/update_barang', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'UPDATE barang SET nama = ? WHERE barangID = ?'
            var barang = [req.body.nama, req.body.barangID]
            connection.query(querystring, barang, function(err2, result2){
                if(err2) throw err2;
                resp['affectedRows'] = result2.affectedRows
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/hapus_satuan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'DELETE FROM satuanbarang WHERE satuanID = ?'
            var satuan = [req.body.satuanID]
            connection.query(querystring, satuan, function(err2, result2){
                if(err2) throw err2;
                resp['affectedRows'] = result2.affectedRows
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/hapus_barang', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'DELETE FROM satuanbarang WHERE barangID = ?'
            var satuan = [req.body.barangID]
            connection.query(querystring, satuan, function(err2, result2){
                if(err2) throw err2;
                var querystring2 = 'DELETE FROM barang WHERE barangID = ?'
                var barang = [req.body.barangID]
                connection.query(querystring2, barang, function(err3, result3){
                    if(err3) throw err3;
                    resp['affectedRows'] = result3.affectedRows
                    res.status(200).send(resp)
                })
            })
        }
    })
})

function add_nama_barang(index, data, callback){

    var barangID = data[index]['barangID']

    var qrstring = 'SELECT konversi, konversi_acuan FROM satuanbarang WHERE barangID = ? AND satuan = "box"'
    var satuanbarang = [barangID]
    connection.query(qrstring, satuanbarang, function(err, result){
        if(err) throw err
        data[index]['terjual'] = data[index]['terjual'] / (result[0]['konversi']*result[0]['konversi_acuan'])

        var qrstring2 = 'SELECT nama FROM barang WHERE barangID = ?'
        connection.query(qrstring2, satuanbarang, function(err2, result2){
            if(err2) throw err2
            data[index]['nama'] = result2[0]['nama']
            callback()
        })
    })
}

router.post('/list_barang_paling_banyak_terjual', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring1 = 'SELECT penjualanID FROM penjualan WHERE tanggal_transaksi >= ? AND tanggal_transaksi <= ?'
            var querystring2 = 'SELECT satuanID, SUM(quantity) as total FROM penjualanbarang WHERE penjualanID IN (' + querystring1 +') GROUP BY satuanID'
            var querystring3 = 'SELECT s.barangID, SUM(p.total*s.konversi*s.konversi_acuan) as terjual FROM satuanbarang as s, ('+querystring2+') as p WHERE s.satuanID = p.satuanID GROUP BY s.barangID'

            var barang = [req.body.tgl_awal, req.body.tgl_akhir]
            connection.query(querystring3, barang, function(err2, result2){
                if(err2) throw err2

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_nama_barang(loop.iteration(), result2, function(result) {
                        loop.next();
                    })},
                    function(){
                        resp['data'] = result2
                        resp['data'].sort(function(a,b){
                            return parseFloat(b['terjual'] - parseFloat(a['terjual']))
                        })
                        res.status(200).send(resp)
                    }
                );

            })
        }
    })
})

module.exports = router
