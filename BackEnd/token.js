var connection = require('./database');

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

module.exports = {

    new_token: function new_token(){
        var uuid = require('node-uuid')
        return uuid.v4();
    },

    check_token: function check_token(token_string, callback){
        var querystring = 'SELECT karyawanID FROM token WHERE token = ? AND statusToken = ?';
        var token = [token_string, "aktif"];
        connection.query(querystring, token, function(err, result){
            if(err) throw err;
            if(result.length == 0){
                return callback(null);
            }
            else{
                var querystring2 = 'SELECT status FROM karyawan WHERE karyawanID = ?';
                var karyawan = [result[0].karyawanID];
                connection.query(querystring2, karyawan, function(err2, result2){
                    if(err2) throw err2;
                    return callback(result2[0].status);
                })
            }
        })
    },

    check_user: function check_user(token_string, callback){
        var resp = {}
        var querystring = 'SELECT karyawanID FROM token WHERE token = ? AND statusToken = ?';
        var token = [token_string, "aktif"]
        connection.query(querystring, token, function(err, result){
            if(err) throw err
            if(result.length == 0){
                resp['hak_akses'] = null
                return callback(resp)
            }
            else{
                var querystring2 = 'SELECT status FROM karyawan WHERE karyawanID = ?';
                var karyawan = [result[0].karyawanID]
                connection.query(querystring2, karyawan, function(err2, result2){
                    if(err2) throw err2
                    resp['hak_akses'] = result2[0].status
                    resp['karyawanID'] = result[0].karyawanID
                    return callback(resp)
                })
            }
        })
    },

    destroy_token: function destroy_token(token_string, callback){
        var querystring = 'UPDATE token SET statusToken = ? WHERE token = ?';
        var token = ["inaktif", token_string];
        connection.query(querystring, token, function(err, result){
            if(err) throw err;
            return callback(result.affectedRows)
        })
    },

    get_stok_harga_pokok: function get_harga_pokok(barangID, callback){

        var qrstring = 'SELECT harga_beli, stok_skrg FROM stok WHERE barangID = ?'
        var barang = [barangID]
        connection.query(qrstring, barang, function(err, result){
            if(err) throw err

            var len = result.length
            var data = {}
            asyncLoop(len, function(loop) {
                add_harga_stok(loop.iteration(), result, data, function(result) {
                    loop.next();
                })},
                function(){
                    if(data['stok']){
                        data['harga_pokok'] = data['harga_pokok'] / data['stok']
                    }
                    else{
                        data['stok'] = 0
                    }

                    if(!data['harga_pokok']){
                        data['harga_pokok'] = 0
                    }
                    data['harga_pokok'] = Math.round(data['harga_pokok'])
                    return callback(data)
                }
            );
        })
    },

    get_harga_jual: function get_harga_jual(satuanID, callback){

        var qrstring = 'SELECT harga_jual FROM satuanbarang WHERE satuanID = ?'
        var satuan = [satuanID]
        connection.query(qrstring, satuan, function(err, result){
            if(err)throw err
            return callback(result[0])
        })
    }
}
