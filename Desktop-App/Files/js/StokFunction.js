/**
 * Created by Billy on 01-Oct-16.
 */

var currentHakAkses = localStorage.getItem("hak_akses");
var currentToken;
var totalBoxBarang = 0;
var totalUangBarang = 0;
var satuanIDlist;
var finished, AddSatuanSuccess;

function StokBarangPopulateEntry(BarangTable, barangEntry)
{
    if (hasHakAkses("HargaPokokLaba"))
    {
        $("#Stokbarang-TotalUangLabel").show();
    }
    else {
        $("#Stokbarang-TotalUangLabel").hide();
    }
    GetAllSatuanData(currentToken, barangEntry.barangID, function (result2) {
        var i2;
        for (i2 = 0; i2 < result2.data.length; i2++) {
            if (result2.data[i2].satuan == "box") {
                var pad = "00000";
                var id = "" + barangEntry.barangID;
                var StrId = "C" + pad.substring(0, pad.length - id.length) + id;

                var IsiCarton = "@ " + result2.data[i2].konversi.toString() + " " + capitalizeFirstLetter(result2.data[i2].satuan_acuan);

                var HargaJual =
                    '<span class="pull-right">' +
                    'Rp. ' + numberWithCommas(result2.data[i2].harga_jual) +
                    '</span>';

                var curBoxStok = parseInt(barangEntry.stok / (result2.data[i2].konversi * result2.data[i2].konversi_acuan));
                totalBoxBarang += curBoxStok;
                console.log(totalBoxBarang);
                document.getElementById("Stokbarang-TotalStokText").innerHTML = " "+numberWithCommas(totalBoxBarang) + " Box";
                var StokReady = '<span class="pull-right">' +
                    numberWithCommas(curBoxStok) + ' Box';
                if ((barangEntry.stok % (result2.data[i2].konversi * result2.data[i2].konversi_acuan)) != 0) {
                    var curSisaStok = (barangEntry.stok % (result2.data[i2].konversi *  result2.data[i2].konversi_acuan)) / result2.data[i2].konversi_acuan;
                    StokReady += " " + numberWithCommas(curSisaStok) + " " + capitalizeFirstLetter(result2.data[i2].satuan_acuan);
                }
                StokReady += '</span>';
             //      var koreksiminButton = "<a href='#Stokbarang-KoreksiTambahModal' data-toggle='modal'><i class='glyphicon glyphicon-minus'></i></a>";
              //     var koreksiplusButton =" <a href='#Stokbarang-KoreksiKurangModal' data-toggle='modal'> <i class='glyphicon glyphicon-plus'></i></a>";

                var editButton = "<a class='Stokbarang-edit-modal-toggle' data-toggle='modal' href='#Stokbarang-EditModal' data-id='" +
                    id +
                    "'><i class='glyphicon glyphicon-pencil'></i></a>";
                var delButton = "<a class='Stokbarang-delete-modal-toggle' href='#Stokbarang-DeleteModal' data-toggle='modal'  style='color:red;' data-id='" +
                    id +
                    "'><i class='glyphicon glyphicon-trash'></i></a>";


                if (hasHakAkses("HargaPokokLaba"))
                {
                    totalUangBarang += barangEntry.harga_pokok * barangEntry.stok;
                    document.getElementById("Stokbarang-TotalUangText").innerHTML = "Rp. " + numberWithCommas(totalUangBarang);
                }
                    var HargaPokok =
                        '<span class="pull-right">' +
                        'Rp. ' + numberWithCommas(Math.round(barangEntry.harga_pokok * result2.data[i2].konversi * result2.data[i2].konversi_acuan)) +
                        '</span>';
                    BarangTable.row.add([
                        StrId,
                        barangEntry.nama,
                        IsiCarton,
                        StokReady,
                        HargaJual,
                        HargaPokok,
                        editButton + " " + delButton
                    ]).draw();

                break;
            }
        }
    });
}
function StokBarangPopulateKoreksiKurangModal(barangID)
{
   // var i;
    GetAllSatuanData(currentToken, barangID, function(result){
            var i;
            var data =[];
        console.log(barangID);
            for (i=0;i<result.data.length;i++)
            {
                data.push({
                    "id":result.data[i].satuanID,
                    "text":capitalizeFirstLetter(result.data[i].satuan),
                    "harga_jual":result.data[i].harga_jual,
                    "harga_pokok":result.data[i].konversi * result.data[i].konversi_acuan *result.data[i].harga_pokok,
                    "konversi_final":result.data[i].konversi * result.data[i].konversi_acuan
                });
            }
            $("#Stokbarang-KoreksiModal-KurangSatuanInput").select2({
                data:data,
                placeholder:"-- Pilih Unit --",
                allowClear:true
            });
    });
    document.getElementById("Stokbarang-KoreksiModal-KurangConfirmButton").onclick = function ()
    {
        var stokpengurangan = document.getElementById("Stokbarang-KoreksiModal-KurangJumlahInput").value;
        var satuanID = $("#Stokbarang-KoreksiModal-KurangSatuanInput").val();
        RemoveStok(currentToken, barangID, stokpengurangan, satuanID,function(result)
        {
            console.log(result);
            if (result.token_status=="success")
            {
                console.log("kurang stok sukses");
                createAlert("success", "Stok barang berhasil dikurangi");
                $("#Stokbarang-KoreksiKurangModal").modal('toggle');
            }
        });
    }
}
function StokBarangPopulateKoreksiTambahModal(barangID)
{
  //  var i;
    GetAllSatuanData(currentToken, barangID, function(result){
        var i;
        var data =[];
        console.log(barangID);
        for (i=0;i<result.data.length;i++)
        {
            data.push({
                "id":result.data[i].satuanID,
                "text":capitalizeFirstLetter(result.data[i].satuan)
            });
        }
        $("#Stokbarang-KoreksiModal-TambahSatuanInput").select2({
            data:data,
            placeholder:"-- Pilih Unit --",
            allowClear:true
        });
    });
    document.getElementById("Stokbarang-KoreksiModal-TambahConfirmButton").onclick = function ()
    {
        var stoktambahan = document.getElementById("Stokbarang-KoreksiModal-TambahJumlahInput").value;
        var hargaPokok =  document.getElementById("#Stokbarang-KoreksiModal-TambahHargaInput").value;
        var satuanID = $("#Stokbarang-KoreksiModal-TambahSatuanInput").val();
        AddStok(currentToken, barangID, stoktambahan, hargaPokok, satuanID, function(result)
        {
            console.log(result);
            if (result.token_status=="success")
            {
                console.log("add stok sukses");
                createAlert("success", "Stok barang berhasil ditambahkan");
                $("#Stokbarang-KoreksiTambahModal").modal('toggle');
            }
        });
    }
}

function StokBarangPopulateData() {

    totalBoxBarang = 0;
    var BarangTable;//=$("#BarangTable").DataTable();
    if(!$.fn.DataTable.isDataTable("#BarangTable")){
        BarangTable = $('#BarangTable').DataTable({
            "paging": true,
            "lengthChange": true,
            "searching": true,
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "dom": '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"t>><"row"<"col-sm-6"i><"col-sm-6"p>>',
            'columnDefs': [
                { orderable: false, targets: [0, 2, 3, 6] }
            ],
            "order": [[ 1, "asc" ]]
        });
    }
    else {
        BarangTable = $('#BarangTable').DataTable();
        BarangTable.clear().draw();
    }
    if (!hasHakAkses("HargaPokokLaba"))
    {
        BarangTable.column("#StokTable-harga-pokok").visible(false);
    }
    else {
        BarangTable.column("#StokTable-harga-pokok").visible(true);
    }
    GetAllStokData(currentToken, function (result) {
        if (result.token_status == "success") {
            var i;
            totalUangBarang = 0;
            for (i = 0; i < result.data.length; i++) {
                StokBarangPopulateEntry(BarangTable, result.data[i]);
            }
        }
        else {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}
function StokBarangSearch(queryID,  queryNama)
{
    var BarangTable = $('#BarangTable').DataTable();
    var StrId;
    var queryID2 = parseInt(queryID);
    if (!isNaN(queryID2))
    {
        var pad ="00000";
        var id = "" + queryID2;
        StrId  = "C"+ pad.substring(0, pad.length - id.length)+id;
    }
    else
        StrId = "";
    BarangTable.
    columns("#StokTable-kode").search(StrId).
    columns("#StokTable-nama").search(queryNama).
    draw();
}

function StokBarangPopulateEditModal(Button)
{
    var formdata = document.getElementById("Stokbarang-EditModal-EditForm");
    formdata.reset();
    formdata.elements['nama'].value= $(Button).closest('tr').find('td:eq(1)').html();
    var i;
    var barangID = $(Button).attr('data-id');
    var pad ="00000";
    var id = "" + barangID;
    var StrId  = "C"+ pad.substring(0, pad.length - id.length)+id;
    var satuan =["grs", "kod", "lsn", "pcs"];
    document.getElementById("Stokbarang-EditModal-kode").innerHTML = StrId;
    document.getElementById("Stokbarang-EditModal-stok").innerHTML = $(Button).closest('tr').find('td:eq(3)').children("span")[0].innerHTML;
    //document.getElementById("Stokbarang-EditModal-IsiBoxText").innerHTML = $(Button).closest('tr').find('td:eq(2)').html();

    if (hasHakAkses("HargaPokokLaba"))
    {
        $("#Stokbarang-EditModal-HargaPokokRow").show();
        document.getElementById("Stokbarang-EditModal-HargaPokokText").innerHTML = $(Button).closest('tr').find('td:eq(5)').children("span")[0].innerHTML;
    }
    else {
        $("#Stokbarang-EditModal-HargaPokokRow").hide();
    }
    for (i=0;i<satuan.length;i++)
    {
        $("#Stokbarang-EditModal-harga-jual-"+satuan[i]+"-check").iCheck('uncheck');
        $("#Stokbarang-EditModal-harga-jual-"+satuan[i]+"-check").iCheck('disable');
        formdata.elements['harga-jual-'+satuan[i]+'-input'].disabled=true;
        formdata.elements['harga-jual-'+satuan[i]+'-input'].value="";
    }

    GetAllSatuanData(currentToken, barangID, function(result){
        for (i=0;i<result.data.length;i++)
        {
            console.log(result.data[i].satuan);
            if (result.data[i].satuan=='box')
            {
                formdata.elements['isi-box-input'].value = result.data[i].konversi;
                formdata.elements['acuan-box-select'].value = result.data[i].satuan_acuan;
            }
            console.log(result.data[i].konversi);
            $("#Stokbarang-EditModal-harga-jual-"+result.data[i].satuan+"-check").iCheck('check');
            document.getElementById("Stokbarang-EditModal-harga-jual-"+result.data[i].satuan+"-check").setAttribute("data-id", result.satuanID);
            formdata.elements['harga-jual-'+result.data[i].satuan+'-input'].value = result.data[i].harga_jual;
            formdata.elements['harga-jual-'+result.data[i].satuan+'-input'].disabled = false;
        }
    });

    document.getElementById("Stokbarang-KoreksiTambahButton").onclick = function(){
        StokBarangPopulateKoreksiTambahModal(id);
    };
    document.getElementById("Stokbarang-KoreksiKurangButton").onclick = function(){
        StokBarangPopulateKoreksiKurangModal(id);
    };
    document.getElementById("Stokbarang-EditModal-ConfirmButton").onclick = function()
    {
        StokBarangEditBarangConfirm(id);
    }

}
function StokBarangDisableHargaPokokField()
{
    var form = document.getElementById("Stokbarang-CreateModal-CreateForm");
    var stok = form.elements['stok'].value;
    if (stok==0 || stok=='' || stok==null)
    {
        form.elements['harga-pokok-input'].disabled= true;
        form.elements['harga-pokok-input'].value= '';

    }else {
        form.elements['harga-pokok-input'].disabled= false;
    }
}
function StokBarangCreateModalDisableHargaJualInput()
{
    var form = document.getElementById("Stokbarang-CreateModal-CreateForm");

    var satuanlokal =["grs", "kod", "lsn", "pcs"];
    var i;
    for (i=0;i<satuanlokal.length;i++)
    {
        if ($("#Stokbarang-CreateModal-harga-jual-"+satuanlokal[i]+"-check").prop("checked"))
        {
            form.elements["harga-jual-"+satuanlokal[i]+"-input"].disabled =false;
            $("#Stokbarang-CreateModal-SatuanStokSelect-"+satuanlokal[i]+"Option").show();
            $("#Stokbarang-CreateModal-SatuanHpokokSelect-"+satuanlokal[i]+"Option").show();
        }
        else
        {
            form.elements["harga-jual-"+satuanlokal[i]+"-input"].disabled= true;
            $("#Stokbarang-CreateModal-SatuanStokSelect-"+satuanlokal[i]+"Option").hide();
            $("#Stokbarang-CreateModal-SatuanHpokokSelect-"+satuanlokal[i]+"Option").hide();
        }
    }
}


function StokBarangEditBarangConfirm(barangID)
{
    var satuan =["grs", "kod", "lsn", "pcs"];
    var konversiSatuan = [144, 20, 12, 1];
    var BarangTable = $('#BarangTable').DataTable();
    var valid = true;
    var form = document.getElementById("Stokbarang-EditModal-EditForm");
    console.log(form);
    var i;
    var namaBarang = form.elements["nama"];
    var hargajualbox= form.elements["harga-jual-box-input"];
   // var isibox = form.elements["isi-box-input"];
    if (namaBarang.value==null || namaBarang.value=='')
    {
        valid = false;
        setWarning(namaBarang, "Nama Barang harus diisi");
    }
    if (hargajualbox.value==''|| hargajualbox==null)
    {
        valid = false;
        setWarning(hargajualbox, "Harga Jual Box harus diisi");
    }
    // if (isibox.value==''|| isibox==null)
    // {
    //     valid = false;
    //     setWarning(isibox, "Isi per Box harus diisi");
    // }
    for (i = 0; i < satuan.length; i++) {
        if ($(form.elements["harga-jual-" + satuan[i] + "check"]).prop("checked")) {
            if (form.elements["harga-jual-" + satuan[i] + "-input"].value=='' || form.elements["harga-jual-" + satuan[i] + "-input"].value==0)
            {
                setWarning(form.elements["harga-jual-" + satuan[i] + "-input"], "Harga Tidak Boleh Kosong");
            }
        }
    }
    console.log(valid);
    if (valid)
    {
        UpdateBarang(currentToken, barangID, namaBarang, function(result) {
            if (result.token_status == "success") {
                console.log(result.barangID);
                var konversiAcuanBox;
                var acuanBox = form.elements["acuan-box-select"].value;
                console.log(acuanBox);
                for (i = 0; i < satuan.length; i++) {
                    if (acuanBox == satuan[i]) {
                        konversiAcuanBox = konversiSatuan[i];
                        break;
                    }
                }
                console.log("aaa");
                var UpdateSatuanSuccess = true;
                UpdateDataSatuan(currentToken, document.getElementById("Stokbarang-EditModal-harga-jual-box-check").value, hargajualbox.value, "box", isibox.value, acuanBox, konversiAcuanBox,
                    function (result3) {
                        if (result3.token_status == "success")
                            console.log(result3.satuanID);
                        else
                            UpdateSatuanSuccess = false;
                    }
                );
                console.log("bbb");
                for (i = 0; i < satuan.length; i++) {
                    if ($(form.elements["harga-jual-" + satuan[i] + "check"]).prop("checked")) {
                        UpdateDataSatuan(currentToken, document.getElementById("Stokbarang-EditModal-harga-jual-" + satuan[i] + "-check").value, $(form.elements["harga-jual-" + satuan[i] + "-input"]).val(), satuan[i], konversiSatuan[i], "pcs", 1,
                            function (result2) {
                                if (result2.token_status = "success")
                                    console.log(result2.satuanID);
                                else
                                    UpdateSatuanSuccess = false;
                            }
                        );
                    }
                }
                console.log("ccc");
                if (UpdateSatuanSuccess) {
                    console.log("ddd");
                    var pad = "00000";
                    var id = "" + result.barangID;
                    var StrId = "C" + pad.substring(0, pad.length - id.length) + id;
                    InitStokBarangPage();
                    createAlert("success", "Data Barang " + StrId + " - " + form.elements["nama"].value.toString() + " berhasil dirubah");
                    $("#Stokbarang-EditModal").modal('toggle');
                    console.log("eee");

                }
                else {
                    createAlert("danger", "Data Barang gagal dirubah, mohon coba kembali");
                }
            }
            else {
                createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
            }
        });
    }
}
//
// function StokbarangRekursitambahSatuan(barangID, i , finished)
// {
//     if(finished)
//         return;
//     var form  = document.getElementById("Stokbarang-CreateModal-CreateForm");
//     var satuan = ["box", "grs", "kod", "lsn", "pcs"];
//     var konversiSatuan = [-1, 144, 20, 12, 1];
//     var satuan_acuan;
//     var konversi_acuan;
//     if (i!=0)
//     {
//         satuan_acuan = satuan[i];
//         konversi_acuan= 1;
//     }
//     else {
//         satuan_acuan = form.elements["acuan-box-select"].value;
//
//     }
//     if ($(form.elements["harga-jual-"+satuan[i]+"-check"]).prop("checked"))
//     {
//         AddSatuan(currentToken, barangID, $(form.elements["harga-jual-"+satuan[i]+"-input"]).val(), satuan[i], konversiSatuan[i], satuan_acuan, konversi_acuan,
//             function(result2){
//                 if(result2.token_status="success")
//                 {
//                     console.log(result2.satuanID);
//                     satuanIDlist[i+1] = result2.satuanID;
//                     if (i<4)
//                     {
//               //          StokbarangRekursitambahSatuan(barangID, i +1, finished);
//                     }
//                     else {
//                         finished = true;
//                     }
//                 }
//                 else
//                 {
//                     AddSatuanSuccess  =false;
//                 }
//             }
//         );
//     }
//     else {
//       //  StokbarangRekursitambahSatuan(barangID, i +1, finished);
//     }
//
// }

function StokBarangCreateBarangConfirm()
{
    var satuan =[ "grs", "kod", "lsn", "pcs"];
    var konversiSatuan = [144, 20, 12, 1];
    var BarangTable = $('#BarangTable').DataTable();
    var valid = true;
    var form = document.getElementById("Stokbarang-CreateModal-CreateForm");

    console.log(form);
    var i;
    $("#Stokbarang-CreateModal-harga-jual-box-check").iCheck("check");
    var namaBarang = form.elements["nama"];
    var hargajualbox= form.elements["harga-jual-box-input"];
    var isibox = form.elements["isi-box-input"];
    if (namaBarang.value==null || namaBarang.value=='')
    {
        valid = false;
        setWarning(namaBarang, "Nama Barang harus diisi");
    }
    if (hargajualbox.value==''|| hargajualbox==null)
    {
        valid = false;
        setWarning(hargajualbox, "Harga Jual Box harus diisi");
    }
    if (isibox.value==''|| isibox==null)
    {
        valid = false;
        setWarning(isibox, "Isi per Box harus diisi");
    }
    if (valid)
    {
        AddBarang(currentToken, namaBarang.value, function(result)
        {
            if (result.token_status=="success")
            {
                console.log(result.barangID);
                var konversiAcuanBox;
                var acuanBox = form.elements["acuan-box-select"].value;
                console.log(acuanBox);
                for (i=0;i<satuan.length;i++)
                {
                    if (acuanBox==satuan[i])
                    {
                        konversiAcuanBox = konversiSatuan[i];
                        break;
                    }
                }
                satuanIDlist =[-1, -1, -1, -1, -1];

                finished=false;
                AddSatuanSuccess = true;
              //  StokbarangRekursitambahSatuan(0, result.barangID);
               // console.log(AddSatuanSuccess);

                AddSatuan(currentToken, result.barangID, hargajualbox.value, "box", isibox.value, acuanBox, konversiAcuanBox,
                    function(result3) {
                        if (result3.token_status == "success")
                        {
                            console.log(result3.satuanID);
                            satuanIDlist[0] = result3.satuanID;
                        }
                        else
                            AddSatuanSuccess = false;
                    }
                );
                for (i=0;i<satuan.length;i++)
                {
                    if ($(form.elements["harga-jual-"+satuan[i]+"-check"]).prop("checked"))
                    {
                        console.log("adding satuan"+satuan[i]);
                        AddSatuan(currentToken, result.barangID, $(form.elements["harga-jual-"+satuan[i]+"-input"]).val(), satuan[i], konversiSatuan[i], "pcs", 1,
                            function(result2){
                                if(result2.token_status="success")
                                {
                                    console.log(result2.satuanID);
                                    satuanIDlist[i+1] = result2.satuanID;
                                    console.log(satuan[i]);
                                }
                                else
                                    AddSatuanSuccess  =false;
                            }
                        );
                    }
                }

                //
                var jumlahstokmasuk;
                var stokfield = form.elements['stok'];
                var satuanstokfield = form.elements['satuan-stok-select'];
                var satuanhargapokok = form.elements['harga-pokok-select'];
                if (stokfield.value!=0 && stokfield.value!=null)
                {
                    if(satuanstokfield.value!=-1)
                         jumlahstokmasuk = stokfield.value * satuanstokfield.value;
                    else
                         jumlahstokmasuk = stokfield.value * isibox.value* konversiAcuanBox;
                    var harga_pokok_biji;
                    console.log(satuanhargapokok.value);
                    if (satuanhargapokok.value!=-1)
                         harga_pokok_biji = parseInt((form.elements['harga-pokok-input'].value/ (satuanhargapokok.value)))+1;
                    else
                         harga_pokok_biji = parseInt((form.elements['harga-pokok-input'].value/ konversiAcuanBox))+1;
                        AddStok(currentToken, result.barangID, jumlahstokmasuk, harga_pokok_biji , function(result){
                        if (result.token_status=="success")
                        {
                            console.log(currentToken+" "+ jumlahstokmasuk+" "+harga_pokok_biji);
                        }
                    });
                }
                else
                {
                    jumlahstokmasuk=0;
                 }
                if (AddSatuanSuccess)
                {
                    var pad ="00000";
                    var id = "" + result.barangID;
                    var StrId  = "C"+ pad.substring(0, pad.length - id.length)+id;
                    var stokReady = "<span class='pull-right'>"+numberWithCommas(jumlahstokmasuk)+" box"+"</span>";
                    var hargaJual  ="<span class='pull-right'>Rp. "+numberWithCommas(form.elements["harga-jual-box-input"].value)+"</span>";
                    var editButton = "<a onclick='StokBarangPopulateEditModal(this);' class='edit-modal-toggle' data-toggle='modal' href='#Stokbarang-EditModal' data-id='" +
                        id +
                        "'><i class='glyphicon glyphicon-pencil'></i></a>";
                    var delButton = "<a class='delete-modal-toggle' href='#Stokbarang-DeleteModal' data-toggle='modal'  style='color:red;' data-id='" +
                        id +
                        "'><i class='glyphicon glyphicon-trash'></i></a>";
                    var hargaPokok;
                    if (jumlahstokmasuk==0)
                    {
                        hargaPokok = "<span class='pull-right'>Rp. 0</span>";
                    }
                    else
                        hargaPokok = "<span class='pull-right'>Rp. "+numberWithCommas(form.elements['harga-pokok-input'].value)+"</span>";
                    BarangTable.row.add([
                        StrId,
                        form.elements["nama"].value.toString(),
                        "@ "+form.elements["isi-box-input"].value+" "+acuanBox,
                        stokReady,
                        hargaJual,
                        hargaPokok,
                        editButton+" "+delButton
                    ]).draw();
                    createAlert("success", "Barang baru "+StrId+" - "+form.elements["nama"].value.toString() +" berhasil ditambahkan");
                    form.reset();
                    $(form.elements["harga-jual-box-check"]).iCheck("check");
                    $(form.elements["harga-jual-grs-check"]).iCheck("uncheck");
                    $(form.elements["harga-jual-kod-check"]).iCheck("uncheck");
                    $(form.elements["harga-jual-lsn-check"]).iCheck("uncheck");
                    $(form.elements["harga-jual-pcs-check"]).iCheck("uncheck");
                    $("#Stokbarang-CreateModal").modal('toggle');
                    console.log(satuanIDlist);
                }
                else
                {
                    createAlert("danger", "Data Barang gagal ditambahkan, mohon coba kembali");
                }
            }
            else {
                createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
            }
        });
    }
}

//INITIALIZATION FUNCTIONS
function InitStokBarangPage() {
    currentToken = localStorage.getItem("token");
    setPage("StokBarang");
    if (hasHakAkses("BarangTerjualTerbanyak"))
    {
        $("#Stokbarang-BarangterlakuButton").show();
        document.getElementById("Stokbarang-BarangterlakuButton").onclick=function()
        {
            InitBarangTerjualTerbanyakPage();
        };
    }
    else
        {
        $("#Stokbarang-BarangterlakuButton").hide();
    }
    StokBarangPopulateData();
    $(document).on("click", ".Stokbarang-edit-modal-toggle", function () {
        StokBarangPopulateEditModal(this);
    });
    var StokBarangSearchForm = document.getElementById("Stokbarang-SearchForm");
    $(".Stokbarang-search-filter").keyup(function () {
        StokBarangSearch(
            StokBarangSearchForm.elements['kode'].value,
            StokBarangSearchForm.elements['nama'].value
        );
    });
    var allcheckbox = $('input[type="checkbox"].minimal');
    allcheckbox.iCheck({
        checkboxClass: "icheckbox_minimal-green"
    });
    allcheckbox.iCheck('uncheck');
    StokBarangCreateModalDisableHargaJualInput();
    $(".check-satuan").off("ifChanged");
    $(".check-satuan").on("ifChanged", function () {
        StokBarangCreateModalDisableHargaJualInput();
    });
    document.getElementById("Stokbarang-CreateModal-ConfirmButton").onclick= function () {
        StokBarangCreateBarangConfirm();
    };

    StokBarangDisableHargaPokokField();
}
