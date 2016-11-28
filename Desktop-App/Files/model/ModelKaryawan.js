/**
 * Created by Billy on 14-Sep-16.
 */


var baseUrl = "http://localhost:3000/";

function GetAllKaryawanData(token, fn)
{
    $.post( baseUrl+"karyawan/list_karyawan",
        {
            token:token
        },
        function( data ) {
            fn(data);
        }, "json");
}

function DeleteKaryawan(token, karyawanID, fn)
{
    $.post( baseUrl + "karyawan/hapus_karyawan/",
        {
            token:token,
            karyawanID: karyawanID
        }, function(  data ) {
            fn(data);
        }, "json");
}

function UpdateDataKaryawan(token, Id, nama, telp, alamat, fn)
{
    $.post( baseUrl + "karyawan/update_karyawan/",
        {
            token:token,
            karyawanID: Id,
            nama: nama,
            telp: telp,
            alamat: alamat
        }
        , function(  data ) {
            fn(data);
        }, "json");
}

function AddKaryawan(token,  nama, telp, alamat, username, password, hak_akses, fn)
{
    $.post( baseUrl + "karyawan/tambah_karyawan/",
        {
            token:token,
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
function DetailKaryawan(token, karyawanID, fn)
{
    $.post( baseUrl + "karyawan/detil_karyawan/",
        {
            token:token,
            karyawanID: karyawanID
        }
        ,function(data) {
            fn(data);
        }, "json");

}
function UpdateHakKaryawan(token, karyawanID, hakakses, fn)
{
    $.post( baseUrl + "karyawan/update_akses/",
        {
            token:token,
            karyawanID: karyawanID,
            hak_akses:hakakses
        }
        ,function(data) {
            fn(data);
        }, "json");
}
function UpdatePassword(token, karyawanID, password, fn)
{
    $.post( baseUrl + "karyawan/update_password/",
        {
            token:token,
            karyawanID: karyawanID,
            password:password
        }
        ,function(data) {
            fn(data);
        }, "json");
}