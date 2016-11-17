/**
 * Created by Billy on 03-Nov-16.
 */


var currentToken;// = localStorage.getItem("token");
var currentID;// = localStorage.getItem("karyawanID");

function MyProfilepopulateKaryawanDetail()
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

function MyProfileChangePassword()
{

}
function MyProfileEditData()
{
    var nama = document.getElementById("ProfileNama").value;
   // var username = document.getElementById("ProfileUsername").value;
    var notelp = document.getElementById("ProfileNoTelp").value;
    var alamat = document.getElementById("ProfileAlamat").value;
    var pass = document.getElementById("ProfilePassword").value;
    var passconfirm = document.getElementById("ProfilePasswordConfirm").value;
    var valid=true;
    if (nama==null || nama=="")
    {
        valid=false;
        setWarning(document.getElementById("ProfileNama"), "Nama Tidak Boleh Kosong");
    }
   /* if (username==null || username.isEmpty())
    {
        valid=false;
        setWarning(document.getElementById("ProfileUsername"), "Username Tidak Boleh Kosong");
    }*/
    if (valid)
    {
        UpdateDataKaryawan(currentToken, currentID, nama, notelp, alamat, function(result){
            if(result!=null && result.token_status=="success")
            {
                if (result.affectedRows==1)
                {
                    createAlert("success", "Profile Berhasil Diubah");
                }
            }
            else{
                createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
            }
        })
    }
    if (pass!=null && pass!='' && passconfirm!=null && passconfirm!='')
    {
        if (pass!=passconfirm)
        {
            valid =false;
            setWarning(document.getElementById("ProfilePasswordConfirm"), "Password Tidak Sama");
        }
        else {

        }

    }

}
function InitMyProfilePage()
{
    currentToken = localStorage.getItem("token");
    currentID = localStorage.getItem("karyawanID");
    console.log("ini my profile");
    setPage("MyProfile");
    MyProfilepopulateKaryawanDetail();
}
