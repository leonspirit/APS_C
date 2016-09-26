/**
 * Created by Billy on 14-Sep-16.
 */


var baseUrl = "http://localhost:3000/";


function GetAllSupplierData(token, fn)
{
    $.get( baseUrl+"supplier/list_supplier", {
        token: token,
    },function( data ) {
        fn(data);
    });
}

function DeleteSupplier(token, supplierID, fn)
{
    $.post( baseUrl + "supplier/hapus_supplier/", {
        token: token,
        supplierID: supplierID
    }, function(  data ) {
        fn(data);
    }, "json");
}

function UpdateDataSupplier(token, Id, nama, telp, alamat, fn)
{
    $.post( baseUrl + "supplier/update_supplier/",
        {
            token: token,
            supplierID: Id,
            nama: nama,
            telp: telp,
            alamat: alamat
        }
        , function(  data ) {
            fn(data);
        }, "json");
}

function AddSupplier(token,  nama, telp, alamat, fn)
{
    $.post( baseUrl + "supplier/tambah_supplier/",
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