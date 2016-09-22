/**
 * Created by Billy on 14-Sep-16.
 */


var baseUrl = "http://localhost:3000/"

function getQueryKaryawanData(id, nama, noTelp, alamat, userName, hakAkses, fn) {

    var xmlhttp = new XMLHttpRequest();
    var url = baseUrl+"karyawan/list_karyawan";//todo: ganti url

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
function getAllKaryawanData(fn)
{
    var xmlhttp = new XMLHttpRequest();
    var url = baseUrl+"karyawan/list_karyawan";

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            fn(myArr);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function updateDataKaryawan(id, nama, noTelp, alamat, userName, hakAkses, fn)
{

}

//connection.end();