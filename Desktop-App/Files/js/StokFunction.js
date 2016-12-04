/**
 * Created by Billy on 01-Oct-16.
 */

var currentToken;
var totalBoxBarang = 0;
var totalUangBarang = 0;
//var satuanIDlist;
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
        var hargaPokok =  document.getElementById("Stokbarang-KoreksiModal-TambahHargaInput").value;
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
    //$("#Stokbarang-EditModal-harga-jual-"+satuan[i]+"-check").iCheck("check");
    $("#Stokbarang-EditModal-harga-jual-box-check").iCheck("check").iCheck("disable");

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
        var curprop = $("#Stokbarang-EditModal-harga-jual-"+satuan[i]+"-check");
        curprop.iCheck('check');
        curprop.iCheck('uncheck').iCheck("disable");
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
            console.log(result.data[i].satuan);
            $("#Stokbarang-EditModal-harga-jual-"+result.data[i].satuan+"-check").iCheck('check').iCheck('disable');
            document.getElementById("Stokbarang-EditModal-harga-jual-"+result.data[i].satuan+"-check").setAttribute("data-id", result.data[i].satuanID);
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
function StokBarangPopulateDeleteModal(Button)
{
   //

    var BarangTable = $('#BarangTable').DataTable();
    var rowNumber = BarangTable.row($(Button).closest('tr')).index();
    document.getElementById("Stokbarang-DeleteModal-ConfirmButton").setAttribute("data-row-num", rowNumber);

    var kode =  $(Button).closest('tr').find('td:eq(0)').html();
    var nama = $(Button).closest('tr').find('td:eq(1)').html();
    document.getElementById("Stokbarang-DeleteModal-kodeText").innerHTML = kode;
    document.getElementById("Stokbarang-DeleteModal-namaText").innerHTML = nama;
    var barangID = $(Button).attr('data-id');
    document.getElementById("Stokbarang-DeleteModal-ConfirmButton").onclick = function()
    {
        DeleteBarang(currentToken, barangID, function(result){
            if (result.token_status=="success")
            {
                console.log(result);
                if (result.affectedRows==1)
                {
                    createAlert("success", "Barang berhasil dihapus");
                    $("#Stokbarang-DeleteModal").modal('toggle');
                    var rowNum = $(Button).attr('data-row-num');
                    BarangTable.row(rowNum).remove().draw();
                }
                else {
                    createAlert("danger", "Terdapat kesalahan dalam penghapusan barang, mohon coba kembali");
                }
            }
        });
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
    for (i = 0; i < satuan.length; i++) {
        if ($("#Stokbarang-EditModal-harga-jual-" + satuan[i] + "-check").prop("checked")) {
            if (form.elements["harga-jual-" + satuan[i] + "-input"].value=='' || form.elements["harga-jual-" + satuan[i] + "-input"].value==0)
            {
                valid =false;
                setWarning(form.elements["harga-jual-" + satuan[i] + "-input"], "Harga Tidak Boleh Kosong");
            }
        }
    }
    console.log("lala"+barangID);
    console.log(valid);
    if (valid)
    {
        UpdateBarang(currentToken, barangID, namaBarang.value, function(result) {
          //  console.log(currentToken, barangID, namaBarang.value);
            if (result.token_status == "success") {
                //console.log(result.barangID);
                var konversiAcuanBox;
                var acuanBox = form.elements["acuan-box-select"].value;
                console.log(acuanBox);
                for (i = 0; i < satuan.length; i++) {
                    if (acuanBox == satuan[i]) {
                        konversiAcuanBox = konversiSatuan[i];
                        break;
                    }
                }
               var UpdateSatuanSuccess = true;

                    UpdateDataSatuan(currentToken, document.getElementById("Stokbarang-EditModal-harga-jual-box-check").getAttribute("data-id"), hargajualbox.value, "box", isibox.value, acuanBox, konversiAcuanBox,
                    function (result3) {
                        if (result3.token_status == "success")
                        {
                            console.log(result3);
                        }
                    }
                );
                for (i = 0; i < satuan.length; i++) {
                    if ($("#Stokbarang-EditModal-harga-jual-" + satuan[i] + "-check").prop("checked")) {
                        UpdateDataSatuan(currentToken, document.getElementById("Stokbarang-EditModal-harga-jual-" + satuan[i] + "-check").getAttribute("data-id"), $(form.elements["harga-jual-" + satuan[i] + "-input"]).val(), satuan[i], konversiSatuan[i], "pcs", 1,
                            function (result2) {
                                if (result2.token_status = "success")
                                {
                                    console.log(result2);
                                }
                            }
                        );
                    }
                }
                if (UpdateSatuanSuccess) {
                    console.log("ddd");
                    var pad = "00000";
                    var id = "" + barangID;
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
function StokBarangAddSatuanDanStok( barangID, hargajual, namasatuan, konversi, namasatuanacuan, konversiacuan, stoktambahan, hargapokok, satuanstoktambahan)
{
    AddSatuan(currentToken, barangID, hargajual, namasatuan, konversi, namasatuanacuan, konversiacuan,
        function(result2){
            if(result2.token_status="success")
            {
                console.log(result2.satuanID);
                if (stoktambahan>0 && (satuanstoktambahan == namasatuan))
                {
                    console.log("addinsstok"+namasatuan);
                    console.log(currentToken, barangID, stoktambahan, hargapokok, result2.satuanID);
                    AddStok(currentToken, barangID, stoktambahan, hargapokok, result2.satuanID, function(result5){
                        if (result5.token_status=="success")
                        {
                            console.log(result5);
                            console.log("stok nambah");
                        }
                    });
                }
            }
            else
                AddSatuanSuccess  =false;
        }
    );
}
function StokBarangCreateModalSatuanIsiListener()
{
    var form = document.getElementById("Stokbarang-CreateModal-CreateForm");
    var satuan   =form.elements['satuan-stok-select'].value;
    document.getElementById("Stokbarang-CreateModal-SatuanHargaBeliText").innerHTML = "/ "+capitalizeFirstLetter(satuan);
}
function StokBarangCreateBarangConfirm()
{
    var satuan =[ "grs", "kod", "lsn", "pcs"];
    var konversiSatuan = [144, 20, 12, 1];
    var BarangTable = $('#BarangTable').DataTable();
    var valid = true;
    var form = document.getElementById("Stokbarang-CreateModal-CreateForm");
    removeWarning();

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
        setWarning(hargajualbox, "Harga Tidak Boleh Kosong");
    }
    if (isibox.value==''|| isibox.value==0 )
    {
        valid = false;
        setWarning(isibox, "Isi per Box harus diisi");
    }
    for (i = 0; i < satuan.length; i++) {
        if ($("#Stokbarang-CreateModal-harga-jual-" + satuan[i] + "-check").prop("checked")) {
            if (form.elements["harga-jual-" + satuan[i] + "-input"].value=='' || form.elements["harga-jual-" + satuan[i] + "-input"].value==0)
            {
                valid =false;
                setWarning(form.elements["harga-jual-" + satuan[i] + "-input"], "Harga Tidak Boleh Kosong");
            }
        }
    }
    if (valid)
    {
        AddBarang(currentToken, namaBarang.value, function(result)
        {
            if (result.token_status=="success")
            {
                var konversiAcuanBox;
                var acuanBox = form.elements["acuan-box-select"].value;
                for (i=0;i<satuan.length;i++)
                {
                    if (acuanBox==satuan[i])
                    {
                        konversiAcuanBox = konversiSatuan[i];
                        break;
                    }
                }
                var stokmasuk  = form.elements['stok'].value;
                var satuanstok = form.elements['satuan-stok-select'].value;
                var hargapokok = form.elements['harga-pokok-input'].value;
                StokBarangAddSatuanDanStok( result.barangID, hargajualbox.value, "box", isibox.value, acuanBox, konversiAcuanBox, stokmasuk, hargapokok, satuanstok);
                for (i=0;i<satuan.length;i++)
                {
                    if ($(form.elements["harga-jual-"+satuan[i]+"-check"]).prop("checked"))
                    {
                        console.log("adding satuan"+satuan[i]);
                        var hargajual = $(form.elements["harga-jual-"+satuan[i]+"-input"]).val();
                        StokBarangAddSatuanDanStok( result.barangID, hargajual, satuan[i], konversiSatuan[i], "pcs", 1, stokmasuk, hargapokok, satuanstok);

                    }
                }
                 var pad ="00000";
                 var id = "" + result.barangID;
                 var StrId  = "C"+ pad.substring(0, pad.length - id.length)+id;
                // var stokReady = "<span class='pull-right'>"+numberWithCommas(0)+" box"+"</span>";
                // var hargaJual  ="<span class='pull-right'>Rp. "+numberWithCommas(form.elements["harga-jual-box-input"].value)+"</span>";
                // var editButton = "<a onclick='StokBarangPopulateEditModal(this);' class='edit-modal-toggle' data-toggle='modal' href='#Stokbarang-EditModal' data-id='" +
                //     id +
                //     "'><i class='glyphicon glyphicon-pencil'></i></a>";
                // var delButton = "<a class='delete-modal-toggle' href='#Stokbarang-DeleteModal' data-toggle='modal'  style='color:red;' data-id='" +
                //     id +
                //     "'><i class='glyphicon glyphicon-trash'></i></a>";
                // var hargaPokok;
                // if (stokmasuk==0)
                // {
                //     hargaPokok = "<span class='pull-right'>Rp. 0</span>";
                // }
                // else
                //     hargaPokok = "<span class='pull-right'>Rp. "+numberWithCommas(/*form.elements['harga-pokok-input'].value*/0)+"</span>";
                // BarangTable.row.add([
                //     StrId,
                //     form.elements["nama"].value.toString(),
                //     "@ "+form.elements["isi-box-input"].value+" "+acuanBox,
                //     stokReady,
                //     hargaJual,
                //     hargaPokok,
                //     editButton+" "+delButton
                // ]).draw();
                InitStokBarangPage();
                createAlert("success", "Barang baru "+StrId+" - "+form.elements["nama"].value.toString() +" berhasil ditambahkan");
                form.reset();
                $("#Stokbarang-CreateModal").modal("toggle");
                $("#Stokbarang-CreateModal-harga-jual-box-check").iCheck("check").iCheck("disable");
                for(i=0;i<satuan.length;i++)
                    $("#Stokbarang-CreateModal-harga-jual-"+satuan[i]+"-check").iCheck("uncheck");
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
    $(document).off("click", ".Stokbarang-edit-modal-toggle");
    $(document).on("click", ".Stokbarang-edit-modal-toggle", function () {
        StokBarangPopulateEditModal(this);
    });
    $(document).off("click", ".Stokbarang-delete-modal-toggle");
    $(document).on("click", ".Stokbarang-delete-modal-toggle", function () {
        StokBarangPopulateDeleteModal(this);
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
    $(".check-satuan-createModal").off("ifChanged");
    $(".check-satuan-createModal").on("ifChanged", function () {
        StokBarangCreateModalDisableHargaJualInput();
    });
    document.getElementById("Stokbarang-CreateModal-ConfirmButton").onclick= function () {
        StokBarangCreateBarangConfirm();
    };

    StokBarangDisableHargaPokokField();
}
