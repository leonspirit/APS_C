
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
}

