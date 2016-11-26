/**
 * Created by Billy on 01-Nov-16.
 */


var currentToken = localStorage.getItem("token");

var NamaBulan = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function populateLaporanHutangData()
{

    var tglawaltemp2 = new Date($("#Hutang-TglawalDate").datepicker().val());
    var tglakhirtemp2 = new Date($("#Hutang-TglakhirDate").datepicker().val());
    var tglawal = tglawaltemp2.getFullYear()+"-"+(tglawaltemp2.getMonth()+1)+"-"+tglawaltemp2.getDate();
    var tglakhir = tglakhirtemp2.getFullYear()+"-"+(tglakhirtemp2.getMonth()+1)+"-"+tglakhirtemp2.getDate();

    var HutangTable;
    getHutangPembelianData(currentToken, tglawal, tglakhir, function(result){
        var i;
        if (!$.fn.DataTable.isDataTable("#HutangTable"))
        {
            HutangTable = $('#HutangTable').DataTable({
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
            HutangTable = $('#HutangTable').DataTable();
            HutangTable.clear().draw();
        }
        if (result.token_status=="success")
        {
            for (i = 0; i < result.data.length; i++) {

                var pad = "0000";
                var id = "" + result.data[i].pembelianID;
                var StrId = "TB" + pad.substring(0, pad.length - id.length) + id;

                var subtotalafterdisc = result.data[i].subtotal*(100-result.data[i].disc)/100;
                var subtotal = "<span class='pull-right'>Rp. "+numberWithCommas(subtotalafterdisc)+"</span>";

                var isPrinted="";
                if (result.data[i].isPrinted==1)
                    isPrinted="<i style='color:green' class='glyphicon glyphicon-ok'></i>";
                else
                    isPrinted="<i style='color:red' class='glyphicon glyphicon-remove'></i>";

                var detailButton = "<a onclick='InitDetailPembelianPage("+id+");'><i class='glyphicon glyphicon-new-window'></i></a>";

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
                HutangTable.row.add([
                    StrId,
                    result.data[i].supplierNama,
                    tglTransaksi,
                    pembayaran,
                    tglJatuhTempo,
                    subtotal,
                    isPrinted,
                    detailButton
                ]);
            }
            HutangTable.draw();
        }
        else
        {

        }
    });
}


function HutangInitDate()
{
    var datebulanlalu = new Date();
    datebulanlalu.setMonth(datebulanlalu.getMonth()-1);
    var tglawalDatepicker = $("#Hutang-TglawalDate");
    var tglakhirDatepicker = $("#Hutang-TglakhirDate");
    tglawalDatepicker.datepicker({
        autoclose: true
    });
    tglakhirDatepicker.datepicker({
        autoclose: true
    });
    tglawalDatepicker.datepicker("setDate", datebulanlalu);
    tglakhirDatepicker.datepicker("setDate", new Date());
}

function HutangSearchFromTable(queryID,  querySupplier, queryPembayaran, queryPrinted)
{
    var HutangTable = $('#HutangTable').DataTable();
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
        qPrinted ="<i style='color:green' class='glyphicon glyphicon-ok'></i>";
    }
    else if (queryPrinted=="belum")
    {
        qPrinted  = "<i style='color:red' class='glyphicon glyphicon-remove'></i>"
    }
    else {
        qPrinted="";
    }
    HutangTable.
    columns("#HutangTable-kode").search(StrId).
    columns("#HutangTable-supplier").search(querySupplier).
    columns("#HutangTable-pembayaran").search(queryPembayaran).
    columns("#HutangTable-print").search(qPrinted).
    draw();
}
function InitHutangPage()
{
    currentToken = localStorage.getItem("token");
    setPage("Hutang");
    HutangInitDate();
    populateLaporanHutangData();
    document.getElementById("Hutang-TglawalDate").onchange=function()
    {
        populateLaporanHutangData();
    };
    document.getElementById("Hutang-TglakhirDate").onchange=function()
    {
        populateLaporanHutangData();
    };

    $(".Hutang-search-filter").on("change",  function(){
        var formdata=  document.getElementById("Hutang-SearchForm");
        HutangSearchFromTable(
            formdata.elements['id'].value,
            formdata.elements['supplier'].value,
            formdata.elements['pembayaran'].value,
            ''
        );
    });
}
