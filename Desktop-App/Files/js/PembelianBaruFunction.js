/**
 * Created by Billy on 07-Oct-16.
 */

var currentToken = localStorage.getItem("token");

var DataBarang, DataSupplier;
function PembelianBaruGetSupplier()
{

    GetAllSupplierData(currentToken, function(result){
        if(result.token_status=="success")
        {
            DataSupplier = [];
            var i;
            var pad ="00000";
            for (i=0;i<result.data.length;i++)
            {
               // var id = "" + result.data[i].supplierID;
               // var StrId  = "S"+ pad.substring(0, pad.length - id.length)+id;
                DataSupplier.push(
                    {
                        id: result.data[i].supplierID,
                        text: result.data[i].nama.toString()
                    });
            }
            $("#Pembelianbaru-SupplierSelect").select2({
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

function PembelianBaruGetBarang()
{
    GetAllStokData(currentToken, function(result){
        if(result.token_status=="success")
        {
            DataBarang = [];
            var i;
            var pad ="00000";
            for (i=0;i<result.data.length;i++)
            {
               DataBarang.push(
                    {
                        id: result.data[i].barangID,
                        text: result.data[i].nama.toString(),
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

function PembelianBaruAddRow()
{
    var tableBody = document.getElementById('Pembelianbaru-ItemTable').getElementsByTagName("tbody")[0];

    var rowCount = tableBody.rows.length;
    var row = tableBody.insertRow(rowCount);
    var rowNum = rowCount+1;

    var cell1 = row.insertCell(0);
    cell1.innerHTML = rowNum.toString();


    var cell2 = row.insertCell(1);
    cell2.setAttribute("style", "padding:0");
    var inputBarang = document.createElement("input");
    inputBarang.setAttribute("id", "Pembelianbaru-Input-"+rowNum.toString()+"-1");
    inputBarang.setAttribute("style", "width:100%;");
    inputBarang.setAttribute("onchange", "PembelianBaruGetSatuanBarangList(this);");
    inputBarang.setAttribute("class", "barang-select2 form-control");
    cell2.appendChild(inputBarang);
    $("#Pembelianbaru-Input-"+rowNum.toString()+"-1").select2({
        data: DataBarang,
        placeholder:"-- Pilih Barang --",
        allowClear:true
    });

    var cell5  =row.insertCell(2);
    cell5.setAttribute("id", "Pembelianbaru-IsiboxText-"+rowNum.toString());

    var cell3 = row.insertCell(3);
    cell3.setAttribute("style", "padding:0");
    var inputJumlah = document.createElement("input");
    inputJumlah.setAttribute("id", "Pembelianbaru-Input-"+rowNum.toString()+"-2");
    inputJumlah.setAttribute("class", "form-control");
    inputJumlah.setAttribute("type", "number");
    inputJumlah.setAttribute("min", "0");
    inputJumlah.setAttribute("style", "width:100%;");
    inputJumlah.setAttribute("onchange", "PembelianBaruDrawTable("+ rowNum.toString()+");");
    cell3.appendChild(inputJumlah);

    var cell4 = row.insertCell(4);
    cell4.setAttribute("style", "padding:0");
    var  inputSatuan = document.createElement("input");
    inputSatuan.setAttribute("class", "form-control satuan-select2");
    inputSatuan.setAttribute("id", "Pembelianbaru-Input-"+rowNum.toString()+"-3");
    inputSatuan.setAttribute("style", "width:100%;");
    cell4.appendChild(inputSatuan);
    $("#Pembelianbaru-Input-"+rowNum.toString()+"-3").select2({
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
    inputHarga.setAttribute("onchange", "PembelianBaruDrawTable("+ rowNum.toString()+");");
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
    inputDisc1.setAttribute("onchange", "PembelianBaruDrawTable("+ rowNum.toString()+");");
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
    inputDisc2.setAttribute("onchange", "PembelianBaruDrawTable("+ rowNum.toString()+");");
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
    inputDisc3.setAttribute("onchange", "PembelianBaruDrawTable("+ rowNum.toString()+");");
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
    delButton.setAttribute("onclick", "PembelianBaruRemoveRow(this);");
    delButton.setAttribute("style", "color:red;");
    var delIcon = document.createElement("i");
    delIcon.setAttribute("class", "glyphicon glyphicon-remove");
    delButton.appendChild(delIcon);
    cell11.appendChild(delButton);
}

function PembelianBaruRemoveRow(r)
{
    var tableBody = document.getElementById('Pembelianbaru-ItemTable').getElementsByTagName("tbody")[0];

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
    PembelianBaruDrawTable(0, true)
}

function PembelianBaruHideJatuhTempo()
{
    if ($("#Pembelianbaru-PembayaranSelect").val() == "cash")
    {
        $("#Pembelianbaru-JatuhtempoContainer").hide();
    }
    else
    {
        $("#Pembelianbaru-JatuhtempoContainer").show();
    }
}

function PembelianBaruGetSatuanBarangList(selectBox)
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
                document.getElementById("Pembelianbaru-IsiboxText-"+rowIndex.toString()).innerHTML = "@ "+result.data[i].konversi.toString()+" "+result.data[i].satuan_acuan;
            }
        }
        $("#Pembelianbaru-Input-"+rowIndex.toString()+"-3").select2({
            data:data,
            minimumResultsForSearch:Infinity,
            placeholder:"-- Pilih Unit --",
            allowClear:true
        });
        console.log($("#Pembelianbaru-Input-"+rowIndex.toString()+"-3").val());

    })
}

function PembelianBaruDrawTable(indexChanged)
{
    var i;
    var itemTable= document.getElementById("Pembelianbaru-ItemTable");

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
function PembelianBaruSave(isPrinted)//PENTING
{
    var satuan = [];
    var itemTable= document.getElementById("Pembelianbaru-ItemTable");
    var i;
    var tglJatuhTempo, tglJatuhTempoTemp, status;
    var tglTransaksiValue = $("#Pembelianbaru-TgltransaksiDate").datepicker().val();
    var tglJatuhTempoValue= $("#Pembelianbaru-TgljatuhtempoDate").datepicker().val();
    if ($("#Pembelianbaru-PembayaranSelect").val()=="cash")
    {
        tglJatuhTempo=null;
        status = "lunas"
    }
    else
    {
        tglJatuhTempoTemp = new Date(tglJatuhTempoValue);
        tglJatuhTempo = tglJatuhTempoTemp.getFullYear()+"-"+tglJatuhTempoTemp.getMonth()+"-"+tglJatuhTempoTemp.getDate();
        status = "belum lunas"
    }
    var tglTransaksiTemp = new Date(tglTransaksiValue);
    var tglTransaksi = tglTransaksiTemp.getFullYear()+"-"+tglTransaksiTemp.getMonth()+"-"+tglTransaksiTemp.getDate();
    var valid = true;
    var SupplierSelectValue = $("#Pembelianbaru-SupplierSelect").val();
    if (SupplierSelectValue==null ||SupplierSelectValue=='')
    {
        valid=false;
        setWarning(document.getElementById("Pembelianbaru-SupplierSelect"), "Data supplier harus diisi");
    }
    if (tglTransaksiValue==null || tglTransaksiValue=='')
    {
        valid=false;
        setWarning(document.getElementById("Pembelianbaru-TgltransaksiDate"), "Tanggal trransaksi harus diisi");
    }
    if (valid)
    {
        for (i=1;i<itemTable.rows.length-1;i++){
            var curRow =  itemTable.rows[i];
            satuan.push({
                "satuanID":$("#Pembelianbaru-Input-"+i.toString()+"-3").val(),
                "quantity":curRow.cells[3].children[0].value,
                "disc1":curRow.cells[6].children[0].children[0].value,
                "disc2":curRow.cells[7].children[0].children[0].value,
                "disc3":curRow.cells[8].children[0].children[0].value,
                "harga_per_biji":curRow.cells[5].children[0].children[1].value
            });
        }
        AddPembelian(
            currentToken,
            SupplierSelectValue,
            tglTransaksi,
            tglJatuhTempo,
            parseInt(itemTable.rows[itemTable.rows.length-1].cells[4].children[0].innerHTML.substring(4).replace(',', '')),
            itemTable.rows[itemTable.rows.length-1].cells[2].children[0].children[0].value,
            isPrinted,
            status,
            "",//todo:notes
            satuan,
            function(result){
                if (result.token_status=="success")
                {
                    console.log(result.pembelianID);
                    PembelianBaruResetTable();
                    var pad ="0000";
                    var id = "" + result.pembelianID;
                    var StrId  = "TB"+ pad.substring(0, pad.length - id.length)+id;
                    createAlert("success", "Data Pembelian baru "+StrId+" berhasil ditambahkan");
                }
                else
                {
                    createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
                }
            }
        );
    }
}
function PembelianBaruResetTable()
{
    var tableBody = document.getElementById('Pembelianbaru-ItemTable').getElementsByTagName("tbody")[0];
    while (true) {
        if (tableBody.rows.length==1)
            break;
        tableBody.deleteRow(-1);
    }
    tableBody.rows[0].cells[6].children[0].children[0].value = 0;
    tableBody.rows[0].cells[7].children[0].children[0].value = 0;
    tableBody.rows[0].cells[8].children[0].children[0].value = 0;
}
function InitPembelianBaruPage()
{
    setPage("PembelianBaru");
    PembelianBaruGetSupplier();
    PembelianBaruGetBarang();
    PembelianBaruHideJatuhTempo();
    $("#Pembelianbaru-PembayaranSelect").select2({
        minimumResultsForSearch:Infinity,
        placeholder:"-- Pilih cara pembayaran --",
        allowClear:true
    }).on("change", function(){
        PembelianBaruHideJatuhTempo();
    });

    $('#Pembelianbaru-TgljatuhtempoDate').datepicker({
        autoclose: true
    });
    $('#Pembelianbaru-TgltransaksiDate').datepicker({
        autoclose: true
    });
    document.getElementById("Pembelianbaru-SaveButton").onclick=function()
    {
        PembelianBaruSave(0);
    };
    document.getElementById("Pembelianbaru-AddButton").onclick = function()
    {
        window.scrollTo(0, document.body.scrollHeight);
        PembelianBaruAddRow();
    };
    document.getElementById("Pembelianbaru-ResetButton").onclick = function()
    {
        PembelianBaruResetTable();
    };
    var tableBody = document.getElementById('Pembelianbaru-ItemTable').getElementsByTagName("tbody")[0];
    if (tableBody.rows.length<1)
        PembelianBaruAddRow();
}