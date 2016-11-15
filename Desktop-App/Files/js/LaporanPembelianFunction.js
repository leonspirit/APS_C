/**
 * Created by Billy on 01-Nov-16.
 */


var currentToken = localStorage.getItem("token");


function populateLaporanPembelianData()
{

    var tglawaltemp2 = new Date($("#Laporanpembelian-TglawalDate").datepicker().val());
    var tglakhirtemp2 = new Date($("#Laporanpembelian-TglakhirDate").datepicker().val());
    var tglawal = tglawaltemp2.getFullYear()+"-"+(tglawaltemp2.getMonth()+1)+"-"+tglawaltemp2.getDate();
    var tglakhir = tglakhirtemp2.getFullYear()+"-"+(tglakhirtemp2.getMonth()+1)+"-"+tglakhirtemp2.getDate();

    var NamaBulan = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var PembelianTable;
    getLunasPembelianData(currentToken, tglawal, tglakhir, function(result){
        console.log("babi"+tglawal+" "+tglakhir);
        var i;
        if (!$.fn.DataTable.isDataTable( '#PembelianTable'))
        {
            PembelianTable = $('#PembelianTable').DataTable({
                "paging": false,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "dom":'<"row"<"col-sm-12"t>><"row"<"col-sm-12"i>>'
            });
        }
        else {
            PembelianTable =$('#PembelianTable').DataTable();
            PembelianTable.clear().draw();
        }
        if (result.token_status=="success")
        {
            for (i = 0; i < result.data.length; i++) {

                console.log(result.data[i]);
                var pad = "0000";
                var id = "" + result.data[i].pembelianID;
                var StrId = "TB" + pad.substring(0, pad.length - id.length) + id;

                var subtotal = "<span class='pull-right'>Rp. "+numberWithCommas(result.data[i].subtotal)+"</span>";

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

                PembelianTable.row.add([
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
            PembelianTable.draw();
        }
        else
        {
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}

function LaporanPembelianInitDate()
{
    var datebulanlalu = new Date();
    datebulanlalu.setMonth(datebulanlalu.getMonth()-1);
    var tglawalDatepicker = $("#Laporanpembelian-TglawalDate");
    var tglakhirDatepicker = $("#Laporanpembelian-TglakhirDate");
    tglawalDatepicker.datepicker({
        autoclose: true
    });
    tglakhirDatepicker.datepicker({
        autoclose: true
    });
    tglawalDatepicker.datepicker("setDate", datebulanlalu);
    tglakhirDatepicker.datepicker("setDate", new Date());
}

function LaporanPembelianSearchFromTable(queryID,  querySupplier, queryPembayaran, queryPrinted)
{
    var PembelianTable = $('#PembelianTable').DataTable();
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
    PembelianTable.
    columns("#PembelianTable-kode").search(StrId).
    columns("#PembelianTable-supplier").search(querySupplier).
    columns("#PembelianTable-pembayaran").search(queryPembayaran).
    columns("#PembelianTable-print").search(qPrinted).
    draw();
}
function InitLaporanPembelianPage()
{
    currentToken = localStorage.getItem("token");
    setPage("LaporanPembelian");
    LaporanPembelianInitDate();
    populateLaporanPembelianData();

    document.getElementById("Laporanpembelian-TglawalDate").onchange=function()
    {
        populateLaporanPembelianData();
    };
    document.getElementById("Laporanpembelian-TglakhirDate").onchange=function()
    {
        populateLaporanPembelianData();
    };

    $(".Laporanpembelian-search-filter").on("change",  function(){
        var formdata=  document.getElementById("Laporanpembelian-SearchForm");
        LaporanPembelianSearchFromTable(
            formdata.elements['id'].value,
            formdata.elements['supplier'].value,
            formdata.elements['pembayaran'].value,
            formdata.elements['print'].value
        );
    });

}