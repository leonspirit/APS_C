/**
 * Created by Billy on 13-Nov-16.
 */

function populateReturPembelian(currentPembelianID)
{
    GetDetailPembelian(currentToken, currentPembelianID, function(result) {
       if (result.token_status == "success") {
            var pembelian = result.data[0];
            var i;
            if (pembelian.status=='lunas')
            {
                $("#ReturPenjualan-SimpanOption").hide();
            }

            var pad = "0000";
            var id = "" + pembelian.pembelianID;
            var StrId = "TB" + pad.substring(0, pad.length - id.length) + id;

            var TglTransaksi = new Date(pembelian.tanggal_transaksi);
            var TglTransaksiText = TglTransaksi.getDate() + "/" + (TglTransaksi.getMonth() + 1) + "/" + TglTransaksi.getFullYear();

            var JatuhTempoText;
            var PembayaranText;
            if (pembelian.jatuh_tempo != null) {
                PembayaranText = "Bon";
                var JatuhTempo = new Date(pembelian.jatuh_tempo);
                JatuhTempoText = JatuhTempo.getDate() + "/" + (JatuhTempo.getMonth() + 1) + "/" + JatuhTempo.getFullYear();
            }
            else {
                PembayaranText = "Cash";
                JatuhTempoText = "-";
            }
            var notesText;
            if (pembelian.notes == "" || pembelian.notes == null) {
                notesText = "-";
            }
            else {
                notesText = pembelian.notes;
            }
            document.getElementById("Returpembelian-DiscText").innerHTML = numberWithCommas(pembelian.disc)+" %";
            document.getElementById("Returpembelian-TotalText").innerHTML = "Rp. "+numberWithCommas(pembelian.subtotal*(100-pembelian.disc)/100);
            document.getElementById("Returpembelian-SupplierText").innerHTML = pembelian.supplierNama;
            document.getElementById("Returpembelian-TglJatuhTempoText").innerHTML = JatuhTempoText;
            document.getElementById("Returpembelian-TglTransaksiText").innerHTML = TglTransaksiText;
            document.getElementById("Returpembelian-PembayaranText").innerHTML = PembayaranText;
            document.getElementById("Returpembelian-StatusText").innerHTML = capitalizeFirstLetter(pembelian.status);
            document.getElementById("Returpembelian-KodeText").innerHTML = StrId;
            document.getElementById("Returpembelian-NotesText").innerHTML = notesText;
            for (i=0;i<pembelian.barang.length;i++)
            {
                ReturPembelianAddRow(pembelian.barang[i]);
            }
        }
    });
}
function ReturPembelianAddRow(barang)
{
    var tableBody = document.getElementById('Returpembelian-ItemTable').getElementsByTagName("tbody")[0];

    var rowCount = tableBody.rows.length;
    var row = tableBody.insertRow(rowCount);
    var rowNum = rowCount+1;

    var hargaUnit = barang.harga_per_biji;
    var qty = barang.quantity;
    var disc1 = barang.disc_1;
    var disc2 = barang.disc_2;
    var disc3 = barang.disc_3;
    var itemSubtotal = (hargaUnit * qty)*((100-disc1)/100)*((100-disc2)/100)*((100-disc3)/100);

    var cell1 = row.insertCell(0);
    cell1.innerHTML = rowNum.toString();


    var cell2 = row.insertCell(1);
    cell2.innerHTML = barang.nama_barang;
    cell2.setAttribute("id", "ReturPembelian-Input-"+rowNum.toString()+"-1");
    cell2.setAttribute("data-id", barang.pembelianbarangID);

    var cell5  =row.insertCell(2);
    cell5.innerHTML = "@ " + barang.konversi_box.toString() + " " + barang.satuan_acuan_box;
    cell5.setAttribute("id", "Pembelianbaru-IsiboxText-"+rowNum.toString());

    var cell3 = row.insertCell(3);
    cell3.innerHTML ="<span class='pull-right'>"+numberWithCommas(qty)+"</span>";

    var cellqtyRetur = row.insertCell(4);
    cellqtyRetur.setAttribute("style", "padding:0");
    var inputJumlahRetur = document.createElement("input");
    inputJumlahRetur.setAttribute("id", "ReturPembelian-Input-"+rowNum.toString()+"-2");
    inputJumlahRetur.setAttribute("class", "form-control");
    inputJumlahRetur.setAttribute("type", "number");
    inputJumlahRetur.setAttribute("min", "0");
    inputJumlahRetur.setAttribute("onchange", "ReturPembelianDrawTable(this);");
    inputJumlahRetur.setAttribute("style", "width:100%;");
    inputJumlahRetur.setAttribute("onchange", "ReturPembelianDrawTable(this);");
    cellqtyRetur.appendChild(inputJumlahRetur);

    var cell4 = row.insertCell(5);
    cell4.innerHTML = capitalizeFirstLetter(barang.satuan_unit);

    var cell6 = row.insertCell(6);
   cell6.innerHTML = "<span class='pull-right'>Rp. "+numberWithCommas(hargaUnit)+"</span>";

    var cell7 = row.insertCell(7);
   cell7.innerHTML = "<span class='pull-right'>"+disc1 +" %</span>";

    var cell8 = row.insertCell(8);
    cell8.innerHTML = "<span class='pull-right'>"+disc2 +" %</span>";

    var cell9 = row.insertCell(9);
    cell9.innerHTML = "<span class='pull-right'>"+disc3 +" %</span>";

    var cell10 = row.insertCell(10);
    cell10.innerHTML = "<span class='pull-right'>Rp. "+numberWithCommas(itemSubtotal)+"</span>";
    var cell11 = row.insertCell(11);
    cell11.innerHTML =  "<span class='pull-right'>Rp. 0</span>";

}

function ReturPembelianDrawTable(r)
{
    var indexChanged;
    if (r!=null)
        indexChanged = getRowIndex(r);//.parentNode.parentNode.rowIndex;
    else
        indexChanged= 0;
    var i;
    var itemTable= document.getElementById("Returpembelian-ItemTable");
    var itemTableFoot= document.getElementById("Returpembelian-ItemTable").getElementsByTagName("tfoot")[0];

    if(indexChanged>=1 && indexChanged<itemTable.rows.length){
        var curRow =  itemTable.rows[indexChanged];
        var qtyretur = curRow.cells[4].children[0].value;


        var hargaSatuanStr = curRow.cells[6].children[0].innerHTML;
        var hargaSatuan = parseInt(hargaSatuanStr.substring(4).replace(/,/g,''));
        var disc1Str = curRow.cells[7].children[0].innerHTML;
        var disc1 = parseInt(disc1Str.replace(' %',''));
        var disc2Str = curRow.cells[8].children[0].innerHTML;
        var disc2 = parseInt(disc2Str.replace(' %',''));
        var disc3Str = curRow.cells[9].children[0].innerHTML;
        var disc3 = parseInt(disc3Str.replace(' %',''));
        //subtotal
        var Subtotal = parseInt(qtyretur * hargaSatuan*((100-disc1)/100)*((100-disc2)/100)*((100-disc3)/100));
        curRow.cells[11].children[0].innerHTML = "Rp. "+numberWithCommas(Subtotal);
    }
    var TotalHarga = 0;
    var subtotalTambahanStr;
    var subtotalTambahan;

    console.log(itemTableFoot.rows.length+ " " +itemTable.rows.length);
    for (i=1;i<itemTable.rows.length-itemTableFoot.rows.length;i++)
    {
        subtotalTambahanStr = itemTable.rows[i].cells[11].children[0].innerHTML.toString().substring(4);
        subtotalTambahan = parseInt(subtotalTambahanStr.replace(/,/g,''));
        TotalHarga += subtotalTambahan;
    }

    var posisitotal = itemTable.rows.length-itemTableFoot.rows.length;
    console.log(posisitotal);

    var discBesarStr = itemTable.rows[posisitotal].cells[2].children[0].innerHTML;
    var discBesar = parseInt(discBesarStr.replace(' %',''));
    console.log(discBesar);

    var TotalHargaReturAfterDisc = parseInt(TotalHarga *(100 - discBesar)/100);
    document.getElementById("Returpembelian-TotalReturText").innerHTML = "Rp. "+ numberWithCommas(TotalHargaReturAfterDisc);

}

function add_retur_pembelian(counter, berhasil, length, pembelianID){

    var tglTransaksiTemp = new Date();
    var tglTransaksi = tglTransaksiTemp.getFullYear() + "-" + (tglTransaksiTemp.getMonth() + 1) + "-" + tglTransaksiTemp.getDate();

    var metode = 0;
    if ($("#Returpembelian-Metode").val() == "voucher") {
        metode = 1;
    }
    else  if ($("#Returpembelian-Metode").val() == "simpan") {
        metode = 2;
    }

    if(counter === undefined)counter = 1;
    if(counter >= length){
        if (berhasil == 1) {
            InitDetailPembelianPage(pembelianID);
            createAlert("success", "Retur Pembelian Berhasil Dilakukan");
        }
        else {
            createAlert("danger", "Retur Pembelian Gagal Dilakukan");
        }
        return;
    }

    var QtyReturValue = $("#ReturPembelian-Input-" + counter.toString() + "-2").val();
    var pembelianbarangID = document.getElementById("ReturPembelian-Input-"+counter.toString()+"-1").getAttribute("data-id");

    if (QtyReturValue == null || QtyReturValue=='' || QtyReturValue==0){

    }
    else{
        AddReturPembelian(
            currentToken,
            pembelianbarangID,
            tglTransaksi,
            QtyReturValue,
            metode,
            function(result){

                if (result != null && result.token_status == "success") {

                }
                else {
                    berhasil = 0
                }
                counter++;
                add_retur_pembelian(counter, berhasil, length, pembelianID);
            }
        )
    }

}

function returPembelianBaru(pembelianID) {

    var itemTable = document.getElementById("Returpembelian-ItemTable");

    add_retur_pembelian(1,1,itemTable.rows.length-1, pembelianID)
}

function clearReturPembelian(){

    var tableBody = document.getElementById('Returpembelian-ItemTable').getElementsByTagName("tbody")[0];
    while(tableBody.rows.length > 0){
        tableBody.deleteRow(0)
    }
}

function InitReturPembelianPage(pembelianID)
{
    currentToken = localStorage.getItem("token");
    setPage("ReturPembelian");
    clearReturPembelian();
    populateReturPembelian(pembelianID);

    $('#Returpembelian-Metode').select2({
        minimumResultsForSearch: Infinity
    });
    document.getElementById("Returpembelian-SaveButton").onclick=function(){
        returPembelianBaru(pembelianID);
    };
}
