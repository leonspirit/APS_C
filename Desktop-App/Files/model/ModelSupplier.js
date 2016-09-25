/**
 * Created by Billy on 14-Sep-16.
 */


var baseUrl = "http://localhost:3000/";


function GetAllSupplierData(fn)
{
    $.get( baseUrl+"supplier/list_supplier", function( data ) {
        fn(data);
    });
}

function DeleteSupplier(supplierID, fn)
{
    $.post( baseUrl + "supplier/hapus_supplier/", {"supplierID": supplierID}, function(  data ) {
        fn(data);
    }, "json");
}

function UpdateDataSupplier(Id, nama, telp, alamat, fn)
{
    $.post( baseUrl + "supplier/update_supplier/",
        {
            supplierID: Id,
            nama: nama,
            telp: telp,
            alamat: alamat
        }
        , function(  data ) {
            fn(data);
        }, "json");
}

function AddSupplier( nama, telp, alamat, fn)
{
    $.post( baseUrl + "supplier/tambah_supplier/",
        {
            nama: nama,
            telp: telp,
            alamat: alamat
        }
        ,function(data) {
            fn(data);
        }, "json");
}