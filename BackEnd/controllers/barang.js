var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connection = require('../database')
var token_auth = require('../token')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/tambah_barang', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'INSERT INTO barang SET nama = ?, stok = ?, harga_pokok = ?';
            var barang = [req.body.nama, req.body.stok, 0];
            connection.query(querystring, barang, function(err,result){
                if(err) throw err;
                resp['barangID'] = result.insertId;
                res.status(200).send(resp)
            });
        }
    })
});

router.post('/tambah_satuan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var satuan = [req.body.barangID, req.body.harga_jual, req.body.satuan, req.body.konversi];
            var querystring = 'INSERT INTO satuanbarang SET barangID = ?, harga_jual = ?, satuan = ?, konversi = ?';
            connection.query(querystring, satuan, function(err, result){
                if(err) throw err;
                resp['satuanID'] = result.insertId;
                res.status(200).send(resp);
            });
        }
    })
});

router.post('/list_barang', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else {
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM barang';
            connection.query(querystring, function(err, result){
                if(err) throw err;
                resp['data'] = result
                res.status(200).send(resp);
            });
        }
    })
});

router.post('/list_satuan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else {
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM satuanbarang WHERE barangID = ?';
            var satuan = [req.body.barangID];
            connection.query(querystring, satuan, function(err, result){
                if(err) throw err;
                resp['data'] = result;
                res.status(200).send(resp);
            });
        }
    })
});

router.post('/update_satuan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'UPDATE satuanbarang SET harga_jual = ?, satuan = ?, konversi = ? WHERE satuanID = ?'
            var satuanbarang = [req.body.harga_jual, req.body.satuan, req.body.konversi, req.body.satuanID]
            connection.query(querystring, satuanbarang, function(err, result){
                if(err) throw err;
                resp['affectedRows'] = result.affectedRows
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/update_barang', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'UPDATE barang SET nama = ?, stok = ? WHERE barangID = ?'
            var barang = [req.body.nama, req.body.stok, req.body.barangID]
            connection.query(querystring, barang, function(err, result){
                if(err) throw err;
                resp['affectedRows'] = result.affectedRows
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/hapus_satuan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'DELETE FROM satuanbarang WHERE satuanID = ?'
            var satuan = [req.body.satuanID]
            connection.query(querystring, satuan, function(err, result){
                if(err) throw err;
                resp['affectedRows'] = result.affectedRows
                res.status(200).send(resp)
            })
        }
    })
})

router.post('/hapus_barang', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'DELETE FROM satuanbarang WHERE barangID = ?'
            var satuan = [req.body.barangID]
            connection.query(querystring, satuan, function(err, result){
                if(err) throw err;
                var querystring2 = 'DELETE FROM barang WHERE barangID = ?'
                var barang = [req.body.barangID]
                connection.query(querystring2, barang, function(err2, result2){
                    if(err2) throw err2;
                    resp['affectedRows'] = result2.affectedRows
                    res.status(200).send(resp)
                })
            })
        }
    })
})

module.exports = router
