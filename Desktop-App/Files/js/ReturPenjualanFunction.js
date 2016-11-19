
/**
 * Created by Billy on 13-Nov-16.
 */
function ReturPenjualanPopulateData(currentPenjualanID)
{
    GetDetailPenjualan(currentToken, currentPenjualanID, function(result) {
      //  var itemPembelianTable;
        if (result.token_status == "success") {
            var penjualan = result.data[0];
            var i;

            var pad = "0000";
            var id = "" + penjualan.penjualanID;
            var StrId = "TB" + pad.substring(0, pad.length - id.length) + id;

            var TglTransaksi = new Date(penjualan.tanggal_transaksi);
            var TglTransaksiText = TglTransaksi.getDate() + "/" + (TglTransaksi.getMonth() + 1) + "/" + TglTransaksi.getFullYear();

            var JatuhTempoText;
            var PembayaranText;
            if (penjualan.jatuh_tempo != null) {
                PembayaranText = "Bon";
                var JatuhTempo = new Date(penjualan.jatuh_tempo);
                JatuhTempoText = JatuhTempo.getDate() + "/" + (JatuhTempo.getMonth() + 1) + "/" + JatuhTempo.getFullYear();
            }
            else {
                PembayaranText = "Cash";
                JatuhTempoText = "-";
            }
            var notesText;
            if (penjualan.notes == "" || penjualan.notes == null) {
                notesText = "-";
            }
            else {
                notesText = penjualan.notes;
            }
            document.getElementById("Returpenjualan-PelangganText").innerHTML = penjualan.pelangganNama;
            document.getElementById("Returpenjualan-TglJatuhTempoText").innerHTML = JatuhTempoText;
            document.getElementById("Returpenjualan-TglTransaksiText").innerHTML = TglTransaksiText;
            document.getElementById("Returpenjualan-PembayaranText").innerHTML = PembayaranText;
            document.getElementById("Returpenjualan-StatusText").innerHTML = capitalizeFirstLetter(penjualan.status);
            document.getElementById("Returpenjualan-KodeText").innerHTML = StrId;
            document.getElementById("Returpenjualan-AlamatText").innerHTML = penjualan.alamat;
            document.getElementById("Returpenjualan-NotesText").innerHTML = notesText;
            for (i=0;i<penjualan.barang.length;i++)
            {
                ReturPenjualanAddRow(penjualan.barang[i]);
            }
        }
    });
}

function ReturPenjualanAddRow(barang) {
    var tableBody = document.getElementById('Returpenjualan-ItemTable').getElementsByTagName("tbody")[0];

    var rowCount = tableBody.rows.length;
    var row = tableBody.insertRow(rowCount);
    var rowNum = rowCount + 1;

    var hargaUnit = barang.harga_jual_saat_ini;
    var qty = barang.quantity;
    var disc = barang.disc;
    var itemSubtotal = (hargaUnit * qty) * ((100 - disc) / 100);
    var nama_barang = barang.nama_barang;
    var isi_box = "@ " + (barang.konversi_box).toString() + " " + capitalizeFirstLetter(barang.satuan_acuan_box);
    var satuan_unit = capitalizeFirstLetter(barang.satuan_unit);


    var cell1 = row.insertCell(0);
    cell1.innerHTML = rowNum.toString();

    var cell2 = row.insertCell(1);
    cell2.innerHTML = nama_barang;
    cell2.setAttribute("id", "ReturPenjualan-Input-"+rowNum.toString()+"-1")
    cell2.setAttribute("data-id", barang.penjualanbarangID)

    var cell5 = row.insertCell(2);
    cell5.innerHTML = isi_box;

    var cell3 = row.insertCell(3);
    cell3.innerHTML = "<span class='pull-right'>" + numberWithCommas(qty) + "</span>";

    var cellqtyretur = row.insertCell(4);
    cellqtyretur.setAttribute("style", "padding:0");
    cellqtyretur.setAttribute("class", "form-control");
    var inputqtyretur = document.createElement("input");
    inputqtyretur.setAttribute("id", "ReturPenjualan-Input-" + rowNum.toString() + "-2");
    inputqtyretur.setAttribute("class", "form-control");
    inputqtyretur.setAttribute("type", "number");
    inputqtyretur.setAttribute("min", "0");
    inputqtyretur.setAttribute("style", "width:100%;");
    cellqtyretur.appendChild(inputqtyretur);

    var cell4 = row.insertCell(5);
    cell4.innerHTML = satuan_unit;

    var cell6 = row.insertCell(6);
    cell6.innerHTML = "<span class='pull-right'>Rp." + numberWithCommas(hargaUnit) + "</span>";

    var cell7 = row.insertCell(7);
    cell7.innerHTML = "<span class='pull-right'>" + disc + " %</span>";

    var cell8 = row.insertCell(8);
    cell8.innerHTML = "<span class='pull-right'>Rp." + numberWithCommas(itemSubtotal) + "</span>";

    if (hasHakAkses("HargaPokokLaba")) {


        var hpokok = barang.konversi_unit * barang.konversi_acuan_unit * barang.harga_pokok_saat_ini;
        var laba = itemSubtotal - (qty*hpokok);

        var cell9 = row.insertCell(9);
        cell9.innerHTML = "<span class='pull-right'>Rp. "+numberWithCommas(hpokok)+"</span>"


        var cell10 = row.insertCell(10);
        var span = document.createElement("span");
        span.setAttribute("class", "pull-right");
        span.innerHTML = "Rp. "+numberWithCommas(laba);
        cell10.appendChild(span);
    }
}

function add_retur_penjualan(counter, berhasil, length, penjualanID){

    var tglTransaksiTemp = new Date();
    var tglTransaksi = tglTransaksiTemp.getFullYear() + "-" + (tglTransaksiTemp.getMonth() + 1) + "-" + tglTransaksiTemp.getDate();

    var metode = 0
    if ($("#Returpenjualan-Metode").val() == "voucher") {
        metode = 1
    }

    if(counter === undefined)counter = 1
    if(counter >= length){
        if (berhasil == 1) {
            InitDetailPenjualanPage(penjualanID)
            createAlert("success", "Retur Penjualan Berhasil Dilakukan");
        }
        else {
            createAlert("danger", "Retur Penjualan Gagal Dilakukan");
        }
        return;
    }

    var QtyReturValue = $("#ReturPenjualan-Input-" + counter.toString() + "-2").val();
    var penjualanbarangID = document.getElementById("ReturPenjualan-Input-"+counter.toString()+"-1").getAttribute("data-id");

    if (QtyReturValue == null || QtyReturValue=='' || QtyReturValue==0){

    }
    else{
        AddReturPenjualan(
            currentToken,
            penjualanbarangID,
            tglTransaksi,
            QtyReturValue,
            metode,
            function(result){

                if (result != null && result.token_status == "success") {

                }
                else {
                    berhasil = 0
                }
                counter++
                add_retur_penjualan(counter, berhasil, length, penjualanID)
            }
        )
    }

}

function returPenjualanBaru(penjualanID) {

    var satuan = [];
    var itemTable = document.getElementById("Returpenjualan-ItemTable");
    var i;

    add_retur_penjualan(1,1,itemTable.rows.length-1, penjualanID)
}

function clearReturPenjualan(){

    var tableBody = document.getElementById('Returpenjualan-ItemTable').getElementsByTagName("tbody")[0];
    while(tableBody.rows.length > 0){
        tableBody.deleteRow(0)
    }
}


function InitReturPenjualanPage(penjualanID)
{

    currentToken = localStorage.getItem("token");
    setPage("ReturPenjualan");
    clearReturPenjualan();
    ReturPenjualanPopulateData(penjualanID);

    $('#Returpenjualan-Metode').select2({
        minimumResultsForSearch: Infinity
    })

    document.getElementById("Returpenjualan-SaveButton").onclick=function(){
        returPenjualanBaru(penjualanID);
    };

    if (hasHakAkses('HargaPokokLaba')){
     $(".Penjualanbaru-ItemTable-HargapokoklabaColumn").show();
    }
    else {
     $(".Penjualanbaru-ItemTable-HargapokoklabaColumn").hide();
    }

}
