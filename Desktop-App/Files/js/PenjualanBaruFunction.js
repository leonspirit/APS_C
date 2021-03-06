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

function formatSelection(val) {
   // console.log("val");
    //console.log(val);
    if (val.id != '' && val.id !=null)
    {
        var pad = "00000";
        var id = "" + val.id;
        var StrId = "C" + pad.substring(0, pad.length - id.length) + id;
        return StrId;
    }
    else
    {
        return "--Pilih Barang--";
    }
}


function PenjualanBaruGetPelanggan()
{
    GetAllPelangganData(currentToken, function(result){
        if(result.token_status=="success")
        {
            DataPelanggan = [];
            var i;
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
                    id: "new",
                    text: "+ Tambah Pelanggan Baru"
                });
            $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher){
                $("#Penjualanbaru-PelangganSelect").select2({
                   // formatSelection: formatSelection,
                    data: DataPelanggan,
                    placeholder:"-- Pilih Pelanggan --",
                    allowClear:true,
                    templateResult:formatOutput,
                    matcher:oldMatcher(PelangganMatcher)
					//containerCssClass: ':all:'
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
                        harga_pokok : result.data[i].harga_pokok,
                        stok:result.data[i].stok
                    });
            }
            DataBarang.push(
                {
                    id: "new",
                    text: "+ Tambah Barang Baru"
                });
            $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
                $(".barang-select2").select2({
                    templateSelection: formatSelection,
                    data: DataBarang,
                    //placeholder: "-- Pilih Barang --",
                    allowClear: false,
                    templateResult:formatOutput,
                    matcher:oldMatcher(BarangMatcher),
                    dropdownCssClass : 'bigdrop'
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
        tableBody.rows[j].cells[1].children[0].setAttribute("id","Penjualanbaru-Input-"+twoDigitPad(j+1)+"-1");
        tableBody.rows[j].cells[2].children[0].setAttribute("id","Penjualanbaru-Input-"+twoDigitPad(j+1)+"-2");
        tableBody.rows[j].cells[3].setAttribute("id", "Penjualanbaru-IsiboxText-"+(j+1));
        tableBody.rows[j].cells[4].children[0].setAttribute("id","Penjualanbaru-Input-"+twoDigitPad(j+1)+"-3");
        tableBody.rows[j].cells[5].children[0].setAttribute("id","Penjualanbaru-Input-"+twoDigitPad(j+1)+"-4");
        tableBody.rows[j].cells[6].children[0].children[1].setAttribute("id","Penjualanbaru-Input-"+twoDigitPad(j+1)+"-5");
        tableBody.rows[j].cells[7].children[0].children[0].setAttribute("id","Penjualanbaru-Input-"+twoDigitPad(j+1)+"-6");
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
    cell2.setAttribute("style", "padding:0;width:85px;");
    cell2.setAttribute("class", "form-group");
    var inputBarang = document.createElement("input");
    inputBarang.setAttribute("id", "Penjualanbaru-Input-"+twoDigitPad(rowNum)+"-1");
   // inputBarang.setAttribute("style", "width:100%;");
    inputBarang.setAttribute("onchange", "PenjualanBaruInputBarangChangeListener(this);");
    inputBarang.setAttribute("class", "barang-select2 form-control");


    cell2.appendChild(inputBarang);
    //cell2.appendChild(inputNamaBarang);
    $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
        $("#Penjualanbaru-Input-" + twoDigitPad(rowNum)+ "-1").select2({
            templateSelection: formatSelection,
            data: DataBarang,
            placeholder: "-- Pilih Barang --",
            allowClear: true,
            templateResult: formatOutput,
            matcher: oldMatcher(BarangMatcher),
            dropdownCssClass : 'bigdrop'
        });
    });
    $("#Penjualanbaru-Input-" + twoDigitPad(rowNum)+ "-1").on("select2:select", function(e){PenjualanBaruMoveToNext(this);});

    var cellNamaBarang = row.insertCell(2);
    cellNamaBarang.setAttribute("style", "padding:0;");
    var inputNamaBarang = document.createElement("input");
    //inputNamaBarang.setAttribute("style", "width:70%;");
    inputNamaBarang.setAttribute("class", "form-control");
    inputNamaBarang.setAttribute("onkeydown", "PenjualanBaruMoveToNext(this);");
    inputNamaBarang.setAttribute("id", "Penjualanbaru-Input-"+twoDigitPad(rowNum)+"-2");
    cellNamaBarang.appendChild(inputNamaBarang);

    var cell5 = row.insertCell(3);
    cell5.setAttribute("id", "Penjualanbaru-IsiboxText-"+rowNum);

    var cell3 = row.insertCell(4);
    cell3.setAttribute("style", "padding:0");
    cell3.setAttribute("class", "form-group");
   // var inputcontainer = document.createElement("div");
  //  inputcontainer.setAttribute("class", "form-group");
    var inputJumlah = document.createElement("input");
    inputJumlah.setAttribute("id", "Penjualanbaru-Input-"+twoDigitPad(rowNum)+"-3");
    inputJumlah.setAttribute("class", "form-control");
    inputJumlah.setAttribute("type", "number");
    inputJumlah.setAttribute("min", "0");
    inputJumlah.setAttribute("style", "width:100%;");
    inputJumlah.setAttribute("onchange", "PenjualanBaruInputQtyChangeListener(this);");
    inputJumlah.setAttribute("onkeydown", "PenjualanBaruMoveToNext(this);");
  //  inputcontainer.appendChild(inputJumlah);
    cell3.appendChild(inputJumlah);

    var cell4 = row.insertCell(5);
    cell4.setAttribute("style", "padding:0");
    cell4.setAttribute("class", "form-group");
    var inputSatuan = document.createElement("input");
    inputSatuan.setAttribute("style", "width:100%");
    inputSatuan.setAttribute("onchange", "PenjualanBaruInputSatuanChangeListener(this);");
    inputSatuan.setAttribute("class", "form-control input-sm");
    inputSatuan.setAttribute("id", "Penjualanbaru-Input-"+twoDigitPad(rowNum)+"-4");
    cell4.appendChild(inputSatuan);
    $("#Penjualanbaru-Input-"+twoDigitPad(rowNum)+"-4").select2({
   //     minimumResultsForSearch:Infinity,
        placeholder:"-- Pilih Unit --",
        allowClear:true
    });
    $("#Penjualanbaru-Input-" + twoDigitPad(rowNum)+ "-4").on("select2:select", function(e){PenjualanBaruMoveToNext(this);});

    var cell7 = row.insertCell(6);
    cell7.setAttribute("style", "padding:0");
    cell7.setAttribute("class", "form-group");
    var inputHargaGroup = document.createElement("div");
    inputHargaGroup.setAttribute("style", "width:100%;");
    inputHargaGroup.setAttribute("class", "input-group");
    var inputHargaAddOn = document.createElement("span");
    inputHargaAddOn.setAttribute("class","input-group-addon");
    inputHargaAddOn.innerHTML="Rp.";
    var inputHarga= document.createElement("input");
    inputHarga.setAttribute("type", "number");
    inputHarga.setAttribute("onchange", "PenjualanBaruInputHargaChangeListener(this);");
    inputHarga.setAttribute("onkeydown", "PenjualanBaruMoveToNext(this);");
    inputHarga.setAttribute("class", "form-control");
    inputHarga.setAttribute("id", "Penjualanbaru-Input-"+twoDigitPad(rowNum)+"-5");
    inputHarga.setAttribute("id", "Penjualanbaru-Input-"+twoDigitPad(rowNum)+"-5");
    inputHargaGroup.appendChild(inputHargaAddOn);
    inputHargaGroup.appendChild(inputHarga);
    cell7.appendChild(inputHargaGroup);

    var cell8 = row.insertCell(7);
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
    inputDisc.setAttribute("id", "Penjualanbaru-Input-"+twoDigitPad(rowNum)+"-6");
    inputDisc.setAttribute("onchange", "PenjualanBaruInputDiscChangeListener(this);");
    inputDisc.setAttribute("onkeydown", "PenjualanBaruMoveToNext(this);");
    inputDiscGroup.appendChild(inputDisc);
    inputDiscGroup.appendChild(inputDiscAddOn);
    cell8.appendChild(inputDiscGroup);

    var cell9 = row.insertCell(8);
    var subtotal = document.createElement("span");
    subtotal.setAttribute("class", "pull-right");
    subtotal.innerHTML = "Rp. 0";
    cell9.appendChild(subtotal);

    var celldelButton;
    if (hasHakAkses("HargaPokokLaba"))
    {
        var cell10 = row.insertCell(9);
        var hPokok = document.createElement("span");
        hPokok.setAttribute("id", "Penjualanbaru-hpokok-"+rowNum.toString());
        hPokok.setAttribute("class", "pull-right");
        hPokok.innerHTML = "Rp. 0";
        cell10.appendChild(hPokok);

        var cell11 = row.insertCell(10);
        var untung = document.createElement("span");
        untung.setAttribute("class", "pull-right");
        untung.innerHTML = "Rp. 0";
        cell11.appendChild(untung);

        celldelButton = row.insertCell(11);
    }
    else {
        celldelButton = row.insertCell(9);
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
    console.log("wewegombel");
    var hakhargaPokokLaba  = hasHakAkses("HargaPokokLaba");
    removeWarning();
    PenjualanBaruGetBarang();
    PenjualanBaruGetPelanggan();

    var tableBody = document.getElementById('Penjualanbaru-ItemTable').getElementsByTagName("tbody")[0];
    var tableFoot = document.getElementById('Penjualanbaru-ItemTable').getElementsByTagName("tfoot")[0];

    while (true) {
        if (tableBody.rows.length==1)
            break;
        tableBody.deleteRow(-1);
    }

    $("#Penjualanbaru-PembayaranSelect").val('cash').trigger('change');
    document.getElementById("Penjualanbaru-TgltransaksiDate").value="";
    document.getElementById("Penjualanbaru-TgljatuhtempoDate").value="";

    $("#Penjualanbaru-PelangganSelect").val('').trigger('change');
    $("#Penjualanbaru-Input-01-1").val('').trigger('change');
    $("#Penjualanbaru-Input-01-4").empty().trigger('change');

    document.getElementById("Penjualanbaru-AlamatInput").value = '';
    document.getElementById("Penjualanbaru-NotesInput").value = '';
    document.getElementById("Penjualanbaru-IsiboxText-1").innerHTML = '';
    document.getElementById("Penjualanbaru-Input-01-2").value='';
    document.getElementById("Penjualanbaru-Input-01-3").value='';
    document.getElementById("Penjualanbaru-Input-01-5").value='';
    document.getElementById("Penjualanbaru-Input-01-6").value='';

     tableBody.rows[0].cells[8].children[0].innerHTML = "Rp. 0";
    //console.log("minyak");
   // console.log(tableBody.rows[0].cells[7].children[0]);
    if (hakhargaPokokLaba)
    {
       tableBody.rows[0].cells[9].children[0].innerHTML = "Rp. 0";
        tableBody.rows[0].cells[10].children[0].innerHTML = "Rp. 0";
    }
    while (true) {
        if (tableFoot.rows.length==1)
            break;
        tableFoot.deleteRow(-1);
    }
    var data=[];
    $("#Penjualanbaru-Input-01-4").select2({
        data:data,
        placeholder:"-- Pilih Unit --",
        allowClear:true
    });

    tableFoot.rows[0].cells[2].children[0].innerHTML = "Rp. 0";
    if (hakhargaPokokLaba)
        tableFoot.rows[0].cells[4].children[0].innerHTML = "Rp. 0";
    removeWarning();
}

function PenjualanBaruDrawTable(r) {


    var countLaba = hasHakAkses("HargaPokokLaba");


    var indexChanged;
    console.log(r);
    if (r != null){
        indexChanged =getRowIndex(r);
   //     console.log(indexChanged);
    }
    else {
        indexChanged = 0;
    }
    var i;
    var itemTable= document.getElementById("Penjualanbaru-ItemTable");
    var tableFoot = document.getElementById("Penjualanbaru-ItemTable").getElementsByTagName("tfoot")[0];
    var posisitotal =itemTable.rows.length- tableFoot.rows.length;
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
        var qty = document.getElementById("Penjualanbaru-Input-"+twoDigitPad(indexChanged)+"-3").value;
        var hargaSatuan = document.getElementById("Penjualanbaru-Input-"+twoDigitPad(indexChanged)+"-5").value;
        var disc = document.getElementById("Penjualanbaru-Input-"+twoDigitPad(indexChanged)+"-6").value;
        //subtotal
        var Subtotal = parseInt((qty * hargaSatuan*(100-disc))/100);
        curRow.cells[8].children[0].innerHTML = "Rp. "+numberWithCommas(Subtotal);

        if(countLaba)
        {
            hpokokStr = curRow.cells[9].children[0].innerHTML.toString().substring(4);
            hpokok = parseInt(hpokokStr.replace(/,/g,''));
            laba = Subtotal - (hpokok*qty);
            curRow.cells[10].children[0].innerHTML = "Rp. "+numberWithCommas(laba);
        }
    }
    var TotalHarga = 0;
    var subtotalTambahanStr;
    var subtotalTambahan;

    for (i=1;i<posisitotal;i++)
    {
        subtotalTambahanStr = itemTable.rows[i].cells[8].children[0].innerHTML.toString().substring(4);
        subtotalTambahan = parseInt(subtotalTambahanStr.replace(/,/g,''));
        TotalHarga += subtotalTambahan;
        if (countLaba)
        {
            labaTambahanStr = itemTable.rows[i].cells[10].children[0].innerHTML.toString().substring(4);
            console.log(labaTambahanStr);
            labaTambahan = parseInt(labaTambahanStr.replace(/,/g,''));
            console.log(labaTambahan);
            TotalLaba += labaTambahan;
        }
    }

    itemTable.rows[posisitotal].cells[2].children[0].innerHTML = "Rp. "+numberWithCommas(TotalHarga);
    if (countLaba)
    {
        console.log(TotalLaba);
        itemTable.rows[posisitotal].cells[4].children[0].innerHTML = "Rp. "+numberWithCommas(TotalLaba);
    }
     if (tableFoot.rows.length>1)
     {
         var totalpengurangan=0;
         for (i=1;i<tableFoot.rows.length-1;i++)
         {
             var penguranganText = tableFoot.rows[i].cells[1].children[0].innerHTML;
             var pengurangan = parseInt(penguranganText.substring(5).replace(/,/g,''));
             totalpengurangan+=pengurangan;
         }
         var GrandTotal = TotalHarga-totalpengurangan;
         tableFoot.rows[tableFoot.rows.length-1].cells[1].children[0].innerHTML = "Rp. "+numberWithCommas(GrandTotal);
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

function PenjualanBaruDisableHargaPokokField()
{
    var form = document.getElementById("Penjualanbaru-CreatebarangModal-CreateForm");
    var stok = form.elements['stok'].value;
    if (stok==0 || stok=='' || stok==null)
    {
        form.elements['harga-pokok-input'].disabled= true;
    }else {
        form.elements['harga-pokok-input'].disabled= false;
    }
}

function PenjualanBaruGetSatuanBarangList(selectBox)
{
    var rowIndex = getRowIndex(selectBox);
    var barangID = selectBox.value;
    if (barangID!=null && barangID!=0)
    {
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
                    document.getElementById("Penjualanbaru-IsiboxText-"+rowIndex).innerHTML = "@ "+result.data[i].konversi.toString()+" "+result.data[i].satuan_acuan;
                }
            }
            $("#Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-4").select2({
                data:data,
               // minimumResultsForSearch:Infinity,
                placeholder:"-- Pilih Unit --",
                allowClear:true
            });
            $("#Penjualanbaru-Input-" + twoDigitPad(rowIndex)+ "-4").on("select2:select", function(e){PenjualanBaruMoveToNext(this);});
        })
    }
}
function PenjualanBaruGetHargaUnitSatuan(selectBox)
{
    var rowIndex = getRowIndex(selectBox);
   // console.log($("#Penjualanbaru-Input-"+rowIndex.toString()+"-3").val());
    if ($("#Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-4").val())
    {
        var hargajual = $("#Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-4").select2('data')[0].harga_jual;
        document.getElementById("Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-5").value = hargajual;
        var hpokok =$("#Penjualanbaru-Input-" + twoDigitPad(rowIndex) + "-4").select2('data')[0].harga_pokok;
        if (hasHakAkses("HargaPokokLaba")) {

            if (hpokok)
            {
                console.log(rowIndex);
                document.getElementById("Penjualanbaru-hpokok-" + rowIndex.toString()).innerHTML = "Rp. " + numberWithCommas(Math.round(hpokok));
            }
        }
    }
}

function PenjualanBaruSave(isPrinted, callback) {
    console.log("lala");
    removeWarning();
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
    var tableFoot = document.getElementById("Penjualanbaru-ItemTable").getElementsByTagName("tfoot")[0];
    if (tableFoot.rows.length>=2)
    {
        for (i=1;i<tableFoot.rows.length-1;i++)
        {
            voucher.push({
                voucherpenjualanID:tableFoot.rows[i].cells[0].getAttribute("data-id")
            });
        }
    }

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
    for (i=1;i<itemTable.rows.length-tableFoot.rows.length;i++)
    {
        var BarangSelectValue = $("#Penjualanbaru-Input-"+twoDigitPad(i)+"-1").val();
        if (BarangSelectValue == null || BarangSelectValue=='' || BarangSelectValue==0)
        {
            valid=false;
            setWarning(document.getElementById("Penjualanbaru-Input-"+twoDigitPad(i)+"-1"),"Barang harus diisi");
        }
        var qty = document.getElementById("Penjualanbaru-Input-"+twoDigitPad(i)+"-3");
        if (qty.value=='' || qty.value==null || qty.value==0)
        {
            valid=false;
            setWarning(qty,"hrs diisi");
        }
        var satuanselect  =$("#Penjualanbaru-Input-"+twoDigitPad(i)+"-4").val();
        if (satuanselect=='' || satuanselect==null)
        {
            valid=false;
            setWarning(document.getElementById("Penjualanbaru-Input-"+twoDigitPad(i)+"-4"), "satuan harus diisi")
        }
        var hargaUntung = PenjualanBaruCekHargaRugi(document.getElementById("Penjualanbaru-Input-"+twoDigitPad(i)+"-5"));
        if (!hargaUntung)
            valid=false;
        var adastok  = PenjualanBaruCekItemStok(document.getElementById("Penjualanbaru-Input-"+twoDigitPad(i)+"-3"));
        if (!adastok)
            valid =false;
    }
    console.log(valid);
    if (!valid)
    {
       // return -1;
        callback(-1);
    }
    else {
        for (i = 1; i < itemTable.rows.length - tableFoot.rows.length; i++) {
            satuan.push({
                "satuanID": $("#Penjualanbaru-Input-" + twoDigitPad(i) + "-4").val(),
                "nama_barang":document.getElementById("Penjualanbaru-Input-" + twoDigitPad(i) + "-2").value,
                "quantity": document.getElementById("Penjualanbaru-Input-" + twoDigitPad(i) + "-3").value,
                "disc": document.getElementById("Penjualanbaru-Input-" + twoDigitPad(i) + "-6").value,
                "harga_jual_saat_ini": document.getElementById("Penjualanbaru-Input-" + twoDigitPad(i) + "-5").value
            });
        }
        AddPenjualan(
            currentToken,
            $("#Penjualanbaru-PelangganSelect").val(),
            tglTransaksi,
            tglJatuhTempo,
            parseInt(itemTable.rows[itemTable.rows.length - tableFoot.rows.length].cells[2].children[0].innerHTML.substring(4).replace(/,/g, '')),
            isPrinted,
            status,
            $("#Penjualanbaru-NotesInput").val(),
            alamat.value,
            satuan,
            voucher,
            function (result) {
                if (result != null && result.token_status == "success") {
                    callback( result.penjualanID);
                }
                else {
                   callback( -2);
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
         AddPelanggan(currentToken, nama, telp, alamat, function(result){
            if (result.token_status=="success")
            {
                if  (result.pelangganID != null)
                {
                    var pad ="00000";
                    var id = "" + result.pelangganID;
                    var StrId  = "P"+ pad.substring(0, pad.length - id.length)+id;
                    $("#Penjualanbaru-CreatepelangganModal").modal('toggle');
                    formData.reset();
                    createAlert("success", "Pelanggan baru "+StrId+" - "+nama +" berhasil ditambahkan");
                    DataPelanggan.pop();
                    DataPelanggan.push({
                        id:id,
                        text:nama
                    });
                    DataPelanggan.push({
                        id:"new",
                        text:"+ Tambah Pelanggan Baru"
                    });
                    $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher){
                        $("#Penjualanbaru-PelangganSelect").select2({
                            data: DataPelanggan,
                           // placeholder:"-- Pilih Pelanggan --",
                            allowClear:false,
                            templateResult:formatOutput,
                            matcher:oldMatcher(SupplierMatcher)
                        });
                    });
                    $("#Penjualanbaru-PelangganSelect").select2().val(id.toString()).trigger("change");
                }
                else {
                    console.log("Add Pelanggan failed");
                    createAlert("danger", "Data pelanggan gagal ditambahkan, mohon coba kembali");
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


function    PenjualanBaruCreateBarangModalDisableHargaJualInput()
{
    var form = document.getElementById("Penjualanbaru-CreatebarangModal-CreateForm");

    var satuanlokal =["grs", "kod", "lsn", "pcs"];
    var i;

    for (i=0;i<satuanlokal.length;i++)
    {
        if ($("#Penjualanbaru-CreatebarangModal-harga-jual-"+satuanlokal[i]+"-check").prop("checked"))
        {
            form.elements["harga-jual-"+satuanlokal[i]+"-input"].disabled =false;
            $("#Penjualanbaru-CreatebarangModal-SatuanStokSelect-"+satuanlokal[i]+"Option").show();
            $("#Penjualanbaru-CreatebarangModal-SatuanHpokokSelect-"+satuanlokal[i]+"Option").show();
        }
        else
        {
            form.elements["harga-jual-"+satuanlokal[i]+"-input"].disabled= true;
            $("#Penjualanbaru-CreatebarangModal-SatuanStokSelect-"+satuanlokal[i]+"Option").hide();
            $("#Penjualanbaru-CreatebarangModal-SatuanHpokokSelect-"+satuanlokal[i]+"Option").hide();
        }
    }
}


function PenjualanBaruCekItemStok(node)
{
    var rowIndex = getRowIndex(node);//node.parentNode.parentNode.rowIndex;
   // console.log(getRowIndex(node));
    var barang_dibeli_satuan = document.getElementById("Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-3").value;
    var satuanselected =$("#Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-4");
    var barangselected =$("#Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-1");
    if (satuanselected.val()!=null && satuanselected.val()!='' && barangselected.val()!=null && barangselected.val()!='' && barangselected.val()!=0)
    {
        var stok = barangselected.select2('data')[0].stok;
        var konversiFinal = satuanselected.select2('data')[0].konversi_final;
        var barang_dibeli_final = barang_dibeli_satuan * konversiFinal;
        if (barang_dibeli_final>stok){

            setWarning(document.getElementById("Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-3"),"Stok tdk cukup");
            return false;
        }
        else {
            removeThisWarning(node);
            return true;
        }
    }
    else return false;
}
function PenjualanBaruCekHargaRugi(node) {
    var rowIndex = getRowIndex(node);
    var qty= document.getElementById("Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-3").value;
    var hargasatuan =  document.getElementById("Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-5").value;
    var disc =  document.getElementById("Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-6").value;

    var satuanselector = $("#Penjualanbaru-Input-" + twoDigitPad(rowIndex) + "-4").select2('data')[0];
    if (satuanselector!=null)
    {
        var hpokok =Math.round(satuanselector.harga_pokok);
        var laba  = ((qty*hargasatuan)*(100-disc)/100)-(hpokok*qty);
        if (laba<0)
        {
            setWarning(node, "Harga Salah");
            return false;
        }
        else {
            removeThisWarning(node);
            return true;
        }
    }
    else
    {
    //    setWarning(document.getElementById("Penjualanbaru-Input-" + twoDigitPad(rowIndex) + "-4"), "Satuan harus diisi")
        return false;
    }

}
function PenjualanBaruInputBarangChangeListener(node)
{
    var rowIndex = getRowIndex(node);
    console.log(rowIndex);
    if ($(node).val()=="new")
        $("#Penjualanbaru-CreatebarangModal").modal('toggle');
    else  if ($(node).val()!=''){
        var temp= $("#Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-1").select2('data')[0];
        if (temp) {
            //var namabarang = temp.text;
            document.getElementById("Penjualanbaru-Input-" + twoDigitPad(rowIndex) + "-2").value = temp.text;
        }
    }
    PenjualanBaruGetSatuanBarangList(node);
    PenjualanBaruDrawTable(node);
}
function PenjualanBaruInputHargaChangeListener(node)
{

    PenjualanBaruDrawTable(node);
    PenjualanBaruCekHargaRugi(node);
}
function PenjualanBaruInputQtyChangeListener(node)
{
    var rowIndex = getRowIndex(node);
    PenjualanBaruDrawTable(node);
    PenjualanBaruCekItemStok(node);
    PenjualanBaruCekHargaRugi(document.getElementById("Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-5"));
}
function PenjualanBaruInputDiscChangeListener(node)
{
    var rowIndex = getRowIndex(node);
    PenjualanBaruDrawTable(node);
    PenjualanBaruCekHargaRugi(document.getElementById("Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-5"));
}

function PenjualanBaruInputSatuanChangeListener(node)
{
    var rowIndex = getRowIndex(node);
    PenjualanBaruGetHargaUnitSatuan(node);
    PenjualanBaruDrawTable(node);
    PenjualanBaruCekItemStok(node);
    PenjualanBaruCekHargaRugi(document.getElementById("Penjualanbaru-Input-"+twoDigitPad(rowIndex)+"-5"));
}
function PenjualanBaruDelReturRow(button)
{
    //var indexRow = getRowIndex(button);
    var tableBody = document.getElementById('Penjualanbaru-ItemTable').getElementsByTagName("tbody")[0];
    var tableFoot = document.getElementById('Penjualanbaru-ItemTable').getElementsByTagName("tfoot")[0];
    console.log(tableFoot.rows.length);
    //  var tableBody = document.getElementById('Pembelianbaru-ItemTable').getElementsByTagName("tbody")[0];
    var i = getRowIndex(button);
    console.log(i);
    console.log(tableFoot.rows.length+" "+ tableBody.rows.length);
    tableFoot.deleteRow(i-tableBody.rows.length-1);

    if(tableFoot.rows.length==2)
    {
        tableFoot.deleteRow(-1);
    }
    PenjualanBaruDrawTable(null, true);
}

function PenjualanBaruCollectVoucher()
{
    var lists = document.getElementsByClassName("Penjualanbaru-VoucherModal-VoucherCheckList");
    var i;
    //var voucherList = [];
    var tableFoot = document.getElementById('Penjualanbaru-ItemTable').getElementsByTagName("tfoot")[0];
    while (true) {
        if (tableFoot.rows.length==1)
            break;
        tableFoot.deleteRow(-1);
    }
    console.log(tableFoot.rows.length);
    var totalPengurangan= 0;

    console.log(lists);
    for (i=0;i<lists.length;i++)
    {
        console.log($(lists[i]).prop("checked"));
        if ($(lists[i]).prop("checked"))
        {
            console.log($(lists[i]));
            var rowFoot = tableFoot.rows.length;
            var row = tableFoot.insertRow(rowFoot);

            var text = row.insertCell(0);
            text.setAttribute("colspan","7");
            console.log($(lists[i]).attr("data-id"));
            text.setAttribute("data-id", $(lists[i]).attr("data-id"));
            text.innerHTML  = "<span class='pull-right'>Retur "+document.getElementById("Penjualanbaru-VoucherModal-DetailText-"+i).innerHTML+"</span>";
            var nominal = row.insertCell(1);
            nominal.innerHTML = "<span class='pull-right'> -"+document.getElementById("Penjualanbaru-VoucherModal-NominalText-"+i).innerHTML+"</span>";
            var delbtn = row.insertCell(2);
            delbtn.innerHTML =  "<a onclick='PenjualanBaruDelReturRow(this);' style='color:red;'><i class='glyphicon glyphicon-remove'></i></a>";

            var temp1 =document.getElementById("Penjualanbaru-VoucherModal-NominalText-"+i).innerHTML;
            var temp2 = parseInt(temp1.substring(4).replace(/,/g,''));
            console.log(temp2);
            totalPengurangan+= temp2;
        }
    }
    var rowFoot2 = tableFoot.rows.length;
    var row2 = tableFoot.insertRow(rowFoot2);
    var text2 = row2.insertCell(0);
    text2.setAttribute("colspan", "7");
    text2.innerHTML ="<span class='pull-right'>Grand Total</span>";
    var sisaContainer = row2.insertCell(1);
    var sisaString  = document.getElementById('Penjualanbaru-ItemTable').getElementsByTagName("tfoot")[0].rows[0].cells[4].children[0].innerHTML;
    //var celldummy  = row2.insertCell(2);

    console.log(sisaString);
    console.log(totalPengurangan);
    console.log(parseInt(sisaString.substring(4).replace(/,/g,'')));
    var sisa = (parseInt(sisaString.substring(4).replace(/,/g,'')) - totalPengurangan);
    console.log(sisa);

    if (sisa<0)
    {
        var sisapositif = -sisa;
        console.log(sisapositif);
        sisaContainer.innerHTML ="<span class='pull-right'>-Rp. "+numberWithCommas(sisapositif)+"</span>";
    }
    else {
        sisaContainer.innerHTML ="<span class='pull-right'>Rp. "+numberWithCommas(sisa)+"</span>";
    }
}
function PenjualanBaruChangePelangganListener()
{
    console.log($("#Penjualanbaru-PelangganSelect").val());
        if ($("#Penjualanbaru-PelangganSelect").val()=="new")
            $("#Penjualanbaru-CreatepelangganModal").modal('toggle');
        else
        {
            ListVoucherPelanggan(currentToken, $("#Penjualanbaru-PelangganSelect").val(), function(result){
                console.log("cari voucher ");
                console.log(result);
                if (result.token_status=="success")
                {
                    if (result.data && result.data.length>0)
                    {
                        var i;


                        document.getElementById("Penjualanbaru-VoucherModal-VoucherList").innerHTML="";
                        for (i=0;i<result.data.length;i++)
                        {
                            console.log(result.data[i]);
                            var penjualanID = result.data[i].penjualanID;
                            var tanggalPenjualantemp = new Date(result.data[i].tanggal_transaksi);
                            var tanggalPenjualanStr = tanggalPenjualantemp.getDate()+"/"+(tanggalPenjualantemp.getMonth()+1)+"/"+tanggalPenjualantemp.getFullYear();
                            var jumlah  = result.data[i].jumlah_awal;
                            var voucherEntry = "<p><input data-id='"+ result.data[i].voucherpenjualanID+"' id ='voucher-"+penjualanID+"' type='checkbox' class='minimal Penjualanbaru-VoucherModal-VoucherCheckList'>" +
                                "<a id='Penjualanbaru-VoucherModal-DetailText-"+i+"' onclick='InitDetailPenjualanPage("+penjualanID+");'>"+
                                "Penjualan tanggal " +tanggalPenjualanStr+" " +
                                "</a>"+
                                "<span id='Penjualanbaru-VoucherModal-NominalText-"+i+"'>Rp. "+numberWithCommas(jumlah)+"</span></p>";
                            document.getElementById("Penjualanbaru-VoucherModal-VoucherList").innerHTML+= voucherEntry;
                        }
                        $("#Penjualanbaru-VoucherModal").modal('toggle');
                        $('input[type="checkbox"].minimal').iCheck({
                            checkboxClass: "icheckbox_minimal-green"
                        });
                        document.getElementById("Penjualanbaru-VoucherModal-ConfirmButton").onclick =function()
                        {
                            PenjualanBaruCollectVoucher();
                            $("#Penjualanbaru-VoucherModal").modal('toggle');
                        }
                    }
                }
            });

        }
}
function PenjualanBaruMoveToNext(node)
{
    //console.log(node.attr('id'));
    if (event.which == 13) {
        event.preventDefault();
        console.log($(node).attr('id'));

        var nowID = $(node).attr('id');
        var angka1 =parseInt(nowID.toString().substring(20, 22));
        var angka2 =parseInt(nowID.toString().substring(23));
        var angka1baru, angka2baru;
        if (angka2 < 6)
        {
            angka1baru = angka1;
            angka2baru = angka2+1;
        }
        else if (angka2>=6)
        {
            angka1baru = angka1+1;
            angka2baru = 1;
        }
        var nextID ="Penjualanbaru-Input-"+twoDigitPad(angka1baru)+"-"+angka2baru.toString();
        if($("#" + nextID).length == 0) {
            PenjualanBaruAddRow();
        }
        else {
            if ($("#" + nextID).data('select2'))
            {
                console.log("lala");
                $("#" + nextID).select2('open');
            }
            else {
                $("#"+nextID).focus();
            }
        }
    }
}

function PenjualanBaruCreateBarangConfirm()
{
    var satuan =[ "grs", "kod", "lsn", "pcs"];
    var konversiSatuan = [144, 20, 12, 1];
    var BarangTable = $('#BarangTable').DataTable();
    var valid = true;
    var form = document.getElementById("Penjualanbaru-CreatebarangModal-CreateForm");
    removeWarning();

    console.log(form);
    var i;
    $("#Penjualanbaru-CreatebarangModal-harga-jual-box-check").iCheck("check");
    var namaBarang = form.elements["nama"];
    var hargajualbox= form.elements["harga-jual-box-input"];
    var isibox = form.elements["isi-box-input"];
    if (namaBarang.value==null || namaBarang.value=='')
    {
        valid = false;
        setWarning(namaBarang, "Nama Barang harus diisi");
    }
    if (hargajualbox.value==''|| hargajualbox==null)
    {
        valid = false;
        setWarning(hargajualbox, "Harga Tidak Boleh Kosong");
    }
    if (isibox.value==''|| isibox.value==0 )
    {
        valid = false;
        setWarning(isibox, "Isi per Box harus diisi");
    }
    for (i = 0; i < satuan.length; i++) {
        if ($("#Penjualanbaru-CreatebarangModal-harga-jual-" + satuan[i] + "-check").prop("checked")) {
            if (form.elements["harga-jual-" + satuan[i] + "-input"].value=='' || form.elements["harga-jual-" + satuan[i] + "-input"].value==0)
            {
                valid =false;
                setWarning(form.elements["harga-jual-" + satuan[i] + "-input"], "Harga Tidak Boleh Kosong");
            }
        }
    }
    if (valid)
    {
        AddBarang(currentToken, namaBarang.value, function(result)
        {
            if (result.token_status=="success")
            {
                var konversiAcuanBox;
                var acuanBox = form.elements["acuan-box-select"].value;
                for (i=0;i<satuan.length;i++)
                {
                    if (acuanBox==satuan[i])
                    {
                        konversiAcuanBox = konversiSatuan[i];
                        break;
                    }
                }
                var stokmasuk  = form.elements['stok'].value;
                var satuanstok = form.elements['satuan-stok-select'].value;
                var hargapokok = form.elements['harga-pokok-input'].value;
                PenjualanBaruAddSatuanDanStok( result.barangID, hargajualbox.value, "box", isibox.value, acuanBox, konversiAcuanBox, stokmasuk, hargapokok, satuanstok);
                for (i=0;i<satuan.length;i++)
                {
                    if ($(form.elements["harga-jual-"+satuan[i]+"-check"]).prop("checked"))
                    {
                        console.log("adding satuan"+satuan[i]);
                        var hargajual = $(form.elements["harga-jual-"+satuan[i]+"-input"]).val();
                        PenjualanBaruAddSatuanDanStok( result.barangID, hargajual, satuan[i], konversiSatuan[i], "pcs", 1, stokmasuk, hargapokok, satuanstok);

                    }
                }
                var pad ="00000";
                var id = "" + result.barangID;
                var StrId  = "C"+ pad.substring(0, pad.length - id.length)+id;
                //InitStokBarangPage();
                createAlert("success", "Barang baru "+StrId+" - "+form.elements["nama"].value.toString() +" berhasil ditambahkan");
                form.reset();
                $("#Penjualanbaru-CreatebarangModal").modal("toggle");
                $("#Penjualanbaru-CreatebarangModal-harga-jual-box-check").iCheck("check").iCheck("disable");
                for(i=0;i<satuan.length;i++)
                    $("#Penjualanbaru-CreatebarangModal-harga-jual-"+satuan[i]+"-check").iCheck("uncheck");
                PenjualanBaruGetBarang();

                // DataBarang.pop();
                // DataBarang.push({
                //     id:id,
                //     text:nama
                // });
                // DataBarang.push({
                //     id:"new",
                //     text:"+ Tambah Pelanggan Baru"
                // });

            }
            else {
                createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
            }
        });
    }
}

function PenjualanBaruAddSatuanDanStok( barangID, hargajual, namasatuan, konversi, namasatuanacuan, konversiacuan, stoktambahan, hargapokok, satuanstoktambahan)
{
    AddSatuan(currentToken, barangID, hargajual, namasatuan, konversi, namasatuanacuan, konversiacuan,
        function(result2){
            if(result2.token_status="success")
            {
                console.log(result2.satuanID);
                if (stoktambahan>0 && (satuanstoktambahan == namasatuan))
                {
                    console.log("addinsstok"+namasatuan);
                    console.log(currentToken, barangID, stoktambahan, hargapokok, result2.satuanID);
                    AddStok(currentToken, barangID, stoktambahan, hargapokok, result2.satuanID, function(result5){
                        if (result5.token_status=="success")
                        {
                            console.log(result5);
                            console.log("stok nambah");
                        }
                    });
                }
            }
            else
                AddSatuanSuccess  =false;
        }
    );
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
        minimumResultsForSearch:Infinity
	//	containerCssClass: ':all:'
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
        PenjualanBaruSave(0, function(result){
            if (result>0)
            {
                var pad = "0000";
                var id = "" + result;
                var StrId = "TJ" + pad.substring(0, pad.length - id.length) + id;
                createAlert("success", "Data Penjualan baru " + StrId + " berhasil ditambahkan");
                PenjualanBaruResetTable();
            }
            else if (result==-2){
                createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
            }
        })
    };
    document.getElementById("Penjualanbaru-PelangganSelect").onchange=function()
    {
        PenjualanBaruChangePelangganListener();
    };
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
    const BrowserWindow = require('electron').remote.BrowserWindow;
    const ipcRenderer = require('electron').ipcRenderer;
    const path = require('path');


    document.getElementById("Penjualanbaru-PrintBesarButton").onclick = function () {
        PenjualanBaruSave(0, function(result){
            console.log("printing");
            console.log(result);
            if (result>0)
            {
                const windowID = BrowserWindow.getFocusedWindow().id;
                const invisPath = 'file://' + path.join(__dirname, 'printpages/PenjualanBesar.html');
                let win = new BrowserWindow({ width: 800, height: 800, show: true });
                win.loadURL(invisPath);
                win.webContents.on('did-finish-load', function () {
                    win.webContents.send('print-penjualan-besar', result, windowID)
                });
            }
            else if (result==-2){
                createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
            }
        });
    };
    document.getElementById("Penjualanbaru-PrintKecilButton").onclick = function () {
        PenjualanBaruSave(0, function(result){
            console.log("printing");
            console.log(result);
            if (result>0)
            {
                const windowID = BrowserWindow.getFocusedWindow().id;
                const invisPath = 'file://' + path.join(__dirname, 'printpages/PenjualanKecil.html');
                let win = new BrowserWindow({ width: 400, height: 800, show: true });
                win.loadURL(invisPath);
                win.webContents.on('did-finish-load', function () {
                    win.webContents.send('print-penjualan-kecil', result, windowID)
                });
            }
            else if (result==-2){
                createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
            }
        });
    };

    ipcRenderer.on('penjualan-printed', function (event, input, output) {//output=penjualanID
        ChangePenjualanPrintedStatus(currentToken, output, function(result){
            if (result.token_status=="success")
            {
                console.log("penjualan keprint");
                createAlert("success", "Penjualan telah di simpan dan dicetak");
                PenjualanBaruResetTable();
              //  win.close();
            }
            else {
                createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
            }
        });
    });


    PenjualanBaruResetTable();


    PenjualanBaruDisableHargaPokokField();
    PenjualanBaruCreateBarangModalDisableHargaJualInput();

    $(".check-satuan-createModal").off("ifChanged");
    $(".check-satuan-createModal").on("ifChanged", function () {
        PenjualanBaruCreateBarangModalDisableHargaJualInput();
    });


    document.getElementById("Penjualanbaru-CreatebarangModal-ConfirmButton").onclick= function () {
        PenjualanBaruCreateBarangConfirm();
    };

}
