/**
 * Created by Billy on 14-Sep-16.
 */


var baseUrl = "http://localhost:3000/"

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function GetAllStokData(token, fn)
{
    $.post( baseUrl+"barang/list_barang/",
        {
            token:token
        },function( data ) {
            fn(data);
        }, "json");
}

function DeleteBarang(token, barangID, fn)
{
    $.post( baseUrl + "barang/hapus_barang/",
        {
            token: token,
            barangID: barangID
        }, function(  data ) {
            fn(data);
        }, "json");
}

function UpdateDataStok(token, barangID, nama, stok, fn)
{
    $.post( baseUrl + "barang/update_barang/",
        {
            token: token,
            barangID: barangID,
            nama:nama,
            stok:stok
        }
        , function(  data ) {
            fn(data);
        }, "json");
}

function AddBarang(token, nama, stok)
{
    $.post( baseUrl + "barang/tambah_barang/",
        {
            token: token,
            nama:nama,
            stok:stok
        }
        ,function(data) {
            fn(data);
        }, "json");
}


function GetAllSatuanData(token, barangID, fn)
{
    $.post( baseUrl+"barang/list_satuan",
        {
            token:token,
            barangID: barangID
        },function( data ) {
            fn(data);
        }, "json");
}

function DeleteSatuan(token, satuanbarangID, fn)
{
    $.post( baseUrl + "barang/hapus_satuan/",
        {
            token: token,
            satuanbarangID: satuanbarangID
        }, function(  data ) {
            fn(data);
        }, "json");
}

function UpdateDataSatuan(token, satuanbarangID, harga_jual, satuan, konversi, fn)
{
    $.post( baseUrl + "barang/update_satuan/",
        {
            token: token,
            satuanbarangID: satuanbarangID,
            harga_jual: harga_jual,
            satuan: satuan,
            konversi :konversi,
        }
        , function(  data ) {
            fn(data);
        }, "json");
}

function AddSatuan(token, barangID, harga_jual, satuan, konversi, fn)
{
    $.post( baseUrl + "barang/tambah_satuan/",
        {
            token: token,
            barangID: barangID,
            harga_jual:harga_jual,
            satuan:satuan,
            konversi:konversi
        }
        ,function(data) {
            fn(data);
        }, "json");
}

//connection.end();