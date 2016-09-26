var connection = require('./database');

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
                var querystring2 = 'SELECT hak_akses FROM karyawan WHERE karyawanID = ?';
                var karyawan = [result[0].karyawanID];
                connection.query(querystring2, karyawan, function(err2, result2){
                    if(err2) throw err2;
                    return callback(result2[0].hak_akses);
                })
            }
        })
    },

    // UNTESTED
    destroy_token: function destroy_token(token_string, callback){
        var querystring = 'UPDATE token SET statusToken = ? WHERE token = ?';
        var token = ["inaktif", token_string];
        connection.query(querystring, token, function(err, result){
            if(err) throw err;
            return callback(result.affectedRows)
        })
    }
}
