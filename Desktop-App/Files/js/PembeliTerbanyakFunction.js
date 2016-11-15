/**
 * Created by user on 15/11/2016.
 */

var currentToken;

function PembeliTerbanyakPopulateData()
{
    var tglawaltemp2 = new Date($("#Pembeliterbanyak-TglawalDate").datepicker().val());
    var tglakhirtemp2 = new Date($("#Pembeliterbanyak-TglakhirDate").datepicker().val());
    var tglawal = tglawaltemp2.getFullYear()+"-"+(tglawaltemp2.getMonth()+1)+"-"+tglawaltemp2.getDate();
    var tglakhir = tglakhirtemp2.getFullYear()+"-"+(tglakhirtemp2.getMonth()+1)+"-"+tglakhirtemp2.getDate();

    GetPembeliTerbanyakData(currentToken,tglawal, tglakhir, function(result){
        var PembeliTerbanyakTable;// = $('#PelangganTable').DataTable();
        if(result.token_status=="success")
        {
            var i;
            if (!$.fn.DataTable.isDataTable("#PembeliTerbanyakTable"))
            {
                PembeliTerbanyakTable = $('#PembeliTerbanyakTable').DataTable({
                    "paging": false,
                    "lengthChange": false,
                    "searching": false,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "dom": '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"t>><"row"<"col-sm-6"i><"col-sm-6"p>>'
                });
            }
            else
            {
                PembeliTerbanyakTable = $('#PembeliTerbanyakTable').DataTable();
                PelangganTable.clear().draw();
            }
            for (i = 0; i < result.data.length; i++) {
                var pad ="00000";
                var id = "" + result.data[i].pelangganID;
                var StrId  = "P"+ pad.substring(0, pad.length - id.length)+id;


                PembeliTerbanyakTable.row.add([
                    StrId,
                    result.data[i].nama,
                    result.data[i].telp,
                    result.data[i].alamat,
                    result.data[i].total
                ]);
            }
            PembeliTerbanyakTable.draw();
        }
        else
        {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}

function PembeliTerbanyakInitDate()
{
    var datebulanlalu = new Date();
    datebulanlalu.setMonth(datebulanlalu.getMonth()-1);
    var tglawalDatepicker = $("#Pembeliterbanyak-TglawalDate");
    var tglakhirDatepicker = $("#Pembeliterbanyak-TglakhirDate");
    tglawalDatepicker.datepicker({
        autoclose: true
    });
    tglakhirDatepicker.datepicker({
        autoclose: true
    });
    tglawalDatepicker.datepicker("setDate", datebulanlalu);
    tglakhirDatepicker.datepicker("setDate", new Date());
}
function InitDaftarPembeliTerbanyakPage()
{
    currentToken = localStorage.getItem("token");
    setPage("DaftarPembeliTerbanyak");
    PembeliTerbanyakInitDate();
    PembeliTerbanyakPopulateData();
}