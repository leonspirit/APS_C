var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connection = require('../database')
var token_auth = require('../token')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

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
                resp['data'] = result2
                res.status(200).send(resp)
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
                resp['data'] = result2
                res.status(200).send(resp)
            })
        }
    })
})

module.exports = router
