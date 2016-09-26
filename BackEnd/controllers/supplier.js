var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connection = require('../database')
var token_auth = require('../token')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/tambah_supplier', function(req,res){

    var resp = {}
    res.type('application/json');
    token_auth.check_token(req.body.token, function(result){
        if(result == null){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'INSERT INTO supplier SET nama = ?, telp = ?, alamat = ?';
            var supplier = [req.body.nama, req.body.telp, req.body.alamat];
            connection.query(querystring, supplier, function(err,result){
                if(err) throw err;
                resp['supplierID'] = result.insertId;
                res.status(200).send(resp);
            });
        }
    })
});

router.post('/list_supplier', function(req,res){

    var resp = {}
    res.type('application/json');
    token_auth.check_token(req.body.token, function(result){
        if(result == null){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT * FROM supplier';
            connection.query(querystring, function(err, result){
                if(err) throw err;
                resp['data'] = result
                res.status(200).send(resp);
            });
        }
    })
});

router.post('/hapus_supplier', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'DELETE FROM supplier WHERE supplierID = ?';
            var supplier = [req.body.supplierID];
            connection.query(querystring, supplier, function(err, result){
                if(err) throw err;
                resp['affectedRows'] = result.affectedRows;
                res.status(200).send(resp);
            });
        }
    })
});

router.post('/update_supplier', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result == null){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'UPDATE supplier SET nama = ?, telp = ?, alamat = ? WHERE supplierID = ?';
            var supplier = [req.body.nama, req.body.telp, req.body.alamat, req.body.supplierID];
            connection.query(querystring, supplier, function(err, result){
                if(err) throw err;
                resp['affectedRows'] = result.affectedRows
                res.status(200).send(resp);
            });
        }
    })
});

module.exports = router
