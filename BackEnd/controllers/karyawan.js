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

function get_karyawan_hak_akses(index, data, callback){

    var karyawanID = data[index]['karyawanID']

    var qrstring = 'SELECT nama FROM hakakses WHERE karyawanID = ?'
    var hakakses = [karyawanID]
    connection.query(qrstring, hakakses, function(err, result){
        if(err) throw err
        data[index]['hak_akses'] = result
        callback()
    })
}

router.post('/list_karyawan', function(req,res){

    var resp = {}
    res.type('application/json');
    token_auth.check_user(req.body.token, function(result){
        if(result['hak_akses'] == null || result['hak_akses'] == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'SELECT karyawanID, nama, telp, alamat, username, status FROM karyawan WHERE karyawanID != ?';
            var karyawan = [result['karyawanID']]
            connection.query(querystring, karyawan, function(err2, result2){
                if(err2) throw err2;
                resp['data'] = result2
                res.status(200).send(resp)
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
    token_auth.check_token(req.body.token, function(result){
        if(result != 'aktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var querystring = 'UPDATE karyawan SET nama = ?, telp = ?, alamat = ? WHERE karyawanID = ?'
            var karyawan = [req.body.nama, req.body.telp, req.body.alamat, req.body.karyawanID]
            connection.query(querystring, karyawan, function(err2, result2){
                if(err2) throw err2
                resp['affectedRows'] = result2.affectedRows
                res.status(200).send(resp)
            })
        }
    })
});

router.post('/update_password', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_user(req.body.token, function(result){
        if(result['hak_akses'] == null || result['hak_akses'] == 'inaktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            var karyID = result['karyawanID']
            resp['token_status'] = 'success';
            if(karyID == req.body.karyawanID){
                var querystring = 'UPDATE karyawan SET password = ? WHERE karyawanID = ?'
                var karyawan = [req.body.password, req.body.karyawanID]
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
    })
})

router.post('/login', function(req,res){

    var querystring = 'SELECT karyawanID, nama FROM karyawan WHERE username = ? AND password = ? AND status != ?';
    var karyawan = [req.body.username, req.body.password, "inaktif"];
    connection.query(querystring, karyawan, function(err, result){
        if(err) throw err;
        var resp = {num_rows:result.length};
        res.type('application/json');

        if(result.length == 0){
            res.status(200).send(resp);
        }
        else{
            resp['username'] = req.body.username;
            resp['karyawanID'] = result[0].karyawanID;
            resp['nama'] = result[0].nama;
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

function add_hak_akses(index, karyawanID, data, callback){

    var nama = data[index]['nama']
    var querystring = 'INSERT INTO hakakses SET karyawanID = ?, nama = ?'
    var hakakses = [karyawanID, nama]
    connection.query(querystring, hakakses, function(err, result){
        if(err) throw err
        callback()
    })
}

router.post('/update_akses', function(req,res){

    console.log(req.body);
    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result != 'aktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'
            var len = req.body.hak_akses.length
            var querystring = 'DELETE FROM hakakses WHERE karyawanID = ?'
            var hakakses = [req.body.karyawanID]

            connection.query(querystring, hakakses, function(err2, result2){
                if(err2) throw err2;
            })

            asyncLoop(len, function(loop) {
                add_hak_akses(loop.iteration(), req.body.karyawanID, req.body.hak_akses, function(result) {
                    loop.next();
                })},
                function(){res.status(200).send(resp);}
            );
        }
    })
})

router.post('/detil_karyawan', function(req,res){

    var resp = {}
    res.type('application/json')
    token_auth.check_token(req.body.token, function(result){
        if(result != 'aktif'){
            resp['token_status'] = 'failed'
            res.status(200).send(resp)
        }
        else{
            resp['token_status'] = 'success'

            var querystring = 'SELECT karyawanID, nama, telp, alamat, username, status FROM karyawan WHERE karyawanID = ?'
            var karyawan = [req.body.karyawanID]

            connection.query(querystring, karyawan, function(err2, result2){
                if(err2) throw err2;
                if(result2.length == 0){
                    resp['num_rows'] = 0
                    res.status(200).send(resp)
                }
                else{
                    resp['num_rows'] = 1
                    resp['data'] = result2
                    var querystring2 = 'SELECT nama FROM hakakses WHERE karyawanID = ?'
                    var hak_akses = [req.body.karyawanID]

                    connection.query(querystring2, hak_akses, function(err3, result3){
                        if (err3) throw err3;
                        resp['data'][0]['hak_akses'] = result3
                        res.status(200).send(resp)
                    })
                }
            })
        }
    })
})

module.exports = router
