/**
 * Created by Billy on 04-Nov-16.
 */

var currentToken = localStorage.getItem("token");
function populateDetailPenjualan(curPenjualanID)
{
    GetDetailPembelian(currentToken, currentPembelianID, function(result)
    {
        var  itemPenjualanTable =$("#Detailpenjualan-ItemTable").DataTable();
        if (result.token_status=="success")
        {
            var pembelian = result.data[0];
            if (typeof itemPenjualanTable==='undefined') {
                itemPenjualanTable = $("#Detailpenjualan-ItemTable").DataTable({
                    "paging": false,
                    "lengthChange": false,
                    "searching": false,
                    "ordering": true,
                    "info": false,
                    "autoWidth": false
                });
            }
            else {
                itemPenjualanTable.clear().draw();
            }
            var i;
            var pad ="0000";
            var id = "" + pembelian.pembelianID;
            var StrId  = "TB"+ pad.substring(0, pad.length - id.length)+id;

            var TglTransaksi = new Date(pembelian.tanggal_transaksi);
            var TglTransaksiText = TglTransaksi.getDate()+"/"+TglTransaksi.getMonth()+"/"+TglTransaksi.getFullYear();

            var JatuhTempoText;
            var PembayaranText;
            if (pembelian.jatuh_tempo!=null)
            {
                PembayaranText = "Bon";
                var JatuhTempo = new Date(pembelian.jatuh_tempo);
                JatuhTempoText = JatuhTempo.getDate()+"/"+JatuhTempo.getMonth()+"/"+JatuhTempo.getFullYear();
            }
            else
            {
                PembayaranText = "Cash";
                JatuhTempoText="-";
            }
/*
            document.getElementById("SupplierText").innerHTML = pembelian.nama;
            document.getElementById("TglJatuhTempoText").innerHTML = JatuhTempoText;
            document.getElementById("TglTransaksiText").innerHTML = TglTransaksiText;
            document.getElementById("PembayaranText").innerHTML = PembayaranText;
            document.getElementById("StatusText").innerHTML = pembelian.status;
            document.getElementById("KodeText").innerHTML = StrId;

            var grandTotalText ="<span class='pull-right'>Rp. "+numberWithCommas(pembelian.subtotal)+"</span>";
            var grandDiscountText ="<span class='pull-right'>"+numberWithCommas(pembelian.disc)+" %</span>";

            $(itemPembelianTable.column(9).footer()).html(grandTotalText);
            $(itemPembelianTable.column(7).footer()).html(grandDiscountText);
            for (i=0;i<pembelian.barang.length;i++)
            {
                var hargaUnit = pembelian.barang[i].harga_per_biji;
                var qty = pembelian.barang[i].quantity;
                var disc1 = pembelian.barang[i].disc_1;
                var disc2 = pembelian.barang[i].disc_2;
                var disc3 = pembelian.barang[i].disc_3;
                var itemSubtotal = (hargaUnit * qty)*((100-disc1-disc2-disc3)/100);
                itemPembelianTable.row.add([
                    "",
                    pembelian.barang[i].pembelianbarangID+"aqua botol 600ml",
                    "",
                    "<span class='pull-right'>"+numberWithCommas(qty)+"</span>",
                    "",
                    "<span class='pull-right'>Rp. "+numberWithCommas(hargaUnit)+"</span>",
                    "<span class='pull-right'>"+disc1 +" %</span>",
                    "<span class='pull-right'>"+disc2 +" %</span>",
                    "<span class='pull-right'>"+disc3 +" %</span>",
                    "<span class='pull-right'>Rp. "+numberWithCommas(itemSubtotal) +"</span>"
                ]).draw();
            }*/
        }
        else
        {
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}
function InitDetailPenjualanPage(curPenjualanID)
{
    setPage("DetailPenjualan");
    populateDetailPenjualan(curPenjualanID);
}
