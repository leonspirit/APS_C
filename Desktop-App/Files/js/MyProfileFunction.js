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
    var changepass=true;
    if (pass=='' && passconfirm=='')
        changepass=false;
    if (changepass)
    {
        if (pass!=passconfirm)
        {
            setWarning(document.getElementById("ProfilePasswordConfirm"), "Password Tidak Sama");
            valid=false;
        }
    }
    if (valid)
    {
        UpdateDataKaryawan(currentToken, currentID, nama, notelp, alamat, function(result){
            if(result!=null && result.token_status=="success")
            {
                if (result.affectedRows==1)
                {
                    removeWarning();
                    createAlert("success", "Profile Berhasil Diubah");
                    if (changepass)
                    {
                        UpdatePassword(currentToken, currentID, md5(pass), function(result2){
                            if (result2.token_status=='success')
                            {
                                createAlert("success", "Profile dan Password Berhasil Diubah");
                            }
                            else{

                            }
                        });
                    }
                    localStorage.setItem("namaKaryawan",  nama);
                  //  localStorage.setItem("usernameKaryawan",  result['username']);

                    var currentName = localStorage.getItem("namaKaryawan");
               //     var currentUsername = localStorage.getItem("usernameKaryawan");
                    document.getElementById("CurrentKaryawanName").innerHTML = currentName;
                //    document.getElementById("CurrentKaryawanUsername").innerHTML=currentUsername;
                    document.getElementById("NameRightTop").innerHTML=currentName;

                }
            }
            else{
                createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
            }
        });

    }



}
function InitMyProfilePage()
{
    currentToken = localStorage.getItem("token");
    currentID = localStorage.getItem("karyawanID");
    console.log("ini my profile");
    setPage("MyProfile");
    MyProfilepopulateKaryawanDetail();
    document.getElementById("MyProfile-saveBtn").onclick=  function()
    {
        MyProfileEditData();
    }
}
