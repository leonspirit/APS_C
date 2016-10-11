/**
 * Created by Billy on 01-Oct-16.
 */

console.log(localStorage.getItem("karyawanID"));
console.log(localStorage.getItem("hak_akses"));
console.log(localStorage.getItem("token"));

function populateStokData() {
    var BarangTable = $('#BarangTable').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false
    });
    var token = "1234567890";
    GetAllStokData(token, function (result) {
        if (result.token_status == "success") {
            var i;
            for (i = 0; i < result.data.length; i++) {

                var pad = "00000";
                var id = "" + result.data[i].barangID;
                var StrId = "C" + pad.substring(0, pad.length - id.length) + id;

                var HargaJual =
                    '<span class="pull-right">' +
                    'Rp. ' + numberWithCommas(0) +
                    '</span>';

                var HargaPokok =
                    '<span class="pull-right">' +
                    'Rp. ' + numberWithCommas(0) +
                    '</span>';

                var StokReady = '<span class="pull-right">' +
                    numberWithCommas(result.data[i].stok) +
                    '</span>';

                var editButton = "<a class='edit-modal-toggle' data-toggle='modal' href='#editModal' data-id='" +
                    id +
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a class='delete-modal-toggle' href='#deleteModal' data-toggle='modal'  style='color:red;' data-id='" +
                    id +
                    "'><i class='glyphicon glyphicon-trash'></i></a>";
                BarangTable.row.add([
                    StrId,
                    result.data[i].nama,
                    StokReady,
                    HargaJual,
                    HargaPokok,
                    editButton + " " + delButton
                ]).draw();
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

    function AddCreateTableRow()
    {
        var tableBody = document.getElementById('addBarangSatuanTable')

        var rowCount = tableBody.rows.length;
        var row = tableBody.insertRow(rowCount);
        // var rowNum = rowCount+1;

        var tdContainer1 = row.insertCell(0);
        tdContainer1.setAttribute("style", "padding:0px");

        var selectSatuan = document.createElement("select");
        selectSatuan.setAttribute("class", "form-control select-satuan");
        var ListSatuan = ["Box", "Gros", "Kod", "Lsn", "Pcs"];
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
        delButton.setAttribute("style", "color:red;")
        var delIcon = document.createElement("i");
        delIcon.setAttribute("class", "glyphicon glyphicon-trash");
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

    function ConvertSatuan(field)
    {

        var resultField = $(field).closest('tr').find('td:eq(1)');
        var satuan = field.value;
        if (satuan=="Pcs")
        {
            resultField.val(1);
            resultField.setAttribute("disabled");
        }
        else if (satuan == "Lsn")
        {
            resultField.val(12);
            resultField.setAttribute("disabled");
        }
        else if (satuan == "Grs")
        {
            resultField.val(144);
            resultField.setAttribute("disabled");
        }
        else if (satuan == "Kod")
        {
            resultField.val(20);
            resultField.setAttribute("disabled");
        }

    }
    function ResetCreateTableSatuan()
    {
        var tableBody = document.getElementById('addBarangSatuanTable');

        while (true) {
            if (tableBody.rows.length==6)
                break;
            tableBody.deleteRow(-1);
        }
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


