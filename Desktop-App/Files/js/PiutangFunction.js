/**
 * Created by Billy on 01-Nov-16.
 */


var currentToken = localStorage.getItem("token");

var NamaBulan = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function populateLaporanPiutangData()
{
    var tglawaltemp2 = new Date($("#Piutang-TglawalDate").datepicker().val());
    var tglakhirtemp2 = new Date($("#Piutang-TglakhirDate").datepicker().val());
    var tglawal = tglawaltemp2.getFullYear()+"-"+(tglawaltemp2.getMonth()+1)+"-"+tglawaltemp2.getDate();
    var tglakhir = tglakhirtemp2.getFullYear()+"-"+(tglakhirtemp2.getMonth()+1)+"-"+tglakhirtemp2.getDate();

    var PiutangTable;
    getPiutangPenjualanData(currentToken, tglawal, tglakhir, function(result){
        var i;
        if (!$.fn.DataTable.isDataTable("#PiutangTable"))
        {
            PiutangTable = $('#PiutangTable').DataTable({
                "paging": true,
                "lengthChange": true,
                "searching": false,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "dom":'<"row"<"col-sm-12"t>><"row"<"col-sm-12"i>>'
            });
        }
        else {
            PiutangTable = $('#PiutangTable').DataTable();
            PiutangTable.clear().draw();
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
                PiutangTable.row.add([
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
            PiutangTable.draw();
        }
        else
        {
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}

function PiutangInitDate()
{
    var datebulanlalu = new Date();
    datebulanlalu.setMonth(datebulanlalu.getMonth()-1);
    var tglawalDatepicker = $("#Piutang-TglawalDate");
    var tglakhirDatepicker = $("#Piutang-TglakhirDate");
    tglawalDatepicker.datepicker({
        autoclose: true
    });
    tglakhirDatepicker.datepicker({
        autoclose: true
    });
    tglawalDatepicker.datepicker("setDate", datebulanlalu);
    tglakhirDatepicker.datepicker("setDate", new Date());
}

function PiutangSearchFromTable(queryID,  querySupplier, queryPembayaran, queryPrinted)
{
    var PiutangTable = $('#PiutangTable').DataTable();
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
    PiutangTable.
    columns("#PiutangTable-kode").search(StrId).
    columns("#PiutangTable-pelanggan").search(querySupplier).
    columns("#PiutangTable-pembayaran").search(queryPembayaran).
    columns("#PiutangTable-print").search(qPrinted).
    draw();
}
function InitPiutangPage()
{
    currentToken = localStorage.getItem("token");
    setPage("Piutang");
    PiutangInitDate();
    populateLaporanPiutangData();
    document.getElementById("Piutang-TglawalDate").onchange=function()
    {
        populateLaporanPiutangData();
    };
    document.getElementById("Piutang-TglakhirDate").onchange=function()
    {
        populateLaporanPiutangData();
    };

    $(".Piutang-search-filter").on("change",  function(){
        var formdata=  document.getElementById("Piutang-SearchForm");
        PiutangSearchFromTable(
            formdata.elements['id'].value,
            formdata.elements['pelanggan'].value,
            formdata.elements['pembayaran'].value,
            ''
        );
    });
}
