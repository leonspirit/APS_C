/**
 * Created by Billy on 13-Nov-16.
 */


function EditPenjualanAddRow(barang)
{
    var tableBody = document.getElementById('Editpenjualan-ItemTable').getElementsByTagName("tbody")[0];

    var rowCount = tableBody.rows.length;
    var row = tableBody.insertRow(rowCount);
    var rowNum = rowCount+1;

    var cell1 = row.insertCell(0);
    cell1.innerHTML = rowNum.toString();
    cell1.setAttribute("data-id", barang.penjualanbarangID);
    var hargaJual = barang.harga_jual_saat_ini;
    var hargaPokok = barang.harga_pokok_saat_ini;
    var qty = barang.quantity;
    var disc = barang.disc;

    var subtotalvalue = hargaJual*qty *(100-disc)/100;

    var cell2 = row.insertCell(1);

    var cell5 = row.insertCell(2);
    cell5.setAttribute("id", "Penjualanbaru-IsiboxText-"+rowNum.toString());

    var cell3 = row.insertCell(3);
    cell3.innerHTML = numberWithCommas(qty);

    var cell4 = row.insertCell(4);

    var cell7 = row.insertCell(5);
    cell7.setAttribute("style", "padding:0");
    var inputHargaGroup = document.createElement("div");
    inputHargaGroup.setAttribute("style", "width:100%;");
    inputHargaGroup.setAttribute("class", "input-group");
    var inputHargaAddOn = document.createElement("span");
    inputHargaAddOn.setAttribute("class","input-group-addon");
    inputHargaAddOn.innerHTML="Rp.";
    var inputHarga= document.createElement("input");
    inputHarga.setAttribute("type", "number");
    inputHarga.setAttribute("onchange", "EditpenjualanDrawTable(this.parentNode);");
    inputHarga.setAttribute("class", "form-control");
    inputHarga.value=hargaJual;
    inputHarga.setAttribute("id", "Penjualanbaru-Input-"+rowNum.toString()+"-1");
    inputHargaGroup.appendChild(inputHargaAddOn);
    inputHargaGroup.appendChild(inputHarga);
    cell7.appendChild(inputHargaGroup);

    var cell8 = row.insertCell(6);
    cell8.setAttribute("style", "padding:0");
    var inputDiscGroup = document.createElement("div");
    inputDiscGroup.setAttribute("style", "width:100%;");
    inputDiscGroup.setAttribute("class", "input-group");
    var inputDiscAddOn = document.createElement("span");
    inputDiscAddOn.setAttribute("class","input-group-addon");
    inputDiscAddOn.innerHTML="%";
    var inputDisc= document.createElement("input");
    inputDisc.setAttribute("type", "number");
    inputDisc.setAttribute("min", "0");
    inputDisc.setAttribute("max", "100");
    inputDisc.setAttribute("class", "form-control");
    inputDisc.setAttribute("id", "Penjualanbaru-Input-"+rowNum.toString()+"-2");
    inputDisc.setAttribute("onchange", "EditpenjualanDrawTable(this.parentNode);");
    inputDisc.value=disc;
    inputDiscGroup.appendChild(inputDisc);
    inputDiscGroup.appendChild(inputDiscAddOn);
    cell8.appendChild(inputDiscGroup);

    var cell9 = row.insertCell(7);
    var subtotal = document.createElement("span");
    subtotal.setAttribute("class", "pull-right");
    subtotal.innerHTML = "Rp. "+numberWithCommas(subtotalvalue);
    cell9.appendChild(subtotal);

    if (hasHakAkses("HargaPokokLaba"))
    {
        var cell10 = row.insertCell(8);
        var hPokok = document.createElement("span");
        hPokok.setAttribute("id", "Penjualanbaru-hpokok-"+rowNum.toString());
        hPokok.setAttribute("class", "pull-right");
        hPokok.innerHTML = "Rp. 0";
        cell10.appendChild(hPokok);

        var cell11 = row.insertCell(9);
        var untung = document.createElement("span");
        untung.setAttribute("class", "pull-right");
        untung.innerHTML = "Rp. 0";
        cell11.appendChild(untung);
    }
    else {
    }

}

function populateEditPenjualanPage(ID)
{
    GetDetailPenjualan(currentToken, ID, function(result)
    {
        var penjualan = result.data[0];

        document.getElementById("Editpenjualan-PelangganText").innerHTML = penjualan.pelangganNama;
        var tglTransaksi = $("#Editpenjualan-TgltransaksiDate");
        var tglJatuhTempo = $("#Editpenjualan-TgljatuhtempoDate");
        tglTransaksi.datepicker({
            autoclose: true
        });
        tglTransaksi.datepicker("setDate", new Date(penjualan.tanggal_transaksi));
        tglJatuhTempo.datepicker({
            autoclose: true
        });
        if (penjualan.jatuh_tempo==null || penjualan.jatuh_tempo=='')
        {
            document.getElementById("Editpenjualan-PembayaranText").innerHTML = "Cash";
            document.getElementById("Editpenjualan-TgljatuhtempoDate").disabled = true;
        }
        else {
            document.getElementById("Editpenjualan-PembayaranText").innerHTML = "Bon";
            tglJatuhTempo.datepicker("setDate", new Date (penjualan.jatuh_tempo));
        }
        document.getElementById("Editpenjualan-NotesInput").value=penjualan.notes;
        document.getElementById("Editpenjualan-AlamatInput").value=penjualan.alamat;
        var itemTableFooter= document.getElementById("Editpembelian-ItemTable").getElementsByTagName("tfoot")[0];
        console.log(itemTableFooter);
        itemTableFooter.rows[0].cells[2].children[0].children[0].value=penjualan.disc;
        itemTableFooter.rows[0].cells[4].children[0].innerHTML="Rp. "+numberWithCommas(penjualan.subtotal);

        var i;
        for (i=0;i<penjualan.barang.length;i++)
        {
            EditPenjualanAddRow(penjualan.barang[i]);
        }
    });
}

function EditPenjualanDrawTable(r) {

    var countLaba;
    if (hasHakAkses("HargaPokokLaba"))
    {
        countLaba=true;
    }
    else
        countLaba =false;
    var indexChanged;
    console.log(r);
    if (r != null){
        indexChanged =getRowIndex(r);
        console.log(indexChanged);
    }
    else {
        indexChanged = 0;
    }
    var i;
    var itemTable= document.getElementById("editpenjualan-ItemTable");
    if (countLaba)
    {
        var TotalLaba = 0;
        var labaTambahanStr;
        var labaTambahan;
        var hpokokStr;
        var hpokok;
        var laba;
    }
    if(indexChanged!=0 && indexChanged!=null){
        var curRow =  itemTable.rows[indexChanged];
     //   var qty = document.getElementById("Editpenjualan-Input-"+indexChanged+"-2").value;
        var qtyStr = curRow.cells[3].children[0].innerHTML;
        var qty = parseInt(qtyStr.replace(',',''));
        var hargaSatuan = document.getElementById("Editpenjualan-Input-"+indexChanged+"-1").value;
        var disc = document.getElementById("Editpenjualan-Input-"+indexChanged+"-2").value;
        //subtotal
        var Subtotal = parseInt((qty * hargaSatuan*(100-disc))/100);
        curRow.cells[7].children[0].innerHTML = "Rp. "+numberWithCommas(Subtotal);

        if(countLaba)
        {
            hpokokStr = curRow.cells[8].children[0].innerHTML.toString().substring(4);
            hpokok = parseInt(hpokokStr.replace(',',''));
            laba = Subtotal - (hpokok*qty);
            curRow.cells[9].children[0].innerHTML = "Rp. "+numberWithCommas(laba);
        }
    }
    var TotalHarga = 0;
    var subtotalTambahanStr;
    var subtotalTambahan;

    for (i=1;i<itemTable.rows.length-1;i++)
    {
        subtotalTambahanStr = itemTable.rows[i].cells[7].children[0].innerHTML.toString().substring(4);
        subtotalTambahan = parseInt(subtotalTambahanStr.replace(',',''));
        TotalHarga += subtotalTambahan;
        if (countLaba)
        {
            labaTambahanStr = itemTable.rows[i].cells[9].children[0].innerHTML.toString().substring(4);
            labaTambahan = parseInt(subtotalTambahanStr.replace(',',''));
            TotalLaba += subtotalTambahan;
        }

    }
    itemTable.rows[itemTable.rows.length-1].cells[2].children[0].innerHTML = "Rp. "+numberWithCommas(TotalHarga);
    if (countLaba)
    {
        itemTable.rows[itemTable.rows.length-1].cells[4].children[0].innerHTML = "Rp. "+numberWithCommas(TotalLaba);
    }
}

function EditPenjualanResetTable()
{
    var tableBody = document.getElementById('Editpenjualan-ItemTable').getElementsByTagName("tbody")[0];
    while (true) {
        if (tableBody.rows.length==0)
            break;
        tableBody.deleteRow(-1);
    }
}
function EditPenjualanEditEntry(penjualanbarangID, row)
{
    EditPenjualanBarang(currentToken,
        penjualanbarangID,
        document.getElementById("Editpembelian-Input-"+row+"-1").value,
        document.getElementById("Editpembelian-Input-"+row+"-2").value,
        function(result){
            if (result.token_status=='success')
            {
                console.log(penjualanbarangID);
            }
        }
    )
}

function EditPenjualanSaveConfirm()
{
    console.log("lala");
    var i;
    var ItemTableBody = document.getElementById("Editpenjualan-ItemTable").getElementsByTagName("tbody")[0];
    var rowNum = ItemTableBody.rows.length;
    console.log(rowNum);
    for (i=1;i<=rowNum;i++)
    {
        console.log(i);
        EditPenjualanEditEntry($(ItemTableBody.rows[i-1].cells[0]).attr("data-id"), i);
    }
}

function InitEditPenjualanPage(curPenjualanID)
{

    currentToken = localStorage.getItem("token");
    setPage("EditPenjualan");
    populateEditPenjualanPage(curPenjualanID)
}