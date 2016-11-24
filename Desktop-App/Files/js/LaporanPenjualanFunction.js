/**
 * Created by Billy on 01-Nov-16.
 */

var currentToken;
var NamaBulan = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


function populateLaporanPenjualanData()
{

    var tglawaltemp2 = new Date($("#Laporanpenjualan-TglawalDate").datepicker().val());
    var tglakhirtemp2 = new Date($("#Laporanpenjualan-TglakhirDate").datepicker().val());
    var tglawal = tglawaltemp2.getFullYear()+"-"+(tglawaltemp2.getMonth()+1)+"-"+tglawaltemp2.getDate();
    var tglakhir = tglakhirtemp2.getFullYear()+"-"+(tglakhirtemp2.getMonth()+1)+"-"+tglakhirtemp2.getDate();

    var PenjualanTable;// = $('#PenjualanTable').DataTable();
    console.log(tglawal+tglakhir);
    getLunasPenjualanData(currentToken, tglawal, tglakhir, function(result) {
        var i;
        console.log(tglawal+tglakhir);

        var hargaPokokAkese = hasHakAkses("HargaPokokLaba");
        if (!$.fn.DataTable.isDataTable("#PenjualanTable"))
        {
            PenjualanTable = $('#PenjualanTable').DataTable({
                "paging": false,
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "dom":'<"row"<"col-sm-12"t>><"row"<"col-sm-12"i>>'
            });
        }
        else {
            PenjualanTable = $('#PenjualanTable').DataTable();
            PenjualanTable.clear().draw();
        }
        if (hargaPokokAkese){
            console.log("lili");
            PenjualanTable.column("#PenjualanTable-laba").visible(true);
         //   $("#PenjualanTable-laba").hide();
        }
        else {
            console.log("l0li");
            PenjualanTable.column("#PenjualanTable-laba").visible(false);
          //  $("#PenjualanTable-laba").show();
        }
        PenjualanTable.draw();

        if (result.token_status=="success")
        {

            var totalLaba = 0;
            var totalDuit = 0;

            for (i = 0; i < result.data.length; i++) {

                console.log("lila"+i);
                var pad = "0000";
                var id = "" + result.data[i].penjualanID;
                var StrId = "TJ" + pad.substring(0, pad.length - id.length) + id;

                var subtotal = "<span class='pull-right'>Rp. "+numberWithCommas(result.data[i].subtotal)+"</span>";

                var isPrinted="";
                if (result.data[i].isPrinted==1)
                    isPrinted="<i style='color:green' class='glyphicon glyphicon-ok'></i>";
                else
                    isPrinted="<i style='color:red' class='glyphicon glyphicon-remove'></i>";

                var detailButton = "<a onclick='InitDetailPenjualanPage("+id+");'><i class='glyphicon glyphicon-new-window'></i></a>";

                var d = new Date(result.data[i].tanggal_transaksi);
                var tglTransaksi = d.getDate()+" "+NamaBulan[d.getMonth()]+" "+d.getFullYear();
                var tglJatuhTempo = "-";
                var pembayaran;
                if (result.data[i].jatuh_tempo!=null)
                {
                    d = new Date(result.data[i].jatuh_tempo);
                    tglJatuhTempo = d.getDate()+" "+NamaBulan[d.getMonth()]+" "+d.getFullYear();
                    pembayaran = "Bon";
                }
                else {
                    pembayaran = "Cash";
                }
                    var laba = "<span class='pull-right'>Rp. "+numberWithCommas(result.data[i].laba)+"</span>";

                    totalLaba+= result.data[i].laba;
                    totalDuit = result.data[i].subtotal;

                 if (hargaPokokAkese) {
                     PenjualanTable.row.add([
                         StrId,
                         result.data[i].pelangganNama,
                         tglTransaksi,
                         pembayaran,
                         tglJatuhTempo,
                         subtotal,
                         laba,
                         isPrinted,
                         detailButton
                     ]).draw();
                 }
                 else {
                     PenjualanTable.row.add([
                         StrId,
                         result.data[i].pelangganNama,
                         tglTransaksi,
                         pembayaran,
                         tglJatuhTempo,
                         subtotal,
                         "",
                         isPrinted,
                         detailButton
                     ]).draw();
                 }
            }
            PenjualanTable.draw();
        }
        else
        {
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}


function LaporanPenjualanInitDate()
{
    var datebulanlalu = new Date();
    datebulanlalu.setMonth(datebulanlalu.getMonth()-1);
    var tglawalDatepicker = $("#Laporanpenjualan-TglawalDate");
    var tglakhirDatepicker = $("#Laporanpenjualan-TglakhirDate");
    tglawalDatepicker.datepicker({
        autoclose: true
    });
    tglakhirDatepicker.datepicker({
        autoclose: true
    });
    tglawalDatepicker.datepicker("setDate", datebulanlalu);
    tglakhirDatepicker.datepicker("setDate", new Date());
}

function LaporanPenjualanSearchFromTable(queryID,  queryPelanggan, queryPembayaran, queryPrinted)
{
    var LaporanPenjualanTable = $('#PenjualanTable').DataTable();
    var StrId;
    var queryID2 = parseInt(queryID);
    if (!isNaN(queryID2))
    {
        var pad ="0000";
        var id = "" + queryID2;
        StrId  = "TJ"+ pad.substring(0, pad.length - id.length)+id;
    }
    else
        StrId = "";
    var qPrinted;
  /*  if (queryPrinted=="sudah")
    {
        qPrinted ="<i style='color:green' class='glyphicon glyphicon-ok'></i>";
    }
    else if (queryPrinted=="belum")
    {
        qPrinted  = "<i style='color:red' class='glyphicon glyphicon-remove'></i>"
    }
    else {
        qPrinted  ="";
    }*/
  console.log(LaporanPenjualanTable);
    console.log("lil");
    LaporanPenjualanTable.
    columns("#PenjualanTable-kode").search(StrId).
    columns("#PenjualanTable-pembeli").search(queryPelanggan).
    columns("#PenjualanTable-pembayaran").search(queryPembayaran).
    columns("#PenjualanTable-print").search(queryPrinted).
    draw();
    console.log("ele");
}
function InitLaporanPenjualanPage()
{
    currentToken = localStorage.getItem("token");
    setPage("LaporanPenjualan");
    if (hasHakAkses("HargaPokokLaba"))
    {
        $("#PenjualanTable-laba").show();
    }
    else {
        $("#PenjualanTable-laba").hide();
    }

    LaporanPenjualanInitDate();
    populateLaporanPenjualanData();
    document.getElementById("Laporanpenjualan-TglawalDate").onchange=function()
    {
        populateLaporanPenjualanData();
    };
    document.getElementById("Laporanpenjualan-TglakhirDate").onchange=function()
    {
        populateLaporanPenjualanData();
    };
    $(".Laporanpenjualan-search-filter").on("change",  function(){
        console.log("lala");
        var formdata=  document.getElementById("Laporanpenjualan-SearchForm");
        LaporanPenjualanSearchFromTable(
            formdata.elements['id'].value,
            formdata.elements['pelanggan'].value,
            formdata.elements['pembayaran'].value,
            ''
        );
    });
}
