/**
 * Created by Billy on 14-Sep-16.
 */


var baseUrl = "http://localhost:3000/";



function getLunasPenjualanData(token, fn)
{
    $.post( baseUrl + "penjualan/list_lunas_penjualan/",
        {
            token: token
        }, function(  data ) {
            fn(data);
        }, "json");
}
function getPiutangPenjualanData(token, fn)
{
    $.post( baseUrl + "penjualan/list_piutang_penjualan/",
        {
            token: token
        }, function(  data ) {
            fn(data);
        }, "json");
}
function getAllPenjualanData(token, fn)
{
    $.post( baseUrl + "penjualan/list_penjualan/",
        {
            token: token
        }, function(  data ) {
            fn(data);
        }, "json");
}


function AddPenjualan(token, pelangganID, tanggal_transaksi, jatuh_tempo, subtotal, isPrinted, status, notes, alamat, satuan, fn)
{
    $.post( baseUrl + "penjualan/tambah_penjualan/",
        {
            token: token,
            pelangganID: pelangganID,
            tanggal_transaksi:tanggal_transaksi,
            jatuh_tempo:jatuh_tempo,
            subtotal:subtotal,
            isPrinted:isPrinted,
            status:status,
            notes:notes,
            alamat:alamat,
            satuan:satuan
        }, function(data) {
            fn(data);
        }, "json");
}

//connection.end();