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

            if (hasHakAkses("HargaPokokLaba")) {
                itemPenjualanTable.column(".Detailpenjualan-HargaPokokLaba").visible(true);
            }
            else{
                itemPenjualanTable.column(".Detailpenjualan-HargaPokokLaba").visible(false);
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

            $(itemPenjualanTable.column(7).footer()).html(grandTotalText);
            console.log(penjualan);
            var labatotal = 0;
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
                    var hpokok=penjualan.barang[i].konversi_unit * penjualan.barang[i].konversi_acuan_unit * penjualan.barang[i].harga_pokok_saat_ini;
                    var laba=itemSubtotal - (qty*hpokok);
                    labatotal+=laba;
                    itemPenjualanTable.row.add([
                        "<span class='pull-right'>"+(i+1).toString()+"</span>",
                        nama_barang,
                        "@ "+isi_box+"",
                        "<span class='pull-right'>"+numberWithCommas(qty)+"</span>",
                        capitalizeFirstLetter(satuan_unit)  ,
                        "<span class='pull-right'>Rp. "+numberWithCommas(hargaUnit)+"</span>",
                        "<span class='pull-right'>"+disc +" %</span>",
                        "<span class='pull-right'>Rp. "+numberWithCommas(itemSubtotal) +"</span>",
                        "<span class='pull-right'>Rp. "+numberWithCommas(hpokok)+"</span>",
                        "<span class='pull-right'>Rp. "+numberWithCommas(laba)+"</span>"
                    ]);
                }
                else {
                    itemPenjualanTable.row.add([
                        "<span class='pull-right'>"+(i+1).toString()+"</span>",
                        nama_barang,
                        "@ "+isi_box,
                        "<span class='pull-right'>"+numberWithCommas(qty)+"</span>",
                       capitalizeFirstLetter(satuan_unit),
                        "<span class='pull-right'>Rp. "+numberWithCommas(hargaUnit)+"</span>",
                        "<span class='pull-right'>"+disc +" %</span>",
                        "<span class='pull-right'>Rp. "+numberWithCommas(itemSubtotal) +"</span>",
                        "",
                        ""
                    ]);
                }
            }
            itemPenjualanTable.draw();
            //nggambar deail pengurangan vocer
            var ItemTableFooter = document.getElementById("Detailpenjualan-ItemTable").getElementsByTagName("tfoot")[0];
            while(ItemTableFooter.rows.length>1)
            {
                ItemTableFooter.deleteRow(-1);
            }
            if (hasHakAkses("HargaPokokLaba"))
            {
                ItemTableFooter.rows[0].cells[4].children[0].innerHTML = "Rp. "+numberWithCommas(labatotal);
            }
            DetailPenjualanGetVoucherList(0, penjualan, false, 0);
            //nggambar cicilan
            console.log(penjualan.jatuh_tempo);
            if(penjualan.jatuh_tempo!=null && penjualan.jatuh_tempo!='')
            {
                $(".Detailpenjualan-cicilanSection").show();
                if (!$.fn.DataTable.isDataTable("#Detailpenjualan-cicilanTable")) {
                    CicilanPenjualanTable = $("#Detailpenjualan-cicilanTable").DataTable({
                        "paging": false,
                        "lengthChange": false,
                        "searching": false,
                        "ordering": false,
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
                var totalsisa = penjualan.subtotal;
                for (i=0;i<penjualan.cicilan.length;i++)
                {

                    totalsisa -=penjualan.cicilan[i].nominal;
                     if (penjualan.cicilan[i].cara_pembayaran!="voucher" && penjualan.cicilan[i].cara_pembayaran!='retur')
                     {
                         totalsudahdibayar+= penjualan.cicilan[i].nominal;
                         var TglTransaksiCicilan = new Date(penjualan.cicilan[i].tanggal_cicilan);
                         var TglTransaksiCicilanText = TglTransaksiCicilan.getDate()+"/"+(TglTransaksiCicilan.getMonth()+1)+"/"+TglTransaksiCicilan.getFullYear();

                         var TglPencairanCicilan = new Date(penjualan.cicilan[i].tanggal_pencairan);
                         console.log(TglPencairanCicilan);
                         var TglPencairanCicilanText="-";
                         if (penjualan.cicilan[i].tanggal_pencairan!=null && penjualan.cicilan[i].tanggal_pencairan!="")
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
                             TglPencairanCicilanText,
                             penjualan.cicilan[i].notes
                         ]);
                     }

                }
                CicilanPenjualanTable.draw();

                var cicilantotaltext = "<span class='pull-right'>Rp. "+numberWithCommas(totalsudahdibayar)+"</span>";
                $(CicilanPenjualanTable.column(2).footer()).html(cicilantotaltext);
                var cicilanKekurangan  = totalsisa;
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

            var ReturPenjualanTable;
            console.log(penjualan.retur);
            if(penjualan.retur!=null && penjualan.retur.length>0)
            {

                $(".Detailpenjualan-returSection").show();
                if (!$.fn.DataTable.isDataTable("#Detailpenjualan-returTable")) {
                    ReturPenjualanTable = $("#Detailpenjualan-returTable").DataTable({
                        "paging": false,
                        "lengthChange": false,
                        "searching": false,
                        "ordering": false,
                        "info": false,
                        "autoWidth": false
                    });
                }
                else {
                    ReturPenjualanTable = $("#Detailpenjualan-returTable").DataTable();
                    ReturPenjualanTable.clear().draw();
                }
                if (hasHakAkses("HargaPokokLaba")) {
                    ReturPenjualanTable.column(".Detailpenjualan-HargaPokokLaba").visible(true);
                }
                else{
                    ReturPenjualanTable.column(".Detailpenjualan-HargaPokokLaba").visible(false);
                }

                console.log(penjualan.retur);
                for (i=0;i<penjualan.retur.length;i++)
                {
                    var tgl_temp = new Date(penjualan.retur[i].tanggal);
                    var tgl = tgl_temp.getDate()+"/"+(tgl_temp.getMonth()+1)+"/"+tgl_temp.getFullYear();

                    var metode = "Cash";
                    if(penjualan.retur[i].metode == 1) metode = "Voucher";

                    var len = penjualan.barang.length;
                    var isi_box_retur = 0;
                    var satuan_unit_retur;
                    var harga_unit_retur;
                    var disc_retur;
                    var nama_retur;
                    for(var j=0; j<len; j++){
                        if(penjualan.barang[j].penjualanbarangID == penjualan.retur[i].penjualanbarangID){
                            isi_box_retur = "@ "+(penjualan.barang[j].konversi_box).toString() + " " + capitalizeFirstLetter(penjualan.barang[j].satuan_acuan_box);
                            satuan_unit_retur = capitalizeFirstLetter(penjualan.barang[j].satuan_unit);
                            harga_unit_retur = penjualan.barang[j].harga_jual_saat_ini;
                            disc_retur = penjualan.barang[j].disc;
                            nama_retur = penjualan.barang[j].nama_barang;
                        }
                    }
                    var subtotal_retur = harga_unit_retur * penjualan.retur[i].quantity;
                    subtotal_retur = subtotal_retur * (100 - disc_retur) / 100;

                    ReturPenjualanTable.row.add([
                        "<span class='pull-right'>"+(i+1).toString()+"</span>",
                        tgl,
                        nama_retur,
                        isi_box_retur,
                        "<span class='pull-right'>"+numberWithCommas(penjualan.retur[i].quantity)+"</span>",
                        satuan_unit_retur,
                        "<span class='pull-right'>Rp. "+numberWithCommas(harga_unit_retur)+"</span>",
                        "<span class='pull-right'>"+disc_retur+" %</span>",
                        "<span class='pull-right'>Rp. "+numberWithCommas(subtotal_retur)+"</span>",
                        metode
                    ]);

                }
                ReturPenjualanTable.draw();
            }
            else {
                $(".Detailpenjualan-returSection").hide();
            }
        }
        else
        {
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}
function DetailPenjualanGetVoucherList(i, penjualan, adavocer, totalpengurangan)
{
    var ItemTableFooter = document.getElementById("Detailpenjualan-ItemTable").getElementsByTagName("tfoot")[0];
    console.log("i"+i);
    if (i == penjualan.cicilan.length) {
        console.log(adavocer);
        if (adavocer)
        {
            console.log("wewe");
            var rowCount = ItemTableFooter.rows.length;
            var row = ItemTableFooter.insertRow(rowCount);
            var  col1 = row.insertCell(0);
             col1.setAttribute("colspan", "7");
            col1.innerHTML = "<span class='pull-right' style='font-weight:bold;'>Grand Total</span>";
            var col2 = row.insertCell(1);
            col2.innerHTML = "<span class='pull-right' style='font-weight:bold;'>Rp. "+numberWithCommas(penjualan.subtotal-totalpengurangan)+"</span>";
        }
    }
    else if (penjualan.cicilan[i].cara_pembayaran=="voucher")
    {
        GetPenjualanDariVoucher(currentToken, penjualan.cicilan[i].voucherID,  function(result){
            console.log(result);
            var tanggalStr  = new Date(result.tanggal);
            var tanggalretur = tanggalStr.getDate()+"/"+(tanggalStr.getMonth()+1)+"/"+tanggalStr.getFullYear();
            adavocer=true;
            var rowCount = ItemTableFooter.rows.length;
            var row = ItemTableFooter.insertRow(rowCount);
            var col1 = row.insertCell(0);
            col1.setAttribute("colspan", "7");
            col1.innerHTML =
                "<a onclick='InitDetailPenjualanPage("+result.penjualanID+")'>" +
                "<span class='pull-right' >Voucher dari Penjualan tanggal "+tanggalretur+
                "</span>" +
                "</a>";
            var col2 = row.insertCell(1);
            col2.innerHTML = "<span class='pull-right'>-Rp. "+numberWithCommas(penjualan.cicilan[i].nominal)+"</span>";
            totalpengurangan+=penjualan.cicilan[i].nominal;
            DetailPenjualanGetVoucherList(i+1, penjualan, adavocer, totalpengurangan);
        });
    }
    else if (penjualan.cicilan[i].cara_pembayaran=="retur")
    {
            var tanggalStr  = new Date(penjualan.cicilan[i].tanggal_cicilan);
            var tanggalretur = tanggalStr.getDate()+"/"+(tanggalStr.getMonth()+1)+"/"+tanggalStr.getFullYear();
            adavocer=true;
            var rowCount = ItemTableFooter.rows.length;
            var row = ItemTableFooter.insertRow(rowCount);
            var col1 = row.insertCell(0);
            col1.setAttribute("colspan", "7");
            col1.innerHTML =
               "<span class='pull-right' >Retur tanggal "+tanggalretur+
                "</span>";
            var col2 = row.insertCell(1);
            col2.innerHTML = "<span class='pull-right'>-Rp. "+numberWithCommas(penjualan.cicilan[i].nominal)+"</span>";
            totalpengurangan+=penjualan.cicilan[i].nominal;
            DetailPenjualanGetVoucherList(i+1, penjualan, adavocer, totalpengurangan);
    }
    else {
        DetailPenjualanGetVoucherList(i+1, penjualan, adavocer, totalpengurangan);
    }
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

    const BrowserWindow = require('electron').remote.BrowserWindow;
    const ipcRenderer = require('electron').ipcRenderer;
    //ipcRenderer.removeAllListeners();
    const path = require('path');
    document.getElementById("Detailpenjualan-PrintBesarButton").onclick = function () {
        const windowID = BrowserWindow.getFocusedWindow().id;
        const invisPath = 'file://' + path.join(__dirname, 'printpages/PenjualanBesar.html');
        let win = new BrowserWindow({ width: 800, height: 800, show: true });
        win.loadURL(invisPath);

        win.webContents.on('did-finish-load', function () {
            win.webContents.send('print-penjualan-besar', curPenjualanID, windowID)
        });
    };
    document.getElementById("Detailpenjualan-PrintKecilButton").onclick = function () {
        const windowID = BrowserWindow.getFocusedWindow().id;
        const invisPath = 'file://' + path.join(__dirname, 'printpages/PenjualanKecil.html');
        let win = new BrowserWindow({ width: 400, height: 800, show: true });
        win.loadURL(invisPath);

        win.webContents.on('did-finish-load', function () {
            win.webContents.send('print-penjualan-kecil', curPenjualanID, windowID)
        });
    };
    ipcRenderer.on('penjualan-printed', function (event, input, output) {
        ChangePenjualanPrintedStatus(currentToken, curPenjualanID, function(result){
            if (result.token_status=="success")
            {
                createAlert("success", "Penjualan telah di print");
            }
        });
    ///    ipcRenderer.removeAllListeners();
    });

}
