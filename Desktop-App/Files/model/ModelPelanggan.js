/**
 * Created by Billy on 14-Sep-16.
 */

var baseUrl = "http://localhost:3000/";

function GetAllPelangganData(token, fn)
{
    $.post( baseUrl+"pelanggan/list_pelanggan",
        {
            token:token
        },function( data ) {
            fn(data);
        }, "json");
}
function GetPembeliTerbanyakData(token, tgl_awal, tgl_akhir, fn)
{
    $.post( baseUrl+"pelanggan/list_pembeli_terbanyak",
        {
            token:token,
            tgl_awal:tgl_awal,
            tgl_akhir:tgl_akhir
        },function( data ) {
            fn(data);
        }, "json");
}


function DeletePelanggan(token, pelangganID, fn)
{
    $.post( baseUrl + "pelanggan/hapus_pelanggan/",
        {
            token: token,
            pelangganID: pelangganID
        }, function(  data ) {
            fn(data);
        }, "json");
}

function UpdateDataPelanggan(token, Id, nama, telp, alamat, fn)
{
    $.post( baseUrl + "pelanggan/update_pelanggan/",
        {
            token: token,
            pelangganID: Id,
            nama: nama,
            telp: telp,
            alamat: alamat
        }
        , function(  data ) {
            fn(data);
        }, "json");
}

function AddPelanggan(token, nama, telp, alamat, fn)
{
    $.post( baseUrl + "pelanggan/tambah_pelanggan/",
        {
            token: token,
            nama: nama,
            telp: telp,
            alamat: alamat
        }
        ,function(data) {
            fn(data);
        }, "json");
}