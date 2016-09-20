/**
 * Created by Billy on 14-Sep-16.
 */


var baseUrl = "http://localhost:3000/"


function getQueryPenjualanData(kode, nama, stokMin, stokMax, hJualMin, hJualMax, hPokokMin, hPokokMax, fn) {

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
function getAllPenjualanData(fn)
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