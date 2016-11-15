
/**
 * Created by Billy on 13-Nov-16.
 */


function ReturPenjualanAddRow()
{
    var tableBody = document.getElementById('Returpembelian-ItemTable').getElementsByTagName("tbody")[0];

    var rowCount = tableBody.rows.length;
    var row = tableBody.insertRow(rowCount);
    var rowNum = rowCount+1;

    var cell1 = row.insertCell(0);
    cell1.innerHTML = rowNum.toString();


    var cell2 = row.insertCell(1);
   /* cell2.setAttribute("style", "padding:0");
    var inputBarang = document.createElement("input");
    inputBarang.setAttribute("id", "Pembelianbaru-Input-"+rowNum.toString()+"-1");
    inputBarang.setAttribute("style", "width:100%;");
    inputBarang.setAttribute("onchange", "PembelianBaruGetSatuanBarangList(this);");
    inputBarang.setAttribute("class", "barang-select2 form-control");
    cell2.appendChild(inputBarang);
    $("#Pembelianbaru-Input-"+rowNum.toString()+"-1").select2({
        data: DataBarang,
        placeholder:"-- Pilih Barang --",
        allowClear:true
    });*/

    var cell5  =row.insertCell(2);
    cell5.setAttribute("id", "Returpembelian-IsiboxText-"+rowNum.toString());

    var cell3 = row.insertCell(3);
    cell3.setAttribute("style", "padding:0");
    var inputJumlah = document.createElement("input");
    inputJumlah.setAttribute("id", "Pembelianbaru-Input-"+rowNum.toString()+"-2");
    inputJumlah.setAttribute("class", "form-control");
    inputJumlah.setAttribute("type", "number");
    inputJumlah.setAttribute("min", "0");
    inputJumlah.setAttribute("style", "width:100%;");
    inputJumlah.setAttribute("onchange", "PembelianBaruDrawTable(this);");
    cell3.appendChild(inputJumlah);

    var cell4 = row.insertCell(4);
    cell4.setAttribute("style", "padding:0");
    var  inputSatuan = document.createElement("input");
    inputSatuan.setAttribute("class", "form-control satuan-select2");
    inputSatuan.setAttribute("id", "Pembelianbaru-Input-"+rowNum.toString()+"-3");
    inputSatuan.setAttribute("style", "width:100%;");
    cell4.appendChild(inputSatuan);
    $("#Pembelianbaru-Input-"+rowNum.toString()+"-3").select2({
        minimumResultsForSearch:Infinity,
        placeholder:"-- Pilih Unit --",
        allowClear:true
    });


    var cell6 = row.insertCell(5);
    cell6.setAttribute("style", "padding:0;");
    var  inputHargaContainer = document.createElement("div");
    inputHargaContainer.setAttribute("class", "input-group");
    inputHargaContainer.setAttribute("style", "width:100%");
    var inputHargaLabel = document.createElement("span");
    inputHargaLabel.setAttribute("class", "input-group-addon");
    inputHargaLabel.innerHTML = "Rp.";
    var inputHarga = document.createElement("input");
    inputHarga.setAttribute("id","Pembelianbaru-Input-"+rowNum.toString()+"-4");
    inputHarga.setAttribute("type", "number");
    inputHarga.setAttribute("class", "form-control");
    inputHarga.setAttribute("onchange", "PembelianBaruDrawTable(this.parentNode);");
    inputHargaContainer.appendChild(inputHargaLabel);
    inputHargaContainer.appendChild(inputHarga);
    cell6.appendChild(inputHargaContainer);

    var cell7 = row.insertCell(6);
    cell7.setAttribute("style", "padding:0;");
    var  inputDiscContainer1 = document.createElement("div");
    inputDiscContainer1.setAttribute("class", "input-group");
    inputDiscContainer1.setAttribute("style", "width:100%");
    var inputDisc1 = document.createElement("input");
    inputDisc1.setAttribute("id","Pembelianbaru-Input-"+rowNum.toString()+"-5");
    inputDisc1.setAttribute("type", "number");
    inputDisc1.setAttribute("min", "0");
    inputDisc1.setAttribute("max", "100");
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
    inputDisc2.setAttribute("id","Pembelianbaru-Input-"+rowNum.toString()+"-6");
    inputDisc2.setAttribute("type", "number");
    inputDisc2.setAttribute("min", "0");
    inputDisc2.setAttribute("max", "100");
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
    inputDisc3.setAttribute("id","Pembelianbaru-Input-"+rowNum.toString()+"-7");
    inputDisc3.setAttribute("type", "number");
    inputDisc3.setAttribute("min", "0");
    inputDisc3.setAttribute("max", "100");
    inputDisc3.setAttribute("class", "form-control");
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


function InitReturPenjualanPage(penjualanID)
{
    setPage("ReturPenjualan");

}
