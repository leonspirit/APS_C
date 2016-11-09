/**
 * Created by Billy on 01-Oct-16.
 */

console.log(localStorage.getItem("karyawanID"));
var currentHakAkses = localStorage.getItem("hak_akses");
console.log(localStorage.getItem("token"));
var currentToken = localStorage.getItem("token");

function populateStokDataEntry(BarangTable, barangEntry)
{
    GetAllSatuanData(currentToken, barangEntry.barangID, function (result2) {
        var i2;
        for (i2 = 0; i2 < result2.data.length; i2++) {
            if (result2.data[i2].satuan == "box") {
                var pad = "00000";
                var id = "" + barangEntry.barangID;
                var StrId = "C" + pad.substring(0, pad.length - id.length) + id;

                var IsiCarton = "@ "+result2.data[i2].konversi.toString()+" "+result2.data[i2].satuan_acuan;

                var HargaJual =
                    '<span class="pull-right">' +
                    'Rp. ' + numberWithCommas(result2.data[i2].harga_jual) +
                    '</span>';

                var HargaPokok =
                    '<span class="pull-right">' +
                    'Rp. ' + numberWithCommas(barangEntry.harga_pokok * result2.data[i2].konversi * result2.data[i2].konversi_acuan) +
                    '</span>';

                var curBoxStok = parseInt(barangEntry.stok/(result2.data[i2].konversi * result2.data[i2].konversi_acuan));
                var StokReady = '<span class="pull-right">' +
                    numberWithCommas(curBoxStok) + ' box';
                if ((barangEntry.stok%(result2.data[i2].konversi * result2.data[i2].konversi_acuan))!=0)
                {
                    var curSisaStok = (barangEntry.stok%(result2.data[i2].konversi * result2.data[i2].konversi_acuan))/result2.data[i2].konversi_acuan;
                    StokReady +=" "+numberWithCommas(curSisaStok)+" "+result2.data[i2].satuan_acuan;
                }
                StokReady+='</span>';
                var editButton = "<a class='edit-modal-toggle' data-toggle='modal' href='#editModal' data-id='" +
                    id +
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a class='delete-modal-toggle' href='#deleteModal' data-toggle='modal'  style='color:red;' data-id='" +
                    id +
                    "'><i class='glyphicon glyphicon-trash'></i></a>";
                BarangTable.row.add([
                    StrId,
                    barangEntry.nama,
                    IsiCarton,
                    StokReady,
                    HargaJual,
                    HargaPokok,
                    editButton + " " + delButton
                ]).draw();

                break;
            }
        }
    });
}

function populateStokData() {
    var BarangTable = $('#BarangTable').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false
    });
    GetAllStokData(currentToken, function (result) {
        if (result.token_status == "success") {
            var i;
            for (i = 0; i < result.data.length; i++) {
                populateStokDataEntry(BarangTable, result.data[i]);
            }
        }
        else {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }

    });
}
function searchFromTable(queryID,  queryNama)
{
    var BarangTable = $('#BarangTable').DataTable();
    var StrId;
    var queryID2 = parseInt(queryID);
    if (!isNaN(queryID2))
    {
        var pad ="00000";
        var id = "" + queryID2;
        StrId  = "C"+ pad.substring(0, pad.length - id.length)+id;
    }
    else
        StrId = "";
    BarangTable.
    columns("#table-kode").search(StrId).
    columns("#table-nama").search(queryNama).
    draw();
}

function populateEditModal(Button)
{
    document.getElementById("edit-modal-id").innerHTML = $(Button).closest('tr').find('td:eq(0)').html();
    $("#edit-modal-field-nama").val($(Button).closest('tr').find('td:eq(1)').html());
    $("#edit-modal-field-telp").val($(Button).closest('tr').find('td:eq(2)').html());
    $("#edit-modal-field-alamat").val($(Button).closest('tr').find('td:eq(3)').html());
    var barangID = $(Button).attr('data-id');
    document.getElementById("edit-modal-save").setAttribute("data-id", barangID);
    var barangTable = $('#BarangTable').DataTable();
    var rowNumber = barangTable.row($(Button).closest('tr')).index();
    document.getElementById("edit-modal-save").setAttribute("data-row-num", rowNumber);
    console.log("delete "+barangID+" "+rowNumber);
}

function CreateModalDisableHargaJualInput()
{
    var satuan =["grs", "kod", "lsn", "pcs"];
    var i;
    for (i=0;i<satuan.length;i++)
    {
        if ($("#check-harga-jual-"+satuan[i]).prop("checked"))
        {
            $("#harga-jual-"+satuan[i]).prop("disabled", false);
        }
        else
        {
            $("#harga-jual-"+satuan[i]).prop("disabled", true);
        }
    }
}

function createBarangConfirm()
{
    var satuan =["grs", "kod", "lsn", "pcs"];
    var konversiSatuan = [144, 20, 12, 1];
    var BarangTable = $('#BarangTable').DataTable();

    var formData = $("#create-barang-form").serializeArray();
    console.log(formData);
    var i;
    AddBarang(currentToken, formData[0].value.toString(), function(result)
    {
        if (result.token_status=="success")
        {
            console.log(result.barangID);
            var konversiAcuanBox;
            var acuanBox = $("#create-modal-konversi-carton-select").val();
            console.log(acuanBox);
            for (i=0;i<satuan.length;i++)
            {
                if (acuanBox==satuan[i])
                {
                    konversiAcuanBox = konversiSatuan[i];
                    break;
                }
            }
            var AddSatuanSuccess = true;
            AddSatuan(currentToken, result.barangID, $("#harga-jual-box").val(), "box", formData[2].value, acuanBox, konversiAcuanBox,
                function(result3){
                    if (result3.token_status=="success")
                    {
                        console.log(result3.satuanID);
                    }
                    else
                    {
                        AddSatuanSuccess = false;
                    }
                }
            );
            for (i=0;i<satuan.length;i++)
            {
                if ($("#check-harga-jual-"+satuan[i]).prop("checked"))
                {
                    AddSatuan(currentToken, result.barangID, $("#harga-jual-"+satuan[i]).val(), satuan[i], konversiSatuan[i], "pcs", 1,
                        function(result2){
                             if(result2.token_status="success")
                             {
                                 console.log(result2.satuanID);
                             }
                             else
                             {
                                 AddSatuanSuccess  =false;
                             }
                        }
                    );
                }
            }
            if (AddSatuanSuccess)
            {
                var pad ="00000";
                var id = "" + result.barangID;
                var StrId  = "C"+ pad.substring(0, pad.length - id.length)+id;

                var stokReady = "<span class='pull-right'>"+"0 box"+"</span>";

                var hargaJual  ="<span class='pull-right'>Rp. "+numberWithCommas($("#harga-jual-box").val())+"</span>";

                var hargaPokok = "<span class='pull-right'>Rp. "+numberWithCommas(0)+"</span>";

                var editButton = "<a class='edit-modal-toggle' data-toggle='modal' href='#editModal' data-id='" +
                    id +
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a class='delete-modal-toggle' href='#deleteModal' data-toggle='modal'  style='color:red;' data-id='" +
                    id +
                    "'><i class='glyphicon glyphicon-trash'></i></a>";

                BarangTable.row.add([
                    StrId,
                    formData[0].value.toString(),
                    "@ "+formData[2].value+" "+acuanBox,
                    stokReady,
                    hargaJual,
                    hargaPokok,
                    editButton+" "+delButton
                ]).draw();
                createAlert("success", "Barang baru "+StrId+" - "+formData[0].value.toString() +" berhasil ditambahkan");
                $("#createModal").modal('toggle');
            }
            else
            {
                console.log("Add Barang failed");
                createAlert("danger", "Data Barang gagal ditambahkan, mohon coba kembali");
            }
        }
        else {
            console.log("Token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}

