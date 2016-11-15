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
                $("#Detailpenjualan-PayButton").show();
            }
            else {
                $("#Detailpenjualan-PayButton").hide();
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
            if (penjualan.notes=="" || penjualan.notes==null)
            {
                notesText ="-";
            }
            else {
                notesText =penjualan.notes;
            }
            document.getElementById("Detailpenjualan-PelangganText").innerHTML = penjualan.nama;
            document.getElementById("Detailpenjualan-TglJatuhTempoText").innerHTML = JatuhTempoText;
            document.getElementById("Detailpenjualan-TglTransaksiText").innerHTML = TglTransaksiText;
            document.getElementById("Detailpenjualan-PembayaranText").innerHTML = PembayaranText;
            document.getElementById("Detailpenjualan-StatusText").innerHTML = capitalizeFirstLetter(penjualan.status);
            document.getElementById("Detailpenjualan-KirimkeText").innerHTML = penjualan.alamat;
            document.getElementById("Detailpenjualan-KodeText").innerHTML = StrId;
            document.getElementById("Detailpenjualan-NotesText").innerHTML = notesText;

            var grandTotalText ="<span class='pull-right'>Rp. "+numberWithCommas(penjualan.subtotal)+"</span>";
           // var grandDiscountText ="<span class='pull-right'>"+numberWithCommas(penjualan.disc)+" %</span>";

            $(itemPenjualanTable.column(2).footer()).html(grandTotalText);
          //  $(itemPembelianTable.column(7).footer()).html(grandDiscountText);
            console.log(penjualan);
            for (i=0;i<penjualan.barang.length;i++)
            {
                var hargaUnit = penjualan.barang[i].harga_per_biji;
                var qty = penjualan.barang[i].quantity;
                var disc = penjualan.barang[i].disc;
                var itemSubtotal = (hargaUnit * qty)*((100-disc)/100);
                if (hasHakAkses("HargaPokokLaba"))
                {
                    var hpokok="";
                    var laba="";
                    itemPenjualanTable.row.add([
                        "<span class='pull-right'>"+(i+1).toString()+"</span>",
                        penjualan.barang[i].penjualanbarangID+"aqua botol 600ml",
                        "",
                        "<span class='pull-right'>"+numberWithCommas(qty)+"</span>",
                        "",
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
                        penjualan.barang[i].penjualanbarangID+"aqua botol 600ml",
                        "",
                        "<span class='pull-right'>"+numberWithCommas(qty)+"</span>",
                        "",
                        "<span class='pull-right'>Rp. "+numberWithCommas(hargaUnit)+"</span>",
                        "<span class='pull-right'>"+disc +" %</span>",
                        "<span class='pull-right'>Rp. "+numberWithCommas(itemSubtotal) +"</span>"
                    ]);
                }
            }
            itemPenjualanTable.draw();
            if (!$.fn.DataTable.isDataTable("#Detailpenjualan-cicilanTable")) {
                CicilanPenjualanTable = $("#Detailpenjualan-cicilanTable").DataTable({
                    "paging": false,
                    "lengthChange": false,
                    "searching": false,
                    "ordering": true,
                    "info": false,
                    "autoWidth": false
                });
            }
            else {
                CicilanPenjualanTable = $("#Detailpenjualan-cicilanTable").DataTable();
                CicilanPenjualanTable.clear().draw();
            }
            for (i=0;i<penjualan.cicilan.length;i++)
            {
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
                if (bankl==null || bank=="")
                {
                    bank="-";
                }
                CicilanPenjualanTable.add.row([
                    TglTransaksiCicilanText,
                    penjualan.cicilan[i].cara_pembayaran,
                    "Rp. "+ numberWithCommas(penjualan.cicilan[i].nominal),
                    bank,
                    nomor_giro,
                    TglTransaksiCicilanText,
                    penjualan.cicilan[i].notes
                ]);
            }
            CicilanPenjualanTable.draw();
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
        PopulateNotificationModal("beli", curPenjualanID);
    };

    if (hasHakAkses("ReturPenjualan"))
    {
        $("#Detailpenjualan-ReturButton").show();
        document.getElementById("Detailpenjualan-ReturButton").onclick=function(){
            InitReturPembelianPage(curPenjualanID);
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
