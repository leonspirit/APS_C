/**
 * Created by Billy on 13-Nov-16.
 */


function EditPenjualanAddRow()
{
    var tableBody = document.getElementById('Editpenjualan-ItemTable').getElementsByTagName("tbody")[0];

    var rowCount = tableBody.rows.length;
    var row = tableBody.insertRow(rowCount);
    var rowNum = rowCount+1;

    var cell1 = row.insertCell(0);
    cell1.innerHTML = rowNum.toString();

    var cell2 = row.insertCell(1);
   /* cell2.setAttribute("style", "padding:0");
    var inputBarang = document.createElement("input");
    inputBarang.setAttribute("id", "Penjualanbaru-Input-"+rowNum.toString()+"-1");
    inputBarang.setAttribute("style", "width:100%;");
    inputBarang.setAttribute("onchange", "PenjualanBaruGetSatuanBarangList(this);PenjualanBaruDrawTable(this);");
    inputBarang.setAttribute("class", "barang-select2 form-control input-sm");
    cell2.appendChild(inputBarang);
    $("#Penjualanbaru-Input-"+rowNum.toString()+"-1").select2({
        data: DataBarang,
        placeholder:"-- Pilih Barang --",
        allowClear:true
    });*/

    var cell5 = row.insertCell(2);
    cell5.setAttribute("id", "Penjualanbaru-IsiboxText-"+rowNum.toString());

    var cell3 = row.insertCell(3);
   /* cell3.setAttribute("style", "padding:0");
    var inputJumlah = document.createElement("input");
    inputJumlah.setAttribute("id", "Penjualanbaru-Input-"+rowNum.toString()+"-2");
    inputJumlah.setAttribute("class", "form-control");
    inputJumlah.setAttribute("type", "number");
    inputJumlah.setAttribute("min", "0");
    inputJumlah.setAttribute("style", "width:100%;");
    inputJumlah.setAttribute("onchange", "PenjualanBaruDrawTable(this,true);");
    cell3.appendChild(inputJumlah);*/

    var cell4 = row.insertCell(4);
  /*  cell4.setAttribute("style", "padding:0");
    var inputSatuan = document.createElement("input");
    inputSatuan.setAttribute("style", "width:100%");
    inputSatuan.setAttribute("onchange", "PenjualanBaruGetHargaUnitSatuan(this);PenjualanBaruDrawTable(this);");
    inputSatuan.setAttribute("class", "form-control input-sm");
    inputSatuan.setAttribute("id", "Penjualanbaru-Input-"+rowNum.toString()+"-3");
    cell4.appendChild(inputSatuan);
    $("#Penjualanbaru-Input-"+rowNum.toString()+"-3").select2({
        minimumResultsForSearch:Infinity,
        placeholder:"-- Pilih Unit --",
        allowClear:true
    });*/

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
    inputHarga.setAttribute("onchange", "PenjualanBaruDrawTable(this.parentNode);");
    inputHarga.setAttribute("class", "form-control");
    inputHarga.setAttribute("id", "Penjualanbaru-Input-"+rowNum.toString()+"-4");
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
    inputDisc.setAttribute("id", "Penjualanbaru-Input-"+rowNum.toString()+"-5");
    inputDisc.setAttribute("onchange", "PenjualanBaruDrawTable(this.parentNode);");
    inputDiscGroup.appendChild(inputDisc);
    inputDiscGroup.appendChild(inputDiscAddOn);
    cell8.appendChild(inputDiscGroup);

    var cell9 = row.insertCell(7);
    var subtotal = document.createElement("span");
    subtotal.setAttribute("class", "pull-right");
    subtotal.innerHTML = "Rp. 0";
    cell9.appendChild(subtotal);

   // var celldelButton;
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
    //    celldelButton = row.insertCell(10);
    }
    else {
     //   celldelButton = row.insertCell(8);
    }

}

function populateEditPenjualanPage(ID)
{
    GetDetailPenjualan(currentToken, ID, function(result)
    {
        var penjualan = result.data[0];

        var i;
        for (i=0;i<penjualan.barang.length;i++)
        {
            EditPenjualanAddRow(penjualan.barang[i]);
        }
    });
}

function InitEditPenjualanPage(curPenjualanID)
{

    currentToken = localStorage.getItem("token");
    setPage("EditPenjualan");
    populateEditPenjualanPage(curPenjualanID)
}