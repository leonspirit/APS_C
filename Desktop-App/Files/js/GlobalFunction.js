
var currentToken;

var NamaBulan = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//konversi
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRowIndex(item)
{
    var node = item;
    while(true)
    {
        console.log(node.tagName);
        if (node.tagName == "TR")
        {
            return node.rowIndex;
        }
        if (node.tagName == "TR")
        {
            return -9999;
        }
        else {
            node=node.parentNode;
        }
    }
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
    FillPenjualanNotificationList();
    FillPembelianNotificationList();
}
function FillPenjualanNotificationList()
{
    var i;
    $("#PenjualanNotif").empty();
    currentToken  = localStorage.getItem("token");
    var penjualanNotif = document.getElementById("PenjualanNotif");
    getJatuhTempoPenjualanData(currentToken, 3, function(result){
        if (result.token_status=="success")
        {
            var jumlahNotif = result.data.length;
            document.getElementById("PenjualanNotifLabel").innerHTML = jumlahNotif.toString();
            for (i = 0; i < result.data.length; i++)
            {
                var TransaksiNama = result.data[i].pelangganNama;
                var d = new Date(result.data[i].tanggal_transaksi);
                var TransaksiTanggalTrans = d.getDate()+"/"+(d.getMonth()+1).toString()+"/"+d.getFullYear();
                d = new Date(result.data[i].jatuh_tempo);
                var TransaksiTanggalJatuh = d.getDate()+"/"+(d.getMonth()+1).toString()+"/"+d.getFullYear();

                var li = document.createElement("li");
                var a = document.createElement("a");
                a.setAttribute("data-toggle", "modal");
                a.setAttribute("data-target", "#NotificationModal");
                a.setAttribute("onclick", "PopulateNotificationModal('jual', "+result.data[i].penjualanID +")");
                a.innerHTML = TransaksiNama +" - "+TransaksiTanggalTrans+" jatuh tempo pada "+TransaksiTanggalJatuh;
                li.appendChild(a);
                penjualanNotif.appendChild(li);
            }
        }
        else {

        }
    });
}
function FillPembelianNotificationList()
{
    var i;
    $("#PembelianNotif").empty();
    currentToken  = localStorage.getItem("token");
    var pembelianNotif = document.getElementById("PembelianNotif");
    getJatuhTempoPembelianData(currentToken, 3, function(result){
        if (result.token_status=="success")
        {
            var jumlahNotif = result.data.length;
            document.getElementById("PembelianNotifLabel").innerHTML = jumlahNotif.toString();
            for (i = 0; i < result.data.length; i++)
            {
                var TransaksiNama = result.data[i].supplierNama;
                var d = new Date(result.data[i].tanggal_transaksi);
                var TransaksiTanggalTrans = d.getDate()+"/"+(d.getMonth()+1).toString()+"/"+d.getFullYear();
                d = new Date(result.data[i].jatuh_tempo);
                var TransaksiTanggalJatuh = d.getDate()+"/"+(d.getMonth()+1).toString()+"/"+d.getFullYear();

                var li = document.createElement("li");
                var a = document.createElement("a");
                a.setAttribute("data-toggle", "modal");
                a.setAttribute("data-target", "#NotificationModal");
                a.setAttribute("onclick", "PopulateNotificationModal('beli', "+result.data[i].pembelianID +")");
                a.innerHTML = TransaksiNama +" - "+TransaksiTanggalTrans+" jatuh tempo pada "+TransaksiTanggalJatuh;
                li.appendChild(a);
                pembelianNotif.appendChild(li);
            }
        }
        else {

        }
    });
}
function PopulateNotificationModal(jenis, id)
{
    $("#NotificationModal-PembayaranSelect").select2({
        minimumResultsForSearch:Infinity
    });
    $('#NotificationModal-PembayaranSelect').on('change', function(){
        UpdateUICicilan(this);
    });
    UpdateUICicilan($('#NotificationModal-PembayaranSelect'));
    $("#NotificationModal-CicilanTanggalPencairanDate").datepicker({
        dateFormat:'yy-mm-dd',
        autoclose:true
    });
    $("#NotificationModal-CicilanTanggalTransaksiDate").datepicker({
        dateFormat:'yy-mm-dd',
        autoclose:true
    });
    currentToken  = localStorage.getItem("token");
    if (jenis=="jual")
    {
        document.getElementById("NotificationModalType").innerHTML = "Penjualan";
        GetDetailPenjualan(currentToken, id, function(result){
            if (result.token_status=="success")
            {
                var penjualan= result.data[0];
                var TglTransaksi = new Date(penjualan.tanggal_transaksi);
                var TglTransaksiText = TglTransaksi.getDate()+" "+NamaBulan[TglTransaksi.getMonth()]+" "+TglTransaksi.getFullYear();

                var JatuhTempo = new Date(penjualan.jatuh_tempo);
                var JatuhTempoText = JatuhTempo.getDate()+" "+NamaBulan[JatuhTempo.getMonth()]+" "+JatuhTempo.getFullYear();
                document.getElementById("NotificationModal-NamatanggalLink").innerHTML =penjualan.nama+" "+TglTransaksiText;
                document.getElementById("NotificationModal-JatuhtempoText").innerHTML =JatuhTempoText;
                document.getElementById("NotificationModal-TotalText").innerHTML ="Rp. "+numberWithCommas(penjualan.subtotal);
                document.getElementById("NotificationModal-NamatanggalLink").onclick=function()
                {
                    InitDetailPenjualanPage(id);
                    $("#NotificationModal").modal('toggle');
                };
            }
            else {

            }
        })
    }
    else if (jenis=="beli")
    {
        document.getElementById("NotificationModalType").innerHTML = "Pembelian";
        GetDetailPembelian(currentToken, id, function(result){
            if (result.token_status=="success")
            {
                var pembelian = result.data[0];
                var TglTransaksi = new Date(pembelian.tanggal_transaksi);
                var TglTransaksiText = TglTransaksi.getDate()+" "+NamaBulan[TglTransaksi.getMonth()]+" "+TglTransaksi.getFullYear();

                var JatuhTempo = new Date(pembelian.jatuh_tempo);
                var JatuhTempoText = JatuhTempo.getDate()+" "+NamaBulan[JatuhTempo.getMonth()]+" "+JatuhTempo.getFullYear();
                document.getElementById("NotificationModal-NamatanggalLink").innerHTML =pembelian.nama+" "+TglTransaksiText;
                document.getElementById("NotificationModal-JatuhtempoText").innerHTML =JatuhTempoText;
                document.getElementById("NotificationModal-TotalText").innerHTML ="Rp. "+numberWithCommas(pembelian.subtotal);
                document.getElementById("NotificationModal-NamatanggalLink").onclick=function()
                {
                    InitDetailPembelianPage(id);
                    $("#NotificationModal").modal('toggle');
                };
            }
            else {

            }
        })
    }
    document.getElementById("NotificationModal-ConfirmButton").onclick = function()
    {
        AddCicilan(jenis, id);
    }
}

function AddCicilan(tipe, id)
{
    var formdata = document.getElementById("NotificationModal-CicilanForm");
    var carabayar  =$("#NotificationModal-PembayaranSelect").val();
    var nominal = formdata.elements['nominal'].value;
    var notes=formdata.elements['notes'].value;
    var tanggalTransTemp = new Date($("#NotificationModal-CicilanTanggalTransaksiDate").datepicker().val());
    var tanggalTrans = tanggalTransTemp.getFullYear()+"-"+tanggalTransTemp.getMonth()+"-"+tanggalTransTemp.getDate();
    var nomorgiro=null, bank=null, tanggalPencairan=null;
    if (carabayar=='giro')
    {
        var tanggalpencariantemp = new Date($("#NotificationModal-CicilanTanggalPencarianDate").datepicker().val());
        tanggalPencairan = tanggalpencariantemp.getFullYear()+"-"+(tanggalpencariantemp.getMonth()+1)+"-"+tanggalpencariantemp.getDate();
        nomorgiro = formdata.elements['nomor-giro'].value;
        bank = formdata.elements['bank-giro'].value;
    }
    else if (carabayar == 'transfer')
    {
        nomorgiro = null;
        tanggalPencairan = null;
        bank=formdata.elements['bank-transfer'].value;
    }
    else if (carabayar=='tunai')
    {
        bank=null;
        nomorgiro=null;
        tanggalPencairan = null;
    }
    if (tipe=='jual')
    {
        AddCicilanPenjualan(currentToken,
            id,
            tanggalTrans,
            nominal,
            notes,
            carabayar,
            bank,
            nomorgiro,
            tanggalPencairan, function(result)
            {
                if (result.token_status=="success")
                {
                    console.log(result.cicilanpenjualanID);
                    $("#NotificationModal").modal('toggle');
                }
            }
        )
    }
    else if (tipe=='beli')
    {
        AddCicilanPembelian(currentToken,
            id,
            tanggalTrans,
            nominal,
            notes,
            carabayar,
            bank,
            nomorgiro,
            tanggalPencairan, function(result)
            {
                if (result.token_status=="success")
                {
                    console.log(result.cicilanpembelianID);
                    $("#NotificationModal").modal('toggle');
                }
            }
        )
    }
}

//user
function Logout(token)
{
    myUserLogout(token, function(result){
        console.log("success Logout");

        document.body.classList.remove("skin-blue-light");
        document.body.classList.remove("sidebar-mini");
        document.body.classList.add("login-page");
        document.getElementsByClassName("wrapper")[0].classList.remove("is-shown");
        document.getElementsByClassName("login-box")[0].classList.add("is-shown");

        localStorage.clear();
        $("section.content").remove();
        var navigation = document.getElementsByClassName("sidebar-menu")[0];
        while (navigation.hasChildNodes()) {
            navigation.removeChild(navigation.lastChild);
        }
        $("script.optional-script").remove();
        document.getElementById("LoginButton").onclick= function()
        {
            myLogin();
        };
        //todo: clear section sm navmenu di halaman
    });
}
function InitUserPanel()
{
    var currentName = localStorage.getItem("namaKaryawan");
    var currentUsername = localStorage.getItem("usernameKaryawan");
   // var NamaText = document.createElement("span");
   // NamaText.innerHTML = currentName;
   // var UsernameText = document.createElement("small");
    //UsernameText.innerHTML=currentUsername;
    document.getElementById("CurrentKaryawanName").innerHTML = currentName;
    document.getElementById("CurrentKaryawanUsername").innerHTML=currentUsername;
    document.getElementById("NameRightTop").innerHTML=currentName;
    document.getElementById("LogOutBtn").onclick = function(){
        Logout(currentToken);
    };
    document.getElementById("MyProfileBtn").onclick= function(){
        InitMyProfilePage();
    };
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
    var placeholder = document.getElementsByClassName("alert-placeholder active")[0];
    if (placeholder.hasChildNodes())
        placeholder.removeChild(placeholder.childNodes[0]);
    placeholder.appendChild(container);
}

function removeAllAlert()
{
    $("div.alert.alert-dismissable").remove();
}
function InitNavMenu()
{
    console.log("initnav");
    var HakAksesList = JSON.parse(localStorage.getItem("hak_akses"));
    var FullPages= ["StokBarang", "LaporanPenjualan", "LaporanPembelian", "PenjualanBaru", "PembelianBaru", "Piutang", "Hutang", "DaftarPelanggan", "DaftarKaryawan", "DaftarSupplier"];
    var li, a, img, span, i;
    var sidebarMenu = document.getElementsByClassName("sidebar-menu")[0];
    for (i=0;i<FullPages.length;i++)
    {
        if ($.inArray(FullPages[i], HakAksesList)!=-1)
        {
            console.log("iiii"+i);
            li = document.createElement("li");
            a = document.createElement("a");
            li.setAttribute("class", "nav-section");
            li.setAttribute("id", "nav-section-"+FullPages[i]);
            a.setAttribute("onclick", "Init"+FullPages[i]+"Page();");
            img = document.createElement("img");
            img.setAttribute("style", "margin-right:10px");
            img.setAttribute("src", "icons/"+FullPages[i]+".png");
            span = document.createElement("span");
            span.innerHTML = FullPages[i]
                .match(/^(?:[^A-Z]+)|[A-Z](?:[^A-Z]*)+/g)
                .join(" ")
                .toLowerCase()
                .replace(/^[a-z]/, function(v) {
                    return v.toUpperCase();
                });
            a.appendChild(img);
            a.appendChild(span);
            li.appendChild(a);
            sidebarMenu.appendChild(li);
        }
    }
}
function setPage(page)
{
    var i;
    InitNotification();
    removeAllAlert();
    removeWarning();
    var allContent = document.getElementsByClassName("content");
    for (i=0;i<allContent.length;i++)
        allContent[i].classList.remove("is-shown");
    var allNav = document.getElementsByClassName("nav-section");
    for (i=0;i<allNav.length;i++)
        allNav[i].classList.remove("active");
    var navSection = document.querySelector("#nav-section-"+page);
    if (navSection!=null)
    navSection.classList.add("active");
    document.querySelector("#section-"+page).classList.add("is-shown");
    document.getElementById("page-title").innerHTML = page
        .match(/^(?:[^A-Z]+)|[A-Z](?:[^A-Z]*)+/g)
        .join(" ")
        .toLowerCase()
        .replace(/^[a-z]/, function(v) {
            return v.toUpperCase();
        });

    var allAlertPlace = document.getElementsByClassName("alert-placeholder");
    for (i=0;i<allAlertPlace.length;i++)
        allAlertPlace[i].classList.remove("active");
    document.getElementById("section-"+page).getElementsByClassName("alert-placeholder")[0].classList.add("active");

}

function ImportSectionsAndModals() {

    console.log("initimport");
    var FullPages= ["StokBarang", "LaporanPenjualan", "LaporanPembelian", "PenjualanBaru", "PembelianBaru", "Piutang", "Hutang", "DaftarPelanggan", "DaftarKaryawan", "DaftarSupplier"];

    const links = document.querySelectorAll('link[rel="import"]');
    var template, clone;
    Array.prototype.forEach.call(links, function (link) {
        if (link.href.match("sections/"))
        {
            template = link.import.querySelector('.section-template');
            clone = document.importNode(template.content, true);
            document.querySelector('.content-wrapper').appendChild(clone);
            var scripts = link.import.querySelectorAll('link');

            Array.prototype.forEach.call(scripts, function(script){
                var scriptpath = script.getAttribute("data-path");
                var existing = document.querySelector('script[src="'+scriptpath+'"]');
                if (existing == null)
                {
                    var scripttag = document.createElement("script");
                    scripttag.setAttribute("class", "optional-script");
                    scripttag.setAttribute("src", scriptpath);
                    document.body.appendChild(scripttag);
                }
            })
        }
        else if (link.href.match("modals/")) {

            template = link.import.querySelector('.modal-template');
            clone = document.importNode(template.content, true);
            document.querySelector('.content-modal').appendChild(clone);
        }
    });
}

function setWarning(field, message) {
    var FormGroup = field;
    while (true) {
        if (FormGroup.tagName =="BODY")
            break;
        if (FormGroup.classList.contains("form-group"))
            break;
        FormGroup = FormGroup.parentNode;
    }
   // FormGroup.classList.add("has-error");
    var spannya = FormGroup.getElementsByClassName("help-block");
    if (spannya == null || spannya.length == 0)
    {
        var span = document.createElement("span");
        span.setAttribute("class", "help-block");
        span.setAttribute("style","color:red;");
        span.innerHTML = message;
        FormGroup.appendChild(span);

    }
}
function removeThisWarning(field)
{
    var FormGroup = field;
    while (true) {
        if (FormGroup.tagName =="BODY")
            break;
        if (FormGroup.classList.contains("form-group")/* && FormGroup.classList.contains("has-error")*/)
            break;
        FormGroup = FormGroup.parentNode;
    }
  //  FormGroup.classList.remove("has-error");
    var spannya = FormGroup.getElementsByClassName("help-block");
    var i;
    for (i=0;i<spannya.length;i++) {
        FormGroup.removeChild(spannya[i]);
    }
}

function removeWarning()
{

    $("span.help-block").remove();
   /* var i, j;
    var form_group = document.getElementsByClassName("form-group");
    for (i=0;i<form_group.length;i++)
    {
        //form_group[i].classList.remove("has-error");
        var span = form_group[i].getElementsByClassName("help-block");
        for (j=0;j<span.length;j++)
            form_group[i].removeChild(span[j]);
    }*/
}
function CheckLogin()
{

    var ID = localStorage.getItem("karyawanID");
    var hak_akses = localStorage.getItem("hak_akses");
    var token = localStorage.getItem("token");
    var nama = localStorage.getItem("namaKaryawan");
    var username = localStorage.getItem("usernameKaryawan");
    if (ID != null && hak_akses!=null && token!=null && nama!=null && username!=null)
    {
        document.body.classList.add("skin-blue-light");
        document.body.classList.add("sidebar-mini");
        document.body.classList.remove("login-page");
        document.getElementsByClassName("wrapper")[0].classList.add("is-shown");
        document.getElementsByClassName("login-box")[0].classList.remove("is-shown");

        var form = document.getElementById("LoginForm");
        form.reset();

        InitNavMenu();
        InitUserPanel();
        ImportSectionsAndModals();

        setTimeout(function(){
            InitNotification();
            var allNav = document.getElementsByClassName("nav-section");
            allNav[0].children[0].click();
        }, 1000);
        return true;
    }
    else
        return false;

}

function myLogin()
{
    var form = document.getElementById("LoginForm");
    var userName = form.elements["username"].value;
    var password = md5(form.elements["password"].value);

    console.log(userName+" "+password);
    myUserLogin(userName, password, function(result){
        console.log(result['num_rows']);
        if(result['num_rows']==1)
        {
            var karID = result['karyawanID'].toString();
            var i;

            var hak_akses = [];
            var akses = result['hak_akses'];
            for (i=0;i<akses.length;i++)
            {
                hak_akses.push(akses[i].nama);
            }

            var token = result['token'].toString();

            localStorage.setItem("karyawanID", karID);
            localStorage.setItem("hak_akses", JSON.stringify(hak_akses));
            localStorage.setItem("token",  token);
            localStorage.setItem("namaKaryawan",  result['nama']);
            localStorage.setItem("usernameKaryawan",  result['username']);

            document.body.classList.add("skin-blue-light");
            document.body.classList.add("sidebar-mini");
            document.body.classList.remove("login-page");
            document.getElementsByClassName("wrapper")[0].classList.add("is-shown");
            document.getElementsByClassName("login-box")[0].classList.remove("is-shown");

            form.reset();

            InitNavMenu();
            InitUserPanel();
            ImportSectionsAndModals();

            setTimeout(function(){
                InitNotification();
                var allNav = document.getElementsByClassName("nav-section");
                allNav[0].children[0].click();
            }, 1000);

        }
        else
        {
            console.log("login gagal");
        }
    });
}

function hasHakAkses(hakakses)
{
    var HakAksesList = JSON.parse(localStorage.getItem("hak_akses"));
    if ($.inArray(hakakses, HakAksesList)!=-1)
    {
        return true;
    }
    else{
        return false
    }
}



