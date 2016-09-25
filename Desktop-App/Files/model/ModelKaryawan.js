/**
 * Created by Billy on 14-Sep-16.
 */


var baseUrl = "http://localhost:3000/";

function GetAllKaryawanData(fn)
{
    $.get( baseUrl+"karyawan/list_karyawan", function( data ) {
        fn(data);
    });
}

function DeleteKaryawan(karyawanID, fn)
{
    $.post( baseUrl + "karyawan/hapus_karyawan/", {"karyawanID": karyawanID}, function(  data ) {
        fn(data);
    }, "json");
}

function UpdateDataKaryawan(Id, nama, telp, alamat, username, hak_akses, fn)
{
    $.post( baseUrl + "karyawan/update_karyawan/",
        {
            karyawanID: Id,
            nama: nama,
            telp: telp,
            alamat: alamat,
            username: username,
            hak_akses: hak_akses
        }
        , function(  data ) {
            fn(data);
        }, "json");
}

function AddKaryawan( nama, telp, alamat, username, password, hak_akses, fn)
{
    $.post( baseUrl + "karyawan/tambah_karyawan/",
        {
            nama: nama,
            telp: telp,
            alamat: alamat,
            username: username,
            password: password,
            hak_akses: hak_akses
        }
        ,function(data) {
            fn(data);
        }, "json");
}