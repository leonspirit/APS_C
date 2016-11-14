/**
 * Created by Billy on 01-Nov-16.
 */


var currentToken = localStorage.getItem("token");


function populateLaporanPembelianData()
{

    var NamaBulan = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var PembelianTable;
    getLunasPembelianData(currentToken, "2000-01-01", "2020-01-01", function(result){
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

                var returButton = "<a onclick='InitReturPembelianPage("+id+");'><i class='glyphicon glyphicon-new-window'></i></a>";

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
                    result.data[i].nama,
                    tglTransaksi,
                    pembayaran,
                    tglJatuhTempo,

                    subtotal,
                    isPrinted,
                    detailButton,
                    returButton
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


function InitLaporanPembelianPage()
{
    setPage("LaporanPembelian");
    populateLaporanPembelianData();
}