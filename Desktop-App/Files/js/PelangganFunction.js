/**
 * Created by Billy on 29-Sep-16.
 */

var currentToken;


function DaftarPelangganPopulateData()
{
    GetAllPelangganData(currentToken, function(result){
        var PelangganTable;// = $('#PelangganTable').DataTable();
        if(result.token_status=="success")
        {
            var i;
            if (!$.fn.DataTable.isDataTable("#PelangganTable"))
            {
                PelangganTable = $('#PelangganTable').DataTable({
                    "paging": true,
                    "lengthChange": true,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "dom": '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"t>><"row"<"col-sm-6"i><"col-sm-6"p>>'
                });
            }
            else
            {
                PelangganTable = $('#PelangganTable').DataTable();
                PelangganTable.clear().draw();
            }
            for (i = 0; i < result.data.length; i++) {
                var pad ="00000";
                var id = "" + result.data[i].pelangganID;
                var StrId  = "P"+ pad.substring(0, pad.length - id.length)+id;

                var editButton = "<a class='Daftarpelanggan-edit-modal-toggle' data-toggle='modal' href='#Daftarpelanggan-EditModal' data-id='"+
                    id+
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a style='color:red;' class='Daftarpelanggan-delete-modal-toggle' href='#Daftarpelanggan-DeleteModal' data-toggle='modal' data-id='" +
                    id+
                    "'><i class='glyphicon glyphicon-trash'></i></a>";

                PelangganTable.row.add([
                    StrId,
                    result.data[i].nama,
                    result.data[i].telp,
                    result.data[i].alamat,
                    editButton+" "+delButton
                ]);
            }
            PelangganTable.draw();
        }
        else
        {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }


    });
}

function DaftarPelangganDeleteConfirm(Button){
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
                $("#Daftarpelanggan-DeleteModal").modal('toggle');
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

function DaftarPelangganUpdateConfirm(Button)
{
    var pad ="00000";
    var Id = $(Button).attr('data-id');
    var StrId  = "P"+ pad.substring(0, pad.length - Id.length)+Id;

    var rowNum = $(Button).attr('data-row-num');
    var formData = document.getElementById("Daftarpelanggan-EditModal-EditForm");
    var nama = formData.elements['nama'].value;
    var telp = formData.elements['telp'].value;
    var alamat = formData.elements['alamat'].value;
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
                $("#Daftarpelanggan-EditModal").modal('toggle');
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

function DaftarPelangganCreateConfirm()
{
    var formData = document.getElementById("Daftarpelanggan-CreateModal-CreateForm");
    var nama = formData.elements['nama'].value;
    var telp = formData.elements['telp'].value;
    var alamat = formData.elements['alamat'].value;
    var valid =true;
    if (nama=='' || nama == null)
    {
        valid=false;
        setWarning(formData.elements['nama'], "Nama pelanggan harus diisi");
    }
    if (valid)
    {
        //removeWarning(formData.elements['nama']);
        AddPelanggan(currentToken, nama, telp, alamat, function(result){
            if (result.token_status=="success") {
                if (result.pelangganID != null)
                {
                    console.log("Add pelanggan success " + result.pelangganID);
                    var PelangganTable = $('#PelangganTable').DataTable();
                    var pad = "00000";
                    var id = "" + result.pelangganID;
                    var StrId = "P" + pad.substring(0, pad.length - id.length) + id;

                    var editButton = "<a class='Daftarpelanggan-edit-modal-toggle' data-toggle='modal' href='#Daftarpelanggan-EditModal' data-id='" +
                        id +
                        "'><i class='glyphicon glyphicon-pencil'></i></a>";
                    var delButton = "<a style='color:red;' class='Daftarpelanggan-delete-modal-toggle' href='#Daftarpelanggan-DeleteModal' data-toggle='modal' data-id='" +
                        id +
                        "'><i class='glyphicon glyphicon-trash'></i></a>";
                    PelangganTable.row.add([
                        StrId,
                        nama,
                        telp,
                        alamat,
                        editButton + " " + delButton
                    ]).draw();
                    $("#Daftarpelanggan-CreateModal").modal('toggle');
                    createAlert("success", "Pelanggan baru " + StrId + " - " + nama + " berhasil ditambahkan");
                    formData.reset();
                }
                else
                {
                    console.log("Add Pelanggan failed");
                    createAlert("danger", "Data pelanggan gagal ditambahkan, mohon coba kembali");
                }
            }
            else
            {
                console.log("Token failed");
                createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
            }
        });
    }

}

function DaftarPelangganPopulateEditModal(Button)
{
    var formdata = document.getElementById("Daftarpelanggan-EditModal-EditForm");
    document.getElementById("Daftarpelanggan-EditModal-PelangganIDText").innerHTML = $(Button).closest('tr').find('td:eq(0)').html();
    formdata.elements['nama'].value = $(Button).closest('tr').find('td:eq(1)').html();
    formdata.elements['telp'].value = $(Button).closest('tr').find('td:eq(2)').html();
    formdata.elements['alamat'].value = $(Button).closest('tr').find('td:eq(3)').html();
    var pelangganID = $(Button).attr('data-id');
    document.getElementById("Daftarpelanggan-EditModal-ConfirmButton").setAttribute("data-id", pelangganID);
    var PelangganTable = $('#PelangganTable').DataTable();
    var rowNumber = PelangganTable.row($(Button).closest('tr')).index();
    document.getElementById("Daftarpelanggan-EditModal-ConfirmButton").setAttribute("data-row-num", rowNumber);
    console.log("delete "+pelangganID+" "+rowNumber);

}

function DaftarPelangganPopulateDeleteModal(Button) {
    document.getElementById("Daftarpelanggan-DeleteModal-PelangganIDText").innerHTML = $(Button).closest('tr').find('td:eq(0)').html();
    document.getElementById("Daftarpelanggan-DeleteModal-PelangganNamaText").innerHTML = $(Button).closest('tr').find('td:eq(1)').html();
    var pelangganID = $(Button).attr('data-id');
    document.getElementById("Daftarpelanggan-DeleteModal-ConfirmButton").setAttribute("data-id", pelangganID);
    var PelangganTable = $('#PelangganTable').DataTable();
    var rowNumber = PelangganTable.row($(Button).closest('tr')).index();
    document.getElementById("Daftarpelanggan-DeleteModal-ConfirmButton").setAttribute("data-row-num", rowNumber);
    console.log("delete "+pelangganID+" "+rowNumber);
}

function DaftarPelangganSearchFromTable(queryID,  queryNama, queryTelp, queryAlamat)
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
    columns("#PelangganTable-id").search(StrId).
    columns("#PelangganTable-nama").search(queryNama).
    columns("#PelangganTable-telp").search(queryTelp).
    columns("#PelangganTable-alamat").search(queryAlamat).
    draw();
}

function InitDaftarPelangganPage()
{
    setPage("DaftarPelanggan");

    currentToken = localStorage.getItem("token");

    DaftarPelangganPopulateData();

    $(document).on("click", ".Daftarpelanggan-delete-modal-toggle", function(){
        DaftarPelangganPopulateDeleteModal(this);
    });

    document.getElementById("Daftarpelanggan-DeleteModal-ConfirmButton").onclick= function(){
        DaftarPelangganDeleteConfirm(this);
    };

    $(document).on("click", ".Daftarpelanggan-edit-modal-toggle", function(){
        DaftarPelangganPopulateEditModal(this);
    });

    document.getElementById("Daftarpelanggan-EditModal-ConfirmButton").onclick= function(){
        DaftarPelangganUpdateConfirm(this);
    };

    document.getElementById("Daftarpelanggan-CreateModal-ConfirmButton").onclick= function(){
        DaftarPelangganCreateConfirm();
    };

    $(".search-filter").keyup( function(){
        var formdata= document.getElementById("Daftarpelanggan-SearchForm");
        DaftarPelangganSearchFromTable(
            formdata.elements['id'].value,
            formdata.elements['nama'].value,
            formdata.elements['telp'].value,
            formdata.elements['alamat'].value
        );
    });
}