/**
 * Created by Billy on 14-Sep-16.
 */


var baseUrl = "http://localhost:3000/"

function getQueryPelanganData(id, nama, noTelp, alamat,  fn) {

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
function getAllPelangganData(fn)
{
    var xmlhttp = new XMLHttpRequest();
    var url = baseUrl+"pelanggan/list_pelanggan";

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
function updateDataPelanggan(id, nama, noTelp, alamat,  fn){

}
//connection.end();