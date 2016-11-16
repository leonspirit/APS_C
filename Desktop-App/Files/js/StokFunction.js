/**
 * Created by Billy on 01-Oct-16.
 */

var currentHakAkses = localStorage.getItem("hak_akses");
var currentToken;

function StokBarangPopulateEntry(BarangTable, barangEntry)
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

              //  if (hasHakAkses("HargaPokokLaba"))
               // {
                    var HargaPokok =
                        '<span class="pull-right">' +
                        'Rp. ' + numberWithCommas(barangEntry.harga_pokok * result2.data[i2].konversi * result2.data[i2].konversi_acuan) +
                        '</span>';
                    BarangTable.row.add([
                        StrId,
                        barangEntry.nama,
                        IsiCarton,
                        StokReady,
                        HargaJual,
                        HargaPokok,
                        editButton + " " + delButton
                    ]).draw();
                /*}
                else {
                    BarangTable.row.add([
                        StrId,
                        barangEntry.nama,
                        IsiCarton,
                        StokReady,
                        HargaJual,
                        editButton + " " + delButton
                    ]).draw();
                }*/

                break;
            }
        }
    });
}

function StokBarangPopulateData() {

    var BarangTable;//=$("#BarangTable").DataTable();
    if(!$.fn.DataTable.isDataTable("#BarangTable")){
        BarangTable = $('#BarangTable').DataTable({
            "paging": true,
            "lengthChange": true,
            "searching": true,
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "dom": '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"t>><"row"<"col-sm-6"i><"col-sm-6"p>>'
        });
    }
    else {
        BarangTable = $('#BarangTable').DataTable();
        BarangTable.clear().draw();
    }

    if (!hasHakAkses("HargaPokokLaba"))
    {
        BarangTable.column("#StokTable-harga-pokok").visible(false);
    }
    else {
        BarangTable.column("#StokTable-harga-pokok").visible(true);
    }
    GetAllStokData(currentToken, function (result) {
        if (result.token_status == "success") {
            var i;
            for (i = 0; i < result.data.length; i++) {
                StokBarangPopulateEntry(BarangTable, result.data[i]);
            }
        }
        else {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}
function StokBarangSearch(queryID,  queryNama)
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

function StokBarangPopulateEditModal(Button)
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

function StokBarangCreateModalDisableHargaJualInput()
{
    var form = document.getElementById("Stokbarang-CreateModal-CreateForm");

    var satuan =["grs", "kod", "lsn", "pcs"];
    var i;
    for (i=0;i<satuan.length;i++)
    {
        if ($("#Stokbarang-CreateModal-harga-jual-"+satuan[i]+"-check").prop("checked"))
        {
            form.elements["harga-jual-"+satuan[i]+"-input"].disabled =false;
        }
        else
        {
            form.elements["harga-jual-"+satuan[i]+"-input"].disabled= true;
        }
    }
}

function StokBarangCreateBarangConfirm()
{
    var satuan =["grs", "kod", "lsn", "pcs"];
    var konversiSatuan = [144, 20, 12, 1];
    var BarangTable = $('#BarangTable').DataTable();

    var form = document.getElementById("Stokbarang-CreateModal-CreateForm");
    console.log(form);
    var i;
    AddBarang(currentToken, form.elements["nama"].value.toString(), function(result)
    {
        if (result.token_status=="success")
        {
            console.log(result.barangID);
            var konversiAcuanBox;
            var acuanBox = form.elements["acuan-box-select"].value;
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
            AddSatuan(currentToken, result.barangID, form.elements["harga-jual-box-input"].value, "box", form.elements["isi-box-input"].val(), acuanBox, konversiAcuanBox,
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
                if (form.elements["harga-jual-"+satuan[i]+"check"].prop("checked"))
                {
                    AddSatuan(currentToken, result.barangID, form.elements["harga-jual-"+satuan[i]+"-input"].val(), satuan[i], konversiSatuan[i], "pcs", 1,
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
                var hargaJual  ="<span class='pull-right'>Rp. "+numberWithCommas(form.elements["#harga-jual-box"].val())+"</span>";
                var editButton = "<a class='edit-modal-toggle' data-toggle='modal' href='#editModal' data-id='" +
                    id +
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a class='delete-modal-toggle' href='#deleteModal' data-toggle='modal'  style='color:red;' data-id='" +
                    id +
                    "'><i class='glyphicon glyphicon-trash'></i></a>";
               // if (hasHakAkses("HargaPokokLaba"))
             //   {
                    var hargaPokok = "<span class='pull-right'>Rp. "+numberWithCommas(0)+"</span>";
                    BarangTable.row.add([
                        StrId,
                        form.elements["nama"].value.toString(),
                        "@ "+form.elements["isi-box-input"].value+" "+acuanBox,
                        stokReady,
                        hargaJual,
                        hargaPokok,
                        editButton+" "+delButton
                    ]).draw();
             /*   }
                else {
                    BarangTable.row.add([
                        StrId,
                        form.elements["nama"].value.toString(),
                        "@ "+form.elements["isi-box-input"].value+" "+acuanBox,
                        stokReady,
                        hargaJual,
                        editButton+" "+delButton
                    ]).draw();
                }
*/
                createAlert("success", "Barang baru "+StrId+" - "+form.elements["nama"].value.toString() +" berhasil ditambahkan");
                $("#createModal").modal('toggle');
            }
            else
            {
                createAlert("danger", "Data Barang gagal ditambahkan, mohon coba kembali");
            }
        }
        else {
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}

//INITIALIZATION FUNCTIONS
function InitStokBarangPage() {
    currentToken = localStorage.getItem("token");
    setPage("StokBarang");
    if (hasHakAkses("BarangTerjualterbanyak"))
    {
        $("#Stokbarang-BarangterlakuButton").show();
        document.getElementById("Stokbarang-BarangterlakuButton").onclick=function()
        {
            InitBarangTerjualTerbanyakPage();
        };
    }
    else
        {
        $("#Stokbarang-BarangterlakuButton").hide();
    }
    StokBarangPopulateData();
    $(document).on("click", ".edit-modal-toggle", function () {
        StokBarangPopulateEditModal(this);
    });
    var StokBarangSearchForm = document.getElementById("Stokbarang-SearchForm");
    $(".search-filter").keyup(function () {
        StokBarangSearch(
            StokBarangSearchForm.elements['kode'].value,
            StokBarangSearchForm.elements['nama'].value
        );
    });
    var allcheckbox = $('input[type="checkbox"].minimal');
    allcheckbox.iCheck({
        checkboxClass: "icheckbox_minimal-green"
    });
    allcheckbox.iCheck('uncheck');
    StokBarangCreateModalDisableHargaJualInput();
    $(".check-satuan").off("ifChanged");
    $(".check-satuan").on("ifChanged", function () {
        StokBarangCreateModalDisableHargaJualInput();
    });
    document.getElementById("Stokbarang-CreateModal-ConfirmButton").onclick= function () {
        StokBarangCreateBarangConfirm();
    };
}

