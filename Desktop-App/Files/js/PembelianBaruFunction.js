/**
 * Created by Billy on 07-Oct-16.
 */


var DataSupplier = [];
var DataBarang = [];

function GetSupplier()
{
    var token = "1234567890";
    GetAllSupplierData(token, function(result){
        if(result.token_status=="success")
        {
            var i;
            var pad ="00000";
            for (i=0;i<result.data.length;i++)
            {
                var id = "" + result.data[i].supplierID;
                var StrId  = "S"+ pad.substring(0, pad.length - id.length)+id;
                DataSupplier.push(
                    {
                        id: result.data[i].supplierID,
                        text: StrId+" - "+result.data[i].nama.toString()
                    });
            }
            $("#inputSupplier").select2({
                data: DataSupplier,
                placeholder:"-- Pilih Supplier --",
                allowClear:true

            });
        }
        else
        {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    })
}

function GetBarang()
{
    var token = "1234567890";
    GetAllStokData(token, function(result){
        if(result.token_status=="success")
        {
            var i;
            var pad ="00000";
            for (i=0;i<result.data.length;i++)
            {
                var id = "" + result.data[i].barangID;
                var StrId  = "C"+ pad.substring(0, pad.length - id.length)+id;
                DataBarang.push(
                    {
                        id: result.data[i].barangID,
                        text: StrId+" - "+result.data[i].nama.toString(),
                        nama: result.data[i].nama.toString(),
                        harga_pokok : result.data[i].harga_pokok

                    });
            }
            $(".barang-select2").select2({
                data: DataBarang,
                placeholder:"-- Pilih Barang --",
                allowClear:true
            });
        }
        else
        {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    })
}

function AddRow()
{
    var tableBody = document.getElementById('itemTable').getElementsByTagName("tbody")[0];

    var rowCount = tableBody.rows.length;
    var row = tableBody.insertRow(rowCount);
    var rowNum = rowCount+1;

    var cell1 = row.insertCell(0);
    cell1.innerHTML = rowNum.toString();

    var cell2 = row.insertCell(1);
    cell2.setAttribute("style", "padding:0");
    var inputBarang = document.createElement("input");
    inputBarang.setAttribute("id", "input-"+rowNum.toString()+"-1");
    inputBarang.setAttribute("style", "width:100%;");
    inputBarang.setAttribute("class", "barang-select2 form-control input-data-"+rowNum.toString());
    cell2.appendChild(inputBarang);

    var cell3 = row.insertCell(2);
    cell3.setAttribute("style", "padding:0");
    var inputJumlah = document.createElement("input");
    inputJumlah.setAttribute("id", "input-"+rowNum.toString()+"-2");
    inputJumlah.setAttribute("class", "form-control input-data"+rowNum.toString());
    inputJumlah.setAttribute("type", "number");
    inputJumlah.setAttribute("min", "0");
    inputJumlah.setAttribute("style", "width:100%;");
    cell3.appendChild(inputJumlah);

    var cell4 = row.insertCell(3);
    cell4.setAttribute("style", "padding:0");
    var  inputSatuan = document.createElement("select");
    inputSatuan.setAttribute("class", "form-control satuan-select2");
    inputSatuan.setAttribute("id", "input-"+rowNum.toString()+"-3");
    inputSatuan.setAttribute("style", "width:100%;");
    cell4.appendChild(inputSatuan);
    $("#input-"+rowNum.toString()+"-3").select2({
        minimumResultsForSearch:Infinity,
        placeholder:"-- Pilih Unit --",
        allowClear:true
    });

    var cell5  =row.insertCell(4);


    var cell6 = row.insertCell(5);
    cell6.setAttribute("style", "padding:0;");
    var  inputHargaContainer = document.createElement("div");
    inputHargaContainer.setAttribute("class", "input-group");
    inputHargaContainer.setAttribute("style", "width:100%");
    var inputHargaLabel = document.createElement("span");
    inputHargaLabel.setAttribute("class", "input-group-addon");
    inputHargaLabel.innerHTML = "Rp.";
    var inputHarga = document.createElement("input");
    inputHarga.setAttribute("type", "number");
    inputHarga.setAttribute("class", "form-control");
    inputHargaContainer.appendChild(inputHargaLabel);
    inputHargaContainer.appendChild(inputHarga);
    cell6.appendChild(inputHargaContainer);

    var cell7 = row.insertCell(6);
    cell7.setAttribute("style", "padding:0;");
    var  inputDiscContainer1 = document.createElement("div");
    inputDiscContainer1.setAttribute("class", "input-group");
    inputDiscContainer1.setAttribute("style", "width:100%");
    var inputDisc1 = document.createElement("input");
    inputDisc1.setAttribute("type", "number");
    inputDisc1.setAttribute("min", "0");
    inputDisc1.setAttribute("max", "100");
    inputDisc1.setAttribute("class", "form-control");
    var inputDiscLabel1 = document.createElement("span");
    inputDiscLabel1.setAttribute("class", "input-group-addon");
    inputDiscLabel1.innerHTML = "%";
    inputDiscContainer1.appendChild(inputDisc1);
    inputDiscContainer1.appendChild(inputDiscLabel1);
    cell7.appendChild(inputDiscContainer1);

    var cell8 = row.insertCell(7);
    cell8.setAttribute("style", "padding:0;");
    var  inputDiscContainer2 = document.createElement("div");
    inputDiscContainer2.setAttribute("class", "input-group");
    inputDiscContainer2.setAttribute("style", "width:100%");
    var inputDisc2 = document.createElement("input");
    inputDisc2.setAttribute("type", "number");
    inputDisc2.setAttribute("min", "0");
    inputDisc2.setAttribute("max", "100");
    inputDisc2.setAttribute("class", "form-control");
    var inputDiscLabel2 = document.createElement("span");
    inputDiscLabel2.setAttribute("class", "input-group-addon");
    inputDiscLabel2.innerHTML = "%";
    inputDiscContainer2.appendChild(inputDisc2);
    inputDiscContainer2.appendChild(inputDiscLabel2);
    cell8.appendChild(inputDiscContainer2);

    var cell9 = row.insertCell(8);
    cell9.setAttribute("style", "padding:0;");
    var  inputDiscContainer3 = document.createElement("div");
    inputDiscContainer3.setAttribute("class", "input-group");
    inputDiscContainer3.setAttribute("style", "width:100%");
    var inputDisc3 = document.createElement("input");
    inputDisc3.setAttribute("type", "number");
    inputDisc3.setAttribute("min", "0");
    inputDisc3.setAttribute("max", "100");
    inputDisc3.setAttribute("class", "form-control");
    var inputDiscLabel3 = document.createElement("span");
    inputDiscLabel3.setAttribute("class", "input-group-addon");
    inputDiscLabel3.innerHTML = "%";
    inputDiscContainer3.appendChild(inputDisc3);
    inputDiscContainer3.appendChild(inputDiscLabel3);
    cell9.appendChild(inputDiscContainer3);

    var cell10 = row.insertCell(9);
    cell10.innerHTML = "Rp. 0";

    var cell11 = row.insertCell(10);
    var delButton = document.createElement("a");
    delButton.setAttribute("class", "del-row")
    // delButton.setAttribute("onclick", "RemoveRow(this);")
    delButton.setAttribute("style", "color:red;")
    var delIcon = document.createElement("i");
    delIcon.setAttribute("class", "glyphicon glyphicon-remove");
    delButton.appendChild(delIcon);
    cell11.appendChild(delButton);
}


function HideJatuhTempo()
{
    if ($("#pilihanPembayaran").val() == "cash")
    {
        $("#containerJatuhTempo").hide();
    }
    else
    {
        $("#containerJatuhTempo").show();
    }
}