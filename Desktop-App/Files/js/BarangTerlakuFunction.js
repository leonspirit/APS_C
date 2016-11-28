/**
 * Created by Billy on 01-Oct-16.
 */

var currentHakAkses = localStorage.getItem("hak_akses");
var currentToken;
/*
function BarangTerlakuPopulateEntry(BarangTerlakuTable, barangEntry)
{
    GetAllSatuanData(currentToken, barangEntry.barangID, function (result2) {
        var i2;
        for (i2 = 0; i2 < result2.data.length; i2++) {
            if (result2.data[i2].satuan == "box") {
                var pad = "00000";
                var id = "" + barangEntry.barangID;
                var StrId = "C" + pad.substring(0, pad.length - id.length) + id;

                var IsiCarton = "@ "+result2.data[i2].konversi.toString()+" "+result2.data[i2].satuan_acuan;

                var HargaJual =
                    '<span class="pull-right">' +
                    'Rp. ' + numberWithCommas(result2.data[i2].harga_jual) +
                    '</span>';

                var curBoxStok = parseInt(barangEntry.stok/(result2.data[i2].konversi * result2.data[i2].konversi_acuan));
                var StokReady = '<span class="pull-right">' +
                    numberWithCommas(curBoxStok) + ' box';
                if ((barangEntry.stok%(result2.data[i2].konversi * result2.data[i2].konversi_acuan))!=0)
                {
                    var curSisaStok = (barangEntry.stok%(result2.data[i2].konversi * result2.data[i2].konversi_acuan))/result2.data[i2].konversi_acuan;
                    StokReady +=" "+numberWithCommas(curSisaStok)+" "+result2.data[i2].satuan_acuan;
                }
                StokReady+='</span>';
                var editButton = "<a class='edit-modal-toggle' data-toggle='modal' href='#editModal' data-id='" +
                    id +
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a class='delete-modal-toggle' href='#deleteModal' data-toggle='modal'  style='color:red;' data-id='" +
                    id +
                    "'><i class='glyphicon glyphicon-trash'></i></a>";

                if (hasHakAkses("HargaPokokLaba"))
                {
                    var HargaPokok =
                        '<span class="pull-right">' +
                        'Rp. ' + numberWithCommas(barangEntry.harga_pokok * result2.data[i2].konversi * result2.data[i2].konversi_acuan) +
                        '</span>';
                    BarangTerlakuTable.row.add([
                        StrId,
                        barangEntry.nama,
                        IsiCarton,
                        StokReady,
                        HargaJual,
                        HargaPokok,
                        editButton + " " + delButton
                    ]).draw();
                }
                else {
                    BarangTerlakuTable.row.add([
                        StrId,
                        barangEntry.nama,
                        IsiCarton,
                        StokReady,
                        HargaJual,
                        editButton + " " + delButton
                    ]).draw();
                }
                break;
            }
        }
    });
}
*/
function BarangTerlakuPopulateData() {

    var tglawaltemp2 = new Date($("#Barangterlaku-TglawalDate").datepicker().val());
    var tglakhirtemp2 = new Date($("#Barangterlaku-TglakhirDate").datepicker().val());
    var tglawal = tglawaltemp2.getFullYear()+"-"+(tglawaltemp2.getMonth()+1)+"-"+tglawaltemp2.getDate();
    var tglakhir = tglakhirtemp2.getFullYear()+"-"+(tglakhirtemp2.getMonth()+1)+"-"+tglakhirtemp2.getDate();


    var BarangTerlakuTable;//=$("#BarangTable").DataTable();
    if(!$.fn.DataTable.isDataTable("#BarangTerlakuTable")){
        BarangTerlakuTable = $('#BarangTerlakuTable').DataTable({
            "paging": false,
            "lengthChange": false,
            "searching": false,
            "ordering": true,
            "info": true,
            "autoWidth": false
         });
    }
    else {
        BarangTerlakuTable = $('#BarangTerlakuTable').DataTable();
        BarangTerlakuTable.clear().draw();
    }
    GetBarangTerlaku(currentToken, tglawal, tglakhir, function (result) {
        if (result.token_status == "success") {
            console.log(result);
            var i;
            for (i = 0; i < result.data.length; i++) {
                console.log(result.data[i]);
                var pad = "00000";
                var id = "" + result.data[i].barangID;
                var StrId = "C" + pad.substring(0, pad.length - id.length) + id;

                var barangterjual ="<span class='pull-right'>"+ result.data[i].terjual + " box</span>";
                var detailButton = "<a onclick = 'InitPenjualanBarangPage("+ id+")'><i class='glyphicon glyphicon-new-window'></i></a>";
                BarangTerlakuTable.row.add([
                    StrId,
                    result.data[i].nama,
                    barangterjual,
                    detailButton
                ]);
            }
            BarangTerlakuTable.draw();
        }
        else {
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}

function BarangTerlakuInitDate()
{
    var datebulanlalu = new Date();
    datebulanlalu.setMonth(datebulanlalu.getMonth()-1);
    var tglawalDatepicker = $("#Barangterlaku-TglawalDate");
    var tglakhirDatepicker = $("#Barangterlaku-TglakhirDate");
    tglawalDatepicker.datepicker({
        autoclose: true
    });
    tglakhirDatepicker.datepicker({
        autoclose: true
    });
    tglawalDatepicker.datepicker("setDate", datebulanlalu);
    tglakhirDatepicker.datepicker("setDate", new Date());
}

//INITIALIZATION FUNCTIONS
function InitBarangTerjualTerbanyakPage() {
    currentToken = localStorage.getItem("token");
    setPage("BarangTerjualTerbanyak");
    BarangTerlakuInitDate();
    BarangTerlakuPopulateData();
}

