/**
 * Created by Billy on 14-Sep-16.
 */

var baseUrl = "http://localhost:3000/"

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}


function getQueryPembelianData(kode, nama, stokMin, stokMax, hJualMin, hJualMax, hPokokMin, hPokokMax, fn) {

    var xmlhttp = new XMLHttpRequest();
    var url = baseUrl;//todo: ganti url

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            // myFunction(myArr);
            fn(myArr);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}
function getAllPembelianData(fn)
{
    var xmlhttp = new XMLHttpRequest();
    var url = baseUrl;

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
           // myFunction(myArr);
            fn(myArr);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//connection.end();