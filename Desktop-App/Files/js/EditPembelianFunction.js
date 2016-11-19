/**
 * Created by Billy on 13-Nov-16.
 */

var currentToken;


function EditPembelianAddRow(barang)
{
    var tableBody = document.getElementById('Editpembelian-ItemTable').getElementsByTagName("tbody")[0];

    var rowCount = tableBody.rows.length;
    var row = tableBody.insertRow(rowCount);
    var rowNum = rowCount+1;

    var isi_box = "@ "+(barang.konversi_box).toString()+" "+capitalizeFirstLetter(barang.satuan_acuan_box)
    var satuan_unit = barang.satuan_unit
    var nama_barang = barang.nama_barang

    var hargaUnit = barang.harga_per_biji;
    var qty = barang.quantity;
    var disc1 = barang.disc_1;
    var disc2 = barang.disc_2;
    var disc3 = barang.disc_3;
    var subtotal = hargaUnit*qty *(100-disc1-disc2-disc3)/100;
   // var itemSubtotal = (hargaUnit * qty)*((100-disc1-disc2-disc3)/100);


    var cell1 = row.insertCell(0);
    cell1.innerHTML = rowNum.toString();
    cell1.setAttribute("data-id", barang.pembelianbarangID);


    var cell2 = row.insertCell(1);
    cell2.innerHTML = nama_barang;

    var cell5  =row.insertCell(2);
    cell5.innerHTML = isi_box;

    var cell3 = row.insertCell(3);
    cell3.innerHTML = "<span class='pull-right'>"+numberWithCommas(qty)+"</span>"

    var cell4 = row.insertCell(4);
    cell4.innerHTML =  capitalizeFirstLetter(satuan_unit);
   /* cell4.setAttribute("style", "padding:0");
    cell4.setAttribute("class", "form-group has-error");
    var  inputSatuan = document.createElement("input");
    inputSatuan.setAttribute("class", "form-control satuan-select2");
    inputSatuan.setAttribute("id", "Pembelianbaru-Input-"+rowNum.toString()+"-3");
    inputSatuan.setAttribute("style", "width:100%;");
    cell4.appendChild(inputSatuan);
    $("#Pembelianbaru-Input-"+rowNum.toString()+"-3").select2({
        minimumResultsForSearch:Infinity,
        placeholder:"-- Pilih Unit --",
        allowClear:true
    });*/
   var cellqtyretur = row.insertCell(5);

    var cell6 = row.insertCell(6);
    cell6.setAttribute("style", "padding:0;");
    cell6.setAttribute("class", "form-group");
    var  inputHargaContainer = document.createElement("div");
    inputHargaContainer.setAttribute("class", "input-group");
    inputHargaContainer.setAttribute("style", "width:100%");
    var inputHargaLabel = document.createElement("span");
    inputHargaLabel.setAttribute("class", "input-group-addon");
    inputHargaLabel.innerHTML = "Rp.";
    var inputHarga = document.createElement("input");
    inputHarga.setAttribute("id","Editpembelian-Input-"+rowNum.toString()+"-1");
    inputHarga.setAttribute("type", "number");
    inputHarga.setAttribute("class", "form-control");
    inputHarga.value = hargaUnit;
    inputHarga.setAttribute("onchange", "EditPembelianDrawTable(this);");
    inputHargaContainer.appendChild(inputHargaLabel);
    inputHargaContainer.appendChild(inputHarga);
    cell6.appendChild(inputHargaContainer);

    var cell7 = row.insertCell(7);
    cell7.setAttribute("style", "padding:0;");
    var  inputDiscContainer1 = document.createElement("div");
    inputDiscContainer1.setAttribute("class", "input-group");
    inputDiscContainer1.setAttribute("style", "width:100%");
    var inputDisc1 = document.createElement("input");
    inputDisc1.setAttribute("id","Editpembelian-Input-"+rowNum.toString()+"-2");
    inputDisc1.setAttribute("type", "number");
    inputDisc1.setAttribute("min", "0");
    inputDisc1.setAttribute("max", "100");
    inputDisc1.setAttribute("class", "form-control");
    inputDisc1.value= disc1;
    inputDisc1.setAttribute("onchange", "EditPembelianDrawTable(this);");
    var inputDiscLabel1 = document.createElement("span");
    inputDiscLabel1.setAttribute("class", "input-group-addon");
    inputDiscLabel1.innerHTML = "%";
    inputDiscContainer1.appendChild(inputDisc1);
    inputDiscContainer1.appendChild(inputDiscLabel1);
    cell7.appendChild(inputDiscContainer1);

    var cell8 = row.insertCell(8);
    cell8.setAttribute("style", "padding:0;");
    var  inputDiscContainer2 = document.createElement("div");
    inputDiscContainer2.setAttribute("class", "input-group");
    inputDiscContainer2.setAttribute("style", "width:100%");
    var inputDisc2 = document.createElement("input");
    inputDisc2.setAttribute("id","Editpembelian-Input-"+rowNum.toString()+"-3");
    inputDisc2.setAttribute("type", "number");
    inputDisc2.setAttribute("min", "0");
    inputDisc2.setAttribute("max", "100");
    inputDisc2.setAttribute("class", "form-control");
    inputDisc2.value= disc2;
    inputDisc2.setAttribute("onchange", "EditPembelianDrawTable(this);");
    var inputDiscLabel2 = document.createElement("span");
    inputDiscLabel2.setAttribute("class", "input-group-addon");
    inputDiscLabel2.innerHTML = "%";
    inputDiscContainer2.appendChild(inputDisc2);
    inputDiscContainer2.appendChild(inputDiscLabel2);
    cell8.appendChild(inputDiscContainer2);

    var cell9 = row.insertCell(9);
    cell9.setAttribute("style", "padding:0;");
    var  inputDiscContainer3 = document.createElement("div");
    inputDiscContainer3.setAttribute("class", "input-group");
    inputDiscContainer3.setAttribute("style", "width:100%");
    var inputDisc3 = document.createElement("input");
    inputDisc3.setAttribute("id","Editpembelian-Input-"+rowNum.toString()+"-4");
    inputDisc3.setAttribute("type", "number");
    inputDisc3.setAttribute("min", "0");
    inputDisc3.setAttribute("max", "100");
    inputDisc3.setAttribute("class", "form-control");
    inputDisc3.value= disc3;
    inputDisc3.setAttribute("onchange", "EditPembelianDrawTable(this);");
    var inputDiscLabel3 = document.createElement("span");
    inputDiscLabel3.setAttribute("class", "input-group-addon");
    inputDiscLabel3.innerHTML = "%";
    inputDiscContainer3.appendChild(inputDisc3);
    inputDiscContainer3.appendChild(inputDiscLabel3);
    cell9.appendChild(inputDiscContainer3);

    var cell10 = row.insertCell(10);
    var span  = document.createElement("span");
    span.setAttribute("class", "pull-right");
    span.innerHTML = "Rp. "+numberWithCommas(subtotal);
    cell10.appendChild(span);

}

function populateEditPembelianPage(ID)
{
    EditPembelianResetTable();
    GetDetailPembelian(currentToken, ID, function(result)
    {
        var pembelian = result.data[0];
        document.getElementById("Editpembelian-SupplierText").innerHTML = pembelian.supplierNama;
        var tglTransaksi = $("#Editpembelian-TgltransaksiDate");
        var tglJatuhTempo = $("#Editpembelian-TgljatuhtempoDate");
        tglTransaksi.datepicker({
            autoclose: true
        });
        tglTransaksi.datepicker("setDate", new Date(pembelian.tanggal_transaksi));
        tglJatuhTempo.datepicker({
            autoclose: true
        });
        if (pembelian.jatuh_tempo==null || pembelian.jatuh_tempo=='')
        {
            document.getElementById("Editpembelian-PembayaranText").innerHTML = "Cash";
            document.getElementById("Editpembelian-TgljatuhtempoDate").disabled = true;
        }
        else {
            document.getElementById("Editpembelian-PembayaranText").innerHTML = "Bon";
            tglJatuhTempo.datepicker("setDate", new Date (pembelian.jatuh_tempo));
        }
        document.getElementById("Editpembelian-NotesInput").value=pembelian.notes;
        var itemTableFooter= document.getElementById("Editpembelian-ItemTable").getElementsByTagName("tfoot")[0];
        console.log(itemTableFooter);
        itemTableFooter.rows[0].cells[2].children[0].children[0].value=pembelian.disc;
        itemTableFooter.rows[0].cells[4].children[0].innerHTML="Rp. "+numberWithCommas(pembelian.subtotal);
        var i;
        for (i=0;i<pembelian.barang.length;i++)
        {
            EditPembelianAddRow(pembelian.barang[i]);
        }
    });
}

function EditPembelianDrawTable(r)
{
    var indexChanged;
    if (r!=null)
        indexChanged = getRowIndex(r);
    else
        indexChanged= 0;
    var i;
    var itemTable= document.getElementById("Editpembelian-ItemTable");

    if(indexChanged>=1 && indexChanged<itemTable.rows.length){
        console.log(indexChanged);
        var curRow =  itemTable.rows[indexChanged];

        var qtyStr = curRow.cells[3].children[0].innerHTML;
        var qty = parseInt(qtyStr.replace(',',''));
        console.log(qtyStr+" "+qty);
        var hargaSatuan = document.getElementById("Editpembelian-Input-"+indexChanged+"-1").value;
        var disc1 = document.getElementById("Editpembelian-Input-"+indexChanged+"-2").value;
        var disc2 = document.getElementById("Editpembelian-Input-"+indexChanged+"-3").value;
        var disc3 = document.getElementById("Editpembelian-Input-"+indexChanged+"-4").value;
        //subtotal
        var Subtotal = parseInt((qty * hargaSatuan*(100-disc1-disc2-disc3))/100);
        curRow.cells[10].children[0].innerHTML = "Rp. "+numberWithCommas(Subtotal);
    }
    var TotalHarga = 0;
    var subtotalTambahanStr;
    var subtotalTambahan;

    for (i=1;i<itemTable.rows.length-1;i++)
    {
        subtotalTambahanStr = itemTable.rows[i].cells[10].children[0].innerHTML.toString().substring(4);
        subtotalTambahan = parseInt(subtotalTambahanStr.replace(',',''));
        TotalHarga += subtotalTambahan;
    }

    var discBesar = itemTable.rows[itemTable.rows.length-1].cells[2].children[0].children[0].value;
    console.log(discBesar);

    var TotalHargaAfterDisc = parseInt(TotalHarga *(100 - discBesar)/100);
    itemTable.rows[itemTable.rows.length-1].cells[4].children[0].innerHTML = "Rp. "+numberWithCommas(TotalHargaAfterDisc);
}

function EditPembelianResetTable()
{

    document.getElementById("Editpembelian-TgltransaksiDate").value = '';
    document.getElementById("Editpembelian-TgljatuhtempoDate").value = '';
    document.getElementById("Editpembelian-NotesInput").value = '';

    var tableBody = document.getElementById('Editpembelian-ItemTable').getElementsByTagName("tbody")[0];
    while (true) {
        if (tableBody.rows.length==0)
            break;
        tableBody.deleteRow(-1);
    }
}

function EditPembelianSaveConfirm(id)
{
    console.log("lala");
    var i;
    var ItemTableBody = document.getElementById("Editpembelian-ItemTable").getElementsByTagName("tbody")[0];
    var rowNum = ItemTableBody.rows.length;
    var notes = document.getElementById("Editpembelian-NotesInput").value;
    var tgltranstemp2 = new Date($("#Editpembelian-TgltransaksiDate").datepicker().val());
    var tgljatuhtemp2 = new Date($("#Editpembelian-TgljatuhtempoDate").datepicker().val());
    var tgltrans = tgltranstemp2.getFullYear()+"-"+(tgltranstemp2.getMonth()+1)+"-"+tgltranstemp2.getDate();
    var tgljatuh = tgljatuhtemp2.getFullYear()+"-"+(tgljatuhtemp2.getMonth()+1)+"-"+tgljatuhtemp2.getDate();
    if ($("#Editpembelian-TgljatuhtempoDate").datepicker().val()==null || $("#Editpembelian-TgljatuhtempoDate").datepicker().val()=='')
    {
        tgljatuh = null;
    }
    console.log(rowNum);

    EditPembelian(currentToken, id, tgltrans, tgljatuh,notes, function(result) {
        if (result.token_status=="success")
        {
            for (i=1;i<=rowNum;i++)
            {
                console.log(i);
                EditPembelianEditEntry($(ItemTableBody.rows[i-1].cells[0]).attr("data-id"), i );
            }
            InitDetailPembelianPage(id);
            createAlert("success", "Data Pembelian Berhasil diubah");
        }

    })


}
function EditPembelianEditEntry(pembelianbarangID, row)
{
    console.log(pembelianbarangID+ row);

    EditPembelianBarang(currentToken,
        pembelianbarangID,
        document.getElementById("Editpembelian-Input-"+row+"-1").value,
        document.getElementById("Editpembelian-Input-"+row+"-2").value,
        document.getElementById("Editpembelian-Input-"+row+"-3").value,
        document.getElementById("Editpembelian-Input-"+row+"-4").value,
        function(result){
            if (result.token_status=='success')
            {
                console.log(pembelianbarangID);
            }
        }
    )
}

function InitEditPembelianPage(curPembelianID)
{
    currentToken = localStorage.getItem("token");
    setPage("EditPembelian");

    populateEditPembelianPage(curPembelianID);

    document.getElementById("Editpembelian-SaveButton").onclick=function()
    {
        EditPembelianSaveConfirm(curPembelianID);
    };
 //   EditPembelianDrawTable(null);
}
