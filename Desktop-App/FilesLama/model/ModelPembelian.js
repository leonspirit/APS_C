/**
 * Created by Billy on 14-Sep-16.
 */

var baseUrl = "http://localhost:3000/"

function getLunasPembelianData(token, fn)
{
    $.post( baseUrl + "pembelian/list_lunas_pembelian/",
        {
            token: token
        }, function(  data ) {
            fn(data);
        }, "json");
}
function getHutangPembelianData(token, fn)
{
    $.post( baseUrl + "pembelian/list_hutang_pembelian/",
        {
            token: token
        }, function(  data ) {
            fn(data);
        }, "json");
}
function getAllPembelianData(token, fn)
{
    $.post( baseUrl + "pembelian/list_pembelian/",
        {
            token: token
        }, function(  data ) {
            fn(data);
        }, "json");
}

function AddPembelian(token, supplierID, tanggal_transaksi, jatuh_tempo, subtotal, disc, isPrinted, status, satuan, fn)
{
    $.post( baseUrl + "pembelian/tambah_pembelian/",
        {
            token: token,
            supplierID: supplierID,
            tanggal_transaksi:tanggal_transaksi,
            jatuh_tempo:jatuh_tempo,
            subtotal:subtotal,
            disc:disc,
            isPrinted:isPrinted,
            status:status,
            satuan:satuan
        }, function(  data ) {
            fn(data);
        }, "json");
}

function GetDetailPembelian(token, pembelianID, fn)
{
    $.post( baseUrl + "pembelian/detail_pembelian/",
        {
            token: token,
            pembelianID: pembelianID
        }, function(  data ) {
            fn(data);
        }, "json");
}

//connection.end();