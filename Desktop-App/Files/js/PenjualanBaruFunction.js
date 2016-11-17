/**
 * Created by Billy on 06-Oct-16.
 */

var currentToken, DataPelanggan, DataBarang;

function PelangganMatcher (term, text) {
    if (text.toUpperCase().indexOf(term.toUpperCase()) != -1 || text==='+ Tambah Pelanggan Baru') {
        return true;
    }
    return false;
}

function BarangMatcher (term, text) {
    if (text.toUpperCase().indexOf(term.toUpperCase()) != -1 || text==='+ Tambah Barang Baru') {
        return true;
    }
    return false;
}

function formatOutput (optionElement) {
    if (optionElement.id ==0)
    {
        var $state = $('<strong>'+optionElement.text + '</strong>');
        return $state;
    }
    else {
        return optionElement.text;
    }
}



function PenjualanBaruGetPelanggan()
{
    GetAllPelangganData(currentToken, function(result){
        if(result.token_status=="success")
        {
            DataPelanggan = [];
            var i;
            var pad ="00000";
            for (i=0;i<result.data.length;i++)
            {
                DataPelanggan.push(
                    {
                        id: result.data[i].pelangganID,
                        text: result.data[i].nama.toString()
                    });
            }
            DataPelanggan.push(
                {
                    id: 0,
                    text: "+ Tambah Pelanggan Baru"
                });
            $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher){
                $("#Penjualanbaru-PelangganSelect").select2({
                    data: DataPelanggan,
                    placeholder:"-- Pilih Pelanggan --",
                    allowClear:true,
                    templateResult:formatOutput,
                    matcher:oldMatcher(PelangganMatcher)
                });
            });
        }
        else
        {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    })
}

function PenjualanBaruGetBarang()
{
    GetAllStokData(currentToken, function(result){
        if(result.token_status=="success")
        {
            DataBarang = [];
            var i;
            for (i=0;i<result.data.length;i++)
            {
               DataBarang.push(
                    {
                        id: result.data[i].barangID,
                        text: result.data[i].nama.toString(),
                        nama: result.data[i].nama.toString(),
                        harga_pokok : result.data[i].harga_pokok,
                        stok:result.data[i].stok
                    });
            }
            DataBarang.push(
                {
                    id: 0,
                    text: "+ Tambah Barang Baru"
                });
            $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
                $(".barang-select2").select2({
                    data: DataBarang,
                    placeholder: "-- Pilih Barang --",
                    allowClear: true,
                    templateResult:formatOutput,
                    matcher:oldMatcher(BarangMatcher)
                });
            });
        }
        else
        {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    })
}

function PenjualanBaruRemoveRow(r)
{
    var tableBody = document.getElementById('Penjualanbaru-ItemTable').getElementsByTagName("tbody")[0];

    var i = r.parentNode.parentNode.rowIndex;
    console.log(i);

    var rowCount = tableBody.rows.length;
    var rowNum = rowCount-1;

    tableBody.deleteRow(i-1);

    var j;
    for (j=i-1;j<rowNum;j++)
    {
        console.log(j);
        tableBody.rows[j].cells[0].innerHTML = (j+1).toString();
        tableBody.rows[j].cells[1].children[0].setAttribute("id","Penjualanbaru-Input-"+(j+1).toString()+"-1");
        tableBody.rows[j].cells[2].setAttribute("id", "Penjualanbaru-IsiboxText-"+(j+1).toString());
        tableBody.rows[j].cells[3].children[0].setAttribute("id","Penjualanbaru-Input-"+(j+1).toString()+"-2");
        tableBody.rows[j].cells[4].children[0].setAttribute("id","Penjualanbaru-Input-"+(j+1).toString()+"-3");
        tableBody.rows[j].cells[5].children[0].children[1].setAttribute("id","Penjualanbaru-Input-"+(j+1).toString()+"-4");
        tableBody.rows[j].cells[6].children[0].children[0].setAttribute("id","Penjualanbaru-Input-"+(j+1).toString()+"-5");
    }
    PenjualanBaruDrawTable(null)
}

function PenjualanBaruAddRow()
{
    var tableBody = document.getElementById('Penjualanbaru-ItemTable').getElementsByTagName("tbody")[0];

    var rowCount = tableBody.rows.length;
    var row = tableBody.insertRow(rowCount);
    var rowNum = rowCount+1;

    var cell1 = row.insertCell(0);
    cell1.innerHTML = rowNum.toString();

    var cell2 = row.insertCell(1);
    cell2.setAttribute("style", "padding:0");
    cell2.setAttribute("class", "form-group");
    var inputBarang = document.createElement("input");
    inputBarang.setAttribute("id", "Penjualanbaru-Input-"+rowNum.toString()+"-1");
    inputBarang.setAttribute("style", "width:100%;");
    inputBarang.setAttribute("onchange", "PenjualanBaruGetSatuanBarangList(this);PenjualanBaruDrawTable(this);");
    inputBarang.setAttribute("class", "barang-select2 form-control input-sm");
    cell2.appendChild(inputBarang);
    $("#Penjualanbaru-Input-"+rowNum.toString()+"-1").select2({
        data: DataBarang,
        placeholder:"-- Pilih Barang --",
        allowClear:true
    });

    var cell5 = row.insertCell(2);
    cell5.setAttribute("id", "Penjualanbaru-IsiboxText-"+rowNum.toString());

    var cell3 = row.insertCell(3);
    cell3.setAttribute("style", "padding:0");
    cell3.setAttribute("class", "form-group");
    var inputcontainer = document.createElement("div");
    inputcontainer.setAttribute("class", "form-group");
    var inputJumlah = document.createElement("input");
    inputJumlah.setAttribute("id", "Penjualanbaru-Input-"+rowNum.toString()+"-2");
    inputJumlah.setAttribute("class", "form-control");
    inputJumlah.setAttribute("type", "number");
    inputJumlah.setAttribute("min", "0");
    inputJumlah.setAttribute("style", "width:100%;");
    inputJumlah.setAttribute("onchange", "PenjualanBaruDrawTable(this,true.parentNode);PenjualanBaruCekItemStok(this.parentNode);");
    inputcontainer.appendChild(inputJumlah);
    cell3.appendChild(inputcontainer);

    var cell4 = row.insertCell(4);
    cell4.setAttribute("style", "padding:0");
    cell4.setAttribute("class", "form-group");
    var inputSatuan = document.createElement("input");
    inputSatuan.setAttribute("style", "width:100%");
    inputSatuan.setAttribute("onchange", "PenjualanBaruGetHargaUnitSatuan(this);PenjualanBaruDrawTable(this);PenjualanBaruCekItemStok(this);");
    inputSatuan.setAttribute("class", "form-control input-sm");
    inputSatuan.setAttribute("id", "Penjualanbaru-Input-"+rowNum.toString()+"-3");
    cell4.appendChild(inputSatuan);
    $("#Penjualanbaru-Input-"+rowNum.toString()+"-3").select2({
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
    inputHarga.setAttribute("onchange", "PenjualanBaruDrawTable(this.parentNode);");
    inputHarga.setAttribute("class", "form-control");
    inputHarga.setAttribute("id", "Penjualanbaru-Input-"+rowNum.toString()+"-4");
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
    inputDisc.setAttribute("class", "form-control");
    inputDisc.setAttribute("id", "Penjualanbaru-Input-"+rowNum.toString()+"-5");
    inputDisc.setAttribute("onchange", "PenjualanBaruDrawTable(this.parentNode);");
    inputDiscGroup.appendChild(inputDisc);
    inputDiscGroup.appendChild(inputDiscAddOn);
    cell8.appendChild(inputDiscGroup);

    var cell9 = row.insertCell(7);
    var subtotal = document.createElement("span");
    subtotal.setAttribute("class", "pull-right");
    subtotal.innerHTML = "Rp. 0";
    cell9.appendChild(subtotal);

    var celldelButton;
    if (hasHakAkses("HargaPokokLaba"))
    {
        var cell10 = row.insertCell(8);
        var hPokok = document.createElement("span");
        hPokok.setAttribute("id", "Penjualanbaru-hpokok-"+rowNum.toString());
        hPokok.setAttribute("class", "pull-right");
        hPokok.innerHTML = "Rp. 0";
        cell10.appendChild(hPokok);

        var cell11 = row.insertCell(9);
        var untung = document.createElement("span");
        untung.setAttribute("class", "pull-right");
        untung.innerHTML = "Rp. 0";
        cell11.appendChild(untung);
        celldelButton = row.insertCell(10);
    }
    else {
        celldelButton = row.insertCell(8);
    }

    var delButton = document.createElement("a");
    delButton.setAttribute("class", "del-row");
    delButton.setAttribute("onclick", "PenjualanBaruRemoveRow(this);");
    delButton.setAttribute("style", "color:red;");
    var delIcon = document.createElement("i");
    delIcon.setAttribute("class", "glyphicon glyphicon-remove");
    delButton.appendChild(delIcon);
    celldelButton.appendChild(delButton);
}
function PenjualanBaruResetTable() {
    var tableBody = document.getElementById('Penjualanbaru-ItemTable').getElementsByTagName("tbody")[0];

    while (true) {
        if (tableBody.rows.length==1)
            break;
        tableBody.deleteRow(-1);
    }
    tableBody.rows[0].cells[7].innerHTML = "<span class='pull-right'>Rp. 0</span>";
    if (hasHakAkses("HargaPokokLaba"))
    {
        tableBody.rows[0].cells[8].innerHTML = "<span class='pull-right'>Rp. 0</span>";
        tableBody.rows[0].cells[9].innerHTML = "<span class='pull-right'>Rp. 0</span>";
    }
}

function PenjualanBaruDrawTable(r) {

    var countLaba;
    if (hasHakAkses("HargaPokokLaba"))
    {
        countLaba=true;
    }
    else
        countLaba =false;
    var indexChanged;
    console.log(r);
    if (r != null){
        indexChanged =getRowIndex(r);
        console.log(indexChanged);
    }
    else {
        indexChanged = 0;
    }
    var i;
    var itemTable= document.getElementById("Penjualanbaru-ItemTable");
    if (countLaba)
    {
        var TotalLaba = 0;
        var labaTambahanStr;
        var labaTambahan;
        var hpokokStr;
        var hpokok;
        var laba;
    }
    if(indexChanged!=0 && indexChanged!=null){
        var curRow =  itemTable.rows[indexChanged];
        var qty = document.getElementById("Penjualanbaru-Input-"+indexChanged+"-2").value;
        var hargaSatuan = document.getElementById("Penjualanbaru-Input-"+indexChanged+"-4").value;
        var disc = document.getElementById("Penjualanbaru-Input-"+indexChanged+"-5").value;
        //subtotal
        var Subtotal = parseInt((qty * hargaSatuan*(100-disc))/100);
        curRow.cells[7].children[0].innerHTML = "Rp. "+numberWithCommas(Subtotal);

        if(countLaba)
        {
            hpokokStr = curRow.cells[8].children[0].innerHTML.toString().substring(4);
            hpokok = parseInt(hpokokStr.replace(',',''));
            laba = Subtotal - (hpokok*qty);
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

function PenjualanBaruHideJatuhTempo()
{
    if ($("#Penjualanbaru-PembayaranSelect").val() == "cash")
    {
        document.getElementById("Penjualanbaru-TgljatuhtempoDate").value="";
        document.getElementById("Penjualanbaru-TgljatuhtempoDate").disabled=true;
    }
    else
    {
        document.getElementById("Penjualanbaru-TgljatuhtempoDate").disabled= false;
    }
}


function PenjualanBaruGetSatuanBarangList(selectBox)
{
    var rowIndex = getRowIndex(selectBox);
    var barangID = selectBox.value;
    var hargaPokokPcs = $(selectBox).select2('data')[0].harga_pokok;
        console.log(hargaPokokPcs);
    console.log(rowIndex);
    GetAllSatuanData(currentToken, barangID, function(result)
    {
        var i;
        var data =[];
        for (i=0;i<result.data.length;i++)
        {
            data.push({
                "id":result.data[i].satuanID,
                "text":capitalizeFirstLetter(result.data[i].satuan),
                "harga_jual":result.data[i].harga_jual,
                "harga_pokok":result.data[i].konversi * result.data[i].konversi_acuan * hargaPokokPcs,
                "konversi_final":result.data[i].konversi * result.data[i].konversi_acuan
            });
            if(result.data[i].satuan=="box")
            {
                document.getElementById("Penjualanbaru-IsiboxText-"+rowIndex.toString()).innerHTML = "@ "+result.data[i].konversi.toString()+" "+result.data[i].satuan_acuan;
            }
        }
        $("#Penjualanbaru-Input-"+rowIndex.toString()+"-3").select2({
            data:data,
            minimumResultsForSearch:Infinity,
            placeholder:"-- Pilih Unit --",
            allowClear:true
        });
    })
}
function PenjualanBaruGetHargaUnitSatuan(selectBox)
{
    var rowIndex = getRowIndex(selectBox);
    document.getElementById("Penjualanbaru-Input-"+rowIndex.toString()+"-4").value = $("#Penjualanbaru-Input-"+rowIndex.toString()+"-3").select2('data')[0].harga_jual;
    if (hasHakAkses("HargaPokokLaba")) {
        document.getElementById("Penjualanbaru-hpokok-" + rowIndex.toString()).innerHTML = "Rp. " + numberWithCommas($("#Penjualanbaru-Input-" + rowIndex.toString() + "-3").select2('data')[0].harga_pokok);
    }
}

function PenjualanBaruSave(isPrinted) {
    var valid = true;
    var satuan = [];
    var itemTable = document.getElementById("Penjualanbaru-ItemTable");
    var i;
    var alamat = document.getElementById("Penjualanbaru-AlamatInput");
    var tglJatuhTempo, tglJatuhTempoTemp, status;

    var tglTransaksiValue = $("#Penjualanbaru-TgltransaksiDate").datepicker().val();
    var tglJatuhTempoValue= $("#Penjualanbaru-TgljatuhtempoDate").datepicker().val();

    if ($("#Penjualanbaru-PembayaranSelect").val() == "cash") {
        tglJatuhTempo = null;
        status = "lunas"
    }
    else {
        tglJatuhTempoTemp = new Date(tglJatuhTempoValue);
        tglJatuhTempo = tglJatuhTempoTemp.getFullYear() + "-" + (tglJatuhTempoTemp.getMonth() + 1) + "-" + tglJatuhTempoTemp.getDate();
        status = "belum lunas"
    }
    var tglTransaksiTemp = new Date(tglTransaksiValue);
    var tglTransaksi = tglTransaksiTemp.getFullYear() + "-" + (tglTransaksiTemp.getMonth() + 1) + "-" + tglTransaksiTemp.getDate();
    var voucher=[];

    var PelangganSelectValue = $("#Penjualanbaru-PelangganSelect").val();
    if (PelangganSelectValue==null ||PelangganSelectValue=="" || PelangganSelectValue==0)
    {
        valid=false;
        setWarning(document.getElementById("Penjualanbaru-PelangganSelect"), "Data Pelanggan harus diisi");
    }
    if (tglTransaksiValue==null || tglTransaksiValue=='')
    {
        valid=false;
        setWarning(document.getElementById("Penjualanbaru-TgltransaksiDate"), "Tgl transaksi harus diisi");
    }
    if ($("#Penjualanbaru-PembayaranSelect").val()=="bon" && (tglJatuhTempoValue==null || tglJatuhTempoValue==''))
    {
        valid=false;
        setWarning(document.getElementById("Penjualanbaru-TgljatuhtempoDate"), "Tgl jatuh tempo harus diisi bila membayar dengan bon");
    }
    if (alamat.value=='' || alamat.value==null)
    {
        valid=false;
        setWarning(alamat, "Alamat pengiriman harus diisi");
    }
    for (i=1;i<itemTable.rows.length-1;i++)
    {
        var BarangSelectValue = $("#Penjualanbaru-Input-"+i+"-1").val();
        if (BarangSelectValue == null || BarangSelectValue=='')
        {
            valid=false;
            setWarning(document.getElementById("Penjualanbaru-Input-"+i+"-1"),"Barang harus diisi");
        }
        var qty = document.getElementById("Penjualanbaru-Input-"+i.toString()+"-2");
        if (qty.value=='' || qty.value==null || qty.value==0)
        {
            valid=false;
            setWarning(qty,"hrs diisi");
        }
        var satuanselect  =$("#Penjualanbaru-Input-"+i.toString()+"-3").val();
        if (satuanselect=='' || satuanselect==null)
        {
            valid=false;
            setWarning(document.getElementById("Penjualanbaru-Input-"+i.toString()+"-3"), "satuan harus diisi")
        }
    }
    console.log(voucher);
    if (valid) {
        for (i = 1; i < itemTable.rows.length - 1; i++) {
            satuan.push({
                "satuanID": $("#Penjualanbaru-Input-" + i.toString() + "-3").val(),
                "quantity": document.getElementById("Penjualanbaru-Input-" + i.toString() + "-2").value,
                "disc": document.getElementById("Penjualanbaru-Input-" + i.toString() + "-5").value,
                "harga_jual_saat_ini": document.getElementById("Penjualanbaru-Input-" + i.toString() + "-4").value
            });
        }
        AddPenjualan(
            currentToken,
            $("#Penjualanbaru-PelangganSelect").val(),
            tglTransaksi,
            tglJatuhTempo,
            parseInt(itemTable.rows[itemTable.rows.length - 1].cells[2].children[0].innerHTML.substring(4).replace(',', '')),
            isPrinted,
            status,
            $("#Penjualanbaru-NotesInput").val(),
            alamat.value,
            satuan,
            voucher,
            function (result) {
                if (result != null && result.token_status == "success") {
                    console.log(result.penjualanID);
                    PenjualanBaruResetTable();
                    var pad = "0000";
                    var id = "" + result.penjualanID;
                    var StrId = "TJ" + pad.substring(0, pad.length - id.length) + id;
                    createAlert("success", "Data Penjualan baru " + StrId + " berhasil ditambahkan");
                }
                else {
                    createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
                }
            }
        );
    }
}

function PenjualanBaruCreatePelangganConfirm()
{
    var valid=true;
    var formData = document.getElementById("Penjualanbaru-CreatepelangganModal-CreateForm");
    var nama = formData.elements['nama'].value;
    var telp = formData.elements['telp'].value;
    var alamat = formData.elements['alamat'].value;
    if (nama=="" || nama==null)
    {
        valid=false;
    }
    if (valid)
    {
        console.log("valid");
        AddPelanggan(currentToken, nama, telp, alamat, function(result){
            if (result.token_status=="success")
            {
                if  (result.supplierID != null)
                {
                    var pad ="00000";
                    var id = "" + result.supplierID;
                    var StrId  = "P"+ pad.substring(0, pad.length - id.length)+id;
                    console.log('fungsi3');
                    $("#Pembelianbaru-CreatesupplierModal").modal('toggle');
                    formData.reset();
                    createAlert("success", "Pelanggan baru "+StrId+" - "+nama +" berhasil ditambahkan");
                    console.log('fungsi4');
                    DataPelanggan.pop();
                    DataPelanggan.push({
                        id:id,
                        text:nama
                    });
                    DataPelanggan.push({
                        id:0,
                        text:"+ Tambah Pelanggan Baru"
                    });
                    $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher){
                        $("#Penjualanbaru-PelangganSelect").select2({
                            data: DataPelanggan,
                            placeholder:"-- Pilih Pelanggan --",
                            allowClear:true,
                            templateResult:formatOutput,
                            matcher:oldMatcher(SupplierMatcher)
                        });
                    });
                    $("#Penjualanbaru-PelangganSelect").select2().val(id.toString()).trigger("change");
                }
                else {
                    console.log("Add Pelanggan failed");
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
}


function PenjualanBaruCekItemStok(node)
{
    var rowIndex = getRowIndex(node);//node.parentNode.parentNode.rowIndex;
   // console.log(getRowIndex(node));
    var barang_dibeli_satuan = document.getElementById("Penjualanbaru-Input-"+rowIndex.toString()+"-2").value;
    var satuanselected =$("#Penjualanbaru-Input-"+rowIndex.toString()+"-3");
    var barangselected =$("#Penjualanbaru-Input-"+rowIndex.toString()+"-1");
    if (satuanselected.val()!=null && satuanselected.val()!='' && barangselected.val()!=null && barangselected.val()!='' && barangselected.val()!=0)
    {
        var stok = barangselected.select2('data')[0].stok;
        var konversiFinal = satuanselected.select2('data')[0].konversi_final;
        var barang_dibeli_final = barang_dibeli_satuan * konversiFinal;
        if (barang_dibeli_final>stok){

            setWarning(document.getElementById("Penjualanbaru-Input-"+rowIndex.toString()+"-2"),"Stok tdk cukup");
            return true
        }
        else {
            removeThisWarning(node);
            return false;
        }
    }
    else return false
}
function PenjualanBaruCekHargaRugi(node) {

}


function InitPenjualanBaruPage()
{
    currentToken = localStorage.getItem("token");
    setPage("PenjualanBaru");
    PenjualanBaruGetPelanggan();
    PenjualanBaruGetBarang();
    PenjualanBaruHideJatuhTempo();
    var barang_select2= $(".barang-select2");
    barang_select2.off("change");

    $("#Penjualanbaru-PembayaranSelect").select2({
        minimumResultsForSearch:Infinity,
        placeholder:"-- Pilih cara pembayaran --",
        allowClear:true
    }).on("change", function(){
        PenjualanBaruHideJatuhTempo();
    });
    $('#Penjualanbaru-TgltransaksiDate').datepicker({
        autoclose: true
    });
    $('#Penjualanbaru-TgljatuhtempoDate').datepicker({
        autoclose: true
    });
    var tableBody = document.getElementById('Penjualanbaru-ItemTable').getElementsByTagName("tbody")[0];
    if (tableBody.rows.length<1)
        PenjualanBaruAddRow();
    document.getElementById("Penjualanbaru-AddButton").onclick = function()
    {
        window.scrollTo(0, document.body.scrollHeight);
        PenjualanBaruAddRow();
    };
    document.getElementById("Penjualanbaru-ResetButton").onclick = function()
    {
        PenjualanBaruResetTable();
    };
    document.getElementById("Penjualanbaru-SaveButton").onclick=function()
    {
        PenjualanBaruSave(0);
    };
    document.getElementById("Penjualanbaru-PelangganSelect").onchange=function()
    {
        if ($("#Penjualanbaru-PelangganSelect").val()==0)
            $("#Penjualanbaru-CreatepelangganModal").modal('toggle');
    };
    barang_select2.on("change", function()
    {
        if ($(this).val()==0)
            $("#Penjualanbaru-CreatebarangModal").modal('toggle');
    });
    document.getElementById("Penjualanbaru-CreatepelangganModal-ConfirmButton").onclick=function()
    {
        PenjualanBaruCreatePelangganConfirm();
    };
    if (!hasHakAkses("HargaPokokLaba"))
    {
        $(".Penjualanbaru-ItemTable-HargapokoklabaColumn").hide();
    }
    else {
        $(".Penjualanbaru-ItemTable-HargapokoklabaColumn").show();
    }

}