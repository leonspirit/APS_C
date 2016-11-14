/**
 * Created by Billy on 30-Oct-16.
 */

var currentToken;

function DaftarSupplierPopulateSupplierData()
{
    var SupplierTable;// = $('#SupplierTable').DataTable();
    GetAllSupplierData(currentToken, function(result){
        if(result.token_status=="success")
        {
            var i;
            if (!$.fn.DataTable.isDataTable("#SupplierTable"))
            {
                SupplierTable = $('#SupplierTable').DataTable({
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
                SupplierTable = $('#SupplierTable').DataTable();
                SupplierTable.clear().draw();
            }
            for (i = 0; i < result.data.length; i++) {
                var pad ="00000";
                var id = "" + result.data[i].supplierID;
                var StrId  = "S"+ pad.substring(0, pad.length - id.length)+id;

                var editButton = "<a class='Daftarsupplier-edit-modal-toggle' data-toggle='modal' href='#Daftarsupplier-EditModal' data-id='"+
                    id+
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a style='color:red;' class='Daftarsupplier-delete-modal-toggle' href='#Daftarsupplier-DeleteModal' data-toggle='modal' data-id='" +
                    id+
                    "'><i class='glyphicon glyphicon-trash'></i></a>";

                SupplierTable.row.add([
                    StrId,
                    result.data[i].nama,
                    result.data[i].telp,
                    result.data[i].alamat,
                    editButton+" "+delButton
                ]);
            }
            SupplierTable.draw();
        }
        else
        {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}

function DaftarSupplierPopulateEditModal(Button)
{
    var formdata = document.getElementById("Daftarsupplier-EditModal-EditForm");
    console.log("lilo");
    console.log(formdata);
    document.getElementById("Daftarsupplier-EditModal-SupplierIDText").innerHTML = $(Button).closest('tr').find('td:eq(0)').html();
    formdata.elements['nama'].value=($(Button).closest('tr').find('td:eq(1)').html());
    formdata.elements['telp'].value=($(Button).closest('tr').find('td:eq(2)').html());
    formdata.elements['alamat'].value=($(Button).closest('tr').find('td:eq(3)').html());
    var supplierID = $(Button).attr('data-id');
    document.getElementById("Daftarsupplier-EditModal-ConfirmButton").setAttribute("data-id", supplierID);
    var SupplierTable = $('#SupplierTable').DataTable();
    var rowNumber = SupplierTable.row($(Button).closest('tr')).index();
    document.getElementById("Daftarsupplier-EditModal-ConfirmButton").setAttribute("data-row-num", rowNumber);
    console.log("delete "+supplierID+" "+rowNumber);
}

function DaftarSupplierPopulateDeleteModal(Button) {
    document.getElementById("Daftarsupplier-DeleteModal-SupplierIDText").innerHTML = $(Button).closest('tr').find('td:eq(0)').html();
    document.getElementById("Daftarsupplier-DeleteModal-SupplierNamaText").innerHTML = $(Button).closest('tr').find('td:eq(1)').html();
    var supplierID = $(Button).attr('data-id');
    document.getElementById("Daftarsupplier-DeleteModal-ConfirmButton").setAttribute("data-id", supplierID);
    var SupplierTable = $('#SupplierTable').DataTable();
    var rowNumber = SupplierTable.row($(Button).closest('tr')).index();
    document.getElementById("Daftarsupplier-DeleteModal-ConfirmButton").setAttribute("data-row-num", rowNumber);
    console.log("delete "+supplierID+" "+rowNumber);
}

function DaftarSupplierSearchFromTable(queryID,  queryNama, queryTelp, queryAlamat)
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
    columns("#SupplierTable-id").search(StrId).
    columns("#SupplierTable-nama").search(queryNama).
    columns("#SupplierTable-telp").search(queryTelp).
    columns("#SupplierTable-alamat").search(queryAlamat).
    draw();
}

function DaftarSupplierDeleteSupplierConfirm(Button)
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
                $("#Daftarsupplier-DeleteModal").modal('toggle');
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
function DaftarSupplierCreateSupplierConfirm()
{
    var formData = document.getElementById("Daftarsupplier-CreateModal-CreateForm");
    var nama = formData.elements['nama'];
    var telp = formData.elements['telp'];
    var alamat = formData.elements['alamat'];
    if (nama=="" || nama==null)
    {

    }
    AddSupplier(currentToken, nama, telp, alamat, function(result){
        if (result.token_status=="success")
        {
            if  (result.supplierID != null)
            {
                console.log("Add supplier success "+ result.supplierID);
                var SupplierTable = $('#SupplierTable').DataTable();
                var pad ="00000";
                var id = "" + result.supplierID;
                var StrId  = "S"+ pad.substring(0, pad.length - id.length)+id;

                var editButton = "<a class='Daftarsupplier-edit-modal-toggle' data-toggle='modal' href='#Daftarsupplier-EditModal' data-id='"+
                    id+
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a style='color:red;' class='Daftarsupplier-delete-modal-toggle' href='#Daftarsupplier-DeleteModal' data-toggle='modal' data-id='" +
                    id+
                    "'><i class='glyphicon glyphicon-trash'></i></a>";
                SupplierTable.row.add([
                    StrId,
                    nama,
                    telp,
                    alamat,
                    editButton+" "+delButton
                ]).draw();
                $("#Daftarsupplier-CreateModal").modal('toggle');
                formData.reset();
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

function DaftarSupplierUpdateSupplierConfirm(Button)
{
    var pad ="00000";
    var Id = $(Button).attr('data-id');
    var StrId  = "S"+ pad.substring(0, pad.length - Id.length)+Id;

    var rowNum = $(Button).attr('data-row-num');
    var formData = document.getElementById("Daftarsupplier-EditModal-EditForm");
    var nama = formData.elements['nama'].value;
    var telp = formData.elements['telp'].value;
    var alamat = formData.elements['alamat'].value;
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
                $("#Daftarsupplier-EditModal").modal('toggle');
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
function InitDaftarSupplierPage()
{
    setPage("DaftarSupplier");
    currentToken = localStorage.getItem("token");
    DaftarSupplierPopulateSupplierData();
    $(document).on("click",  ".Daftarsupplier-delete-modal-toggle",function() {
        DaftarSupplierPopulateDeleteModal(this);
    });
    document.getElementById("Daftarsupplier-DeleteModal-ConfirmButton").onclick= function() {
        DaftarSupplierDeleteSupplierConfirm(this);
    };
    $(document).on("click", ".Daftarsupplier-edit-modal-toggle",function() {
        DaftarSupplierPopulateEditModal(this);
    });
    document.getElementById("Daftarsupplier-EditModal-ConfirmButton").onclick= function(){
        DaftarSupplierUpdateSupplierConfirm(this);
    };
    document.getElementById("Daftarsupplier-CreateModal-ConfirmButton").onclick= function(){
        DaftarSupplierCreateSupplierConfirm();
    };
    $(".search-filter").keyup( function(){
        var SearchForm = document.getElementById("Daftarsupplier-SearchForm");
        DaftarSupplierSearchFromTable(
            SearchForm.elements['id'].value,
            SearchForm.elements['nama'].value,
            SearchForm.elements['telp'].value,
            SearchForm.elements['alamat'].value
        );
    });
}
