/**
 * Created by Billy on 04-Nov-16.
 */

var currentToken = localStorage.getItem("token");
function populateDetailPenjualan(curPenjualanID)
{
    GetDetailPenjualan(currentToken, curPenjualanID, function(result)
    {
        var  itemPenjualanTable;// =$("#Detailpenjualan-ItemTable").DataTable();
        var  CicilanPenjualanTable;// =$("#Detailpenjualan-CicilanTable").DataTable();
        if (result.token_status=="success")
        {
            var penjualan = result.data[0];
            if (penjualan.status=="lunas")
            {
                $("#Detailpenjualan-PayButton").hide();
            }
            else {
                $("#Detailpenjualan-PayButton").show();
            }
            if (!$.fn.DataTable.isDataTable("#Detailpenjualan-ItemTable")) {
                itemPenjualanTable = $("#Detailpenjualan-ItemTable").DataTable({
                    "paging": false,
                    "lengthChange": false,
                    "searching": false,
                    "ordering": false,
                    "info": false,
                    "autoWidth": false
                });
            }
            else {
                itemPenjualanTable = $("#Detailpenjualan-ItemTable").DataTable();
                itemPenjualanTable.clear().draw();
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
            document.getElementById("Detailpenjualan-PelangganText").innerHTML = penjualan.pelangganNama;
            document.getElementById("Detailpenjualan-TglJatuhTempoText").innerHTML = JatuhTempoText;
            document.getElementById("Detailpenjualan-TglTransaksiText").innerHTML = TglTransaksiText;
            document.getElementById("Detailpenjualan-PembayaranText").innerHTML = PembayaranText;
            document.getElementById("Detailpenjualan-StatusText").innerHTML = capitalizeFirstLetter(penjualan.status);
            document.getElementById("Detailpenjualan-KirimkeText").innerHTML = penjualan.alamat;
            document.getElementById("Detailpenjualan-KodeText").innerHTML = StrId;
            document.getElementById("Detailpenjualan-NotesText").innerHTML = notesText;

            var grandTotalText ="<span class='pull-right'>Rp. "+numberWithCommas(penjualan.subtotal)+"</span>";
           // var grandDiscountText ="<span class='pull-right'>"+numberWithCommas(penjualan.disc)+" %</span>";

            $(itemPenjualanTable.column(7).footer()).html(grandTotalText);
          //  $(itemPembelianTable.column(7).footer()).html(grandDiscountText);
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
                if (hasHakAkses("HargaPokokLaba"))
                {
                    var hpokok="";//;((hargaUnit*qty)*(100-disc)/100)-(qty*harga_pokok);
                    var laba="";
                    itemPenjualanTable.row.add([
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
                else {
                    itemPenjualanTable.row.add([
                        "<span class='pull-right'>"+(i+1).toString()+"</span>",
                        "<span class='pull-right'>"+nama_barang+"</span>",
                        "<span class='pull-right'>"+isi_box+"</span>",
                        "<span class='pull-right'>"+numberWithCommas(qty)+"</span>",
                        "<span class='pull-right'>"+satuan_unit+"</span>",
                        "<span class='pull-right'>Rp. "+numberWithCommas(hargaUnit)+"</span>",
                        "<span class='pull-right'>"+disc +" %</span>",
                        "<span class='pull-right'>Rp. "+numberWithCommas(itemSubtotal) +"</span>"
                    ]);
                }
            }
            itemPenjualanTable.draw();

            //nggambar cicilan
            if(penjualan.jatuh_tempo!=null && penjualan.jatuh_tempo!='')
            {
                $(".Detailpenjualan-cicilanSection").show();
                if (!$.fn.DataTable.isDataTable("#Detailpenjualan-cicilanTable")) {
                    CicilanPenjualanTable = $("#Detailpenjualan-cicilanTable").DataTable({
                        "paging": false,
                        "lengthChange": false,
                        "searching": false,
                        "ordering": true,
                        "info": false,
                        "autoWidth": false,
                        "language": {
                            "emptyTable": "Belum Ada Pembayaran"
                        }
                    });
                }
                else {
                    CicilanPenjualanTable = $("#Detailpenjualan-cicilanTable").DataTable();
                    CicilanPenjualanTable.clear().draw();
                }
                var totalsudahdibayar = 0;
                for (i=0;i<penjualan.cicilan.length;i++)
                {
                     if (penjualan.cicilan[i].cara_pembayaran!="voucher")
                     {
                         totalsudahdibayar+= penjualan.cicilan[i].nominal;
                         var TglTransaksiCicilan = new Date(penjualan.cicilan[i].tanggal_cicilan);
                         var TglTransaksiCicilanText = TglTransaksiCicilan.getDate()+"/"+(TglTransaksiCicilan.getMonth()+1)+"/"+TglTransaksiCicilan.getFullYear();

                         var TglPencairanCicilan = penjualan.cicilan[i].tanggal_pencairan;
                         var TglPencairanCicilanText="-";
                         if (TglPencairanCicilan==null || TglPencairanCicilan=="")
                         {
                             TglPencairanCicilanText = TglPencairanCicilan.getDate()+"/"+(TglPencairanCicilan.getMonth()+1)+"/"+TglPencairanCicilan.getFullYear();
                         }
                         var nomor_giro  = penjualan.cicilan[i].nomor_giro;
                         if (nomor_giro==null || nomor_giro=="")
                         {
                             nomor_giro="-";
                         }
                         var bank  = penjualan.cicilan[i].bank;
                         if (bank==null || bank=="")
                         {
                             bank="-";
                         }
                         CicilanPenjualanTable.row.add([
                             TglTransaksiCicilanText,
                             capitalizeFirstLetter(penjualan.cicilan[i].cara_pembayaran),
                             "<span class='pull-right'>Rp. "+ numberWithCommas(penjualan.cicilan[i].nominal)+"</span>",
                             bank,
                             nomor_giro,
                             TglTransaksiCicilanText,
                             penjualan.cicilan[i].notes
                         ]);
                     }
                }
                CicilanPenjualanTable.draw();

                var cicilantotaltext = "<span class='pull-right'>Rp. "+numberWithCommas(totalsudahdibayar)+"</span>";
                $(CicilanPenjualanTable.column(2).footer()).html(cicilantotaltext);
                var cicilanKekurangan  = penjualan.subtotal - totalsudahdibayar;
                var cicilanKurangText= "<span class='pull-right'>Rp. "+numberWithCommas(cicilanKekurangan)+"</span>";
                if (cicilanKekurangan<=0)
                {
                    cicilanKurangText="Lunas";
                }
                $(CicilanPenjualanTable.column(4).footer()).html(cicilanKurangText);
            }
            else {
                $(".Detailpenjualan-cicilanSection").hide();
            }


        }
        else
        {
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}
function InitDetailPenjualanPage(curPenjualanID)
{

    currentToken = localStorage.getItem("token");
    console.log("initdetailpenjualan");
    setPage("DetailPenjualan");
    populateDetailPenjualan(curPenjualanID);
    if (hasHakAkses("HargaPokokLaba"))
    {
        $(".Detailpenjualan-HargaPokokLaba").show();
    }
    else{
        $(".Detailpenjualan-HargaPokokLaba").hide();
    }

    document.getElementById("Detailpenjualan-PayButton").onclick= function()
    {
        PopulateNotificationModal("jual", curPenjualanID);
    };

    if (hasHakAkses("ReturPenjualan"))
    {
        $("#Detailpenjualan-ReturButton").show();
        document.getElementById("Detailpenjualan-ReturButton").onclick=function(){
            InitReturPenjualanPage(curPenjualanID);
        };
    }
    else {
        $("#Detailpenjualan-ReturButton").hide();
    }
    if (hasHakAkses("EditPenjualan"))
    {
        $("#Detailpenjualan-EditButton").show();
        document.getElementById("Detailpenjualan-EditButton").onclick=function(){
            InitEditPenjualanPage(curPenjualanID);
        };
    }
    else {
        $("#Detailpenjualan-EditButton").hide();
    }
}
