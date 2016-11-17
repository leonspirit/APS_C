/**
 * Created by Billy on 13-Nov-16.
 */

function populateReturPembelian(currentPembelianID)
{
    GetDetailPembelian(currentToken, currentPembelianID, function(result) {
        var itemPembelianTable;
        if (result.token_status == "success") {
            var pembelian = result.data[0];
            var i;

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
            document.getElementById("Returpembelian-SupplierText").innerHTML = pembelian.nama;
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
function ReturPembelianDrawTable()
{

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
    var itemSubtotal = (hargaUnit * qty)*((100-disc1-disc2-disc3)/100);

    var cell1 = row.insertCell(0);
    cell1.innerHTML = rowNum.toString();


    var cell2 = row.insertCell(1);
    cell2.innerHTML = barang.pembelianbarangID;

    var cell5  =row.insertCell(2);
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
    inputJumlahRetur.setAttribute("style", "width:100%;");
    cellqtyRetur.appendChild(inputJumlahRetur);

    var cell4 = row.insertCell(5);

    var cell6 = row.insertCell(6);
   cell6.innerHTML = "<span class='pull-right'>Rp. "+numberWithCommas(hargaUnit)+"</span>";

    var cell7 = row.insertCell(7);
   cell7.innerHTML = "<span class='pull-right'>"+disc1 +" %</span>";

    var cell8 = row.insertCell(8);
    cell8.innerHTML = "<span class='pull-right'>"+disc2 +" %</span>";

    var cell9 = row.insertCell(9);
    cell9.innerHTML = "<span class='pull-right'>"+disc3 +" %</span>";

    var cell10 = row.insertCell(10);
    cell10.innerHTML = "<span class='pull-right'>Rp. "+itemSubtotal+"</span>";

}

function ReturPembelianSave()
{

}
function InitReturPembelianPage(id)
{
    currentToken = localStorage.getItem("token");
    setPage("ReturPembelian");
    populateReturPembelian(id);

}
