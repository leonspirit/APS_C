/**
 * Created by Billy on 30-Oct-16.
 */

var currentToken = localStorage.getItem("token");

function populateSupplierData()
{
    GetAllSupplierData(currentToken, function(result){
        if(result.token_status=="success")
        {
            var i;
            var SupplierTable = $('#SupplierTable').DataTable({
                "paging": true,
                "lengthChange": true,
                "searching": true,
                //"sDom":"lrtp",
                "ordering": true,
                "info": true,
                "autoWidth": false
            });
            for (i = 0; i < result.data.length; i++) {
                var pad ="00000";
                var id = "" + result.data[i].supplierID;
                var StrId  = "S"+ pad.substring(0, pad.length - id.length)+id;

                var editButton = "<a class='edit-modal-toggle' data-toggle='modal' href='#editModal' data-id='"+
                    id+
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a style='color:red;' class='delete-modal-toggle' href='#deleteModal' data-toggle='modal' data-id='" +
                    id+
                    "'><i class='glyphicon glyphicon-trash'></i></a>";

                SupplierTable.row.add([
                    StrId,
                    result.data[i].nama,
                    result.data[i].telp,
                    result.data[i].alamat,
                    editButton+" "+delButton
                ]).draw();
            }
        }
        else
        {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}

function populateEditModal(Button)
{
    document.getElementById("edit-modal-id").innerHTML = $(Button).closest('tr').find('td:eq(0)').html();
    $("#edit-modal-field-nama").val($(Button).closest('tr').find('td:eq(1)').html());
    $("#edit-modal-field-telp").val($(Button).closest('tr').find('td:eq(2)').html());
    $("#edit-modal-field-alamat").val($(Button).closest('tr').find('td:eq(3)').html());
    var supplierID = $(Button).attr('data-id');
    document.getElementById("edit-modal-save").setAttribute("data-id", supplierID);
    var SupplierTable = $('#SupplierTable').DataTable();
    var rowNumber = SupplierTable.row($(Button).closest('tr')).index();
    document.getElementById("edit-modal-save").setAttribute("data-row-num", rowNumber);
    console.log("delete "+supplierID+" "+rowNumber);

}

function populateDeleteModal(Button) {
    document.getElementById("delete-modal-id").innerHTML = $(Button).closest('tr').find('td:eq(0)').html();
    document.getElementById("delete-modal-nama").innerHTML = $(Button).closest('tr').find('td:eq(1)').html();
    var supplierID = $(Button).attr('data-id');
    document.getElementById("delete-modal-yes").setAttribute("data-id", supplierID);
    var SupplierTable = $('#SupplierTable').DataTable();
    var rowNumber = SupplierTable.row($(Button).closest('tr')).index();
    document.getElementById("delete-modal-yes").setAttribute("data-row-num", rowNumber);
    console.log("delete "+supplierID+" "+rowNumber);
}

function searchFromTable(queryID,  queryNama, queryTelp, queryAlamat)
{
    var SupplierTable = $('#SupplierTable').DataTable();
    var StrId;
    var queryID2 = parseInt(queryID);
    if (!isNaN(queryID2))
    {
        var pad ="00000";
        var id = "" + queryID2;
        StrId  = "S"+ pad.substring(0, pad.length - id.length)+id;
    }
    else
        StrId ="";
    SupplierTable.
    columns("#table-id").search(StrId).
    columns("#table-nama").search(queryNama).
    columns("#table-telp").search(queryTelp).
    columns("#table-alamat").search(queryAlamat).
    draw();
}

function deleteSupplierConfirm(Button)
{
    var supplierID = $(Button).attr('data-id');
    var rowNum = $(Button).attr('data-row-num');
    DeleteSupplier(currentToken, supplierID, function(result)
    {
        if (result.token_status=="success")
        {
            console.log(result.affectedRows);
            if (result.affectedRows== 1)
            {
                console.log("delete success");
                var SupplierTable = $('#SupplierTable').DataTable();
                SupplierTable.row(rowNum).remove().draw();
                $("#deleteModal").modal('toggle');
                createAlert("success", "Data supplier berhasil dihapus");
            }
            else
            {
                console.log("delete failed");
                createAlert("danger", "Data supplier gagal dihapus, mohon coba kembali");
            }
        }
        else
        {
            console.log("Token Failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}
function createSupplierConfirm()
{
    var formData = $("#create-modal-form").serializeArray();
    var nama = formData[0].value.toString();
    var telp = formData[1].value.toString();
    var alamat = formData[2].value.toString();
    AddSupplier(currentToken, nama, telp, alamat, function(result){
        if (result.token_status=="success")
        {
            if  (result.supplierID != null)
            {
                console.log("Add supplier success "+ result.supplierID);
                var SupplierTable = $('#SupplierTable').DataTable();
                var pad ="00000";
                var id = "" + result.supplierID;
                var StrId  = "P"+ pad.substring(0, pad.length - id.length)+id;

                var editButton = "<a class='edit-modal-toggle' data-toggle='modal' href='#editModal' data-id='"+
                    id+
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a style='color:red;' class='delete-modal-toggle' href='#deleteModal' data-toggle='modal' data-id='" +
                    id+
                    "'><i class='glyphicon glyphicon-trash'></i></a>";
                SupplierTable.row.add([
                    StrId,
                    nama,
                    telp,
                    alamat,
                    editButton+" "+delButton
                ]).draw();
                $("#createModal").modal('toggle');
                createAlert("success", "Supplier baru "+StrId+" - "+nama +" berhasil ditambahkan");
            }
            else {
                console.log("Add Supplier failed");
                createAlert("danger", "Data supplier gagal ditambahkan, mohon coba kembali");
            }
        }
        else
        {
            console.log("Token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}

function UpdateSupplierConfirm(Button)
{
    var pad ="00000";
    var Id = $(Button).attr('data-id');
    var StrId  = "S"+ pad.substring(0, pad.length - Id.length)+Id;

    var rowNum = $(Button).attr('data-row-num');
    var formData = $("#edit-modal-form").serializeArray();
    var nama = formData[0].value.toString();
    var telp = formData[1].value.toString();
    var alamat = formData[2].value.toString();
    UpdateDataSupplier(currentToken, Id, nama, telp, alamat, function(result){
        if (result.token_status=="success")
        {
            if (result['affectedRows'] == 1)
            {
                console.log("update supplier success");
                var SupplierTable = $('#SupplierTable').DataTable();
                SupplierTable.cell(rowNum, 1).data(nama);
                SupplierTable.cell(rowNum, 2).data(telp);
                SupplierTable.cell(rowNum, 3).data(alamat);
                $("#editModal").modal('toggle');
                createAlert("success", "Data supplier "+StrId+" - "+nama +" berhasil dirubah");
            }
            else
            {
                console.log("update supplier failed");
                createAlert("danger", "Data supplier gagal dirubah, mohon coba kembali");
            }
        }
        else
        {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }

    });
}
