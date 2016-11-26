/**
 * Created by Billy on 07-Oct-16.
 */

var currentToken = localStorage.getItem("token");

function SupplierMatcher (term, text) {
    if (text.toUpperCase().indexOf(term.toUpperCase()) != -1 || text==='+ Tambah Supplier Baru') {
        return true;
    }
    return false;
}

function BarangMatcher (term, text) {
    if (text.toUpperCase().indexOf(term.toUpperCase()) != -1 || text==='+ Tambah Barang Baru') {
        return true;
    }
    return false;
}

var DataBarang, DataSupplier;
function PembelianBaruGetSupplier()
{

    GetAllSupplierData(currentToken, function(result){
        if(result.token_status=="success")
        {
            DataSupplier = [];
            var i;
            var pad ="00000";
            for (i=0;i<result.data.length;i++)
            {
               // var id = "" + result.data[i].supplierID;
               // var StrId  = "S"+ pad.substring(0, pad.length - id.length)+id;
                DataSupplier.push(
                    {
                        id: result.data[i].supplierID,
                        text: result.data[i].nama.toString()
                    });
            }
            DataSupplier.push(
                {
                    id: "new",
                    text: "+ Tambah Supplier Baru"
                });
            $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher){
                $("#Pembelianbaru-SupplierSelect").select2({
                    data: DataSupplier,
                    placeholder:"-- Pilih Supplier --",
                    allowClear:true,
                    templateResult:formatOutput,
                    matcher:oldMatcher(SupplierMatcher)
                });
            });
        }
        else
        {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    })
}

function PembelianBaruGetBarang()
{
    GetAllStokData(currentToken, function(result){
        if(result.token_status=="success")
        {
            DataBarang = [];
            var i;
            var pad ="00000";
            for (i=0;i<result.data.length;i++)
            {
               DataBarang.push(
                    {
                        id: result.data[i].barangID,
                        text: result.data[i].nama.toString(),
                        nama: result.data[i].nama.toString(),
                        harga_pokok : result.data[i].harga_pokok
                    });
            }
            DataBarang.push(
                {
                    id: "new",
                    text: "+ Tambah Barang Baru"
                });
            $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
                $(".barang-select2").select2({
                    data: DataBarang,
                    placeholder: "-- Pilih Barang --",
                    allowClear: true,
                    templateResult:formatOutput,
                    matcher:oldMatcher(BarangMatcher)
                });
            });
        }
        else
        {
            console.log("token failed");
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    })
}

function PembelianBaruAddRow()
{
    var tableBody = document.getElementById('Pembelianbaru-ItemTable').getElementsByTagName("tbody")[0];

    var rowCount = tableBody.rows.length;
    var row = tableBody.insertRow(rowCount);
    var rowNum = rowCount+1;

    var cell1 = row.insertCell(0);
    cell1.innerHTML = rowNum.toString();

    var cell2 = row.insertCell(1);
    cell2.setAttribute("style", "padding:0");
    cell2.setAttribute("class", "form-group");
    var inputBarang = document.createElement("input");
    inputBarang.setAttribute("id", "Pembelianbaru-Input-"+twoDigitPad(rowNum)+"-1");
    inputBarang.setAttribute("style", "width:100%;");
    inputBarang.setAttribute("onchange", "PembelianBaruGetSatuanBarangList(this);");
    inputBarang.setAttribute("class", "barang-select2 form-control");
    cell2.appendChild(inputBarang);
    $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
        $("#Pembelianbaru-Input-" + twoDigitPad(rowNum) + "-1").select2({
            data: DataBarang,
            placeholder: "-- Pilih Barang --",
            allowClear: true,
            templateResult:formatOutput,
            matcher:oldMatcher(BarangMatcher)
        });
    });
    $("#Pembelianbaru-Input-" + twoDigitPad(rowNum)+ "-1").on("select2:select", function(e){PembelianBaruMoveToNext(this);});

    var cell5  =row.insertCell(2);
    cell5.setAttribute("id", "Pembelianbaru-IsiboxText-"+rowNum.toString());

    var cell3 = row.insertCell(3);
    cell3.setAttribute("style", "padding:0");
    cell3.setAttribute("class", "form-group");
    var inputJumlah = document.createElement("input");
    inputJumlah.setAttribute("id", "Pembelianbaru-Input-"+twoDigitPad(rowNum)+"-2");
    inputJumlah.setAttribute("class", "form-control");
    inputJumlah.setAttribute("type", "number");
    inputJumlah.setAttribute("min", "0");
    inputJumlah.setAttribute("style", "width:100%;");
    inputJumlah.setAttribute("onkeydown", "PembelianBaruMoveToNext(this);");
    inputJumlah.setAttribute("onchange", "PembelianBaruDrawTable(this);");
    cell3.appendChild(inputJumlah);

    var cell4 = row.insertCell(4);
    cell4.setAttribute("style", "padding:0");
    cell4.setAttribute("class", "form-group");
    var  inputSatuan = document.createElement("input");
    inputSatuan.setAttribute("class", "form-control satuan-select2");
    inputSatuan.setAttribute("id", "Pembelianbaru-Input-"+twoDigitPad(rowNum)+"-3");
    inputSatuan.setAttribute("style", "width:100%;");
    cell4.appendChild(inputSatuan);
    $("#Pembelianbaru-Input-"+twoDigitPad(rowNum)+"-3").select2({
         placeholder:"-- Pilih Unit --",
        allowClear:true
    });
    $("#Pembelianbaru-Input-" + twoDigitPad(rowNum)+ "-3").on("select2:select", function(e){PembelianBaruMoveToNext(this);});


    var cell6 = row.insertCell(5);
    cell6.setAttribute("style", "padding:0;");
    cell6.setAttribute("class", "form-group");
    var  inputHargaContainer = document.createElement("div");
    inputHargaContainer.setAttribute("class", "input-group");
    inputHargaContainer.setAttribute("style", "width:100%");
    var inputHargaLabel = document.createElement("span");
    inputHargaLabel.setAttribute("class", "input-group-addon");
    inputHargaLabel.innerHTML = "Rp.";
    var inputHarga = document.createElement("input");
    inputHarga.setAttribute("id","Pembelianbaru-Input-"+twoDigitPad(rowNum)+"-4");
    inputHarga.setAttribute("type", "number");
    inputHarga.setAttribute("class", "form-control");
    inputHarga.setAttribute("onchange", "PembelianBaruDrawTable(this.parentNode);");
    inputHarga.setAttribute("onkeydown", "PembelianBaruMoveToNext(this);");
    inputHargaContainer.appendChild(inputHargaLabel);
    inputHargaContainer.appendChild(inputHarga);
    cell6.appendChild(inputHargaContainer);

    var cell7 = row.insertCell(6);
    cell7.setAttribute("style", "padding:0;");
    var  inputDiscContainer1 = document.createElement("div");
    inputDiscContainer1.setAttribute("class", "input-group");
    inputDiscContainer1.setAttribute("style", "width:100%");
    var inputDisc1 = document.createElement("input");
    inputDisc1.setAttribute("id","Pembelianbaru-Input-"+twoDigitPad(rowNum)+"-5");
    inputDisc1.setAttribute("type", "number");
    inputDisc1.setAttribute("min", "0");
    inputDisc1.setAttribute("max", "100");
    inputDisc1.setAttribute("onkeydown", "PembelianBaruMoveToNext(this);");
    inputDisc1.setAttribute("class", "form-control");
    inputDisc1.setAttribute("onchange", "PembelianBaruDrawTable(this.parentNode);");
    var inputDiscLabel1 = document.createElement("span");
    inputDiscLabel1.setAttribute("class", "input-group-addon");
    inputDiscLabel1.innerHTML = "%";
    inputDiscContainer1.appendChild(inputDisc1);
    inputDiscContainer1.appendChild(inputDiscLabel1);
    cell7.appendChild(inputDiscContainer1);

    var cell8 = row.insertCell(7);
    cell8.setAttribute("style", "padding:0;");
    var  inputDiscContainer2 = document.createElement("div");
    inputDiscContainer2.setAttribute("class", "input-group");
    inputDiscContainer2.setAttribute("style", "width:100%");
    var inputDisc2 = document.createElement("input");
    inputDisc2.setAttribute("id","Pembelianbaru-Input-"+twoDigitPad(rowNum)+"-6");
    inputDisc2.setAttribute("type", "number");
    inputDisc2.setAttribute("min", "0");
    inputDisc2.setAttribute("max", "100");
    inputDisc2.setAttribute("onkeydown", "PembelianBaruMoveToNext(this);");
    inputDisc2.setAttribute("class", "form-control");
    inputDisc2.setAttribute("onchange", "PembelianBaruDrawTable(this.parentNode);");
    var inputDiscLabel2 = document.createElement("span");
    inputDiscLabel2.setAttribute("class", "input-group-addon");
    inputDiscLabel2.innerHTML = "%";
    inputDiscContainer2.appendChild(inputDisc2);
    inputDiscContainer2.appendChild(inputDiscLabel2);
    cell8.appendChild(inputDiscContainer2);

    var cell9 = row.insertCell(8);
    cell9.setAttribute("style", "padding:0;");
    var  inputDiscContainer3 = document.createElement("div");
    inputDiscContainer3.setAttribute("class", "input-group");
    inputDiscContainer3.setAttribute("style", "width:100%");
    var inputDisc3 = document.createElement("input");
    inputDisc3.setAttribute("id","Pembelianbaru-Input-"+twoDigitPad(rowNum)+"-7");
    inputDisc3.setAttribute("type", "number");
    inputDisc3.setAttribute("min", "0");
    inputDisc3.setAttribute("max", "100");
    inputDisc3.setAttribute("class", "form-control");
    inputDisc3.setAttribute("onkeydown", "PembelianBaruMoveToNext(this);");
    inputDisc3.setAttribute("onchange", "PembelianBaruDrawTable(this.parentNode);");
    var inputDiscLabel3 = document.createElement("span");
    inputDiscLabel3.setAttribute("class", "input-group-addon");
    inputDiscLabel3.innerHTML = "%";
    inputDiscContainer3.appendChild(inputDisc3);
    inputDiscContainer3.appendChild(inputDiscLabel3);
    cell9.appendChild(inputDiscContainer3);

    var cell10 = row.insertCell(9);
    var span  = document.createElement("span");
    span.setAttribute("class", "pull-right");
    span.innerHTML = "Rp. 0";
    cell10.appendChild(span);

    var cell11 = row.insertCell(10);
    var delButton = document.createElement("a");
    delButton.setAttribute("class", "del-row");
    delButton.setAttribute("onclick", "PembelianBaruRemoveRow(this);");
    delButton.setAttribute("style", "color:red;");
    var delIcon = document.createElement("i");
    delIcon.setAttribute("class", "glyphicon glyphicon-remove");
    delButton.appendChild(delIcon);
    cell11.appendChild(delButton);
}

function PembelianBaruRemoveRow(r)
{
    var tableBody = document.getElementById('Pembelianbaru-ItemTable').getElementsByTagName("tbody")[0];

    var i = r.parentNode.parentNode.rowIndex;
    console.log(i);

    var rowCount = tableBody.rows.length;
    var rowNum = rowCount-1;

    tableBody.deleteRow(i-1);

    var j;
    for (j=i-1;j<rowNum;j++)
    {
        console.log(j);
        tableBody.rows[j].cells[0].innerHTML = (j+1).toString();
        tableBody.rows[j].cells[1].children[0].children[0].setAttribute("id","Pembelianbaru-Input-"+twoDigitPad(j+1)+"-1");
        tableBody.rows[j].cells[2].setAttribute("id","Pembelianbaru-IsiboxText-"+(j+1).toString());
        tableBody.rows[j].cells[3].children[0].setAttribute("id","Pembelianbaru-Input-"+twoDigitPad(j+1)+"-2");
        tableBody.rows[j].cells[4].children[0].setAttribute("id","Pembelianbaru-Input-"+twoDigitPad(j+1)+"-3");
        tableBody.rows[j].cells[5].children[0].children[1].setAttribute("id","Pembelianbaru-Input-"+twoDigitPad(j+1)+"-4");
        tableBody.rows[j].cells[6].children[0].children[0].setAttribute("id","Pembelianbaru-Input-"+twoDigitPad(j+1)+"-5");
        tableBody.rows[j].cells[7].children[0].children[0].setAttribute("id","Pembelianbaru-Input-"+twoDigitPad(j+1)+"-6");
        tableBody.rows[j].cells[8].children[0].children[0].setAttribute("id","Pembelianbaru-Input-"+twoDigitPad(j+1)+"-7");
    }
    PembelianBaruDrawTable(null, true);
}

function PembelianBaruHideJatuhTempo()
{
    if ($("#Pembelianbaru-PembayaranSelect").val() == "cash")
    {
        document.getElementById("Pembelianbaru-TgljatuhtempoDate").value='';
        document.getElementById("Pembelianbaru-TgljatuhtempoDate").disabled=true;
    }
    else
    {
        document.getElementById("Pembelianbaru-TgljatuhtempoDate").disabled=false;
    }
}

function PembelianBaruGetSatuanBarangList(selectBox)
{

    var rowIndex = selectBox.parentNode.parentNode.rowIndex;
    var barangID = selectBox.value;

    console.log(rowIndex);
    GetAllSatuanData(currentToken, barangID, function(result)
    {
        var i;
        var data =[];
        for (i=0;i<result.data.length;i++)
        {
           data.push({
              "id":result.data[i].satuanID,
               "text":capitalizeFirstLetter(result.data[i].satuan)
           });
            if(result.data[i].satuan=="box")
            {
                document.getElementById("Pembelianbaru-IsiboxText-"+rowIndex.toString()).innerHTML = "@ "+result.data[i].konversi.toString()+" "+result.data[i].satuan_acuan;
            }
        }
        $("#Pembelianbaru-Input-"+twoDigitPad(rowIndex)+"-3").select2({
            data:data,
            placeholder:"-- Pilih Unit --",
            allowClear:true
        });
      //  console.log($("#Pembelianbaru-Input-"+twoDigitPad(rowIndex)+"-3").val());

    })
}

function PembelianBaruDrawTable(r)
{

    var indexChanged;
    if (r!=null)
        indexChanged = getRowIndex(r);//.parentNode.parentNode.rowIndex;
    else
        indexChanged= 0;
    var i;
    var itemTable= document.getElementById("Pembelianbaru-ItemTable");
    var itemTableFoot= document.getElementById("Pembelianbaru-ItemTable").getElementsByTagName("tfoot")[0];

    if(indexChanged>=1 && indexChanged<itemTable.rows.length){
        var curRow =  itemTable.rows[indexChanged];
        var qty = curRow.cells[3].children[0].value;
        var hargaSatuan = curRow.cells[5].children[0].children[1].value;
        var disc1 = curRow.cells[6].children[0].children[0].value;
        var disc2 = curRow.cells[7].children[0].children[0].value;
        var disc3 = curRow.cells[8].children[0].children[0].value;
        //subtotal
        var Subtotal = parseInt((qty * hargaSatuan*(100-disc1-disc2-disc3))/100);
        curRow.cells[9].children[0].innerHTML = "Rp. "+numberWithCommas(Subtotal);
    }
    var TotalHarga = 0;
    var subtotalTambahanStr;
    var subtotalTambahan;

    console.log(itemTableFoot.rows.length+ " " +itemTable.rows.length);
    for (i=1;i<itemTable.rows.length-itemTableFoot.rows.length;i++)
    {
        subtotalTambahanStr = itemTable.rows[i].cells[9].children[0].innerHTML.toString().substring(4);
        subtotalTambahan = parseInt(subtotalTambahanStr.replace(/,/g,''));
        TotalHarga += subtotalTambahan;
    }

    var posisitotal = itemTable.rows.length-itemTableFoot.rows.length;
    console.log(posisitotal);

    var discBesar = itemTable.rows[posisitotal].cells[2].children[0].children[0].value;
    console.log(discBesar);

    var TotalHargaAfterDisc = parseInt(TotalHarga *(100 - discBesar)/100);
    itemTable.rows[posisitotal].cells[4].children[0].innerHTML = "Rp. "+numberWithCommas(TotalHargaAfterDisc);
    if (itemTableFoot.rows.length>1)
    {
        var totalpengurangan=0;
        for (i=1;i<itemTableFoot.rows.length-1;i++)
        {
            var penguranganText = itemTableFoot.rows[i].cells[1].children[0].innerHTML;
            var pengurangan = parseInt(penguranganText.substring(5).replace(/,/g,''));
            totalpengurangan+=pengurangan;
        }
        var GrandTotal = TotalHargaAfterDisc-totalpengurangan;
        itemTableFoot.rows[itemTableFoot.rows.length-1].cells[1].children[0].innerHTML = "Rp. "+numberWithCommas(GrandTotal);
    }

}
function PembelianBaruSave(isPrinted)//PENTING
{
    removeWarning();
    var satuan = [];
    var itemTable= document.getElementById("Pembelianbaru-ItemTable");
    var itemTableFoot= document.getElementById("Pembelianbaru-ItemTable").getElementsByTagName("tfoot")[0];

    var i;
    var tglJatuhTempo, tglJatuhTempoTemp, status;
    var tglTransaksiValue = $("#Pembelianbaru-TgltransaksiDate").datepicker().val();
    var tglJatuhTempoValue= $("#Pembelianbaru-TgljatuhtempoDate").datepicker().val();

    var voucher = [];
    var tableFoot = document.getElementById("Pembelianbaru-ItemTable").getElementsByTagName("tfoot")[0];
    if (tableFoot.rows.length>=2)
    {
        for (i=1;i<tableFoot.rows.length-1;i++)
        {
            voucher.push({
               voucherpembelianID:tableFoot.rows[i].cells[0].getAttribute("data-id")
            });
        }
    }
    if ($("#Pembelianbaru-PembayaranSelect").val()=="cash")
    {
        tglJatuhTempo=null;
        status = "lunas"
    }
    else
    {
        tglJatuhTempoTemp = new Date(tglJatuhTempoValue);
        tglJatuhTempo = tglJatuhTempoTemp.getFullYear()+"-"+(tglJatuhTempoTemp.getMonth()+1)+"-"+tglJatuhTempoTemp.getDate();
        status = "belum lunas"
    }
    var tglTransaksiTemp = new Date(tglTransaksiValue);
    var tglTransaksi = tglTransaksiTemp.getFullYear()+"-"+(tglTransaksiTemp.getMonth()+1)+"-"+tglTransaksiTemp.getDate();
    var valid = true;
    var SupplierSelectValue = $("#Pembelianbaru-SupplierSelect").val();
    if (SupplierSelectValue==null ||SupplierSelectValue=="")
    {
        valid=false;
        setWarning(document.getElementById("Pembelianbaru-SupplierSelect"), "Data supplier harus diisi");
    }
    if (tglTransaksiValue==null || tglTransaksiValue=='')
    {
        valid=false;
        setWarning(document.getElementById("Pembelianbaru-TgltransaksiDate"), "Tgl transaksi harus diisi");
    }
    if ($("#Pembelianbaru-PembayaranSelect").val()=="bon" && (tglJatuhTempoValue==null || tglJatuhTempoValue==''))
    {
        valid=false;
        setWarning(document.getElementById("Pembelianbaru-TgljatuhtempoDate"), "Tgl jatuh tempo harus diisi bila membayar dengan bon");
    }
    for (i=1;i<itemTable.rows.length-tableFoot.rows.length;i++)
    {
        var BarangSelectValue = $("#Pembelianbaru-Input-"+twoDigitPad(i)+"-1").val();
        if (BarangSelectValue == null || BarangSelectValue=='')
        {
            valid=false;
            setWarning(document.getElementById("Pembelianbaru-Input-"+twoDigitPad(i)+"-1"),"Barang harus diisi");
        }
        var qty = document.getElementById("Pembelianbaru-Input-"+twoDigitPad(i)+"-2");
        if (qty.value=='' || qty.value==null || qty.value==0)
        {
            valid=false;
            setWarning(qty,"hrs diisi");
        }
        var satuanselect  =$("#Pembelianbaru-Input-"+twoDigitPad(i)+"-3").val();
        if (satuanselect=='' || satuanselect==null)
        {
            valid=false;
            setWarning(document.getElementById("Pembelianbaru-Input-"+twoDigitPad(i)+"-3"), "satuan harus diisi")
        }
    }
    if (valid)
    {
        for (i=1;i<itemTable.rows.length-tableFoot.rows.length;i++){
            var qty2 = document.getElementById("Pembelianbaru-Input-"+twoDigitPad(i)+"-2");
            satuan.push({
                "satuanID":$("#Pembelianbaru-Input-"+twoDigitPad(i)+"-3").val(),
                "quantity":qty2.value,
                "disc1":document.getElementById("Pembelianbaru-Input-"+twoDigitPad(i)+"-5").value,
                "disc2":document.getElementById("Pembelianbaru-Input-"+twoDigitPad(i)+"-6").value,
                "disc3":document.getElementById("Pembelianbaru-Input-"+twoDigitPad(i)+"-7").value,
                "harga_per_biji":document.getElementById("Pembelianbaru-Input-"+twoDigitPad(i)+"-4").value
            });
        }
        var posisitotal = itemTable.rows.length-itemTableFoot.rows.length;

        var grand_subtotal = parseInt(itemTable.rows[posisitotal].cells[4].children[0].innerHTML.substring(4).replace(/,/g, ''));
        grand_subtotal = grand_subtotal * 100 / (100 - itemTable.rows[posisitotal].cells[2].children[0].children[0].value);

        AddPembelian(
            currentToken,
            SupplierSelectValue,
            tglTransaksi,
            tglJatuhTempo,
            grand_subtotal,
            itemTable.rows[itemTable.rows.length-tableFoot.rows.length].cells[2].children[0].children[0].value,
            isPrinted,
            status,
            $("#Pembelianbaru-NotesInput").val(),
            satuan,
            voucher,
            function(result){
                if (result.token_status=="success")
                {
                    console.log(result.pembelianID);
                    PembelianBaruResetTable();
                    var pad ="0000";
                    var id = "" + result.pembelianID;
                    var StrId  = "TB"+ pad.substring(0, pad.length - id.length)+id;
                    createAlert("success", "Data Pembelian baru "+StrId+" berhasil ditambahkan");
                }
                else
                {
                    createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
                }
            }
        );
    }
}
function PembelianBaruResetTable()
{
    var tableBody = document.getElementById('Pembelianbaru-ItemTable').getElementsByTagName("tbody")[0];
    while (true) {
        if (tableBody.rows.length==1)
            break;
        tableBody.deleteRow(-1);
    }
    tableBody.rows[0].cells[6].children[0].children[0].value = 0;
    tableBody.rows[0].cells[7].children[0].children[0].value = 0;
    tableBody.rows[0].cells[8].children[0].children[0].value = 0;
}


function PembelianBaruCreateSupplierConfirm()
{
    var valid=true;
    var formData = document.getElementById("Pembelianbaru-CreatesupplierModal-CreateForm");
    var nama = formData.elements['nama'].value;
    var telp = formData.elements['telp'].value;
    var alamat = formData.elements['alamat'].value;
    if (nama=="" || nama==null)
    {
        valid=false;
    }
    if (valid)
    {
        console.log("valid");
        AddSupplier(currentToken, nama, telp, alamat, function(result){
            console.log('fungsi');
            if (result.token_status=="success")
            {
                console.log('fungsi1');
                if  (result.supplierID != null)
                {
                    console.log('fungsi2');
                    var pad ="00000";
                    var id = "" + result.supplierID;
                    var StrId  = "S"+ pad.substring(0, pad.length - id.length)+id;
                    console.log('fungsi3');
                    $("#Pembelianbaru-CreatesupplierModal").modal('toggle');
                    formData.reset();
                    createAlert("success", "Supplier baru "+StrId+" - "+nama +" berhasil ditambahkan");
                    console.log('fungsi4');
                    DataSupplier.pop();
                    DataSupplier.push({
                        id:id,
                        text:nama
                    });
                    DataSupplier.push({
                        id:'new',
                        text:"+ Tambah Supplier Baru"
                    });
                    $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher){
                        $("#Pembelianbaru-SupplierSelect").select2({
                            data: DataSupplier,
                            placeholder:"-- Pilih Supplier --",
                            allowClear:true,
                            templateResult:formatOutput,
                            matcher:oldMatcher(SupplierMatcher)
                        });
                    });
                    $("#Pembelianbaru-SupplierSelect").select2().val(id.toString()).trigger("change");
                }
                else {
                    console.log("Add Supplier failed");
                    createAlert("danger", "Data supplier gagal ditambahkan, mohon coba kembali");
                }
            }
            else
            {
                console.log("Token failed");
                createAlert("danger", "Terd apat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
            }
        });
    }
}
function PembelianBaruMoveToNext(node)
{
    //console.log(node.attr('id'));
    if (event.which == 13) {
        event.preventDefault();
        console.log($(node).attr('id'));

        var nowID = $(node).attr('id');
        var angka1 =parseInt(nowID.toString().substring(20, 22));
        var angka2 =parseInt(nowID.toString().substring(23));
        var angka1baru, angka2baru;
        if (angka2 < 7)
        {
            angka1baru = angka1;
            angka2baru = angka2+1;
        }
        else if (angka2>=7)
        {
            angka1baru = angka1+1;
            angka2baru = 1;
        }
        var nextID ="Pembelianbaru-Input-"+twoDigitPad(angka1baru)+"-"+angka2baru.toString();
        if($("#" + nextID).length == 0) {
            PembelianBaruAddRow();
            $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
                $("#" +nextID).select2('open');
            });
        }
        else {
            if ($("#" + nextID).data('select2'))
            {
                console.log("lala");
                $("#" + nextID).select2('open');
            }
            else {
                $("#"+nextID).focus();
            }
        }
    }
}

function PembelianBaruCollectVoucher()
{
    var lists = document.getElementsByClassName("Pembelianbaru-VoucherModal-VoucherCheckList");
    var i;
    var voucherList = [];
    var tableFoot = document.getElementById('Pembelianbaru-ItemTable').getElementsByTagName("tfoot")[0];
    while (true) {
        if (tableFoot.rows.length==1)
            break;
        tableFoot.deleteRow(-1);
    }
    console.log(tableFoot.rows.length);
    var totalPengurangan= 0;

    console.log(lists);
    for (i=0;i<lists.length;i++)
    {
        console.log($(lists[i]).prop("checked"));
        if ($(lists[i]).prop("checked"))
        {
            console.log($(lists[i]));
            var rowFoot = tableFoot.rows.length;
            var row = tableFoot.insertRow(rowFoot);
            //var rowNum = rowFoot+1;
            var text = row.insertCell(0);
            text.setAttribute("colspan", "9");
            console.log($(lists[i]).attr("data-id"));
            text.setAttribute("data-id", $(lists[i]).attr("data-id"));
            text.innerHTML  = "<span class='pull-right'>Retur "+document.getElementById("Pembelianbaru-VoucherModal-DetailText-"+i).innerHTML+"</span>";
            var nominal = row.insertCell(1);
            nominal.innerHTML = "<span class='pull-right'> -"+document.getElementById("Pembelianbaru-VoucherModal-NominalText-"+i).innerHTML+"</span>";
            var delbtn = row.insertCell(2);
            delbtn.innerHTML =  "<a onclick='PembelianBaruDelReturRow(this);' style='color:red;'><i class='glyphicon glyphicon-remove'></i></a>";

            var temp1 =document.getElementById("Pembelianbaru-VoucherModal-NominalText-"+i).innerHTML;
            var temp2 = parseInt(temp1.substring(4).replace(/,/g,''));
            console.log(temp2);
            totalPengurangan+= temp2;
        }
    }
    var rowFoot2 = tableFoot.rows.length;
    var row2 = tableFoot.insertRow(rowFoot2);
    var text2 = row2.insertCell(0);
    text2.setAttribute("colspan", "9");
    text2.innerHTML ="<span class='pull-right'>Grand Total</span>";
    var sisaContainer = row2.insertCell(1);
    var sisaString  = document.getElementById('Pembelianbaru-ItemTable').getElementsByTagName("tfoot")[0].rows[0].cells[4].children[0].innerHTML;
    var celldummy  = row2.insertCell(2);

    console.log(sisaString);
    console.log(totalPengurangan);
    console.log(parseInt(sisaString.substring(4).replace(/,/g,'')));
    var sisa = (parseInt(sisaString.substring(4).replace(/,/g,'')) - totalPengurangan);
    console.log(sisa);

    if (sisa<0)
    {
        var sisapositif = -sisa;
        console.log(sisapositif);
        sisaContainer.innerHTML ="<span class='pull-right'>-Rp. "+numberWithCommas(sisapositif)+"</span>";
    }
    else {
        sisaContainer.innerHTML ="<span class='pull-right'>Rp. "+numberWithCommas(sisa)+"</span>";
    }
}
function PembelianBaruDelReturRow(button)
{
    var indexRow = getRowIndex(button);
    var tableBody = document.getElementById('Pembelianbaru-ItemTable').getElementsByTagName("tbody")[0];
    var tableFoot = document.getElementById('Pembelianbaru-ItemTable').getElementsByTagName("tfoot")[0];
    console.log(tableFoot.rows.length);
  //  var tableBody = document.getElementById('Pembelianbaru-ItemTable').getElementsByTagName("tbody")[0];
    var i = getRowIndex(button);
    console.log(i);
 //   var rowCount = tableFoot.rows.length;
    //var rowNum = rowCount-1;
    console.log(tableFoot.rows.length+" "+ tableBody.rows.length);
    tableFoot.deleteRow(i-tableBody.rows.length-1);

    if(tableFoot.rows.length==2)
    {
        tableFoot.deleteRow(-1);
    }
    PembelianBaruDrawTable(null, true);

}
function PembelianBaruSupplierSelectChangeListener()
{
    if ($("#Pembelianbaru-SupplierSelect").val()=="new")
        $("#Pembelianbaru-CreatesupplierModal").modal('toggle');
    else
    {
        ListVoucherSupplier(currentToken, $("#Pembelianbaru-SupplierSelect").val(), function(result){
            console.log("cari voucher ");
            console.log(result);
            if (result.token_status=="success")
            {
                if (result.data && result.data.length>0)
                {
                    var i;
                    console.log("lila");

                    document.getElementById("Pembelianbaru-VoucherModal-VoucherList").innerHTML="";
                    for (i=0;i<result.data.length;i++)
                    {
                        var pembelianID = 19;
                        var tanggalPembelian = "10/10/2016";
                        var jumlah  = result.data[i].jumlah_awal;
                        var voucherEntry = "<p><input data-id='"+ result.data[i].voucherpembelianID+"' id ='voucher-"+pembelianID+"' type='checkbox' class='minimal Pembelianbaru-VoucherModal-VoucherCheckList'>" +
                            " <a id='Pembelianbaru-VoucherModal-DetailText-"+i+"' onclick='InitDetailPembelianPage("+pembelianID+");'>" +
                            "Pembelian tanggal " +tanggalPembelian+" " +
                            "</a>"+
                            "<span id='Pembelianbaru-VoucherModal-NominalText-"+i+"'>Rp. "+numberWithCommas(jumlah)+"</span></p>";
                        document.getElementById("Pembelianbaru-VoucherModal-VoucherList").innerHTML+= voucherEntry;
                    }
                    $("#Pembelianbaru-VoucherModal").modal('toggle');
                    $('input[type="checkbox"].minimal').iCheck({
                        checkboxClass: "icheckbox_minimal-green"
                    });
                    document.getElementById("Pembelianbaru-VoucherModal-ConfirmButton").onclick =function()
                    {
                        PembelianBaruCollectVoucher();
                        $("#Pembelianbaru-VoucherModal").modal('toggle');
                    }
                }
            }
        });

    }
}
function InitPembelianBaruPage()
{
    currentToken = localStorage.getItem("token");
    setPage("PembelianBaru");
    PembelianBaruGetSupplier();
    PembelianBaruGetBarang();
    PembelianBaruHideJatuhTempo();
    $("#Pembelianbaru-PembayaranSelect").select2({
        minimumResultsForSearch:Infinity,
        placeholder:"-- Pilih cara pembayaran --",
        allowClear:true
    }).on("change", function(){
        PembelianBaruHideJatuhTempo();
    });

    $('#Pembelianbaru-TgljatuhtempoDate').datepicker({
        autoclose: true
    });
    $('#Pembelianbaru-TgltransaksiDate').datepicker({
        autoclose: true
    });
    document.getElementById("Pembelianbaru-SaveButton").onclick=function()
    {
        PembelianBaruSave(0);
    };
    document.getElementById("Pembelianbaru-AddButton").onclick = function()
    {
        window.scrollTo(0, document.body.scrollHeight);
        PembelianBaruAddRow();
    };
    document.getElementById("Pembelianbaru-ResetButton").onclick = function()
    {
        PembelianBaruResetTable();
    };

    document.getElementById("Pembelianbaru-SupplierSelect").onchange=function()
    {
        PembelianBaruSupplierSelectChangeListener();
    };
    document.getElementById("Pembelianbaru-CreatesupplierModal-ConfirmButton").onclick=function()
    {
        PembelianBaruCreateSupplierConfirm();
    };
    var tableBody = document.getElementById('Pembelianbaru-ItemTable').getElementsByTagName("tbody")[0];
    if (tableBody.rows.length<1)
        PembelianBaruAddRow();
}
