/**
 * Created by Billy on 29-Sep-16.
 */


console.log(localStorage.getItem("karyawanID"));
console.log(localStorage.getItem("hak_akses"));
console.log(localStorage.getItem("token"));
var currentToken = localStorage.getItem("token");


function populatePelangganData()
{
    GetAllPelangganData(currentToken, function(result){
        if(result.token_status=="success")
        {
            var i;
            var PelangganTable = $('#PelangganTable').DataTable({
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
                var id = "" + result.data[i].pelangganID;
                var StrId  = "P"+ pad.substring(0, pad.length - id.length)+id;

                var editButton = "<a class='edit-modal-toggle' data-toggle='modal' href='#editModal' data-id='"+
                    id+
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a style='color:red;' class='delete-modal-toggle' href='#deleteModal' data-toggle='modal' data-id='" +
                    id+
                    "'><i class='glyphicon glyphicon-trash'></i></a>";

                PelangganTable.row.add([
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

function deletePelangganConfirm(Button){
    var pelangganID = $(Button).attr('data-id');
    var rowNum = $(Button).attr('data-row-num');
    DeletePelanggan(currentToken, pelangganID, function(result)
    {
        if (result.token_status=="success")
        {
            console.log(result.affectedRows);
            if (result.affectedRows== 1)
            {
                console.log("delete success");
                var PelangganTable = $('#PelangganTable').DataTable();
                PelangganTable.row(rowNum).remove().draw();
                $("#deleteModal").modal('toggle');
                createAlert("success", "Data pelanggan berhasil dihapus");
            }
            else
            {
                console.log("delete failed");
                createAlert("danger", "Data pelanggan gagal dihapus, mohon coba kembali");
            }
        }
        else
        {
            console.log("Token Failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }

    });
}

function updatePelangganConfirm(Button)
{
    var pad ="00000";
    var Id = $(Button).attr('data-id');
    var StrId  = "P"+ pad.substring(0, pad.length - Id.length)+Id;

    var rowNum = $(Button).attr('data-row-num');
    var formData = $("#edit-modal-form").serializeArray();
    var nama = formData[0].value.toString();
    var telp = formData[1].value.toString();
    var alamat = formData[2].value.toString();
    UpdateDataPelanggan(currentToken, Id, nama, telp, alamat, function(result){
        if (result.token_status=="success")
        {
            if (result['affectedRows'] == 1)
            {
                console.log("update pelanggan success");
                var PelangganTable = $('#PelangganTable').DataTable();
                PelangganTable.cell(rowNum, 1).data(nama);
                PelangganTable.cell(rowNum, 2).data(telp);
                PelangganTable.cell(rowNum, 3).data(alamat);
                $("#editModal").modal('toggle');
                createAlert("success", "Data pelanggan "+StrId+" - "+nama +" berhasil dirubah");
            }
            else
            {
                console.log("update pelanggan failed");
                createAlert("danger", "Data pelanggan gagal dirubah, mohon coba kembali");
            }
        }
        else
        {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}

function createPelangganConfirm()
{
    var formData = $("#create-modal-form").serializeArray();
    var nama = formData[0].value.toString();
    var telp = formData[1].value.toString();
    var alamat = formData[2].value.toString();
    AddPelanggan(currentToken, nama, telp, alamat, function(result){
        if (result.token_status=="success")
        {
            if  (result.pelangganID != null)
            {
                console.log("Add pelanggan success "+ result.pelangganID);
                var PelangganTable = $('#PelangganTable').DataTable();
                var pad ="00000";
                var id = "" + result.pelangganID;
                var StrId  = "P"+ pad.substring(0, pad.length - id.length)+id;

                var editButton = "<a class='edit-modal-toggle' data-toggle='modal' href='#editModal' data-id='"+
                    id+
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a style='color:red;' class='delete-modal-toggle' href='#deleteModal' data-toggle='modal' data-id='" +
                    id+
                    "'><i class='glyphicon glyphicon-trash'></i></a>";
                PelangganTable.row.add([
                    StrId,
                    nama,
                    telp,
                    alamat,
                    editButton+" "+delButton
                ]).draw();
                $("#createModal").modal('toggle');
                createAlert("success", "Pelanggan baru "+StrId+" - "+nama +" berhasil ditambahkan");
            }
            else
                console.log("Add Pelanggan failed");
        }
        else
        {
            console.log("Token failed");
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
    var pelangganID = $(Button).attr('data-id');
    document.getElementById("edit-modal-save").setAttribute("data-id", pelangganID);
    var PelangganTable = $('#PelangganTable').DataTable();
    var rowNumber = PelangganTable.row($(Button).closest('tr')).index();
    document.getElementById("edit-modal-save").setAttribute("data-row-num", rowNumber);
    console.log("delete "+pelangganID+" "+rowNumber);

}

function populateDeleteModal(Button) {
    document.getElementById("delete-modal-id").innerHTML = $(Button).closest('tr').find('td:eq(0)').html();
    document.getElementById("delete-modal-nama").innerHTML = $(Button).closest('tr').find('td:eq(1)').html();
    var pelangganID = $(Button).attr('data-id');
    document.getElementById("delete-modal-yes").setAttribute("data-id", pelangganID);
    var PelangganTable = $('#PelangganTable').DataTable();
    var rowNumber = PelangganTable.row($(Button).closest('tr')).index();
    document.getElementById("delete-modal-yes").setAttribute("data-row-num", rowNumber);
    console.log("delete "+pelangganID+" "+rowNumber);
}

function searchFromTable(queryID,  queryNama, queryTelp, queryAlamat)
{
    var PelangganTable = $('#PelangganTable').DataTable();
    var StrId;
    var queryID2 = parseInt(queryID);
    if (!isNaN(queryID2))
    {
        var pad ="00000";
        var id = "" + queryID2;
        StrId  = "P"+ pad.substring(0, pad.length - id.length)+id;
    }
    else
        StrId ="";
    PelangganTable.
    columns("#table-id").search(StrId).
    columns("#table-nama").search(queryNama).
    columns("#table-telp").search(queryTelp).
    columns("#table-alamat").search(queryAlamat).
    draw();
}

function createAlert(type, message)
{
    var container = document.createElement("div");
    container.setAttribute("class", "alert alert-"+type+" alert-dismissable");
    var closeButton  = document.createElement("Button");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("class", "close");
    closeButton.setAttribute("data-dismiss", "alert");
    closeButton.setAttribute("arie-hidden", "true");
    closeButton.innerHTML="&times;";
    container.appendChild(closeButton);
    container.innerHTML += message;
    var placeholder = document.getElementById("alert-placeholder");
    if (placeholder.hasChildNodes())
        placeholder.removeChild(placeholder.childNodes[0]);
    placeholder.appendChild(container);

}