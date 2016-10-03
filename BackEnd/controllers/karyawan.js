var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connection = require('../database')
var token_auth = require('../token')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/tambah_karyawan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result != 'admin'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'INSERT INTO karyawan SET nama = ?, telp = ?, alamat = ?, username = ?, password = ?, hak_akses = ?';
            var karyawan = [req.body.nama, req.body.telp, req.body.alamat, req.body.username, req.body.password, req.body.hak_akses];
            connection.query(querystring, karyawan, function(err,result){
                if(err) throw err;
                resp['karyawanID'] = result.insertId
                res.status(200).send(resp);
            });
        }
    })
});

router.post('/list_karyawan', function(req,res){

    var resp = {}
    res.type('application/json');
    token_auth.check_token(req.body.token, function(result){
        if(result != 'admin'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT karyawanID, nama, telp, alamat, username, hak_akses FROM karyawan';
            connection.query(querystring, function(err, result){
                if(err) throw err;
                resp['data'] = result;
                res.status(200).send(resp);
            });
        }
    })
});

router.post('/hapus_karyawan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result != 'admin'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'UPDATE karyawan SET hak_akses = ? WHERE karyawanID = ?'
            var karyawan = ["inaktif", req.body.karyawanID]
            connection.query(querystring, karyawan, function(err, result){
                if(err) throw err
                resp['affectedRows'] = result.affectedRows
                res.status(200).send(resp)
            })
        }
    })
});

router.post('/update_karyawan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_user(req.body.token, function(result){

        if(result['hak_akses'] == 'admin' || result['hak_akses'] == 'karyawan'){
            var karyID = result['karyawanID']
            resp['token_status'] = 'success';
            if(karyID == req.body.karyawanID){
                var querystring = 'UPDATE karyawan SET nama = ?, telp = ?, alamat = ?, password = ? WHERE karyawanID = ?'
                var karyawan = [req.body.nama, req.body.telp, req.body.alamat, req.body.password, req.body.karyawanID]
                connection.query(querystring, karyawan, function(err2, result2){
                    if(err2) throw err2;
                    resp['affectedRows'] = result2.affectedRows
                    res.status(200).send(resp)
                })
            }
            else{
                resp['affectedRows'] = 0
                res.status(200).send(resp)
            }
        }
        else{
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
    })
});

router.post('/login', function(req,res){

    var querystring = 'SELECT karyawanID, hak_akses FROM karyawan WHERE username = ? AND password = ? AND hak_akses != ?';
    var karyawan = [req.body.username, req.body.password, "inaktif"];
    connection.query(querystring, karyawan, function(err, result){
        if(err) throw err;
        var resp = {num_rows:result.length};
        res.type('application/json');

        if(result.length == 0){
            res.status(200).send(resp);
        }
        else{
            resp['karyawanID'] = result[0].karyawanID;
            resp['hak_akses'] = result[0].hak_akses;
            resp['token'] = token_auth.new_token();

            var querystring2 = 'INSERT INTO token SET karyawanID = ?, token = ?, statusToken = ?';
            var token = [resp['karyawanID'], resp['token'], 'aktif'];
            connection.query(querystring2, token, function(err2, result2){
                if(err2) throw err2;
                res.status(200).send(resp);
            })
        }
    })
})

router.post('/logout', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.destroy_token(req.body.token, function(result){
        if(result == 0){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            res.status(200).send(resp)
        }
    })
})

router.post('/update_akses', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result != 'admin'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'UPDATE karyawan SET hak_akses = ? WHERE karyawanID = ?'
            var karyawan = [req.body.hak_akses, req.body.karyawanID]
            connection.query(querystring, karyawan, function(err,result){
                if(err) throw err
                resp['affectedRows'] = result.affectedRows
                res.status(200).send(resp)
            })
        }
    })
})

module.exports = router
