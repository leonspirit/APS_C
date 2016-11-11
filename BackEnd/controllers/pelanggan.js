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

router.post('/tambah_pelanggan', function(req,res){

    var resp = {}
    res.type('application/json');
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'INSERT INTO pelanggan SET nama = ?, telp = ?, alamat = ?';
            var pelanggan = [req.body.nama, req.body.telp, req.body.alamat];
            connection.query(querystring, pelanggan, function(err2,result2){
                if(err2) throw err2;
                resp['pelangganID'] = result2.insertId;
                res.status(200).send(resp);
            });
        }
    })
});

router.post('/list_pelanggan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM pelanggan';
            connection.query(querystring, function(err2, result2){
                if(err2) throw err2;
                resp['data'] = result2
                res.status(200).send(resp);
            });
        }
    })
});

router.post('/hapus_pelanggan', function(req,res){

    var resp = {}
    res.type('application/json')

    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'DELETE FROM pelanggan WHERE pelangganID = ?';
            var pelanggan = [req.body.pelangganID];
            connection.query(querystring, pelanggan, function(err2, result2){
                if(err2) throw err2;
                resp['affectedRows'] = result2.affectedRows
                res.status(200).send(resp);
            });
        }
    })
});

router.post('/update_pelanggan', function(req,res){

    var resp = {}
    res.type('application/json')

    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'UPDATE pelanggan SET nama = ?, telp = ?, alamat = ? WHERE pelangganID = ?';
            var pelanggan = [req.body.nama, req.body.telp, req.body.alamat, req.body.pelangganID];
            connection.query(querystring, pelanggan, function(err2, result2){
                if(err2) throw err2;
                resp['affectedRows'] = result2.affectedRows
                res.status(200).send(resp);
            });
        }
    })
});

function add_detil_pelanggan(index, data, callback){

    var pelangganID = data[index]['pelangganID']

    var qrstring = 'SELECT nama, alamat, telp FROM pelanggan WHERE pelangganID = ?'
    var pelanggan = [pelangganID]
    connection.query(qrstring, pelanggan, function(err, result){
        if(err) throw err
        data[index]['nama'] = result[0]['nama']
        data[index]['alamat'] = result[0]['alamat']
        data[index]['telp'] = result[0]['telp']
        callback()
    })
}

router.post('/list_pembeli_terbanyak', function(req,res){

    var resp = {}
    res.type('application/json')

    token_auth.check_token(req.body.token, function(result){
        if(result == null || result == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT pelangganID, SUM(subtotal) as total FROM penjualan WHERE tanggal_transaksi >= ? AND tanggal_transaksi <= ? AND status="lunas" GROUP BY pelangganID'
            var pelanggan = [req.body.tgl_awal, req.body.tgl_akhir]
            connection.query(querystring, pelanggan, function(err2, result2){
                if(err2) throw err2

                var len = result2.length
                asyncLoop(len, function(loop) {
                    add_detil_pelanggan(loop.iteration(), result2, function(result) {
                        loop.next();
                    })},
                    function(){
                        resp['data'] = result2
                        resp['data'].sort(function(a,b){
                            return parseFloat(b['total'] - parseFloat(a['total']))
                        })
                        res.status(200).send(resp)
                    }
                );
            })
        }
    })
})

module.exports = router
