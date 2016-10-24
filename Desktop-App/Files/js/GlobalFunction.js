/**
 * Created by Billy on 24-Oct-16.
 */



var currentToken = localStorage.getItem("token");
//Notification
function UpdateUICicilan(Dropdown)
{
    if (Dropdown.value=="giro")
    {
        $('.cara-giro').show();
        $('.cara-transfer').hide();
        $('.cara-tunai').hide();
    }
    else if (Dropdown.value=="transfer")
    {
        $('.cara-giro').hide();
        $('.cara-transfer').show();
        $('.cara-tunai').hide();
    }
    else if (Dropdown.value=="tunai")
    {
        $('.cara-giro').hide();
        $('.cara-transfer').hide();
        $('.cara-tunai').show();
    }
}

function InitNotification()
{

    $('#cara-pilih').on('change', function(){
        UpdateUICicilan(this);
    });
    UpdateUICicilan($('#cara-pilih'));
    $("#cicilan-tanggal-pencairan").datepicker({
        autoclose:true
    });
    $("#cicilan-tanggal-transaksi").datepicker({
        autoclose:true
    });
    FillPenjualanNotificationList();
    FillPembelianNotificationList();
}
function FillPenjualanNotificationList()
{
    var i;
    var penjualanNotif = document.getElementById("PenjualanNotif");
    var jumlahNotif = 10;
    document.getElementById("PenjualanNotifLabel").innerHTML = jumlahNotif.toString();
    for (i=0;i<jumlahNotif;i++)
    {
        var TransaksiNama = "Andi";
        var TransaksiTanggalTrans = "10/09/16";
        var TransaksiTanggalJatuh = "10/10/16";

        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("data-toggle", "modal");
        a.setAttribute("data-target", "#modalNotification");
        a.innerHTML = TransaksiNama +" - "+TransaksiTanggalTrans+" jatuh tempo pada "+TransaksiTanggalJatuh;
        li.appendChild(a);
        penjualanNotif.appendChild(li);
    }
}
function FillPembelianNotificationList()
{
    var i;
    var pembelianNotif = document.getElementById("PembelianNotif");
    var jumlahNotif = 10;
    document.getElementById("PembelianNotifLabel").innerHTML = jumlahNotif.toString();
    for (i=0;i<jumlahNotif;i++)
    {
        var TransaksiNama = "Budi";
        var TransaksiTanggalTrans = "11/09/16";
        var TransaksiTanggalJatuh = "11/10/16";

        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("data-toggle", "modal");
        a.setAttribute("data-target", "#modalNotification");
        a.innerHTML = TransaksiNama +" - "+TransaksiTanggalTrans+" jatuh tempo pada "+TransaksiTanggalJatuh;
        li.appendChild(a);
        pembelianNotif.appendChild(li);
    }
}

function Logout(token)
{
    myUserLogout(token, function(result){
        console.log("success Logout")
    });
}

function InitUserPanel()
{
    $(document).on("click", "#ButtonUserLogout", function(){
        Logout(currentToken);
    });
}


