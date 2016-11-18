/**
 * Created by Billy on 04-Nov-16.
 */
var currentToken;
function populateDetailPembelian(currentPembelianID)
{
    GetDetailPembelian(currentToken, currentPembelianID, function(result)
    {
        var  itemPembelianTable;// =$("#Detailpembelian-ItemTable").DataTable();
        var  CicilanPembelianTable;// =$("#Detailpembelian-CicilanTable").DataTable();
        if (result.token_status=="success")
        {
            var pembelian = result.data[0];
            if (pembelian.status=="lunas")
            {
                $("#Detailpembelian-PayButton").hide();
            }
            else {
                $("#Detailpembelian-PayButton").show();
            }
            if (!$.fn.DataTable.isDataTable("#Detailpembelian-ItemTable"))
            {
                itemPembelianTable =$("#Detailpembelian-ItemTable").DataTable({
                    "paging": false,
                    "lengthChange": false,
                    "searching": false,
                    "ordering": false,
                    "info": false,
                    "autoWidth": false
                });
            }
            else {
                itemPembelianTable =$("#Detailpembelian-ItemTable").DataTable();
                itemPembelianTable.clear().draw();
            }
            var i;

            var pad ="0000";
            var id = "" + pembelian.pembelianID;
            var StrId  = "TB"+ pad.substring(0, pad.length - id.length)+id;

            var TglTransaksi = new Date(pembelian.tanggal_transaksi);
            var TglTransaksiText = TglTransaksi.getDate()+"/"+(TglTransaksi.getMonth()+1)+"/"+TglTransaksi.getFullYear();

            var JatuhTempoText;
            var PembayaranText;
            if (pembelian.jatuh_tempo!=null)
            {
                PembayaranText = "Bon";
                var JatuhTempo = new Date(pembelian.jatuh_tempo);
                JatuhTempoText = JatuhTempo.getDate()+"/"+(JatuhTempo.getMonth()+1)+"/"+JatuhTempo.getFullYear();
            }
            else
            {
                PembayaranText = "Cash";
                JatuhTempoText="-";
            }
            var notesText ;
            if (pembelian.notes=="" || pembelian.notes==null)
            {
                notesText ="-";
            }
            else {
                notesText =pembelian.notes;
            }
            console.log(pembelian);
            document.getElementById("Detailpembelian-SupplierText").innerHTML = pembelian.supplierNama;
            document.getElementById("Detailpembelian-TglJatuhTempoText").innerHTML = JatuhTempoText;
            document.getElementById("Detailpembelian-TglTransaksiText").innerHTML = TglTransaksiText;
            document.getElementById("Detailpembelian-PembayaranText").innerHTML = PembayaranText;
            document.getElementById("Detailpembelian-StatusText").innerHTML = capitalizeFirstLetter(pembelian.status);
            document.getElementById("Detailpembelian-KodeText").innerHTML = StrId;
            document.getElementById("Detailpembelian-NotesText").innerHTML = notesText;

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
                var isi_box = (pembelian.barang[i].konversi_box).toString()+" "+capitalizeFirstLetter(pembelian.barang[i].satuan_acuan_box)
                var satuan_unit = pembelian.barang[i].satuan_unit
                var nama_barang = pembelian.barang[i].nama_barang
                itemPembelianTable.row.add([
                    "<span class='pull-right'>"+(i+1).toString()+"</span>",
                    nama_barang,
                    "<span class='pull-right'>@ "+ isi_box+"</span>",
                    "<span class='pull-right'>"+numberWithCommas(qty)+"</span>",
                    "<span class='pull-right'>"+capitalizeFirstLetter(satuan_unit)+" </span>",
                    "<span class='pull-right'>Rp. "+numberWithCommas(hargaUnit)+"</span>",
                    "<span class='pull-right'>"+disc1 +"% </span>",
                    "<span class='pull-right'>"+disc2 +"% </span>",
                    "<span class='pull-right'>"+disc3 +"% </span>",
                    "<span class='pull-right'>Rp. "+numberWithCommas(itemSubtotal) +"</span>"
                ])
            }
            itemPembelianTable.draw();

            if (!$.fn.DataTable.isDataTable("#Detailpembelian-cicilanTable")) {
                CicilanPembelianTable = $("#Detailpembelian-cicilanTable").DataTable({
                    "paging": false,
                    "lengthChange": false,
                    "searching": false,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "language": {
                        "emptyTable": "Belum Ada Pembayaran"
                    }
                });
            }
            else {
                CicilanPembelianTable = $("#Detailpembelian-cicilanTable").DataTable();
                CicilanPembelianTable.clear().draw();
            }
            var totalsudahdibayar=0;
            for (i=0;i<pembelian.cicilan.length;i++)
            {
                if (pembelian.cicilan[i].cara_pembayaran!='voucher')
                {
                    var TglTransaksiCicilan = new Date(pembelian.cicilan[i].tanggal_cicilan);
                    var TglTransaksiCicilanText = TglTransaksiCicilan.getDate()+"/"+(TglTransaksiCicilan.getMonth()+1)+"/"+TglTransaksiCicilan.getFullYear();

                    var TglPencairanCicilan = pembelian.cicilan[i].tanggal_pencairan;
                    var TglPencairanCicilanText="-";
                    if (TglPencairanCicilan==null || TglPencairanCicilan=="")
                    {
                        TglPencairanCicilanText = TglPencairanCicilan.getDate()+"/"+(TglPencairanCicilan.getMonth()+1)+"/"+TglPencairanCicilan.getFullYear();
                    }
                    var nomor_giro  = pembelian.cicilan[i].nomor_giro;
                    if (nomor_giro==null || nomor_giro=="")
                    {
                        nomor_giro="-";
                    }
                    var bank  = pembelian.cicilan[i].bank;
                    if (bank==null || bank=="")
                    {
                        bank="-";
                    }
                    totalsudahdibayar += pembelian.cicilan[i].nominal;
                    CicilanPembelianTable.row.add([
                        TglTransaksiCicilanText,
                        pembelian.cicilan[i].cara_pembayaran,
                        "Rp. "+ numberWithCommas(pembelian.cicilan[i].nominal),
                        bank,
                        nomor_giro,
                        TglTransaksiCicilanText,
                        pembelian.cicilan[i].notes
                    ]);
                }
                else
                {
                //    $(CicilanPembelianTable.getElementsByTagName("tfoot")[0]).row.add()
                }

            }
            CicilanPembelianTable.draw();
            var cicilantotaltext = "<span class='pull-right'>Rp. "+numberWithCommas(totalsudahdibayar)+"</span>";
            $(CicilanPembelianTable.column(2).footer()).html(cicilantotaltext);
            var cicilanKekurangan  = pembelian.subtotal - totalsudahdibayar;
            var cicilanKurangText= "<span class='pull-right'>Rp. "+numberWithCommas(cicilanKekurangan)+"</span>";
            if (cicilanKekurangan<=0)
            {
                cicilanKurangText="Lunas";
            }
            $(CicilanPembelianTable.column(4).footer()).html(cicilanKurangText);

        }
        else
        {
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}
function InitDetailPembelianPage(curPembelianID)
{
    currentToken = localStorage.getItem("token");
    setPage("DetailPembelian");
    populateDetailPembelian(curPembelianID);
    document.getElementById("Detailpembelian-PayButton").onclick= function() {
        PopulateNotificationModal("beli", curPembelianID);
    };
    if (hasHakAkses("ReturPembelian"))
    {
        $("#Detailpembelian-ReturButton").show();
        document.getElementById("Detailpembelian-ReturButton").onclick=function()
        {
            InitReturPembelianPage(curPembelianID);
        };
    }
    else {
        $("#Detailpembelian-ReturButton").hide();
    }
    if (hasHakAkses("EditPembelian"))
    {
        $("#Detailpembelian-EditButton").show();
        document.getElementById("Detailpembelian-EditButton").onclick= function(){
            InitEditPembelianPage(curPembelianID);
        };
    }
    else {
        $("#Detailpembelian-EditButton").hide();
    }



}
