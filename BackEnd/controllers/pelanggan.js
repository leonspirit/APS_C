var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connection = require('../database')
var token_auth = require('../token')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

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
            connection.query(querystring, pelanggan, function(err,result){
                if(err) throw err;
                resp['pelangganID'] = result.insertId;
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
            connection.query(querystring, function(err, result){
                if(err) throw err;
                resp['data'] = result
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
            connection.query(querystring, pelanggan, function(err, result){
                if(err) throw err;
                resp['affectedRows'] = result.affectedRows
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
            connection.query(querystring, pelanggan, function(err, result){
                if(err) throw err;
                resp['affectedRows'] = result.affectedRows
                res.status(200).send(resp);
            });
        }
    })
});

module.exports = router
