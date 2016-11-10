/**
 * Created by Billy on 12-Oct-16.
 */

var currentToken = localStorage.getItem("token");

function populateKaryawanData()
{
     var KaryawanTable = $('#KaryawanTable').DataTable();
     GetAllKaryawanData(currentToken, function(result){
         var i;
         if (typeof KaryawanTable ==='undefined')
         {
             KaryawanTable = $('#KaryawanTable').DataTable({
                 "paging": true,
                 "lengthChange": true,
                 "searching": true,
                 //"sDom":"lrtp",
                 "ordering": true,
                 "info": true,
                 "autoWidth": false
             });
         }
         else {
             KaryawanTable.clear().draw();
         }
        if(result.token_status == "success")
        {
            for (i = 0; i < result.data.length; i++) {
                var pad ="00000";
                var id = "" + result.data[i].karyawanID;
                var StrId  = "P"+ pad.substring(0, pad.length - id.length)+id;

                var editButton = "<a class='edit-modal-toggle' data-toggle='modal' href='#editModal' data-id='"+
                    id+
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a style='color:red;' class='delete-modal-toggle' href='#deleteModal' data-toggle='modal' data-id='" +
                    id+
                    "'><i class='glyphicon glyphicon-trash'></i></a>";

                KaryawanTable.row.add([
                    StrId,
                    result.data[i].nama,
                    result.data[i].telp,
                    result.data[i].alamat,
                    result.data[i].username,
                    editButton+" "+delButton
                ]);
            }
            KaryawanTable.draw();
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
    var formData = document.getElementById("Daftarkaryawan-EditModal-EditForm");
    document.getElementById("Daftarkaryawan-EditModal-KaryawanIDText").innerHTML = $(Button).closest('tr').find('td:eq(0)').html();
    formData.elements['nama'].value=($(Button).closest('tr').find('td:eq(1)').html());
    formData.elements['telp'].value=($(Button).closest('tr').find('td:eq(2)').html());
    formData.elements['alamat'].value=($(Button).closest('tr').find('td:eq(3)').html());
    formData.elements['username'].value=($(Button).closest('tr').find('td:eq(4)').html());
    var karyawanID = $(Button).attr('data-id');
    document.getElementById("Daftarkaryawan-EditModal-ConfirmButton").setAttribute("data-id", karyawanID);
    var KaryawanTable = $('#KaryawanTable').DataTable();
    var rowNumber = KaryawanTable.row($(Button).closest('tr')).index();
    document.getElementById("Daftarkaryawan-EditModal-ConfirmButton").setAttribute("data-row-num", rowNumber);
    console.log("delete "+karyawanID+" "+rowNumber);

}

function populateDeleteModal(Button) {
    document.getElementById("Daftarkaryawan-DeleteModal-KaryawanIDText").innerHTML = $(Button).closest('tr').find('td:eq(0)').html();
    document.getElementById("Daftarkaryawan-DeleteModal-KaryawanNamaText").innerHTML = $(Button).closest('tr').find('td:eq(1)').html();
    var karyawanID = $(Button).attr('data-id');
    document.getElementById("Daftarkaryawan-DeleteModal-ConfirmButton").setAttribute("data-id", karyawanID);
    var KaryawanTable = $('#KaryawanTable').DataTable();
    var rowNumber = KaryawanTable.row($(Button).closest('tr')).index();
    document.getElementById("Daftarkaryawan-DeleteModal-ConfirmButton").setAttribute("data-row-num", rowNumber);
    console.log("delete "+karyawanID+" "+rowNumber);
}

function searchFromTable(queryID,  queryNama, queryTelp, queryAlamat, queryUsername)
{
    var KaryawanTable = $('#KaryawanTable').DataTable();
    var StrId;
    var queryID2 = parseInt(queryID);
    if (!isNaN(queryID2))
    {
        var pad ="00000";
        var id = "" + queryID2;
        StrId  = "K"+ pad.substring(0, pad.length - id.length)+id;
    }
    else
        StrId = "";
    KaryawanTable.
    columns("#table-id").search(StrId).
    columns("#table-nama").search(queryNama).
    columns("#table-telp").search(queryTelp).
    columns("#table-alamat").search(queryAlamat).
    columns("#table-username").search(queryUsername).
    draw();
}


function DeleteKaryawanConfirm(Button)
{
    var karyawanID = $(Button).attr('data-id');
    var rowNum = $(Button).attr('data-row-num');
    DeleteKaryawan(currentToken, karyawanID, function(result)
    {
        if (result.token_status=="success")
        {
            console.log(result.affectedRows);
            if (result.affectedRows== 1)
            {
                console.log("delete success");
                var KaryawanTable = $('#KaryawanTable').DataTable();
                KaryawanTable.row(rowNum).remove().draw();
                $("#deleteModal").modal('toggle');
                createAlert("success", "Data karyawan berhasil dihapus");
            }
            else
            {
                console.log("delete failed");
                createAlert("danger", "Data karyawan gagal dihapus, mohon coba kembali");
            }

        }
        else
        {
            console.log("Token Failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }

    });
}
function EditKaryawanConfirm(Button)
{
   var pad ="00000";
    var Id = $(Button).attr('data-id');
    var StrId  = "K"+ pad.substring(0, pad.length - Id.length)+Id;

    var rowNum = $(Button).attr('data-row-num');
    var formData = document.getElementById("Daftarkaryawan-EditModal-EditForm");
    var nama = formData.elements['nama'];
    var telp = formData.elements['telp'];
    var alamat = formData.elements['alamat'];
    var username = formData.elements['username'];

    UpdateDataKaryawan(currentToken, Id, nama, telp, alamat, username, function(result){
        if (result.token_status=="success")
        {
            if (result['affectedRows'] == 1)
            {
                console.log("update karyawan success");
                var KaryawanTable = $('#KaryawanTable').DataTable();
                KaryawanTable.cell(rowNum, 1).data(nama);
                KaryawanTable.cell(rowNum, 2).data(telp);
                KaryawanTable.cell(rowNum, 3).data(alamat);
                $("#editModal").modal('toggle');
                createAlert("success", "Data karyawan "+StrId+" - "+nama +" berhasil dirubah");
            }
            else
            {
                console.log("update karyawan failed");
                createAlert("danger", "Data karyawan gagal dirubah, mohon coba kembali");
            }
        }
        else
        {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}
function CreateKaryawanConfirm(Button){
     var formData = document.getElementById("DaftarKaryawan-CreateModal-CreateForm");
    var nama = formData.elements['nama'];
    var telp = formData.elements['telp'];
    var alamat = formData.elements['alamat'];
    var username = formData.elements['username'];
    var passwordHash = "password".hashCode();
    AddKaryawan(currentToken, nama, telp, alamat, username, passwordHash,function(result){
        if (result.token_status=="success")
        {
            if  (result.karyawanID != null)
            {
                console.log("Add karyawan success "+ result.karyawanID);
                var KaryawanTable = $('#KaryawanTable').DataTable();
                var pad ="00000";
                var id = "" + result.karyawanID;
                var StrId  = "P"+ pad.substring(0, pad.length - id.length)+id;

                var editButton = "<a class='edit-modal-toggle' data-toggle='modal' href='#editModal' data-id='"+
                    id+
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a style='color:red;' class='delete-modal-toggle' href='#deleteModal' data-toggle='modal' data-id='" +
                    id+
                    "'><i class='glyphicon glyphicon-trash'></i></a>";
                KaryawanTable.row.add([
                    StrId,
                    nama,
                    telp,
                    alamat,
                    editButton+" "+delButton
                ]).draw();
                $("#Daftarkaryawan-CreateModal").modal('toggle');
                createAlert("success", "Karyawan baru "+StrId+" - "+nama +" berhasil ditambahkan");
            }
            else
                console.log("Add Karyawan failed");
        }
        else
        {
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }

    });

}
function ListHakAksesCreateModal()
{
    var akses=[
        "Stok Barang",
        "Laporan Penjualan",
        "Laporan Pembelian",
        "Penjualan Baru",
        "Pembelian Baru",
        "Hutang",
        "Piutang",
        "Daftar Pelanggan",
        "Daftar Karyawan",
        "Daftar Supplier"
    ];
    var i;
    var TableHakAkses =  document.getElementById("CreateModalHakAksesTable").getElementsByTagName("tbody")[0];
    for (i=0;i<akses.length;i++)
    {
        //var aksesRow = TableHakAkses.
        var rowCount = TableHakAkses.rows.length;
        var row = TableHakAkses.insertRow(rowCount);

        var rowAksesName = row.insertCell(0);
        rowAksesName.innerHTML = akses[i];

        var rowAksesStatus = row.insertCell(1);
        var checkBox  = document.createElement("input");
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("class", "minimal");
        rowAksesStatus.appendChild(checkBox);
    }
    $('input[type="checkbox"].minimal').iCheck({
        checkboxClass:"icheckbox_minimal-green"
    });
}
function InitDaftarKaryawanPage()
{
    setPage("DaftarKaryawan");
    populateKaryawanData();
    $(document).on("click", ".delete-modal-toggle", function() {
        populateDeleteModal(this);
    });

    $(document).on("click", "#Daftarkaryawan-DeleteModal-ConfirmButton", function() {
        DeleteKaryawanConfirm(this);
    });

    $(document).on("click", ".edit-modal-toggle", function() {
        populateEditModal(this);
    });

    $(document).on("click", "#Daftarkaryawan-EditModal-ConfirmButton", function(){
        EditKaryawanConfirm(this);
    });

    $(document).on("click", "#Daftarkaryawan-CreateModal-ConfirmButton", function()
    {
        CreateKaryawanConfirm(this);
    });

    $(".search-filter").keyup( function(){
        searchFromTable(
            $("#search-karyawan-id").val(),
            $("#search-karyawan-nama").val(),
            $("#search-karyawan-telp").val(),
            $("#search-karyawan-alamat").val(),
            $("#search-karyawan-username").val()
        );
    });
    ListHakAksesCreateModal();

}