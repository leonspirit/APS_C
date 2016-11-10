/**
 * Created by Billy on 06-Oct-16.
 */


console.log(localStorage.getItem("karyawanID"));
console.log(localStorage.getItem("hak_akses"));
console.log(localStorage.getItem("token"));
var currentToken = localStorage.getItem("token");

var DataPelanggan = [];
var DataBarang = [];

function GetPelanggan()
{
    GetAllPelangganData(currentToken, function(result){
        if(result.token_status=="success")
        {
            var i;
            var pad ="00000";
            for (i=0;i<result.data.length;i++)
            {
                var id = "" + result.data[i].pelangganID;
                var StrId  = "P"+ pad.substring(0, pad.length - id.length)+id;
                DataPelanggan.push(
                    {
                        id: result.data[i].pelangganID,
                        text: StrId+" - "+result.data[i].nama.toString()
                    });
            }
            $("#inputPelanggan").select2({
                data: DataPelanggan,
                placeholder:"-- Pilih Pelanggan --",
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
        tableBody.rows[j].cells[1].childNodes[0].setAttribute("id","input-"+rowNum.toString()+"-1");
        tableBody.rows[j].cells[3].childNodes[0].setAttribute("id","input-"+rowNum.toString()+"-2");
        tableBody.rows[j].cells[4].childNodes[0].setAttribute("id","input-"+rowNum.toString()+"-3");
        tableBody.rows[j].cells[5].childNodes[0].setAttribute("id","input-"+rowNum.toString()+"-4");
        tableBody.rows[j].cells[6].childNodes[0].setAttribute("id","input-"+rowNum.toString()+"-5");
    }
    DrawTable(0, true)
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
    inputBarang.setAttribute("onchange", "getSatuanBarangList(this);DrawTable("+ rowNum.toString()+",true);");
    inputBarang.setAttribute("class", "barang-select2 form-control input-sm input-data-"+rowNum.toString());
    cell2.appendChild(inputBarang);
    $("#input-"+rowNum.toString()+"-1").select2({
        data: DataBarang,
        placeholder:"-- Pilih Barang --",
        allowClear:true
    });

    var cell5 = row.insertCell(2);
    cell5.setAttribute("id", "isi-karton-"+rowNum.toString());

    var cell3 = row.insertCell(3);
    cell3.setAttribute("style", "padding:0");
    var inputJumlah = document.createElement("input");
    inputJumlah.setAttribute("id", "input-"+rowNum.toString()+"-2");
    inputJumlah.setAttribute("class", "form-control input-data"+rowNum.toString());
    inputJumlah.setAttribute("type", "number");
    inputJumlah.setAttribute("min", "0");
    inputJumlah.setAttribute("style", "width:100%;");
    inputJumlah.setAttribute("onchange", "DrawTable("+ rowNum.toString()+",true);");
    cell3.appendChild(inputJumlah);

    var cell4 = row.insertCell(4);
    cell4.setAttribute("style", "padding:0");
    var inputSatuan = document.createElement("input");
    inputSatuan.setAttribute("style", "width:100%");
    inputSatuan.setAttribute("onchange", "getHargaUnitSatuan(this);");
    inputSatuan.setAttribute("class", "form-control input-sm input-data-"+rowNum.toString());
    inputSatuan.setAttribute("id", "input-"+rowNum.toString()+"-3");
    cell4.appendChild(inputSatuan);
    $("#input-"+rowNum.toString()+"-3").select2({
        minimumResultsForSearch:Infinity,
        placeholder:"-- Pilih Unit --",
        allowClear:true
    });


    var cell7 = row.insertCell(5);
    cell7.setAttribute("style", "padding:0");
    var inputHargaGroup = document.createElement("div");
    inputHargaGroup.setAttribute("style", "width:100%;");
    inputHargaGroup.setAttribute("class", "input-group");
    var inputHargaAddOn = document.createElement("span");
    inputHargaAddOn.setAttribute("class","input-group-addon");
    inputHargaAddOn.innerHTML="Rp.";
    var inputHarga= document.createElement("input");
    inputHarga.setAttribute("type", "number");
    inputHarga.setAttribute("onchange", "DrawTable("+ rowNum+",true);");
    inputHarga.setAttribute("class", "form-control input-data-"+rowNum.toString());
    inputHarga.setAttribute("id", "input-"+rowNum.toString()+"-4");
    inputHargaGroup.appendChild(inputHargaAddOn);
    inputHargaGroup.appendChild(inputHarga);
    cell7.appendChild(inputHargaGroup);

    var cell8 = row.insertCell(6);
    cell8.setAttribute("style", "padding:0");
    var inputDiscGroup = document.createElement("div");
    inputDiscGroup.setAttribute("style", "width:100%;");
    inputDiscGroup.setAttribute("class", "input-group");
    var inputDiscAddOn = document.createElement("span");
    inputDiscAddOn.setAttribute("class","input-group-addon");
    inputDiscAddOn.innerHTML="%";
    var inputDisc= document.createElement("input");
    inputDisc.setAttribute("type", "number");
    inputDisc.setAttribute("min", "0");
    inputDisc.setAttribute("max", "100");
    inputDisc.setAttribute("class", "form-control input-data-"+rowNum.toString());
    inputDisc.setAttribute("id", "input-"+rowNum.toString()+"-5");
    inputDisc.setAttribute("onchange", "DrawTable("+ rowNum.toString()+",true);");
    inputDiscGroup.appendChild(inputDisc);
    inputDiscGroup.appendChild(inputDiscAddOn);
    cell8.appendChild(inputDiscGroup);

    var cell9 = row.insertCell(7);
    var subtotal = document.createElement("span");
    subtotal.setAttribute("class", "pull-right");
    subtotal.innerHTML = "Rp. 0";
    cell9.appendChild(subtotal);

    //if admin
    var cell10 = row.insertCell(8);
    var hPokok = document.createElement("span");
    hPokok.setAttribute("class", "pull-right");
    hPokok.innerHTML = "Rp. 0";
    cell10.appendChild(hPokok);

    var cell11 = row.insertCell(9);
    var untung = document.createElement("span");
    untung.setAttribute("class", "pull-right");
    untung.innerHTML = "Rp. 0";
    cell11.appendChild(untung);

    var cell12 = row.insertCell(10);
    var delButton = document.createElement("a");
    delButton.setAttribute("class", "del-row");
    delButton.setAttribute("onclick", "RemoveRow(this);");
    delButton.setAttribute("style", "color:red;");
    var delIcon = document.createElement("i");
    delIcon.setAttribute("class", "glyphicon glyphicon-remove");
    delButton.appendChild(delIcon);
    cell12.appendChild(delButton);
}
function ResetTable() {
    var tableBody = document.getElementById('itemTable').getElementsByTagName("tbody")[0];

    while (true) {
        if (tableBody.rows.length==1)
            break;
        tableBody.deleteRow(-1);
    }
    tableBody.rows[0].cells[7].innerHTML = "Rp. 0";
    tableBody.rows[0].cells[8].innerHTML = "Rp. 0";
    tableBody.rows[0].cells[9].innerHTML = "Rp. 0";
}

function DrawTable(indexChanged, countLaba)
{
    var i;
    var itemTable= document.getElementById("itemTable");
    if (countLaba)
    {
        var TotalLaba = 0;
        var labaTambahanStr;
        var labaTambahan;
        var hpokokStr;
        var hpokok;
        var laba;
    }
    if(indexChanged!=0){
        var curRow =  itemTable.rows[indexChanged];
        var qty = curRow.cells[3].children[0].value;
        var hargaSatuan = curRow.cells[5].children[0].children[1].value;
        var disc = curRow.cells[6].children[0].children[0].value;

        //subtotal
        var Subtotal = parseInt((qty * hargaSatuan*(100-disc))/100);
        curRow.cells[7].children[0].innerHTML = "Rp. "+numberWithCommas(Subtotal);

        if(countLaba)
        {
            hpokokStr = curRow.cells[8].children[0].innerHTML.toString().substring(4);
            hpokok = parseInt(hpokokStr.replace(',',''));
            laba = Subtotal - hpokok;
            curRow.cells[9].children[0].innerHTML = "Rp. "+numberWithCommas(laba);
        }
    }
    var TotalHarga = 0;
    var subtotalTambahanStr;
    var subtotalTambahan;

    for (i=1;i<itemTable.rows.length-1;i++)
    {
        subtotalTambahanStr = itemTable.rows[i].cells[7].children[0].innerHTML.toString().substring(4);
        subtotalTambahan = parseInt(subtotalTambahanStr.replace(',',''));
        TotalHarga += subtotalTambahan;
        if (countLaba)
        {
            labaTambahanStr = itemTable.rows[i].cells[9].children[0].innerHTML.toString().substring(4);
            labaTambahan = parseInt(subtotalTambahanStr.replace(',',''));
            TotalLaba += subtotalTambahan;
        }

    }
    itemTable.rows[itemTable.rows.length-1].cells[2].children[0].innerHTML = "Rp. "+numberWithCommas(TotalHarga);
    if (countLaba)
    {
        itemTable.rows[itemTable.rows.length-1].cells[4].children[0].innerHTML = "Rp. "+numberWithCommas(TotalLaba);
    }
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
                "text":result.data[i].satuan,
                "harga_jual":result.data[i].harga_jual
            });
            if(result.data[i].satuan=="box")
            {
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
function getHargaUnitSatuan(selectBox)
{
    var rowIndex = selectBox.parentNode.parentNode.rowIndex;
    document.getElementById("input-"+rowIndex.toString()+"-4").value = $("#input-"+rowIndex.toString()+"-3").select2('data')[0].harga_jual;
}

function SavePenjualan()
{
    var satuan = [];
    var itemTable= document.getElementById("itemTable");
    var i;
    for (i=1;i<itemTable.rows.length-1;i++){
        var curRow =  itemTable.rows[i];
        satuan.push({
            "satuanID":$("#input-"+i.toString()+"-3").val(),
            "quantity":$("#input-"+i.toString()+"-2").val(),
            "disc":$("#input-"+i.toString()+"-5").val(),
            "harga_per_biji":curRow.cells[5].children[0].children[1].value
        });
    }
}

function InitPenjualanBaruPage()
{
    setPage("PenjualanBaru");
    GetPelanggan();
    GetBarang();
    HideJatuhTempo();

    var currentHakAkses = JSON.parse(localStorage.getItem("hak_akses"));
    generateMenu("PenjualanBaru", currentHakAkses);

    $("#pilihanPembayaran").select2({
        minimumResultsForSearch:Infinity,
        placeholder:"-- Pilih cara pembayaran --",
        allowClear:true
    }).on("change", function(){
        HideJatuhTempo();
    });
    $('#tanggalPenjualan').datepicker({
        autoclose: true
    });
    $('#tanggalJatuhTempo').datepicker({
        autoclose: true
    });

    AddRow();
    document.getElementById("addButton").onclick = function()
    {
        window.scrollTo(0, document.body.scrollHeight);
        AddRow();
    };
    document.getElementById("resetButton").onclick = function()
    {
        ResetTable();
    }
}