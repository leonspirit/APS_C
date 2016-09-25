/**
 * Created by Billy on 14-Sep-16.
 */

var baseUrl = "http://localhost:3000/";

function GetAllPelangganData(fn)
{
    $.get( baseUrl+"pelanggan/list_pelanggan", function( data ) {
        fn(data);
    });
}

function DeletePelanggan(pelangganID, fn)
{
    $.post( baseUrl + "pelanggan/hapus_pelanggan/", {"pelangganID": pelangganID}, function(  data ) {
        fn(data);
    }, "json");
}

function UpdateDataPelanggan(Id, nama, telp, alamat, fn)
{
    $.post( baseUrl + "pelanggan/update_pelanggan/",
        {
            pelangganID: Id,
            nama: nama,
            telp: telp,
            alamat: alamat
        }
        , function(  data ) {
            fn(data);
        }, "json");
}

function AddPelanggan( nama, telp, alamat, fn)
{
    $.post( baseUrl + "pelanggan/tambah_pelanggan/",
        {
            nama: nama,
            telp: telp,
            alamat: alamat
        }
        ,function(data) {
            fn(data);
        }, "json");
}