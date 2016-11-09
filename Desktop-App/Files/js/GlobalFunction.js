/**
 * Created by Billy on 24-Oct-16.
 */
var currentToken = localStorage.getItem("token");
var currentName = localStorage.getItem("namaKaryawan");
var currentUsername = localStorage.getItem("usernameKaryawan");
//konversi
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
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
        dateFormat:'yy-mm-dd',
        autoclose:true
    });
    $("#cicilan-tanggal-transaksi").datepicker({
        dateFormat:'yy-mm-dd',
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
//user
function Logout(token)
{
    myUserLogout(token, function(result){
        console.log("success Logout");
        window.location.href= "../index.html/";
    });
}

function InitUserPanel()
{

    var NamaText = document.createElement("span");
    NamaText.innerHTML = currentName;
    var UsernameText = document.createElement("small");
    UsernameText.innerHTML=currentUsername;
    document.getElementById("CurrentKaryawanName").appendChild(NamaText);
    document.getElementById("CurrentKaryawanName").appendChild(UsernameText);
    document.getElementById("NameRightTop").innerHTML=currentName;
    $(document).on("click", "#ButtonUserLogout", function(){
        Logout(currentToken);
    });
}
//alert
function createAlert(type, message)
{
    var container = document.createElement("div");
    container.setAttribute("class", "alert alert-"+type+" alert-dismissable");
    var closeButton  = document.createElement("Button");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("class", "close");
    closeButton.setAttribute("data-dismiss", "alert");
    closeButton.setAttribute("arie-hidden", "true");
    closeButton.innerHTML="&times;";
    container.appendChild(closeButton);
    container.innerHTML += message;
    var placeholder = document.getElementById("alert-placeholder");
    if (placeholder.hasChildNodes())
        placeholder.removeChild(placeholder.childNodes[0]);
    placeholder.appendChild(container);

}
function generateMenu(curPage, HakAksesList)
{
    console.log(HakAksesList);
    var FullPages= ["StokBarang", "LaporanPenjualan", "LaporanPembelian", "PenjualanBaru", "PembelianBaru", "Piutang", "Hutang", "DaftarPelanggan", "DaftarKaryawan", "DaftarSupplier"];
    var li, a, img, span, i;

    var sidebarMenu = document.getElementsByClassName("sidebar-menu")[0];

    for (i=0;i<FullPages.length;i++)
    {
        if ($.inArray(FullPages[i], HakAksesList)!=-1)
        {
            li = document.createElement("li");
            if (curPage == FullPages[i])
                li.setAttribute("class", "active");
            a = document.createElement("a");
            a.setAttribute("href", FullPages[i]+".html");
            img = document.createElement("img");
            img.setAttribute("style", "margin-right:10px");
            img.setAttribute("src", "../icons/"+FullPages[i]+".png");
            span = document.createElement("span");
            var PageName = FullPages[i]
                .match(/^(?:[^A-Z]+)|[A-Z](?:[^A-Z]*)+/g)
                .join(" ")
                .toLowerCase()
                .replace(/^[a-z]/, function(v) {
                    return v.toUpperCase();
                });
            span.innerHTML = PageName;
            a.appendChild(img);
            a.appendChild(span);
            li.appendChild(a);
            sidebarMenu.appendChild(li);

        }
    }
}


