/**
 * Created by Billy on 03-Nov-16.
 */


var currentToken = localStorage.getItem("token");
var currentID = localStorage.getItem("karyawanID");

function populateKaryawanDetail()
{
    DetailKaryawan(currentToken, currentID, function(result)
    {
        if (result.token_status=="success")
        {
            console.log(result);
            document.getElementById("ProfileNama").value = result.data[0].nama;
            document.getElementById("ProfileUsername").value = result.data[0].username;
            document.getElementById("ProfileNoTelp").value = result.data[0].telp;
            document.getElementById("ProfileAlamat").value = result.data[0].alamat;
        }
        else
        {
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}
