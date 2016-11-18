/**
 * Created by user on 18/11/2016.
 */

function PopulatePenjualanBesarInvoice(id)
{
    var currentToken = localStorage.getItem("token");
    GetDetailPenjualan(currentToken, id, function(result){
        var  itemPenjualanBesarTable;// =$("#Detailpenjualan-ItemTable").DataTable();
       // var  CicilanPenjualanTable;// =$("#Detailpenjualan-CicilanTable").DataTable();
        if (result.token_status=="success")
        {
            var penjualan = result.data[0];

            if (!$.fn.DataTable.isDataTable("#PenjualanBesar-ItemTable")) {
                itemPenjualanBesarTable = $("#PenjualanBesar-ItemTable").DataTable({
                    "paging": false,
                    "lengthChange": false,
                    "searching": false,
                    "ordering": false,
                    "info": false,
                    "autoWidth": false
                });
            }
            else {
                itemPenjualanBesarTable = $("#PenjualanBesar-ItemTable").DataTable();
                itemPenjualanBesarTable.clear().draw();
            }

            var i;
            var pad ="0000";
            var id = "" + penjualan.penjualanID;
            var StrId  = "TJ"+ pad.substring(0, pad.length - id.length)+id;

            var TglTransaksi = new Date(penjualan.tanggal_transaksi);
            var TglTransaksiText = TglTransaksi.getDate()+"/"+(TglTransaksi.getMonth()+1)+"/"+TglTransaksi.getFullYear();

            var JatuhTempoText;
            var PembayaranText;
            if (penjualan.jatuh_tempo!=null)
            {
                PembayaranText = "Bon";
                var JatuhTempo = new Date(penjualan.jatuh_tempo);
                JatuhTempoText = JatuhTempo.getDate()+"/"+(JatuhTempo.getMonth()+1)+"/"+JatuhTempo.getFullYear();
            }
            else
            {
                PembayaranText = "Cash";
                JatuhTempoText="-";
            }
            var notesText ;
            if (penjualan.notes =="" || penjualan.notes==null)
            {
                notesText ="-";
            }
            else {
                notesText =penjualan.notes;
            }
            document.getElementById("PenjualanBesar-PelangganText").innerHTML = penjualan.pelangganNama;
            document.getElementById("PenjualanBesar-TglJatuhTempoText").innerHTML = JatuhTempoText;
            document.getElementById("PenjualanBesar-TglTransaksiText").innerHTML = TglTransaksiText;
            document.getElementById("PenjualanBesar-PembayaranText").innerHTML = PembayaranText;
            document.getElementById("PenjualanBesar-StatusText").innerHTML = capitalizeFirstLetter(penjualan.status);
            document.getElementById("PenjualanBesar-KirimkeText").innerHTML = penjualan.alamat;
            document.getElementById("PenjualanBesar-KodeText").innerHTML = StrId;
            document.getElementById("PenjualanBesar-NotesText").innerHTML = notesText;

            var grandTotalText ="<span class='pull-right'>Rp. "+numberWithCommas(penjualan.subtotal)+"</span>";

            $(itemPenjualanBesarTable.column(7).footer()).html(grandTotalText);
            console.log(penjualan);
            for (i=0;i<penjualan.barang.length;i++)
            {
                var hargaUnit = penjualan.barang[i].harga_jual_saat_ini;
                var qty = penjualan.barang[i].quantity;
                var disc = penjualan.barang[i].disc;
                var itemSubtotal = (hargaUnit * qty)*((100-disc)/100);
                var nama_barang = penjualan.barang[i].nama_barang;
                var isi_box = (penjualan.barang[i].konversi_box).toString() + " " + penjualan.barang[i].satuan_acuan_box;
                var satuan_unit = penjualan.barang[i].satuan_unit;

             /*   if (hasHakAkses("HargaPokokLaba"))
                {
                    var hpokok="";//penjualan.barang[i].harga_pokok_saat_ini*()
                    var laba="";
                    itemPenjualanBesarTable.row.add([
                        "<span class='pull-right'>"+(i+1).toString()+"</span>",
                        "<span class='pull-right'>"+nama_barang+"</span>",
                        "<span class='pull-right'>"+isi_box+"</span>",
                        "<span class='pull-right'>"+numberWithCommas(qty)+"</span>",
                        "<span class='pull-right'>"+satuan_unit+"</span>",
                        "<span class='pull-right'>Rp. "+numberWithCommas(hargaUnit)+"</span>",
                        "<span class='pull-right'>"+disc +" %</span>",
                        "<span class='pull-right'>Rp. "+numberWithCommas(itemSubtotal) +"</span>",
                        hpokok,
                        laba
                    ]);
                }
                else {*/
                    itemPenjualanBesarTable.row.add([
                        "<span class='pull-right'>"+(i+1).toString()+"</span>",
                        "<span class='pull-right'>"+nama_barang+"</span>",
                        "<span class='pull-right'>"+isi_box+"</span>",
                        "<span class='pull-right'>"+numberWithCommas(qty)+"</span>",
                        "<span class='pull-right'>"+satuan_unit+"</span>",
                        "<span class='pull-right'>Rp. "+numberWithCommas(hargaUnit)+"</span>",
                        "<span class='pull-right'>"+disc +" %</span>",
                        "<span class='pull-right'>Rp. "+numberWithCommas(itemSubtotal) +"</span>"
                    ]);
            //    }
            }
            itemPenjualanBEsarTable.draw();


        });
}
