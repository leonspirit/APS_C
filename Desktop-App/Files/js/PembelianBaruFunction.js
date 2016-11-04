/**
 * Created by Billy on 07-Oct-16.
 */


console.log(localStorage.getItem("karyawanID"));
console.log(localStorage.getItem("hak_akses"));
console.log(localStorage.getItem("token"));
var currentToken = localStorage.getItem("token");

var DataSupplier = [];
var DataBarang = [];

function GetSupplier()
{
    GetAllSupplierData(currentToken, function(result){
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
    GetAllStokData(currentToken, function(result){
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
    inputBarang.setAttribute("onchange", "getSatuanBarangList(this);");
    inputBarang.setAttribute("class", "barang-select2 form-control input-data-"+rowNum.toString());
    cell2.appendChild(inputBarang);
    $("#input-"+rowNum.toString()+"-1").select2({
        data: DataBarang,
        placeholder:"-- Pilih Barang --",
        allowClear:true
    });

    var cell5  =row.insertCell(2);
    cell5.setAttribute("id", "isi-karton-"+rowNum.toString());

    var cell3 = row.insertCell(3);
    cell3.setAttribute("style", "padding:0");
    var inputJumlah = document.createElement("input");
    inputJumlah.setAttribute("id", "input-"+rowNum.toString()+"-2");
    inputJumlah.setAttribute("class", "form-control input-data"+rowNum.toString());
    inputJumlah.setAttribute("type", "number");
    inputJumlah.setAttribute("min", "0");
    inputJumlah.setAttribute("style", "width:100%;");
    inputJumlah.setAttribute("onchange", "DrawTable("+ rowNum.toString()+");");
    cell3.appendChild(inputJumlah);

    var cell4 = row.insertCell(4);
    cell4.setAttribute("style", "padding:0");
    var  inputSatuan = document.createElement("input");
    inputSatuan.setAttribute("class", "form-control satuan-select2");
    inputSatuan.setAttribute("id", "input-"+rowNum.toString()+"-3");
    inputSatuan.setAttribute("style", "width:100%;");
    cell4.appendChild(inputSatuan);
    $("#input-"+rowNum.toString()+"-3").select2({
        minimumResultsForSearch:Infinity,
        placeholder:"-- Pilih Unit --",
        allowClear:true
    });


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
    inputHarga.setAttribute("onchange", "DrawTable("+ rowNum.toString()+");");
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
    inputDisc1.setAttribute("onchange", "DrawTable("+ rowNum.toString()+");");
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
    inputDisc2.setAttribute("onchange", "DrawTable("+ rowNum.toString()+");");
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
    inputDisc3.setAttribute("onchange", "DrawTable("+ rowNum.toString()+");");
    var inputDiscLabel3 = document.createElement("span");
    inputDiscLabel3.setAttribute("class", "input-group-addon");
    inputDiscLabel3.innerHTML = "%";
    inputDiscContainer3.appendChild(inputDisc3);
    inputDiscContainer3.appendChild(inputDiscLabel3);
    cell9.appendChild(inputDiscContainer3);

    var cell10 = row.insertCell(9);
    var span  = document.createElement("span");
    span.setAttribute("class", "pull-right");
    span.innerHTML = "Rp. 0";
    cell10.appendChild(span);

    var cell11 = row.insertCell(10);
    var delButton = document.createElement("a");
    delButton.setAttribute("class", "del-row");
    delButton.setAttribute("onclick", "RemoveRow(this);");
    delButton.setAttribute("style", "color:red;");
    var delIcon = document.createElement("i");
    delIcon.setAttribute("class", "glyphicon glyphicon-remove");
    delButton.appendChild(delIcon);
    cell11.appendChild(delButton);
}

function RemoveRow(r)
{
    var tableBody = document.getElementById('itemTable').getElementsByTagName("tbody")[0];

    var i = r.parentNode.parentNode.rowIndex;
    console.log(i);

    var rowCount = tableBody.rows.length;
    var rowNum = rowCount-1;

    tableBody.deleteRow(i-1);

    var j;
    for (j=i;j<rowNum;j++)
    {
        console.log(j);
        tableBody.rows[j].cells[0].innerHTML = j.toString();
      /*  tableBody.rows[j].cells[1].childNodes[0].setAttribute("id","input-"+rowNum.toString()+"-1");
        tableBody.rows[j].cells[2].childNodes[0].setAttribute("id","input-"+rowNum.toString()+"-2");
        tableBody.rows[j].cells[3].childNodes[0].setAttribute("id","input-"+rowNum.toString()+"-3");
        tableBody.rows[j].cells[6].childNodes[0].setAttribute("id","input-"+rowNum.toString()+"-4");*/
    }
    DrawTable(0, true)
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

function getSatuanBarangList(selectBox)
{

    var rowIndex = selectBox.parentNode.parentNode.rowIndex;
    var barangID = selectBox.value;

    console.log(rowIndex);
    GetAllSatuanData(currentToken, barangID, function(result)
    {
        var i;
        var data =[];
        for (i=0;i<result.data.length;i++)
        {
           data.push({
              "id":result.data[i].satuanID,
               "text":result.data[i].satuan
           });
            if(result.data[i].satuan=="box")
            {
                console.log("lali");
                document.getElementById("isi-karton-"+rowIndex.toString()).innerHTML = "@ "+result.data[i].konversi.toString()+" "+result.data[i].satuan_acuan;
            }
        }
        $("#input-"+rowIndex.toString()+"-3").select2({
            data:data,
            minimumResultsForSearch:Infinity,
            placeholder:"-- Pilih Unit --",
            allowClear:true
        });
    })
}

function DrawTable(indexChanged)
{
    var i;
    var itemTable= document.getElementById("itemTable");

    if(indexChanged>=1 && indexChanged<itemTable.rows.length){
        var curRow =  itemTable.rows[indexChanged];
        var qty = curRow.cells[3].children[0].value;
        var hargaSatuan = curRow.cells[5].children[0].children[1].value;
        var disc1 = curRow.cells[6].children[0].children[0].value;
        var disc2 = curRow.cells[7].children[0].children[0].value;
        var disc3 = curRow.cells[8].children[0].children[0].value;
        //subtotal
        var Subtotal = parseInt((qty * hargaSatuan*(100-disc1-disc2-disc3))/100);
        curRow.cells[9].children[0].innerHTML = "Rp. "+numberWithCommas(Subtotal);
    }
    var TotalHarga = 0;
    var subtotalTambahanStr;
    var subtotalTambahan;

    for (i=1;i<itemTable.rows.length-1;i++)
    {
        subtotalTambahanStr = itemTable.rows[i].cells[9].children[0].innerHTML.toString().substring(4);
        subtotalTambahan = parseInt(subtotalTambahanStr.replace(',',''));
        TotalHarga += subtotalTambahan;
    }

    var discBesar = itemTable.rows[itemTable.rows.length-1].cells[2].children[0].children[0].value;
    console.log(discBesar);

    var TotalHargaAfterDisc = parseInt(TotalHarga *(100 - discBesar)/100);
    itemTable.rows[itemTable.rows.length-1].cells[4].children[0].innerHTML = "Rp. "+numberWithCommas(TotalHargaAfterDisc);
}
function SavePembelian(isPrinted)//PENTING
{
    var satuan = [];
    var itemTable= document.getElementById("itemTable");
    var i;
    for (i=1;i<itemTable.rows.length-1;i++){
        var curRow =  itemTable.rows[i];
        satuan.push({
            "satuanID":$("#input-"+i.toString()+"-3").val(),
            "quantity":curRow.cells[3].children[0].value,
            "disc1":curRow.cells[6].children[0].children[0].value,
            "disc2":curRow.cells[7].children[0].children[0].value,
            "disc3":curRow.cells[8].children[0].children[0].value,
            "harga_per_biji":curRow.cells[5].children[0].children[1].value
        });
    }
    var tglJatuhTempo, tglJatuhTempoTemp, status;
    if ($("#pilihanPembayaran").val()=="cash")
    {
        tglJatuhTempo=null;
        status = "lunas"
    }
    else
    {
        tglJatuhTempoTemp = new Date($("#tglJatuhTempo").datepicker().val());
        tglJatuhTempo = tglJatuhTempoTemp.getFullYear()+"-"+tglJatuhTempoTemp.getMonth()+"-"+tglJatuhTempoTemp.getDate();
        status = "belum lunas"
    }
    var tglTransaksiTemp = new Date($("#tglTransaksi").datepicker().val());
    var tglTransaksi = tglTransaksiTemp.getFullYear()+"-"+tglTransaksiTemp.getMonth()+"-"+tglTransaksiTemp.getDate();
    AddPembelian(
        currentToken,
        $("#inputSupplier").val(),
        tglTransaksi,
        tglJatuhTempo,
        parseInt(itemTable.rows[itemTable.rows.length-1].cells[4].children[0].innerHTML.substring(4).replace(',', '')),
        itemTable.rows[itemTable.rows.length-1].cells[2].children[0].children[0].value,
        isPrinted,
        status,
        satuan,
        function(result){
            if (result.token_status=="success")
            {
                console.log(result.pembelianID);
                ResetTable();
            }
            else
            {
                createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
            }
        }
    );
    console.log(tglJatuhTempo+tglTransaksi);
    console.log(satuan);
}
function ResetTable()
{
    var tableBody = document.getElementById('itemTable').getElementsByTagName("tbody")[0];
    while (true) {
        if (tableBody.rows.length==1)
            break;
        tableBody.deleteRow(-1);
    }
    tableBody.rows[0].cells[6].children[0].children[0].value = 0;
    tableBody.rows[0].cells[7].children[0].children[0].value = 0;
    tableBody.rows[0].cells[8].children[0].children[0].value = 0;
}