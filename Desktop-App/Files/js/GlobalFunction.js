
var currentToken;

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
    currentToken  = localStorage.getItem("token");
    var pembelianNotif = document.getElementById("PejualanNotif");
    getAllPenjualanData(currentToken, function(result){
        if (result.token_status=="success")
        {
            var jumlahNotif = result.data.length;
            document.getElementById("PenjualanNotifLabel").innerHTML = jumlahNotif.toString();
            for (i = 0; i < result.data.length; i++)
            {
                var TransaksiNama = result.data[i].nama;
                var d = new Date(result.data[i].tanggal_transaksi);
                var TransaksiTanggalTrans = d.getDate()+" "+(d.getMonth()+1).toString()+" "+d.getFullYear();
                d = new Date(result.data[i].jatuh_tempo);
                var TransaksiTanggalJatuh = d.getDate()+"/"+(d.getMonth()+1).toString()+"/"+d.getFullYear();

                var li = document.createElement("li");
                var a = document.createElement("a");
                a.setAttribute("data-toggle", "modal");
                a.setAttribute("data-target", "#NotificationModal");
                a.innerHTML = TransaksiNama +" - "+TransaksiTanggalTrans+" jatuh tempo pada "+TransaksiTanggalJatuh;
                li.appendChild(a);
                pembelianNotif.appendChild(li);
            }
        }
        else {

        }
    });
}
function FillPembelianNotificationList()
{
    var i;
    currentToken  = localStorage.getItem("token");
    var pembelianNotif = document.getElementById("PembelianNotif");
    getAllPembelianData(currentToken, function(result){
        if (result.token_status=="success")
        {
            var jumlahNotif = result.data.length;
            document.getElementById("PembelianNotifLabel").innerHTML = jumlahNotif.toString();
            for (i = 0; i < result.data.length; i++)
            {
                var TransaksiNama = result.data[i].nama;
                var d = new Date(result.data[i].tanggal_transaksi);
                var TransaksiTanggalTrans = d.getDate()+" "+(d.getMonth()+1).toString()+" "+d.getFullYear();
                d = new Date(result.data[i].jatuh_tempo);
                var TransaksiTanggalJatuh = d.getDate()+"/"+(d.getMonth()+1).toString()+"/"+d.getFullYear();

                var li = document.createElement("li");
                var a = document.createElement("a");
                a.setAttribute("data-toggle", "modal");
                a.setAttribute("data-target", "#NotificationModal");
                a.innerHTML = TransaksiNama +" - "+TransaksiTanggalTrans+" jatuh tempo pada "+TransaksiTanggalJatuh;
                li.appendChild(a);
                pembelianNotif.appendChild(li);
            }
        }
        else {

        }
    });
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
    $(document).on("click", "#LogOutBtn", function(){
        Logout(currentToken);
    });
    $(document).on("click", "#MyProfileBtn", function(){
        setPage("MyProfile");
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
    var placeholder = document.getElementsByClassName("alert-placeholder active")[0];
    if (placeholder.hasChildNodes())
        placeholder.removeChild(placeholder.childNodes[0]);
    placeholder.appendChild(container);
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
          //  console.log(scripts);

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

function setWarning(field, message)
{
    var FormGroup=field;
    while(true)
    {
        FormGroup = FormGroup.parentNode;
        if (FormGroup.classList.contains("form-group"))
            break;
    }
    FormGroup.classList.add("has-error");
    var span = document.createElement("span");
    span.setAttribute("class", "help-block");
    span.innerHTML = message;
    FormGroup.appendChild(span);
}

function removeWarning(field)
{
    var FormGroup = field.parentNode;
    FormGroup.classList.remove("has-error");
    FormGroup.getElementsByClassName("help-block")[0].innerHTML = "";
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
    var password = form.elements["password"].value;

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



