/**
 * Created by user on 18/11/2016.
 */

function PopulatePembelianBesarInvoice(id)
{
    var currentToken = localStorage.getItem("token");
    GetDetailPembelian(currentToken, id, function(result){
        var  itemPenjualanBesarTable;// =$("#Detailpenjualan-ItemTable").DataTable();
       // var  CicilanPenjualanTable;// =$("#Detailpenjualan-CicilanTable").DataTable();
        if (result.token_status=="success") {
            console.log(result);
            var pembelian = result.data[0];

            if (!$.fn.DataTable.isDataTable("#PembelianBesar-ItemTable")) {
                itemPenjualanBesarTable = $("#PembelianBesar-ItemTable").DataTable({
                    "paging": false,
                    "lengthChange": false,
                    "searching": false,
                    "ordering": false,
                    "info": false,
                    "autoWidth": false
                });
            }
            else {
                itemPenjualanBesarTable = $("#PembelianBesar-ItemTable").DataTable();
                itemPenjualanBesarTable.clear().draw();
            }

            var i;
            var pad = "0000";
            var id = "" + pembelian.pembelianID;
            var StrId = "TJ" + pad.substring(0, pad.length - id.length) + id;

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
            document.getElementById("PembelianBesar-PelangganText").innerHTML = pembelian.supplierNama;
            document.getElementById("PembelianBesar-TglJatuhTempoText").innerHTML = JatuhTempoText;
            document.getElementById("PembelianBesar-TglTransaksiText").innerHTML = TglTransaksiText;
            document.getElementById("PembelianBesar-PembayaranText").innerHTML = PembayaranText;
            document.getElementById("PembelianBesar-StatusText").innerHTML = capitalizeFirstLetter(pembelian.status);
            document.getElementById("PembelianBesar-KodeText").innerHTML = StrId;
            document.getElementById("PembelianBesar-NotesText").innerHTML = notesText;

            var grandTotalText = "<span class='pull-right'>Rp. " + numberWithCommas(pembelian.subtotal) + "</span>";

            $(itemPenjualanBesarTable.column(9).footer()).html(grandTotalText);
            $(itemPenjualanBesarTable.column(7).footer()).html("<span class='pull-right'>"+pembelian.disc+" %</span>");
            console.log(pembelian);
            for (i = 0; i < pembelian.barang.length; i++) {
                var hargaUnit = pembelian.barang[i].harga_per_biji;
                var qty = pembelian.barang[i].quantity;
                var disc1 = pembelian.barang[i].disc_1;
                var disc2 = pembelian.barang[i].disc_2;
                var disc3 = pembelian.barang[i].disc_3;
                var itemSubtotal = parseInt(hargaUnit * qty) * ((100 - disc1-disc2-disc3) / 100);
                var nama_barang = pembelian.barang[i].nama_barang;
                var isi_box = (pembelian.barang[i].konversi_box).toString() + " " + capitalizeFirstLetter(  pembelian.barang[i].satuan_acuan_box);
                var satuan_unit = pembelian.barang[i].satuan_unit;

                itemPenjualanBesarTable.row.add([
                    "<span class='pull-right'>" + (i + 1).toString() + "</span>",
                    nama_barang,
                    "@ " + isi_box,
                    "<span class='pull-right'>" + numberWithCommas(qty) + "</span>",
                    capitalizeFirstLetter(satuan_unit),
                    "<span class='pull-right'>Rp. " + numberWithCommas(hargaUnit) + "</span>",
                    "<span class='pull-right'>" + disc1 + " %</span>",
                    "<span class='pull-right'>" + disc2 + " %</span>",
                    "<span class='pull-right'>" + disc3 + " %</span>",
                    "<span class='pull-right'>Rp. " + numberWithCommas(itemSubtotal) + "</span>"
                ]);
            }
            itemPenjualanBesarTable.draw();
        }
    });
}
