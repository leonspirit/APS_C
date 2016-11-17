
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

function ReturPenjualanAddRow()
{
    var tableBody = document.getElementById('Returpenjualan-ItemTable').getElementsByTagName("tbody")[0];

    var rowCount = tableBody.rows.length;
    var row = tableBody.insertRow(rowCount);
    var rowNum = rowCount+1;

    var cell1 = row.insertCell(0);
    cell1.innerHTML = rowNum.toString();


    var cell2 = row.insertCell(1);
   /* cell2.setAttribute("style", "padding:0");
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
    });*/

    var cell5  =row.insertCell(2);
    cell5.setAttribute("id", "Returpembelian-IsiboxText-"+rowNum.toString());

    var cell3 = row.insertCell(3);
    cell3.setAttribute("style", "padding:0");
    var inputJumlah = document.createElement("input");
    inputJumlah.setAttribute("id", "Returpenjualan-Input-"+rowNum.toString()+"-2");
    inputJumlah.setAttribute("class", "form-control");
    inputJumlah.setAttribute("type", "number");
    inputJumlah.setAttribute("min", "0");
    inputJumlah.setAttribute("style", "width:100%;");
   // inputJumlah.setAttribute("onchange", "PembelianBaruDrawTable(this);");
    cell3.appendChild(inputJumlah);

    cellqtyretur = row.insertCell(4);
    var inputqtyretur = document.createElement("input");
    inputqtyretur.setAttribute("id", "Pembelianbaru-Input-"+rowNum.toString()+"-2");
    inputqtyretur.setAttribute("class", "form-control");
    inputqtyretur.setAttribute("type", "number");
    inputqtyretur.setAttribute("min", "0");
    inputqtyretur.setAttribute("style", "width:100%;");
    inputqtyretur.setAttribute("onchange", "PembelianBaruDrawTable(this);");
    cellqtyretur.appendChild(inputqtyretur);


    var cell4 = row.insertCell(5);
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


    var cell6 = row.insertCell(6);
    cell6.setAttribute("style", "padding:0;");
    var  inputHargaContainer = document.createElement("div");
    inputHargaContainer.setAttribute("class", "input-group");
    inputHargaContainer.setAttribute("style", "width:100%");
    var inputHargaLabel = document.createElement("span");
    inputHargaLabel.setAttribute("class", "input-group-addon");
    inputHargaLabel.innerHTML = "Rp.";
    var inputHarga = document.createElement("input");
    inputHarga.setAttribute("id","Pembelianbaru-Input-"+rowNum.toString()+"-4");
    inputHarga.setAttribute("type", "number");
    inputHarga.setAttribute("class", "form-control");
    inputHarga.setAttribute("onchange", "PembelianBaruDrawTable(this.parentNode);");
    inputHargaContainer.appendChild(inputHargaLabel);
    inputHargaContainer.appendChild(inputHarga);
    cell6.appendChild(inputHargaContainer);

    var cell7 = row.insertCell(7);
    cell7.setAttribute("style", "padding:0;");
    var  inputDiscContainer1 = document.createElement("div");
    inputDiscContainer1.setAttribute("class", "input-group");
    inputDiscContainer1.setAttribute("style", "width:100%");
    var inputDisc = document.createElement("input");
    inputDisc.setAttribute("id","Pembelianbaru-Input-"+rowNum.toString()+"-5");
    inputDisc.setAttribute("type", "number");
    inputDisc.setAttribute("min", "0");
    inputDisc.setAttribute("max", "100");
    inputDisc.setAttribute("class", "form-control");
    inputDisc.setAttribute("onchange", "PembelianBaruDrawTable(this.parentNode);");
    var inputDiscLabel1 = document.createElement("span");
    inputDiscLabel1.setAttribute("class", "input-group-addon");
    inputDiscLabel1.innerHTML = "%";
    inputDiscContainer1.appendChild(inputDisc);
    inputDiscContainer1.appendChild(inputDiscLabel1);
    cell7.appendChild(inputDiscContainer1);

    var cell8 = row.insertCell(8);

    var cell9 = row.insertCell(9);

    var cell10 = row.insertCell(10);
    var span  = document.createElement("span");
    span.setAttribute("class", "pull-right");
    span.innerHTML = "Rp. 0";
    cell10.appendChild(span);

   /* var cell11 = row.insertCell(10);
    var delButton = document.createElement("a");
    delButton.setAttribute("class", "del-row");
    delButton.setAttribute("onclick", "PembelianBaruRemoveRow(this);");
    delButton.setAttribute("style", "color:red;");
    var delIcon = document.createElement("i");
    delIcon.setAttribute("class", "glyphicon glyphicon-remove");
    delButton.appendChild(delIcon);
    cell11.appendChild(delButton);*/
}


function InitReturPenjualanPage(penjualanID)
{

    currentToken = localStorage.getItem("token");
    setPage("ReturPenjualan");
    ReturPenjualanPopulateData(penjualanID);

}
