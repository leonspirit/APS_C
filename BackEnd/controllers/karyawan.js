var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connection = require('../database')
var token_auth = require('../token')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

function add_hak_akses_karyawan(req, i, karyawanID){

    var nama = req.body.hak_akses[i]['nama']

    var querystring = 'INSERT INTO hakakses SET karyawanID = ?, nama = ?'
    var hak_akses = [karyawanID, nama]
    connection.query(querystring, hak_akses, function(err, result){
        if(err) throw err
    })
}

router.post('/tambah_karyawan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result != 'aktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'INSERT INTO karyawan SET nama = ?, telp = ?, alamat = ?, username = ?, password = ?, status = ?';
            var karyawan = [req.body.nama, req.body.telp, req.body.alamat, req.body.username, req.body.password, "aktif"];
            connection.query(querystring, karyawan, function(err2,result2){
                if(err2) throw err2;
                resp['karyawanID'] = result2.insertId

                var len = req.body.hak_akses.length
                for(var i=0; i<len; i++){
                    add_hak_akses_karyawan(req, i, result2.insertId)
                }
                res.status(200).send(resp);
            });
        }
    })
});


router.post('/list_karyawan', function(req,res){

    var resp = {}
    res.type('application/json');
    token_auth.check_token(req.body.token, function(result){
        if(result != 'aktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT karyawanID, nama, telp, alamat, username, status FROM karyawan';
            connection.query(querystring, function(err2, result2){
                if(err2) throw err2;
                resp['data'] = result2;
                res.status(200).send(resp);
            });
        }
    })
});

router.post('/hapus_karyawan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result != 'aktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'UPDATE karyawan SET status = ? WHERE karyawanID = ?'
            var karyawan = ["inaktif", req.body.karyawanID]
            connection.query(querystring, karyawan, function(err2, result2){
                if(err2) throw err2
                resp['affectedRows'] = result2.affectedRows
                res.status(200).send(resp)
            })
        }
    })
});

router.post('/update_karyawan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_user(req.body.token, function(result){

        if(result['status'] == 'aktif'){
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

    var querystring = 'SELECT karyawanID FROM karyawan WHERE username = ? AND password = ? AND status != ?';
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
            resp['token'] = token_auth.new_token();

            var querystring2 = 'INSERT INTO token SET karyawanID = ?, token = ?, statusToken = ?';
            var token = [resp['karyawanID'], resp['token'], 'aktif'];
            connection.query(querystring2, token, function(err2, result2){
                if(err2) throw err2;
            })

            var querystring3 = 'SELECT nama FROM hakakses WHERE karyawanID = ?'
            var hakakses = [resp['karyawanID']]
            connection.query(querystring3, hakakses, function(err3, result3){
                if(err3) throw err3;
                resp['hak_akses'] = result3
                res.status(200).send(resp)
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

/*
router.post('/update_akses', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result != 'aktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'UPDATE karyawan SET hak_akses = ? WHERE karyawanID = ?'
            var karyawan = [req.body.hak_akses, req.body.karyawanID]
            connection.query(querystring, karyawan, function(err2,result2){
                if(err2) throw err2
                resp['affectedRows'] = result2.affectedRows
                res.status(200).send(resp)
            })
        }
    })
})
*/

module.exports = router
