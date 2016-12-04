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

            var hargaAfterDisc =pembelian.subtotal*(100-pembelian.disc)/100;
            var grandTotalText ="<span class='pull-right'>Rp. "+numberWithCommas(hargaAfterDisc)+"</span>";
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
                var itemSubtotal = parseInt(Math.round(hargaUnit * qty*((100-disc1)/100)*((100-disc2)/100)*((100-disc3)/100)));
                var isi_box = (pembelian.barang[i].konversi_box).toString()+" "+capitalizeFirstLetter(pembelian.barang[i].satuan_acuan_box);
                var satuan_unit = pembelian.barang[i].satuan_unit;
                var nama_barang = pembelian.barang[i].nama_barang;
                itemPembelianTable.row.add([
                    "<span class='pull-right'>"+(i+1).toString()+"</span>",
                    nama_barang,
                    "@ "+ isi_box,
                    "<span class='pull-right'>"+numberWithCommas(qty)+"</span>",
                    capitalizeFirstLetter(satuan_unit),
                    "<span class='pull-right'>Rp. "+numberWithCommas(hargaUnit)+"</span>",
                    "<span class='pull-right'>"+disc1 +"% </span>",
                    "<span class='pull-right'>"+disc2 +"% </span>",
                    "<span class='pull-right'>"+disc3 +"% </span>",
                    "<span class='pull-right'>Rp. "+numberWithCommas(itemSubtotal) +"</span>"
                ])
            }
            itemPembelianTable.draw();

            var ItemTableFooter = document.getElementById("Detailpembelian-ItemTable").getElementsByTagName("tfoot")[0];
            while(ItemTableFooter.rows.length>1)
            {
                ItemTableFooter.deleteRow(-1);
            }

            DetailPembelianGetVoucherList(0, pembelian, false, 0);


            if(pembelian.jatuh_tempo!=null && pembelian.jatuh_tempo!='')
            {
                $(".Detailpembelian-cicilanSection").show();
                if (!$.fn.DataTable.isDataTable("#Detailpembelian-cicilanTable")) {
                    CicilanPembelianTable = $("#Detailpembelian-cicilanTable").DataTable({
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
                    CicilanPembelianTable = $("#Detailpembelian-cicilanTable").DataTable();
                    CicilanPembelianTable.clear().draw();
                }
                var totalsudahdibayar = 0;
                var totalsisa = (pembelian.subtotal*(100-pembelian.disc)/100);
                for (i = 0; i < pembelian.cicilan.length; i++) {
                    totalsisa -=pembelian.cicilan[i].nominal;
                    if (pembelian.cicilan[i].cara_pembayaran != 'voucher' && pembelian.cicilan[i].cara_pembayaran!='retur') {
                        var TglTransaksiCicilan = new Date(pembelian.cicilan[i].tanggal_cicilan);
                        var TglTransaksiCicilanText = TglTransaksiCicilan.getDate() + "/" + (TglTransaksiCicilan.getMonth() + 1) + "/" + TglTransaksiCicilan.getFullYear();

                        var TglPencairanCicilan = pembelian.cicilan[i].tanggal_pencairan;
                        var TglPencairanCicilanText = "-";
                        if (TglPencairanCicilan != null && TglPencairanCicilan != "") {
                            TglPencairanCicilanText = TglPencairanCicilan.getDate() + "/" + (TglPencairanCicilan.getMonth() + 1) + "/" + TglPencairanCicilan.getFullYear();
                        }
                        var nomor_giro = pembelian.cicilan[i].nomor_giro;
                        if (nomor_giro == null || nomor_giro == "") {
                            nomor_giro = "-";
                        }
                        var bank = pembelian.cicilan[i].bank;
                        if (bank == null || bank == "") {
                            bank = "-";
                        }
                        totalsudahdibayar += pembelian.cicilan[i].nominal;
                        CicilanPembelianTable.row.add([
                            TglTransaksiCicilanText,
                            pembelian.cicilan[i].cara_pembayaran,
                            "<span class='pull-right'>Rp. " + numberWithCommas(pembelian.cicilan[i].nominal)+"</span>",
                            bank,
                            nomor_giro,
                            TglPencairanCicilanText,
                            pembelian.cicilan[i].notes
                        ]);
                    }
                    else {
                        //    $(CicilanPembelianTable.getElementsByTagName("tfoot")[0]).row.add()
                    }

                }
              //  var subtotalafterdisc = pembelian.subtotal*(100-pembelian.disc)/100;
                CicilanPembelianTable.draw();
                var cicilantotaltext = "<span class='pull-right'>Rp. " + numberWithCommas(totalsudahdibayar) + "</span>";
                $(CicilanPembelianTable.column(2).footer()).html(cicilantotaltext);
                var cicilanKekurangan = totalsisa;
                var cicilanKurangText = "<span class='pull-right'>Rp. " + numberWithCommas(cicilanKekurangan) + "</span>";
                if (cicilanKekurangan <= 0) {
                    cicilanKurangText = "Lunas";
                }
                $(CicilanPembelianTable.column(4).footer()).html(cicilanKurangText);
            }
            else
            {
                $(".Detailpembelian-cicilanSection").hide();
            }

            var ReturPembelianTable;
            console.log(pembelian.retur);
            if(pembelian.retur!=null && pembelian.retur.length>0)
            {

                $(".Detailpembelian-returSection").show();
                if (!$.fn.DataTable.isDataTable("#Detailpembelian-returTable")) {
                    ReturPembelianTable = $("#Detailpembelian-returTable").DataTable({
                        "paging": false,
                        "lengthChange": false,
                        "searching": false,
                        "ordering": false,
                        "info": false,
                        "autoWidth": false
                    });
                }
                else {
                    ReturPembelianTable = $("#Detailpembelian-returTable").DataTable();
                    ReturPembelianTable.clear().draw();
                }
                for (i=0;i<pembelian.retur.length;i++)
                {
                    var tgl_temp = new Date(pembelian.retur[i].tanggal);
                    var tgl = tgl_temp.getDate()+"/"+(tgl_temp.getMonth()+1)+"/"+tgl_temp.getFullYear();

                    var metode = "Cash";
                    if(pembelian.retur[i].metode == 1) metode = "Voucher";

                    var len = pembelian.barang.length;
                    var isi_box_retur = 0;
                    var satuan_unit_retur;
                    var harga_unit_retur;
                    var disc1_retur, disc2_retur, disc3_retur;
                    var nama_retur;
                    for(var j=0; j<len; j++){
                        if(pembelian.barang[j].pembelianbarangID == pembelian.retur[i].pembelianbarangID){
                            isi_box_retur = "@ "+(pembelian.barang[j].konversi_box).toString() + " " + capitalizeFirstLetter(pembelian.barang[j].satuan_acuan_box);
                            satuan_unit_retur = pembelian.barang[j].satuan_unit;
                            harga_unit_retur = pembelian.barang[j].harga_per_biji;
                            disc1_retur = pembelian.barang[j].disc_1;
                            disc2_retur = pembelian.barang[j].disc_2;
                            disc3_retur = pembelian.barang[j].disc_3;
                            nama_retur = pembelian.barang[j].nama_barang
                        }
                    }

                    var subtotal_retur = harga_unit_retur * pembelian.retur[i].quantity;
                    subtotal_retur = subtotal_retur * (100 - disc1_retur - disc2_retur - disc3_retur) / 100;

                    ReturPembelianTable.row.add([
                        "<span class='pull-right'>"+(i+1).toString()+"</span>",
                        tgl,
                        nama_retur,
                        isi_box_retur,
                        "<span class='pull-right'>" +pembelian.retur[i].quantity+"</span>",
                        capitalizeFirstLetter(satuan_unit_retur),
                        "<span class='pull-right'>Rp. "+numberWithCommas(harga_unit_retur)+"</span>",
                        "<span class='pull-right'>"+disc1_retur+" %</span>",
                        "<span class='pull-right'>"+disc2_retur+" %</span>",
                        "<span class='pull-right'>"+disc3_retur+" %</span>",
                        "<span class='pull-right'>Rp. "+numberWithCommas(subtotal_retur)+"</span>",
                        metode
                    ]);
                }
                ReturPembelianTable.draw();
            }
            else {
                $(".Detailpembelian-returSection").hide();
            }
        }
        else
        {
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}
function DetailPembelianGetVoucherList(i, pembelian, adavocer, totalpengurangan)
{
    var ItemTableFooter = document.getElementById("Detailpembelian-ItemTable").getElementsByTagName("tfoot")[0];
    var rowCount, row, col1, col2;
    if (i==pembelian.cicilan.length) {
        if (adavocer)
        {
            rowCount = ItemTableFooter.rows.length;
            row = ItemTableFooter.insertRow(rowCount);
            col1 = row.insertCell(0);
            col1.setAttribute("colspan", "9");
            col1.innerHTML = "<span class='pull-right' style='font-weight:bold;'>Grand Total</span>";
            col2 = row.insertCell(1);
            var hargaAfterDisc = pembelian.subtotal*(100-pembelian.disc)/100;
            col2.innerHTML = "<span class='pull-right' style='font-weight:bold;'>Rp. "+numberWithCommas(hargaAfterDisc-totalpengurangan)+"</span>";
        }
    }
    else if (pembelian.cicilan[i].cara_pembayaran=="voucher")
    {
        GetPembelianDariVoucher(currentToken, pembelian.cicilan[i].voucherID,  function(result){
            console.log(result);
            var tanggalStr  = new Date(result.tanggal);
            var tanggalretur = tanggalStr.getDate()+"/"+(tanggalStr.getMonth()+1)+"/"+tanggalStr.getFullYear();
            adavocer=true;
            rowCount = ItemTableFooter.rows.length;
            row = ItemTableFooter.insertRow(rowCount);
            col1 = row.insertCell(0);
            col1.setAttribute("colspan", "9");
            col1.innerHTML =
                "<a onclick='InitDetailPembelianPage("+result.pembelianID+")'>" +
                "<span class='pull-right' >Voucher dari Pembelian tanggal "+tanggalretur+
                "</span>" +
                "</a>";
            col2 = row.insertCell(1);
            col2.innerHTML = "<span class='pull-right'>-Rp. "+numberWithCommas(pembelian.cicilan[i].nominal)+"</span>";
            totalpengurangan+=pembelian.cicilan[i].nominal;
            DetailPembelianGetVoucherList(i+1, pembelian, adavocer, totalpengurangan);
        });
    }
    else if (pembelian.cicilan[i].cara_pembayaran=="retur")
    {
        var tanggalStr  = new Date(pembelian.cicilan[i].tanggal_cicilan);
        var tanggalretur = tanggalStr.getDate()+"/"+(tanggalStr.getMonth()+1)+"/"+tanggalStr.getFullYear();
        adavocer=true;
        rowCount = ItemTableFooter.rows.length;
        row = ItemTableFooter.insertRow(rowCount);
        col1 = row.insertCell(0);
        col1.setAttribute("colspan", "9");
        col1.innerHTML =
            "<span class='pull-right' >Retur tanggal "+tanggalretur+
            "</span>";
        col2 = row.insertCell(1);
        col2.innerHTML = "<span class='pull-right'>-Rp. "+numberWithCommas(pembelian.cicilan[i].nominal)+"</span>";
        totalpengurangan+=pembelian.cicilan[i].nominal;
        DetailPembelianGetVoucherList(i+1, pembelian, adavocer, totalpengurangan);
    }
    else{
        DetailPembelianGetVoucherList(i+1, pembelian, adavocer, totalpengurangan);
    }
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

    const BrowserWindow = require('electron').remote.BrowserWindow;
    const ipcRenderer = require('electron').ipcRenderer;
    //ipcRenderer.removeAllListeners();
    const path = require('path');

    document.getElementById("Detailpembelian-PrintButton").onclick = function () {
        const windowID = BrowserWindow.getFocusedWindow().id;
        const invisPath = 'file://' + path.join(__dirname, 'printpages/PembelianBesar.html');
        let win = new BrowserWindow({ width: 800, height: 800, show: true });
        win.loadURL(invisPath);

        win.webContents.on('did-finish-load', function () {
            win.webContents.send('print-pembelian-besar', curPembelianID, windowID)
        });
    };
    ipcRenderer.on('pembelian-besar-printed', function (event, input, output) {
        ChangePembelianPrintedStatus(currentToken, curPembelianID, function(result){
            if (result.token_status=="success")
            {
                console.log(result);
                createAlert("success", "Pembelian telah di print");
            }
        });
    //    ipcRenderer.removeAllListeners();
    });


}
