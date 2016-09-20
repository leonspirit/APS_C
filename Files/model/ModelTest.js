/**
 * Created by Billy on 14-Sep-16.
 */


function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

var mysql  =  require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password: '',
    database: 'tokokohong-test'
});
connection.connect();

function getQueryData(kode, nama, stokMin, stokMax, hJualMin, hJualMax, hPokokMin, hPokokMax, fn) {

    var hasAnd  = false;
    var query = "select * from stok";
    if (kode != null) {
        if (!hasAnd)
            query += " where Kode='" + kode + "'";
        else
        {
            query += " and Kode='" + kode + "'";
            hasAnd = true;
        }
    }
    if (nama!=null)
    {
        if (!hasAnd)
            query += " where Nama='" + nama + "'";
        else
        {
            query += " and Nama='" + nama + "'";
            hasAnd = true;
        }
    }
    if (stokMin!=null)
    {
        if (!hasAnd)
            query += " where StokReady>=" + stokMin.toString();
        else
        {
            query += " and StokReady>=" + stokMin.toString();
            hasAnd = true;
        }
    }
    if (stokMax!=null)
    {
        if (!hasAnd)
            query += " where StokReady<=" + stokMax.toString();
        else
        {
            query += " and StokReady<=" + stokMax.toString();
            hasAnd = true;
        }
    }
    if (hJualMin!=null)
    {
        if (!hasAnd)
            query += " where HargaJual>=" + hJualMin.toString();
        else
        {
            query += " and HargaJual>=" + hJualMin.toString();
            hasAnd = true;
        }
    }
    if (hJualMax!=null)
    {
        if (!hasAnd)
            query += " where HargaJual<=" + hJualMax.toString();
        else
        {
            query += " and HargaJual<=" + hJualMax.toString();
            hasAnd = true;
        }
    }
    if (hPokokMin!=null)
    {
        if (!hasAnd)
            query += " where HargaPokok>=" + hPokokMin.toString();
        else
        {
            query += " and HargaPokok>=" + hPokokMin.toString();
            hasAnd = true;
        }
    }
    if (hPokokMax!=null)
    {
        if (!hasAnd)
            query += " where HargaPokok<=" + hPokokMax.toString();
        else
        {
            query += " and HargaPokok<=" + hPokokMax.toString();
            hasAnd = true;
        }
    }
    console.log(query);
    connection.query(query, function (err, rows, fields) {
        if (!err)
            fn(rows);
        else
        {
            console.log("Error Query");
            fn(null);
        }
    })
}
function getAllData(fn) {
    connection.query('select * from stok', function (err, rows, fields) {
        if (!err)
           fn(rows);
        else
        {
            console.log("Error query");
            fn(null);
        }
    })
}
//connection.end();