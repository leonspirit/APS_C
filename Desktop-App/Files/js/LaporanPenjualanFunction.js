/**
 * Created by Billy on 01-Nov-16.
 */

var currentToken = localStorage.getItem("token");
var NamaBulan = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


function populateLaporanPenjualanData()
{

    var tglawaltemp2 = new Date($("#Piutang-TglawalDate").datepicker().val());
    var tglakhirtemp2 = new Date($("#Piutang-TglakhirDate").datepicker().val());
    var tglawal = tglawaltemp2.getFullYear()+"-"+(tglawaltemp2.getMonth()+1)+"-"+tglawaltemp2.getDate();
    var tglakhir = tglakhirtemp2.getFullYear()+"-"+(tglakhirtemp2.getMonth()+1)+"-"+tglakhirtemp2.getDate();

    var PenjualanTable;// = $('#PenjualanTable').DataTable();
    getLunasPenjualanData(currentToken, tglawal, tglakhir, function(result) {
        var i;
        if (!$.fn.DataTable.isDataTable("#PenjualanTable"))
        {
            PenjualanTable = $('#PenjualanTable').DataTable({
                "paging": false,
                "lengthChange": false,
                "searching": false,
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
        if (result.token_status=="success")
        {
            for (i = 0; i < result.data.length; i++) {

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
                if (hasHakAkses("HargaPokokLaba"))
                {
                    var laba = "";
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
                    ]);
                }
                else
                {
                    PenjualanTable.row.add([
                        StrId,
                        result.data[i].pelangganNama,
                        tglTransaksi,
                        pembayaran,
                        tglJatuhTempo,
                        subtotal,
                        isPrinted,
                        detailButton
                    ]);
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

function LaporanPenjualanSearchFromTable(queryID,  querySupplier, queryPembayaran, queryPrinted)
{
    var LaporanPenjualanTable = $('#PenjualanTable').DataTable();
    var StrId;
    var queryID2 = parseInt(queryID);
    if (!isNaN(queryID2))
    {
        var pad ="0000";
        var id = "" + queryID2;
        StrId  = "TB"+ pad.substring(0, pad.length - id.length)+id;
    }
    else
        StrId = "";
    var qPrinted;
    if (queryPrinted=="sudah")
    {
        qPrinted ="";// "<i style='color:green' class='glyphicon glyphicon-ok'></i>";
    }
    else
    {
        qPrinted  ="";// "<i style='color:red' class='glyphicon glyphicon-red'></i>"
    }
    LaporanPenjualanTable.
    columns("#PenjualanTable-kode").search(StrId).
    columns("#PenjualanTable-pelanggan").search(querySupplier).
    columns("#PenjualanTable-pembayaran").search(queryPembayaran).
    columns("#PenjualanTable-print").search(qPrinted).
    draw();
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
        var formdata=  document.getElementById("Laporanpenjualan-SearchForm");
        LaporanPenjualanSearchFromTable(
            formdata.elements['id'].value,
            formdata.elements['pelanggan'].value,
            formdata.elements['pembayaran'].value,
            formdata.elements['print'].value
        );
    });
}