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

                var HargaJual =
                    '<span class="pull-right">' +
                    'Rp. ' + numberWithCommas(result2.data[i2].harga_jual) +
                    '</span>';

                var HargaPokok =
                    '<span class="pull-right">' +
                    'Rp. ' + numberWithCommas(barangEntry.harga_pokok * result2.data[i2].konversi) +
                    '</span>';

                var StokReady = '<span class="pull-right">' +
                    numberWithCommas(barangEntry.stok) +
                    '</span>';

                var editButton = "<a class='edit-modal-toggle' data-toggle='modal' href='#editModal' data-id='" +
                    id +
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a class='delete-modal-toggle' href='#deleteModal' data-toggle='modal'  style='color:red;' data-id='" +
                    id +
                    "'><i class='glyphicon glyphicon-trash'></i></a>";
                BarangTable.row.add([
                    StrId,
                    barangEntry.nama,
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

function AddCreateModalSatuanRow()
{
    var tableBody = document.getElementById('addBarangSatuanTable');

    var rowCount = tableBody.rows.length;
    var row = tableBody.insertRow(rowCount);
    // var rowNum = rowCount+1;

    var tdContainer1 = row.insertCell(0);
    tdContainer1.setAttribute("style", "padding:0px");

    var selectSatuan = document.createElement("select");
    selectSatuan.setAttribute("class", "form-control select-satuan");
    var ListSatuan = ["Box", "Grs", "Kod", "Lsn", "Pcs"];
    for (var i =0;i<ListSatuan.length ; i++)
    {
        var optionSatuan = document.createElement("option");
        optionSatuan.setAttribute("value", ListSatuan[i]);
        optionSatuan.innerHTML = ListSatuan[i];
        selectSatuan.appendChild(optionSatuan);
    }

    tdContainer1.appendChild(selectSatuan);

    var tdContainer2 = row.insertCell(1);
    tdContainer2.setAttribute("style", "padding:0px");

    var inputGroupKonversi = document.createElement("div");
    inputGroupKonversi.setAttribute("class", "input-group");

    var inputKonversi = document.createElement("input");
    inputKonversi.setAttribute("type", "number");
    inputKonversi.setAttribute("class", "form-control");
    inputKonversi.setAttribute("placeholder", "isi");

    var InputGroupDropDown2 = document.createElement("div");
    InputGroupDropDown2.setAttribute("class", "input-group-btn");
    var InputGroupDropDown = document.createElement("div");
    InputGroupDropDown.setAttribute("class", "input-group-btn");
    var BtnInputGroupDropDown = document.createElement("button");
    BtnInputGroupDropDown.setAttribute("type", "button");
    BtnInputGroupDropDown.setAttribute("class", "btn btn-default dropdown-toggle");
    BtnInputGroupDropDown.setAttribute("data-toggle", "dropdown");
    BtnInputGroupDropDown.innerHTML= "Grs";
    var OptionInputGroupDropDown = document.createElement("ul");
    OptionInputGroupDropDown.setAttribute("class", "dropdown-menu");
    var Satuan = ['Grs', 'Kod', 'Lsn', 'Pcs'];
    var SatuanNode=[];
    for(i =0;i<4;i++)
    {
        SatuanNode.push(document.createElement("li"));
        var LinkSatuanNode = document.createElement("a");
        LinkSatuanNode.setAttribute("data-value", Satuan[i]);
       LinkSatuanNode.innerHTML = Satuan[i];

        SatuanNode[i].appendChild(LinkSatuanNode);
        OptionInputGroupDropDown.appendChild(SatuanNode[i]);
    }
    InputGroupDropDown.appendChild(BtnInputGroupDropDown);
    InputGroupDropDown.appendChild(OptionInputGroupDropDown);
    InputGroupDropDown2.appendChild(InputGroupDropDown);

    inputGroupKonversi.appendChild(inputKonversi);
    inputGroupKonversi.appendChild(InputGroupDropDown2);

    tdContainer2.appendChild(inputGroupKonversi);

    var tdContainer3 = row.insertCell(2);
    tdContainer3.setAttribute("style", "padding:0px");

    var inputGroup = document.createElement("div");
    inputGroup.setAttribute("class", "input-group");

    var inputGroupAddon = document.createElement("div");
    inputGroupAddon.setAttribute("class", "input-group-addon");
    inputGroupAddon.innerHTML = "Rp.";

    var inputField = document.createElement("input");
    inputField.setAttribute("type", "number");
    inputField.setAttribute("class", "form-control");
    inputField.setAttribute("placeholder", "Harga Jual");

    inputGroup.appendChild(inputGroupAddon);
    inputGroup.appendChild(inputField);

    tdContainer3.appendChild(inputGroup);

    var tdContainer4 = row.insertCell(3);

    var delButton = document.createElement("a");
    delButton.setAttribute("style", "color:red;");
    var delIcon = document.createElement("i");
    delIcon.setAttribute("class", "glyphicon glyphicon-remove");
    delButton.appendChild(delIcon);

    tdContainer4.appendChild(delButton);

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

    var formData = $("#create-barang-form").serializeArray();
    console.log(formData);
    var i;
    AddBarang(currentToken, formData[0].value.toString(), function(result)
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
        AddSatuan(currentToken, result.barangID, $("#harga-jual-box").val(), "box", formData[2].value*konversiAcuanBox, acuanBox, konversiAcuanBox,function(result3){
            console.log(result3.satuanID);
        });
        for (i=0;i<satuan.length;i++)
        {
            if ($("#check-harga-jual-"+satuan[i]).prop("checked"))
            {
                AddSatuan(currentToken, result.barangID, $("#harga-jual-"+satuan[i]).val(), satuan[i], konversiSatuan[i], "pcs", 1, function(result2){
                    console.log(result2.satuanID);
                });
            }
        }
    });

}

